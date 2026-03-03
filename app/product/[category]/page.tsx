'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ProductDetail, { type ProductDetailTabContent } from '../../components/ProductDetail';
import { fetchProductById, type ApiProductDetail, type ApiProductTab } from '../../lib/api';

const TAB_KEYS: (keyof ProductDetailTabContent)[] = [
  'features',
  'spectrumGnss',
  'hardwareSpecs',
  'otherSpecs',
  'downloads',
  'demoVideo',
];

function htmlToNode(html: string) {
  return (
    <div
      className="text-gray-700 prose prose-sm max-w-none prose-p:mb-2"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function buildTabContent(
  description: string,
  apiTabs: ApiProductTab[]
): ProductDetailTabContent {
  const sorted = [...apiTabs].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const content: ProductDetailTabContent = {};

  if (sorted.length === 0 && description.trim()) {
    content.features = htmlToNode(description);
    return content;
  }

  sorted.forEach((tab, i) => {
    const key = TAB_KEYS[i] ?? 'otherSpecs';
    const node = (
      <div>
        <h3 className="text-base font-semibold text-[#282A4D] mb-2">{tab.tab_title}</h3>
        {htmlToNode(tab.content ?? '')}
      </div>
    );
    if (key === 'features' && description.trim()) {
      content.features = (
        <>
          {htmlToNode(description)}
          <div className="mt-4">{node}</div>
        </>
      );
    } else {
      content[key] = node;
    }
  });

  return content;
}

/** Single-segment /product/4 = product by API id (numeric). */
export default function ProductByCategoryOrIdPage() {
  const params = useParams();
  const categoryParam = typeof params.category === 'string' ? params.category : '';
  const isNumericId = /^\d+$/.test(categoryParam);
  const id = isNumericId ? categoryParam : '';
  const [product, setProduct] = useState<ApiProductDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isNumericId || !id) {
      setLoading(false);
      setProduct(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchProductById(id)
      .then((p) => {
        if (!cancelled) setProduct(p ?? null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, isNumericId]);

  if (!isNumericId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Not found</h1>
          <p className="text-gray-600 mt-2">Use a product link from the home page.</p>
          <Link href="/" className="mt-4 inline-block text-[#1658a1] underline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading product…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Product not found</h1>
          <Link href="/" className="mt-4 inline-block text-[#1658a1] underline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const name = (product.name ?? product.title ?? 'Product').toString().trim();
  const imageUrls = Array.isArray(product.image_urls) && product.image_urls.length > 0
    ? product.image_urls
    : product.image_url
      ? [product.image_url]
      : [];
  const coverValid = product.cover_image_url && (product.cover_image_url.startsWith('http') || product.cover_image_url.startsWith('/'));
  const mainImage = (coverValid ? product.cover_image_url! : null) ?? imageUrls[0] ?? product.image_url ?? '';
  const allImages = coverValid
    ? [product.cover_image_url!, ...imageUrls.filter((u) => u !== product.cover_image_url)]
    : imageUrls;
  const thumbnailImages = allImages.length > 0 ? allImages : undefined;
  const description = (product.description ?? product.short_description ?? '').toString().trim();
  const apiTabs: ApiProductTab[] = Array.isArray(product.tabs) ? product.tabs : [];
  const sortedTabs = [...apiTabs].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const dynamicTabs =
    sortedTabs.length > 0
      ? sortedTabs.map((t) => ({ tab_title: t.tab_title ?? '', content: t.content ?? '' }))
      : undefined;
  const tabContent = buildTabContent(description, apiTabs);
  const orderHref = `/product/${id}/order`;
  const pAny = product as Record<string, unknown>;
  const apiSpecs = (pAny.specs ?? pAny.attributes ?? pAny.meta ?? {}) as Record<string, unknown>;
  const mergedSpecs = { ...apiSpecs };
  if (pAny.sku) mergedSpecs.sku = pAny.sku;
  if (pAny.weight) mergedSpecs.weight = pAny.weight;
  if (pAny.dimensions) mergedSpecs.dimensions = pAny.dimensions;
  if (pAny.brand ?? pAny.brand_name ?? product.category_name) mergedSpecs.brand = pAny.brand ?? pAny.brand_name ?? product.category_name;
  if (pAny.color) mergedSpecs.color = pAny.color;
  const compareDetails = {
    sku: (pAny.sku ?? pAny.sku_number ?? id) as string | undefined,
    availability: (pAny.stock_status ?? pAny.availability ?? 'In stock') as string | undefined,
    specs: Object.keys(mergedSpecs).length ? mergedSpecs : undefined,
  };

  return (
    <div className="min-h-screen bg-white">
      <ProductDetail
        productName={name}
        productId={id}
        productPrice={product.price ? String(product.price) : undefined}
        originalPrice={pAny.compare_at_price ? String(pAny.compare_at_price) : (pAny.sale_price ?? pAny.discount_price) as string | undefined}
        categorySlug={product.category_slug}
        productSlug={product.slug}
        mainImage={mainImage}
        thumbnailImages={thumbnailImages}
        backHref="/"
        orderNowHref={orderHref}
        tabContent={tabContent}
        dynamicTabs={dynamicTabs}
        shortVideoUrl={product.short_video_url ?? null}
        videoUrl={product.video_url ?? null}
        compareDetails={compareDetails}
      />
    </div>
  );
}
