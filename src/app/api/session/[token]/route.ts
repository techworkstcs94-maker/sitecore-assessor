import { NextResponse } from 'next/server';
import { getServiceClient, isSupabaseConfigured } from '@/lib/supabase';
import { mockGetCandidateByToken } from '@/lib/mockDb';

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  if (!isSupabaseConfigured()) {
    const data = mockGetCandidateByToken(token);
    if (!data) return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    return NextResponse.json(data);
  }

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from('candidates')
    .select('*, submissions(*)')
    .eq('session_token', token)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}
