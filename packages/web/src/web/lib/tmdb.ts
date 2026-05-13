const IMAGE_BASE = "/api/img";

export const img = {
  poster: (path: string | null, size: "w342" | "w500" | "w780" | "original" = "w500") =>
    path ? `${IMAGE_BASE}/${size}${path}` : null,
  backdrop: (path: string | null, size: "w780" | "w1280" | "original" = "w1280") =>
    path ? `${IMAGE_BASE}/${size}${path}` : null,
  profile: (path: string | null) =>
    path ? `${IMAGE_BASE}/w185${path}` : null,
};

async function tmdb<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`/api/tmdb${endpoint}`, window.location.origin);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
}

export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  original_language: string;
  popularity: number;
  adult: boolean;
}

export interface TMDBMovieDetail extends TMDBMovie {
  runtime: number;
  genres: { id: number; name: string }[];
  tagline: string;
  budget: number;
  revenue: number;
  imdb_id?: string;
  production_countries: { iso_3166_1: string; name: string }[];
  spoken_languages: { english_name: string }[];
  external_ids?: { imdb_id?: string };
  credits?: {
    cast: { id: number; name: string; character: string; profile_path: string | null }[];
    crew: { id: number; name: string; job: string }[];
  };
  videos?: {
    results: { id: string; key: string; name: string; type: string; site: string }[];
  };
  "watch/providers"?: {
    results: Record<string, { flatrate?: { provider_name: string; logo_path: string }[] }>;
  };
}

export interface TMDBShow {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  original_language: string;
}

export interface TMDBShowDetail extends TMDBShow {
  number_of_seasons: number;
  number_of_episodes: number;
  genres: { id: number; name: string }[];
  tagline: string;
  status: string;
  episode_run_time: number[];
  credits?: {
    cast: { id: number; name: string; character: string; profile_path: string | null }[];
    crew: { id: number; name: string; job: string }[];
  };
  videos?: {
    results: { id: string; key: string; name: string; type: string; site: string }[];
  };
  "watch/providers"?: {
    results: Record<string, { flatrate?: { provider_name: string; logo_path: string }[] }>;
  };
}

export interface TMDBResponse<T> {
  results: T[];
  total_pages: number;
  total_results: number;
  page: number;
}

// GENRES
export const MOVIE_GENRES: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
  53: "Thriller", 10752: "War", 37: "Western",
};

// MOVIES
export const movies = {
  trending: (timeWindow: "day" | "week" = "week") =>
    tmdb<TMDBResponse<TMDBMovie>>(`/trending/movie/${timeWindow}`),

  nowPlaying: () =>
    tmdb<TMDBResponse<TMDBMovie>>("/movie/now_playing"),

  topRated: (page = "1") =>
    tmdb<TMDBResponse<TMDBMovie>>("/movie/top_rated", { page }),

  popular: (page = "1") =>
    tmdb<TMDBResponse<TMDBMovie>>("/movie/popular", { page }),

  upcoming: () =>
    tmdb<TMDBResponse<TMDBMovie>>("/movie/upcoming"),

  search: (query: string, page = "1") =>
    tmdb<TMDBResponse<TMDBMovie>>("/search/movie", { query, page }),

  detail: (id: number) =>
    tmdb<TMDBMovieDetail>(`/movie/${id}`, { append_to_response: "credits,videos,watch/providers,external_ids" }),

  byGenre: (genreId: number, page = "1", extraParams: Record<string, string> = {}) =>
    tmdb<TMDBResponse<TMDBMovie>>("/discover/movie", {
      with_genres: String(genreId),
      sort_by: "vote_average.desc",
      "vote_count.gte": "100",
      page,
      ...extraParams,
    }),

  discover: (params: Record<string, string>) =>
    tmdb<TMDBResponse<TMDBMovie>>("/discover/movie", {
      sort_by: "vote_average.desc",
      "vote_count.gte": "50",
      ...params,
    }),

  similar: (id: number) =>
    tmdb<TMDBResponse<TMDBMovie>>(`/movie/${id}/similar`),

  random: async () => {
    const page = Math.floor(Math.random() * 20) + 1;
    const res = await tmdb<TMDBResponse<TMDBMovie>>("/movie/popular", { page: String(page) });
    const filtered = res.results.filter(m => m.vote_average >= 6.5 && m.poster_path);
    return filtered[Math.floor(Math.random() * filtered.length)];
  },
};

