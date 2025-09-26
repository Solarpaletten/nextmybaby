import { NextResponse } from 'next/server';

import type { HealthResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const response: HealthResponse = {
    ok: true,
    service: 'dashka-next-core',
    ts: new Date().toISOString(),
  };

  return NextResponse.json(response);
}
