import { LoaderFunction, MetaFunction, redirect } from '@remix-run/node';
import { Form, Link, useLoaderData } from '@remix-run/react';
import { isAuthenticated, getUserByRequestToken } from '~/lib/auth';
import { AppLayout } from '~/components/AppLayout';
import { Card } from '~/components/Card';
import { stripeClient } from '~/lib/stripe/stripe.server';
import type { Stripe } from 'stripe';
import { FC, ReactElement, useState } from 'react';
import { ModalCannotCreateClassroom } from '~/components/modal-cannot-create-classroom';
import { getUserById, UserEntity } from '~/back/service/user.service';
import { getRoleById } from '~/back/service/role.service';
import {
  ClassroomEntity,
  getClassroomsByProfessorId,
  getStudentClassrooms,
} from '~/back/service/classroom.service';

export let meta: MetaFunction = () => {
  return {
    title: 'Pró-fessor - Salas',
    description: 'Sistema para gestão de aulas particulares',
    'og:site_name': 'Pró-Fessor',
    'og:title': 'Pró-Fessor',
    'og:description': 'Sistema para aulas particulares',
    'og:type': 'website',
    'og:image': 'https://professor-particular.vercel.app/',
  };
};

interface LoaderData {
  classrooms: ClassroomEntity[];
  user: UserEntity;
  userPlanId?: string;
}

export let loader: LoaderFunction = async ({ request }) => {
  if (!(await isAuthenticated(request))) return redirect('/login');
  const { user } = await getUserByRequestToken(request);
  let foundUser: UserEntity;
  try {
    foundUser = await getUserById(user.id);
  } catch (e) {
    return redirect('/login');
  }
  const userRole = await getRoleById(foundUser.role_id);

  let userSubscription: Stripe.Subscription | undefined;
  let userPlan: any;

  if (foundUser.stripe_id) {
    const stripeUser = (await stripeClient.customers.retrieve(
      foundUser.stripe_id,
      { expand: ['subscriptions'] }
    )) as Stripe.Customer;

    userSubscription = stripeUser?.subscriptions?.data?.[0];
    userPlan = (userSubscription as any).plan;
  }

  const classrooms =
    userRole.name === 'PROFESSOR'
      ? await getClassroomsByProfessorId(foundUser.id)
      : await getStudentClassrooms(foundUser.id);

  return {
    classrooms,
    user: foundUser,
    userPlanId: userPlan?.id,
  };
};

function isPaying(userPlanId?: string): boolean {
  return (
    !userPlanId ||
    userPlanId === 'price_1KTD3ZIgRgyZD761SGBTV0Xi' ||
    userPlanId === 'price_1KTD3wIgRgyZD761Ky8hFRt2'
  );
}

function ButtonNewClassroom({
  userPlanId,
  classrooms,
}: {
  userPlanId?: string;
  classrooms: ClassroomEntity[];
}): ReactElement {
  const [showModal, setShowModal] = useState(false);
  if (!isPaying(userPlanId) && classrooms.length >= 2) {
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
}

export default function ProfessorStudentsPage() {
  const { classrooms, user, userPlanId } = useLoaderData<LoaderData>();
  return (
    <AppLayout user={user}>
      <div className="flex flex-col justify-center items-center relative">
        <h1 className="text-5xl">Suas salas</h1>
        {user.role.name === 'PROFESSOR' && (
          <div className="flex justify-end w-full">
            <ButtonNewClassroom
              userPlanId={userPlanId}
              classrooms={classrooms}
            />
          </div>
        )}
        <div className="py-8 grid grid-cols-1 w-full">
          <ClassroomCards
            classrooms={classrooms}
            isProfessor={user.role.name === 'PROFESSOR'}
          />
        </div>
      </div>
    </AppLayout>
  );
}

interface ClassroomCardsProps {
  classrooms: ClassroomEntity[];
  isProfessor: boolean;
}

function ClassroomCards({
  classrooms,
  isProfessor,
}: ClassroomCardsProps): ReactElement {
  return (
    <>
      {classrooms.map(({ name, slug, professor, student, id }) => (
        <Card
          key={id}
          title={name}
          subtitle={isProfessor ? student?.name : professor.name}
          buttonLocation={`/sala/${slug}`}
          buttonLabel="Entrar"
        />
      ))}
    </>
  );
}