// PERSON / DIRECTORS
export interface TMDBPerson {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  also_known_as: string[];
}

export interface TMDBMovieCredit {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  overview: string;
  genre_ids: number[];
  original_language: string;
  popularity: number;
  adult: boolean;
  job?: string;
  character?: string;
  department?: string;
}

export interface TMDBPersonMovieCredits {
  cast: TMDBMovieCredit[];
  crew: TMDBMovieCredit[];
}

export const person = {
  detail: (id: number) =>
    tmdb<TMDBPerson>(`/person/${id}`),

  movieCredits: (id: number) =>
    tmdb<TMDBPersonMovieCredits>(`/person/${id}/movie_credits`),
};

// TV SHOWS
export const shows = {
  trending: (timeWindow: "day" | "week" = "week") =>
    tmdb<TMDBResponse<TMDBShow>>(`/trending/tv/${timeWindow}`),

  topRated: (page = "1") =>
    tmdb<TMDBResponse<TMDBShow>>("/tv/top_rated", { page }),

  popular: (page = "1") =>
    tmdb<TMDBResponse<TMDBShow>>("/tv/popular", { page }),

  search: (query: string) =>
    tmdb<TMDBResponse<TMDBShow>>("/search/tv", { query }),

  detail: (id: number) =>
    tmdb<TMDBShowDetail>(`/tv/${id}`, { append_to_response: "credits,videos,watch/providers" }),

  byGenre: (genreId: number, page = "1") =>
    tmdb<TMDBResponse<TMDBShow>>("/discover/tv", {
      with_genres: String(genreId),
      sort_by: "vote_average.desc",
      "vote_count.gte": "50",
      page,
    }),

  discover: (params: Record<string, string>) =>
    tmdb<TMDBResponse<TMDBShow>>("/discover/tv", {
      sort_by: "vote_average.desc",
      "vote_count.gte": "50",
      ...params,
    }),
};

// ANIME (via TMDB animation genre + Japanese language)
// Genres to always exclude from anime — adult/eroge/hentai coded
const ANIME_EXCLUDE_GENRES = "10749,10768,10770"; // Romance-only, War, TV Movie (common hentai wrappers)
const ANIME_SAFE_PARAMS = {
  include_adult: "false",
  "vote_count.gte": "100",
  without_genres: ANIME_EXCLUDE_GENRES,
  "vote_average.gte": "6.0",
};

export const anime = {
  popular: (page = "1") =>
    tmdb<TMDBResponse<TMDBShow>>("/discover/tv", {
      with_genres: "16",
      with_original_language: "ja",
      sort_by: "popularity.desc",
      include_adult: "false",
      "vote_count.gte": "100",
      "vote_average.gte": "6.0",
      page,
    }),

  topRated: (page = "1") =>
    tmdb<TMDBResponse<TMDBShow>>("/discover/tv", {
      with_genres: "16",
      with_original_language: "ja",
      sort_by: "vote_average.desc",
      include_adult: "false",
      "vote_count.gte": "200",
      "vote_average.gte": "7.0",
      page,
    }),

  movies: (page = "1") =>
    tmdb<TMDBResponse<TMDBMovie>>("/discover/movie", {
      with_genres: "16",
      with_original_language: "ja",
      sort_by: "vote_average.desc",
      include_adult: "false",
      "vote_count.gte": "200",
      "vote_average.gte": "6.5",
      page,
    }),

  search: (query: string) =>
    tmdb<TMDBResponse<TMDBShow>>("/search/tv", { query }),
};

// MOOD-BASED RECOMMENDATION LOGIC
export type Mood = "happy" | "lonely" | "heartbroken" | "motivated" | "emotional" | "curious" | "relaxed" | "dark" | "mind-bending" | "feel-good";
export type WatchingWith = "alone" | "friends" | "partner" | "family";
export type CinemaType = "classic" | "modern" | "underrated" | "international" | "psychological" | "scifi" | "crime" | "horror" | "drama" | "anime" | "thriller";
export type Pacing = "slow" | "fast";
export type Language = "en" | "ko" | "ja" | "hi" | "es" | "fr" | "any";

