import {
  LESSON_ENTITY_SELECT,
  LessonEntity,
} from '~/back/service/lesson.service';
import { supabase } from '~/lib/supabase/supabase.server';

export interface DocumentsEntity {
  id: string;
  lesson_id: string;
  professor: LessonEntity;
  path: string;
  created_at: string;
}

export const DOCUMENTS_ENTITY_SELECT = `
  *,
  lesson: lesson_id(${LESSON_ENTITY_SELECT})
`;

export async function findDocumentsByLessonId(lessonId: string) {
  const { data, error } = await supabase
    .from<DocumentsEntity>('documents')
    .select(DOCUMENTS_ENTITY_SELECT)
    .match({ lesson_id: lessonId });

  if (!data) {
    throw new Error(error?.message ?? 'Documents not found');
  }

  return data;
}
