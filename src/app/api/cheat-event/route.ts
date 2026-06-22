import { NextResponse } from 'next/server';
import { getServiceClient, isSupabaseConfigured } from '@/lib/supabase';
import { mockInsertCheatEvent } from '@/lib/mockDb';

export async function POST(req: Request) {
  try {
    const { candidate_id, event_type, detail, severity } = await req.json();

    if (!candidate_id || !event_type || !severity) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      mockInsertCheatEvent({ candidate_id, event_type, detail: detail ?? null, severity });
      return NextResponse.json({ ok: true }, { status: 201 });
    }

    const supabase = getServiceClient();
    const { error } = await supabase.from('cheat_events').insert({
      candidate_id, event_type, detail: detail ?? null, severity,
    });

    if (error) throw error;
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error('POST /api/cheat-event', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
