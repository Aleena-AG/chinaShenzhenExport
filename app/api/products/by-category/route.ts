import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');

    if (!category && !subcategory) {
      return NextResponse.json(
        { success: false, message: 'Provide category or subcategory' },
        { status: 400 }
      );
    }
    if (category && subcategory) {
      return NextResponse.json(
        { success: false, message: 'Provide only one of category or subcategory' },
        { status: 400 }
      );
    }

    const params = category
      ? new URLSearchParams({ category })
      : new URLSearchParams({ subcategory: subcategory! });
    const res = await fetch(
      `${API_BASE}/api/public/products/by-category?${params.toString()}`,
      {
        headers: { 'Content-Type': 'application/json' },
        next: { revalidate: 60 },
      }
    );
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: data?.message || res.statusText },
        { status: res.status }
      );
    }
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch products';
    return NextResponse.json(
      { success: false, message },
      { status: 502 }
    );
  }
}
