'use client';

import Image from 'next/image';

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

// Sample data – replace imageSrc with your image URLs
export const valueOfDayProducts: ProductItem[] = [
  { id: '1', category: 'Vape & E-Cig', name: 'Adalya A3000', imageSrc: 'https://res.cloudinary.com/dstnwi5iq/image/upload/v1769682398/H4d960869f5244d26933c735613b9b02cy_nberyf.avif', imageSrcHover: 'https://res.cloudinary.com/dstnwi5iq/image/upload/v1769681886/s-l1600-removebg-preview_ravsai.png', price: 'AED 1,347.00', originalPrice: 'AED 1,599.00' },
  { id: '2', category: 'Cable Lugs111', name: 'Cable Lugs1111', imageSrc: 'https://res.cloudinary.com/dstnwi5iq/image/upload/v1769681958/lugs-removebg-preview_wljys5.png', imageSrcHover: 'https://res.cloudinary.com/dstnwi5iq/image/upload/v1769681958/lugs-removebg-preview_wljys5.png', price: 'AED 62.10', originalPrice: 'AED 69.00' },
  { id: '3', category: 'GPS & Tracking', name: 'GPS Tracker GF-07 Vehicle', imageSrc: 'https://res.cloudinary.com/dstnwi5iq/image/upload/v1769509025/GPS-locater-1024x990_tomp2p.webp' ,imageSrcHover: "https://res.cloudinary.com/dstnwi5iq/image/upload/v1769683820/fmc150-removebg-preview_cooin6.png", price: 'AED 59.00', originalPrice: 'AED 79.00' },
  { id: '4', category: 'GPS & Tracking', name: 'GPS Tracker Module with USB', imageSrc: 'https://res.cloudinary.com/dstnwi5iq/image/upload/v1769596823/1w-h0-kbrd-rfid-reader-1356-mhz-emulating-keyboard_jcjzvf.jpg' ,imageSrcHover: "https://res.cloudinary.com/dstnwi5iq/image/upload/v1769683872/1w-h3u-kbrd-rfid-reader-125khz-emulating-usb-keyboard__2_-removebg-preview_ts79q5.png", price: '$799.00' },
  { id: '1', category: 'Vape & E-Cig', name: 'Adalya A3000', imageSrc: 'https://res.cloudinary.com/dstnwi5iq/image/upload/v1769682398/H4d960869f5244d26933c735613b9b02cy_nberyf.avif', imageSrcHover: 'https://res.cloudinary.com/dstnwi5iq/image/upload/v1769681886/s-l1600-removebg-preview_ravsai.png', price: 'AED 1,347.00', originalPrice: 'AED 1,599.00' },
  { id: '2', category: 'Cable Lugs111', name: 'Cable Lugs1111', imageSrc: 'https://res.cloudinary.com/dstnwi5iq/image/upload/v1769681958/lugs-removebg-preview_wljys5.png', imageSrcHover: 'https://res.cloudinary.com/dstnwi5iq/image/upload/v1769681958/lugs-removebg-preview_wljys5.png', price: 'AED 62.10', originalPrice: 'AED 69.00' },
  { id: '3', category: 'GPS & Tracking', name: 'GPS Tracker GF-07 Vehicle', imageSrc: 'https://res.cloudinary.com/dstnwi5iq/image/upload/v1769509025/GPS-locater-1024x990_tomp2p.webp' ,imageSrcHover: "https://res.cloudinary.com/dstnwi5iq/image/upload/v1769683820/fmc150-removebg-preview_cooin6.png", price: 'AED 59.00', originalPrice: 'AED 79.00' },
  { id: '4', category: 'GPS & Tracking', name: 'GPS Tracker Module with USB', imageSrc: 'https://res.cloudinary.com/dstnwi5iq/image/upload/v1769596823/1w-h0-kbrd-rfid-reader-1356-mhz-emulating-keyboard_jcjzvf.jpg' ,imageSrcHover: "https://res.cloudinary.com/dstnwi5iq/image/upload/v1769683872/1w-h3u-kbrd-rfid-reader-125khz-emulating-usb-keyboard__2_-removebg-preview_ts79q5.png", price: '$799.00' },
  { id: '1', category: 'Vape & E-Cig', name: 'Adalya A3000', imageSrc: 'https://res.cloudinary.com/dstnwi5iq/image/upload/v1769682398/H4d960869f5244d26933c735613b9b02cy_nberyf.avif', imageSrcHover: 'https://res.cloudinary.com/dstnwi5iq/image/upload/v1769681886/s-l1600-removebg-preview_ravsai.png', price: 'AED 1,347.00', originalPrice: 'AED 1,599.00' },
  { id: '2', category: 'Cable Lugs111', name: 'Cable Lugs1111', imageSrc: 'https://res.cloudinary.com/dstnwi5iq/image/upload/v1769681958/lugs-removebg-preview_wljys5.png', imageSrcHover: 'https://res.cloudinary.com/dstnwi5iq/image/upload/v1769681958/lugs-removebg-preview_wljys5.png', price: 'AED 62.10', originalPrice: 'AED 69.00' },
  { id: '3', category: 'GPS & Tracking', name: 'GPS Tracker GF-07 Vehicle', imageSrc: 'https://res.cloudinary.com/dstnwi5iq/image/upload/v1769509025/GPS-locater-1024x990_tomp2p.webp' ,imageSrcHover: "https://res.cloudinary.com/dstnwi5iq/image/upload/v1769683820/fmc150-removebg-preview_cooin6.png", price: 'AED 59.00', originalPrice: 'AED 79.00' },
  { id: '4', category: 'GPS & Tracking', name: 'GPS Tracker Module with USB', imageSrc: 'https://res.cloudinary.com/dstnwi5iq/image/upload/v1769596823/1w-h0-kbrd-rfid-reader-1356-mhz-emulating-keyboard_jcjzvf.jpg' ,imageSrcHover: "https://res.cloudinary.com/dstnwi5iq/image/upload/v1769683872/1w-h3u-kbrd-rfid-reader-125khz-emulating-usb-keyboard__2_-removebg-preview_ts79q5.png", price: '$799.00' },
  { id: '1', category: 'Vape & E-Cig', name: 'Adalya A3000', imageSrc: 'https://res.cloudinary.com/dstnwi5iq/image/upload/v1769682398/H4d960869f5244d26933c735613b9b02cy_nberyf.avif', imageSrcHover: 'https://res.cloudinary.com/dstnwi5iq/image/upload/v1769681886/s-l1600-removebg-preview_ravsai.png', price: 'AED 1,347.00', originalPrice: 'AED 1,599.00' },
  { id: '2', category: 'Cable Lugs111', name: 'Cable Lugs1111', imageSrc: 'https://res.cloudinary.com/dstnwi5iq/image/upload/v1769681958/lugs-removebg-preview_wljys5.png', imageSrcHover: 'https://res.cloudinary.com/dstnwi5iq/image/upload/v1769681958/lugs-removebg-preview_wljys5.png', price: 'AED 62.10', originalPrice: 'AED 69.00' },
  { id: '3', category: 'GPS & Tracking', name: 'GPS Tracker GF-07 Vehicle', imageSrc: 'https://res.cloudinary.com/dstnwi5iq/image/upload/v1769509025/GPS-locater-1024x990_tomp2p.webp' ,imageSrcHover: "https://res.cloudinary.com/dstnwi5iq/image/upload/v1769683820/fmc150-removebg-preview_cooin6.png", price: 'AED 59.00', originalPrice: 'AED 79.00' },
  { id: '4', category: 'GPS & Tracking', name: 'GPS Tracker Module with USB', imageSrc: 'https://res.cloudinary.com/dstnwi5iq/image/upload/v1769596823/1w-h0-kbrd-rfid-reader-1356-mhz-emulating-keyboard_jcjzvf.jpg' ,imageSrcHover: "https://res.cloudinary.com/dstnwi5iq/image/upload/v1769683872/1w-h3u-kbrd-rfid-reader-125khz-emulating-usb-keyboard__2_-removebg-preview_ts79q5.png", price: '$799.00' },
 
];

