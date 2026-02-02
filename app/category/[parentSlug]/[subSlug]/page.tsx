'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  getGpsSubCategories,
  getGpsSubCategoryBySlug,
  getGpsProductUrl,
  type GpsProduct,
  type GpsSubCategory,
} from '../../../lib/gps-products';
import { getAccessoriesImageUrl, getAccessoriesMainImageUrl, getCableLugsDefaultImageUrl, getCableLugsHoverImageUrl, getFuseAdapterDefaultImageUrl, getFuseAdapterHoverImageUrl, getFuseDefaultImageUrl, getFuseHoverImageUrl, getGpsTrackerDefaultImageUrl, getGpsTrackerHoverImageUrl, getRelayHarnessDefaultImageUrl, getRelayHarnessHoverImageUrl, getRfidSensorDefaultImageUrl, getRfidSensorHoverImageUrl, getTapeDefaultImageUrl, getTapeHoverImageUrl, getTempDataLoggerDefaultImageUrl, getTempDataLoggerHoverImageUrl } from '../../../lib/accessories-images';

const PARENT_CATEGORY_NAMES: Record<string, string> = {
  'gps-tracker-accessories': 'Gps Tracker & Accessories',
};

function getParentCategoryName(parentSlug: string): string {
  return PARENT_CATEGORY_NAMES[parentSlug] || parentSlug.replace(/-/g, ' ');
}

function ProductCard({ product, subSlug, categoryLabel, imageIndex }: { product: GpsProduct; subSlug: string; categoryLabel: string; imageIndex: number }) {
  const defaultByName = subSlug === 'gps-trackers' ? getGpsTrackerDefaultImageUrl(product.name) : null;
  const hoverByName = subSlug === 'gps-trackers' ? getGpsTrackerHoverImageUrl(product.name) : null;
  const fuseAdapterDefault = subSlug === 'fuse-adapters' || subSlug === 'fuse-adapter' ? getFuseAdapterDefaultImageUrl(product.name) : null;
  const fuseAdapterHover = subSlug === 'fuse-adapters' || subSlug === 'fuse-adapter' ? getFuseAdapterHoverImageUrl(product.name) : null;
  const tapeDefault = subSlug === 'tapes' || subSlug === 'tape' ? getTapeDefaultImageUrl(product.name) : null;
  const tapeHover = subSlug === 'tapes' || subSlug === 'tape' ? getTapeHoverImageUrl(product.name) : null;
  const tempLoggerDefault = subSlug === 'temp-data-logger' || subSlug === 'temperature-data-logger' ? getTempDataLoggerDefaultImageUrl(product.name) : null;
  const tempLoggerHover = subSlug === 'temp-data-logger' || subSlug === 'temperature-data-logger' ? getTempDataLoggerHoverImageUrl(product.name) : null;
  const rfidDefault = subSlug === 'rfid-reader' || subSlug === 'rfid-sensor' ? getRfidSensorDefaultImageUrl(product.name) : null;
  const rfidHover = subSlug === 'rfid-reader' || subSlug === 'rfid-sensor' ? getRfidSensorHoverImageUrl(product.name) : null;
  const relayDefault = subSlug === 'relay-harness' ? getRelayHarnessDefaultImageUrl(product.name) : null;
  const relayHover = subSlug === 'relay-harness' ? getRelayHarnessHoverImageUrl(product.name) : null;
  const fuseDefault = subSlug === 'fuse' || subSlug === 'fuses' ? getFuseDefaultImageUrl(product.name) : null;
  const fuseHover = subSlug === 'fuse' || subSlug === 'fuses' ? getFuseHoverImageUrl(product.name) : null;
  const cableLugsDefault = subSlug === 'cable-lugs' ? getCableLugsDefaultImageUrl(product.name) : null;
  const cableLugsHover = subSlug === 'cable-lugs' ? getCableLugsHoverImageUrl(product.name) : null;
  const fromSubFolder = getAccessoriesImageUrl(subSlug, imageIndex);
  const imageSrc = product.image?.startsWith('http')
    ? product.image
    : defaultByName ?? fuseAdapterDefault ?? tapeDefault ?? tempLoggerDefault ?? rfidDefault ?? relayDefault ?? fuseDefault ?? cableLugsDefault ?? fromSubFolder ?? `https://via.placeholder.com/300x200?text=${encodeURIComponent(product.name)}`;
  const hoverImageSrc = hoverByName ?? fuseAdapterHover ?? tapeHover ?? tempLoggerHover ?? rfidHover ?? relayHover ?? fuseHover ?? cableLugsHover ?? imageSrc;
  const price = product.price || '$0.00';
  const description =
    product.fullDescription ||
    product.description ||
    `${product.name} is a popular choice and enjoys a significant following with seasoned enthusiasts who enjoy quality products.`;
  const specs = product.specs as Record<string, string> | undefined;

  return (
    <div className="group/card relative bg-white rounded-xl border-2 border-gray-200 overflow-visible flex flex-col py-6 px-5 text-center min-h-[340px]">
      {/* Default card */}
      <div className="overflow-hidden rounded-xl flex flex-col flex-1 min-h-0">
        <h3 className="text-[#555] font-semibold text-base sm:text-lg tracking-wide">{product.name}</h3>
        <p className="text-[#999] text-xs sm:text-sm uppercase tracking-wide mt-1">{categoryLabel}</p>
        <div className="relative w-full flex-1 min-h-[180px] flex items-center justify-center my-6">
          <Image
            src={imageSrc}
            alt={product.name}
            width={400}
            height={220}
            className="object-contain w-full max-h-48"
            unoptimized={imageSrc.startsWith('https://via.placeholder')}
          />
        </div>
        <p className="text-[#555] font-semibold text-lg sm:text-xl mb-2">{price}</p>
        <Link
          href={getGpsProductUrl(subSlug, product)}
          className="mt-auto  w-full max-w-[180px] mx-auto py-2.5 rounded-full border-0 text-white font-semibold text-sm uppercase tracking-wide transition-colors hover:opacity-95 flex items-center justify-center"
          style={{ background: 'linear-gradient(90deg,rgba(0, 58, 145, 1) 24%, rgba(156, 3, 3, 1) 100%)' }}
        >
          Buy Now
        </Link>
      </div>

      {/* Hover overlay – remove-bg image on hover; Buy Now always visible at bottom */}
      <Link
        href={getGpsProductUrl(subSlug, product)}
        className="absolute inset-0 flex flex-col min-h-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-10 bg-gray-100 rounded-xl py-0 overflow-visible pointer-events-none group-hover/card:pointer-events-auto"
      >
        <div className="w-full flex items-end justify-center min-h-[72px] sm:min-h-[80px] pt-1 pb-1 shrink-0 relative -mt-3">
          <Image
            src={hoverImageSrc}
            alt={product.name}
            width={140}
            height={160}
            className="object-contain max-h-28 sm:max-h-32 w-auto drop-shadow-lg"
            unoptimized={hoverImageSrc.startsWith('https://via.placeholder')}
          />
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide py-3 px-4 text-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <h3 className="text-[#555] font-semibold text-lg tracking-wide">{product.name}</h3>
          <p className="text-[#999] text-xs uppercase tracking-wide mt-0.5">{categoryLabel}</p>
          <p className="text-[#555] font-semibold text-base mt-2">{price}</p>
          <p className="text-[#888] text-xs leading-snug mt-2 line-clamp-3">{description}</p>
          <div className="mt-3 rounded-lg border border-[#e5e5e5] bg-white/60 py-2.5 px-3 text-left">
            <div className="flex justify-between text-xs">
              <span className="text-[#999]">Origin</span>
              <span className="text-[#555] font-medium">{specs?.origin ?? 'China'}</span>
            </div>
            <div className="flex justify-between text-xs mt-1.5">
              <span className="text-[#999]">Type</span>
              <span className="text-[#555] font-medium">{specs?.type ?? categoryLabel}</span>
            </div>
            <div className="flex justify-between text-xs mt-1.5">
              <span className="text-[#999]">Spec</span>
              <span className="text-[#555] font-medium">{specs?.rating ?? specs?.awg ?? '—'}</span>
            </div>
          </div>
        </div>
        <div className="shrink-0 pt-3 pb-4 px-4 bg-gray-100 rounded-b-xl">
          <span className="block w-full py-3 rounded-lg border border-[#9cb8d4] bg-[#dae3ef] text-[#1658a1] font-semibold text-sm uppercase tracking-wide text-center">
            Buy Now
          </span>
        </div>
      </Link>
    </div>
  );
}

