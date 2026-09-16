import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, ExternalLink, ArrowLeft } from 'lucide-react';
import InvestmentMediaSection from '@/components/public/investmentMediaSection';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { PublicFooter } from '@/components/public/PublicFooter';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function investmentProfilePage({ params }: { params: { slug: string } }) {
  const investment = await db.investment.findFirst({
    where: { slug: params.slug, status: 'PUBLISHED', isDeleted: false },
    include: {
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
      media: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
      externalLinks: true,
      socialLinks: true,
      bookingContact: true,
    },
  });

  if (!investment) notFound();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <PublicNavbar />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-emerald-300 hover:text-emerald-200 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to investments
        </Link>

        <header className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-white shadow-xl sm:p-12">
          <div className="flex flex-wrap gap-2">
            {investment.categories.map(({ category }) => (
              <span key={category.id} className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200">
                {category.name}
              </span>
            ))}
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">{investment.name}</h1>
          {investment.fullName && investment.fullName !== investment.name && <p className="mt-2 text-lg text-slate-300">{investment.fullName}</p>}
          {investment.tagline && <p className="mt-5 max-w-3xl text-xl text-slate-200">{investment.tagline}</p>}
          {investment.location && <p className="mt-5 flex items-center gap-2 text-sm text-slate-300"><MapPin className="h-4 w-4" />{investment.location}</p>}
        </header>

        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-sm">
          <h2 className="text-xl font-bold">About {investment.name}</h2>
          <p className="mt-4 whitespace-pre-line leading-7 text-slate-300">{investment.bio || 'This investment has not added a biography yet.'}</p>
          {investment.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {investment.tags.map(({ tag }) => <span key={tag.id} className="rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300">#{tag.name}</span>)}
            </div>
          )}
        </section>

        <InvestmentMediaSection media={investment.media} />

        {(investment.externalLinks.length > 0 || investment.socialLinks.length > 0) && (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-sm">
            <h2 className="text-xl font-bold">Links</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {[...investment.externalLinks, ...investment.socialLinks].map((link) => (
                <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:border-emerald-500 hover:text-emerald-300">
                  <ExternalLink className="h-4 w-4" /> {'title' in link ? link.title : link.platform}
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
      <PublicFooter />
    </main>
  );
}