const categoryLinks = [
  'Computers & Accessories',
  'Cameras, Audio & Video',
  'Mobiles & Tablets',
  'Movies, Music & Video Games',
  'Watches & Eyewear',
  'Car, Motorbike & Industrial',
  'TV & Audio',
];

function parseMoney(input: string) {
  const raw = (input ?? '').trim();
  const currencyMatch = raw.match(/^(AED|\$|€|£)\s*/i);
  const currency = currencyMatch?.[1]?.toUpperCase() ?? '';
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
    <div className="group/card relative bg-white rounded-xl border-2 border-[#185699] overflow-visible flex flex-col py-6 px-5 text-center">
      {/* Default card – same as before, stays in flow */}
      <div className="overflow-hidden rounded-xl">
        <h3 className="text-[#555] font-semibold text-base sm:text-lg uppercase tracking-wide">
          {product.name}
        </h3>
        <p className="text-[#999] text-xs sm:text-sm uppercase tracking-wide mt-1">
          {product.category}
        </p>
        <div className="relative w-full flex-1 min-h-[180px] flex items-center justify-center my-6">
          {product.imageSrc ? (
            <Image
              src={(product.imageSrc as string).trim()}
              alt={product.name}
              width={400}
              height={220}
              className="object-contain w-full max-h-48 "
            />
          ) : (
            <span className="text-gray-300 text-xs">Add image</span>
          )}
        </div>
        <div className="flex flex-col items-center gap-0.5">
          {original && (
            <span className="text-[#999] text-sm line-through">
              {(original.currency || price.currency || 'AED')} {original.major}
              {original.minor ? `.${original.minor}` : ''}
            </span>
          )}
          <p className="text-[#555] font-semibold text-lg sm:text-xl">
            {price.currency || 'AED'} {price.major}
            {price.minor ? <span className="text-base">.{price.minor}</span> : ''}
          </p>
        </div>
        <button
          type="button"
          className="mt-5 w-full max-w-[180px] mx-auto py-2.5 rounded-full border-2 border-[#185699] text-[#123a55] font-medium text-sm uppercase tracking-wide bg-transparent hover:bg-[#faa3a3] hover:border-[#faa3a3] transition-colors"
        >
          Buy Now
        </button>
      </div>

      {/* Hover overlay – detailed UI like the image (golden strip, description, info box, button) */}
      <div className="absolute inset-0 flex flex-col opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-10 bg-gray-100 rounded-xl py-0 overflow-visible pointer-events-none group-hover/card:pointer-events-auto">
        {/* Image thora card se bahar – upar extend */}
        <div className="w-full flex items-end justify-center min-h-[140px] sm:min-h-[160px] pt-0 pb-2 -mt-[40px] shrink-0 relative">
          {product.imageSrc && (
            <Image
              src={displayImage as string}
              alt={product.name}
              width={320}
              height={400}
              className="object-contain max-h-44 sm:max-h-52 w-auto drop-shadow-lg -translate-y-2"
            />
          )}
        </div>
        <div className="flex-1 flex flex-col py-4 px-4 text-center overflow-hidden">
          <h3 className="text-[#555] font-semibold text-lg uppercase tracking-wide">
            {product.name}
          </h3>
          <p className="text-[#999] text-xs uppercase tracking-wide mt-0.5">
            {product.category}
          </p>
          <p className="text-[#555] font-semibold text-base mt-2">
            {price.currency || 'AED'} {price.major}
            {price.minor ? `.${price.minor}` : ''}
          </p>
          <p className="text-[#888] text-xs leading-snug mt-2 line-clamp-3">
            {description}
          </p>
          {/* Info box – Origin, Wine Type, Alcohol style */}
          <div className="mt-3 rounded-lg border border-[#e5e5e5] bg-white/60 py-2.5 px-3 text-left">
            <div className="flex justify-between text-xs">
              <span className="text-[#999]">Origin</span>
              <span className="text-[#555] font-medium">{product.origin || 'China'}</span>
            </div>
            <div className="flex justify-between text-xs mt-1.5">
              <span className="text-[#999]">Type</span>
              <span className="text-[#555] font-medium">{product.wineType || product.category || ''}</span>
            </div>
            <div className="flex justify-between text-xs mt-1.5">
              <span className="text-[#999]">AWG Rating:</span>
              <span className="text-[#555] font-medium">{product.alcohol || '18w'}</span>
            </div>
          </div>
          <button
            type="button"
            className="mt-4 w-full py-2.5 rounded-lg border border-[#1658a1] bg-[#dae3ef] text-[#1658a1] font-medium text-sm uppercase tracking-wide hover:bg-[#dae3ef] transition-colors"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ValueOfDaySection() {
  return (
    <section className="bg-white min-h-[60vh]">
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Assortment sidebar */}
          <aside className="lg:w-56 shrink-0">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Assortment</h2>
            
            <ul className="space-y-2 mb-8">
              {categoryLinks.map((cat) => (
                <li key={cat}>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-between group">
                    <span>{cat}</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
         
          </aside>

          {/* Right: Value of the Day grid */}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-800 pb-2 border-b-2 border-[#db1f26] w-fit mb-6">
              Value of the Day
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
