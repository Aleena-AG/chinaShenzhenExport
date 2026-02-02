'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getGpsSubCategories } from '../lib/gps-products';

// Product shape – imageSrc = default, imageSrcHover = hover pe dikhega
export type ProductItem = {
  id: string;
  category: string;
  name: string;
  imageSrc: string;
  imageSrcHover?: string;
  price: string;
  originalPrice?: string;
  description?: string;
  origin?: string;
  wineType?: string;
  alcohol?: string;
};

// 16 unique products – each shown once on home page (no repeats)
export const valueOfDayProducts: ProductItem[] = [
  { id: '1', category: 'Gps Tracker & Accessories', name: 'DBV2-10 (Red copper)', imageSrc: '/accesories/cable%20lugs/lugs.png', imageSrcHover: '/accesories/cable%20lugs/lugs-removebg.png', price: 'AED 62.10', originalPrice: 'AED 69.00' },
  { id: '2', category: 'Gps Tracker & Accessories', name: 'Teltonika FMC150', imageSrc: '/accesories/gps%20tracker/fmc150.jpg', imageSrcHover: '/accesories/gps%20tracker/FMC150-removebg-preview%20(1).png', price: 'AED 59.00', originalPrice: 'AED 79.00' },
  { id: '3', category: 'Gps Tracker & Accessories', name: 'Mini Pin Fuse Adapter', imageSrc: '/accesories/Fuse%20Adapter/Mini%20Pin%20Fuse%20Adapter/mpfa.png', imageSrcHover: '/accesories/Fuse%20Adapter/Mini%20Pin%20Fuse%20Adapter/mpfa-removebg.png', price: '$12.00' },
  { id: '4', category: 'Gps Tracker & Accessories', name: 'Drexia 1W-H0-04P 13.56mhz RFID Reader', imageSrc: '/accesories/RFID%20Sensor/1w-h0-04p-ms-rfid-reader-1356-mhz.jpg', imageSrcHover: '/accesories/RFID%20Sensor/1w-h0-04p-ms-rfid-reader-1356-mhz-removebg.png', price: '$799.00' },
  { id: '5', category: 'Gps Tracker & Accessories', name: 'Pet Cloth Automotive Tape', imageSrc: '/accesories/Tape/pet%20cloth%20automotive%20tape.jpg', imageSrcHover: '/accesories/Tape/pet_cloth_automotive_tape-removebg-preview.png', price: '$8.00' },
  { id: '6', category: 'Gps Tracker & Accessories', name: 'ULOGS 3', imageSrc: '/accesories/Temperature%20Data%20Logger/Ulogs3.png', imageSrcHover: '/accesories/Temperature%20Data%20Logger/Ulogs3-removebg.png', price: '$45.00' },
  { id: '7', category: 'Gps Tracker & Accessories', name: 'Arkangel R-1701 /12V', imageSrc: '/accesories/Relay%26%20harness/12v-removebg-preview.png', imageSrcHover: '/accesories/Relay%26%20harness/12v-removebg-preview.png', price: '$0.00' },
  { id: '8', category: 'Gps Tracker & Accessories', name: 'Micro Low Profile Fuse', imageSrc: '/accesories/Fuse/Micro%20Low%20Profile%20Fuse/MLPF.avif', imageSrcHover: '/accesories/Fuse/Micro%20Low%20Profile%20Fuse/MLPF-removebg.png', price: '$0.00' },
  { id: '9', category: 'Gps Tracker & Accessories', name: 'YG-D3 GPS Tracker', imageSrc: '/accesories/gps%20tracker/yg-d3.png', imageSrcHover: '/accesories/gps%20tracker/yg-d3-removebg-preview.png', price: '$0.00' },
  { id: '10', category: 'Gps Tracker & Accessories', name: 'Universal 5-Pin Automotive Relay Harness', imageSrc: '/accesories/Relay%26%20harness/5pin.jpeg', imageSrcHover: '/accesories/Relay%26%20harness/5pin-removebg-preview.png', price: '$0.00' },
  { id: '11', category: 'Gps Tracker & Accessories', name: 'Mini Fuse', imageSrc: '/accesories/Fuse/Mini%20Pin%20Fuse/mpf.png', imageSrcHover: '/accesories/Fuse/Mini%20Pin%20Fuse/mpf-removebg.png', price: '$0.00' },
  { id: '12', category: 'Gps Tracker & Accessories', name: 'Standard Fuse Tap', imageSrc: '/accesories/Fuse%20Adapter/Low%20Profile%20Fuse%20Adapter/LPFA.jpg', imageSrcHover: '/accesories/Fuse%20Adapter/Low%20Profile%20Fuse%20Adapter/LPFA-removebg.png', price: '$0.00' },
  { id: '13', category: 'Gps Tracker & Accessories', name: 'PVC Insulation Tape', imageSrc: '/accesories/Tape/Arkangel%20Circle%20Logo%20copy.jpg', imageSrcHover: '/accesories/Tape/Arkangel_Circle_Logo_copy-removebg-preview.png', price: '$6.00' },
  { id: '14', category: 'Gps Tracker & Accessories', name: 'ULOGS 4', imageSrc: '/accesories/Temperature%20Data%20Logger/Ulogs4.jpg', imageSrcHover: '/accesories/Temperature%20Data%20Logger/Ulogs4-removebg.png', price: '$0.00' },
  { id: '15', category: 'Gps Tracker & Accessories', name: 'MDD1.25-250', imageSrc: '/accesories/cable%20lugs/Picture%202.png', imageSrcHover: '/accesories/cable%20lugs/Picture_2-removebg.png', price: 'AED 62.10' },
  { id: '16', category: 'Gps Tracker & Accessories', name: 'Teltonika FMC130', imageSrc: '/accesories/gps%20tracker/fmc130.jpeg', imageSrcHover: '/accesories/gps%20tracker/fmc130-removebg-preview.png', price: '$0.00' },
];

