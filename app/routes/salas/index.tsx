import { LoaderFunction, redirect, useLoaderData, Form } from 'remix';
import { User } from '@supabase/supabase-js';
import { isAuthenticated, getUserByRequestToken } from '~/lib/auth';
import { AppLayout } from '~/components/AppLayout';
import { Card } from '~/components/Card';
import { supabase } from '~/lib/supabase/supabase.server';

type StudentsAttrs = {
  className: string;
  studentName: string;
  professorName: string;
  classSlug: string;
};

export let loader: LoaderFunction = async ({ request }) => {
  if (!(await isAuthenticated(request))) return redirect('/auth');
  const { user } = await getUserByRequestToken(request);
  const { data: foundUser, error: foundUserError } = await supabase
    .from('user')
    .select(
      `
      id,
      role(name)
    `
    )
    .match({ id: user.id })
    .single();
  if (!foundUser || foundUserError) {
    return redirect('/auth');
  }
  const { role } = foundUser;
  const { data: students, error } = await supabase
    .from('professor_has_student')
    .select(
      `
      className: name,
      classSlug: slug,
      student: professor_has_student_student_id_fkey(username),
      professor: professor_has_student_professor_id_fkey(username)
    `
    )
    .eq(role.name === 'PROFESSOR' ? 'professor_id' : 'student_id', user.id);
  return {
    students: students?.map(({ student, className, classSlug, professor }) => {
      return {
        studentName: student.username,
        professorName: professor.username,
        className,
        classSlug,
      };
    }),
    user: foundUser,
    error,
  };
};

export default function ProfessorStudentsPage() {
  const { students, user } =
    useLoaderData<{ students: StudentsAttrs[]; user?: any }>();
  return (
    <AppLayout user={user}>
      <div className="flex flex-col justify-center items-center relative">
        <h1 className="text-5xl">Salas</h1>
        <div className="py-8 grid grid-cols-1 w-full">
          <div>
            {students.map(
              ({ studentName, className, classSlug, professorName }) => (
                <>
                <Card
                  key={classSlug}
                  title={className}
                  subtitle={
                    user.role.name === 'PROFESSOR' ? studentName : professorName
                  }
                  buttonLocation={`/sala/${classSlug}`}
                  buttonLabel="Entrar"
                />
                </>
              )
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
