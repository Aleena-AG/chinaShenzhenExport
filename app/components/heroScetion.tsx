'use client';

import { useState } from 'react';
import Image from 'next/image';

const bannerImages = [
 "https://res.cloudinary.com/dstnwi5iq/image/upload/v1769509009/ban-3_dg6cst.png",
 "https://res.cloudinary.com/dstnwi5iq/image/upload/v1769509009/ban-2_tu7ej8.png",  
 "https://res.cloudinary.com/dstnwi5iq/image/upload/v1769509010/ban-4_s7vpzo.png",
 "https://res.cloudinary.com/dstnwi5iq/image/upload/v1769494739/Screenshot_2026-01-23_at_2.45.31_pm_puqpxg.png",

 "https://res.cloudinary.com/dstnwi5iq/image/upload/v1769511645/Screenshot_2026-01-27_at_2.59.49_pm_n7k453.png",
 "https://res.cloudinary.com/dstnwi5iq/image/upload/v1769494739/Screenshot_2026-01-23_at_2.45.31_pm_puqpxg.png",

];

export default function HeroSection() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  return (
    <section className="relative w-full  text-white overflow-visible">
      {/* Hero Background Image – limited to top ~70% so promo cards sit half outside */}
      <div className="absolute top-0 left-0 right-0 z-0 h-[107vh] min-h-[440px] max-h-[740px] overflow-hidden bg-layered-gradient">
        <img
          src="https://res.cloudinary.com/dstnwi5iq/image/upload/v1769668522/abstract-blurred-blue-purple-colorful-rays-moving-opposite-each-other.jpg_cemgvf.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center "
        />
        {/* Blue overlay: zyada left, kam right */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgba(50, 59, 85, 0.6) 0%, rgba(50, 59, 85, 0.5) 25%, rgba(9, 18, 43, 0.2) 45%, transparent 60%)',
          }}
        />
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

      <div className="container mx-auto px-4 py-12 relative z-[1]">
        {/* Top Section: Hero Text + Hot Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Hero Text and Search */}
          <div className="flex flex-col justify-center">
            <h1 className="text-6xl md:text-7xl lg:text-6xl font-bold mb-4 leading-tight pt-10">
              OVER ONE MILLION
            </h1>
            <p className="text-xl font-medium md:text-2xl text-white mb-8">
              OF COOL CSE AND TECH GADGETS OUT THERE.
            </p>
            
            {/* Search Bar */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 bg-transparent border-2 border-white rounded-lg px-4 py-3 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#db1f26] focus:border-[#db1f26]"
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
            </div>
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

    
        <div className="relative z-[1] mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-[-5rem] md:mb-[-6rem]">
          
          {bannerImages.map((imageSrc, index) => (
            <PromoBannerDouble
              key={index}
              imageSrc={imageSrc}
            />
          ))}
        

         
        </div>
      </div>
    </section>
  );
}

