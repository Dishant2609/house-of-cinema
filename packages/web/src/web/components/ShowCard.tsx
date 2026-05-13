import { useState } from "react";
import { Star, Calendar, Play, Tv } from "lucide-react";
import { img, MOVIE_GENRES } from "../lib/tmdb";
import type { TMDBShow } from "../lib/tmdb";
import MovieModal from "./MovieModal";

interface ShowCardProps {
  show: TMDBShow;
  index?: number;
}

export default function ShowCard({ show, index = 0 }: ShowCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const posterUrl = img.poster(show.poster_path, "w500");
  const year = show.first_air_date?.split("-")[0] || "N/A";
  const genreNames = show.genre_ids?.slice(0, 2).map((id: number) => MOVIE_GENRES[id]).filter(Boolean) || [];
  const rating = show.vote_average?.toFixed(1);

  return (
    <>
      <div
        className="movie-card relative rounded-xl overflow-hidden cursor-pointer group border-gold-animated"
        style={{ animationDelay: `${index * 0.05}s` }}
        onClick={() => setModalOpen(true)}
      >
        <div className="relative aspect-[2/3] bg-[#12121e]">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={show.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Tv size={32} className="text-[#4a4558]" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent opacity-80" />

          <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md">
            <Star size={11} className="text-[#c4843a] fill-[#c4843a]" />
            <span className="text-[#c4843a] font-bold text-xs">{rating}</span>
          </div>

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-14 h-14 rounded-full bg-[#c0392b]/80 backdrop-blur-sm flex items-center justify-center glow-crimson">
              <Play size={24} className="text-white fill-white ml-1" />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="font-cinzel text-sm font-semibold text-[#f5f0e8] leading-tight line-clamp-2 mb-1">
              {show.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[#9a9098] text-xs flex items-center gap-1">
                <Calendar size={10} />
                {year}
              </span>
            </div>
            {genreNames.length > 0 && (
              <div className="flex gap-1 mt-1 flex-wrap">
                {genreNames.map((g: string) => (
                  <span key={g} className="text-[10px] text-[#c4843a]/70 border border-[#c4843a]/20 px-1.5 py-0.5 rounded-sm">
                    {g}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {modalOpen && (
        <MovieModal movieId={show.id} onClose={() => setModalOpen(false)} isShow />
      )}
    </>
  );
}
