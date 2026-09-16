import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';
import { deleteFileFromStorage, uploadFileToStorage } from '@/lib/storage';

const TYPES = new Set(['IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'EXTERNAL_LINK']);

export async function POST(request: Request, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const form = await request.formData();
  const type = String(form.get('type') || '');
  if (!TYPES.has(type)) return NextResponse.json({ error: 'Invalid media type.' }, { status: 400 });
  const title = String(form.get('title') || '').trim() || null;
  const isPrimary = form.get('isPrimary') === 'true';
  let url = '';
  let provider: string | null = null;
  let mimeType: string | null = null;
  let sizeBytes: number | null = null;
  if (type === 'EXTERNAL_LINK') {
    url = String(form.get('url') || '');
    try { new URL(url); } catch { return NextResponse.json({ error: 'A valid external URL is required.' }, { status: 400 }); }
    provider = String(form.get('provider') || '').trim() || null;
  } else {
    const file = form.get('file');
    if (!(file instanceof File) || file.size === 0) return NextResponse.json({ error: 'A file is required.' }, { status: 400 });
    const uploaded = await uploadFileToStorage(file, `investments/${params.id}`);
    url = uploaded.url; mimeType = uploaded.mimeType; sizeBytes = uploaded.sizeBytes;
  }
  if (isPrimary) await db.investmentMedia.updateMany({ where: { investmentId: params.id }, data: { isPrimary: false } });
  const media = await db.investmentMedia.create({ data: { investmentId: params.id, type: type as any, url, title, provider, mimeType, sizeBytes, isPrimary } });
  return NextResponse.json({ media }, { status: 201 });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const mediaId = new URL(request.url).searchParams.get('mediaId');
  if (!mediaId) return NextResponse.json({ error: 'mediaId is required.' }, { status: 400 });
  const media = await db.investmentMedia.findFirst({ where: { id: mediaId, investmentId: params.id } });
  if (!media) return NextResponse.json({ error: 'Media not found.' }, { status: 404 });
  await db.investmentMedia.delete({ where: { id: media.id } });
  await deleteFileFromStorage(media.url);
  return new NextResponse(null, { status: 204 });
}
