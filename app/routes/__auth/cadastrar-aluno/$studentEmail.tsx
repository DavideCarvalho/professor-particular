import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, MetaFunction, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import type { User } from '@supabase/supabase-js';
import { AuthCreds } from '~/components/AuthForm';
import { supabase } from '~/lib/supabase/supabase.server';
import SignUpStudentForm from '~/components/SignUpStudentForm';

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
  return {
    title: 'Remix Starter Kit - Sign In or Sign Up',
    description: 'Welcome to Remix Starter Kit',
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  const { data, error } = await supabase
    .from('invited_student')
    .select('*')
    .match({ email: params.studentEmail });

  if (!data?.length || error) {
    return redirect('/');
  }

  return {
    studentEmail: params.studentEmail,
  };
};

export let action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const name = form.get('name');
  const email = form.get('email');
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
    .match({ name: 'STUDENT' })
    .single();

  if (!role || errorFindingRole) {
    return;
  }

  const { error: errorInsertingUser } = await supabase
    .from('user')
    .insert({ id: user!.id, role_id: role.id, name, email })
    .single();

  if (errorInsertingUser) {
    return;
  }

  const { data: invitedUser, error: errorFindingInvitedUser } = await supabase
    .from('invited_student')
    .select('*')
    .match({ email });

  if (!invitedUser?.length || errorFindingInvitedUser) {
    return;
  }

  for (const invite of invitedUser) {
    await supabase
      .from('classroom')
      .update({ student_id: user!.id })
      .match({ id: invite.classroom_id });

    await supabase.from('invited_user').delete().eq('id', invite.id);
  }

  if (user) {
    // @TODO: improve this!
    return redirect('/bem-vindo', {});
  }
  return redirect('/login');
};

export default function Auth() {
  const errors = useActionData<AuthCreds>();
  return <SignUpStudentForm errors={errors} />;
}
