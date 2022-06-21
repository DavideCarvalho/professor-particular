import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { User } from '@supabase/supabase-js';
import { isAuthenticated, getUserByRequestToken } from '~/lib/auth';
import { AppLayout } from '~/components/AppLayout';
import { getClassroomBySlugAndProfessorId } from '~/back/service/classroom.service';
import { getProfessorById, UserEntity } from '~/back/service/user.service';
import { createLesson } from '~/back/service/lesson.service';

export const loader: LoaderFunction = async ({ request, params }) => {
  if (!(await isAuthenticated(request))) return redirect('/login');
  const { user } = await getUserByRequestToken(request);
  const foundProfessor = await getProfessorById(user.id);
  await getClassroomBySlugAndProfessorId(
    params.slug as string,
    foundProfessor.id
  );
  return {
    user,
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  if (!(await isAuthenticated(request))) return redirect('/login');
  const { user } = await getUserByRequestToken(request);
  const foundProfessor = await getProfessorById(user.id);
  const classroom = await getClassroomBySlugAndProfessorId(
    params.slug as string,
    foundProfessor.id
  );

  const body = await request.formData();

  await createLesson(
    body.get('name') as string,
    body.get('objectives') as string,
    classroom.id
  );

  return redirect(`/sala/${params.slug}`);
};

export default function ProfessorNewLessonPage() {
  const { user } = useLoaderData<{ user?: UserEntity }>();
  return (
    <AppLayout user={user}>
      <div className="flex flex-col justify-center items-center relative">
        <h1 className="text-5xl">Nova aula</h1>
        <div className="py-8 rounded-lg shadow-xl bg-gray-50">
          <div className="p-4">
            <Form method="post">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nome da aula</span>
                </label>
                <input
                  name="name"
                  type="text"
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Sobre o que é a aula?</span>
                </label>
                <textarea
                  name="objectives"
                  className="textarea h-24 textarea-bordered w-full"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-500 rounded shadow-xl"
              >
                Criar aula
              </button>
            </Form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
