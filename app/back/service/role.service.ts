import { supabase } from '~/lib/supabase/supabase.server';

export interface RoleEntity {
  id: string;
  name: string;
  created_at: string;
}

export const ROLE_ENTITY_SELECT = `
  *
`;

export async function getRoleById(id: string): Promise<RoleEntity> {
  const { data, error } = await supabase
    .from<RoleEntity>('role')
    .select(ROLE_ENTITY_SELECT)
    .match({ id })
    .single();
  if (!data && error) {
    throw new Error(error.message);
  }
  if (!data) {
    throw new Error('Role not found');
  }
  return data;
}

export async function getRoleByName(name: string): Promise<RoleEntity> {
  const { data, error } = await supabase
    .from<RoleEntity>('role')
    .select(ROLE_ENTITY_SELECT)
    .match({ name })
    .single();
  if (!data && error) {
    throw new Error(error.message);
  }
  if (!data) {
    throw new Error('Role not found');
  }
  return data;
}
