// components/public/ArtistCard.tsx
import Link from "next/link";
import { MapPin, Sparkles, TrendingUp } from "lucide-react";
import { StatusBadge } from "@/components/ui/DesignPrimitives";

interface ArtistCardProps {
  artist: {
    id: string;
    name: string;
    slug: string;
    bio?: string | null;
    location?: string | null;
    isFeatured?: boolean;
    profileViews?: number;
    categories?: { category: { name: string; slug: string } }[];
    tags?: { tag: { id: string; name: string; slug: string } }[];
    media?: { url: string }[];
  };
}

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Link
      href={`/artists/${artist.slug}`}
      className="group bg-neutral-900/80 border border-neutral-800/80 rounded-xl overflow-hidden hover:border-neutral-700 hover:shadow-xl hover:shadow-black/40 transition-all duration-300 flex flex-col"
    >
      <div className="aspect-[4/5] bg-neutral-950 relative overflow-hidden">
        {artist.media?.[0]?.url ? (
          <img
            src={artist.media[0].url}
            alt={artist.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-600 text-xs font-mono">
            No Imagery
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {artist.isFeatured && (
            <span className="inline-flex items-center gap-1 bg-amber-500/90 text-neutral-950 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md">
              <Sparkles className="w-3 h-3" /> Featured
            </span>
          )}
        </div>

        {artist.categories?.[0] && (
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="text-xs font-medium text-amber-200 bg-neutral-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-neutral-800">
              {artist.categories[0].category.name}
            </span>
            {artist.location && (
              <span className="text-xs text-neutral-300 flex items-center gap-1 bg-neutral-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-neutral-800">
                <MapPin className="w-3 h-3 text-rose-400" /> {artist.location}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors font-serif">
            {artist.name}
          </h3>
          {artist.bio && <p className="text-xs text-neutral-400 mt-1.5 line-clamp-2 leading-relaxed">{artist.bio}</p>}
        </div>

        {artist.tags && artist.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2 border-t border-neutral-800/60">
            {artist.tags.slice(0, 3).map((t) => (
              <span key={t.tag.id} className="text-[10px] bg-neutral-950 text-neutral-400 border border-neutral-800 px-2 py-0.5 rounded">
                #{t.tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}