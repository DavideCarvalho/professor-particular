import type { ActionFunction } from "@remix-run/node";
import { json, MetaFunction, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { AuthCreds } from '~/components/AuthForm';
import { supabase } from '~/lib/supabase/supabase.server';
import ForgotPasswordForm from '~/components/forgot-password-form';

interface ForgotPasswordActionData {
  errors?: AuthCreds & { service?: Array<string> };
  result?: string;
}

export let meta: MetaFunction = () => {
  return {
    title: 'Pró-fessor - Esqueci minha senha',
    description: 'Sistema para gestão de aulas particulares',
    'og:site_name': 'Pró-Fessor',
    'og:title': 'Pró-Fessor',
    'og:description': 'Sistema para aulas particulares',
    'og:type': 'website',
    'og:image': 'https://professor-particular.vercel.app/',
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
