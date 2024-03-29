import type { ActionFunction } from "@remix-run/node";
import { json, MetaFunction, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import type { User } from '@supabase/supabase-js';
import { supabase } from '~/lib/supabase/supabase.server';
import {
  SignUpForm,
  SignUpFormValidator,
} from '~/components/container/sign-up-form';
import { validationError } from 'remix-validated-form';
import { getRoleByName, RoleEntity } from '~/back/service/role.service';
import { createUser } from '~/back/service/user.service';

export interface SignInPageActionData {
  error?: ErrorMessage;
}

interface ErrorMessage {
  message: string;
  code: string;
}

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
  return {
    title: 'Pró-fessor - Cadastro',
    description: 'Sistema para gestão de aulas particulares',
    'og:site_name': 'Pró-Fessor',
    'og:title': 'Pró-Fessor',
    'og:description': 'Sistema para aulas particulares',
    'og:type': 'website',
    'og:image': 'https://professor-particular.vercel.app/',
  };
};

export let action: ActionFunction = async ({ request }) => {
  const { data, error } = await SignUpFormValidator.validate(
    await request.formData()
  );
  if (error) return validationError(error);
  const { name, email, password, redirect_to: redirectTo } = data;

  const { data: signUpData, error: signUpError } =
    await supabase.auth.api.signUpWithEmail(
      email?.toString()!,
      password?.toString()!
    );

  if (!signUpData || signUpError) {
    const error: ErrorMessage = {
      code: 'INTERNAL_SERVER_ERROR',
      message:
        'Opa, tivemos um erro desconhecido. Por favor tente novamente mais tarde',
    };

    return json(
      {
        error,
      },
      { status: 500 }
    );
  }

  let role: RoleEntity;
  try {
    role = await getRoleByName('PROFESSOR');
  } catch (e) {
    return json(
      {
        error,
      },
      { status: 404 }
    );
  }


  try {
    await createUser((signUpData as User).id, role.id, name, email);
  } catch (e) {
    const error: ErrorMessage = {
      code: 'INTERNAL_SERVER_ERROR',
      message:
        'Opa, tivemos um erro desconhecido. Por favor tente novamente mais tarde',
    };

    return json(
      {
        error,
      },
      { status: 500 }
    );
  }
  // const { error: errorInsertingUser } = await supabase
  //   .from('user')
  //   .insert({ id: (signUpData as User).id, role_id: role.id, name, email })
  //   .single();

  // if (errorInsertingUser) {
  //   const error: ErrorMessage = {
  //     code: 'INTERNAL_SERVER_ERROR',
  //     message:
  //       'Opa, tivemos um erro desconhecido. Por favor tente novamente mais tarde',
  //   };
  //
  //   return json(
  //     {
  //       error,
  //     },
  //     { status: 500 }
  //   );
  // }
  return redirect('/bem-vindo-professor');
};

export default function Auth() {
  const actionData = useActionData<SignInPageActionData>();
  return <SignUpForm errorMessage={actionData?.error?.message} />;
}