export default function CategorySubPage() {
  const params = useParams();
  const parentSlug = typeof params.parentSlug === 'string' ? params.parentSlug : '';
  const subSlug = typeof params.subSlug === 'string' ? params.subSlug : '';
  const subCategories = getGpsSubCategories();
  const currentSub = getGpsSubCategoryBySlug(subSlug);

  if (!currentSub) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Sub-category not found</h1>
          <Link href="/" className="mt-4 inline-block text-[#1658a1] underline">Back to home</Link>
        </div>
      </div>
    );
  }

  const isAccessories = parentSlug === 'gps-tracker-accessories';
  const mainImageUrl = getAccessoriesMainImageUrl();
  const [mainImageOk, setMainImageOk] = useState(true);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 pt-24 pb-8">
        {isAccessories && mainImageOk && (
          <div className="mb-8 rounded-xl overflow-hidden border border-gray-200">
            <Image
              src={mainImageUrl}
              alt="Accessories"
              width={1200}
              height={320}
              className="w-full h-48 sm:h-64 object-cover"
              unoptimized
              onError={() => setMainImageOk(false)}
            />
          </div>
        )}
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-56 shrink-0">
            <h2 className="text-lg font-semibold text-[#1658a1] mb-4">{getParentCategoryName(parentSlug)}</h2>
            <ul className="space-y-1">
              {subCategories.map((sub) => (
                <li key={sub.slug}>
                  <Link
                    href={`/category/${parentSlug}/${sub.slug}`}
                    className={`text-sm block py-1.5 ${sub.slug === subSlug ? 'font-semibold text-[#1658a1]' : 'text-gray-600 hover:text-[#1658a1]'}`}
                  >
                    {sub.label}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-800 pb-2 border-b-2 border-[#db1f26] w-fit mb-6">
              {currentSub.label}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {currentSub.products.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  subSlug={subSlug}
                  categoryLabel={currentSub.label}
                  imageIndex={i}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
