import { ChangeEvent, FC, useEffect, useState } from 'react';
import {
  AiFillDelete,
  AiOutlineFileExcel,
  AiOutlineFilePdf,
  AiOutlineUpload,
} from 'react-icons/ai';
import { IconType } from 'react-icons';
import { SiGooglemeet, SiMicrosoftteams } from 'react-icons/si';
import { FaDiscord } from 'react-icons/fa';
import { FiVideo } from 'react-icons/fi';
import { Link, LoaderFunction, redirect, useLoaderData } from 'remix';
import { AppLayout } from '~/components/AppLayout';
import { getUserByRequestToken, isAuthenticated } from '~/lib/auth';
import { getSupabaseClient } from '~/lib/supabase';
import { Modal } from '~/components/Modal';
import { SimpleModal } from '~/components/SimpleModal';
import { TiCancel } from 'react-icons/ti';
import { MdOpenInNew } from 'react-icons/md';
import { ModalChangeLessonLink } from '~/components/modal-change-lesson-link';
import { getUserById, UserEntity } from '~/back/service/user.service';
import {
  ClassroomEntity,
  getClassroomBySlugAndProfessorId,
  getClassroomBySlugAndStudentId,
} from '~/back/service/classroom.service';
import { getRoleById } from '~/back/service/role.service';
import {
  findLessonsByClassroomIdOrderedByCreatedAt,
  LessonEntity,
} from '~/back/service/lesson.service';
import {
  DocumentsEntity,
  findDocumentsByLessonId,
} from '~/back/service/documents.service';

interface LessonWithDocuments extends LessonEntity {
  documents: DocumentsEntity[];
}

interface AulaPageLoaderData {
  classroom: ClassroomEntity;
  lessons: LessonWithDocuments[];
  user: UserEntity;
}

export let loader: LoaderFunction = async ({ request, params }) => {
  if (!(await isAuthenticated(request))) return redirect('/login');
  const { user } = await getUserByRequestToken(request);
  let foundUser: UserEntity;
  try {
    foundUser = await getUserById(user.id);
  } catch (e) {
    return redirect('/login');
  }

  const userRole = await getRoleById(foundUser.role_id);

  const classroom =
    userRole.name === 'PROFESSOR'
      ? await getClassroomBySlugAndProfessorId(
          params.slug as string,
          foundUser.id
        )
      : await getClassroomBySlugAndStudentId(
          params.slug as string,
          foundUser.id
        );

  const lessons = await findLessonsByClassroomIdOrderedByCreatedAt(
    classroom.id
  );

  const lessonsWithDocuments: LessonWithDocuments[] = await Promise.all(
    lessons.map<Promise<LessonWithDocuments>>(async (lesson) => {
      return { ...lesson, documents: await findDocumentsByLessonId(lesson.id) };
    })
  );

  return { classroom, lessons: lessonsWithDocuments, user: foundUser };
};

const AulaPage = () => {
  const { classroom, lessons, user } = useLoaderData<AulaPageLoaderData>();
  return (
    <AppLayout>
      <h1 className="text-2xl">{classroom.name}</h1>
      <div className="divider" />
      {user.role.name === 'PROFESSOR' && (
        <div className="flex justify-end">
          <Link to={`/sala/${classroom.slug}/nova-aula`}>
            <button className="btn">+ aula</button>
          </Link>
        </div>
      )}

      {!lessons.length && (
        <div className="grid grid-cols-1 place-items-center w-full h-full">
          <h1 className="text-xl">
            Oh oh, parece que ainda não tem nenhuma aula!
          </h1>
        </div>
      )}
      <div className="grid grid-cols-1 place-items-center">
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
      </div>
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
    <div className="card shadow-xl my-10 w-4/5">
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
        <p className="my-4">{objectives}</p>
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
        <div className="divider" />
        <h3>Arquivos</h3>
        <div className="grid grid-cols-4 gap-4 sm:grid-cols-2 sm:gap-0 content-center my-6">
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
              const linkWithoutHttps = link.replace(/^https?:\/\//, '');
              const supabase = await getSupabaseClient();
              const { error } = await supabase
                .from('lesson')
                .update({
                  link: `https://${linkWithoutHttps}`,
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
      <div className="grid grid-cols-2 gap-8 place-items-center">
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
          className="btn btn-outline w-full"
        >
          {studentFeedback
            ? 'Ver auto avaliação do aluno'
            : 'Ainda sem feedback do aluno'}
        </button>
        {professorFeedback ? (
          <button
            onClick={() => setProfessorFeedbackModalOpen(true)}
            className="btn btn-outline w-full"
          >
            Seu feedback
          </button>
        ) : (
          <button
            onClick={() => setProfessorFeedbackModalOpen(true)}
            className="btn btn-outline w-full"
          >
            Adicionar feedback
          </button>
        )}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-8 place-items-center">
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
          className="btn btn-outline w-full"
          onClick={() => setStudentFeedbackModalOpen(true)}
        >
          Ver sua auto avaliação
        </button>
      ) : (
        <button
          onClick={() => setStudentFeedbackModalOpen(true)}
          className="btn btn-outline w-full"
        >
          Adicionar auto avaliação
        </button>
      )}

      <button
        className="btn btn-outline w-full"
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
        {name.split('.').slice(0, -1).join('.')}
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
