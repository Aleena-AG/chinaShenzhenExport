import { NextRequest, NextResponse } from 'next/server';

/** Proxies external video URLs so <video> can play them (avoids CORS / referrer issues). */
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
        'Accept': 'video/*,*/*',
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
    const contentType = res.headers.get('content-type') || 'video/mp4';
    if (contentType.includes('text/html')) {
      return NextResponse.json(
        { error: 'URL did not return a video.' },
        { status: 502 }
      );
    }
    const blob = await res.blob();
    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': contentType.startsWith('video/') ? contentType : 'video/mp4',
        'Cache-Control': 'public, max-age=86400',
        'Accept-Ranges': 'bytes',
      },
    });
  } catch (err) {
    console.error('Proxy video fetch error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch video' },
      { status: 502 }
    );
  }
}
