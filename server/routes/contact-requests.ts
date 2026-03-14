import { RequestHandler } from "express";
import { supabase } from "../lib/supabase";
import type { ContactRequest } from "@shared/api";

export const submitContactRequest: RequestHandler = async (req, res) => {
  try {
    const {
      requested_graduate_id,
      requested_graduate_name,
      requester_name,
      requester_contact,
      message,
    } = req.body;

    // Validation
    if (!requested_graduate_id || !requester_name || !requester_contact) {
      return res
        .status(400)
        .json({ error: "Missing required fields" });
    }

    const { data, error } = await supabase
      .from("contact_requests")
      .insert([
        {
          requested_graduate_id,
          requested_graduate_name,
          requester_name,
          requester_contact,
          message: message || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    const response: ContactRequest = {
      id: data.id,
      requested_graduate_id: data.requested_graduate_id,
      requested_graduate_name: data.requested_graduate_name,
      requester_name: data.requester_name,
      requester_contact: data.requester_contact,
      message: data.message || undefined,
      created_at: data.created_at,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Error submitting contact request:", error);
    res
      .status(500)
      .json({ error: "Failed to submit contact request" });
  }
};

export const getContactRequests: RequestHandler = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("contact_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const requests: ContactRequest[] = (data || []).map((item: any) => ({
      id: item.id,
      requested_graduate_id: item.requested_graduate_id,
      requested_graduate_name: item.requested_graduate_name,
      requester_name: item.requester_name,
      requester_contact: item.requester_contact,
      message: item.message || undefined,
      created_at: item.created_at,
    }));

    res.json(requests);
  } catch (error) {
    console.error("Error fetching contact requests:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch contact requests" });
  }
};

export const deleteContactRequest: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Request ID is required" });
    }

    const { error } = await supabase
      .from("contact_requests")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting contact request:", error);
    res
      .status(500)
      .json({ error: "Failed to delete contact request" });
  }
};
