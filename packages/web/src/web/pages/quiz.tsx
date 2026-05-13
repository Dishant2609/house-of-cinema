import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RotateCcw, Sparkles } from "lucide-react";
import { getMoodRecommendations } from "../lib/tmdb";
import type { QuizAnswers, Mood, WatchingWith, CinemaType, Pacing, Language } from "../lib/tmdb";
import MovieCard from "../components/MovieCard";

type Step = "mood" | "watching" | "cinema" | "language" | "results";
const STEPS: Step[] = ["mood", "watching", "cinema", "language", "results"];

const moodOptions: { value: Mood; label: string; film: string; backdrop: string; accent: string }[] = [
  { value: "happy",        label: "Happy & Joyful",   film: "Forrest Gump",        backdrop: "/67HggiWaP9ZLv5sPYmyRV37yAJM.jpg", accent: "#facc15" },
  { value: "feel-good",    label: "Feel-Good Vibes",  film: "The Mask",             backdrop: "/bQlw59HncOXX9alFlOYKHAvSnm.jpg",   accent: "#f59e0b" },
  { value: "lonely",       label: "Lonely Night",     film: "Her",                  backdrop: "/nG5zmbVeYlcDhckrPAe06fArywn.jpg",   accent: "#94a3b8" },
  { value: "heartbroken",  label: "Heartbroken",      film: "Eternal Sunshine",     backdrop: "/W1ffLQGHoxfAOq0ZYdPtJlvAdb.jpg",    accent: "#f43f5e" },
  { value: "motivated",    label: "Motivated",        film: "Rocky",                backdrop: "/bacOuUnRBoAO1NjMfsAGX2EKRrS.jpg",   accent: "#f97316" },
  { value: "emotional",    label: "Emotionally Open", film: "Good Will Hunting",    backdrop: "/zdWdI9k8UroWuMjALiftO6WTXu1.jpg",   accent: "#60a5fa" },
  { value: "curious",      label: "Curious Mind",     film: "Interstellar",         backdrop: "/2ssWTSVklAEc98frZUQhgtGHx7s.jpg",   accent: "#34d399" },
  { value: "relaxed",      label: "Relaxed",          film: "Lost in Translation",  backdrop: "/6ITVHoipvxAS8luzKtHTbPaHLtT.jpg",   accent: "#2dd4bf" },
  { value: "dark",         label: "Dark Mood",        film: "The Dark Knight",      backdrop: "/cfT29Im5VDvjE0RpyKOSdCKZal7.jpg",   accent: "#6b7280" },
  { value: "mind-bending", label: "Mind-Bending",     film: "Inception",            backdrop: "/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",   accent: "#a78bfa" },
];

const watchingOptions: { value: WatchingWith; label: string; desc: string; backdrop: string; accent: string; film: string }[] = [
  { value: "alone",   label: "Just Me",       desc: "Solo cinema experience",   backdrop: "/7Z7WVzJsSReG8B0CaPk0bvWD7tK.jpg", accent: "#c4843a",  film: "Into the Wild" },
  { value: "partner", label: "With Partner",  desc: "Romantic movie night",      backdrop: "/nlPCdZlHtRNcF6C9hzUH4ebmV1w.jpg", accent: "#f43f5e",  film: "La La Land" },
  { value: "friends", label: "With Friends",  desc: "Group watch vibes",         backdrop: "/g0IcDmHbhbzS3AAMOZcpc35mLFM.jpg", accent: "#facc15",  film: "Superbad" },
  { value: "family",  label: "With Family",   desc: "Family-friendly picks",     backdrop: "/ih2xVgeMS8R5WUetYE8Mr9hVTlB.jpg", accent: "#34d399",  film: "Home Alone" },
];

