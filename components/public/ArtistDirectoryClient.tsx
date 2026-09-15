// components/public/ArtistDirectoryClient.tsx
"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, X, TrendingUp, MapPin, SlidersHorizontal, ChevronRight, ChevronLeft } from "lucide-react";

interface Artist {
  id: string;
  name: string;
  fullName: string | null;
  slug: string;
  bio: string | null;
  location: string | null;
  profileViews: number;
  categories?: { category: { name: string; slug: string } }[];
  tags?: { tag: { id: string; name: string; slug: string } }[];
  media?: { url: string }[];
}

interface Props {
  initialArtists: Artist[];
  categories: { id: string; name: string; slug: string }[];
  tags: { id: string; name: string; slug: string }[];
  locations: string[];
  trendingArtists: Artist[];
  pagination: { page: number; totalPages: number; totalCount: number };
  initialFilters: { q: string; category?: string; tag?: string; location?: string; sort: string };
}

export default function ArtistDirectoryClient({
  initialArtists,
  categories,
  tags,
  locations,
  trendingArtists,
  pagination,
  initialFilters,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(initialFilters.q);
  const [category, setCategory] = useState(initialFilters.category || "");
  const [tag, setTag] = useState(initialFilters.tag || "");
  const [location, setLocation] = useState(initialFilters.location || "");
  const [sort, setSort] = useState(initialFilters.sort);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
    setCategory(searchParams.get("category") || "");
    setTag(searchParams.get("tag") || "");
    setLocation(searchParams.get("location") || "");
    setSort(searchParams.get("sort") || "popular");
  }, [searchParams]);

  const updateURL = (newParams: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    params.delete("page"); // Reset pagination on new filter combination

    startTransition(() => {
      router.push(`/artists?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL({ q: query });
  };

  const clearAllFilters = () => {
    setQuery("");
    setCategory("");
    setTag("");
    setLocation("");
    setSort("popular");
    router.push("/artists");
  };

  const hasActiveFilters = query || category || tag || location;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Desktop Filter Sidebar */}
      <aside className="hidden lg:block space-y-6 bg-gray-900 border border-gray-800 rounded-xl p-6 h-fit sticky top-20">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-400" /> Filters
          </h3>
          {hasActiveFilters && (
            <button onClick={clearAllFilters} className="text-xs text-emerald-400 hover:underline">
              Clear All
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Categories</label>
          <div className="space-y-1">
            <button
              onClick={() => updateURL({ category: undefined })}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!category ? "bg-emerald-950/60 text-emerald-300 font-medium" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateURL({ category: cat.slug })}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${category === cat.slug ? "bg-emerald-950/60 text-emerald-300 font-medium" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Location Filter */}
        {locations.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-gray-800">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Location</label>
            <select
              value={location}
              onChange={(e) => updateURL({ location: e.target.value || undefined })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        )}

        {/* Tag Filter */}
        <div className="space-y-3 pt-4 border-t border-gray-800">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tags</label>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <button
                key={t.id}
                onClick={() => updateURL({ tag: tag === t.slug ? undefined : t.slug })}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${tag === t.slug ? "bg-emerald-600 text-white border-emerald-500" : "bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-600"}`}
              >
                #{t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Automatic Trending Widget */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Trending Artists
          </h4>
          <div className="space-y-2.5">
            {trendingArtists.slice(0, 3).map((item) => (
              <a key={item.id} href={`/artists/${item.slug}`} className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-gray-800 overflow-hidden shrink-0">
                  {item.media?.[0]?.url && <img src={item.media[0].url} alt={item.name} className="w-full h-full object-cover" />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-white group-hover:text-emerald-400 truncate">{item.name}</p>
                  <p className="text-[10px] text-gray-400">{item.profileViews} views</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Results Section */}
      <div className="lg:col-span-3 space-y-6">
        {/* Search & Sort Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-900 border border-gray-800 rounded-xl p-4">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by stage name, full name, bio, location..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
            />
          </form>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
            <select
              value={sort}
              onChange={(e) => updateURL({ sort: e.target.value })}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm w-full sm:w-auto"
            >
              <option value="popular">Sort: Popular</option>
              <option value="recent">Sort: Recently Added</option>
              <option value="alphabetical">Sort: Alphabetical</option>
            </select>

            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>

        {/* Active Filters Indicators */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 bg-gray-900/50 border border-gray-800/80 p-3 rounded-xl">
            <span className="text-xs text-gray-400 font-medium mr-2">Active Filters:</span>
            {query && (
              <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                Query: {query} <button onClick={() => updateURL({ q: undefined })}><X className="w-3 h-3" /></button>
              </span>
            )}
            {category && (
              <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                Category: {category} <button onClick={() => updateURL({ category: undefined })}><X className="w-3 h-3" /></button>
              </span>
            )}
            {location && (
              <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                Location: {location} <button onClick={() => updateURL({ location: undefined })}><X className="w-3 h-3" /></button>
              </span>
            )}
            {tag && (
              <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                Tag: #{tag} <button onClick={() => updateURL({ tag: undefined })}><X className="w-3 h-3" /></button>
              </span>
            )}
            <button onClick={clearAllFilters} className="text-xs text-red-400 hover:underline ml-auto font-medium">
              Reset All
            </button>
          </div>
        )}

        {/* Empty State Handler */}
        {initialArtists.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center space-y-4">
            <div className="w-12 h-12 bg-gray-800 text-gray-400 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">No artists matched your search or filter combination</h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              No profiles match your active search terms or filters. Try clearing your filters or exploring another category.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors inline-block"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {initialArtists.map((artist) => (
              <a key={artist.id} href={`/artists/${artist.slug}`} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all group flex flex-col">
                <div className="aspect-square bg-gray-800 relative overflow-hidden">
                  {artist.media?.[0]?.url ? (
                    <img src={artist.media[0].url} alt={artist.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">No Image Available</div>
                  )}
                  {artist.categories?.[0] && (
                    <span className="absolute top-3 left-3 bg-gray-950/80 backdrop-blur text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold px-2.5 py-1 rounded-full">
                      {artist.categories[0].category.name}
                    </span>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors text-base">{artist.name}</h3>
                    {artist.location && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-emerald-400" /> {artist.location}
                      </p>
                    )}
                    {artist.bio && <p className="text-xs text-gray-400 mt-2 line-clamp-2">{artist.bio}</p>}
                  </div>
                  {artist.tags && artist.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-4">
                      {artist.tags.slice(0, 2).map((t) => (
                        <span key={t.tag.id} className="text-[10px] bg-gray-800 text-gray-300 px-2 py-0.5 rounded">
                          #{t.tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between pt-6 border-t border-gray-800">
            <span className="text-xs text-gray-400">
              Showing page <strong className="text-white">{pagination.page}</strong> of <strong className="text-white">{pagination.totalPages}</strong> ({pagination.totalCount} total)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("page", String(pagination.page - 1));
                  router.push(`/artists?${params.toString()}`);
                }}
                className="px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm text-white disabled:opacity-40 hover:bg-gray-800 transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("page", String(pagination.page + 1));
                  router.push(`/artists?${params.toString()}`);
                }}
                className="px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm text-white disabled:opacity-40 hover:bg-gray-800 transition-colors flex items-center gap-1"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end lg:hidden">
          <div className="w-full max-w-xs bg-gray-900 border-l border-gray-800 h-full p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5 text-emerald-400" /> Filter Artists
                </h3>
                <button onClick={() => setMobileFilterOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Categories */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Categories</label>
                <div className="space-y-1">
                  <button
                    onClick={() => { updateURL({ category: undefined }); setMobileFilterOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${!category ? "bg-emerald-950 text-emerald-300 font-medium" : "text-gray-400"}`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { updateURL({ category: cat.slug }); setMobileFilterOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${category === cat.slug ? "bg-emerald-950 text-emerald-300 font-medium" : "text-gray-400"}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Locations */}
              {locations.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-gray-800">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Location</label>
                  <select
                    value={location}
                    onChange={(e) => { updateURL({ location: e.target.value || undefined }); setMobileFilterOpen(false); }}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                  >
                    <option value="">All Locations</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Mobile Tags */}
              <div className="space-y-3 pt-4 border-t border-gray-800">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tags</label>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => { updateURL({ tag: tag === t.slug ? undefined : t.slug }); setMobileFilterOpen(false); }}
                      className={`text-xs px-2.5 py-1 rounded-full border ${tag === t.slug ? "bg-emerald-600 text-white border-emerald-500" : "bg-gray-800 text-gray-300 border-gray-700"}`}
                    >
                      #{t.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-800 flex gap-3">
              <button
                onClick={() => { clearAllFilters(); setMobileFilterOpen(false); }}
                className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Reset All
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}