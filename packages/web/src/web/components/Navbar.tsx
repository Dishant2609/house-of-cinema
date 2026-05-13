import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, X, Tv, Sparkles, Bookmark } from "lucide-react";
import { useWatchlistContext } from "../context/WatchlistContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, navigate] = useLocation();
  const { total: watchlistCount } = useWatchlistContext();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/discover", label: "Discover" },
    { href: "/top250", label: "Top 250" },
    { href: "/anime", label: "Anime" },
    { href: "/directors", label: "Directors" },
    { href: "/watchlist", label: "Watchlist" },
    { href: "/quiz", label: "For You" },
  ];

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass border-b border-white/5 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="w-full px-6 md:px-10 flex items-center justify-between">
          {/* Logo — far left */}
          <Link to="/">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-9 h-9 rounded-full overflow-hidden pulse-gold">
                <img src="/logo.png" alt="House of Cinema" className="w-full h-full object-cover" />
              </div>
              <span className="font-cinzel text-lg font-bold tracking-wider text-gold-gradient">
                HOUSE<span className="text-[#f5f0e8]/60 font-light"> of </span>CINEMA
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links — centered */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href}>
                <span
                  className={`font-inter text-sm tracking-widest uppercase cursor-pointer transition-all duration-200 ${
                    isActive(link.href)
                      ? "text-[#c4843a] glow-gold-text"
                      : "text-[#9a9098] hover:text-[#f5f0e8]"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Actions — far right */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-[#9a9098] hover:text-[#c4843a] transition-colors"
            >
              <Search size={20} />
            </button>
            {/* Watchlist icon with badge */}
            <Link to="/watchlist">
              <button className="relative p-2 text-[#9a9098] hover:text-[#c4843a] transition-colors">
                <Bookmark size={20} className={location.startsWith("/watchlist") ? "text-[#c4843a] fill-[#c4843a]" : ""} />
                {watchlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-[#c4843a] rounded-full text-[9px] font-bold text-white flex items-center justify-center px-1 leading-none">
                    {watchlistCount > 99 ? "99+" : watchlistCount}
                  </span>
                )}
              </button>
            </Link>
            <Link to="/quiz">
              <button className="hidden md:flex items-center gap-2 bg-gradient-to-r from-[#c0392b] to-[#e74c3c] text-white text-xs font-semibold tracking-widest uppercase px-5 py-2.5 rounded-full hover:glow-crimson transition-all duration-300">
                <Sparkles size={14} />
                Mood Match
              </button>
            </Link>
            <button
              className="md:hidden p-2 text-[#9a9098] hover:text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden glass border-t border-white/5 mt-2 px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href}>
                <span
                  className={`block font-inter text-sm tracking-widest uppercase cursor-pointer py-2 ${
                    isActive(link.href) ? "text-[#c4843a]" : "text-[#9a9098]"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Search Overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-start justify-center pt-32"
          onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
        >
          <div className="w-full max-w-2xl mx-6">
            <form onSubmit={handleSearch} className="relative">
              <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#c4843a]" />
              <input
                type="text"
                placeholder="Search movies, shows, anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full glass-gold pl-14 pr-6 py-5 text-lg text-[#f5f0e8] placeholder-[#4a4558] rounded-xl outline-none font-inter"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-[#4a4558] hover:text-[#9a9098]"
              >
                <X size={20} />
              </button>
            </form>
            <p className="text-center text-[#4a4558] text-sm mt-4 font-inter">
              Press Enter to search · Esc to close
            </p>
          </div>
        </div>
      )}
    </>
  );
}
