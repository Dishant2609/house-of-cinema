import { useLocation } from "wouter";
import { img } from "../lib/tmdb";
import { useQueries } from "@tanstack/react-query";
import { person } from "../lib/tmdb";
import type { TMDBPerson } from "../lib/tmdb";
import { Camera } from "lucide-react";

interface CuratedDirector {
  id: number;
  name: string;
  knownFor: string;
  nationality?: string;
}

const CURATED_DIRECTORS: CuratedDirector[] = [
  // Hollywood Legends
  { id: 2636,   name: "Alfred Hitchcock",       knownFor: "Psycho, Vertigo, Rear Window",                    nationality: "🇬🇧" },
  { id: 240,    name: "Stanley Kubrick",         knownFor: "2001: A Space Odyssey, The Shining, Full Metal Jacket", nationality: "🇺🇸" },
  { id: 4385,   name: "Sergio Leone",            knownFor: "The Good The Bad & Ugly, Once Upon a Time in America", nationality: "🇮🇹" },

  // Modern Masters
  { id: 525,    name: "Christopher Nolan",       knownFor: "Inception, The Dark Knight, Oppenheimer",         nationality: "🇬🇧" },
  { id: 1032,   name: "Martin Scorsese",         knownFor: "Goodfellas, Taxi Driver, The Departed",           nationality: "🇺🇸" },
  { id: 138,    name: "Quentin Tarantino",       knownFor: "Pulp Fiction, Kill Bill, Inglourious Basterds",   nationality: "🇺🇸" },
  { id: 488,    name: "Steven Spielberg",        knownFor: "Schindler's List, Jaws, Jurassic Park",           nationality: "🇺🇸" },
  { id: 7467,   name: "David Fincher",           knownFor: "Fight Club, Se7en, Gone Girl",                    nationality: "🇺🇸" },
  { id: 5655,   name: "Wes Anderson",            knownFor: "The Grand Budapest Hotel, Moonrise Kingdom, Asteroid City", nationality: "🇺🇸" },
  { id: 137427, name: "Denis Villeneuve",        knownFor: "Dune, Blade Runner 2049, Arrival",                nationality: "🇨🇦" },
  { id: 578,    name: "Ridley Scott",            knownFor: "Alien, Blade Runner, Gladiator",                  nationality: "🇬🇧" },
  { id: 2710,   name: "James Cameron",           knownFor: "Titanic, Avatar, Terminator 2",                   nationality: "🇨🇦" },
  { id: 5602,   name: "David Lynch",             knownFor: "Mulholland Drive, Blue Velvet, Twin Peaks",       nationality: "🇺🇸" },
  { id: 1776,   name: "Francis Ford Coppola",    knownFor: "The Godfather, Apocalypse Now",                   nationality: "🇺🇸" },
  { id: 108,    name: "Peter Jackson",           knownFor: "The Lord of the Rings, King Kong",                nationality: "🇳🇿" },
  { id: 510,    name: "Tim Burton",              knownFor: "Edward Scissorhands, Batman, Big Eyes",           nationality: "🇺🇸" },
  { id: 190,    name: "Clint Eastwood",          knownFor: "Unforgiven, Million Dollar Baby, Gran Torino",    nationality: "🇺🇸" },
  { id: 1243,   name: "Woody Allen",             knownFor: "Annie Hall, Manhattan, Midnight in Paris",        nationality: "🇺🇸" },
  { id: 4762,   name: "Paul Thomas Anderson",    knownFor: "There Will Be Blood, Boogie Nights, Licorice Pizza", nationality: "🇺🇸" },
  { id: 6431,   name: "Darren Aronofsky",        knownFor: "Black Swan, Requiem for a Dream, The Wrestler",  nationality: "🇺🇸" },
  { id: 564,    name: "Richard Linklater",       knownFor: "Boyhood, Before Sunrise, Dazed and Confused",    nationality: "🇺🇸" },
  { id: 1150,   name: "Brian De Palma",          knownFor: "Scarface, Carrie, Mission: Impossible",           nationality: "🇺🇸" },
  { id: 638,    name: "Michael Mann",            knownFor: "Heat, Collateral, The Insider",                   nationality: "🇺🇸" },
  { id: 1152,   name: "Oliver Stone",            knownFor: "Platoon, JFK, Natural Born Killers",              nationality: "🇺🇸" },
  { id: 7623,   name: "Sam Raimi",               knownFor: "Evil Dead, Spider-Man, Drag Me to Hell",          nationality: "🇺🇸" },
  { id: 11090,  name: "Edgar Wright",            knownFor: "Shaun of the Dead, Hot Fuzz, Baby Driver",        nationality: "🇬🇧" },
  { id: 11770,  name: "John Carpenter",          knownFor: "Halloween, The Thing, Escape from New York",     nationality: "🇺🇸" },
  { id: 1223,   name: "Joel Coen",               knownFor: "No Country for Old Men, Fargo, The Big Lebowski", nationality: "🇺🇸" },
  { id: 5281,   name: "Spike Lee",               knownFor: "Do the Right Thing, Malcolm X, BlacKkKlansman",  nationality: "🇺🇸" },
  { id: 57130,  name: "Todd Phillips",           knownFor: "Joker, The Hangover, War Dogs",                   nationality: "🇺🇸" },
  { id: 67367,  name: "Rian Johnson",            knownFor: "Knives Out, Looper, The Last Jedi",               nationality: "🇺🇸" },
  { id: 291263, name: "Jordan Peele",            knownFor: "Get Out, Us, Nope",                               nationality: "🇺🇸" },
  { id: 45400,  name: "Greta Gerwig",            knownFor: "Barbie, Lady Bird, Little Women",                 nationality: "🇺🇸" },
  { id: 30715,  name: "Terrence Malick",         knownFor: "The Tree of Life, Badlands, The Thin Red Line",  nationality: "🇺🇸" },
  { id: 1769,   name: "Sofia Coppola",           knownFor: "Lost in Translation, The Virgin Suicides, Marie Antoinette", nationality: "🇺🇸" },
  { id: 10828,  name: "Guillermo del Toro",      knownFor: "Pan's Labyrinth, The Shape of Water, Crimson Peak", nationality: "🇲🇽" },
  { id: 122423, name: "Yorgos Lanthimos",        knownFor: "The Favourite, Poor Things, The Lobster",        nationality: "🇬🇷" },
  { id: 138781, name: "Robert Eggers",           knownFor: "The Witch, The Lighthouse, Nosferatu",            nationality: "🇺🇸" },
  { id: 14597,  name: "Gaspar Noé",              knownFor: "Irreversible, Enter the Void, Love",              nationality: "🇫🇷" },

  // World Cinema
  { id: 5026,   name: "Akira Kurosawa",          knownFor: "Seven Samurai, Rashomon, Ran",                   nationality: "🇯🇵" },
  { id: 6648,   name: "Ingmar Bergman",          knownFor: "The Seventh Seal, Wild Strawberries, Persona",   nationality: "🇸🇪" },
  { id: 4415,   name: "Federico Fellini",        knownFor: "8½, La Dolce Vita, Amarcord",                    nationality: "🇮🇹" },
  { id: 8452,   name: "Andrei Tarkovsky",        knownFor: "Stalker, Solaris, Andrei Rublev",                nationality: "🇷🇺" },
  { id: 95501,  name: "Yasujirō Ozu",            knownFor: "Tokyo Story, Late Spring, An Autumn Afternoon",  nationality: "🇯🇵" },
  { id: 15189,  name: "Michelangelo Antonioni",  knownFor: "L'Avventura, Blow-Up, The Passenger",            nationality: "🇮🇹" },
  { id: 4956,   name: "Bernardo Bertolucci",     knownFor: "Last Tango in Paris, The Last Emperor, 1900",    nationality: "🇮🇹" },
  { id: 793,    name: "Luis Buñuel",             knownFor: "The Discreet Charm, Belle de Jour, Viridiana",   nationality: "🇪🇸" },
  { id: 3776,   name: "Jean-Luc Godard",         knownFor: "Breathless, Contempt, Pierrot le Fou",           nationality: "🇫🇷" },
  { id: 3556,   name: "Roman Polanski",          knownFor: "Chinatown, Rosemary's Baby, The Pianist",        nationality: "🇵🇱" },
  { id: 59,     name: "Luc Besson",              knownFor: "Léon: The Professional, The Fifth Element",      nationality: "🇫🇷" },
  { id: 309,    name: "Pedro Almodóvar",         knownFor: "All About My Mother, Talk to Her, Volver",       nationality: "🇪🇸" },
  { id: 6011,   name: "Michael Haneke",          knownFor: "Amour, Caché, The White Ribbon",                  nationality: "🇦🇹" },
  { id: 42,     name: "Lars von Trier",          knownFor: "Melancholia, Dancer in the Dark, Dogville",      nationality: "🇩🇰" },
  { id: 6818,   name: "Werner Herzog",           knownFor: "Fitzcarraldo, Nosferatu, Aguirre the Wrath of God", nationality: "🇩🇪" },
  { id: 27977,  name: "Leos Carax",             knownFor: "Holy Motors, Annette, The Lovers on the Bridge", nationality: "🇫🇷" },

  // East Asian Cinema
  { id: 12453,  name: "Wong Kar-wai",            knownFor: "In the Mood for Love, Chungking Express, 2046",  nationality: "🇭🇰" },
  { id: 21684,  name: "Bong Joon-ho",            knownFor: "Parasite, Snowpiercer, Memories of Murder",      nationality: "🇰🇷" },
  { id: 10099,  name: "Park Chan-wook",          knownFor: "Oldboy, The Handmaiden, Sympathy for Mr. Vengeance", nationality: "🇰🇷" },
  { id: 608,    name: "Hayao Miyazaki",          knownFor: "Spirited Away, Princess Mononoke, My Neighbor Totoro", nationality: "🇯🇵" },
  { id: 40333,  name: "Satoshi Kon",             knownFor: "Paprika, Perfect Blue, Millennium Actress",       nationality: "🇯🇵" },
  { id: 3317,   name: "Takeshi Kitano",          knownFor: "Hana-bi, Sonatine, Zatoichi",                    nationality: "🇯🇵" },
  { id: 607,    name: "Zhang Yimou",             knownFor: "Hero, Raise the Red Lantern, House of Flying Daggers", nationality: "🇨🇳" },
  { id: 1614,   name: "Ang Lee",                 knownFor: "Crouching Tiger, Brokeback Mountain, Life of Pi", nationality: "🇹🇼" },
  { id: 25645,  name: "Hirokazu Kore-eda",       knownFor: "Shoplifters, Broker, Still Walking",              nationality: "🇯🇵" },

  // Middle East / Iran
  { id: 119294, name: "Abbas Kiarostami",        knownFor: "Taste of Cherry, Close-Up, A Separation",        nationality: "🇮🇷" },
  { id: 229931, name: "Asghar Farhadi",          knownFor: "A Separation, The Salesman, About Elly",         nationality: "🇮🇷" },
  { id: 110695, name: "Majid Majidi",            knownFor: "Children of Heaven, The Color of Paradise",       nationality: "🇮🇷" },
  { id: 56214,  name: "Nuri Bilge Ceylan",       knownFor: "Winter Sleep, Once Upon a Time in Anatolia",     nationality: "🇹🇷" },
  { id: 68813,  name: "Céline Sciamma",          knownFor: "Portrait of a Lady on Fire, Girlhood",           nationality: "🇫🇷" },

  // World
  { id: 12160,  name: "Satyajit Ray",            knownFor: "The Apu Trilogy, Charulata, The Music Room",     nationality: "🇮🇳" },
  { id: 223,    name: "Alejandro G. Iñárritu",   knownFor: "Birdman, The Revenant, Amores Perros",           nationality: "🇲🇽" },
  { id: 11218,  name: "Alfonso Cuarón",          knownFor: "Gravity, Roma, Children of Men",                 nationality: "🇲🇽" },
];

