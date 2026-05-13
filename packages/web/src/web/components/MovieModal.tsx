import { useEffect, useState } from "react";
import { X, Star, Clock, Calendar, Play, Globe, Award, User, Tv } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { movies, shows, img, formatRuntime, getLanguageName, getDirector, getTrailerKey, getStreamingPlatforms, getMoodSummary } from "../lib/tmdb";
import type { Mood } from "../lib/tmdb";

interface MovieModalProps {
  movieId: number;
  onClose: () => void;
  mood?: Mood;
  isShow?: boolean;
}

export default function MovieModal({ movieId, onClose, mood, isShow = false }: MovieModalProps) {
  const [trailerOpen, setTrailerOpen] = useState(false);

  const { data: detail, isLoading } = useQuery({
    queryKey: [isShow ? "show-detail" : "movie-detail", movieId],
    queryFn: () => isShow ? shows.detail(movieId) : movies.detail(movieId),
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const backdropUrl = detail ? img.backdrop(detail.backdrop_path, "w1280") : null;
  const posterUrl = detail ? img.poster(detail.poster_path, "w500") : null;
  const trailerKey = detail ? getTrailerKey(detail as any) : null;
  const platforms = detail ? getStreamingPlatforms(detail as any) : [];
  const title = (detail as any)?.title || (detail as any)?.name || "";
  const year = ((detail as any)?.release_date || (detail as any)?.first_air_date || "")?.split("-")[0];
  const rating = detail?.vote_average?.toFixed(1);
  const director = detail && !isShow ? getDirector(detail as any) : "";
  const genres = (detail as any)?.genres?.map((g: any) => g.name) || [];
  const runtime = (detail as any)?.runtime;
  const cast = detail?.credits?.cast?.slice(0, 5) || [];
  const moodText = mood && title ? getMoodSummary(mood, title) : null;
  const seasons = (detail as any)?.number_of_seasons;
  const episodes = (detail as any)?.number_of_episodes;
  const imdbId = (detail as any)?.imdb_id || (detail as any)?.external_ids?.imdb_id;
  const playUrl = imdbId ? `https://www.playimdb.com/title/${imdbId}/` : null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0d0d14] border border-[#1e1e30] shadow-2xl animate-fade-in-up hide-scrollbar">
        {/* Backdrop */}
        <div className="relative h-64 md:h-80 overflow-hidden rounded-t-2xl">
          {backdropUrl ? (
            <img src={backdropUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1e1e30] to-[#050508]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d14] via-[#0d0d14]/30 to-transparent" />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#c0392b] transition-colors"
          >
            <X size={18} />
          </button>

          {/* Action buttons */}
          <div className="absolute bottom-6 left-6 flex items-center gap-3">
            {trailerKey && (
              <button
                onClick={() => setTrailerOpen(true)}
                className="flex items-center gap-2 bg-[#c0392b] hover:bg-[#e74c3c] text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-all glow-crimson"
              >
                <Play size={16} className="fill-white" />
                Watch Trailer
              </button>
            )}
            {playUrl && (
              <a
                href={playUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#c4843a] hover:bg-[#d4944a] text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-all glow-gold"
              >
                <Play size={16} className="fill-white" />
                Watch Movie
              </a>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton h-6 rounded-lg" style={{ width: `${80 - i * 10}%` }} />
              ))}
            </div>
          ) : detail ? (
            <div className="flex gap-6">
              {/* Poster */}
              <div className="hidden md:block flex-shrink-0">
                {posterUrl && (
                  <img
                    src={posterUrl}
                    alt={title}
                    className="w-36 rounded-xl shadow-2xl border border-[#1e1e30]"
                  />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-[#f5f0e8] mb-2">{title}</h2>

                {(detail as any).tagline && (
                  <p className="font-playfair italic text-[#c4843a] text-sm mb-4">{(detail as any).tagline}</p>
                )}

                {/* Stats row */}
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Star size={16} className="text-[#c4843a] fill-[#c4843a]" />
                    <span className="text-[#c4843a] font-bold text-lg">{rating}</span>
                    <span className="text-[#4a4558] text-sm">/ 10</span>
                  </div>
                  {year && (
                    <span className="flex items-center gap-1 text-[#9a9098] text-sm">
                      <Calendar size={14} />
                      {year}
                    </span>
                  )}
                  {runtime && (
                    <span className="flex items-center gap-1 text-[#9a9098] text-sm">
                      <Clock size={14} />
                      {formatRuntime(runtime)}
                    </span>
                  )}
                  {seasons && (
                    <span className="flex items-center gap-1 text-[#9a9098] text-sm">
                      <Tv size={14} />
                      {seasons} Season{seasons > 1 ? "s" : ""} · {episodes} Eps
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-[#9a9098] text-sm">
                    <Globe size={14} />
                    {getLanguageName(detail.original_language)}
                  </span>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {genres.map((g: string) => (
                    <span key={g} className="text-xs px-3 py-1 rounded-full border border-[#c4843a]/30 text-[#c4843a]/80">
                      {g}
                    </span>
                  ))}
                </div>

                {/* Overview */}
                <p className="text-[#9a9098] text-sm leading-relaxed mb-4 font-inter">
                  {detail.overview}
                </p>

                {/* Mood match */}
                {moodText && (
                  <div className="glass-gold rounded-xl p-4 mb-4">
                    <p className="text-[#c4843a] text-xs font-semibold uppercase tracking-widest mb-1">Why this fits your mood</p>
                    <p className="font-playfair italic text-[#f5f0e8] text-sm leading-relaxed">{moodText}</p>
                  </div>
                )}

                {/* Director */}
                {director && (
                  <div className="flex items-center gap-2 mb-3">
                    <User size={14} className="text-[#4a4558]" />
                    <span className="text-[#4a4558] text-sm">Directed by </span>
                    <span className="text-[#9a9098] text-sm font-medium">{director}</span>
                  </div>
                )}

                {/* Cast */}
                {cast.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[#4a4558] text-xs uppercase tracking-widest mb-2">Cast</p>
                    <div className="flex flex-wrap gap-2">
                      {cast.map(c => (
                        <span key={c.id} className="text-xs bg-[#12121e] border border-[#1e1e30] px-3 py-1 rounded-full text-[#9a9098]">
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Streaming */}
                {platforms.length > 0 && (
                  <div>
                    <p className="text-[#4a4558] text-xs uppercase tracking-widest mb-2">Available on</p>
                    <div className="flex flex-wrap gap-2">
                      {platforms.slice(0, 4).map(p => (
                        <span key={p} className="text-xs font-semibold px-3 py-1 rounded-full bg-[#1e1e30] text-[#f5f0e8]">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Trailer Modal */}
      {trailerOpen && trailerKey && (
        <div
          className="fixed inset-0 z-[300] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setTrailerOpen(false)}
        >
          <button
            onClick={() => setTrailerOpen(false)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#c0392b] transition-colors z-10"
          >
            <X size={20} />
          </button>
          <div className="w-full max-w-4xl aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              allow="autoplay; fullscreen"
              allowFullScreen
              className="w-full h-full rounded-xl"
              title="Trailer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
