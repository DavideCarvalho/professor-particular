import { createTransport } from 'nodemailer';
import { inviteEmail } from '~/lib/nodemailer/email-templates/invite-email';

const SMTP_USER = process.env.SMTP_USER!;
const SMTP_SECRET = process.env.SMTP_SECRET!;
const REGISTER_STUDENT_URL = process.env.REGISTER_STUDENT_URL!;

const smtpTransport = createTransport({
  host: 'smtp-relay.sendinblue.com',
  port: 587,
  auth: {
    user: SMTP_USER,
    pass: SMTP_SECRET,
  },
});

export async function sendInviteEmailToStudent({
  studentEmail,
  professorName,
  classroomName,
}: {
  studentEmail: string;
  professorName: string;
  classroomName: string;
}) {
  const registerStudentUrl = REGISTER_STUDENT_URL.replace(
    '{{STUDENT_EMAIL}}',
    studentEmail
  );
  console.log(registerStudentUrl);
  return smtpTransport.sendMail({
    from: 'professorparticular@naoresponder.com',
    to: studentEmail,
    subject: 'Você foi convidado para uma aula!',
    html: inviteEmail
      .replace('{{ PROFESSOR_NAME }}', professorName)
      .replace('{{ CLASSROOM_NAME }}', classroomName)
      .replace('{{ REGISTER_STUDENT_URL }}', registerStudentUrl),
  });
}
