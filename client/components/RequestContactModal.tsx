import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useContactRequests } from "@/hooks/useContactRequests";
import type { Graduate } from "@/components/GraduateCard";

interface RequestContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  graduate: Graduate;
}

export function RequestContactModal({
  open,
  onOpenChange,
  graduate,
}: RequestContactModalProps) {
  const [requesterName, setRequesterName] = useState("");
  const [requesterContact, setRequesterContact] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { submitContactRequest } = useContactRequests();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await submitContactRequest({
      requested_graduate_id: graduate.id,
      requested_graduate_name: graduate.full_name,
      requester_name: requesterName,
      requester_contact: requesterContact,
      message: message || undefined,
    });

    if (result.success) {
      setShowSuccess(true);
      setRequesterName("");
      setRequesterContact("");
      setMessage("");
      setTimeout(() => {
        setShowSuccess(false);
        onOpenChange(false);
      }, 2000);
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Demander le contact
          </DialogTitle>
        </DialogHeader>

        {showSuccess ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-5xl mb-4">✓</div>
            <p className="text-center text-foreground font-medium">
              Votre demande a été envoyée à l'administration.
            </p>
            <p className="text-center text-sm text-muted-foreground mt-2">
              L'administrateur examinera votre demande et partagera les
              coordonnées si approprié.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="graduate" className="font-medium">
                Bachelier demandé
              </Label>
              <Input
                id="graduate"
                value={graduate.full_name}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requesterName" className="font-medium">
                Votre nom
              </Label>
              <Input
                id="requesterName"
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                placeholder="ex: Ahmed Ben Ali"
                required
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requesterContact" className="font-medium">
                Votre contact
              </Label>
              <Input
                id="requesterContact"
                value={requesterContact}
                onChange={(e) => setRequesterContact(e.target.value)}
                placeholder="ex: email@exemple.com ou +33 6 12 34 56 78"
                required
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="font-medium">
                Message (optionnel)
              </Label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Expliquez le motif de votre demande..."
                className="w-full min-h-24 rounded-md border border-input bg-background px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? "Envoi..." : "Envoyer la demande"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
