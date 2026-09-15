import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { verifySessionToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const token = cookies().get('dr_admin_session')?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) redirect('/admin/login');

  const [admin, artists, published, drafts] = await Promise.all([
    db.adminUser.findUnique({ where: { id: session.userId }, select: { email: true } }),
    db.artist.count({ where: { isDeleted: false } }),
    db.artist.count({ where: { isDeleted: false, status: 'PUBLISHED' } }),
    db.artist.count({ where: { isDeleted: false, status: 'DRAFT' } }),
  ]);

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900 sm:p-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-medium text-emerald-700">Signed in as {admin?.email}</p>
        <h1 className="mt-2 text-3xl font-bold">Platform overview</h1>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[["Artists", artists], ["Published", published], ["Drafts", drafts]].map(([label, value]) => (
            <div key={String(label)} className="rounded-xl bg-white p-6 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></div>
          ))}
        </div>
        <div className="mt-8 flex gap-5"><Link href="/admin/artists" className="text-sm font-semibold text-emerald-700 hover:underline">Manage artists →</Link><Link href="/" className="text-sm font-semibold text-emerald-700 hover:underline">View public site →</Link></div>
      </div>
    </main>
  );
}