const cinemaOptions: { value: CinemaType; label: string; desc: string; backdrop: string; accent: string; film: string }[] = [
  { value: "modern",         label: "Modern Blockbusters", desc: "2010s–present",          backdrop: "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg", accent: "#f97316", film: "Avengers: Endgame" },
  { value: "classic",        label: "Classic Cinema",      desc: "Timeless pre-2000 films", backdrop: "/tfNuePdHrP9fp6K2VTJwHKKJf8C.jpg", accent: "#c4843a", film: "Casablanca" },
  { value: "underrated",     label: "Underrated Gems",     desc: "Hidden masterpieces",     backdrop: "/wCuUKiRaz0wEESsYqmQy005xvTE.jpg", accent: "#34d399", film: "Parasite" },
  { value: "international",  label: "International",       desc: "World cinema",             backdrop: "/zoVeIgKzGJzpdG6Gwnr7iOYfIMU.jpg", accent: "#2dd4bf", film: "Cinema Paradiso" },
  { value: "psychological",  label: "Psychological",       desc: "Cerebral storytelling",   backdrop: "/s4aMk1tIho6MiRH1wL8NkfUluqB.jpg", accent: "#a78bfa", film: "Black Swan" },
  { value: "scifi",          label: "Sci-Fi",              desc: "Science, space, future",  backdrop: "/mVr0UiqyltcfqxbAUcLl9zWL8ah.jpg", accent: "#60a5fa", film: "Blade Runner 2049" },
  { value: "crime",          label: "Crime & Noir",        desc: "Heists & underworld",     backdrop: "/tSPT36ZKlP2WVHJLM4cQPLSzv3b.jpg", accent: "#94a3b8", film: "The Godfather" },
  { value: "horror",         label: "Horror",              desc: "Fear & the unknown",      backdrop: "/gJbTXKNTL6O7r7PzF6ZRkJGBlPp.jpg", accent: "#f43f5e", film: "Hereditary" },
  { value: "drama",          label: "Emotional Drama",     desc: "Human stories, deeply",   backdrop: "/zb6fM1CX41D9rF9hdgclu0peUmy.jpg", accent: "#facc15", film: "Schindler's List" },
  { value: "thriller",       label: "Thriller",            desc: "Suspense & twists",       backdrop: "/iWak7wT0j6ycCc8lKr4NBz9c7n5.jpg", accent: "#f59e0b", film: "Gone Girl" },
];

const pacingOptions: { value: Pacing; label: string; desc: string; backdrop: string; accent: string; film: string }[] = [
  { value: "slow", label: "Slow & Artistic",      desc: "Meditative, immersive storytelling", backdrop: "/bYimqNnizPUCnL5HOdoCW02IGmH.jpg", accent: "#a78bfa", film: "The Tree of Life" },
  { value: "fast", label: "Fast & Entertaining",  desc: "Energetic, gripping, fun",            backdrop: "/uT895WNwm0aIJRtGizcQhrejWUo.jpg", accent: "#f97316", film: "Mad Max: Fury Road" },
];

const languageOptions: { value: Language; label: string; flag: string }[] = [
  { value: "any", label: "Any Language", flag: "🌍" },
  { value: "en",  label: "English",      flag: "🇺🇸" },
  { value: "ko",  label: "Korean",       flag: "🇰🇷" },
  { value: "ja",  label: "Japanese",     flag: "🇯🇵" },
  { value: "hi",  label: "Hindi",        flag: "🇮🇳" },
  { value: "es",  label: "Spanish",      flag: "🇪🇸" },
  { value: "fr",  label: "French",       flag: "🇫🇷" },
];

