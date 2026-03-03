'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export type BannerItem = {
  id?: number | string;
  image_url?: string;
  image?: string;
  link?: string;
  title?: string;
  sort_order?: number;
  [key: string]: unknown;
};

function normalizeBanners(raw: unknown): BannerItem[] {
  if (Array.isArray(raw)) return raw as BannerItem[];
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    const arr = obj.data as unknown[] | undefined;
    if (Array.isArray(arr)) return arr as BannerItem[];
  }
  return [];
}

function getBannerImageUrl(b: BannerItem): string | null {
  const url = b.image_url ?? b.image;
  if (typeof url === 'string' && (url.startsWith('http') || url.startsWith('/'))) return url;
  return null;
}

export default function Banner() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/banners')
      .then((res) => res.json())
      .then((json) => {
        const list = normalizeBanners(json?.data ?? json);
        const sorted = [...list].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
        setBanners(sorted.filter((b) => getBannerImageUrl(b)));
      })
      .catch(() => setBanners([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading || banners.length === 0) return null;

  return (
    <section className="w-full bg-white">
      <div className="container mx-auto px-4 py-10">
        <div className={`grid gap-4 ${banners.length >= 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'} max-w-5xl mx-auto`}>
          {banners.map((banner, i) => {
            const src = getBannerImageUrl(banner);
            if (!src) return null;
            const content = (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={banner.title ? String(banner.title) : `Banner ${i + 1}`}
                className="w-full h-auto object-cover rounded-xl shadow-lg"
              />
            );
            const link = banner.link && (banner.link.startsWith('http') || banner.link.startsWith('/'));
            return (
              <div key={banner.id ?? i} className="overflow-hidden rounded-xl">
                {link ? (
                  <Link href={banner.link!} target={banner.link!.startsWith('http') ? '_blank' : undefined} rel={banner.link!.startsWith('http') ? 'noopener noreferrer' : undefined}>
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
