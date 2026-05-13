import { useState } from "react";
import { Star, Clock, Calendar, Play, Globe, Bookmark } from "lucide-react";
import { img, formatRuntime, getLanguageName, MOVIE_GENRES, movies } from "../lib/tmdb";
import type { TMDBMovie, TMDBMovieDetail, Mood } from "../lib/tmdb";
import MovieModal from "./MovieModal";
import { useWatchlistContext } from "../context/WatchlistContext";

interface MovieCardProps {
  movie: TMDBMovie | TMDBMovieDetail;
  moodSummary?: string;
  mood?: Mood;
  index?: number;
}

export default function MovieCard({ movie, moodSummary, mood, index = 0 }: MovieCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { add, remove, isInWatchlist } = useWatchlistContext();
  const saved = isInWatchlist(movie.id);
  const posterUrl = img.poster(movie.poster_path, "w500");

  const handlePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const detail = await movies.detail(movie.id);
      const imdbId = detail.imdb_id || detail.external_ids?.imdb_id;
      if (imdbId) {
        window.open(`https://www.playimdb.com/title/${imdbId}/`, "_blank");
      }
    } catch {}
  };
  const year = movie.release_date?.split("-")[0] || "N/A";
  const genreNames = movie.genre_ids?.slice(0, 2).map(id => MOVIE_GENRES[id]).filter(Boolean) || [];
  const rating = movie.vote_average?.toFixed(1);
  const lang = getLanguageName(movie.original_language);
  const runtime = (movie as TMDBMovieDetail).runtime;

  return (
    <>
      <div
        className="movie-card relative rounded-xl overflow-hidden cursor-pointer group border-gold-animated"
        style={{ animationDelay: `${index * 0.05}s` }}
        onClick={() => setModalOpen(true)}
        role="button"
      >
        {/* Poster */}
        <div className="relative aspect-[2/3] bg-[#12121e]">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#12121e]">
              <span className="font-cinzel text-[#4a4558] text-center px-4 text-sm">{movie.title}</span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent opacity-80" />

          {/* IMDb Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md">
            <Star size={11} className="text-[#c4843a] fill-[#c4843a]" />
            <span className="text-[#c4843a] font-bold text-xs">{rating}</span>
          </div>

          {/* Bookmark button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              saved ? remove(movie.id) : add(movie);
            }}
            className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 z-10 ${
              saved
                ? "bg-[#c4843a] text-white shadow-lg shadow-[#c4843a]/30"
                : "bg-black/50 text-[#9a9098] hover:text-[#c4843a]"
            }`}
            title={saved ? "Remove from watchlist" : "Add to watchlist"}
          >
            <Bookmark size={13} className={saved ? "fill-white" : ""} />
          </button>

          {/* Language badge */}
          {movie.original_language !== "en" && (
            <div className="absolute top-12 right-3 bg-[#c4843a]/20 border border-[#c4843a]/30 px-2 py-0.5 rounded-md">
              <span className="text-[#c4843a] text-[10px] font-semibold tracking-wider">{movie.original_language.toUpperCase()}</span>
            </div>
          )}

          {/* Hover actions */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handlePlay}
              className="flex items-center gap-2 bg-[#c0392b] hover:bg-[#e04030] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
            >
              <Play size={13} className="fill-white" /> Play Movie
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setModalOpen(true); }}
              className="flex items-center gap-2 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white text-xs px-4 py-2 rounded-full border border-white/20 transition-all duration-200 hover:scale-105"
            >
              More Info
            </button>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="font-cinzel text-sm font-semibold text-[#f5f0e8] leading-tight line-clamp-2 mb-1">
              {movie.title}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[#9a9098] text-xs flex items-center gap-1">
                <Calendar size={10} />
                {year}
              </span>
              {runtime && (
                <span className="text-[#9a9098] text-xs flex items-center gap-1">
                  <Clock size={10} />
                  {formatRuntime(runtime)}
                </span>
              )}
              {lang !== "English" && (
                <span className="text-[#9a9098] text-xs flex items-center gap-1">
                  <Globe size={10} />
                  {lang}
                </span>
              )}
            </div>
            {genreNames.length > 0 && (
              <div className="flex gap-1 mt-1 flex-wrap">
                {genreNames.map(g => (
                  <span key={g} className="text-[10px] text-[#c4843a]/70 border border-[#c4843a]/20 px-1.5 py-0.5 rounded-sm">
                    {g}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mood Summary (if provided) */}
        {moodSummary && (
          <div className="px-3 py-2 bg-[#0d0d14] border-t border-[#c4843a]/10">
            <p className="text-[#9a9098] text-[11px] leading-relaxed font-playfair italic line-clamp-2">
              {moodSummary}
            </p>
          </div>
        )}
      </div>

      {modalOpen && (
        <MovieModal
          movieId={movie.id}
          onClose={() => setModalOpen(false)}
          mood={mood}
        />
      )}
    </>
  );
}
