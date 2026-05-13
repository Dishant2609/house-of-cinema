import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Zap, Brain, Heart, Rocket, Gem, Skull, Star } from "lucide-react";
import { anime, shows, img, MOVIE_GENRES } from "../lib/tmdb";
import type { TMDBShow, TMDBMovie } from "../lib/tmdb";
import MovieModal from "../components/MovieModal";
import SectionRow from "../components/SectionRow";

function AnimeCard({ item, isMovie = false, index = 0 }: { item: TMDBShow | TMDBMovie; isMovie?: boolean; index?: number }) {
  const [modalOpen, setModalOpen] = useState(false);
  const title = (item as any).title || (item as any).name || "";
  const date = (item as any).release_date || (item as any).first_air_date || "";
  const year = date?.split("-")[0];
  const posterUrl = img.poster(item.poster_path, "w500");
  const rating = item.vote_average?.toFixed(1);

  return (
    <>
      <div
        className="relative rounded-xl overflow-hidden cursor-pointer group border border-purple-900/30 hover:border-purple-500/50 transition-all duration-300"
        style={{
          transform: "translateY(0)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          animationDelay: `${index * 0.05}s`
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(-8px)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 40px rgba(168,85,247,0.2), 0 0 30px rgba(168,85,247,0.1)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLElement).style.boxShadow = "none";
        }}
        onClick={() => setModalOpen(true)}
      >
        <div className="relative aspect-[2/3] bg-[#12121e]">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/30 to-pink-900/30">
              <span className="font-cinzel text-purple-400/50 text-sm text-center px-3">{title}</span>
            </div>
          )}

          {/* Neon gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300" />

          {/* Rating */}
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md">
            <Star size={11} className="text-purple-400 fill-purple-400" />
            <span className="text-purple-400 font-bold text-xs">{rating}</span>
          </div>

          {/* Play */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-14 h-14 rounded-full bg-purple-600/80 backdrop-blur-sm flex items-center justify-center"
              style={{ boxShadow: "0 0 30px rgba(168,85,247,0.6)" }}>
              <Zap size={24} className="text-white fill-white" />
            </div>
          </div>

          {/* Title */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="font-cinzel text-xs font-semibold text-[#f5f0e8] line-clamp-2 mb-1">{title}</h3>
            <span className="text-purple-400/60 text-[10px]">{year}</span>
          </div>
        </div>
      </div>

      {modalOpen && (
        <MovieModal movieId={item.id} onClose={() => setModalOpen(false)} isShow={!isMovie} />
      )}
    </>
  );
}

