import { createTransport } from 'nodemailer';
import { inviteEmail } from '~/lib/nodemailer/email-templates/invite-email';

const SMTP_USER = process.env.SMTP_USER;
const SMTP_SECRET = process.env.SMTP_SECRET;

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
  return smtpTransport.sendMail({
    from: 'professorparticular@naoresponder.com',
    to: studentEmail,
    subject: 'Você foi convidado para uma aula!',
    html: inviteEmail
      .replace('{{ PROFESSOR_NAME }}', professorName)
      .replace('{{ CLASSROOM_NAME }}', classroomName),
  });
}
