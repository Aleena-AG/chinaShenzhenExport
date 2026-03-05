'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import OrderForm, { type OrderFormPrefill } from '../../../components/orderForm';
import { useAuth } from '../../../context/AuthContext';

/** Parse order.phone (e.g. "+92 3124141735") into countryCode and phoneNumber */
function parsePhone(phone: string | undefined): { countryCode: string; phoneNumber: string } {
  if (!phone || typeof phone !== 'string') return { countryCode: '+971', phoneNumber: '' };
  const t = phone.trim();
  const match = t.match(/^(\+\d{1,4})\s*(.*)$/);
  if (match) {
    return { countryCode: match[1], phoneNumber: (match[2] || '').replace(/\D/g, '') };
  }
  if (/^\d+$/.test(t)) return { countryCode: '+971', phoneNumber: t };
  return { countryCode: '+971', phoneNumber: t.replace(/\D/g, '') };
}

export default function OrderAgainPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.orderId as string | undefined;
  const { isAuthenticated, isLoading } = useAuth();
  const [prefill, setPrefill] = useState<OrderFormPrefill | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/customer/login');
      return;
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!orderId || !isAuthenticated) return;
    setLoadError(null);
    fetch(`/api/customer/orders/${orderId}`, { credentials: 'include' })
      .then((res) => res.json())
      .then((json) => {
        const order = json?.data ?? json?.order ?? json;
        if (!order || typeof order !== 'object') {
          setLoadError('Order not found');
          return;
        }
        const o = order as Record<string, unknown>;
        const { countryCode, phoneNumber } = parsePhone(o.phone as string);
        const img = o.productCoverImage ?? o.image ?? o.image_url ?? o.product_image ?? o.thumbnail ?? o.cover_image ?? o.imageUrl;
        const productImageUrl = img != null && typeof img === 'string' && img.trim() ? img.trim() : undefined;
        const productSlugRaw = o.productSlug ?? o.product_slug;
        const categorySlugRaw = o.categorySlug ?? o.category_slug ?? o.categorySlug;
        const productSlugVal = productSlugRaw != null && String(productSlugRaw).trim() ? String(productSlugRaw).trim() : undefined;
        const categorySlugVal = categorySlugRaw != null && String(categorySlugRaw).trim() ? String(categorySlugRaw).trim() : undefined;
        setPrefill({
          model: o.model != null ? String(o.model) : undefined,
          estimatedQuantity: o.estimatedQuantity != null ? String(o.estimatedQuantity) : undefined,
          country: o.country != null ? String(o.country) : undefined,
          companyName: o.companyName != null ? String(o.companyName) : undefined,
          contactPerson: o.contactPerson != null ? String(o.contactPerson) : undefined,
          email: o.email != null ? String(o.email) : undefined,
          countryCode,
          phoneNumber,
          additionalInfo: o.additionalInfo != null ? String(o.additionalInfo) : undefined,
          productSlug: productSlugVal,
          categorySlug: categorySlugVal,
          productImage: productImageUrl,
        });
      })
      .catch(() => setLoadError('Failed to load order'));
  }, [orderId, isAuthenticated]);

  if (!orderId) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <p className="text-gray-600">Invalid order.</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4">
        <p className="text-red-600">{loadError}</p>
        <a href="/customer/profile" className="text-[#1658a1] font-medium hover:underline">
          Back to profile
        </a>
      </div>
    );
  }

  if (!prefill) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <p className="text-gray-500">Loading order…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <OrderForm
        productName={prefill.model ?? 'Order again'}
        productSlug={prefill.productSlug}
        categorySlug={prefill.categorySlug}
        variant="page"
        prefill={prefill}
      />
    </div>
  );
}
