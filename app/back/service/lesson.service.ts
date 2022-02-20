import { supabase } from '~/lib/supabase/supabase.server';
import {
  CLASSROOM_ENTITY_SELECT,
  ClassroomEntity,
} from '~/back/service/classroom.service';
import slug from 'slug';

export interface LessonEntity {
  name: string;
  slug: string;
  objectives: string;
  classroom_id: string;
  classroom: ClassroomEntity;
  created_at: string;
  link?: string;
  professor_feedback?: string;
  student_feedback?: string;
}

export const LESSON_ENTITY_SELECT = `
  *,
  classroom: classroom_id(${CLASSROOM_ENTITY_SELECT})
`;

export async function getLessonByLessonSlugAndClassroomId(
  slug: string,
  classroomId: string
) {
  const { data, error } = await supabase
    .from<LessonEntity>('lesson')
    .select(LESSON_ENTITY_SELECT)
    .match({ classroom_id: classroomId, slug })
    .single();

  if (!data) {
    throw new Error(error?.message ?? 'Unexpected Error');
  }

  return data;
}

export async function findLessonBySlug(name: string): Promise<LessonEntity[]> {
  const { data, error } = await supabase
    .from<LessonEntity>('lesson')
    .select(LESSON_ENTITY_SELECT, { count: 'exact' })
    .match({ slug: slug(name) });

  if (!data) {
    throw new Error(error?.message ?? 'Unexpected Error');
  }

  return data;
}

export async function createLesson(
  name: string,
  objectives: string,
  classroomId: string
): Promise<LessonEntity> {
  const lessonsWithSameSlug = await findLessonBySlug(name);
  let slugifiedName = name;
  if (lessonsWithSameSlug.length > 0) {
    slugifiedName = `${name}-${lessonsWithSameSlug.length}`;
  }

  const { data, error } = await supabase
    .from<LessonEntity>('lesson')
    .insert({
      slug: slug(slugifiedName),
      name: name,
      objectives: objectives,
      classroom_id: classroomId,
    })
    .select(LESSON_ENTITY_SELECT)
    .single();

  if (!data) {
    throw new Error(error?.message ?? 'Unexpected Error');
  }

  return data;
}
