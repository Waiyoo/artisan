import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const data: Record<string, unknown> = {};
  for (const key of ['name', 'fullName', 'tagline', 'bio', 'location', 'customEmail', 'customWhatsapp', 'customWebsite']) if (typeof body[key] === 'string' || body[key] === null) data[key] = body[key];
  if (body.status === 'DRAFT' || body.status === 'PUBLISHED') data.status = body.status;
  if (typeof body.isFeatured === 'boolean') data.isFeatured = body.isFeatured;
  if (typeof body.isTrending === 'boolean') data.isTrending = body.isTrending;
  const artist = await db.artist.update({ where: { id: params.id }, data });
  return NextResponse.json({ artist });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await db.artist.update({ where: { id: params.id }, data: { isDeleted: true, deletedAt: new Date() } });
  return new NextResponse(null, { status: 204 });
}
