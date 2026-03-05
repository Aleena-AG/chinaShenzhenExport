import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';

declare global {
  var __mockAuthStore: Map<string, { customer: { id: number; name: string; email: string; phone?: string }; token: string }> | undefined;
}
const getMockStore = () => {
  if (typeof globalThis.__mockAuthStore === 'undefined') {
    globalThis.__mockAuthStore = new Map();
  }
  return globalThis.__mockAuthStore;
};

export async function POST(request: NextRequest) {
  if (USE_MOCK) {
    try {
      const { email, password } = await request.json();
      if (!email || !password) {
        return NextResponse.json({ success: false, message: 'Email and password required' }, { status: 400 });
      }
      const stored = getMockStore().get(String(email).toLowerCase());
      if (!stored) {
        return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
      }
      return NextResponse.json({
        success: true,
        data: { customer: stored.customer, token: stored.token },
      });
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
    }
  }

  try {
    const body = await request.json();
    const cookie = request.headers.get('cookie') || '';
    const res = await fetch(`${API_BASE}/api/customer/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cookie ? { Cookie: cookie } : {}),
      },
      body: JSON.stringify(body),
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
    const message = err instanceof Error ? err.message : 'Login failed';
    return NextResponse.json({ success: false, message }, { status: 502 });
  }
}
