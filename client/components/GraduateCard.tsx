import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { GraduationCap, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RequestContactModal } from "@/components/RequestContactModal";

export interface Graduate {
  id: string;
  full_name: string;
  date_of_birth?: string; // ISO date string
  promotion: number;
  track: "Science Maths" | "Science Physique" | "Science SVT";
  university: string;
  additional_info?: string;
  contact?: string;
}

interface GraduateCardProps {
  graduate: Graduate;
  isAdmin?: boolean;
}

const trackColors: Record<Graduate["track"], string> = {
  "Science Maths": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Science Physique": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  "Science SVT": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
};

export function GraduateCard({
  graduate,
  isAdmin = false,
}: GraduateCardProps) {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const formattedBirthDate = graduate.date_of_birth
    ? format(new Date(graduate.date_of_birth), "d MMMM yyyy", { locale: fr })
    : "Non renseignée";

  return (
    <>
      <div className="animate-fade-in">
        <div className="group relative bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 cursor-pointer overflow-hidden h-full flex flex-col">
          {/* Gradient background on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative space-y-4 flex-1 flex flex-col">
            {/* Header with icon */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground leading-tight">
                  {graduate.full_name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Promotion {graduate.promotion}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Content */}
            <div className="space-y-3 text-sm flex-1">
              <div>
                <p className="text-muted-foreground font-medium">
                  Date de naissance
                </p>
                <p className="text-foreground">{formattedBirthDate}</p>
              </div>

              <div>
                <p className="text-muted-foreground font-medium">Filière</p>
                <Badge className={`mt-1 ${trackColors[graduate.track]}`}>
                  {graduate.track}
                </Badge>
              </div>

              <div>
                <p className="text-muted-foreground font-medium">Université</p>
                <p className="text-foreground">{graduate.university}</p>
              </div>

              {isAdmin && graduate.contact && (
                <div>
                  <p className="text-muted-foreground font-medium">Contact</p>
                  <p className="text-foreground text-xs break-all">
                    {graduate.contact}
                  </p>
                </div>
              )}

              {graduate.additional_info && (
                <div>
                  <p className="text-muted-foreground font-medium">
                    Informations supplémentaires
                  </p>
                  <p className="text-foreground text-xs">
                    {graduate.additional_info}
                  </p>
                </div>
              )}
            </div>

            {/* Button and accent line */}
            <div className="pt-4 space-y-2">
              {!isAdmin && (
                <Button
                  onClick={() => setShowRequestModal(true)}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Demander le contact
                </Button>
              )}
              <div className="h-1 bg-gradient-to-r from-primary to-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        </div>
      </div>

      <RequestContactModal
        open={showRequestModal}
        onOpenChange={setShowRequestModal}
        graduate={graduate}
      />
    </>
  );
}
