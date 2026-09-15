import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/auth';

export async function requireAdmin() {
  const token = cookies().get('dr_admin_session')?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) return null;
  return session;
}
