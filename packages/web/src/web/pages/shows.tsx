import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tv, Star, TrendingUp, Award, Globe, Brain, Swords, Eye } from "lucide-react";
import { shows } from "../lib/tmdb";
import ShowCard from "../components/ShowCard";
import SectionRow from "../components/SectionRow";

const TV_GENRES = [
  { id: 18, label: "Drama", icon: "🎭" },
  { id: 80, label: "Crime", icon: "🔫" },
  { id: 9648, label: "Mystery", icon: "🔍" },
  { id: 10765, label: "Sci-Fi & Fantasy", icon: "🚀" },
  { id: 53, label: "Thriller", icon: "😰" },
  { id: 35, label: "Comedy", icon: "😂" },
  { id: 10759, label: "Action", icon: "💥" },
  { id: 27, label: "Horror", icon: "👻" },
];

export default function ShowsPage() {
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  const { data: trending } = useQuery({
    queryKey: ["shows-trending"],
    queryFn: () => shows.trending("week"),
  });

  const { data: topRated } = useQuery({
    queryKey: ["shows-top"],
    queryFn: () => shows.topRated(),
  });

  const { data: psychological } = useQuery({
    queryKey: ["shows-psychological"],
    queryFn: () => shows.discover({
      with_genres: "9648,53",
      sort_by: "vote_average.desc",
      "vote_count.gte": "100",
    }),
  });

  const { data: crime } = useQuery({
    queryKey: ["shows-crime"],
    queryFn: () => shows.discover({
      with_genres: "80",
      sort_by: "vote_average.desc",
      "vote_count.gte": "100",
    }),
  });

  const { data: international } = useQuery({
    queryKey: ["shows-international"],
    queryFn: () => shows.discover({
      without_original_language: "en",
      sort_by: "popularity.desc",
      "vote_count.gte": "100",
    }),
  });

  const { data: genreResults } = useQuery({
    queryKey: ["shows-genre", selectedGenre],
    queryFn: () => shows.byGenre(selectedGenre!),
    enabled: !!selectedGenre,
  });

  return (
    <div className="min-h-screen bg-[#050508] pt-24 pb-16">

      {/* HERO */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d14] to-[#050508]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c4843a]/30 to-transparent" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-[#c0392b]/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-[#c4843a]/5 rounded-full blur-[80px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-px bg-[#c4843a]" />
            <span className="font-inter text-[#c4843a] text-xs tracking-[0.3em] uppercase">Premium Television</span>
            <div className="w-6 h-px bg-[#c4843a]" />
          </div>
          <h1 className="font-cinzel text-4xl md:text-6xl font-black text-[#f5f0e8] mb-4">
            TV Shows & <span className="text-gold-gradient">Web Series</span>
          </h1>
          <p className="font-playfair italic text-[#9a9098] text-xl max-w-xl mx-auto">
            Premium television that grips, moves, and stays with you long after the credits.
          </p>
        </div>
      </div>

      {/* GENRE FILTERS */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setSelectedGenre(null)}
            className={`px-5 py-2 rounded-full text-sm border transition-all font-inter ${
              !selectedGenre ? "border-[#c4843a] bg-[#c4843a]/10 text-[#c4843a]" : "border-[#1e1e30] text-[#4a4558] hover:border-[#9a9098] hover:text-[#9a9098]"
            }`}
          >
            All Shows
          </button>
          {TV_GENRES.map(g => (
            <button
              key={g.id}
              onClick={() => setSelectedGenre(g.id === selectedGenre ? null : g.id)}
              className={`px-5 py-2 rounded-full text-sm border transition-all font-inter ${
                selectedGenre === g.id ? "border-[#c4843a] bg-[#c4843a]/10 text-[#c4843a]" : "border-[#1e1e30] text-[#4a4558] hover:border-[#9a9098] hover:text-[#9a9098]"
              }`}
            >
              {g.icon} {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Genre results */}
      {selectedGenre && genreResults?.results && (
        <section className="py-6">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="font-cinzel text-xl text-[#c4843a] mb-6">
              {TV_GENRES.find(g => g.id === selectedGenre)?.label} Shows
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {genreResults.results.filter(s => s.poster_path).slice(0, 18).map((show, i) => (
                <ShowCard key={show.id} show={show} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TRENDING */}
      <SectionRow title="Trending This Week" subtitle="What everyone is binge-watching right now" accentColor="crimson">
        {trending?.results?.filter(s => s.poster_path).slice(0, 20).map((show, i) => (
          <div key={show.id} className="flex-shrink-0 w-44">
            <ShowCard show={show} index={i} />
          </div>
        )) || <SkeletonRow />}
      </SectionRow>

      {/* TOP RATED */}
      <SectionRow title="All-Time Greatest" subtitle="Television's highest-rated masterworks" accentColor="gold">
        {topRated?.results?.filter(s => s.poster_path).slice(0, 20).map((show, i) => (
          <div key={show.id} className="flex-shrink-0 w-44">
            <div className="relative">
              <ShowCard show={show} index={i} />
              <div className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-[#c0392b] flex items-center justify-center z-10">
                <span className="text-white font-black text-[10px]">#{i + 1}</span>
              </div>
            </div>
          </div>
        )) || <SkeletonRow />}
      </SectionRow>

      {/* PSYCHOLOGICAL */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-6">
            <Brain size={22} className="text-purple-400" />
            <div>
              <h2 className="font-cinzel text-xl font-bold text-purple-400">Psychological Thrillers</h2>
              <p className="text-[#4a4558] text-sm font-inter">Shows that rewire how you think</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {psychological?.results?.filter(s => s.poster_path).slice(0, 12).map((show, i) => (
              <ShowCard key={show.id} show={show} index={i} />
            )) || Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[2/3] skeleton rounded-xl" />)}
          </div>
        </div>
      </section>

      {/* CRIME */}
      <SectionRow title="Crime & Underworld" subtitle="The best crime dramas in television history">
        {crime?.results?.filter(s => s.poster_path).slice(0, 20).map((show, i) => (
          <div key={show.id} className="flex-shrink-0 w-44">
            <ShowCard show={show} index={i} />
          </div>
        )) || <SkeletonRow />}
      </SectionRow>

      {/* INTERNATIONAL */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe size={22} className="text-teal-400" />
            <div>
              <h2 className="font-cinzel text-xl font-bold text-teal-400">International Series</h2>
              <p className="text-[#4a4558] text-sm font-inter">World-class television beyond borders</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {international?.results?.filter(s => s.poster_path).slice(0, 12).map((show, i) => (
              <ShowCard key={show.id} show={show} index={i} />
            )) || Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[2/3] skeleton rounded-xl" />)}
          </div>
        </div>
      </section>
    </div>
  );
}

function SkeletonRow() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-44 aspect-[2/3] skeleton rounded-xl" />
      ))}
    </>
  );
}
