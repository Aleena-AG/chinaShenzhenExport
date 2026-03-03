import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ success: false, message: 'Missing product id' }, { status: 400 });
  }
  try {
    const res = await fetch(`${API_BASE}/api/products/${id}`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 },
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: data?.message || res.statusText },
        { status: res.status }
      );
    }
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch product';
    return NextResponse.json(
      { success: false, message },
      { status: 502 }
    );
  }
}
