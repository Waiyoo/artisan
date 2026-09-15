import { PublicNavbar } from '@/components/public/PublicNavbar';
import { PublicFooter } from '@/components/public/PublicFooter';
import ArtistDirectoryClient from '@/components/public/ArtistDirectoryClient';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  let initialArtists: any[] = [];
  let trendingArtists: any[] = [];
  let categories: any[] = [];
  let tags: any[] = [];
  let locations: string[] = [];
  let totalCount = 0;
  const q = typeof searchParams.q === 'string' ? searchParams.q : '';
  const category = typeof searchParams.category === 'string' ? searchParams.category : '';
  const tag = typeof searchParams.tag === 'string' ? searchParams.tag : '';
  const location = typeof searchParams.location === 'string' ? searchParams.location : '';
  const sort = searchParams.sort === 'alphabetical' || searchParams.sort === 'recent' ? searchParams.sort : 'popular';
  const requestedPage = Number(typeof searchParams.page === 'string' ? searchParams.page : '1');
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? Math.floor(requestedPage) : 1;
  const where: any = { isDeleted: false, status: 'PUBLISHED' };
  if (q) where.OR = [{ name: { contains: q, mode: 'insensitive' } }, { fullName: { contains: q, mode: 'insensitive' } }, { tagline: { contains: q, mode: 'insensitive' } }, { bio: { contains: q, mode: 'insensitive' } }];
  if (category) where.categories = { some: { category: { slug: category } } };
  if (tag) where.tags = { some: { tag: { slug: tag } } };
  if (location) where.location = { contains: location, mode: 'insensitive' };
  const orderBy = sort === 'alphabetical' ? [{ name: 'asc' as const }] : sort === 'recent' ? [{ createdAt: 'desc' as const }] : [{ isFeatured: 'desc' as const }, { profileViews: 'desc' as const }, { name: 'asc' as const }];

  try {
    initialArtists = await db.artist.findMany({
      where,
      include: {
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        media: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }], take: 1 },
      },
      take: 20,
      skip: (page - 1) * 20,
      orderBy,
    });
    
    trendingArtists = await db.artist.findMany({
      where: { isDeleted: false, status: 'PUBLISHED' },
      include: { media: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }], take: 1 } },
      take: 5,
      orderBy: [{ isFeatured: 'desc' }],
    });

    [totalCount, categories, tags] = await Promise.all([
      db.artist.count({ where }),
      db.category.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true, slug: true } }),
      db.tag.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true, slug: true } }),
    ]);
    const locationRows = await db.artist.findMany({ where: { isDeleted: false, status: 'PUBLISHED', location: { not: null } }, distinct: ['location'], select: { location: true }, orderBy: { location: 'asc' } });
    locations = locationRows.flatMap((row) => row.location ? [row.location] : []);
  } catch (err) {
    console.error("Database fetch error:", err);
  }

  return (
    <main className="min-h-screen bg-slate-950">
      <PublicNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ArtistDirectoryClient 
          initialArtists={initialArtists}
          trendingArtists={trendingArtists}
          categories={categories}
          tags={tags}
          locations={locations}
          pagination={{
            page,
            totalPages: Math.ceil(totalCount / 20) || 1,
            totalCount: totalCount,
          }}
          initialFilters={{
            q,
            category,
            tag,
            location,
            sort,
          }}
        />
      </div>
      <PublicFooter />
    </main>
  );
}
