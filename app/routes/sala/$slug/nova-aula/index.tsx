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
  if (!(await isAuthenticated(request))) return redirect('/auth');
  const { user } = await getUserByRequestToken(request);
  const { data, error } = await supabase
    .from('professor_has_student')
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

// const uploadHandler: UploadHandler = async ({ name, stream, filename }) => {
//   try {
//     // we only care about the file form field called "avatar"
//     // so we'll ignore anything else
//     // NOTE: the way our form is set up, we shouldn't get any other fields,
//     // but this is good defensive programming in case someone tries to hit our
//     // action directly via curl or something weird like that.
//     if (name !== 'documents') {
//       stream.resume();
//       return;
//     }
//
//     console.log('before for...of', name, filename);
//     const chunks = [];
//     for await (const chunk of stream) {
//       console.log('inside for...of');
//       chunks.push(chunk);
//     }
//     console.log('after for...of');
//     const buffer = Buffer.concat(chunks);
//
//     const { data, error } = await supabase.storage
//       .from('documents')
//       .upload(filename, stream);
//
//     console.log('data', data);
//     console.log('error', error);
//
//     return { data, error };
//   } catch (e) {
//     console.log(e);
//     return { error: e };
//   }
// };

export const action: ActionFunction = async ({ request, params }) => {
  const { data, error } = await supabase
    .from('professor_has_student')
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

interface FileUploadProps {
  onChange: ChangeEventHandler<HTMLInputElement>;
  name: string;
}

const FileUpload: FC<FileUploadProps> = ({ onChange, name }) => {
  return (
    <div className="p-4">
      <label className="inline-block mb-2 text-gray-500">
        Escolher arquivos
      </label>
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col w-full h-32 border-4 border-blue-200 border-dashed hover:bg-gray-100 hover:border-gray-300">
          <div className="flex flex-col items-center justify-center pt-7">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-gray-400 group-hover:text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
              Clique aqui e coloque os arquivos da aula
            </p>
          </div>
          <input
            onChange={onChange}
            name={name}
            type="file"
            className="opacity-0"
          />
        </label>
      </div>
    </div>
  );
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
