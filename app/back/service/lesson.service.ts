import { supabase } from '~/lib/supabase/supabase.server';
import { ROLE_ENTITY_SELECT } from '~/back/service/role.service';
import {
  CLASSROOM_ENTITY_SELECT,
  ClassroomEntity,
} from '~/back/service/classroom.service';

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
  classroom: lesson_classrom_id_fkey(${CLASSROOM_ENTITY_SELECT})),
`;

export async function createLesson(
  name: string,
  objectives: string,
  classroomId: string
): Promise<LessonEntity> {
  const { data, error } = await supabase
    .from<LessonEntity>('lesson')
    .insert({
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
