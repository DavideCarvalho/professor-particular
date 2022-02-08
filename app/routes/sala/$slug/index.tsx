import { ChangeEvent, FC, useEffect, useState } from 'react';
import { AiOutlineFilePdf, AiOutlineFileExcel } from 'react-icons/ai';
import { IconType } from 'react-icons';
import { SiGooglemeet, SiMicrosoftteams } from 'react-icons/si';
import { FaDiscord } from 'react-icons/fa';
import { FiVideo } from 'react-icons/fi';
import { Link, LoaderFunction, redirect, useLoaderData } from 'remix';
import { AppLayout } from '~/components/AppLayout';
import { getUserByRequestToken, isAuthenticated } from '~/lib/auth';
import { supabase } from '~/lib/supabase/supabase.server';
import { getSupabaseClient } from '~/lib/supabase';
import { Modal } from '~/components/Modal';
import { SimpleModal } from '~/components/SimpleModal';
import { AiOutlineUpload, AiFillDelete } from 'react-icons/ai';
import { TiCancel } from 'react-icons/ti';
import { MdOpenInNew } from 'react-icons/md';
import { ModalChangeLessonLink } from '~/components/modal-change-lesson-link';

export let loader: LoaderFunction = async ({ request }) => {
  if (!(await isAuthenticated(request))) return redirect('/auth');
  const { user } = await getUserByRequestToken(request);
  const { data: foundUser, error: foundUserError } = await supabase
    .from('user')
    .select(
      `
      id,
      role(name)
    `
    )
    .match({ id: user.id })
    .single();
  if (!foundUser || foundUserError) {
    return redirect('/auth');
  }
  const { role } = foundUser;
  const { data: classroom, error } = await supabase
    .from('professor_has_student')
    .select(
      `
      className: name,
      slug
    `
    )
    .eq(role.name === 'PROFESSOR' ? 'professor_id' : 'student_id', user.id)
    .single();

  const { data: lessons, error: lessonsError } = await supabase
    .from('lesson')
    .select(
      `
    *,
    documents(path, name)
    `
    )
    .eq(role.name === 'PROFESSOR' ? 'professor_id' : 'student_id', user.id)
    .order('created_at', { ascending: false });

  return { classroom, lessons, user: foundUser };
};

const AulaPage = () => {
  const { classroom, lessons, user } = useLoaderData();
  return (
    <AppLayout>
      <h1 className="text-2xl">{classroom.className}</h1>
      <div className="divider" />
      {user.role.name === 'PROFESSOR' && (
        <Link to={`/aula/${classroom.slug}/nova-aula`}>
          <button className="btn">+ aula</button>
        </Link>
      )}
      {lessons.map(
        ({
          id,
          slug,
          name,
          link,
          objectives,
          documents,
          student_feedback,
          professor_feedback,
        }: any) => (
          <LessonCard
            key={id}
            id={id}
            slug={slug}
            professorId={user.role.name === 'PROFESSOR' ? user.id : undefined}
            link={link}
            name={name}
            objectives={objectives}
            documents={documents}
            studentFeedback={student_feedback}
            professorFeedback={professor_feedback}
            isProfessor={user.role.name === 'PROFESSOR'}
          />
        )
      )}
    </AppLayout>
  );
};

interface ErrorMessageProps {
  title: string;
  text: string;
}

const ErrorMessage: FC<ErrorMessageProps> = ({ title, text }) => {
  return (
    <div
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
      role="alert"
    >
      <strong className="font-bold">{title}</strong>
      <span className="block sm:inline">{text}</span>
      <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
        <svg
          className="fill-current h-6 w-6 text-red-500"
          role="button"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <title>Close</title>
          <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
        </svg>
      </span>
    </div>
  );
};

