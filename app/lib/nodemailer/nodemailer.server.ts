import { createTransport } from 'nodemailer';
import fs from 'fs';
import path from 'path';

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

const emailTemplatesPath = path.join(__dirname, '..', '..', 'email-templates');

const inviteEmailAsString = fs
  .readFileSync(path.join(emailTemplatesPath, 'invite-email.html'))
  .toString();

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
    html: inviteEmailAsString
      .replace('{{ PROFESSOR_NAME }}', professorName)
      .replace('{{ CLASSROOM_NAME }}', classroomName),
  });
}
