import {
  LoaderFunction,
  useLoaderData,
  Form,
  ActionFunction,
  redirect,
} from 'remix';
import { User } from '@supabase/supabase-js';
import slug from 'slug';
import { AppLayout } from '~/components/AppLayout';
import { getUserByRequestToken, isAuthenticated } from '~/lib/auth';
import { supabase } from '~/lib/supabase/supabase.server';
import { sendInviteEmailToStudent } from '~/lib/nodemailer/nodemailer.server';

export const loader: LoaderFunction = async ({ request, params }) => {
  // checar se o cara autenticado é um professor
  // se não for, redirecionar

  if (!(await isAuthenticated(request))) return redirect('/login');
  const { user } = await getUserByRequestToken(request);

  const { data: professorUser, error } = await supabase
    .from('user')
    .select('*, role!inner(*)')
    .match({ id: user.id, 'role.name': 'PROFESSOR' })
    .single();

  if (!professorUser || error) {
    return redirect('/salas');
  }

  return { user: professorUser };
};

export const action: ActionFunction = async ({ request, params }) => {
  if (!(await isAuthenticated(request))) return redirect('/login');
  const { user } = await getUserByRequestToken(request);

  const { data: professorUser, error } = await supabase
    .from('user')
    .select('*, role!inner(*)')
    .match({ id: user.id, 'role.name': 'PROFESSOR' })
    .single();

  console.log('error', error);

  const body = await request.formData();

  const { data: foundStudent, error: findUserByEmailError } = await supabase
    .from('user')
    .select('*')
    .match({ email: body.get('student_email') })
    .single();

  if (!foundStudent || findUserByEmailError) {
    // enviar e-mail pro usuário antes de inserir no banco

    await sendInviteEmailToStudent({
      studentEmail: body.get('student_email') as string,
      classroomName: body.get('classroom_name') as string,
      professorName: professorUser.name,
    });

    const { data: classroom, error: errorInsertingClassroom } = await supabase
      .from('classroom')
      .insert({
        professor_id: professorUser.id,
        name: body.get('classroom_name') as string,
        slug: slug(body.get('classroom_name') as string),
      })
      .single();

    if (!classroom || errorInsertingClassroom) {
      return;
    }

    const { data: invitedStudent, error: errorAddingInvitedStudent } =
      await supabase.from('invited_student').insert({
        email: body.get('student_email'),
        classroom_id: classroom.id,
      });

    return redirect('/salas');
  }

  const { data: classroom, error: errorInsertingClassroom } = await supabase
    .from('classroom')
    .insert({
      professor_id: professorUser.id,
      student_id: foundStudent.id,
      name: body.get('classroom_name') as string,
      slug: slug(body.get('classroom_name') as string),
    })
    .single();

  return redirect('/salas');
};

export default function ProfessorNewClassPage() {
  const { user } = useLoaderData<{ user?: User }>();
  return (
    <AppLayout user={user}>
      <div className="flex flex-col justify-center items-center relative">
        <h1 className="text-5xl">Nova sala</h1>
        <div className="py-8 rounded-lg shadow-xl bg-gray-50">
          <div className="p-4">
            <Form method="post">
              <div className="m-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Nome da sala</span>
                  </label>
                  <input
                    name="classroom_name"
                    type="text"
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Qual o email do aluno?</span>
                  </label>
                  <input
                    name="student_email"
                    type="text"
                    className="input input-bordered w-full"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-white bg-blue-500 rounded shadow-xl mt-10"
                >
                  Criar sala
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
