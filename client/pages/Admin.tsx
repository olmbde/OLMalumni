import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { AdminPanel } from "@/components/AdminPanel";
import { useGraduates } from "@/hooks/useGraduates";
import { useAuth } from "@/hooks/useAuth";

export default function Admin() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const { graduates, loading, addGraduate, deleteGraduate } = useGraduates(refetchTrigger);

  useEffect(() => {
    // Check if user is authenticated (from localStorage)
    const isAuth = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuth) {
      navigate("/");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const handleAddGraduate = async (graduate: any) => {
    const result = await addGraduate(graduate);
    if (result.success) {
      setRefetchTrigger((prev) => prev + 1);
    }
    return result;
  };

  const handleDeleteGraduate = async (id: string) => {
    const result = await deleteGraduate(id);
    if (result.success) {
      setRefetchTrigger((prev) => prev + 1);
    }
    return result;
  };

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    navigate("/");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isAuthenticated={true} onLogout={handleLogout} />

      <main className="container px-4 py-12 md:px-6 md:py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Panel Administrateur
          </h1>
          <p className="text-lg text-muted-foreground">
            Gérez les informations des bacheliers de Lycée OLM
          </p>
        </div>

        <AdminPanel
          graduates={graduates}
          loading={loading}
          onAddGraduate={handleAddGraduate}
          onDeleteGraduate={handleDeleteGraduate}
        />
      </main>
    </div>
  );
}
