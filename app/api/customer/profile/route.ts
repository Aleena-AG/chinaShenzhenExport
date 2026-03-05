import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * GET /api/customer/profile
 * Proxies to backend with the request cookie. Backend returns customer details + all orders for the logged-in customer.
 */
export async function GET(request: NextRequest) {
  try {
    const cookie = request.headers.get('cookie') || '';
    const res = await fetch(`${API_BASE}/api/customer/profile`, {
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
    // Forward Set-Cookie from backend so client keeps session in sync
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      response.headers.set('Set-Cookie', setCookie);
    }
    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch profile';
    return NextResponse.json({ success: false, message }, { status: 502 });
  }
}