// Product Card Component – white card, top icons, centered image/name/price, pill Add to Cart (our red #db1f26)
function ProductCard({
  category,
  name,
  imageSrc,
  price,
  originalPrice,
  icon,
  description,
}: {
  category: string;
  name: string;
  imageSrc: string;
  price: string;
  originalPrice: string;
  icon: 'cart' | 'arrow';
  description?: string;
}) {
  const fallbackSrc = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120"%3E%3Crect width="120" height="120" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="12"%3EImage%3C/text%3E%3C/svg%3E';

  return (
    <div className="relative rounded-xl bg-white shadow-xl overflow-visible flex flex-col max-w-[200px] sm:max-w-[290px] border border-gray-100 hover:shadow-2xl hover:border-gray-200 transition-all duration-300">
      {/* Top: quick actions */}
    

      {/* Product image – bada, card ke upar bahar */}
      <div className="relative w-full min-h-24 flex items-end justify-center pb-0 pt-12 overflow-visible">
        <div className="absolute left-1/2 -translate-x-1/2 -top-12 w-40 h-40 sm:w-48 sm:h-48 z-[1] drop-shadow-xl ">
          <Image
            src={imageSrc}
            alt={name}
            width={220}
            height={220}
            className="object-contain object-center w-full h-full"
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackSrc;
            }}
          />
        </div>
      </div>

      {/* Product name + price */}
      <div className="flex-1 px-3 py-4 text-center pt-10">
        {category && (
          <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5 font-medium">{category}</p>
        )}
        <h3 className="text-gray-900 font-bold text-sm leading-tight mb-1.5 line-clamp-2">{name}</h3>
        {description && (
          <p className="text-gray-500 text-[10px] leading-tight line-clamp-2 mb-1">{description}</p>
        )}
        <p className="text-[#db1f26] font-bold text-base">{price}</p>
        {originalPrice && (
          <p className="text-gray-400 text-xs line-through mt-0.5">{originalPrice}</p>
        )}
      </div>

      {/* Add to Cart – thora niche bahar */}
      <div className="px-3 pt-0 -mb-4">
        <button
          type="button"
          className="w-full bg-[#123a55] text-white font-bold text-xs uppercase tracking-wide py-2.5 rounded-full shadow-lg hover:bg-[#c41e24] hover:shadow-xl transition-all duration-200"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}

// Helper to render title with optional bold part
function renderTitle(title: string, boldPart?: string, boldClass = 'font-bold') {
  if (!boldPart || !title.includes(boldPart)) {
    return <>{title}</>;
  }
  const i = title.indexOf(boldPart);
  return (
    <>
      {title.slice(0, i)}
      <span className={boldClass}>{boldPart}</span>
      {title.slice(i + boldPart.length)}
    </>
  );
}

// Promotional Banner Component – replace imageSrc with your image URL
function PromoBanner({
  imageSrc,
  imagePosition,
  title,

  gradientClass = 'bg-white',
}: {
  imageSrc: string;
  imagePosition: 'left' | 'right';
  title: string;
  titleBold?: string;
  titleBoldClass?: string;
  price?: string;
  pricePrefix?: string;
  discount?: string;
  gradientClass?: string;
}) {
  const imgPlaceholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120"%3E%3Crect width="120" height="120" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="10"%3EImage%3C/text%3E%3C/svg%3E';
  const imageBox = (
    <div className="shrink-0 min-w-[280px] sm:min-w-[360px] w-full max-w-[420px]">
      <Image
        src={imageSrc as string}
        alt={title}
        width={520}
        height={186}
        className="object-contain w-full h-auto"
        onError={(e) => { (e.target as HTMLImageElement).src = imgPlaceholder; }}
      />
    </div>
  );

  return (
    <div
      className={`rounded-2xl overflow-hidden p-5 shadow-lg grid items-center gap-4 ${gradientClass}`}
      style={{ gridTemplateColumns: imagePosition === 'left' ? 'auto 1fr' : '1fr auto' }}
    >
      {imagePosition === 'left' && imageBox}
      <div>
      

       
       
      {imagePosition === 'right' && imageBox}
    </div>
    </div>
  );
}

// Banner 6: double CTA – left “Hottest” + “Shop now”, right “Tablets…” + “UP TO 70%”. Replace imageSrc with your collage URL.
function PromoBannerDouble({
  imageSrc,
  
}: {

  imageSrc: string;
  
}) {
  const imgPlaceholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="160" height="100"%3E%3Crect width="160" height="100" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="10"%3ECollage%3C/text%3E%3C/svg%3E';
  return (
    <div className="rounded-2xl shadow-lg"> 

      
          <Image src={imageSrc as string} alt="" className="object-cover w-full h-full rounded-2xl" width={160} height={100} onError={(e) => { (e.target as HTMLImageElement).src = imgPlaceholder; }} />
      
     
      
    </div>
  );
}
