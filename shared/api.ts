/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Contact request submitted by users to contact graduates
 */
export interface ContactRequest {
  id: string;
  requested_graduate_id: string;
  requested_graduate_name: string;
  requester_name: string;
  requester_contact: string;
  message?: string;
  created_at: string;
}
