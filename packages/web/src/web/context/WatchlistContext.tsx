import { createContext, useContext, type ReactNode } from "react";
import { useWatchlist } from "../hooks/useWatchlist";

type WatchlistContextType = ReturnType<typeof useWatchlist>;

const WatchlistContext = createContext<WatchlistContextType | null>(null);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const watchlist = useWatchlist();
  return (
    <WatchlistContext.Provider value={watchlist}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlistContext() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error("useWatchlistContext must be inside WatchlistProvider");
  return ctx;
}
