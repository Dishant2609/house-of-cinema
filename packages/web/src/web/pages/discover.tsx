import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal, X, Star, Clock, Globe } from "lucide-react";
import { movies, getMoodRecommendations } from "../lib/tmdb";
import type { Mood } from "../lib/tmdb";
import MovieCard from "../components/MovieCard";

const GENRE_OPTIONS = [
  { id: 28, label: "Action" }, { id: 12, label: "Adventure" },
  { id: 35, label: "Comedy" }, { id: 80, label: "Crime" },
  { id: 18, label: "Drama" }, { id: 27, label: "Horror" },
  { id: 9648, label: "Mystery" }, { id: 10749, label: "Romance" },
  { id: 878, label: "Sci-Fi" }, { id: 53, label: "Thriller" },
  { id: 14, label: "Fantasy" }, { id: 16, label: "Animation" },
];

const MOOD_OPTIONS: { value: Mood; label: string; emoji: string }[] = [
  { value: "feel-good", label: "Feel-Good", emoji: "✨" },
  { value: "dark", label: "Dark", emoji: "🌑" },
  { value: "emotional", label: "Emotional", emoji: "🎭" },
  { value: "mind-bending", label: "Mind-Bending", emoji: "🌀" },
  { value: "motivated", label: "Motivated", emoji: "⚡" },
  { value: "relaxed", label: "Relaxed", emoji: "🌙" },
  { value: "curious", label: "Curious", emoji: "🔭" },
  { value: "heartbroken", label: "Heartbroken", emoji: "💔" },
  { value: "happy", label: "Happy", emoji: "🌟" },
  { value: "lonely", label: "Lonely", emoji: "🕯️" },
];

const LANGUAGE_OPTIONS = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "ko", label: "Korean", flag: "🇰🇷" },
  { code: "ja", label: "Japanese", flag: "🇯🇵" },
  { code: "hi", label: "Hindi", flag: "🇮🇳" },
  { code: "es", label: "Spanish", flag: "🇪🇸" },
  { code: "fr", label: "French", flag: "🇫🇷" },
];

const ERA_OPTIONS = [
  { value: "", label: "All Time" },
  { value: "classic", label: "Classic (pre-2000)" },
  { value: "modern", label: "Modern (2010+)" },
];