export default function AnimePage() {
  const [activeTab, setActiveTab] = useState<"series" | "movies">("series");

  const { data: popularSeries } = useQuery({
    queryKey: ["anime-popular"],
    queryFn: () => anime.popular(),
  });

  const { data: topRatedSeries } = useQuery({
    queryKey: ["anime-top"],
    queryFn: () => anime.topRated(),
  });

  const { data: animeMovies } = useQuery({
    queryKey: ["anime-movies"],
    queryFn: () => anime.movies(),
  });

  const { data: psychological } = useQuery({
    queryKey: ["anime-psychological"],
    queryFn: () => shows.discover({
      with_genres: "16,9648",
      with_original_language: "ja",
      sort_by: "vote_average.desc",
      "vote_count.gte": "200",
      "vote_average.gte": "7.0",
      include_adult: "false",
    }),
  });

  const { data: action } = useQuery({
    queryKey: ["anime-action"],
    queryFn: () => shows.discover({
      with_genres: "16,10759",
      with_original_language: "ja",
      sort_by: "popularity.desc",
      "vote_count.gte": "200",
      "vote_average.gte": "6.5",
      include_adult: "false",
    }),
  });

  const { data: emotional } = useQuery({
    queryKey: ["anime-emotional"],
    queryFn: () => shows.discover({
      with_genres: "16,18",
      with_original_language: "ja",
      sort_by: "vote_average.desc",
      "vote_count.gte": "200",
      "vote_average.gte": "7.0",
      include_adult: "false",
    }),
  });

  return (
    <div className="min-h-screen bg-[#050508] pt-24 pb-16" style={{
      backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(168,85,247,0.05) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(236,72,153,0.04) 0%, transparent 50%)"
    }}>

      {/* HERO */}
      <div className="relative overflow-hidden" style={{ height: "520px" }}>
        {/* Local video background */}
        <div className="absolute inset-0 bg-black overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              minWidth: "100%",
              minHeight: "100%",
              width: "auto",
              height: "auto",
              objectFit: "cover",
              pointerEvents: "none",
            }}
          >
            <source src="/anime-hero.mp4" type="video/mp4" />
          </video>
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/50 to-[#050508]/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/60 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-purple-900/20" />
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-px bg-purple-400" />
            <span className="font-inter text-purple-400 text-xs tracking-[0.3em] uppercase">Anime Cinema</span>
            <div className="w-6 h-px bg-purple-400" />
          </div>
          <h1 className="font-cinzel text-4xl md:text-6xl font-black mb-4">
            <span className="text-[#f5f0e8]">Anime</span>{" "}
            <span style={{
              background: "linear-gradient(135deg, #a855f7, #ec4899, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>Universe</span>
          </h1>
          <p className="font-playfair italic text-[#9a9098] text-xl max-w-xl mx-auto">
            Where emotion meets artistry. Japanese animation that transcends the medium.
          </p>

          {/* Tabs */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setActiveTab("series")}
              className={`px-6 py-2.5 rounded-full text-sm font-inter border transition-all ${
                activeTab === "series"
                  ? "border-purple-500 bg-purple-500/20 text-purple-300"
                  : "border-[#1e1e30] text-[#4a4558] hover:border-purple-500/40"
              }`}
            >
              Anime Series
            </button>
            <button
              onClick={() => setActiveTab("movies")}
              className={`px-6 py-2.5 rounded-full text-sm font-inter border transition-all ${
                activeTab === "movies"
                  ? "border-pink-500 bg-pink-500/20 text-pink-300"
                  : "border-[#1e1e30] text-[#4a4558] hover:border-pink-500/40"
              }`}
            >
              Anime Films
            </button>
          </div>
        </div>
      </div>

      {/* POPULAR */}
      {activeTab === "series" && (
        <>
          <section className="py-8">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 rounded-full bg-purple-500" />
                <h2 className="font-cinzel text-xl font-bold text-purple-400">Most Popular Series</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {popularSeries?.results?.filter(s => s.poster_path).slice(0, 12).map((s, i) => (
                  <AnimeCard key={s.id} item={s} index={i} />
                )) || Array.from({ length: 12 }).map((_, i) => <div key={i} className="aspect-[2/3] skeleton rounded-xl" />)}
              </div>
            </div>
          </section>

          {/* PSYCHOLOGICAL */}
          <section className="py-8">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-center gap-3 mb-6">
                <Brain size={22} className="text-purple-400" />
                <div>
                  <h2 className="font-cinzel text-xl font-bold text-purple-400">Psychological Anime</h2>
                  <p className="text-[#4a4558] text-xs font-inter">Mind-bending narratives that haunt you</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {psychological?.results?.filter(s => s.poster_path).slice(0, 12).map((s, i) => (
                  <AnimeCard key={s.id} item={s} index={i} />
                )) || Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[2/3] skeleton rounded-xl" />)}
              </div>
            </div>
          </section>

          {/* TOP RATED */}
          <section className="py-8">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-center gap-3 mb-6">
                <Star size={22} className="text-[#c4843a]" />
                <div>
                  <h2 className="font-cinzel text-xl font-bold text-[#c4843a]">Highest Rated Anime</h2>
                  <p className="text-[#4a4558] text-xs font-inter">The pinnacle of the medium</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {topRatedSeries?.results?.filter(s => s.poster_path).slice(0, 12).map((s, i) => (
                  <AnimeCard key={s.id} item={s} index={i} />
                )) || Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[2/3] skeleton rounded-xl" />)}
              </div>
            </div>
          </section>

          {/* ACTION */}
          <section className="py-8">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-center gap-3 mb-6">
                <Zap size={22} className="text-orange-400" />
                <div>
                  <h2 className="font-cinzel text-xl font-bold text-orange-400">Action & Adventure</h2>
                  <p className="text-[#4a4558] text-xs font-inter">Adrenaline-pumping animation</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {action?.results?.filter(s => s.poster_path).slice(0, 12).map((s, i) => (
                  <AnimeCard key={s.id} item={s} index={i} />
                )) || Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[2/3] skeleton rounded-xl" />)}
              </div>
            </div>
          </section>

          {/* EMOTIONAL */}
          <section className="py-8">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-center gap-3 mb-6">
                <Heart size={22} className="text-pink-400" />
                <div>
                  <h2 className="font-cinzel text-xl font-bold text-pink-400">Emotional & Heartfelt</h2>
                  <p className="text-[#4a4558] text-xs font-inter">Anime that makes you feel everything</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {emotional?.results?.filter(s => s.poster_path).slice(0, 12).map((s, i) => (
                  <AnimeCard key={s.id} item={s} index={i} />
                )) || Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[2/3] skeleton rounded-xl" />)}
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === "movies" && (
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-6 rounded-full bg-pink-500" />
              <div>
                <h2 className="font-cinzel text-xl font-bold text-pink-400">Anime Feature Films</h2>
                <p className="text-[#4a4558] text-xs font-inter">Including Studio Ghibli and cinematic masterworks</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {animeMovies?.results?.filter(m => m.poster_path).slice(0, 24).map((m, i) => (
                <AnimeCard key={m.id} item={m} isMovie index={i} />
              )) || Array.from({ length: 12 }).map((_, i) => <div key={i} className="aspect-[2/3] skeleton rounded-xl" />)}
            </div>
          </div>
        </section>
      )}

      {/* Quote */}
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="h-px mb-8" style={{ background: "linear-gradient(to right, transparent, rgba(168,85,247,0.3), transparent)" }} />
        <p className="font-playfair italic text-2xl text-[#9a9098] leading-relaxed">
          "Anime is not just for kids. It's a medium that can move adults to tears and push the boundaries of storytelling."
        </p>
        <p className="font-inter text-[#4a4558] text-sm mt-4">— The House of Cinema</p>
      </div>
    </div>
  );
}
