import { supabase } from '~/lib/supabase/supabase.server';
import { USER_ENTITY_SELECT, UserEntity } from '~/back/service/user.service';
import slug from 'slug';
import { ROLE_ENTITY_SELECT } from '~/back/service/role.service';

export interface ClassroomEntity {
  id: string;
  professor_id: string;
  professor: UserEntity;
  name: string;
  slug: string;
  createdAt: string;
  student_id?: string;
  student?: UserEntity;
}

export const CLASSROOM_ENTITY_SELECT = `
  *,
  student: classroom_student_id_fkey(${USER_ENTITY_SELECT}),
  professor: classroom_professor_id_fkey(${USER_ENTITY_SELECT})
`;

export async function getProfessorClassrooms(
  professorId: string
): Promise<ClassroomEntity[]> {
  const { data, error } = await supabase
    .from<ClassroomEntity>('classroom')
    .select(CLASSROOM_ENTITY_SELECT)
    .match({ professor_id: professorId });

  if (!data) {
    throw new Error(error?.message ?? 'Classrooms not found');
  }

  return data;
}

export async function getStudentClassrooms(
  studentId: string
): Promise<ClassroomEntity[]> {
  const { data, error } = await supabase
    .from<ClassroomEntity>('classroom')
    .select(CLASSROOM_ENTITY_SELECT)
    .match({ student_id: studentId });

  if (!data) {
    throw new Error(error?.message ?? 'Classrooms not found');
  }

  return data;
}

export async function getClassroomBySlugAndProfessorId(
  slug: string,
  professorId: string
): Promise<ClassroomEntity> {
  const { data, error } = await supabase
    .from<ClassroomEntity>('classroom')
    .select(CLASSROOM_ENTITY_SELECT)
    .match({ professor_id: professorId, slug })
    .single();

  if (!data) {
    throw new Error(error?.message ?? 'Classroom not found');
  }

  return data;
}

export async function getClassroomById(id: string): Promise<ClassroomEntity> {
  const { data, error } = await supabase
    .from<ClassroomEntity>('classroom')
    .select(CLASSROOM_ENTITY_SELECT)
    .match({ id })
    .single();

  if (!data) {
    throw new Error(error?.message ?? 'Classroom not found');
  }

  return data;
}

export async function createClassroom(
  professorId: string,
  classroomName: string,
  studentId?: string
): Promise<ClassroomEntity> {
  let values: Partial<ClassroomEntity> = {
    professor_id: professorId,
    name: classroomName,
    slug: slug(classroomName),
  };
  if (studentId) {
    values = { ...values, student_id: studentId };
  }
  const { data: classroom, error: errorInsertingClassroom } = await supabase
    .from<ClassroomEntity>('classroom')
    .insert(values)
    .select(CLASSROOM_ENTITY_SELECT)
    .single();

  if (!classroom) {
    throw new Error(errorInsertingClassroom?.message ?? 'Unexpected error');
  }

  return classroom;
}