export interface QuizAnswers {
  mood?: Mood;
  watchingWith?: WatchingWith;
  cinemaType?: CinemaType[];
  pacing?: Pacing;
  language?: Language;
  era?: "classic" | "modern" | "any";
}

// Genre ID reference:
// 28=Action, 12=Adventure, 16=Animation, 35=Comedy, 80=Crime, 99=Documentary
// 18=Drama, 10751=Family, 14=Fantasy, 36=History, 27=Horror, 10402=Music
// 9648=Mystery, 10749=Romance, 878=Sci-Fi, 10770=TV Movie, 53=Thriller, 10752=War, 37=Western

const MOOD_GENRE_MAP: Record<Mood, { genres: number[]; minRating: number; sortBy: string }> = {
  "happy":        { genres: [35, 12, 10749],       minRating: 7.0, sortBy: "vote_average.desc" },
  "feel-good":    { genres: [35, 10749, 10751],     minRating: 6.8, sortBy: "popularity.desc" },
  "lonely":       { genres: [18, 10749, 9648],      minRating: 6.5, sortBy: "vote_average.desc" },
  "heartbroken":  { genres: [18, 10749],            minRating: 6.5, sortBy: "vote_average.desc" },
  "motivated":    { genres: [28, 12, 18],           minRating: 7.0, sortBy: "vote_average.desc" },
  "emotional":    { genres: [18, 10749, 10402],     minRating: 7.0, sortBy: "vote_average.desc" },
  "curious":      { genres: [9648, 878, 99],        minRating: 7.0, sortBy: "vote_average.desc" },
  "relaxed":      { genres: [35, 12, 16],           minRating: 6.5, sortBy: "popularity.desc" },
  "dark":         { genres: [53, 27, 80],           minRating: 7.0, sortBy: "vote_average.desc" },
  "mind-bending": { genres: [878, 9648, 53],        minRating: 7.2, sortBy: "vote_average.desc" },
};

// Cinema type → genre overrides & extra params
const CINEMA_TYPE_MAP: Record<string, { genres?: number[]; extraParams: Record<string, string> }> = {
  modern:        { extraParams: { "primary_release_date.gte": "2010-01-01" } },
  classic:       { extraParams: { "primary_release_date.lte": "1999-12-31", "vote_count.gte": "500" } },
  underrated:    { extraParams: { "vote_count.gte": "100", "vote_count.lte": "2000", "vote_average.gte": "7.0" } },
  international: { extraParams: { "vote_count.gte": "200" } }, // language handled separately
  psychological: { genres: [9648, 53, 18],  extraParams: { "vote_average.gte": "7.2" } },
  scifi:         { genres: [878, 9648, 12], extraParams: { "vote_average.gte": "6.8" } },
  crime:         { genres: [80, 53, 9648],  extraParams: { "vote_average.gte": "7.0" } },
  horror:        { genres: [27, 53, 9648],  extraParams: { "vote_average.gte": "6.5" } },
  drama:         { genres: [18, 10749],     extraParams: { "vote_average.gte": "7.0", "vote_count.gte": "300" } },
  thriller:      { genres: [53, 9648, 80],  extraParams: { "vote_average.gte": "7.0" } },
};

// WatchingWith modifiers
const WATCHING_MODIFIERS: Record<string, Record<string, string>> = {
  family:  { certification_country: "US", "certification.lte": "PG-13" },
  partner: { "vote_average.gte": "7.0" },
  friends: { sort_by: "popularity.desc" },
  alone:   { "vote_count.gte": "200" },
};

