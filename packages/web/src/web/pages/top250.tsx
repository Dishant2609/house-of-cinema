import { useState, useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { Trophy, Star, Calendar, Globe, Filter, ChevronUp, ChevronDown } from "lucide-react";
import { movies, img, MOVIE_GENRES, getLanguageName } from "../lib/tmdb";
import type { TMDBMovie } from "../lib/tmdb";
import MovieModal from "../components/MovieModal";
import { useWatchlistContext } from "../context/WatchlistContext";
import { Bookmark } from "lucide-react";

type SortKey = "rank" | "rating" | "votes" | "year" | "title";
type SortDir = "asc" | "desc";

const RANK_COLORS = ["text-[#FFD700]", "text-[#C0C0C0]", "text-[#CD7F32]"];
const RANK_BG = ["bg-[#FFD700]/10 border-[#FFD700]/30", "bg-[#C0C0C0]/10 border-[#C0C0C0]/30", "bg-[#CD7F32]/10 border-[#CD7F32]/30"];

export default function Top250Page() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [genreFilter, setGenreFilter] = useState<number | null>(null);
  const [langFilter, setLangFilter] = useState<string | null>(null);
  const { add, remove, isInWatchlist } = useWatchlistContext();

  // Fetch 13 pages of top-rated to get 250+ movies
  const pageQueries = useQueries({
    queries: Array.from({ length: 13 }, (_, i) => ({
      queryKey: ["top-rated", i + 1],
      queryFn: () => movies.topRated(i + 1),
      staleTime: 60 * 60 * 1000,
    })),
  });

  const isLoading = pageQueries.some((q) => q.isLoading);

  const allMovies: TMDBMovie[] = useMemo(() => {
    const seen = new Set<number>();
    const list: TMDBMovie[] = [];
    for (const q of pageQueries) {
      if (q.data?.results) {
        for (const m of q.data.results) {
          if (!seen.has(m.id)) {
            seen.add(m.id);
            list.push(m);
          }
        }
      }
    }
    // Sort by vote_average desc, then vote_count desc — canonical ranking
    return list
      .filter((m) => m.vote_count > 200)
      .sort((a, b) =>
        b.vote_average !== a.vote_average
          ? b.vote_average - a.vote_average
          : b.vote_count - a.vote_count
      )
      .slice(0, 250);
  }, [pageQueries]);

  // Collect unique genres + languages for filters
  const genres = useMemo(() => {
    const map = new Map<number, string>();
    allMovies.forEach((m) =>
      m.genre_ids?.forEach((id) => {
        if (MOVIE_GENRES[id]) map.set(id, MOVIE_GENRES[id]);
      })
    );
    return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [allMovies]);

  const languages = useMemo(() => {
    const set = new Set<string>();
    allMovies.forEach((m) => set.add(m.original_language));
    return [...set].sort();
  }, [allMovies]);

  const filtered = useMemo(() => {
    let list = [...allMovies];
    if (genreFilter) list = list.filter((m) => m.genre_ids?.includes(genreFilter));
    if (langFilter) list = list.filter((m) => m.original_language === langFilter);
    // Apply sort
    list.sort((a, b) => {
      let diff = 0;
      if (sortKey === "rank") {
        // rank = position in allMovies (already sorted by rating/votes)
        diff = allMovies.indexOf(a) - allMovies.indexOf(b);
      } else if (sortKey === "rating") {
        diff = b.vote_average - a.vote_average;
      } else if (sortKey === "votes") {
        diff = b.vote_count - a.vote_count;
      } else if (sortKey === "year") {
        const ya = a.release_date?.split("-")[0] || "0";
        const yb = b.release_date?.split("-")[0] || "0";
        diff = yb.localeCompare(ya);
      } else if (sortKey === "title") {
        diff = a.title.localeCompare(b.title);
      }
      return sortDir === "asc" ? diff : -diff;
    });
    return list;
  }, [allMovies, genreFilter, langFilter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };
  const setDir = setSortDir;

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (
      sortDir === "asc" ? <ChevronUp size={12} className="text-[#c4843a]" /> : <ChevronDown size={12} className="text-[#c4843a]" />
    ) : (
      <ChevronUp size={12} className="text-[#2a2a3a]" />
    );

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <Trophy size={22} className="text-[#c4843a]" />
            <span className="font-inter text-xs tracking-[0.3em] uppercase text-[#c4843a]">Greatest Films Ever Made</span>
          </div>
          <h1 className="font-cinzel text-4xl md:text-5xl font-black text-[#f5f0e8] mb-2">Top 250 Movies</h1>
          <p className="font-inter text-[#9a9098] text-sm">
            Ranked by TMDB rating · {isLoading ? "Loading..." : `${allMovies.length} films ranked`}
          </p>
          <div className="mt-5 h-px w-24 bg-gradient-to-r from-[#c4843a] to-transparent" />
        </div>

        {/* Top 3 podium */}
        {!isLoading && allMovies.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-12">
            {[allMovies[1], allMovies[0], allMovies[2]].map((movie, podiumIdx) => {
              const rank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3;
              const realIdx = rank - 1;
              return (
                <div
                  key={movie.id}
                  onClick={() => setSelectedId(movie.id)}
                  className={`relative cursor-pointer rounded-2xl border overflow-hidden group transition-all duration-300 hover:scale-[1.02] ${RANK_BG[realIdx]} ${podiumIdx === 1 ? "row-start-1 -mt-4" : "mt-4"}`}
                >
                  <div className="relative aspect-[2/3]">
                    <img
                      src={img.poster(movie.poster_path, "w500")}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent" />
                    <div className={`absolute top-3 left-3 font-cinzel text-3xl font-black ${RANK_COLORS[realIdx]}`}>
                      #{rank}
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-cinzel text-sm font-bold text-[#f5f0e8] line-clamp-1">{movie.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Star size={11} className="text-[#c4843a] fill-[#c4843a]" />
                      <span className="text-[#c4843a] font-bold text-sm">{movie.vote_average.toFixed(1)}</span>
                      <span className="text-[#4a4558] text-xs">{movie.release_date?.split("-")[0]}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Filter size={14} className="text-[#4a4558]" />
          <select
            value={genreFilter ?? ""}
            onChange={(e) => setGenreFilter(e.target.value ? Number(e.target.value) : null)}
            className="bg-[#12121e] border border-[#1e1e30] text-[#9a9098] font-inter text-xs px-3 py-2 rounded-lg outline-none focus:border-[#c4843a]/50"
          >
            <option value="">All Genres</option>
            {genres.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
          </select>
          <select
            value={langFilter ?? ""}
            onChange={(e) => setLangFilter(e.target.value || null)}
            className="bg-[#12121e] border border-[#1e1e30] text-[#9a9098] font-inter text-xs px-3 py-2 rounded-lg outline-none focus:border-[#c4843a]/50"
          >
            <option value="">All Languages</option>
            {languages.map((l) => <option key={l} value={l}>{getLanguageName(l)}</option>)}
          </select>
          {(genreFilter || langFilter) && (
            <button
              onClick={() => { setGenreFilter(null); setLangFilter(null); }}
              className="font-inter text-xs text-[#c0392b] hover:text-[#e04030] transition-colors"
            >
              Clear filters
            </button>
          )}
          <span className="ml-auto font-inter text-xs text-[#4a4558]">
            {filtered.length} films
          </span>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-[#12121e] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-[#1e1e30] overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[48px_56px_1fr_80px_90px_80px_48px] gap-2 px-4 py-3 bg-[#0d0d18] border-b border-[#1e1e30] text-[#4a4558] font-inter text-[11px] uppercase tracking-widest">
              <button onClick={() => toggleSort("rank")} className="flex items-center gap-1 hover:text-[#9a9098] transition-colors">
                # <SortIcon k="rank" />
              </button>
              <span></span>
              <button onClick={() => toggleSort("title")} className="flex items-center gap-1 hover:text-[#9a9098] transition-colors text-left">
                Title <SortIcon k="title" />
              </button>
              <button onClick={() => toggleSort("rating")} className="flex items-center gap-1 hover:text-[#9a9098] transition-colors">
                Rating <SortIcon k="rating" />
              </button>
              <button onClick={() => toggleSort("votes")} className="flex items-center gap-1 hover:text-[#9a9098] transition-colors">
                Votes <SortIcon k="votes" />
              </button>
              <button onClick={() => toggleSort("year")} className="flex items-center gap-1 hover:text-[#9a9098] transition-colors">
                Year <SortIcon k="year" />
              </button>
              <span></span>
            </div>

            {/* Rows */}
            {filtered.map((movie, idx) => {
              const rank = allMovies.indexOf(movie) + 1;
              const year = movie.release_date?.split("-")[0] || "—";
              const genres = movie.genre_ids?.slice(0, 2).map((id) => MOVIE_GENRES[id]).filter(Boolean) || [];
              const saved = isInWatchlist(movie.id);
              const isTop3 = rank <= 3;

              return (
                <div
                  key={movie.id}
                  onClick={() => setSelectedId(movie.id)}
                  className={`grid grid-cols-[48px_56px_1fr_80px_90px_80px_48px] gap-2 px-4 py-3 items-center cursor-pointer transition-all duration-200 border-b border-[#0d0d18] hover:bg-[#12121e] group ${
                    isTop3 ? "bg-[#0e0e1a]" : ""
                  }`}
                >
                  {/* Rank */}
                  <div className={`font-cinzel text-sm font-bold ${isTop3 ? RANK_COLORS[rank - 1] : "text-[#4a4558]"}`}>
                    {rank <= 3 ? (
                      <span className="flex items-center gap-1">
                        {rank === 1 && "🥇"}
                        {rank === 2 && "🥈"}
                        {rank === 3 && "🥉"}
                      </span>
                    ) : rank}
                  </div>

                  {/* Poster */}
                  <div className="w-10 h-[60px] rounded-md overflow-hidden bg-[#1e1e30] shrink-0">
                    {movie.poster_path ? (
                      <img
                        src={img.poster(movie.poster_path, "w500")}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1e1e30]" />
                    )}
                  </div>

                  {/* Title + genres */}
                  <div className="min-w-0">
                    <h3 className="font-cinzel text-sm font-semibold text-[#f5f0e8] group-hover:text-[#c4843a] transition-colors truncate">
                      {movie.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      {genres.map((g) => (
                        <span key={g} className="font-inter text-[9px] text-[#4a4558] border border-[#1e1e30] px-1.5 py-0.5 rounded-sm">
                          {g}
                        </span>
                      ))}
                      {movie.original_language !== "en" && (
                        <span className="font-inter text-[9px] text-[#c4843a]/60 border border-[#c4843a]/20 px-1.5 py-0.5 rounded-sm">
                          {movie.original_language.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5">
                    <Star size={12} className="text-[#c4843a] fill-[#c4843a] shrink-0" />
                    <span className="font-inter font-bold text-sm text-[#f5f0e8]">{movie.vote_average.toFixed(1)}</span>
                  </div>

                  {/* Votes */}
                  <div className="font-inter text-xs text-[#4a4558]">
                    {movie.vote_count > 1000
                      ? `${(movie.vote_count / 1000).toFixed(0)}K`
                      : movie.vote_count}
                  </div>

                  {/* Year */}
                  <div className="font-inter text-xs text-[#9a9098] flex items-center gap-1">
                    <Calendar size={10} className="text-[#4a4558]" />
                    {year}
                  </div>

                  {/* Bookmark */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      saved ? remove(movie.id) : add(movie);
                    }}
                    className={`p-1.5 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 ${
                      saved
                        ? "text-[#c4843a] opacity-100"
                        : "text-[#4a4558] hover:text-[#c4843a]"
                    }`}
                  >
                    <Bookmark size={14} className={saved ? "fill-[#c4843a]" : ""} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedId && (
        <MovieModal movieId={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}
