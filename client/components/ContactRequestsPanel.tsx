import { useEffect, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Trash2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContactRequests } from "@/hooks/useContactRequests";
import type { ContactRequest } from "@shared/api";

interface ContactRequestsPanelProps {
  refetchTrigger?: number;
}

export function ContactRequestsPanel({
  refetchTrigger = 0,
}: ContactRequestsPanelProps) {
  const { contactRequests, loading, fetchContactRequests, deleteContactRequest } =
    useContactRequests();
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchContactRequests();
  }, [refetchTrigger]);

  const handleDelete = async (id: string) => {
    if (
      confirm(
        "Êtes-vous sûr de vouloir supprimer cette demande de contact?"
      )
    ) {
      setDeleteLoading(id);
      const result = await deleteContactRequest(id);
      setDeleteLoading(null);
      if (!result.success) {
        alert("Erreur lors de la suppression: " + result.error);
      }
    }
  };

  const handleCopyContact = (contact: string, id: string) => {
    navigator.clipboard.writeText(contact);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy 'à' HH:mm", {
      locale: fr,
    });
  };

  return (
    <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Demandes de Contact
      </h2>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">
          Chargement...
        </div>
      ) : contactRequests.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Aucune demande de contact pour le moment
        </div>
      ) : (
        <div className="space-y-4">
          {contactRequests.map((request) => (
            <div
              key={request.id}
              className="border border-border rounded-lg p-4 hover:bg-secondary/30 transition-colors"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Requested Graduate */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Bachelier demandé
                  </p>
                  <p className="text-foreground font-semibold mt-1">
                    {request.requested_graduate_name}
                  </p>
                </div>

                {/* Requester Name */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Demandeur
                  </p>
                  <p className="text-foreground font-semibold mt-1">
                    {request.requester_name}
                  </p>
                </div>

                {/* Requester Contact */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Contact du demandeur
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-foreground font-mono text-sm break-all">
                      {request.requester_contact}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleCopyContact(request.requester_contact, request.id)
                      }
                      className="h-6 w-6 p-0"
                    >
                      {copiedId === request.id ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Date */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Date de la demande
                  </p>
                  <p className="text-foreground mt-1">{formatDate(request.created_at)}</p>
                </div>
              </div>

              {/* Message */}
              {request.message && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Message
                  </p>
                  <p className="text-foreground text-sm bg-secondary/30 rounded p-3">
                    {request.message}
                  </p>
                </div>
              )}

              {/* Delete Button */}
              <div className="mt-4 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(request.id)}
                  disabled={deleteLoading === request.id}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {deleteLoading === request.id ? "Suppression..." : "Supprimer"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
