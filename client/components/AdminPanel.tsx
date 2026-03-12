import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Graduate } from "@/components/GraduateCard";

interface AdminPanelProps {
  graduates: Graduate[];
  loading: boolean;
  onAddGraduate: (graduate: Omit<Graduate, "id">) => Promise<{ success: boolean; error: string | null }>;
  onDeleteGraduate: (id: string) => Promise<{ success: boolean; error: string | null }>;
}

const TRACKS: Graduate["track"][] = [
  "Science Maths",
  "Science Physique",
  "Science SVT",
];

export function AdminPanel({
  graduates,
  loading,
  onAddGraduate,
  onDeleteGraduate,
}: AdminPanelProps) {
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [promotion, setPromotion] = useState("");
  const [track, setTrack] = useState<Graduate["track"]>("Science Maths");
  const [university, setUniversity] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [contact, setContact] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await onAddGraduate({
      full_name: fullName,
      date_of_birth: dateOfBirth,
      promotion: parseInt(promotion),
      track,
      university,
      contact: contact || undefined,
      additional_info: additionalInfo || undefined,
    });

    if (result.success) {
      setSuccessMessage("Bachelier ajouté avec succès!");
      setFullName("");
      setDateOfBirth("");
      setPromotion("");
      setTrack("Science Maths");
      setUniversity("");
      setContact("");
      setAdditionalInfo("");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce bachelier?")) {
      setDeleteLoading(id);
      const result = await onDeleteGraduate(id);
      setDeleteLoading(null);
      if (!result.success) {
        alert("Erreur lors de la suppression: " + result.error);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Add Graduate Form */}
      <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Ajouter un Bachelier
        </h2>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="font-medium">
                Nom complet
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Prénom + Nom"
                required
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="font-medium">
                Date de naissance
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="promotion" className="font-medium">
                Promotion (année)
              </Label>
              <Input
                id="promotion"
                type="number"
                value={promotion}
                onChange={(e) => setPromotion(e.target.value)}
                placeholder="20xx"
                required
                min="2000"
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="track" className="font-medium">
                Filière
              </Label>
              <Select value={track} onValueChange={(value: any) => setTrack(value)}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TRACKS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="university" className="font-medium">
                Université
              </Label>
              <Input
                id="university"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="ex: ENSAM"
                required
                className="h-10"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="contact" className="font-medium">
                Contact (email ou téléphone) (optionnel)
              </Label>
              <Input
                id="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="ex: email@exemple.com ou +33 6 12 34 56 78"
                className="h-10"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="additionalInfo" className="font-medium">
                Informations supplémentaires (optionnel)
              </Label>
              <Input
                id="additionalInfo"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="ex: Bourse d'excellence"
                className="h-10"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isSubmitting ? "Ajout en cours..." : "Ajouter un Bachelier"}
          </Button>
        </form>
      </div>

      {/* Graduates List */}
      <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Gérer les Bacheliers
        </h2>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Chargement...
          </div>
        ) : graduates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucun bachelier
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Nom
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Promotion
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Filière
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Université
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Contact
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {graduates.map((graduate) => (
                  <tr
                    key={graduate.id}
                    className="border-b border-border hover:bg-secondary/30 transition-colors"
                  >
                    <td className="py-3 px-4 text-foreground font-medium">
                      {graduate.full_name}
                    </td>
                    <td className="py-3 px-4 text-foreground">
                      {graduate.promotion}
                    </td>
                    <td className="py-3 px-4 text-foreground text-xs">
                      <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded">
                        {graduate.track.split(" ")[1]}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-foreground">
                      {graduate.university}
                    </td>
                    <td className="py-3 px-4 text-foreground">
                      {graduate.contact}
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(graduate.id)}
                        disabled={deleteLoading === graduate.id}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
