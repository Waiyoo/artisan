import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin';
import ArtistManager from '@/components/admin/ArtistManager';

export const dynamic = 'force-dynamic';
export default async function AdminArtistsPage() { if (!await requireAdmin()) redirect('/admin/login'); return <main className="min-h-screen bg-slate-50 p-6 sm:p-10"><div className="mx-auto max-w-5xl"><Link href="/admin" className="text-sm font-semibold text-emerald-700 hover:underline">← Dashboard</Link><h1 className="mt-4 text-3xl font-bold">Artist management</h1><p className="mt-2 text-slate-600">Create, manage, publish, and archive artist profiles.</p><div className="mt-8"><ArtistManager /></div></div></main>; }
