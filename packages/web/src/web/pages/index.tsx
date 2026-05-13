import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Sparkles, Shuffle, ChevronDown, Gem } from "lucide-react";
import { movies, img, MOVIE_GENRES } from "../lib/tmdb";
import type { TMDBMovie } from "../lib/tmdb";
import MovieCard from "../components/MovieCard";
import SectionRow from "../components/SectionRow";
import MovieModal from "../components/MovieModal";

// Single cinematic hero video

export default function HomePage() {
  const [featuredModal, setFeaturedModal] = useState<number | null>(null);
  const [_, navigate] = useLocation();

  const { data: trending } = useQuery({
    queryKey: ["trending-movies"],
    queryFn: () => movies.trending("week"),
  });

  const { data: topRated } = useQuery({
    queryKey: ["top-rated"],
    queryFn: () => movies.topRated(),
  });

  const { data: nowPlaying } = useQuery({
    queryKey: ["now-playing"],
    queryFn: () => movies.nowPlaying(),
  });

  const { data: upcoming } = useQuery({
    queryKey: ["upcoming"],
    queryFn: () => movies.upcoming(),
  });

  const { data: hiddenGems } = useQuery({
    queryKey: ["hidden-gems"],
    queryFn: () => movies.discover({
      "vote_average.gte": "7.5",
      "vote_count.gte": "100",
      "vote_count.lte": "2000",
      sort_by: "vote_average.desc",
      "primary_release_date.lte": "2010-12-31",
    }),
  });

  const handleRandomMovie = async () => {
    const movie = await movies.random();
    if (movie) setFeaturedModal(movie.id);
  };



  return (
    <div className="min-h-screen bg-[#050508]">

      {/* CINEMATIC HERO */}
      <section className="relative min-h-screen flex items-end overflow-hidden">

        {/* Cinematic hero — local video, no controls */}
        <div className="absolute inset-0 overflow-hidden bg-black">
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
            <source src="/hero.mp4" type="video/mp4" />
          </video>
          {/* Cinematic overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/40 to-[#050508]/20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050508]/60 via-transparent to-transparent pointer-events-none" />
          {/* Top vignette so navbar is always legible */}
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#050508]/80 to-transparent pointer-events-none" />
        </div>

        {/* Content — bottom-left cinematic style */}
        <div className="relative z-10 w-full px-8 md:px-16 lg:px-24 pb-24 pt-40">
          <div className="max-w-2xl">
            <h1 className="font-cinzel text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-5">
              <span className="text-[#f5f0e8]">Every Emotion</span>
              <br />
              <span className="text-gold-gradient glow-gold-text">Deserves</span>
              <br />
              <span className="text-[#f5f0e8]">a Story.</span>
            </h1>

            <p className="font-playfair italic text-lg text-[#9a9098] mb-8 leading-relaxed">
              Discover movies that match your mood, your night, and your soul.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/quiz">
                <button className="flex items-center gap-2 bg-gradient-to-r from-[#c0392b] to-[#e74c3c] text-white font-semibold px-8 py-4 rounded-full glow-crimson hover:scale-105 transition-all duration-300 font-inter tracking-wide">
                  <Sparkles size={18} />
                  Start Exploring
                </button>
              </Link>
              <button
                onClick={handleRandomMovie}
                className="flex items-center gap-2 glass-gold text-[#c4843a] font-semibold px-8 py-4 rounded-full hover:glow-gold hover:scale-105 transition-all duration-300 font-inter tracking-wide"
              >
                <Shuffle size={18} />
                Random Movie Night
              </button>
            </div>


          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-10 flex flex-col items-center gap-2 text-[#4a4558] animate-bounce">
          <span className="text-[10px] tracking-widest uppercase font-inter">Scroll</span>
          <ChevronDown size={16} />
        </div>
      </section>

      {/* MOOD QUICK-SELECT */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="section-divider mb-12" />
        <div className="text-center mb-10">
          <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-[#f5f0e8] mb-3">
            What's your <span className="text-gold-gradient">mood</span> tonight?
          </h2>
          <p className="font-inter text-[#4a4558] text-sm">Quick picks based on how you feel right now</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[
            { mood: "feel-good",    label: "Feel Good",     sub: "The Mask",                backdrop: "/bQlw59HncOXX9alFlOYKHAvSnm.jpg", accent: "#f59e0b" },
            { mood: "dark",        label: "Dark & Gritty",  sub: "The Dark Knight",         backdrop: "/cfT29Im5VDvjE0RpyKOSdCKZal7.jpg", accent: "#6b7280" },
            { mood: "emotional",   label: "Emotional",      sub: "Good Will Hunting",        backdrop: "/zdWdI9k8UroWuMjALiftO6WTXu1.jpg", accent: "#60a5fa" },
            { mood: "mind-bending",label: "Mind-Bending",   sub: "Inception",               backdrop: "/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg", accent: "#a78bfa" },
            { mood: "motivated",   label: "Motivated",      sub: "Rocky",                   backdrop: "/bacOuUnRBoAO1NjMfsAGX2EKRrS.jpg", accent: "#f97316" },
            { mood: "relaxed",     label: "Relaxed",        sub: "Lost in Translation",     backdrop: "/6ITVHoipvxAS8luzKtHTbPaHLtT.jpg", accent: "#2dd4bf" },
            { mood: "curious",     label: "Curious",        sub: "Interstellar",            backdrop: "/2ssWTSVklAEc98frZUQhgtGHx7s.jpg", accent: "#34d399" },
            { mood: "heartbroken", label: "Heartbroken",    sub: "Eternal Sunshine",        backdrop: "/W1ffLQGHoxfAOq0ZYdPtJlvAdb.jpg",  accent: "#f43f5e" },
            { mood: "happy",       label: "Happy",          sub: "Forrest Gump",            backdrop: "/67HggiWaP9ZLv5sPYmyRV37yAJM.jpg", accent: "#facc15" },
            { mood: "lonely",      label: "Lonely Night",   sub: "Drive",                   backdrop: "/iymDDg4upZWgpbSeiE1JCjsSPBs.jpg", accent: "#94a3b8" },
          ].map(({ mood, label, sub, backdrop, accent }) => (
            <Link key={mood} to={`/discover?mood=${mood}`}>
              <div className="relative rounded-xl overflow-hidden cursor-pointer group h-40 border border-white/5 hover:border-white/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl">
                {/* Scene backdrop */}
                <img
                  src={`/api/img/t/p/w500${backdrop}`}
                  alt={sub}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Dark cinematic overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                {/* Colored accent top bar */}
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: accent }} />
                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="font-cinzel text-sm font-bold text-white leading-tight tracking-wide">{label}</p>
                  <p className="font-inter text-[10px] mt-0.5 tracking-wide" style={{ color: accent }}>{sub}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TRENDING NOW */}
      <SectionRow
        title="Trending Now"
        subtitle="What the world is watching this week"
        accentColor="crimson"
      >
        {trending?.results?.filter(m => m.poster_path).slice(0, 20).map((movie, i) => (
          <div key={movie.id} className="flex-shrink-0 w-44">
            <MovieCard movie={movie} index={i} />
          </div>
        )) || <SkeletonRow />}
      </SectionRow>

      {/* NOW IN CINEMAS */}
      <SectionRow
        title="Now in Cinemas"
        subtitle="Currently playing in theaters worldwide"
      >
        {nowPlaying?.results?.filter(m => m.poster_path).slice(0, 20).map((movie, i) => (
          <div key={movie.id} className="flex-shrink-0 w-44">
            <MovieCard movie={movie} index={i} />
          </div>
        )) || <SkeletonRow />}
      </SectionRow>

      {/* TOP IMDB */}
      <SectionRow
        title="Top IMDb Masterpieces"
        subtitle="Cinema's most celebrated works of all time"
        accentColor="gold"
      >
        {topRated?.results?.filter(m => m.poster_path).slice(0, 20).map((movie, i) => (
          <div key={movie.id} className="flex-shrink-0 w-44">
            <div className="relative">
              <MovieCard movie={movie} index={i} />
              <div className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-[#c0392b] flex items-center justify-center z-10">
                <span className="text-white font-black text-[10px]">#{i + 1}</span>
              </div>
            </div>
          </div>
        )) || <SkeletonRow />}
      </SectionRow>

      {/* HIDDEN GEMS */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <Gem size={22} className="text-[#c4843a]" />
            <div>
              <h2 className="font-cinzel text-xl md:text-2xl font-bold text-[#c4843a]">Hidden Gems</h2>
              <p className="font-inter text-sm text-[#4a4558]">Masterpieces that flew under the radar</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {hiddenGems?.results?.filter(m => m.poster_path).slice(0, 12).map((movie, i) => (
              <MovieCard key={movie.id} movie={movie} index={i} />
            )) || Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </section>

      {/* UPCOMING */}
      <SectionRow title="Coming Soon" subtitle="Movies you'll want to clear your calendar for">
        {upcoming?.results?.filter(m => m.poster_path).slice(0, 20).map((movie, i) => (
          <div key={movie.id} className="flex-shrink-0 w-44">
            <div className="relative">
              <MovieCard movie={movie} index={i} />
              <div className="absolute top-3 right-3 bg-[#c0392b] text-white text-[9px] font-bold px-2 py-0.5 rounded-sm tracking-widest uppercase z-10">
                Soon
              </div>
            </div>
          </div>
        )) || <SkeletonRow />}
      </SectionRow>

      {/* CTA BANNER */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="section-divider mb-16" />
        <div className="relative rounded-3xl overflow-hidden glass-gold p-12 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[#c4843a]/10 via-transparent to-[#c0392b]/10 pointer-events-none" />
          <div className="relative z-10">
            <Sparkles size={32} className="text-[#c4843a] mx-auto mb-4" />
            <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-[#f5f0e8] mb-4">
              Let your mood guide<br />
              <span className="text-gold-gradient">the perfect film.</span>
            </h2>
            <p className="font-playfair italic text-[#9a9098] text-lg mb-8 max-w-lg mx-auto">
              Answer 5 quick questions and discover cinema crafted exactly for this moment.
            </p>
            <Link to="/quiz">
              <button className="inline-flex items-center gap-3 bg-gradient-to-r from-[#c0392b] to-[#e74c3c] text-white font-semibold px-10 py-4 rounded-full glow-crimson hover:scale-105 transition-all font-inter tracking-wide text-lg">
                <Sparkles size={20} />
                Start Mood Discovery
              </button>
            </Link>
          </div>
        </div>
      </section>

      {featuredModal && (
        <MovieModal movieId={featuredModal} onClose={() => setFeaturedModal(null)} />
      )}
    </div>
  );
}

function SkeletonRow() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-44">
          <SkeletonCard />
        </div>
      ))}
    </>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden aspect-[2/3] skeleton" />
  );
}
