'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import GradientButton from './GradientButton';
import WishlistModal from './WishlistModal';
import { addToWishlist, removeFromWishlist, isInWishlist, addToCompare, isInCompare, WISHLIST_UPDATED_EVENT } from '../lib/wishlist';


export type ProductDetailTabId =
  | 'features'
  | 'spectrum-gnss'
  | 'hardware-specs'
  | 'other-specs'
  | 'downloads'
  | 'demo-video';

export type ProductDetailTabContent = {
  features?: React.ReactNode;
  spectrumGnss?: React.ReactNode;
  hardwareSpecs?: React.ReactNode;
  otherSpecs?: React.ReactNode;
  downloads?: React.ReactNode;
  demoVideo?: React.ReactNode;
};

/** When provided, tabs are rendered from API (tab_title + content HTML) instead of fixed tabs. */
export type DynamicTab =
  | { tab_title: string; content: string }
  | { tab_title: string; type: 'video'; url: string };

export type ProductDetailProps = {
  productName: string;
  productId?: string;
  productPrice?: string;
  categorySlug?: string;
  productSlug?: string;
  mainImage: string;
  thumbnailImages?: string[];
  backHref: string;
  orderNowHref?: string;
  onOrderNow?: () => void;
  tabContent: ProductDetailTabContent;
  /** If set, use these as the only tabs (dynamic from API). */
  dynamicTabs?: DynamicTab[];
  /** Short video (e.g. .mp4) shown below images. */
  shortVideoUrl?: string | null;
  /** Optional 3D/video URL (e.g. .glb) shown as link. */
  videoUrl?: string | null;
};

const TABS: { id: ProductDetailTabId; label: string; icon: 'features' | 'spectrum' | 'hardware' | 'document' | 'download' | 'video' }[] = [
  { id: 'features', label: 'Features', icon: 'features' },
  { id: 'spectrum-gnss', label: 'Spectrum / GNSS', icon: 'spectrum' },
  { id: 'hardware-specs', label: 'Hardware Specifications', icon: 'hardware' },
  { id: 'other-specs', label: 'Other Specifications', icon: 'document' },
  { id: 'downloads', label: 'Downloads', icon: 'download' },
  { id: 'demo-video', label: 'Demo Video', icon: 'video' },
];

