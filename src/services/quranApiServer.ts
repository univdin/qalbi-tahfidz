import { createServerClient } from "@quranjs/api/server";

export interface QuranApiCredentials {
  clientId: string;
  clientSecret: string;
}

export function getQuranApiCredentials(): QuranApiCredentials | null {
  const clientId = process.env.QURAN_API_CLIENT_ID;
  const clientSecret = process.env.QURAN_API_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

export function isQuranApiConfigured(): boolean {
  return getQuranApiCredentials() !== null;
}

export function createQuranApiClient() {
  const credentials = getQuranApiCredentials();
  if (!credentials) return null;
  return createServerClient({
    clientId: credentials.clientId,
    clientSecret: credentials.clientSecret,
  });
}