export default function DiscoverPage() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const moodFromUrl = params.get("mood") as Mood | null;

  const [selectedMood, setSelectedMood] = useState<Mood | null>(moodFromUrl);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedLang, setSelectedLang] = useState("");
  const [selectedEra, setSelectedEra] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("vote_average.desc");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (moodFromUrl) setSelectedMood(moodFromUrl);
  }, [moodFromUrl]);

  // Mood-based query
  const { data: moodResults, isLoading: moodLoading } = useQuery({
    queryKey: ["discover-mood", selectedMood],
    queryFn: () => getMoodRecommendations({ mood: selectedMood! }),
    enabled: !!selectedMood && selectedGenres.length === 0,
  });

  // Genre/filter-based query
  const discoverParams: Record<string, string> = {
    sort_by: sortBy,
    "vote_count.gte": "50",
    page: String(page),
  };
  if (selectedGenres.length > 0) discoverParams.with_genres = selectedGenres.join(",");
  if (selectedLang) discoverParams.with_original_language = selectedLang;
  if (minRating > 0) discoverParams["vote_average.gte"] = String(minRating);
  if (selectedEra === "classic") discoverParams["primary_release_date.lte"] = "2000-12-31";
  if (selectedEra === "modern") discoverParams["primary_release_date.gte"] = "2010-01-01";

  const { data: filterResults, isLoading: filterLoading } = useQuery({
    queryKey: ["discover-filter", discoverParams],
    queryFn: () => movies.discover(discoverParams),
    enabled: selectedGenres.length > 0 || !!selectedLang || minRating > 0 || !!selectedEra || !selectedMood,
  });

  const useMoodResults = !!selectedMood && selectedGenres.length === 0 && !selectedLang && !selectedEra && minRating === 0;
  const displayMovies = useMoodResults ? moodResults : filterResults?.results;
  const isLoading = useMoodResults ? moodLoading : filterLoading;

  const toggleGenre = (id: number) => {
    setSelectedGenres(g => g.includes(id) ? g.filter(x => x !== id) : [...g, id]);
    setPage(1);
  };

  const clearAll = () => {
    setSelectedMood(null);
    setSelectedGenres([]);
    setSelectedLang("");
    setSelectedEra("");
    setMinRating(0);
    setPage(1);
  };

  const hasFilters = selectedMood || selectedGenres.length > 0 || selectedLang || selectedEra || minRating > 0;

  return (
    <div className="min-h-screen bg-[#050508] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-px bg-[#c4843a]" />
            <span className="font-inter text-[#c4843a] text-xs tracking-[0.3em] uppercase">Discover</span>
          </div>
          <h1 className="font-cinzel text-3xl md:text-4xl font-bold text-[#f5f0e8] mb-2">
            {selectedMood
              ? <span>Films for your <span className="text-gold-gradient capitalize">{selectedMood.replace("-", " ")}</span> mood</span>
              : "Explore Cinema"
            }
          </h1>
          <p className="font-playfair italic text-[#9a9098]">
            {displayMovies?.length || 0} films curated for you
          </p>
        </div>

        <div className="flex gap-6">
          {/* FILTERS SIDEBAR */}
          <aside className={`${filtersOpen ? "block" : "hidden"} md:block flex-shrink-0 w-64 space-y-6`}>
            <div className="glass rounded-2xl p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-cinzel text-sm font-bold text-[#f5f0e8]">Filters</h3>
                {hasFilters && (
                  <button onClick={clearAll} className="text-[#4a4558] hover:text-[#c0392b] text-xs font-inter flex items-center gap-1">
                    <X size={12} /> Clear
                  </button>
                )}
              </div>

              {/* Mood */}
              <div className="mb-5">
                <p className="font-inter text-[10px] text-[#4a4558] uppercase tracking-widest mb-3">Mood</p>
                <div className="flex flex-wrap gap-1.5">
                  {MOOD_OPTIONS.map(m => (
                    <button
                      key={m.value}
                      onClick={() => { setSelectedMood(selectedMood === m.value ? null : m.value); setPage(1); }}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                        selectedMood === m.value
                          ? "border-[#c4843a] bg-[#c4843a]/20 text-[#c4843a]"
                          : "border-[#1e1e30] text-[#4a4558] hover:border-[#9a9098] hover:text-[#9a9098]"
                      }`}
                    >
                      {m.emoji} {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Genres */}
              <div className="mb-5">
                <p className="font-inter text-[10px] text-[#4a4558] uppercase tracking-widest mb-3">Genre</p>
                <div className="flex flex-wrap gap-1.5">
                  {GENRE_OPTIONS.map(g => (
                    <button
                      key={g.id}
                      onClick={() => toggleGenre(g.id)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                        selectedGenres.includes(g.id)
                          ? "border-[#c0392b] bg-[#c0392b]/20 text-[#e74c3c]"
                          : "border-[#1e1e30] text-[#4a4558] hover:border-[#9a9098] hover:text-[#9a9098]"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div className="mb-5">
                <p className="font-inter text-[10px] text-[#4a4558] uppercase tracking-widest mb-3">Language</p>
                <div className="flex flex-wrap gap-1.5">
                  {LANGUAGE_OPTIONS.map(l => (
                    <button
                      key={l.code}
                      onClick={() => { setSelectedLang(selectedLang === l.code ? "" : l.code); setPage(1); }}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                        selectedLang === l.code
                          ? "border-[#c4843a] bg-[#c4843a]/20 text-[#c4843a]"
                          : "border-[#1e1e30] text-[#4a4558] hover:border-[#9a9098] hover:text-[#9a9098]"
                      }`}
                    >
                      {l.flag} {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Era */}
              <div className="mb-5">
                <p className="font-inter text-[10px] text-[#4a4558] uppercase tracking-widest mb-3">Era</p>
                <div className="space-y-1">
                  {ERA_OPTIONS.map(e => (
                    <button
                      key={e.value}
                      onClick={() => { setSelectedEra(e.value); setPage(1); }}
                      className={`w-full text-left text-xs px-3 py-2 rounded-lg border transition-all ${
                        selectedEra === e.value
                          ? "border-[#c4843a] bg-[#c4843a]/10 text-[#c4843a]"
                          : "border-transparent text-[#4a4558] hover:text-[#9a9098]"
                      }`}
                    >
                      {e.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Min Rating */}
              <div>
                <p className="font-inter text-[10px] text-[#4a4558] uppercase tracking-widest mb-3 flex items-center gap-1">
                  <Star size={10} /> Min Rating: <span className="text-[#c4843a] ml-1">{minRating > 0 ? `${minRating}+` : "Any"}</span>
                </p>
                <input
                  type="range"
                  min="0"
                  max="9"
                  step="0.5"
                  value={minRating}
                  onChange={e => { setMinRating(parseFloat(e.target.value)); setPage(1); }}
                  className="w-full accent-[#c4843a]"
                />
              </div>

              {/* Sort */}
              <div className="mt-4">
                <p className="font-inter text-[10px] text-[#4a4558] uppercase tracking-widest mb-2">Sort By</p>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="w-full bg-[#12121e] border border-[#1e1e30] text-[#9a9098] text-xs rounded-lg px-3 py-2 outline-none"
                >
                  <option value="vote_average.desc">Highest Rated</option>
                  <option value="popularity.desc">Most Popular</option>
                  <option value="primary_release_date.desc">Newest First</option>
                  <option value="primary_release_date.asc">Oldest First</option>
                </select>
              </div>
            </div>
          </aside>

          {/* RESULTS */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="md:hidden flex items-center gap-2 glass border border-[#1e1e30] px-4 py-2 rounded-lg text-sm text-[#9a9098] mb-6"
            >
              <SlidersHorizontal size={16} />
              Filters {hasFilters ? `(active)` : ""}
            </button>

            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="aspect-[2/3] rounded-xl skeleton" />
                ))}
              </div>
            ) : displayMovies && displayMovies.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {displayMovies.filter(m => m.poster_path).map((movie, i) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      mood={selectedMood || undefined}
                      index={i}
                    />
                  ))}
                </div>

                {/* Pagination (only for filter mode) */}
                {!useMoodResults && (
                  <div className="flex justify-center gap-3 mt-10">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-5 py-2 glass border border-[#1e1e30] text-sm text-[#9a9098] rounded-full disabled:opacity-30 hover:border-[#c4843a]/30 transition-all"
                    >
                      Previous
                    </button>
                    <span className="px-5 py-2 text-[#4a4558] text-sm font-inter">Page {page}</span>
                    <button
                      onClick={() => setPage(p => p + 1)}
                      className="px-5 py-2 glass border border-[#1e1e30] text-sm text-[#9a9098] rounded-full hover:border-[#c4843a]/30 transition-all"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-[#4a4558] font-inter">No films found. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
