import { useState, useEffect, useCallback } from "react";
import type { TMDBMovie } from "../lib/tmdb";

export interface WatchlistItem {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  original_language: string;
  overview: string;
  addedAt: number; // timestamp
  watched: boolean;
  rating?: number; // user rating 1-5
  type: "movie" | "show";
}

const STORAGE_KEY = "hoc_watchlist";

function load(): WatchlistItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(items: WatchlistItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useWatchlist() {
  const [items, setItems] = useState<WatchlistItem[]>(load);

  const persist = useCallback((next: WatchlistItem[]) => {
    setItems(next);
    save(next);
  }, []);

  const add = useCallback((movie: TMDBMovie, type: "movie" | "show" = "movie") => {
    setItems((prev) => {
      if (prev.find((i) => i.id === movie.id)) return prev;
      const next = [
        {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          genre_ids: movie.genre_ids || [],
          original_language: movie.original_language,
          overview: movie.overview,
          addedAt: Date.now(),
          watched: false,
          type,
        },
        ...prev,
      ];
      save(next);
      return next;
    });
  }, []);

  const remove = useCallback((id: number) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      save(next);
      return next;
    });
  }, []);

  const toggleWatched = useCallback((id: number) => {
    setItems((prev) => {
      const next = prev.map((i) =>
        i.id === id ? { ...i, watched: !i.watched } : i
      );
      save(next);
      return next;
    });
  }, []);

  const setRating = useCallback((id: number, rating: number) => {
    setItems((prev) => {
      const next = prev.map((i) =>
        i.id === id ? { ...i, rating, watched: true } : i
      );
      save(next);
      return next;
    });
  }, []);

  const isInWatchlist = useCallback(
    (id: number) => items.some((i) => i.id === id),
    [items]
  );

  const isWatched = useCallback(
    (id: number) => items.find((i) => i.id === id)?.watched ?? false,
    [items]
  );

  return {
    items,
    add,
    remove,
    toggleWatched,
    setRating,
    isInWatchlist,
    isWatched,
    total: items.length,
    watchedCount: items.filter((i) => i.watched).length,
    unwatchedCount: items.filter((i) => !i.watched).length,
  };
}
