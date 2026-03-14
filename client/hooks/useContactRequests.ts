import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { ContactRequest } from "@shared/api";

export function useContactRequests() {
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContactRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("contact_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (supabaseError) {
        console.error("Error fetching contact requests:", supabaseError);
        setError(supabaseError.message);
        setContactRequests([]);
      } else if (data) {
        const formattedData: ContactRequest[] = data.map((item: any) => ({
          id: item.id,
          requested_graduate_id: item.requested_graduate_id,
          requested_graduate_name: item.requested_graduate_name,
          requester_name: item.requester_name,
          requester_contact: item.requester_contact,
          message: item.message || undefined,
          created_at: item.created_at,
        }));
        setContactRequests(formattedData);
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setContactRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const submitContactRequest = async (
    request: Omit<ContactRequest, "id" | "created_at">
  ) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from("contact_requests")
        .insert([
          {
            requested_graduate_id: request.requested_graduate_id,
            requested_graduate_name: request.requested_graduate_name,
            requester_name: request.requester_name,
            requester_contact: request.requester_contact,
            message: request.message || null,
          },
        ])
        .select()
        .single();

      if (supabaseError) throw supabaseError;
      if (data) {
        const newRequest: ContactRequest = {
          id: data.id,
          requested_graduate_id: data.requested_graduate_id,
          requested_graduate_name: data.requested_graduate_name,
          requester_name: data.requester_name,
          requester_contact: data.requester_contact,
          message: data.message || undefined,
          created_at: data.created_at,
        };
        setContactRequests([newRequest, ...contactRequests]);
      }
      return { success: true, error: null };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      console.error("Error submitting contact request:", err);
      return { success: false, error: errorMsg };
    }
  };

  const deleteContactRequest = async (id: string) => {
    try {
      const { error: supabaseError } = await supabase
        .from("contact_requests")
        .delete()
        .eq("id", id);

      if (supabaseError) throw supabaseError;
      setContactRequests(
        contactRequests.filter((request) => request.id !== id)
      );
      return { success: true, error: null };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      console.error("Error deleting contact request:", err);
      return { success: false, error: errorMsg };
    }
  };

  return {
    contactRequests,
    loading,
    error,
    fetchContactRequests,
    submitContactRequest,
    deleteContactRequest,
  };
}