type CategoryWithSubTypes = { title: string; subTypes: string[] };

const categoryLinks: CategoryWithSubTypes[] = [
  {
    title: 'Gps Tracker & Accessories',
    
    subTypes: ['GPS Trackers', 'Cable Lugs', 'Relay & Harness', 'Fuse Adapter & Fuse Holder', 'Tapes', 'Fuses', 'Temp Data Logger', 'RFID Reader'],
  },
  {
    title: 'Cameras, Audio & Video',
    subTypes: ['Cameras', 'Audio', 'Video', 'Lenses', 'Tripods'],
  },
  {
    title: 'Mobiles & Tablets',
    subTypes: ['Smartphones', 'Tablets', 'Cases', 'Chargers', 'Screen Protectors'],
  },
  {
    title: 'Movies, Music & Video Games',
    subTypes: ['Movies', 'Music', 'Video Games', 'Consoles', 'Accessories'],
  },
  {
    title: 'Watches & Eyewear',
    subTypes: ['Smartwatches', 'Watches', 'Sunglasses', 'Eyewear Accessories'],
  },
  {
    title: 'Car, Motorbike & Industrial',
    subTypes: ['Car Accessories', 'Motorbike', 'Industrial', 'Tools'],
  },
  {
    title: 'TV & Audio',
    subTypes: ['TVs', 'Speakers', 'Soundbars', 'Audio Cables', 'Mounts'],
  },
];

/** Slug for URL: lowercase, spaces/special -> hyphens */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9-]/g, '');
}

/** Product URL path: /product/[category]/[slug] */
export function getProductUrl(product: ProductItem): string {
  const categorySlug = slugify(product.category);
  const productSlug = `${slugify(product.name)}-${product.id}`;
  return `/product/${categorySlug}/${productSlug}`;
}

/** Find product by URL category + slug */
export function getProductByCategorySlug(categorySlug: string, productSlug: string): ProductItem | undefined {
  return valueOfDayProducts.find(
    (p) => slugify(p.category) === categorySlug && `${slugify(p.name)}-${p.id}` === productSlug
  );
}

function parseMoney(input: string) {
  const raw = (input ?? '').trim();
  const currencyMatch = raw.match(/^(AED|\$|€|£)\s*/i);
  const currency = currencyMatch?.[1]??'';
  const amount = raw
    .replace(/^(AED|\$|€|£)\s*/i, '')
    .replace(/[^\d.,]/g, '')
    .replace(/,/g, '');

  const [major = '', minor = ''] = amount.split('.');
  return {
    currency,
    major: major || amount || raw,
    minor: (minor || '').slice(0, 2),
    raw,
  };
}

