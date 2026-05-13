import { useState } from "react";
import { Bookmark, CheckCircle2, Circle, Star, Trash2, Eye, EyeOff, SlidersHorizontal, Film } from "lucide-react";
import { useWatchlistContext } from "../context/WatchlistContext";
import { img, MOVIE_GENRES, movies } from "../lib/tmdb";
import MovieModal from "../components/MovieModal";

type Filter = "all" | "unwatched" | "watched";
type Sort = "added" | "rating" | "title" | "year";

export default function WatchlistPage() {
  const { items, remove, toggleWatched, setRating, watchedCount, unwatchedCount } = useWatchlistContext();
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("added");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<{ id: number; star: number } | null>(null);

  const filtered = items
    .filter((i) => {
      if (filter === "watched") return i.watched;
      if (filter === "unwatched") return !i.watched;
      return true;
    })
    .sort((a, b) => {
      if (sort === "added") return b.addedAt - a.addedAt;
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "year") {
        const ya = a.release_date?.split("-")[0] || "0";
        const yb = b.release_date?.split("-")[0] || "0";
        return yb.localeCompare(ya);
      }
      if (sort === "rating") return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  const handlePlay = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      const detail = await movies.detail(id);
      const imdbId = detail.imdb_id || detail.external_ids?.imdb_id;
      if (imdbId) window.open(`https://www.playimdb.com/title/${imdbId}/`, "_blank");
    } catch {}
  };

  const progressPct = items.length > 0 ? Math.round((watchedCount / items.length) * 100) : 0;

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <Bookmark size={22} className="text-[#c4843a] fill-[#c4843a]" />
            <span className="font-inter text-xs tracking-[0.3em] uppercase text-[#c4843a]">My Collection</span>
          </div>
          <h1 className="font-cinzel text-4xl md:text-5xl font-black text-[#f5f0e8] mb-4">Watchlist</h1>
          <div className="mt-5 h-px w-24 bg-gradient-to-r from-[#c4843a] to-transparent" />
        </div>

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="w-24 h-24 rounded-full bg-[#12121e] border border-[#1e1e30] flex items-center justify-center">
              <Bookmark size={36} className="text-[#2a2a3a]" />
            </div>
            <div className="text-center">
              <h2 className="font-cinzel text-2xl font-bold text-[#f5f0e8] mb-2">Nothing saved yet</h2>
              <p className="font-inter text-[#9a9098] max-w-sm">
                Browse movies, shows, or anime and hit the bookmark icon to save them here.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total", value: items.length, icon: Film },
                { label: "Watched", value: watchedCount, icon: CheckCircle2 },
                { label: "Remaining", value: unwatchedCount, icon: Circle },
                { label: "Progress", value: `${progressPct}%`, icon: Eye },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="glass border border-[#1e1e30] rounded-xl px-5 py-4 flex items-center gap-4">
                  <Icon size={20} className="text-[#c4843a] shrink-0" />
                  <div>
                    <div className="font-cinzel text-2xl font-bold text-[#f5f0e8]">{value}</div>
                    <div className="font-inter text-xs text-[#4a4558] uppercase tracking-wider">{label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mb-8">
              <div className="w-full h-1.5 bg-[#1e1e30] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#c4843a] to-[#e8a84a] rounded-full transition-all duration-700"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Filter + Sort bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              {/* Filters */}
              <div className="flex items-center gap-2">
                {(["all", "unwatched", "watched"] as Filter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`font-inter text-xs tracking-widest uppercase px-4 py-2 rounded-full border transition-all duration-200 ${
                      filter === f
                        ? "bg-[#c4843a] border-[#c4843a] text-white"
                        : "border-[#1e1e30] text-[#9a9098] hover:border-[#c4843a]/50 hover:text-[#f5f0e8]"
                    }`}
                  >
                    {f === "all" ? `All (${items.length})` : f === "watched" ? `Watched (${watchedCount})` : `Unwatched (${unwatchedCount})`}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-[#4a4558]" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="bg-[#12121e] border border-[#1e1e30] text-[#9a9098] font-inter text-xs px-3 py-2 rounded-lg outline-none focus:border-[#c4843a]/50"
                >
                  <option value="added">Recently Added</option>
                  <option value="title">Title A–Z</option>
                  <option value="year">Year</option>
                  <option value="rating">My Rating</option>
                </select>
              </div>
            </div>

            {/* List */}
            <div className="flex flex-col gap-3">
              {filtered.map((item) => {
                const posterUrl = item.poster_path ? img.poster(item.poster_path, "w500") : null;
                const year = item.release_date?.split("-")[0] || "N/A";
                const genres = item.genre_ids?.slice(0, 2).map((id) => MOVIE_GENRES[id]).filter(Boolean) || [];

                return (
                  <div
                    key={item.id}
                    className={`group glass border rounded-xl p-4 flex items-center gap-4 transition-all duration-300 cursor-pointer hover:border-[#c4843a]/30 ${
                      item.watched ? "border-[#1e1e30] opacity-70 hover:opacity-100" : "border-[#1e1e30]"
                    }`}
                    onClick={() => setSelectedId(item.id)}
                  >
                    {/* Poster */}
                    <div className="relative w-12 h-[72px] rounded-lg overflow-hidden shrink-0 bg-[#12121e]">
                      {posterUrl ? (
                        <img src={posterUrl} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#1e1e30]" />
                      )}
                      {item.watched && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <CheckCircle2 size={16} className="text-[#c4843a]" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-cinzel text-sm font-bold text-[#f5f0e8] truncate mb-1 group-hover:text-[#c4843a] transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-inter text-xs text-[#4a4558]">{year}</span>
                        {genres.map((g) => (
                          <span key={g} className="font-inter text-[10px] text-[#c4843a]/60 border border-[#c4843a]/20 px-1.5 py-0.5 rounded-sm">
                            {g}
                          </span>
                        ))}
                        <span className="font-inter text-xs text-[#4a4558] flex items-center gap-1">
                          <Star size={10} className="text-[#c4843a]" /> {item.vote_average?.toFixed(1)}
                        </span>
                      </div>

                      {/* Star rating */}
                      <div className="flex items-center gap-1 mt-2" onClick={(e) => e.stopPropagation()}>
                        {[1, 2, 3, 4, 5].map((star) => {
                          const active = hoverRating?.id === item.id ? star <= hoverRating.star : star <= (item.rating || 0);
                          return (
                            <button
                              key={star}
                              onMouseEnter={() => setHoverRating({ id: item.id, star })}
                              onMouseLeave={() => setHoverRating(null)}
                              onClick={() => setRating(item.id, star)}
                              className="transition-transform hover:scale-110"
                            >
                              <Star
                                size={12}
                                className={active ? "text-[#c4843a] fill-[#c4843a]" : "text-[#2a2a3a]"}
                              />
                            </button>
                          );
                        })}
                        {item.rating ? (
                          <span className="font-inter text-[10px] text-[#4a4558] ml-1">My rating</span>
                        ) : (
                          <span className="font-inter text-[10px] text-[#2a2a3a] ml-1">Rate it</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => handlePlay(e, item.id)}
                        className="bg-[#c0392b] hover:bg-[#e04030] text-white text-[10px] font-bold px-3 py-1.5 rounded-full transition-all"
                      >
                        Play
                      </button>
                      <button
                        onClick={() => toggleWatched(item.id)}
                        title={item.watched ? "Mark unwatched" : "Mark watched"}
                        className={`p-1.5 rounded-full border transition-all ${
                          item.watched
                            ? "border-[#c4843a]/40 text-[#c4843a] hover:border-red-500/40 hover:text-red-400"
                            : "border-[#1e1e30] text-[#4a4558] hover:border-[#c4843a]/40 hover:text-[#c4843a]"
                        }`}
                      >
                        {item.watched ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                      <button
                        onClick={() => remove(item.id)}
                        className="p-1.5 rounded-full border border-[#1e1e30] text-[#4a4558] hover:border-red-500/40 hover:text-red-400 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {selectedId && (
        <MovieModal movieId={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}
