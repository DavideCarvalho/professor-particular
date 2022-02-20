import { supabase } from '~/lib/supabase/supabase.server';
import { ROLE_ENTITY_SELECT, RoleEntity } from '~/back/service/role.service';

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  role_id: string;
  role: RoleEntity;
  avatar_url?: string;
  stripe_id?: string;
  updated_at: string;
}

export const USER_ENTITY_SELECT = `
  *,
  role(${ROLE_ENTITY_SELECT})
`;

export async function getUserById(id: string): Promise<UserEntity> {
  const { data, error } = await supabase
    .from<UserEntity>('user')
    .select(USER_ENTITY_SELECT)
    .match({ id })
    .single();
  if (!data) {
    if (error?.message.includes('multiple (or no) rows returned'))
      throw new Error('User not found');
    if (error) throw new Error(error.message);
    throw new Error('Unexpected Error');
  }
  return data as UserEntity;
}

export async function getProfessorById(
  professorId: string
): Promise<UserEntity> {
  const { data, error } = await supabase
    .from<UserEntity>('user')
    .select(USER_ENTITY_SELECT)
    .match({ id: professorId, 'role.name': 'PROFESSOR' })
    .single();
  if (!data) {
    if (error?.message.includes('multiple (or no) rows returned'))
      throw new Error('Professor not found');
    if (error) throw new Error(error.message);
    throw new Error('Unexpected Error');
  }
  return data;
}

export async function getStudentById(studentId: string): Promise<UserEntity> {
  const { data, error } = await supabase
    .from<UserEntity>('user')
    .select(USER_ENTITY_SELECT)
    .match({ id: studentId, 'role.name': 'STUDENT' })
    .single();
  if (!data) {
    if (error?.message.includes('multiple (or no) rows returned'))
      throw new Error('Student not found');
    if (error) throw new Error(error.message);
    throw new Error('Unexpected Error');
  }
  return data;
}

export async function getStudentByEmail(
  studentEmail: string
): Promise<UserEntity> {
  const { data, error } = await supabase
    .from<UserEntity>('user')
    .select(USER_ENTITY_SELECT)
    .match({ email: studentEmail, 'role.name': 'STUDENT' })
    .single();
  if (!data) {
    if (error?.message.includes('multiple (or no) rows returned'))
      throw new Error('Student not found');
    if (error) throw new Error(error.message);
    throw new Error('Unexpected Error');
  }
  return data;
}