function TabIcon({ icon, active }: { icon: string; active: boolean }) {
  const className = active ? 'text-white' : 'text-gray-800';
  switch (icon) {
    case 'features':
      return (
        <svg className={`w-6 h-6 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      );
    case 'spectrum':
      return (
        <svg className={`w-6 h-6 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
      );
    case 'hardware':
      return (
        <svg className={`w-6 h-6 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case 'document':
      return (
        <svg className={`w-6 h-6 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      );
    case 'download':
      return (
        <svg className={`w-6 h-6 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      );
    case 'video':
      return (
        <svg className={`w-6 h-6 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    default:
      return null;
  }
}

const TAB_HEADINGS: Record<ProductDetailTabId, string> = {
  features: 'Features',
  'spectrum-gnss': 'Spectrum / GNSS',
  'hardware-specs': 'Hardware Specifications',
  'other-specs': 'Other Specifications',
  downloads: 'Downloads',
  'demo-video': 'Demo Video',
};

export default function ProductDetail({
  productName,
  productId,
  productPrice,
  categorySlug,
  productSlug,
  mainImage,
  thumbnailImages = [],
  backHref,
  orderNowHref,
  onOrderNow,
  tabContent,
  dynamicTabs,
  shortVideoUrl,
  videoUrl,
}: ProductDetailProps) {
  const [activeTab, setActiveTab] = useState<ProductDetailTabId>('features');
  const [activeDynamicIndex, setActiveDynamicIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);
  const [inCompare, setInCompare] = useState(false);
  const [showWishlistModal, setShowWishlistModal] = useState(false);

  const pid = productId || productSlug || productName;

  useEffect(() => {
    setInWishlist(isInWishlist(pid));
    setInCompare(isInCompare(pid));
    const handler = () => setInWishlist(isInWishlist(pid));
    window.addEventListener(WISHLIST_UPDATED_EVENT, handler);
    return () => window.removeEventListener(WISHLIST_UPDATED_EVENT, handler);
  }, [pid]);

  const handleWishlistClick = () => {
    if (inWishlist) {
      removeFromWishlist(pid);
      setInWishlist(false);
    } else {
      const added = addToWishlist({
        productId: pid,
        name: productName,
        price: productPrice,
        imageSrc: mainImage,
        categorySlug,
        productSlug,
      });
      if (added) {
        setInWishlist(true);
        setShowWishlistModal(true);
      }
    }
  };

  const handleCompareClick = () => {
    if (inCompare) {
      return;
    }
    const added = addToCompare({
      productId: pid,
      name: productName,
      price: productPrice,
      imageSrc: mainImage,
      categorySlug,
      productSlug,
    });
    if (added) setInCompare(true);
  };
  const thumbs = thumbnailImages.length ? thumbnailImages : [mainImage];
  const mainSrc = thumbs[selectedImageIndex] ?? mainImage;
  const mainImageValid = mainSrc?.startsWith('http') || mainSrc?.startsWith('/');
  const apiTabs = Array.isArray(dynamicTabs) ? dynamicTabs : [];
  const videoTab =
    shortVideoUrl && (shortVideoUrl.startsWith('http') || shortVideoUrl.startsWith('/'))
      ? [{ tab_title: 'Video', type: 'video' as const, url: shortVideoUrl }]
      : [];
  const allDynamicTabs: DynamicTab[] = [...apiTabs, ...videoTab];
  const useDynamicTabs = allDynamicTabs.length > 0;

  const renderTabContent = () => {
    if (useDynamicTabs) {
      const tab = allDynamicTabs[activeDynamicIndex];
      if (!tab) return null;
      if ('type' in tab && tab.type === 'video') {
        const videoSrc =
          tab.url.startsWith('http://') || tab.url.startsWith('https://')
            ? `/api/proxy-video?url=${encodeURIComponent(tab.url)}`
            : tab.url;
        return (
          <div className="rounded-xl overflow-hidden border border-gray-100 bg-black/5 flex justify-center">
            <video
              src={videoSrc}
              controls
              playsInline
              className="w-full max-w-3xl mx-auto aspect-video object-contain min-h-[280px]"
              style={{ imageRendering: 'auto' }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );
      }
      return (
        <div
          className="text-gray-700 prose prose-sm max-w-none prose-p:mb-2"
          dangerouslySetInnerHTML={{ __html: 'content' in tab ? (tab.content ?? '') : '' }}
        />
      );
    }
    switch (activeTab) {
      case 'features':
        return tabContent.features ?? <p className="text-gray-600">No features information available.</p>;
      case 'spectrum-gnss':
        return tabContent.spectrumGnss ?? <p className="text-gray-600">No spectrum / GNSS information available.</p>;
      case 'hardware-specs':
        return tabContent.hardwareSpecs ?? <p className="text-gray-600">No hardware specifications available.</p>;
      case 'other-specs':
        return tabContent.otherSpecs ?? <p className="text-gray-600">No other specifications available.</p>;
      case 'downloads':
        return tabContent.downloads ?? <p className="text-gray-600">No downloads available.</p>;
      case 'demo-video':
        return tabContent.demoVideo ?? <p className="text-gray-600">No demo video available.</p>;
      default:
        return null;
    }
  };

  return (
    <>
      <WishlistModal isOpen={showWishlistModal} onClose={() => setShowWishlistModal(false)} />
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-6">
        {/* Back + Product name */}
        <div className="flex items-center gap-2 mb-6">
          <Link
            href={backHref}
            className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
            aria-label="Back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-[#282A4D]">{productName}</h1>
        </div>

        {/* Product image + thumbnail + ORDER NOW */}
        <div className="flex flex-col items-center max-w-xl mx-auto mb-10">
          <div className="relative w-full aspect-square max-h-[300px] bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
            <Image
              src={mainImageValid ? mainSrc : `https://via.placeholder.com/400?text=${encodeURIComponent(productName)}`}
              alt={productName}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 320px"
              priority
              unoptimized={!mainImageValid}
            />
            {/* Wishlist & Compare buttons */}
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                type="button"
                onClick={handleWishlistClick}
                className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <svg className={`w-6 h-6 ${inWishlist ? 'text-red-600 fill-red-600' : 'text-gray-700'}`} fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={inWishlist ? 0 : 2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleCompareClick}
                className={`w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all ${inCompare ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
                aria-label={inCompare ? 'Already in compare' : 'Add to compare'}
                disabled={inCompare}
              >
                <svg className={`w-5 h-5 ${inCompare ? 'text-blue-600' : 'text-gray-700'}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </button>
            </div>
          </div>
          {thumbs.length > 1 && (
            <div className="mt-3 w-full">
              <div className="flex justify-center gap-2">
                {thumbs.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImageIndex(i)}
                  className={`relative w-14 h-14 rounded-lg border-2 overflow-hidden shrink-0 ${
                    selectedImageIndex === i ? 'border-[#db1f26]' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={src?.startsWith('http') || src?.startsWith('/') ? src : mainImage}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="56px"
                    unoptimized={!(src?.startsWith('http') || src?.startsWith('/'))}
                  />
                </button>
              ))}
              </div>
            </div>
          )}
          {orderNowHref ? (
            <GradientButton
              href={orderNowHref}
              variant="primary"
              size="lg"
              className="mt-4 w-full max-w-sm "
            >
              Order Now
            </GradientButton>
          ) : (
            <GradientButton
              type="button"
              onClick={onOrderNow}
              variant="primary"
              size="lg"
              className="mt-4 w-full max-w-sm mt-10"
            >
              Order Now
            </GradientButton>
          )}
        </div>

        {/* Tabs: dynamic from API + Video, or fixed */}
        {(useDynamicTabs ? allDynamicTabs.length > 0 : true) && (
          <>
            <div className="border-b border-gray-200 pb-2 mt-6">
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                {useDynamicTabs
                  ? allDynamicTabs.map((tab, i) => {
                      const isActive = activeDynamicIndex === i;
                      return (
                        <GradientButton
                          key={i}
                          type="button"
                          onClick={() => setActiveDynamicIndex(i)}
                          variant={isActive ? 'primary' : 'outline'}
                          size="lg"
                          className="flex flex-col items-center justify-center gap-1.5 min-w-[100px] sm:min-w-[120px] normal-case"
                        >
                          <span className="text-xs sm:text-sm font-medium text-center leading-tight line-clamp-2">
                            {tab.tab_title}
                          </span>
                        </GradientButton>
                      );
                    })
                  : TABS.map((tab) => {
                      const isActive = activeTab === tab.id;
                      return (
                        <GradientButton
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveTab(tab.id)}
                          variant={isActive ? 'primary' : 'outline'}
                          size="lg"
                          className="flex flex-col items-center justify-center gap-1.5 min-w-[100px] sm:min-w-[120px] normal-case"
                        >
                          <span className="flex items-center justify-center w-10 h-10">
                            <TabIcon icon={tab.icon} active={isActive} />
                          </span>
                          <span className="text-xs sm:text-sm font-medium text-center leading-tight">{tab.label}</span>
                        </GradientButton>
                      );
                    })}
              </div>
            </div>

            {/* Tab content */}
            <div className="py-8">
              <h2 className="text-lg font-bold text-[#282A4D] mb-4">
                {useDynamicTabs
                  ? (allDynamicTabs[activeDynamicIndex]?.tab_title ?? '')
                  : TAB_HEADINGS[activeTab]}
              </h2>
              <div className="product-tab-content text-gray-700 prose prose-sm max-w-none">{renderTabContent()}</div>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
}
