// components/public/investmentMediaSection.tsx
import { ExternalLink, Download, Play } from "lucide-react";

interface MediaItem {
  id: string;
  type: "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT" | "EXTERNAL_LINK";
  url: string;
  title: string | null;
  provider: string | null;
}

export default function investmentMediaSection({ media }: { media: MediaItem[] }) {
  if (!media || media.length === 0) return null;

  const images = media.filter((m) => m.type === "IMAGE");
  const videos = media.filter((m) => m.type === "VIDEO" || (m.type === "EXTERNAL_LINK" && (m.url.includes("youtube") || m.url.includes("vimeo") || m.provider?.toLowerCase().includes("video"))));
  const audioTracks = media.filter((m) => m.type === "AUDIO" || (m.type === "EXTERNAL_LINK" && (m.url.includes("spotify") || m.url.includes("soundcloud") || m.url.includes("boomplay") || m.url.includes("apple"))));
  const documents = media.filter((m) => m.type === "DOCUMENT");
  const otherLinks = media.filter((m) => m.type === "EXTERNAL_LINK" && !videos.includes(m) && !audioTracks.includes(m));

  return (
    <div className="space-y-12 my-12">
      {/* Image Gallery */}
      {images.length > 0 && (
        <section>
          <h3 className="text-xl font-bold text-white mb-6">Gallery</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img) => (
              <div key={img.id} className="relative group overflow-hidden rounded-xl bg-gray-900 border border-gray-800 aspect-square">
                <img src={img.url} alt={img.title || "investment gallery image"} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                {img.title && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-xs font-medium text-white">{img.title}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Videos Section */}
      {videos.length > 0 && (
        <section>
          <h3 className="text-xl font-bold text-white mb-6">Videos & Embeds</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((vid) => {
              const isEmbed = vid.url.includes("youtube.com") || vid.url.includes("youtu.be");
              const embedUrl = isEmbed ? vid.url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/") : vid.url;

              return (
                <div key={vid.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                  {isEmbed ? (
                    <div className="aspect-video w-full">
                      <iframe src={embedUrl} title={vid.title || "Video player"} className="w-full h-full" allowFullScreen />
                    </div>
                  ) : (
                    <video controls className="w-full aspect-video bg-black" src={vid.url} preload="metadata" />
                  )}
                  {vid.title && <div className="p-4 text-sm font-medium text-white">{vid.title}</div>}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Audio Section */}
      {audioTracks.length > 0 && (
        <section>
          <h3 className="text-xl font-bold text-white mb-6">Audio & Music Streams</h3>
          <div className="space-y-4">
            {audioTracks.map((track) => (
              <div key={track.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-white text-sm">{track.title || "Audio Track"}</p>
                  <p className="text-xs text-gray-400">{track.provider || "Audio Platform"}</p>
                </div>
                {track.type === "AUDIO" ? (
                  <audio controls className="w-full sm:w-72 h-10" src={track.url} preload="none" />
                ) : (
                  <a href={track.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors w-fit">
                    <ExternalLink className="w-4 h-4" /> Listen on {track.provider || "Platform"}
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Documents Section */}
      {documents.length > 0 && (
        <section>
          <h3 className="text-xl font-bold text-white mb-6">Documents & Press Kits</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <a key={doc.id} href={doc.url} target="_blank" rel="noopener noreferrer" className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between hover:border-gray-700 transition-colors">
                <div>
                  <p className="font-medium text-white text-sm">{doc.title || "Download Document"}</p>
                  <p className="text-xs text-gray-400 uppercase">{doc.provider || "PDF Document"}</p>
                </div>
                <Download className="w-5 h-5 text-emerald-400" />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Other External Links */}
      {otherLinks.length > 0 && (
        <section>
          <h3 className="text-xl font-bold text-white mb-6">External Profiles & Links</h3>
          <div className="flex flex-wrap gap-3">
            {otherLinks.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-700 text-white text-sm font-medium transition-colors">
                <ExternalLink className="w-4 h-4 text-emerald-400" />
                {link.title || link.provider || "External Link"}
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}