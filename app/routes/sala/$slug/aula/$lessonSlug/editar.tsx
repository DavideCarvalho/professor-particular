import {
  ActionFunction,
  Form,
  LoaderFunction,
  redirect,
  useLoaderData,
} from 'remix';
import { User } from '@supabase/supabase-js';
import { AppLayout } from '~/components/AppLayout';
import { getUserByRequestToken, isAuthenticated } from '~/lib/auth';
import { supabase } from '~/lib/supabase/supabase.server';
import { useState } from 'react';

export const loader: LoaderFunction = async ({ request, params }) => {
  if (!(await isAuthenticated(request))) return redirect('/login');
  const { user } = await getUserByRequestToken(request);
  const { data, error } = await supabase
    .from('classroom')
    .select('*')
    .match({ slug: params.slug })
    .single();

  if (error) {
    throw new Response('Not Found', {
      status: 404,
    });
  }

  const { data: lesson, error: errorSearchingLesson } = await supabase
    .from('lesson')
    .select('*')
    .match({
      slug: params.lessonSlug,
      professor_id: data.professor_id,
      student_id: data.student_id,
    })
    .single();

  if (errorSearchingLesson) {
    throw new Response('Not Found', {
      status: 404,
    });
  }

  return {
    user,
    lesson,
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  const { data, error } = await supabase
    .from('classroom')
    .select('*')
    .match({ slug: params.slug })
    .single();

  if (error) {
    throw new Response('Not Found', {
      status: 404,
    });
  }

  const { error: errorSearchingLesson } = await supabase
    .from('lesson')
    .select('*')
    .match({ slug: params.lessonSlug })
    .single();

  if (errorSearchingLesson) {
    throw new Response('Not Found', {
      status: 404,
    });
  }

  const body = await request.formData();

  const { error: errorUpdatingLesson } = await supabase
    .from('lesson')
    .update({
      name: body.get('name'),
      objectives: body.get('objectives'),
    })
    .match({
      slug: params.lessonSlug,
      professor_id: data.professor_id,
      student_id: data.student_id,
    });

  return redirect(`/sala/${params.slug}`);
};

const EditLessonPage = () => {
  const { user, lesson } = useLoaderData<{ user?: User; lesson: any }>();
  const [formValues, setFormValues] = useState({
    name: lesson.name,
    objectives: lesson.objectives,
  });
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
                  value={formValues.name}
                  onChange={(e) =>
                    setFormValues(() => ({
                      ...formValues,
                      name: e.target.value,
                    }))
                  }
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
                  value={formValues.objectives}
                  onChange={(e) =>
                    setFormValues(() => ({
                      ...formValues,
                      objectives: e.target.value,
                    }))
                  }
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
};

export default EditLessonPage;
