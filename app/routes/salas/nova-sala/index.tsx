import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { User } from '@supabase/supabase-js';
import slug from 'slug';
import { AppLayout } from '~/components/AppLayout';
import { getUserByRequestToken, isAuthenticated } from '~/lib/auth';
import { supabase } from '~/lib/supabase/supabase.server';
import { sendInviteEmailToStudent } from '~/lib/nodemailer/nodemailer.server';
import { Stripe } from 'stripe';
import { stripeClient } from '~/lib/stripe/stripe.server';
import {
  getStudentByEmail,
  getUserById,
  UserEntity,
} from '~/back/service/user.service';
import {
  createClassroom,
  getClassroomsByProfessorId,
} from '~/back/service/classroom.service';
import { createInviteStudent } from '~/back/service/invited-student.service';

export const loader: LoaderFunction = async ({ request, params }) => {
  // checar se o cara autenticado é um professor
  // se não for, redirecionar

  if (!(await isAuthenticated(request))) return redirect('/login');
  const { user } = await getUserByRequestToken(request);

  let professorUser: UserEntity;
  try {
    professorUser = await getUserById(user.id);
  } catch (e) {
    return redirect('/salas');
  }

  return { user: professorUser };
};

function isPaying(userPlanId: string): boolean {
  return (
    !userPlanId ||
    userPlanId === 'price_1KTD3ZIgRgyZD761SGBTV0Xi' ||
    userPlanId === 'price_1KTD3wIgRgyZD761Ky8hFRt2'
  );
}

export const action: ActionFunction = async ({ request }) => {
  if (!(await isAuthenticated(request))) return redirect('/login');
  const { user } = await getUserByRequestToken(request);

  let professorUser: UserEntity;
  try {
    professorUser = await getUserById(user.id);
  } catch (e) {
    return redirect('/salas');
  }

  let userSubscription: Stripe.Subscription | undefined;
  let userPlan: any;

  if (professorUser?.stripe_id) {
    const stripeUser = (await stripeClient.customers.retrieve(
      professorUser.stripe_id,
      { expand: ['subscriptions'] }
    )) as Stripe.Customer;

    userSubscription = stripeUser?.subscriptions?.data?.[0];
    userPlan = (userSubscription as any).plan;
  }

  if (!isPaying(userPlan)) {
    const classrooms = await getClassroomsByProfessorId(professorUser.id);

    if (classrooms?.length >= 2) {
      throw new Error(
        `Professor cannot create more classrooms, since he's on free tier`
      );
    }
  }

  const body = await request.formData();

  let foundStudent: UserEntity | undefined;
  try {
    foundStudent = await getStudentByEmail(body.get('student_email') as string);
  } catch (e: any) {
    if (e?.message !== 'Student not found') {
      return redirect('/salas');
    }
    await sendInviteEmailToStudent({
      studentEmail: body.get('student_email') as string,
      classroomName: body.get('classroom_name') as string,
      professorName: professorUser.name,
    });

    const createdClassroom = await createClassroom(
      professorUser.id,
      body.get('classroom_name') as string
    );

    await createInviteStudent(
      body.get('student_email') as string,
      createdClassroom.id
    );

    return redirect('/salas');
  }

  await createClassroom(
    professorUser.id,
    body.get('classroom_name') as string,
    foundStudent.id
  );

  return redirect('/salas');
};

export default function ProfessorNewClassPage() {
  const { user } = useLoaderData<{ user?: UserEntity }>();
  return (
    <AppLayout user={user}>
      <div className="flex flex-col justify-center items-center relative">
        <h1 className="text-5xl">Nova sala</h1>
        <div className="py-8 rounded-lg shadow-xl bg-gray-50">
          <div className="p-4">
            <Form method="post">
              <div className="m-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Nome da sala</span>
                  </label>
                  <input
                    name="classroom_name"
                    type="text"
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Qual o email do aluno?</span>
                  </label>
                  <input
                    name="student_email"
                    type="text"
                    className="input input-bordered w-full"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-white bg-blue-500 rounded shadow-xl mt-10"
                >
                  Criar sala
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
