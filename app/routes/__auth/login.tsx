import type { ActionFunction } from 'remix';
import type { Session, User } from '@supabase/supabase-js';
import { useActionData, MetaFunction, redirect, json } from 'remix';
import AuthForm, { AuthCreds } from '../../components/AuthForm';
import { supabaseToken } from '~/cookies';
import { supabase } from '~/lib/supabase/supabase.server';

export let meta: MetaFunction = () => {
  return {
    title: 'Remix Starter Kit - Sign In or Sign Up',
    description: 'Welcome to Remix Starter Kit',
  };
};

export let action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  const email = form.get('email');
  const password = form.get('password');
  const redirectTo = form.get('redirect_to') as string;

  let errors: AuthCreds & { service?: Array<string> } = {};

  if (typeof email !== 'string' || !email.match(/^\S+@\S+$/)) {
    errors.email = 'Coloque um e-mail valido';
  }

  if (typeof password !== 'string' || password.length < 6) {
    errors.password = 'senha deve conter pelo menos 6 caracteres';
  }

  let session: Session | null = null;
  let user: User | null = null;
  try {
    const { data, error } = await supabase.auth.api.signInWithEmail(
      email?.toString()!,
      password?.toString()!
    );
    if (error) {
      errors.service = [error.message];
    } else {
      session = data as Session;
    }
  } catch (error) {
    // @ts-ignore
    errors.service = [error.message];
  }

  if (Object.keys(errors).length) {
    return json(errors, { status: 422 });
  }

  if (session) {
    return redirect(redirectTo.replace('{USER_ID}', session!.user!.id), {
      headers: {
        'Set-Cookie': await supabaseToken.serialize(session.access_token, {
          expires: new Date(session?.expires_at!),
          maxAge: session.expires_in,
        }),
      },
    });
  }

  return redirect('/login');
};

export default function LoginPage() {
  const errors = useActionData<AuthCreds>();
  return <AuthForm errors={errors} />;
}
