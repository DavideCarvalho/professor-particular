import type { ActionFunction } from 'remix';
import { useActionData, MetaFunction, redirect, json } from 'remix';
import { AuthCreds } from '../../components/AuthForm';
import { supabase } from '~/lib/supabase/supabase.server';
import ForgotPasswordForm from '~/components/forgot-password-form';

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
      email?.toString()!,
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
    return json(errors, { status: 422 });
  }

  return redirect('/login');
};

export default function LoginPage() {
  const errors = useActionData<AuthCreds>();
  return <ForgotPasswordForm errors={errors} />;
}
