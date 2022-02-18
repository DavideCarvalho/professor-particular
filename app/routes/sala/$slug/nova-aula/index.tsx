import {
  LoaderFunction,
  redirect,
  useLoaderData,
  Form,
  ActionFunction,
} from 'remix';
import { User } from '@supabase/supabase-js';
import { isAuthenticated, getUserByRequestToken } from '~/lib/auth';
import { AppLayout } from '~/components/AppLayout';
import { ChangeEventHandler, FC } from 'react';
import { supabase } from '~/lib/supabase/supabase.server';

export const loader: LoaderFunction = async ({ request, params }) => {
  if (!(await isAuthenticated(request))) return redirect('/login');
  const { user } = await getUserByRequestToken(request);
  const { data, error } = await supabase
    .from('classroom')
    .select()
    .eq('slug', params.slug)
    .single();
  if (!data || error) {
    throw new Response('Not Found', {
      status: 404,
    });
  }
  return {
    user,
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  const { data, error } = await supabase
    .from('classroom')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!data || error) {
    throw new Response('Not Found', {
      status: 404,
    });
  }

  const body = await request.formData();

  const { data: data2, error: error2 } = await supabase.from('lesson').insert({
    name: body.get('name'),
    objectives: body.get('objectives'),
    professor_id: data.professor_id,
    student_id: data.student_id,
  });

  return redirect(`/aula/${params.slug}`);
};

export default function ProfessorNewLessonPage() {
  const { user } = useLoaderData<{ user?: User }>();
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
