import type { ActionFunction, LoaderFunction } from 'remix';
import { useActionData, MetaFunction, redirect, json } from 'remix';
import { AuthCreds } from '~/components/AuthForm';
import { supabase } from '~/lib/supabase/supabase.server';
import ChangePasswordForm from '~/components/change-password-form';

interface ChangePasswordActionData {
  errors?: AuthCreds & { service?: Array<string> };
  result?: string;
}

export let meta: MetaFunction = () => {
  return {
    title: 'Remix Starter Kit - Sign In or Sign Up',
    description: 'Welcome to Remix Starter Kit',
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

  return redirect('/login');
};

export default function LoginPage() {
  const actionData = useActionData<ChangePasswordActionData>();
  return <ChangePasswordForm errors={actionData?.errors} result={actionData?.result} />;
}
