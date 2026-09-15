import { redirect } from 'next/navigation';

// The homepage is the canonical directory. Retaining this route keeps existing
// bookmarks and links working without maintaining a second, divergent directory.
export default function ArtistsDirectoryPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === 'string') params.set(key, value);
  });
  redirect(params.size ? `/?${params.toString()}` : '/');
}
