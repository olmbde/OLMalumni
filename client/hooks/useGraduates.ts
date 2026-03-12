import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Graduate } from "@/components/GraduateCard";

export function useGraduates(refetch?: number) {
  const [graduates, setGraduates] = useState<Graduate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGraduates = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from("graduates")
          .select("*")
          .order("full_name", { ascending: true });

        if (supabaseError) {
          console.error("Error fetching graduates:", supabaseError);
          setError(supabaseError.message);
          setGraduates([]);
        } else if (data) {
          const formattedData: Graduate[] = data.map((item: any) => ({
            id: item.id,
            full_name: item.full_name,
            date_of_birth: item.date_of_birth,
            promotion: item.promotion,
            track: item.track,
            university: item.university,
            contact: item.contact || undefined,
            additional_info: item.additional_info || undefined,
          }));
          setGraduates(formattedData);
        }
      } catch (err) {
        console.error("Error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setGraduates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGraduates();
  }, [refetch]);

  const addGraduate = async (graduate: Omit<Graduate, "id">) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from("graduates")
        .insert([graduate])
        .select()
        .single();

      if (supabaseError) throw supabaseError;
      if (data) {
        setGraduates([
          ...graduates,
          {
            id: data.id,
            full_name: data.full_name,
            date_of_birth: data.date_of_birth,
            promotion: data.promotion,
            track: data.track,
            university: data.university,
            contact: data.contact || undefined,
            additional_info: data.additional_info || undefined,
          },
        ]);
      }
      return { success: true, error: null };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      console.error("Error adding graduate:", err);
      return { success: false, error: errorMsg };
    }
  };

  const deleteGraduate = async (id: string) => {
    try {
      const { error: supabaseError } = await supabase
        .from("graduates")
        .delete()
        .eq("id", id);

      if (supabaseError) throw supabaseError;
      setGraduates(graduates.filter((g) => g.id !== id));
      return { success: true, error: null };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      console.error("Error deleting graduate:", err);
      return { success: false, error: errorMsg };
    }
  };

  return { graduates, loading, error, addGraduate, deleteGraduate };
}