export default function DirectorsPage() {
  const [, navigate] = useLocation();

  const personQueries = useQueries({
    queries: CURATED_DIRECTORS.map((d) => ({
      queryKey: ["person", d.id],
      queryFn: () => person.detail(d.id),
      staleTime: 30 * 60 * 1000,
    })),
  });

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 md:px-10">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-14">
        <div className="flex items-center gap-3 mb-3">
          <Camera size={22} className="text-[#c4843a]" />
          <span className="font-inter text-xs tracking-[0.3em] uppercase text-[#c4843a]">Masters of Cinema</span>
        </div>
        <h1 className="font-cinzel text-4xl md:text-5xl font-black text-[#f5f0e8] mb-4">
          The Directors
        </h1>
        <p className="font-inter text-[#9a9098] text-base max-w-xl">
          {CURATED_DIRECTORS.length} visionaries who shaped cinema. Explore their complete filmographies.
        </p>
        <div className="mt-5 h-px w-24 bg-gradient-to-r from-[#c4843a] to-transparent" />
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-5">
        {CURATED_DIRECTORS.map((director, i) => {
          const query = personQueries[i];
          const data = query.data as TMDBPerson | undefined;
          const isLoading = query.isLoading;
          const profileUrl = data?.profile_path
            ? img.profile(data.profile_path)
            : null;

          return (
            <div
              key={director.id}
              onClick={() => navigate(`/directors/${director.id}`)}
              className="group cursor-pointer"
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              {/* Photo */}
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#12121e] border border-[#1e1e30] group-hover:border-[#c4843a]/50 transition-all duration-300 mb-3">
                {isLoading ? (
                  <div className="w-full h-full bg-[#12121e] animate-pulse" />
                ) : profileUrl ? (
                  <img
                    src={profileUrl}
                    alt={director.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[#0e0e1a]">
                    <Camera size={28} className="text-[#2a2a3a]" />
                    <span className="text-[10px] font-inter text-[#2a2a3a] text-center px-2">{director.name}</span>
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent opacity-60" />

                {/* Nationality badge */}
                {director.nationality && (
                  <div className="absolute top-2 right-2 text-sm leading-none bg-black/50 rounded-full px-1 py-0.5">
                    {director.nationality}
                  </div>
                )}

                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-[#c4843a]/20 to-transparent" />
              </div>

              {/* Name + known for */}
              <div className="px-0.5">
                <h3 className="font-cinzel text-[11px] font-bold text-[#f5f0e8] group-hover:text-[#c4843a] transition-colors duration-200 leading-tight mb-1">
                  {director.name}
                </h3>
                <p className="font-inter text-[10px] text-[#4a4558] line-clamp-2 leading-relaxed">
                  {director.knownFor}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
