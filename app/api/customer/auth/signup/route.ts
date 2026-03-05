import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';

// Shared with login route - in-memory mock
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
      const { name, email, password, phone } = await request.json();
      if (!name || !email || !password) {
        return NextResponse.json({ success: false, message: 'Name, email and password required' }, { status: 400 });
      }
      const key = String(email).toLowerCase();
      const store = getMockStore();
      if (store.has(key)) {
        return NextResponse.json({ success: false, message: 'Email already registered' }, { status: 409 });
      }
      const customer = { id: Date.now(), name: String(name), email: key, phone: phone || undefined };
      const token = `mock_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      store.set(key, { customer, token });
      return NextResponse.json({
        success: true,
        data: { customer, token },
      });
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
    }
  }

  try {
    const body = await request.json();
    const cookie = request.headers.get('cookie') || '';
    const res = await fetch(`${API_BASE}/api/customer/auth/signup`, {
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
    const message = err instanceof Error ? err.message : 'Signup failed';
    return NextResponse.json({ success: false, message }, { status: 502 });
  }
}
