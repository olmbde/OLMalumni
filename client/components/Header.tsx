import { useState } from "react";
import { LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export function Header({ isAuthenticated = false, onLogout }: HeaderProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogout = async () => {
    await logout();
    onLogout?.();
  };

  const handleLoginSuccess = () => {
    setShowAuthModal(false);
    navigate("/admin");
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fa8249b5310834bf49b0ed6bd3b046618%2F27cfe1cc500644869a04b2a248f115d3"
              alt="OLM Logo"
              className="h-12 w-auto"
            />
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-foreground">OLM Alumni Network</h1>
              <p className="text-xs text-muted-foreground">Base de données des bacheliers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/admin")}
                  className="gap-2 hidden sm:flex"
                >
                  <Settings className="w-4 h-4" />
                  <span>Admin</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Déconnexion</span>
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setShowAuthModal(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Connexion
              </Button>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}