const LessonCard: FC<any> = ({
  id,
  slug,
  name,
  link,
  professorId,
  objectives,
  documents,
  isProfessor,
  studentFeedback,
  professorFeedback,
}) => {
  const [showErrorUpdateFeedback, setShowErrorUpdateFeedback] =
    useState<boolean>(false);
  const [showModalEditLessonLink, setShowModalEditLessonLink] =
    useState<boolean>(false);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    const supabaseClient = await getSupabaseClient();
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${professorId}/${fileName}`;
    let { error: errorUploadingFile } = await supabaseClient.storage
      .from('documents')
      .upload(filePath, file);
    if (errorUploadingFile) {
      return;
    }
    let { error: errorInsertingFileOnDatabase } = await supabaseClient
      .from('documents')
      .insert({
        path: filePath,
        lesson_id: id,
        name: file.name,
      });
    if (errorInsertingFileOnDatabase) {
      await supabaseClient.storage.from('documents').remove([filePath]);
      return;
    }
    window.location.reload();
  }

  return (
    <div className="card shadow-2xl">
      <div className="card-body">
        {showErrorUpdateFeedback && (
          <ErrorMessage
            title="Erro!"
            text="Erro ao tentar atualizar o feedback"
          />
        )}
        <div className="flex">
          <h2 className="card-title">{name}</h2>
          <div className="ml-auto cursor-pointer">
            <CallIcon url={link} />
          </div>
        </div>
        <p>{objectives}</p>
        <Feedback
          isProfessor={isProfessor}
          studentFeedback={studentFeedback}
          professorFeedback={professorFeedback}
          updateProfessorFeedback={async (professorFeedback) => {
            setShowErrorUpdateFeedback(false);
            const supabase = await getSupabaseClient();
            const { error } = await supabase
              .from('lesson')
              .update({
                professor_feedback: professorFeedback,
              })
              .match({ id });
            if (error) {
              setShowErrorUpdateFeedback(true);
              return;
            }
            window.location.reload();
          }}
          updateStudentFeedback={async (studentFeedback) => {
            const supabase = await getSupabaseClient();
            const { error } = await supabase
              .from('lesson')
              .update({
                student_feedback: studentFeedback,
              })
              .match({ id });
            if (error) {
              setShowErrorUpdateFeedback(true);
              return;
            }
            window.location.reload();
          }}
        />
        <div className="grid grid-cols-4 gap-4 sm:grid-cols-2 sm:gap-0 content-center">
          {documents.map(({ path, name }: any) => (
            <div className="flex items-center justify-center" key={path}>
              <AttachmentIcon
                path={path}
                name={name}
                key={path}
                isProfessor={isProfessor}
              />
            </div>
          ))}
          {isProfessor && (
            <div className="flex items-center justify-center">
              <label className="btn btn-ghost">
                <div className="grid grid-cols-1">
                  <div className="flex items-center justify-center">
                    <AiOutlineUpload />
                  </div>
                  <p>Subir arquivo</p>
                  <input
                    type="file"
                    className="opacity-0"
                    hidden={true}
                    accept=".xlsx, .xls, .doc, .docx, .ppt, .pptx, .pdf"
                    onChange={handleFileChange}
                  />
                </div>
              </label>
            </div>
          )}
        </div>
      </div>
      {isProfessor && (
        <div>
          <Link
            to={`aula/${slug}/editar`}
            className="btn btn-ghost float-left w-1/6"
          >
            Editar Aula
          </Link>
          <ModalChangeLessonLink
            onSubmit={async (link) => {
              const supabase = await getSupabaseClient();
              const { error } = await supabase
                .from('lesson')
                .update({
                  link,
                })
                .match({ id });
              if (error) {
                return;
              }
              window.location.reload();
            }}
            isOpen={showModalEditLessonLink}
            close={() => setShowModalEditLessonLink(false)}
            link={link}
            title={'Alterar link da aula'}
          />
          <button
            onClick={() => setShowModalEditLessonLink(true)}
            className="btn btn-ghost float-left w-1/6"
          >
            {link ? 'Editar link' : 'Adicionar link'}
          </button>
        </div>
      )}
    </div>
  );
};

interface FeedbackProps {
  isProfessor: boolean;
  studentFeedback: string;
  professorFeedback: string;
  updateProfessorFeedback: (professorFeedback: string) => void;
  updateStudentFeedback: (studentFeedback: string) => void;
}

const Feedback: FC<FeedbackProps> = ({
  isProfessor,
  studentFeedback,
  professorFeedback,
  updateProfessorFeedback,
  updateStudentFeedback,
}) => {
  const [isProfessorFeedbackModalOpen, setProfessorFeedbackModalOpen] =
    useState(false);
  const [isStudentFeedbackModalOpen, setStudentFeedbackModalOpen] =
    useState(false);
  if (isProfessor) {
    return (
      <div className="flex gap-4">
        <Modal
          title="Feedback do professor"
          text={professorFeedback}
          isOpen={isProfessorFeedbackModalOpen}
          close={() => setProfessorFeedbackModalOpen(false)}
          onSubmit={async (updatedFeedback) => {
            await updateProfessorFeedback(updatedFeedback);
          }}
          editing={!professorFeedback}
        />
        <SimpleModal
          title="Auto avaliação do aluno"
          text={studentFeedback}
          isOpen={isStudentFeedbackModalOpen}
          close={() => setStudentFeedbackModalOpen(false)}
        />
        <button
          onClick={() => setStudentFeedbackModalOpen(true)}
          disabled={!studentFeedback}
          className="btn btn-outline flex-auto"
        >
          {studentFeedback
            ? 'Ver auto avaliação do aluno'
            : 'Ainda sem feedback do aluno'}
        </button>
        {professorFeedback ? (
          <button
            onClick={() => setProfessorFeedbackModalOpen(true)}
            className="btn btn-outline flex-auto"
          >
            Seu feedback
          </button>
        ) : (
          <button
            onClick={() => setProfessorFeedbackModalOpen(true)}
            className="btn btn-outline flex-auto"
          >
            Adicionar feedback
          </button>
        )}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-2">
      <SimpleModal
        title="Feedback do professor"
        text={professorFeedback}
        isOpen={isProfessorFeedbackModalOpen}
        close={() => setProfessorFeedbackModalOpen(false)}
      />
      <Modal
        title="Auto avaliação"
        text={studentFeedback}
        isOpen={isStudentFeedbackModalOpen}
        close={() => setStudentFeedbackModalOpen(false)}
        onSubmit={async (updatedFeedback) => {
          await updateStudentFeedback(updatedFeedback);
        }}
        editing={!studentFeedback}
      />
      {studentFeedback ? (
        <button
          className="btn btn-outline flex-auto"
          onClick={() => setStudentFeedbackModalOpen(true)}
        >
          Ver sua auto avaliação
        </button>
      ) : (
        <button
          onClick={() => setStudentFeedbackModalOpen(true)}
          className="btn btn-outline flex-auto"
        >
          Adicionar auto avaliação
        </button>
      )}

      <button
        className="btn btn-outline flex-auto"
        disabled={
          !professorFeedback ||
          ((professorFeedback && !studentFeedback) as boolean)
        }
        onClick={() => setProfessorFeedbackModalOpen(true)}
      >
        {professorFeedback
          ? studentFeedback
            ? 'Ver avaliação do professor'
            : 'Adicione a sua auto avaliação antes de ver o do professor'
          : 'Ainda sem avaliação do professor'}
      </button>
    </div>
  );
};

const CallIcon: FC<{ url?: string }> = ({ url }) => {
  if (!url) {
    return null;
  }
  if (url.toLocaleLowerCase().includes('meet')) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        <SiGooglemeet size={25} />
      </a>
    );
  }
  if (url.toLocaleLowerCase().includes('teams')) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        <SiMicrosoftteams size={25} />
      </a>
    );
  }
  if (url.toLocaleLowerCase().includes('discord')) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        <FaDiscord size={25} />
      </a>
    );
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <FiVideo size={25} />
    </a>
  );
};

interface AttachmentIconProps {
  path: string;
  name: string;
  isProfessor: boolean;
}

const AttachmentIcon: FC<AttachmentIconProps> = ({
  path,
  name,
  isProfessor,
}) => {
  const [url, setUrl] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string>('LOADING');
  const [seeActions, setSeeActions] = useState<boolean>(false);
  const icons: Record<string, IconType> = {
    pdf: AiOutlineFilePdf,
    xls: AiOutlineFileExcel,
    xlsx: AiOutlineFileExcel,
  };
  useEffect(() => {
    async function getFileUrlFromPath(path: string) {
      setStatus('LOADING');
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(path, 600);
      if (error) {
        setStatus('ERROR');
      }
      setStatus('SUCCESS');
      setUrl(data!.signedURL);
    }
    getFileUrlFromPath(path);
  }, [path, setUrl, setStatus]);

  async function handleDeleteFile() {
    if (!isProfessor) return;
    const supabaseClient = await getSupabaseClient();
    const { error: errorRemovingFile } = await supabaseClient.storage
      .from('documents')
      .remove([path]);
    if (errorRemovingFile) {
      return;
    }
    const { error: errorRemovingFromDatabase } = await supabaseClient
      .from('documents')
      .delete()
      .match({ path });
    if (errorRemovingFromDatabase) {
      return;
    }
    window.location.reload();
  }

  const fileNameSplit: string[] = path.split('.');
  const fileExtension = fileNameSplit[fileNameSplit.length - 1];
  const Icon: IconType = icons[fileExtension];
  if (status === 'ERROR') {
    return <p>Erro ao tentar carregar arquivo</p>;
  }
  if (status === 'LOADING') {
    return <p>Carregando</p>;
  }
  return (
    <>
      <button
        className={`btn btn-ghost w-1/6 ${seeActions && 'blur-sm'}`}
        onClick={() => setSeeActions(true)}
      >
        <Icon />
        {name}
      </button>
      {seeActions && (
        <div
          className={`absolute grid grid-cols-${
            isProfessor ? '3' : '2'
          } gap-x-9`}
        >
          <a
            href={url}
            download={name}
            target="_blank"
            rel="noopener noreferrer"
            className="grid-cols-1 btn btn-ghost btn-circle"
          >
            <MdOpenInNew />
            <p>Visualizar</p>
          </a>
          {isProfessor && (
            <button
              className="grid-cols-1 btn btn-ghost btn-circle"
              onClick={() => handleDeleteFile()}
            >
              <AiFillDelete />
              <p>Deletar</p>
            </button>
          )}
          <button
            className="grid-cols-1 btn btn-ghost btn-circle"
            onClick={() => setSeeActions(false)}
          >
            <TiCancel />
            <p>Cancelar</p>
          </button>
        </div>
      )}
    </>
  );
};

export default AulaPage;