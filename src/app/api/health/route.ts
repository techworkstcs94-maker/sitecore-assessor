import { NextResponse } from 'next/server';
import { getServiceClient, isSupabaseConfigured } from '@/lib/supabase';

export async function GET() {
  const status: Record<string, string> = { status: 'ok', timestamp: new Date().toISOString() };

  if (isSupabaseConfigured()) {
    try {
      // Minimal query — just enough to reset Supabase's inactivity clock
      const { error } = await getServiceClient()
        .from('candidates')
        .select('id', { count: 'exact', head: true });

      status.db = error ? 'error' : 'ok';
    } catch {
      status.db = 'error';
    }
  } else {
    status.db = 'mock';
  }

  return NextResponse.json(status);
}
