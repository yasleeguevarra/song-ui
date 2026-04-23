import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import SongCard from "./components/SongCard";
import VideoPlayer from "./components/VideoPlayer";

function uniqSorted(values) {
  return Array.from(
    new Set(values.map((v) => (v ?? "").toString().trim()).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));
}

function includesInsensitive(haystack, needle) {
  if (!needle) return true;
  return (haystack ?? "").toString().toLowerCase().includes(needle.toLowerCase());
}

function SongCardSkeleton() {
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex gap-3 p-3">
        <div className="h-[94px] w-[168px] shrink-0 rounded-lg bg-gray-200 animate-pulse" />
        <div className="min-w-0 flex-1">
          <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse" />
          <div className="mt-2 h-3 w-1/2 rounded bg-gray-200 animate-pulse" />
          <div className="mt-3 flex gap-2">
            <div className="h-6 w-20 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-6 w-24 rounded-full bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [songs, setSongs] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [artist, setArtist] = useState("All");
  const [genre, setGenre] = useState("All");

  const API_URL = "https://song-api-34w1.onrender.com/guevarra/songs";

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(API_URL);
      const data = Array.isArray(res.data) ? res.data : [];
      setSongs(data);

      if (!currentVideo && data?.[0]?.url) setCurrentVideo(data[0].url);
    } catch (err) {
      console.error(err);
      setError("Failed to load songs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const artists = useMemo(() => {
    return ["All", ...uniqSorted(songs.map((s) => s.artist))];
  }, [songs]);

  const genres = useMemo(() => {
    return ["All", ...uniqSorted(songs.map((s) => s.genre))];
  }, [songs]);

  const filteredSongs = useMemo(() => {
    const q = query.trim();

    return songs.filter((s) => {
      const matchesArtist = artist === "All" ? true : s.artist === artist;
      const matchesGenre = genre === "All" ? true : s.genre === genre;

      const matchesQuery =
        !q ||
        includesInsensitive(s.title, q) ||
        includesInsensitive(s.artist, q) ||
        includesInsensitive(s.album, q) ||
        includesInsensitive(s.genre, q);

      return matchesArtist && matchesGenre && matchesQuery;
    });
  }, [songs, query, artist, genre]);

  const currentSong = useMemo(() => {
    if (!currentVideo) return null;
    return songs.find((s) => s.url === currentVideo) || null;
  }, [songs, currentVideo]);

  const clearFilters = () => {
    setQuery("");
    setArtist("All");
    setGenre("All");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-red-600">

      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">

        <div className="flex w-full items-center gap-4 px-4 py-3">

          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-red-600 grid place-items-center font-black text-white shadow">
              ▶
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-red-600">
                Song-UI
              </div>
              <div className="text-[11px] text-red-400 -mt-0.5">
                Discover • Play • Queue
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex w-full max-w-[720px] items-center rounded-full border border-gray-300 bg-white px-4 py-2 focus-within:border-red-500">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title, artist, album, genre"
                className="w-full bg-transparent text-sm outline-none placeholder:text-red-300 text-red-600"
              />
              <div className="ml-3 text-red-400 text-sm">⌕</div>
            </div>
          </div>

          {/* Right controls */}
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={fetchSongs}
              className="rounded-full border border-red-200 bg-white px-3 py-2 text-xs text-red-600 hover:bg-red-50"
            >
              Refresh
            </button>
            <div className="h-9 w-9 rounded-full bg-red-100 border border-red-200" />
          </div>

        </div>
      </header>

      {/* Body */}
      <div className="grid w-full grid-cols-1 lg:grid-cols-[240px_1fr]">

        {/* Sidebar */}
        <aside className="hidden lg:block border-r border-gray-200 bg-white">

          <div className="sticky top-[57px] p-3">

            <nav className="space-y-1">
              {[
                { label: "Home", icon: "⌂" },
                { label: "Explore", icon: "✦" },
                { label: "Subscriptions", icon: "▦" },
              ].map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <span className="w-6 text-center text-red-400">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-4 px-3 text-[11px] uppercase tracking-wider text-red-300">
              Filters
            </div>

            <div className="mt-2 px-3">
              <div className="text-xs text-red-400 mb-2">Artist</div>
              <select
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full rounded-xl border border-red-200 bg-white px-3 py-2 text-sm text-red-600 outline-none"
              >
                {artists.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-3 px-3">
              <div className="text-xs text-red-400 mb-2">Genre</div>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full rounded-xl border border-red-200 bg-white px-3 py-2 text-sm text-red-600 outline-none"
              >
                {genres.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-3 px-3">
              <button
                onClick={clearFilters}
                className="w-full rounded-xl border border-red-200 bg-white px-3 py-2 text-xs text-red-600 hover:bg-red-50"
              >
                Clear
              </button>
            </div>

            <div className="mt-3 px-3 text-xs text-red-400">
              Showing{" "}
              <span className="text-red-600">{filteredSongs.length}</span> of{" "}
              <span className="text-red-600">{songs.length}</span>
            </div>

          </div>
        </aside>

        {/* Main */}
        <main className="px-4 py-5 lg:px-6">

          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_420px] gap-6">

            {/* Left */}
            <section className="min-w-0">

              <div className="rounded-xl overflow-hidden border border-red-200 bg-black">
                <VideoPlayer videoUrl={currentVideo} />
              </div>

              <div className="mt-4">

                <h1 className="text-xl font-semibold text-red-600">
                  {currentSong?.title || "Select a song to play"}
                </h1>

                <div className="mt-1 text-sm text-red-400">
                  {currentSong?.artist ? (
                    <span className="text-red-600">{currentSong.artist}</span>
                  ) : (
                    <span>Play songs from your list</span>
                  )}
                </div>

                <div className="mt-3 flex gap-2">
                  <button className="rounded-full bg-red-50 px-4 py-2 text-sm text-red-600 hover:bg-red-100">
                    👍 Like
                  </button>
                  <button className="rounded-full bg-red-50 px-4 py-2 text-sm text-red-600 hover:bg-red-100">
                    ⇪ Share
                  </button>
                </div>

                <div className="mt-4 rounded-xl border border-red-200 bg-white p-4 text-sm text-red-400">
                  <div className="font-semibold text-red-600">About</div>
                  <div className="mt-1">
                    Search and filter songs like a YouTube-style experience.
                  </div>
                </div>

              </div>
            </section>

            {/* Right */}
            <aside className="min-w-0">

              <div className="flex items-center justify-between">
                <div className="text-base font-semibold text-red-600">
                  Up next
                </div>
                <div className="text-xs text-red-400">
                  {loading ? "Loading…" : `${filteredSongs.length} results`}
                </div>
              </div>

              <div className="mt-3 space-y-3">

                {loading ? (
                  Array.from({ length: 8 }).map((_, idx) => (
                    <SongCardSkeleton key={idx} />
                  ))
                ) : filteredSongs.length === 0 ? (
                  <div className="rounded-xl border border-red-200 bg-white p-4 text-sm text-red-400">
                    No matches
                  </div>
                ) : (
                  filteredSongs.map((song) => (
                    <SongCard
                      key={song.id}
                      song={song}
                      onPlay={setCurrentVideo}
                      isActive={song.url === currentVideo}
                    />
                  ))
                )}

              </div>
            </aside>

          </div>
        </main>
      </div>
    </div>
  );
}