import { NextRequest, NextResponse } from 'next/server';

import type { ApiResponse } from '@/lib/types';

export async function GET() {
  const response: ApiResponse = {
    ok: true,
    data: { method: 'GET', message: 'Echo endpoint is working' },
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    const response: ApiResponse = {
      ok: true,
      data: {
        method: 'POST',
        received: body,
        message: 'Data echoed successfully',
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    const errorResponse: ApiResponse = {
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
