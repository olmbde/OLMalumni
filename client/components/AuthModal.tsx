import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess?: () => void;
}

export function AuthModal({ open, onOpenChange, onLoginSuccess }: AuthModalProps) {
  const { login, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await login(email, password);

    if (result.success) {
      setIsLoading(false);
      onOpenChange(false);
      setEmail("");
      setPassword("");
      onLoginSuccess?.();
    } else {
      setError(result.error || "Erreur de connexion");
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal */}
      <div className="relative z-50 w-full max-w-md mx-4 bg-background rounded-2xl shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">Connexion</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground font-medium">
              Mot de passe
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-10"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || authLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium mt-6"
          >
            {isLoading || authLoading ? "Connexion en cours..." : "Se connecter"}
          </Button>
        </form>

      </div>
    </div>
  );
}