export async function getMoodRecommendations(answers: QuizAnswers): Promise<TMDBMovie[]> {
  const mood = answers.mood || "feel-good";
  const { genres: moodGenres, minRating, sortBy } = MOOD_GENRE_MAP[mood];

  // Start with mood base params
  const queryParams: Record<string, string> = {
    sort_by: sortBy,
    "vote_average.gte": String(minRating),
    "vote_count.gte": "150",
    include_adult: "false",
  };

  // Cinema type overrides genres & adds extra filters
  let finalGenres = [...moodGenres];
  if (answers.cinemaType && answers.cinemaType.length > 0) {
    const ct = answers.cinemaType[0];
    const ctMap = CINEMA_TYPE_MAP[ct];
    if (ctMap) {
      if (ctMap.genres) finalGenres = ctMap.genres;
      Object.assign(queryParams, ctMap.extraParams);
    }
    // International: exclude English if not already set
    if (ct === "international" && (!answers.language || answers.language === "any")) {
      queryParams.without_original_language = "en";
    }
  }

  // For partner mood boost romance genres
  if (answers.watchingWith === "partner") {
    if (!finalGenres.includes(10749)) finalGenres = [10749, ...finalGenres];
  }
  // For friends boost comedy & action
  if (answers.watchingWith === "friends") {
    if (!finalGenres.includes(35)) finalGenres = [35, ...finalGenres];
  }

  queryParams.with_genres = finalGenres.slice(0, 3).join("|"); // OR logic = wider results

  // Apply watching-with modifiers
  if (answers.watchingWith && WATCHING_MODIFIERS[answers.watchingWith]) {
    Object.assign(queryParams, WATCHING_MODIFIERS[answers.watchingWith]);
  }

  // Language filter
  if (answers.language && answers.language !== "any") {
    queryParams.with_original_language = answers.language;
    delete queryParams.without_original_language;
  }

  // Fetch 3 pages for variety
  const [page1, page2, page3] = await Promise.all([
    movies.discover({ ...queryParams, page: "1" }),
    movies.discover({ ...queryParams, page: "2" }),
    movies.discover({ ...queryParams, page: "3" }),
  ]);

  const combined = [...page1.results, ...page2.results, ...page3.results]
    .filter(m => m.poster_path && m.vote_average >= minRating);

  // Smart sort: blend rating × popularity
  combined.sort((a, b) => {
    const scoreA = a.vote_average * 0.6 + Math.log10(a.popularity + 1) * 0.4;
    const scoreB = b.vote_average * 0.6 + Math.log10(b.popularity + 1) * 0.4;
    return scoreB - scoreA;
  });

  // Deduplicate
  const seen = new Set<number>();
  return combined.filter(m => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  }).slice(0, 24);
}

export function getDirector(movie: TMDBMovieDetail): string {
  return movie.credits?.crew?.find(c => c.job === "Director")?.name || "Unknown";
}

export function getTrailerKey(item: TMDBMovieDetail | TMDBShowDetail): string | null {
  const videos = item.videos?.results || [];
  const trailer = videos.find(v => v.type === "Trailer" && v.site === "YouTube");
  return trailer?.key || null;
}

export function getStreamingPlatforms(item: TMDBMovieDetail | TMDBShowDetail): string[] {
  const providers = item["watch/providers"]?.results;
  if (!providers) return [];
  // Try IN first, then US
  const region = providers["IN"] || providers["US"] || Object.values(providers)[0];
  return region?.flatrate?.map(p => p.provider_name) || [];
}

export function getMoodSummary(mood: Mood, movieTitle: string): string {
  const summaries: Record<Mood, string> = {
    happy: `"${movieTitle}" will amplify your joy with warmth and charm.`,
    lonely: `"${movieTitle}" will make you feel deeply seen and understood.`,
    heartbroken: `"${movieTitle}" will hold your pain with beauty and grace.`,
    motivated: `"${movieTitle}" will ignite the fire in your soul.`,
    emotional: `"${movieTitle}" will move you in ways words can't describe.`,
    curious: `"${movieTitle}" will take your mind on a fascinating journey.`,
    relaxed: `"${movieTitle}" is perfect for a peaceful, unhurried evening.`,
    dark: `"${movieTitle}" dives fearlessly into darkness and complexity.`,
    "mind-bending": `"${movieTitle}" will shatter your perception of reality.`,
    "feel-good": `"${movieTitle}" is pure cinematic sunshine — guaranteed smiles.`,
  };
  return summaries[mood];
}

export function formatRuntime(minutes: number): string {
  if (!minutes) return "N/A";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function getLanguageName(code: string): string {
  const map: Record<string, string> = {
    en: "English", ko: "Korean", ja: "Japanese", hi: "Hindi",
    es: "Spanish", fr: "French", de: "German", it: "Italian",
    pt: "Portuguese", zh: "Chinese", th: "Thai", tr: "Turkish",
  };
  return map[code] || code.toUpperCase();
}
