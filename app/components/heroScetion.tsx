'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type HeroBannerItem = {
  id?: number | string;
  image_url?: string;
  image?: string;
  link?: string;
  title?: string;
  sort_order?: number;
};

function normalizeHeroBanners(raw: unknown): HeroBannerItem[] {
  if (Array.isArray(raw)) return raw as HeroBannerItem[];
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    const arr = obj.data as unknown[] | undefined;
    if (Array.isArray(arr)) return arr as HeroBannerItem[];
  }
  return [];
}

function getBannerImageUrl(b: HeroBannerItem): string | null {
  const url = b.image_url ?? b.image;
  if (typeof url === 'string' && (url.startsWith('http') || url.startsWith('/'))) return url;
  return null;
}

export default function HeroSection() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [banners, setBanners] = useState<HeroBannerItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) router.push(`/shop?q=${encodeURIComponent(q)}`);
  };

  useEffect(() => {
    fetch('/api/banners')
      .then((res) => res.json())
      .then((json) => {
        const list = normalizeHeroBanners(json?.data ?? json);
        const withImage = list.filter((b) => getBannerImageUrl(b));
        const sorted = [...withImage].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
        setBanners(sorted);
      })
      .catch(() => setBanners([]));
  }, []);

  return (
    <section className="relative w-full  text-white overflow-visible">
      {/* Hero Background – taller when banners present, compact when no banners so layout stays in place */}
      <div className={`absolute top-0 left-0 right-0 z-0 overflow-hidden ${banners.length > 0 ? 'h-[107vh] min-h-[440px] max-h-[780px]' : 'h-[52vh] min-h-[420px]'}`}>
        <img
          src="https://res.cloudinary.com/dstnwi5iq/image/upload/v1769668522/abstract-blurred-blue-purple-colorful-rays-moving-opposite-each-other.jpg_cemgvf.jpg"
          alt=""
          className="absolute w-full h-full object-cover object-center"
        />
        {/* Overlay: left + right dono side, with blur layer */}
        {/* <div
          className="absolute inset-0 pointer-events-none backdrop-blur-[1px]"
          style={{
            background: 'linear-gradient(to right, rgba(9, 18, 43, 0.7) 0%, rgba(50, 59, 85, 0.45) 25%, rgba(9, 18, 43, 0.25) 50%, rgba(50, 59, 85, 0.45) 75%, rgba(9, 18, 43, 0.65) 100%)',
          }}
        /> */}
      </div>

      {/* Theme Toggle - Left Side */}
      {/* <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => setTheme('light')}
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              theme === 'light' ? 'bg-[#db1f26] text-white' : 'text-gray-400'
            }`}
          >
            Light
          </button>
          <div className="w-12 h-20 bg-gray-800 rounded-full p-1 flex flex-col justify-between">
            <div className={`w-full h-8 rounded-full transition-all ${
              theme === 'dark' ? 'bg-[#db1f26]' : 'bg-gray-600'
            }`} />
            <div className={`w-full h-8 rounded-full transition-all ${
              theme === 'light' ? 'bg-[#db1f26]' : 'bg-gray-600'
            }`} />
          </div>
          <button
            onClick={() => setTheme('dark')}
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              theme === 'dark' ? 'bg-[#db1f26] text-white' : 'text-gray-400'
            }`}
          >
            Dark
          </button>
        </div>
      </div> */}

      <div className="container mx-auto px-4 py-12 relative ">
        {/* Top Section: Hero Text + Hot Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
          {/* Left: Hero Text and Search */}
          <div className="flex flex-col justify-center">
            <h1 className="text-6xl md:text-7xl lg:text-4xl font-medium mb-4 leading-tight pt-10 font-helvetica">
            Go global with  <span className="text-red-500">SHENZHEN</span>  exports Your business deserves it!
            </h1>
            <p className="text-xl font-medium md:text-2xl text-white mb-8 font-helvetica">
              {/* OF COOL CSE AND TECH GADGETS OUT THERE. */}
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 bg-white/10 border-2 border-white rounded-lg px-4 py-3 text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-[#db1f26] focus:border-[#db1f26]"
              />
              <button className="bg-white text-[#1658a1] px-6 py-3 rounded-lg transition-colors flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>
          </div>

          {/* Right: Hot Products Today – improved block */}
          {/* <div className="flex flex-col rounded-2xl px-10 py-5 lg:px-30 lg:py-6">
            <div className="flex items-center gap-2.5 mb-10">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#123a55] text-white shadow-lg">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C12.95 3.1 12.05 3.5 11.3 4.1C10.45 4.85 9.95 5.9 9.95 7C9.95 7.3 10 7.6 10.1 7.9C7.4 8.9 5.45 11.15 5.45 13.9C5.45 17.15 8.2 19.85 11.45 19.85C13.7 19.85 15.65 18.7 16.75 17C17.1 16.85 17.4 16.6 17.65 16.35C18.55 15.5 19.05 14.35 19.05 13.1C19.05 12.4 18.85 11.75 18.5 11.2H17.66M11.45 18.35C9.15 18.35 7.3 16.5 7.3 14.2C7.3 12.75 8.1 11.5 9.3 10.85L10.4 13.6L12.85 12.5C13.5 13.7 14.75 14.5 16.2 14.5C16.95 14.5 17.65 14.3 18.25 13.95C17.6 16.9 14.9 18.35 11.45 18.35Z" />
                </svg>
              </span>
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-white tracking-tight">Hot Products Today</h2>
                <p className="text-white/80 text-xs mt-0.5  font-medium ">Fresh picks for you</p>
              </div>
            </div>

            <div className="flex gap-3 justify-start flex-wrap">
         
              <ProductCard
                category="iPhone 17 Pro Max"
                name="Smartphone 6S 32GB LTE"
                imageSrc="https://res.cloudinary.com/dstnwi5iq/image/upload/v1769494965/iPhone_17_Pro_Max_Cosmic_Orange_PDP_Image_Position_1__en-AE-removebg-preview_kuo5za.png"
                price="$1,100.00"
                originalPrice="$1,326.00"
                icon="cart"
              />

        
              <ProductCard
                category="Samsung Z Fold 7"
                name="Ultrabook UX305CA-FC050T"
                imageSrc="https://res.cloudinary.com/dstnwi5iq/image/upload/v1769495548/S200775520_1-removebg-preview_ak12ji.png"
                price="$1,200.00"
                originalPrice="$1,318.00"
                icon="arrow"
              />
            </div>
          </div> */}
        </div>

        {banners.length > 0 && (
          <div className="relative mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-[-5rem] md:mb-[-6rem]">
            {banners.map((banner, index) => {
              const src = getBannerImageUrl(banner);
              if (!src) return null;
              return (
                <PromoBannerDouble
                  key={banner.id ?? index}
                  imageSrc={src}
                  link={banner.link}
                  title={banner.title}
                />
              );
            })}
          </div>
        )}

       
      </div>

        {/* Features bar – Free shipping, Fast delivery, Free returns */}
      <div className={`relative z-[1] border-t-2 border-amber-200/80 bg-[#faf8f5] rounded-b-lg overflow-hidden ${banners.length > 0 ? 'mt-14' : 'mt-6'}`}>
          <div className="py-5 flex flex-col sm:flex-row items-center justify-between px-[12%]">
            <div className="flex items-center gap-3 text-[#5c4a3d]">
              <span className="shrink-0 text-[#5c4a3d]">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                </svg>
              </span>
              <div>
                <p className="font-semibold text-[#5c4a3d]">Free shipping<span className="text-xs text-[#5c4a3d]/90"> On all Choice items</span></p>
                
              </div>
            </div>
            <div className="flex items-center gap-3 text-[#5c4a3d]">
              <span className="shrink-0 text-[#5c4a3d]">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M20 8h-2V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v4H4c-1.1 0-2 .9-2 2v10h16V10c0-1.1-.9-2-2-2zm-6 10H6v-2h8v2zm4-4H6v-2h12v2zm0-4H8V4h8v6z" />
                </svg>
              </span>
              <div>
                <p className="font-semibold text-[#5c4a3d]">Fast delivery  <span className="text-xs text-[#5c4a3d]/90">Get refunds for any issues</span></p>
               
              </div>
            </div>
            <div className="flex items-center gap-3 text-[#5c4a3d]">
              <span className="shrink-0 text-[#5c4a3d]">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
                </svg>
              </span>
              <div>
                <p className="font-semibold text-[#5c4a3d]">Free returns     <span className="text-xs text-[#5c4a3d]/90">Within 90 days</span></p>
            
              </div>
            </div>
          </div>
        </div>
    </section>
  );
}







// Banner 6: double CTA – left “Hottest” + “Shop now”, right “Tablets…” + “UP TO 70%”. Replace imageSrc with your collage URL.
function PromoBannerDouble({
  imageSrc,
  link,
  title,
}: {
  imageSrc: string;
  link?: string;
  title?: string;
}) {
  const imgPlaceholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="160" height="100"%3E%3Crect width="160" height="100" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="10"%3ECollage%3C/text%3E%3C/svg%3E';
  const content = (
    <Image
      src={imageSrc}
      alt={title ?? ''}
      className="object-cover w-full h-full rounded-2xl"
      width={400}
      height={240}
      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      onError={(e) => { (e.target as HTMLImageElement).src = imgPlaceholder; }}
    />
  );
  const wrapperClass = "rounded-2xl shadow-lg overflow-hidden bg-white";
  if (link && (link.startsWith('http') || link.startsWith('/'))) {
    return (
      <Link href={link} className={wrapperClass} target={link.startsWith('http') ? '_blank' : undefined} rel={link.startsWith('http') ? 'noopener noreferrer' : undefined}>
        {content}
      </Link>
    );
  }
  return <div className={wrapperClass}>{content}</div>;
}
