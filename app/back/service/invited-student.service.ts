import { supabase } from '~/lib/supabase/supabase.server';
import { ClassroomEntity } from '~/back/service/classroom.service';

export interface InvitedStudentEntity {
  email: string;
  classroom_id: string;
  classroom: ClassroomEntity;
  created_at: string;
}

export async function createInviteStudent(
  studentEmail: string,
  classroomId: string
): Promise<InvitedStudentEntity> {
  const { data, error } = await supabase
    .from<InvitedStudentEntity>('invited_student')
    .insert({
      email: studentEmail,
      classroom_id: classroomId,
    })
    .select(
      `
        *,
        classroom(
          *,
          student: classroom_student_id_fkey(*, role(id, name, created_at)),
          professor: classroom_professor_id_fkey(*, role(id, name, created_at))
        )`
    )
    .single();

  if (!data) {
    throw new Error(error?.message ?? 'Unexpected Error');
  }

  return data;
}
