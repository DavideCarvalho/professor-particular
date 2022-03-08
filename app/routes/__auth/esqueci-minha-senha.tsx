import type { ActionFunction } from 'remix';
import { useActionData, MetaFunction, redirect, json } from 'remix';
import { AuthCreds } from '~/components/AuthForm';
import { supabase } from '~/lib/supabase/supabase.server';
import ForgotPasswordForm from '~/components/forgot-password-form';

interface ForgotPasswordActionData {
  errors?: AuthCreds & { service?: Array<string> };
  result?: string;
}

export let meta: MetaFunction = () => {
  return {
    title: 'Remix Starter Kit - Sign In or Sign Up',
    description: 'Welcome to Remix Starter Kit',
  };
};

export let action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  const email = form.get('email');

  let errors: AuthCreds & { service?: Array<string> } = {};

  if (typeof email !== 'string' || !email.match(/^\S+@\S+$/)) {
    errors.email = 'fill-in a valid email address!';
  }

  try {
    const { error } = await supabase.auth.api.resetPasswordForEmail(
      email?.toString()!
    );
    if (error) {
      errors.service = [error.message];
    } else {
    }
  } catch (error) {
    // @ts-ignore
    errors.service = [error.message];
  }

  if (Object.keys(errors).length) {
    return json({ errors, result: undefined }, { status: 422 });
  }

  return json(
    {
      errors: {},
      result: 'Enviamos um link para seu e-mail. Clique e altere sua senha!',
    },
    { status: 200 }
  );
};

export default function LoginPage() {
  const actionData = useActionData<ForgotPasswordActionData>();
  return (
    <ForgotPasswordForm
      errors={actionData?.errors}
      result={actionData?.result}
    />
  );
}