// Reusable image card
function ImgCard({
  backdrop, accent, label, sub, selected, onClick, height = 144,
}: {
  backdrop: string; accent: string; label: string; sub: string;
  selected?: boolean; onClick: () => void; height?: number;
}) {
  return (
    <button
      onClick={onClick}
      style={{ height }}
      className={`relative rounded-xl overflow-hidden cursor-pointer group w-full border transition-all duration-300 hover:scale-105 ${
        selected ? "border-[#c4843a] glow-gold" : "border-[#1e1e30] hover:border-[#c4843a]/40"
      }`}
    >
      <img src={`/api/img/t/p/w500${backdrop}`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={label} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
      {selected && <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: accent }} />}
      <div className="absolute bottom-0 left-0 right-0 p-2">
        <p className="font-cinzel text-xs text-[#f5f0e8] font-bold leading-tight">{label}</p>

      </div>
    </button>
  );
}

export default function QuizPage() {
  const [step, setStep] = useState<Step>("mood");
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [submitted, setSubmitted] = useState(false);
  const [animating, setAnimating] = useState(false);

  const currentStepIndex = STEPS.indexOf(step);
  const progress = (currentStepIndex / (STEPS.length - 1)) * 100;

  const { data: recommendations, isLoading: loadingRecs } = useQuery({
    queryKey: ["mood-recs", answers],
    queryFn: () => getMoodRecommendations(answers),
    enabled: submitted,
  });

  const goNext = (nextStep: Step) => {
    setAnimating(true);
    setTimeout(() => { setStep(nextStep); setAnimating(false); }, 300);
  };

  const handleMood = (mood: Mood) => { setAnswers(a => ({ ...a, mood })); goNext("watching"); };
  const handleWatching = (watchingWith: WatchingWith) => { setAnswers(a => ({ ...a, watchingWith })); goNext("cinema"); };

  const handleCinema = (type: CinemaType) => {
    const current = answers.cinemaType || [];
    const updated = current.includes(type) ? current.filter(t => t !== type) : [...current, type];
    setAnswers(a => ({ ...a, cinemaType: updated }));
    if (!current.includes(type)) {
      setTimeout(() => goNext("language"), 400);
    }
  };
  const handleLanguage = (language: Language) => { setAnswers(a => ({ ...a, language })); goNext("results"); setTimeout(() => setSubmitted(true), 400); };
  const reset = () => { setStep("mood"); setAnswers({}); setSubmitted(false); };

  return (
    <div className="min-h-screen bg-[#050508] pt-24 pb-16">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#c4843a]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#c0392b]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6">

        {step !== "results" && (
          <>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles size={20} className="text-[#c4843a]" />
                <span className="font-inter text-[#c4843a] text-xs tracking-[0.3em] uppercase">Mood Discovery</span>
              </div>
              <h1 className="font-cinzel text-3xl md:text-4xl font-bold text-[#f5f0e8] mb-3">Find Your Perfect Film</h1>
              <p className="font-playfair italic text-[#9a9098] text-lg">A few questions to discover cinema made for this moment.</p>
            </div>
            <div className="mb-10">
              <div className="flex justify-between text-xs text-[#4a4558] mb-2 font-inter">
                <span>Step {currentStepIndex + 1} of {STEPS.length - 1}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-1 bg-[#1e1e30] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#c0392b] to-[#c4843a] rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </>
        )}

        {/* MOOD */}
        {step === "mood" && (
          <div className={`transition-all duration-300 ${animating ? "opacity-0 translate-x-8" : "opacity-100 translate-x-0"}`}>
            <h2 className="font-cinzel text-xl text-[#f5f0e8] text-center mb-2">How are you feeling right now?</h2>
            <p className="text-center text-[#4a4558] text-sm mb-8 font-inter">Be honest — cinema is therapy.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {moodOptions.map(opt => (
                <ImgCard key={opt.value} backdrop={opt.backdrop} accent={opt.accent} label={opt.label} sub={opt.film}
                  selected={answers.mood === opt.value} onClick={() => handleMood(opt.value)} height={144} />
              ))}
            </div>
          </div>
        )}

        {/* WATCHING WITH */}
        {step === "watching" && (
          <div className={`transition-all duration-300 ${animating ? "opacity-0 translate-x-8" : "opacity-100 translate-x-0"}`}>
            <h2 className="font-cinzel text-xl text-[#f5f0e8] text-center mb-2">Who are you watching with?</h2>
            <p className="text-center text-[#4a4558] text-sm mb-8 font-inter">Sets the tone for the whole experience.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {watchingOptions.map(opt => (
                <ImgCard key={opt.value} backdrop={opt.backdrop} accent={opt.accent} label={opt.label} sub={opt.film}
                  selected={answers.watchingWith === opt.value} onClick={() => handleWatching(opt.value)} height={160} />
              ))}
            </div>
          </div>
        )}

        {/* CINEMA TYPE */}
        {step === "cinema" && (
          <div className={`transition-all duration-300 ${animating ? "opacity-0 translate-x-8" : "opacity-100 translate-x-0"}`}>
            <h2 className="font-cinzel text-xl text-[#f5f0e8] text-center mb-2">What kind of cinema calls to you?</h2>
            <p className="text-center text-[#4a4558] text-sm mb-8 font-inter">Pick one — it takes you straight in.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {cinemaOptions.map(opt => (
                <ImgCard key={opt.value} backdrop={opt.backdrop} accent={opt.accent} label={opt.label} sub={opt.film}
                  selected={answers.cinemaType?.includes(opt.value)} onClick={() => handleCinema(opt.value)} height={144} />
              ))}
            </div>
          </div>
        )}

        {/* LANGUAGE */}
        {step === "language" && (
          <div className={`transition-all duration-300 ${animating ? "opacity-0 translate-x-8" : "opacity-100 translate-x-0"}`}>
            <h2 className="font-cinzel text-xl text-[#f5f0e8] text-center mb-2">Preferred language?</h2>
            <p className="text-center text-[#4a4558] text-sm mb-8 font-inter">Great cinema speaks every tongue.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
              {languageOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleLanguage(opt.value)}
                  className={`glass rounded-xl p-5 text-center cursor-pointer border transition-all duration-300 hover:scale-105 ${
                    answers.language === opt.value ? "border-[#c4843a] bg-[#c4843a]/10 glow-gold" : "border-[#1e1e30] hover:border-[#c4843a]/40 hover:bg-[#c4843a]/5"
                  }`}
                >
                  <div className="text-3xl mb-2">{opt.flag}</div>
                  <p className="font-inter text-sm text-[#f5f0e8] font-medium">{opt.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* RESULTS */}
        {step === "results" && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles size={24} className="text-[#c4843a]" />
              </div>
              <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-[#f5f0e8] mb-3">
                Your Cinema, <span className="text-gold-gradient">Curated.</span>
              </h2>
              <p className="font-playfair italic text-[#9a9098] text-lg mb-2">
                Based on your {answers.mood?.replace("-", " ")} mood tonight
              </p>
              {answers.watchingWith && (
                <p className="text-[#4a4558] text-sm font-inter">
                  Watching {answers.watchingWith === "alone" ? "solo" : `with ${answers.watchingWith}`}
                  {answers.language && answers.language !== "any" ? ` · ${answers.language.toUpperCase()} films` : ""}
                </p>
              )}
              <button onClick={reset} className="mt-4 inline-flex items-center gap-2 text-[#4a4558] hover:text-[#9a9098] text-sm font-inter transition-colors">
                <RotateCcw size={14} /> Start over
              </button>
            </div>

            {loadingRecs ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-full border-2 border-[#c4843a]/30 border-t-[#c4843a] animate-spin mx-auto mb-4" />
                <p className="font-playfair italic text-[#9a9098]">Curating your perfect cinema experience...</p>
              </div>
            ) : recommendations && recommendations.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {recommendations.map((movie, i) => (
                  <MovieCard key={movie.id} movie={movie} mood={answers.mood} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-[#9a9098] font-inter">No results found. Try different preferences.</p>
                <button onClick={reset} className="mt-4 text-[#c4843a] underline text-sm">Try again</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
