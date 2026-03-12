import { useState, useMemo } from "react";
import { Search, Filter, Loader } from "lucide-react";
import { Header } from "@/components/Header";
import { GraduateCard, type Graduate } from "@/components/GraduateCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGraduates } from "@/hooks/useGraduates";
import { useAuth } from "@/hooks/useAuth";

const TRACKS: Graduate["track"][] = [
  "Science Maths",
  "Science Physique",
  "Science SVT",
];

export default function Index() {
  const { graduates, loading } = useGraduates();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTracks, setSelectedTracks] = useState<Graduate["track"][]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  const handleLogoutFromHeader = () => {
    setIsAuthenticated(false);
  };

  const filteredGraduates = useMemo(() => {
    return graduates.filter((graduate) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        graduate.full_name.toLowerCase().includes(searchLower) ||
        graduate.university.toLowerCase().includes(searchLower) ||
        graduate.promotion.toString().includes(searchLower);

      // Track filter
      const matchesTracks =
        selectedTracks.length === 0 || selectedTracks.includes(graduate.track);

      return matchesSearch && matchesTracks;
    });
  }, [searchQuery, selectedTracks]);

  const toggleTrack = (track: Graduate["track"]) => {
    setSelectedTracks((prev) =>
      prev.includes(track) ? prev.filter((t) => t !== track) : [...prev, track]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        isAuthenticated={isAuthenticated}
        onLogout={handleLogoutFromHeader}
      />

      <main className="container px-4 py-12 md:px-6 md:py-16">
        {/* Hero Section */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            Anciens bacheliers
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explorez la base de données des diplômés du Lycée OLM. Découvrez où
            vos camarades poursuivent leurs études.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-10 space-y-4 animate-slide-up">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher par nom, université ou promotion..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base"
            />
          </div>

          {/* Track Filter */}
          <div className="flex items-center gap-2 flex-wrap pb-2">
            <div className="flex items-center gap-2 text-muted-foreground font-medium">
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filière:</span>
            </div>
            {TRACKS.map((track) => (
              <Button
                key={track}
                variant={selectedTracks.includes(track) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleTrack(track)}
                className="transition-all duration-200"
              >
                {track}
              </Button>
            ))}
            {selectedTracks.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTracks([])}
                className="text-muted-foreground hover:text-foreground"
              >
                Réinitialiser
              </Button>
            )}
          </div>

          {/* Results summary */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {filteredGraduates.length}
            </span>
            <span>
              résultats
              {selectedTracks.length > 0 && (
                <span className="ml-1">
                  parmi les filières:{" "}
                  {selectedTracks.map((t) => t.split(" ")[1]).join(", ")}
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Graduate Cards Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Chargement des bacheliers...</p>
          </div>
        ) : filteredGraduates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGraduates.map((graduate, index) => (
              <div
                key={graduate.id}
                style={{
                  animation: `fade-in 0.5s ease-out ${index * 0.05}s both`,
                }}
              >
                <GraduateCard graduate={graduate} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Aucun résultat trouvé
            </h3>
            <p className="text-muted-foreground text-center max-w-md">
              Essayez d'ajuster votre recherche ou vos filtres pour trouver un
              bachelier.
            </p>
          </div>
        )}

        {/* Stats Section */}
        {!loading && (
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-card rounded-xl p-6 border border-border text-center hover:shadow-lg transition-shadow duration-300">
              <div className="text-3xl font-bold text-primary mb-2">
                {graduates.length}
              </div>
              <p className="text-sm text-muted-foreground">Bacheliers inscrits</p>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border text-center hover:shadow-lg transition-shadow duration-300">
              <div className="text-3xl font-bold text-primary mb-2">
                {new Set(graduates.map((g) => g.promotion)).size}
              </div>
              <p className="text-sm text-muted-foreground">Promotions</p>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border text-center hover:shadow-lg transition-shadow duration-300">
              <div className="text-3xl font-bold text-primary mb-2">
                {new Set(graduates.map((g) => g.university)).size}
              </div>
              <p className="text-sm text-muted-foreground">Universités</p>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border text-center hover:shadow-lg transition-shadow duration-300">
              <div className="text-3xl font-bold text-primary mb-2">3</div>
              <p className="text-sm text-muted-foreground">Filières</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
