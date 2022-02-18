import type { ActionFunction } from 'remix';
import type { Session, User } from '@supabase/supabase-js';
import { useActionData, MetaFunction, redirect, json } from 'remix';
import AuthForm, { AuthCreds } from '../../components/AuthForm';
import { supabase } from '~/lib/supabase/supabase.server';

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
  return {
    title: 'Remix Starter Kit - Sign In or Sign Up',
    description: 'Welcome to Remix Starter Kit',
  };
};

export let action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const email = form.get('email');
  const name = form.get('name');
  const password = form.get('password');

  let errors: AuthCreds & { service: string[] } = {
    email: undefined,
    password: undefined,
    service: [],
  };

  if (typeof email !== 'string' || !email.match(/^\S+@\S+$/)) {
    errors.email = 'fill-in a valid email address!';
  }

  if (typeof password !== 'string' || password.length < 6) {
    errors.password = 'password must be at-least 6 chars!';
  }

  let user: User | null = null;
  try {
    const { data, error } = await supabase.auth.api.signUpWithEmail(
      email?.toString()!,
      password?.toString()!
    );
    if (error) {
      if (error?.message) errors.service = [...errors.service, error?.message];
    } else {
      user = data as User;
    }
  } catch (error) {
    // @ts-ignore
    errors.service = [error.message];
  }

  if (errors.password || errors.email || errors.service.length) {
    return json(errors, { status: 422 });
  }

  const { data: role, error: errorFindingRole } = await supabase
    .from('role')
    .select('id')
    .match({ name: 'PROFESSOR' })
    .single();

  const { error: errorInsertingUser } = await supabase
    .from('user')
    .insert({ id: user!.id, role_id: role.id, name, email })
    .single();

  if (errorInsertingUser) {
    console.log('errorInsertingUser', errorInsertingUser);
    return;
  }

  // if (session) {
  //   return redirect(redirectTo.replace('{USER_ID}', user!.id), {
  //     headers: {
  //       'Set-Cookie': await supabaseToken.serialize(session.access_token, {
  //         expires: new Date(session?.expires_at!),
  //         maxAge: session.expires_in,
  //       }),
  //     },
  //   });
  // }
  if (user) {
    // @TODO: improve this!
    return redirect('/bem-vindo-professor', {});
  }
  return redirect('/login');
};

export default function Auth() {
  const errors = useActionData<AuthCreds>();
  return <AuthForm isSignIn={false} errors={errors} />;
}
