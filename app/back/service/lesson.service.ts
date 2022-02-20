import { supabase } from '~/lib/supabase/supabase.server';
import {
  CLASSROOM_ENTITY_SELECT,
  ClassroomEntity,
} from '~/back/service/classroom.service';
import slug from 'slug';
import { USER_ENTITY_SELECT } from '~/back/service/user.service';

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

export async function createLesson(
  name: string,
  objectives: string,
  classroomId: string
): Promise<LessonEntity> {
  const { data, error } = await supabase
    .from<LessonEntity>('lesson')
    .insert({
      slug: slug(name),
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
