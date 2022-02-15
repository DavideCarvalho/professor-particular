import {
  LoaderFunction,
  redirect,
  useLoaderData,
  Form,
  ActionFunction,
} from 'remix';
import { User } from '@supabase/supabase-js';
import { AppLayout } from '~/components/AppLayout';
import { ChangeEventHandler, FC } from 'react';

export const loader: LoaderFunction = async ({ request, params }) => {
  // checar se o cara autenticado é um professor
  // se não for, redirecionar
};

export const action: ActionFunction = async ({ request, params }) => {
  // checar se o cara autenticado é um professor
  // se não for, dar erro
  /*
  * - Checar se temos um aluno com esse e-mail
  *   - Se não tiver, mandar e-mail pra criar a conta
  *   - Se tiver, faz nada
  *
  * - Vincular professor e aluno nessa sala
  *
  *
  * */
};

interface FileUploadProps {
  onChange: ChangeEventHandler<HTMLInputElement>;
  name: string;
}

export default function ProfessorNewClassPage() {
  const { user } = useLoaderData<{ user?: User }>();
  return (
    <AppLayout user={user}>
      <div className="flex flex-col justify-center items-center relative">
        <h1 className="text-5xl">Nova sala</h1>
        <div className="py-8 rounded-lg shadow-xl bg-gray-50">
          <div className="p-4">
            <Form method="post">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nome da sala</span>
                </label>
                <input
                  name="name"
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
                className="w-full px-4 py-2 text-white bg-blue-500 rounded shadow-xl"
              >
                Criar sala
              </button>
            </Form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
