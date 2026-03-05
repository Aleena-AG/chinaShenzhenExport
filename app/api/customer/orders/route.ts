import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * GET /api/customer/orders
 * Only orders for the logged-in customer (same cookie). Forwards request cookie to backend.
 */
export async function GET(request: NextRequest) {
  try {
    const cookie = request.headers.get('cookie') || '';
    const res = await fetch(`${API_BASE}/api/customer/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(cookie ? { Cookie: cookie } : {}),
      },
      cache: 'no-store',
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: data?.message || data?.error || res.statusText },
        { status: res.status }
      );
    }
    const response = NextResponse.json(data);
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      response.headers.set('Set-Cookie', setCookie);
    }
    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch orders';
    return NextResponse.json({ success: false, message }, { status: 502 });
  }
}