function ValueOfDayCard({ product }: { product: ProductItem }) {
  const price = parseMoney(product.price);
  const original = product.originalPrice ? parseMoney(product.originalPrice) : null;
  const displayImage = product.imageSrcHover?.trim()
  const description =
    product.description ||
    `${product.name} is a popular choice and enjoys a significant following with seasoned enthusiasts who enjoy quality products.`;

  return (
    <div className="group/card relative bg-white rounded-xl border-2 border-gray-200 overflow-visible flex flex-col py-5 px-5 text-center h-[420px] min-w-0">
      {/* Fixed height – card height never increases, button at bottom */}
      <div className="overflow-hidden rounded-xl flex flex-col flex-1 min-h-0 min-w-0">
        <h3 className="text-[#555] font-semibold text-base sm:text-lg tracking-wide line-clamp-2 shrink-0">
          {product.name}
        </h3>
        <p className="text-[#999] text-xs sm:text-sm uppercase tracking-wide mt-1 shrink-0">
          {product.category}
        </p>
        <div className="relative w-full h-[172px] shrink-0 flex items-center justify-center my-3">
          {product.imageSrc ? (
            <Image
              src={(product.imageSrc as string).trim()}
              alt={product.name}
              width={400}
              height={220}
              className="object-contain w-full h-full max-h-[172px]"
            />
          ) : (
            <span className="text-gray-300 text-xs">Add image</span>
          )}
        </div>
        <div className="flex flex-col items-center gap-0.5 shrink-0">
          {original && (
            <span className="text-[#999] text-sm line-through">
              {(original.currency || price.currency || 'AED')} {original.major}
              {original.minor ? `.${original.minor}` : ''}
            </span>
          )}
          <p className="text-[#555] font-semibold text-lg sm:text-xl mb-2">
            {price.currency || 'AED'} {price.major}
            {price.minor ? <span className="text-base">.{price.minor}</span> : ''}
          </p>
        </div>
        <Link
          href={getProductUrl(product)}
          className="mt-auto w-full max-w-[180px] mx-auto py-2.5 rounded-full border-0 text-white font-semibold text-md uppercase tracking-wide transition-colors hover:opacity-95 flex items-center justify-center"
          style={{
            background: 'linear-gradient(90deg,rgba(0, 58, 145, 1) 24%, rgba(156, 3, 3, 1) 100%)',
          }}
        >
          Buy Now
        </Link>
      </div>

      {/* Hover overlay – Buy Now always visible; description/info scroll if needed */}
      <Link
        href={getProductUrl(product)}
        className="absolute inset-0 flex flex-col opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-[10] bg-gray-100 rounded-xl py-0 overflow-hidden pointer-events-none group-hover/card:pointer-events-auto"
      >
        <div className="w-full flex items-end justify-center min-h-[120px] sm:min-h-[140px] pt-0 pb-1 z-0 shrink-0 relative">
          {product.imageSrc && (
            <Image
              src={displayImage as string}
              alt={product.name}
              width={320}
              height={400}
              className="object-contain max-h-36 sm:max-h-40 w-auto drop-shadow-lg -translate-y-2"
            />
          )}
        </div>
        <div className="flex-1 flex flex-col min-h-0 py-2 px-3 text-center">
          <h3 className="text-[#555] font-semibold text-sm tracking-wide line-clamp-1 shrink-0">{product.name}</h3>
          <p className="text-[#999] text-xs uppercase tracking-wide mt-0.5 shrink-0">{product.category}</p>
          <p className="text-[#555] font-semibold text-sm mt-1 shrink-0">
            {price.currency || 'AED'} {price.major}
            {price.minor ? `.${price.minor}` : ''}
          </p>
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
            <p className="text-[#888] text-xs leading-snug mt-1 line-clamp-2">{description}</p>
            <div className="mt-2 rounded-lg border border-[#e5e5e5] bg-white/60 py-2 px-2.5 text-left">
              <div className="flex justify-between text-xs">
                <span className="text-[#999]">Origin</span>
                <span className="text-[#555] font-medium">{product.origin || 'China'}</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-[#999]">Type</span>
                <span className="text-[#555] font-medium">{product.wineType || product.category || ''}</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-[#999]">AWG Rating:</span>
                <span className="text-[#555] font-medium">{product.alcohol || '18w'}</span>
              </div>
            </div>
          </div>
          <span className="shrink-0 mt-2 w-full py-2 rounded-lg border border-[#1658a1] bg-[#dae3ef] text-[#1658a1] font-medium text-xs uppercase tracking-wide text-center block">
            Buy Now
          </span>
        </div>
      </Link>
    </div>
  );
}

const PARENT_SLUG_GPS = 'gps-tracker-accessories';

export default function ValueOfDaySection() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const gpsSubCategories = getGpsSubCategories();

  const toggleCategory = (title: string) => {
    setOpenCategory((prev) => (prev === title ? null : title));
  };

  return (
    <section className="bg-white min-h-[60vh]">
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Assortment sidebar – click to open/close dropdown */}
          <aside className="lg:w-56 shrink-0">
            <h2 className="text-lg font-semibold text-[#1658a1] mb-4">Categories</h2>
            
            <ul className="space-y-1 mb-8">
              {categoryLinks.map((cat) => (
                <li key={cat.title}>
                  <button
                    type="button"
                    onClick={() => toggleCategory(cat.title)}
                    className="w-full text-left text-sm font-medium text-[#1658a1] hover:underline flex items-center justify-between py-1.5"
                  >
                    <span>{cat.title}</span>
                    {cat.subTypes.length > 0 && (
                      <svg
                        className={`w-4 h-4 shrink-0 transition-transform ${openCategory === cat.title ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>
                  {cat.subTypes.length > 0 && openCategory === cat.title && (
                    <ul className="mt-1 ml-3 space-y-1 border-l border-gray-200 pl-3 pb-2">
                      {cat.title === 'Gps Tracker & Accessories'
                        ? gpsSubCategories.map((sub) => (
                            <li key={sub.slug}>
                              <Link
                                href={`/category/${PARENT_SLUG_GPS}/${sub.slug}`}
                                className="text-xs text-gray-600 hover:text-[#1658a1] block py-0.5"
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ))
                        : cat.subTypes.map((sub) => (
                            <li key={sub}>
                              <a href="#" className="text-xs text-gray-600 hover:text-[#1658a1] block py-0.5">
                                {sub}
                              </a>
                            </li>
                          ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
         
          </aside>

          {/* Right: Value of the Day grid */}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-800 pb-2 border-b-2 border-[#db1f26] w-fit mb-6">
                Products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {valueOfDayProducts.map((product, idx) => (
                <ValueOfDayCard key={`${product.id}-${idx}`} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
