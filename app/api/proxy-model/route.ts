import { NextRequest, NextResponse } from 'next/server';

/** Proxies external .glb/.gltf URLs to avoid CORS when loading in Three.js */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'Missing url' }, { status: 400 });
  }
  let target: URL;
  try {
    target = new URL(url);
  } catch {
    return NextResponse.json({ error: 'Invalid url' }, { status: 400 });
  }
  if (!['http:', 'https:'].includes(target.protocol)) {
    return NextResponse.json({ error: 'Invalid protocol' }, { status: 400 });
  }
  try {
    const res = await fetch(target.toString(), {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'Accept': 'model/gltf-binary,model/gltf+json,application/octet-stream,*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      cache: 'no-store',
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${res.status}` },
        { status: 502 }
      );
    }
    const contentType = res.headers.get('content-type') || 'model/gltf-binary';
    if (contentType.includes('text/html')) {
      return NextResponse.json(
        { error: 'URL returned HTML instead of a 3D model. Check the file link.' },
        { status: 502 }
      );
    }
    const blob = await res.blob();
    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': contentType.includes('gltf') ? contentType : 'model/gltf-binary',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (err) {
    console.error('Proxy model fetch error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch model' },
      { status: 502 }
    );
  }
}
