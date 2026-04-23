import React, { useMemo } from "react";

function getVideoId(url) {
  try {
    if (!url) return null;
    if (url.includes("watch?v=")) return url.split("watch?v=")[1].split("&")[0];
    if (url.includes("youtu.be/")) return url.split("youtu.be/")[1].split("?")[0];
    if (url.includes("/embed/")) return url.split("/embed/")[1].split("?")[0];
    return url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
  } catch {
    return null;
  }
}

function Equalizer({ className = "" }) {
  return (
    <span
      className={["inline-flex items-end gap-[3px] h-4", className].join(" ")}
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-red-500/90 animate-[eq_900ms_ease-in-out_infinite]"
          style={{ animationDelay: `${i * 120}ms` }}
        />
      ))}

      <style>{`
        @keyframes eq {
          0%, 100% { height: 4px; opacity: .55; }
          25% { height: 14px; opacity: 1; }
          50% { height: 7px; opacity: .8; }
          75% { height: 12px; opacity: .95; }
        }
      `}</style>
    </span>
  );
}

export default function SongCard({ song, onPlay, isActive = false }) {
  const videoId = useMemo(() => getVideoId(song?.url), [song?.url]);

  const thumb = videoId
    ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    : "https://via.placeholder.com/480x270?text=Video";

  const duration = "3:42";

  return (
    <button
      onClick={() => onPlay(song.url)}
      className={[
        "w-full text-left group rounded-2xl border transition",
        "border-red-200 bg-white hover:bg-red-50",
        isActive ? "ring-2 ring-red-500/60 bg-red-50" : "",
      ].join(" ")}
    >
      <div className="flex gap-3 p-3">

        {/* Thumbnail */}
        <div className="relative w-[168px] shrink-0 overflow-hidden rounded-xl bg-black/10">
          <img
            src={thumb}
            alt={song.title}
            className="h-[94px] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />

          {/* Playing */}
          {isActive ? (
            <div className="absolute left-2 bottom-2 flex items-center gap-2 rounded-md bg-white/80 px-2 py-1">
              <Equalizer />
              <span className="text-[11px] text-red-600">Playing</span>
            </div>
          ) : null}

          <div className="absolute bottom-2 right-2 rounded-md bg-white/80 px-2 py-0.5 text-[11px] text-red-600">
            {duration}
          </div>

          {/* Play overlay */}
          <div className="pointer-events-none absolute inset-0 grid place-items-center opacity-0 transition group-hover:opacity-100">
            <div className="rounded-full bg-red-500/80 px-3 py-2 text-sm text-white">
              ▶ Play
            </div>
          </div>
        </div>

        {/* TEXT SECTION (RED FONT ONLY CHANGES) */}
        <div className="min-w-0 flex-1">

          <div className="flex items-start justify-between gap-2">

            <div className="min-w-0">

              <div className="truncate text-sm font-semibold text-red-600">
                {song.title}
              </div>

              <div className="mt-1 truncate text-xs text-red-400">
                {song.artist || "Unknown artist"}
              </div>

            </div>

            <div className="text-red-300 opacity-0 transition group-hover:opacity-100">
              ⋮
            </div>

          </div>

          <div className="mt-2 flex flex-wrap gap-2">

            {song.album ? (
              <span className="rounded-full border border-red-200 bg-red-50 px-2 py-1 text-[11px] text-red-600">
                {song.album}
              </span>
            ) : null}

            {song.genre ? (
              <span className="rounded-full border border-red-200 bg-red-50 px-2 py-1 text-[11px] text-red-600">
                {song.genre}
              </span>
            ) : null}

            {isActive ? (
              <span className="rounded-full border border-red-300 bg-red-100 px-2 py-1 text-[11px] text-red-600">
                Now playing
              </span>
            ) : null}

          </div>

        </div>
      </div>
    </button>
  );
}