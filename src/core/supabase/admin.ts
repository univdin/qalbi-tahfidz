import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let adminClient: SupabaseClient | null = null;

/** Client service-role (server-only). Hanya untuk operasi admin/public. */
export function getAdminSupabase(): SupabaseClient {
  if (!adminClient) {
    adminClient = createClient(
      process.env.SUPABASE_URL ?? "",
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
    );
  }
  return adminClient;
}
