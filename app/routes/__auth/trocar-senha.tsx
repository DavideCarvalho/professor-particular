import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, MetaFunction, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { AuthCreds } from '~/components/AuthForm';
import { supabase } from '~/lib/supabase/supabase.server';
import ChangePasswordForm from '~/components/change-password-form';

interface ChangePasswordActionData {
  errors?: AuthCreds & { service?: Array<string> };
  result?: string;
}

export let meta: MetaFunction = () => {
  return {
    title: 'Pró-fessor - Trocar senha',
    description: 'Sistema para gestão de aulas particulares',
    'og:site_name': 'Pró-Fessor',
    'og:title': 'Pró-Fessor',
    'og:description': 'Sistema para aulas particulares',
    'og:type': 'website',
    'og:image': 'https://professor-particular.vercel.app/',
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const url = new URL(request.url);
  const accessToken = url.searchParams.get('access_token');
  if (!accessToken) {
    throw new Error('Unable to change password due to missing access_token');
  }
  return null;
};

export const action: ActionFunction = async ({ request, params }) => {
  const url = new URL(request.url);
  const accessToken = url.searchParams.get('access_token');
  if (!accessToken) {
    throw new Error('Unable to change password due to missing access_token');
  }
  const form = await request.formData();
  const password = form.get('password') as string | undefined;

  if (!password || !password.trim()) {
    throw new Error('Unable to change password due to missing password');
  }

  let errors: AuthCreds & { service?: Array<string> } = {};

  try {
    const { error } = await supabase.auth.api.updateUser(accessToken, {
      password,
    });
    if (error) {
      errors.service = [error.message];
    } else {
    }
  } catch (error) {
    // @ts-ignore
    errors.service = [error.message];
  }

  if (Object.keys(errors).length) {
    return json<ChangePasswordActionData>(
      { errors, result: undefined },
      { status: 422 }
    );
  }

  return json<ChangePasswordActionData>(
    { errors: {}, result: 'Senha alterada com sucesso!' },
    { status: 200 }
  );
};

export default function LoginPage() {
  const actionData = useActionData<ChangePasswordActionData>();
  return (
    <ChangePasswordForm
      errors={actionData?.errors}
      result={actionData?.result}
    />
  );
}
