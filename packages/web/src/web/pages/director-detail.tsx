import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { person, img } from "../lib/tmdb";
import type { TMDBMovieCredit } from "../lib/tmdb";
import MovieCard from "../components/MovieCard";
import { ArrowLeft, MapPin, Calendar, Film, Star } from "lucide-react";

export default function DirectorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const personId = Number(id);

  const { data: director, isLoading: bioLoading } = useQuery({
    queryKey: ["person", personId],
    queryFn: () => person.detail(personId),
    staleTime: 30 * 60 * 1000,
  });

  const { data: credits, isLoading: creditsLoading } = useQuery({
    queryKey: ["person-credits", personId],
    queryFn: () => person.movieCredits(personId),
    staleTime: 30 * 60 * 1000,
  });

  // Filter to only directed movies, sorted by year desc
  const directedMovies: TMDBMovieCredit[] = credits
    ? credits.crew
        .filter((c) => c.job === "Director" && c.poster_path && c.vote_count > 20)
        .sort((a, b) => {
          const ya = a.release_date ? parseInt(a.release_date.split("-")[0]) : 0;
          const yb = b.release_date ? parseInt(b.release_date.split("-")[0]) : 0;
          return yb - ya;
        })
        // deduplicate by id
        .filter((c, i, arr) => arr.findIndex((x) => x.id === c.id) === i)
    : [];

  const profileUrl = director?.profile_path
    ? img.profile(director.profile_path)
    : null;

  const avgRating =
    directedMovies.length > 0
      ? (
          directedMovies.reduce((sum, m) => sum + m.vote_average, 0) /
          directedMovies.length
        ).toFixed(1)
      : null;

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const truncateBio = (bio: string, maxLen = 600) => {
    if (!bio || bio.length <= maxLen) return bio;
    return bio.slice(0, bio.lastIndexOf(" ", maxLen)) + "…";
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Back button */}
      <div className="px-6 md:px-10 mb-8">
        <button
          onClick={() => navigate("/directors")}
          className="flex items-center gap-2 text-[#9a9098] hover:text-[#c4843a] transition-colors font-inter text-sm group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          All Directors
        </button>
      </div>

      {/* Bio section */}
      <div className="px-6 md:px-10 max-w-7xl mx-auto">
        {bioLoading ? (
          <div className="flex gap-8 animate-pulse">
            <div className="w-44 h-64 rounded-xl bg-[#12121e] shrink-0" />
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-[#12121e] rounded w-64" />
              <div className="h-4 bg-[#12121e] rounded w-48" />
              <div className="h-32 bg-[#12121e] rounded" />
            </div>
          </div>
        ) : director ? (
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Profile photo */}
            <div className="shrink-0">
              <div className="w-40 h-60 md:w-48 md:h-72 rounded-xl overflow-hidden border border-[#1e1e30] shadow-xl">
                {profileUrl ? (
                  <img
                    src={profileUrl}
                    alt={director.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#12121e] flex items-center justify-center">
                    <Film size={40} className="text-[#2a2a3a]" />
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="mt-4 space-y-2">
                {director.birthday && (
                  <div className="flex items-center gap-2 text-[#9a9098] text-xs font-inter">
                    <Calendar size={12} className="text-[#c4843a]" />
                    <span>{formatDate(director.birthday)}</span>
                  </div>
                )}
                {director.place_of_birth && (
                  <div className="flex items-center gap-2 text-[#9a9098] text-xs font-inter">
                    <MapPin size={12} className="text-[#c4843a]" />
                    <span className="line-clamp-1">{director.place_of_birth}</span>
                  </div>
                )}
                {avgRating && (
                  <div className="flex items-center gap-2 text-[#9a9098] text-xs font-inter">
                    <Star size={12} className="text-[#c4843a] fill-[#c4843a]" />
                    <span>Avg. Rating: <strong className="text-[#c4843a]">{avgRating}</strong></span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-[#9a9098] text-xs font-inter">
                  <Film size={12} className="text-[#c4843a]" />
                  <span><strong className="text-[#c4843a]">{directedMovies.length}</strong> films</span>
                </div>
              </div>
            </div>

            {/* Bio text */}
            <div className="flex-1">
              <h1 className="font-cinzel text-3xl md:text-4xl font-black text-[#f5f0e8] mb-2">
                {director.name}
              </h1>
              <div className="h-0.5 w-16 bg-gradient-to-r from-[#c4843a] to-transparent mb-6" />

              {director.biography ? (
                <p className="font-inter text-[#9a9098] text-sm leading-relaxed">
                  {truncateBio(director.biography)}
                </p>
              ) : (
                <p className="font-inter text-[#4a4558] text-sm italic">No biography available.</p>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Filmography */}
      <div className="mt-14 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Film size={18} className="text-[#c4843a]" />
          <span className="font-inter text-xs tracking-[0.3em] uppercase text-[#c4843a]">Filmography</span>
        </div>
        <h2 className="font-cinzel text-2xl font-bold text-[#f5f0e8] mb-8">
          {director?.name ? `Directed by ${director.name}` : "Films"}
        </h2>

        {creditsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] rounded-xl bg-[#12121e] animate-pulse" />
            ))}
          </div>
        ) : directedMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {directedMovies.map((movie, i) => (
              <MovieCard
                key={movie.id}
                movie={{
                  ...movie,
                  // TMDBMovieCredit has same shape as TMDBMovie minus some fields
                  genre_ids: movie.genre_ids || [],
                }}
                index={i}
              />
            ))}
          </div>
        ) : (
          <p className="text-[#4a4558] font-inter text-sm">No directed films found.</p>
        )}
      </div>
    </div>
  );
}
