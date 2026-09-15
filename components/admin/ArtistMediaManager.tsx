// components/admin/ArtistMediaManager.tsx
"use client";

import { useState } from "react";
import { Upload, Trash2, Star, Link as LinkIcon, FileText, Music, Video, Image as ImageIcon, Loader2 } from "lucide-react";

interface MediaItem {
  id: string;
  type: "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT" | "EXTERNAL_LINK";
  url: string;
  title: string | null;
  provider: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

export default function ArtistMediaManager({ artistId, initialMedia }: { artistId: string; initialMedia: MediaItem[] }) {
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [selectedType, setSelectedType] = useState<string>("IMAGE");
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [provider, setProvider] = useState("YouTube");
  const [isPrimary, setIsPrimary] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("type", selectedType);
    formData.append("title", title);
    formData.append("isPrimary", String(isPrimary));

    if (selectedType === "EXTERNAL_LINK") {
      formData.append("url", externalUrl);
      formData.append("provider", provider);
    } else {
      if (!file) {
        setError("Please select a valid file to upload.");
        setUploading(false);
        return;
      }
      formData.append("file", file);
    }

    try {
      const res = await fetch(`/api/admin/artists/${artistId}/media`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      setMediaList((prev) => [data.media, ...prev]);
      setFile(null);
      setTitle("");
      setExternalUrl("");
      setIsPrimary(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (mediaId: string) => {
    if (!confirm("Are you sure you want to permanently delete this media item?")) return;

    try {
      const res = await fetch(`/api/admin/artists/${artistId}/media?mediaId=${mediaId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete media item");

      setMediaList((prev) => prev.filter((m) => m.id !== mediaId));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Add New Media Asset</h3>
        {error && <div className="mb-4 p-3 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-sm">{error}</div>}
        
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Media Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="IMAGE">Image (Photo / Gallery)</option>
                <option value="VIDEO">Video Upload</option>
                <option value="AUDIO">Audio Track</option>
                <option value="DOCUMENT">Document (PDF / Rider)</option>
                <option value="EXTERNAL_LINK">External Embed / Link (YouTube, Spotify, etc.)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Asset Title / Caption</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Official Press Photo or Live Set"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
              />
            </div>
          </div>

          {selectedType === "EXTERNAL_LINK" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">External URL</label>
                <input
                  type="url"
                  required
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or https://spotify.com/..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Provider Name</label>
                <input
                  type="text"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  placeholder="YouTube, Spotify, Soundcloud, Boomplay..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Select File</label>
              <input
                type="file"
                required
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-emerald-400 hover:file:bg-gray-700"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPrimary"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              className="rounded bg-gray-800 border-gray-700 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="isPrimary" className="text-sm text-gray-300">Set as Primary / Featured Cover Media</label>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? "Uploading Asset..." : "Upload & Save Media"}
          </button>
        </form>
      </div>

      {/* Media Library List */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Associated Media Assets ({mediaList.length})</h3>
        {mediaList.length === 0 ? (
          <p className="text-sm text-gray-500 py-6 text-center">No media assets associated with this artist yet.</p>
        ) : (
          <div className="divide-y divide-gray-800">
            {mediaList.map((item) => (
              <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {item.type === "IMAGE" && <ImageIcon className="w-5 h-5 text-blue-400 shrink-0" />}
                  {item.type === "VIDEO" && <Video className="w-5 h-5 text-purple-400 shrink-0" />}
                  {item.type === "AUDIO" && <Music className="w-5 h-5 text-emerald-400 shrink-0" />}
                  {item.type === "DOCUMENT" && <FileText className="w-5 h-5 text-amber-400 shrink-0" />}
                  {item.type === "EXTERNAL_LINK" && <LinkIcon className="w-5 h-5 text-cyan-400 shrink-0" />}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">{item.title || "Untitled Asset"}</p>
                      {item.isPrimary && (
                        <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-emerald-400" /> Primary
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{item.provider || item.type} • <a href={item.url} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline truncate max-w-xs inline-block align-bottom">{item.url}</a></p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
                  title="Remove Media"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}