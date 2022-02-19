import { LoaderFunction, redirect, useLoaderData, Form, Link } from 'remix';
import { isAuthenticated, getUserByRequestToken } from '~/lib/auth';
import { AppLayout } from '~/components/AppLayout';
import { Card } from '~/components/Card';
import { supabase } from '~/lib/supabase/supabase.server';
import { stripeClient } from '~/lib/stripe/stripe.server';
import type { Stripe } from 'stripe';
import { FC, useState } from 'react';
import { ModalCannotCreateClassroom } from '~/components/modal-cannot-create-classroom';

type StudentsAttrs = {
  className: string;
  studentName: string;
  professorName: string;
  classSlug: string;
};

export let loader: LoaderFunction = async ({ request }) => {
  if (!(await isAuthenticated(request))) return redirect('/login');
  const { user } = await getUserByRequestToken(request);
  const { data: foundUser, error: foundUserError } = await supabase
    .from('user')
    .select(
      `
      id,
      stripe_id,
      role(name)
    `
    )
    .match({ id: user.id })
    .single();

  if (!foundUser || foundUserError) {
    return redirect('/login');
  }

  let userSubscription: Stripe.Subscription | undefined;
  let userPlan: any;

  if (foundUser?.stripe_id) {
    const stripeUser = (await stripeClient.customers.retrieve(
      foundUser.stripe_id,
      { expand: ['subscriptions'] }
    )) as Stripe.Customer;

    userSubscription = stripeUser?.subscriptions?.data?.[0];
    userPlan = (userSubscription as any).plan;
  }

  const { role } = foundUser;
  const { data: students, error } = await supabase
    .from('classroom')
    .select(
      `
      className: name,
      classSlug: slug,
      student: classroom_student_id_fkey(name),
      professor: classroom_professor_id_fkey(name)
    `
    )
    .eq(role.name === 'PROFESSOR' ? 'professor_id' : 'student_id', user.id);

  return {
    students: students?.map(({ student, className, classSlug, professor }) => {
      return {
        studentName: student?.name,
        professorName: professor.name,
        className,
        classSlug,
      };
    }),
    user: foundUser,
    userPlan,
    error,
  };
};

function isPaying(userPlanId: string): boolean {
  return (
    !userPlanId ||
    userPlanId === 'price_1KTD3ZIgRgyZD761SGBTV0Xi' ||
    userPlanId === 'price_1KTD3wIgRgyZD761Ky8hFRt2'
  );
}

const ButtonNewClassroom: FC<any> = ({ userPlan, students }) => {
  const [showModal, setShowModal] = useState(false);
  if (!isPaying(userPlan?.id) && students.length >= 2) {
    return (
      <>
        <ModalCannotCreateClassroom
          isOpen={showModal}
          close={() => setShowModal(false)}
        />
        <button onClick={() => setShowModal(true)} className="btn">
          + sala
        </button>
      </>
    );
  }
  return (
    <Link to="nova-sala" className="btn">
      + sala
    </Link>
  );
};

export default function ProfessorStudentsPage() {
  const { students, user, userPlan } =
    useLoaderData<{ students: StudentsAttrs[]; user?: any; userPlan: any }>();
  return (
    <AppLayout user={user}>
      <div className="flex flex-col justify-center items-center relative">
        <h1 className="text-5xl">Suas salas</h1>
        <div className="flex justify-end w-full">
          <ButtonNewClassroom userPlan={userPlan} students={students} />
        </div>
        <div className="py-8 grid grid-cols-1 w-full">
          <div>
            {students.map(
              ({ studentName, className, classSlug, professorName }) => (
                <Card
                  key={classSlug}
                  title={className}
                  subtitle={
                    user.role.name === 'PROFESSOR' ? studentName : professorName
                  }
                  buttonLocation={`/sala/${classSlug}`}
                  buttonLabel="Entrar"
                />
              )
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
