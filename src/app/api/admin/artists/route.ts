import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const investments = await db.investment.findMany({ where: { isDeleted: false }, orderBy: { updatedAt: 'desc' }, include: { media: { take: 1, orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] } } });
  return NextResponse.json({ investments });
}

export async function POST(request: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const slug = slugify(typeof body.slug === 'string' && body.slug ? body.slug : name);
  if (!name || !slug) return NextResponse.json({ error: 'A name and valid slug are required.' }, { status: 400 });
  try {
    const investment = await db.investment.create({ data: { name, slug, status: body.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT', bio: typeof body.bio === 'string' ? body.bio.trim() || null : null, location: typeof body.location === 'string' ? body.location.trim() || null : null } });
    return NextResponse.json({ investment }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'That investment slug is already in use.' }, { status: 409 });
  }
}
