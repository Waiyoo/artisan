'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';

type investment = { id: string; name: string; slug: string; status: string; location: string | null };

export default function investmentManager() {
  const [investments, setinvestments] = useState<investment[]>([]); const [name, setName] = useState(''); const [error, setError] = useState(''); const [saving, setSaving] = useState(false);
  async function load() { const res = await fetch('/api/admin/investments'); if (res.ok) setinvestments((await res.json()).investments); else setError('Unable to load investments.'); }
  useEffect(() => { load(); }, []);
  async function create(event: FormEvent) { event.preventDefault(); setSaving(true); setError(''); const res = await fetch('/api/admin/investments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) }); const data = await res.json(); setSaving(false); if (!res.ok) return setError(data.error || 'Unable to create investment.'); setName(''); setinvestments((items) => [data.investment, ...items]); }
  async function remove(id: string) { if (!confirm('Archive this investment?')) return; const res = await fetch(`/api/admin/investments/${id}`, { method: 'DELETE' }); if (res.ok) setinvestments((items) => items.filter((investment) => investment.id !== id)); else setError('Unable to archive investment.'); }
  return <div className="space-y-8"><form onSubmit={create} className="flex flex-col gap-3 rounded-xl bg-white p-5 shadow-sm sm:flex-row"><input required value={name} onChange={(e) => setName(e.target.value)} placeholder="investment name" className="flex-1 rounded-lg border border-slate-300 px-3 py-2"/><button disabled={saving} className="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white disabled:opacity-60">{saving ? 'Creating…' : 'Add investment'}</button></form>{error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="overflow-hidden rounded-xl bg-white shadow-sm"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="p-4">investment</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead><tbody>{investments.map((investment) => <tr key={investment.id} className="border-t border-slate-100"><td className="p-4"><p className="font-semibold">{investment.name}</p><p className="text-slate-500">/{investment.slug}</p></td><td className="p-4">{investment.status}</td><td className="p-4"><Link href={`/admin/investments/${investment.id}`} className="font-medium text-emerald-700 hover:underline">Manage media</Link><button onClick={() => remove(investment.id)} className="ml-4 text-red-700 hover:underline">Archive</button></td></tr>)}</tbody></table>{investments.length === 0 && <p className="p-8 text-center text-slate-500">No investments yet. Create your first profile above.</p>}</div></div>;
}
