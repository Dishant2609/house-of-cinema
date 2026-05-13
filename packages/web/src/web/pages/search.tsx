import { useSearch, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, Film, Tv } from "lucide-react";
import { movies, shows } from "../lib/tmdb";
import MovieCard from "../components/MovieCard";
import ShowCard from "../components/ShowCard";

export default function SearchPage() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const query = params.get("q") || "";

  const { data: movieResults, isLoading: moviesLoading } = useQuery({
    queryKey: ["search-movies", query],
    queryFn: () => movies.search(query),
    enabled: !!query,
  });

  const { data: showResults, isLoading: showsLoading } = useQuery({
    queryKey: ["search-shows", query],
    queryFn: () => shows.search(query),
    enabled: !!query,
  });

  const movieCount = movieResults?.results?.filter(m => m.poster_path).length || 0;
  const showCount = showResults?.results?.filter(s => s.poster_path).length || 0;
  const isLoading = moviesLoading || showsLoading;

  return (
    <div className="min-h-screen bg-[#050508] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Search size={24} className="text-[#c4843a]" />
            <h1 className="font-cinzel text-2xl md:text-3xl font-bold text-[#f5f0e8]">
              {query ? (
                <>Search results for <span className="text-gold-gradient">"{query}"</span></>
              ) : (
                "Search Cinema"
              )}
            </h1>
          </div>
          {!isLoading && query && (
            <p className="text-[#4a4558] text-sm font-inter">
              {movieCount + showCount} results found
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 rounded-full border-2 border-[#c4843a]/30 border-t-[#c4843a] animate-spin mx-auto mb-4" />
            <p className="text-[#4a4558] font-inter">Searching the cinema vault...</p>
          </div>
        ) : query ? (
          <div className="space-y-12">
            {/* Movies */}
            {movieCount > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Film size={20} className="text-[#c4843a]" />
                  <h2 className="font-cinzel text-lg font-bold text-[#c4843a]">Movies</h2>
                  <span className="text-[#4a4558] text-sm">({movieCount})</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {movieResults?.results?.filter(m => m.poster_path).slice(0, 18).map((movie, i) => (
                    <MovieCard key={movie.id} movie={movie} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* Shows */}
            {showCount > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Tv size={20} className="text-[#c0392b]" />
                  <h2 className="font-cinzel text-lg font-bold text-[#c0392b]">TV Shows</h2>
                  <span className="text-[#4a4558] text-sm">({showCount})</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {showResults?.results?.filter(s => s.poster_path).slice(0, 18).map((show, i) => (
                    <ShowCard key={show.id} show={show} index={i} />
                  ))}
                </div>
              </div>
            )}

            {movieCount === 0 && showCount === 0 && (
              <div className="text-center py-20">
                <p className="text-[#4a4558] font-inter text-lg">No results for "{query}"</p>
                <p className="text-[#4a4558] text-sm mt-2">Try a different title or keyword.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <Search size={48} className="text-[#1e1e30] mx-auto mb-4" />
            <p className="font-cinzel text-xl text-[#4a4558]">Search for any movie or show</p>
            <p className="text-[#4a4558] text-sm mt-2 font-inter">Use the search bar above to find cinema.</p>
          </div>
        )}
      </div>
    </div>
  );
}
