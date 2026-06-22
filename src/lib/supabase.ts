import { createClient, SupabaseClient } from '@supabase/supabase-js';

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  return url.startsWith('http://') || url.startsWith('https://');
}

let _client: SupabaseClient | null = null;
let _serviceClient: SupabaseClient | null = null;

function getUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
}

function getAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
}

export function getSupabaseClient(): SupabaseClient {
  if (!_client) {
    _client = createClient(getUrl(), getAnonKey());
  }
  return _client;
}

export function getServiceClient(): SupabaseClient {
  if (!_serviceClient) {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
    _serviceClient = createClient(getUrl(), serviceKey, {
      auth: { persistSession: false },
    });
  }
  return _serviceClient;
}

export const supabase = {
  get client() { return getSupabaseClient(); },
};
