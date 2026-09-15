import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';
import ArtistEditor from '@/components/admin/ArtistEditor';
import ArtistMediaManager from '@/components/admin/ArtistMediaManager';

export const dynamic = 'force-dynamic';
export default async function AdminArtistPage({ params }: { params: { id: string } }) {
  if (!await requireAdmin()) redirect('/admin/login');
  const artist = await db.artist.findFirst({ where: { id: params.id, isDeleted: false }, include: { media: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] } } });
  if (!artist) notFound();
  return <main className="min-h-screen bg-slate-50 p-6 sm:p-10"><div className="mx-auto max-w-5xl"><Link href="/admin/artists" className="text-sm font-semibold text-emerald-700 hover:underline">← Artist management</Link><h1 className="mt-4 text-3xl font-bold">{artist.name}</h1><div className="mt-8 grid gap-8 lg:grid-cols-2"><ArtistEditor artist={artist} /><ArtistMediaManager artistId={artist.id} initialMedia={artist.media} /></div></div></main>;
}
