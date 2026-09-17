import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';
import InvestmentEditor from '@/components/admin/investmentEditor';
import InvestmentMediaManager from '@/components/admin/investmentMediaManager';
export const dynamic = 'force-dynamic';

export default async function AdmininvestmentPage({
  params,
}: {
  params: { id: string };
}) {
  if (!await requireAdmin()) redirect('/admin/login');

  const investment = await db.investment.findFirst({
    where: {
      id: params.id,
      isDeleted: false,
    },
    include: {
      media: {
        orderBy: [
          { isPrimary: 'desc' },
          { sortOrder: 'asc' },
        ],
      },
    },
  });

  if (!investment) notFound();

  return (
    <main className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin/investment"
          className="text-sm font-semibold text-emerald-700 hover:underline"
        >
          ← investment management
        </Link>

        <h1 className="mt-4 text-3xl font-bold">
          {investment.name}
        </h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <InvestmentEditor investment={investment} />

          <InvestmentMediaManager
            investmentId={investment.id}
            initialMedia={investment.media}
          />
        </div>
      </div>
    </main>
  );
}
