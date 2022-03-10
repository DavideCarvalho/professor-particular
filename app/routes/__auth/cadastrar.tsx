import type { ActionFunction } from 'remix';
import type { Session, User } from '@supabase/supabase-js';
import { useActionData, MetaFunction, redirect, json } from 'remix';
import { supabase } from '~/lib/supabase/supabase.server';
import {
  SignUpForm,
  SignUpFormValidator,
} from '~/components/container/sign-up-form';
import { validationError } from 'remix-validated-form';

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
    title: 'Remix Starter Kit - Sign In or Sign Up',
    description: 'Welcome to Remix Starter Kit',
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

  if (!signUpData || !signUpError) {
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

  const { data: role, error: errorFindingRole } = await supabase
    .from('role')
    .select('id')
    .match({ name: 'PROFESSOR' })
    .single();

  if (errorFindingRole) {
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

  const { error: errorInsertingUser } = await supabase
    .from('user')
    .insert({ id: (signUpData as User).id, role_id: role.id, name, email })
    .single();

  if (errorInsertingUser) {
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
  return redirect('/bem-vindo-professor');
};

export default function Auth() {
  const actionData = useActionData<SignInPageActionData>();
  return <SignUpForm errorMessage={actionData?.error?.message} />;
}
