import type { ActionFunction } from '@remix-run/node';
import { json, MetaFunction, redirect } from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import { supabaseToken } from '~/cookies';
import { supabase } from '~/lib/supabase/supabase.server';
import {
  LoginForm,
  LoginFormValidator,
} from '~/components/container/login-form';
import { validationError } from 'remix-validated-form';

export interface LoginPageActionData {
  error?: ErrorMessage;
}

interface ErrorMessage {
  message: string;
  code: string;
}

export let meta: MetaFunction = () => {
  return {
    title: 'Pró-fessor - Login',
    description: 'Sistema para gestão de aulas particulares',
    'og:site_name': 'Pró-Fessor',
    'og:title': 'Pró-Fessor',
    'og:description': 'Sistema para aulas particulares',
    'og:type': 'website',
    'og:image': 'https://professor-particular.vercel.app/',
  };
};

export let action: ActionFunction = async ({ request }) => {
  const { data, error } = await LoginFormValidator.validate(
    await request.formData()
  );
  if (error) return validationError(error);
  const { email, password, redirect_to: redirectTo } = data;

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.signInWithPassword({
    email: email.toString(),
    password: password.toString(),
  });

  if (!session || sessionError) {
    if (sessionError?.message.toLowerCase() === 'invalid login credentials') {
      const error: ErrorMessage = {
        code: 'INVALID_LOGIN_CREDENTIALS',
        message: 'Usuário ou senha inválidos',
      };
      return json({ error }, { status: 422 });
    }

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

  return redirect(redirectTo.replace('{USER_ID}', session.user!.id), {
    headers: {
      'Set-Cookie': await supabaseToken.serialize(session.access_token, {
        expires: new Date(session?.expires_at!),
        maxAge: session.expires_in,
      }),
    },
  });
};

export default function LoginPage() {
  const actionData = useActionData<LoginPageActionData>();
  return <LoginForm errorMessage={actionData?.error?.message} />;
}
