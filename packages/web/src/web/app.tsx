import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/index";
import QuizPage from "./pages/quiz";
import DiscoverPage from "./pages/discover";
import ShowsPage from "./pages/shows";
import AnimePage from "./pages/anime";
import SearchPage from "./pages/search";
import DirectorsPage from "./pages/directors";
import DirectorDetailPage from "./pages/director-detail";
import WatchlistPage from "./pages/watchlist";
import Top250Page from "./pages/top250";
import { WatchlistProvider } from "./context/WatchlistContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min
      gcTime: 10 * 60 * 1000,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WatchlistProvider>
        <div className="min-h-screen bg-[#050508] text-[#f5f0e8]">
          <Navbar />
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/quiz" component={QuizPage} />
            <Route path="/discover" component={DiscoverPage} />
            <Route path="/shows" component={ShowsPage} />
            <Route path="/anime" component={AnimePage} />
            <Route path="/search" component={SearchPage} />
            <Route path="/directors" component={DirectorsPage} />
            <Route path="/directors/:id" component={DirectorDetailPage} />
            <Route path="/watchlist" component={WatchlistPage} />
            <Route path="/top250" component={Top250Page} />
            <Route>
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="font-cinzel text-6xl font-black text-[#c4843a] mb-4">404</h1>
                  <p className="font-playfair italic text-[#9a9098] text-xl">This scene doesn't exist.</p>
                </div>
              </div>
            </Route>
          </Switch>
          <Footer />
        </div>
      </WatchlistProvider>
    </QueryClientProvider>
  );
}
