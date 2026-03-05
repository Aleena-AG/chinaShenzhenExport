'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import GradientButton from './GradientButton';

// ─── Zod schema & payload type (use this shape when sending to API) ───────────
const nameRegex = /^[a-zA-Z\s.'\-]+$/;
const digitsOnlyRegex = /^\d+$/;
const quantityRegex = /^\d+$/;

export const orderFormSchema = z.object({
  estimatedQuantity: z
    .string()
    .min(1, 'Estimated quantity is required')
    .regex(quantityRegex, 'Only digits allowed'),
  country: z.string().min(1, 'Please select your country'),
  companyName: z
    .string()
    .optional()
    .refine((v) => !v || /[a-zA-Z]/.test(v), 'Company name must contain letters'),
  contactPerson: z
    .string()
    .min(1, 'Contact person is required')
    .regex(nameRegex, 'Contact person: only letters and spaces allowed'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  countryCode: z.string(),
  phoneNumber: z
    .string()
    .min(1, 'Person contact no is required')
    .regex(digitsOnlyRegex, 'Person contact no: only digits allowed'),
  additionalInfo: z.string().optional(),
  coupon: z.string().optional(),
  robotChecked: z.boolean().refine((v) => v === true, { message: 'Please confirm you are not a robot' }),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;

/**
 * Payload to send to your API / backend. Built in onSubmit and logged to console.
 * Example:
 * {
 *   model: string;           // product name
 *   estimatedQuantity: string;
 *   country: string;
 *   companyName?: string;
 *   contactPerson: string;
 *   email: string;
 *   phone: string;            // countryCode + " " + phoneNumber
 *   additionalInfo?: string;
 *   productSlug?: string;
 *   categorySlug?: string;
 * }
 */
export type OrderInquiryPayload = {
  model: string;
  estimatedQuantity: string;
  country: string;
  companyName?: string;
  contactPerson: string;
  email: string;
  phone: string;
  additionalInfo?: string;
  coupon?: string;
  productSlug?: string;
  categorySlug?: string;
};

export type OrderFormPrefill = Partial<OrderFormValues> & {
  model?: string;
  productSlug?: string;
  categorySlug?: string;
  productImage?: string;
};

export type OrderFormProps = {
  productName: string;
  productImage?: string;
  productSlug?: string;
  categorySlug?: string;
  variant?: 'modal' | 'page';
  onClose?: () => void;
  bannerTitle?: string;
  /** Pre-fill form from an existing order (e.g. Order Again). Overrides productName/productSlug/categorySlug when model/productSlug/categorySlug are set. */
  prefill?: OrderFormPrefill;
  /** Override "View more" link (e.g. /product/5 when ordering by product id). */
  viewMoreHref?: string;
};

const COUNTRY_OPTIONS = [
  'United Arab Emirates',
  'Saudi Arabia',
  'India',
  'Pakistan',
  'China',
  'United States',
  'United Kingdom',
  'Germany',
  'France',
  'Other',
];

const COUNTRY_CODES = [
  { code: '+971', country: 'UAE' },
  { code: '+966', country: 'Saudi Arabia' },
  { code: '+91', country: 'India' },
  { code: '+92', country: 'Pakistan' },
  { code: '+86', country: 'China' },
  { code: '+1', country: 'USA' },
  { code: '+44', country: 'UK' },
  { code: '+49', country: 'Germany' },
  { code: '+33', country: 'France' },
  { code: '+ other', country: 'Other' },
];



type OrderFormCoupon = {
  code: string;
  discount?: string;
  discount_type?: string;
  discount_value?: number | string;
  description?: string;
  valid_until?: string;
  start_date?: string;
  end_date?: string;
  min_order_value?: string;
  max_uses?: number | null;
  used_count?: number;
  status?: string;
};

function formatDiscountValue(v: number | string): string {
  const s = String(v);
  return s.replace(/\.?0+$/, '') || s; // "10.00" -> "10"
}

function parseDate(d: string): number {
  const n = new Date(d).getTime();
  return isNaN(n) ? 0 : n;
}

function isCouponValid(c: OrderFormCoupon): boolean {
  if (c.status && c.status !== 'Active') return false;
  const now = Date.now();
  if (c.start_date && parseDate(c.start_date) > now) return false;
  if (c.end_date && parseDate(c.end_date) < now) return false;
  if (c.max_uses != null && (c.used_count ?? 0) >= c.max_uses) return false;
  return true;
}

function formatValidUntil(endDate?: string): string | undefined {
  if (!endDate) return undefined;
  try {
    const d = new Date(endDate);
    if (isNaN(d.getTime())) return undefined;
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return undefined;
  }
}

function normalizeOrderCoupons(raw: unknown): OrderFormCoupon[] {
  const mapOne = (c: unknown) => {
    const o = c as Record<string, unknown>;
    const endDate = o?.end_date != null ? String(o.end_date) : undefined;
    return {
      code: String(o?.code ?? o?.coupon_code ?? ''),
      discount: o?.discount != null ? String(o.discount) : undefined,
      discount_type: o?.discount_type != null ? String(o.discount_type) : undefined,
      discount_value: o?.discount_value != null ? (typeof o.discount_value === 'number' ? o.discount_value : String(o.discount_value)) : undefined,
      description: o?.description != null ? String(o.description) : undefined,
      valid_until: o?.valid_until != null ? String(o.valid_until) : formatValidUntil(endDate),
      start_date: o?.start_date != null ? String(o.start_date) : undefined,
      end_date: endDate,
      min_order_value: o?.min_order_value != null ? String(o.min_order_value) : undefined,
      max_uses: o?.max_uses != null ? Number(o.max_uses) : null,
      used_count: o?.used_count != null ? Number(o.used_count) : undefined,
      status: o?.status != null ? String(o.status) : undefined,
    };
  };
  let list: OrderFormCoupon[] = [];
  if (Array.isArray(raw)) list = raw.map(mapOne).filter((c) => c.code);
  else if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    const arr = (obj.data ?? obj.coupons) as unknown[] | undefined;
    if (Array.isArray(arr)) list = arr.map(mapOne).filter((c) => c.code);
  }
  return list.filter(isCouponValid);
}

/** Short value for left ticket panel: e.g. "10%" or "AED 10" */
function couponValueShort(c: OrderFormCoupon): string {
  if (c.discount) return c.discount.replace(/\s*off\s*$/i, '').trim();
  const isPercent = c.discount_type === 'percent' || c.discount_type === 'percentage';
  if (isPercent && c.discount_value != null) return `${formatDiscountValue(c.discount_value)}%`;
  if (c.discount_type === 'fixed' && c.discount_value != null) return `AED ${formatDiscountValue(c.discount_value)}`;
  if (c.discount_value != null) return formatDiscountValue(c.discount_value);
  return c.code;
}

/** Full discount detail for right panel: e.g. "10% off" or "AED 10 off" */
function couponDiscountDetail(c: OrderFormCoupon): string {
  if (c.discount) return c.discount.toLowerCase().endsWith('off') ? c.discount : `${c.discount} off`;
  const isPercent = c.discount_type === 'percent' || c.discount_type === 'percentage';
  if (isPercent && c.discount_value != null) return `${formatDiscountValue(c.discount_value)}% off`;
  if (c.discount_type === 'fixed' && c.discount_value != null) return `AED ${formatDiscountValue(c.discount_value)} off`;
  if (c.discount_value != null) return `${formatDiscountValue(c.discount_value)} off`;
  return 'Discount applied';
}

const inputClass =
  'w-full px-3 py-2.5 rounded-lg border border-gray-400 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1658a1]/50 focus:border-[#1658a1]';
const inputErrorClass = 'border-red-500 focus:ring-red-500/50 focus:border-red-500';

const onKeyDownDigitsOnly = (e: React.KeyboardEvent) => {
  if (['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key)) return;
  if (!/^\d$/.test(e.key)) e.preventDefault();
};

const onKeyDownLettersOnly = (e: React.KeyboardEvent) => {
  if (['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', ' '].includes(e.key)) return;
  if (e.key === '.' || e.key === "'" || e.key === '-') return;
  if (!/^[a-zA-Z]$/.test(e.key)) e.preventDefault();
};

const onPasteDigitsOnly = (e: React.ClipboardEvent) => {
  const pasted = e.clipboardData.getData('text');
  if (!/^\d+$/.test(pasted)) e.preventDefault();
};

const onPasteLettersOnly = (e: React.ClipboardEvent) => {
  const pasted = e.clipboardData.getData('text');
  if (!/^[a-zA-Z\s.'\-]+$/.test(pasted)) e.preventDefault();
};

const defaultFormValues: OrderFormValues = {
  estimatedQuantity: '',
  country: '',
  companyName: '',
  contactPerson: '',
  email: '',
  countryCode: '+971',
  phoneNumber: '',
  additionalInfo: '',
  coupon: '',
  robotChecked: false,
};

export default function OrderForm({
  productName,
  productImage,
  productSlug,
  categorySlug,
  variant = 'modal',
  onClose,
  prefill,
  viewMoreHref: viewMoreHrefProp,
}: OrderFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<OrderFormCoupon[]>([]);

  const displayName = (prefill?.model != null && prefill.model !== '') ? prefill.model : productName;
  const displaySlug = prefill?.productSlug != null && prefill.productSlug !== '' ? prefill.productSlug : productSlug;
  const displayCategorySlug = prefill?.categorySlug != null && prefill.categorySlug !== '' ? prefill.categorySlug : categorySlug;
  const displayImage = prefill?.productImage ?? productImage;

  useEffect(() => {
    fetch('/api/discount-coupons')
      .then((res) => res.json())
      .then((json) => setAvailableCoupons(normalizeOrderCoupons(json?.data ?? json)))
      .catch(() => {});
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    mode: 'onTouched',
    defaultValues: {
      ...defaultFormValues,
      ...(prefill && {
        estimatedQuantity: prefill.estimatedQuantity ?? '',
        country: prefill.country ?? '',
        companyName: prefill.companyName ?? '',
        contactPerson: prefill.contactPerson ?? '',
        email: prefill.email ?? '',
        countryCode: prefill.countryCode ?? '+971',
        phoneNumber: prefill.phoneNumber ?? '',
        additionalInfo: prefill.additionalInfo ?? '',
        coupon: prefill.coupon ?? '',
      }),
    },
  });

  useEffect(() => {
    if (prefill) {
      reset({
        ...defaultFormValues,
        estimatedQuantity: prefill.estimatedQuantity ?? '',
        country: prefill.country ?? '',
        companyName: prefill.companyName ?? '',
        contactPerson: prefill.contactPerson ?? '',
        email: prefill.email ?? '',
        countryCode: prefill.countryCode ?? '+971',
        phoneNumber: prefill.phoneNumber ?? '',
        additionalInfo: prefill.additionalInfo ?? '',
        coupon: prefill.coupon ?? '',
      });
    }
  }, [prefill, reset]);

  const selectedCouponCode = watch('coupon');
  const selectedCoupon = selectedCouponCode
    ? availableCoupons.find(
        (c) => c.code.trim().toUpperCase() === String(selectedCouponCode).trim().toUpperCase()
      )
    : null;

  const productIdFromSlug = displaySlug?.match(/-(\d+)$/)?.[1] ?? displaySlug;
  const productPageHref =
    viewMoreHrefProp ??
    (productIdFromSlug ? `/product/${productIdFromSlug}` : undefined);
  const viewMoreHref = productPageHref && productPageHref !== '#' ? productPageHref : '/';
  const backHref = productPageHref && productPageHref !== '#' ? productPageHref : (prefill ? '/customer/profile' : '/');

  const onSubmit = async (data: OrderFormValues) => {
    setSubmitting(true);
    try {
      const payload: OrderInquiryPayload = {
        model: displayName,
        estimatedQuantity: data.estimatedQuantity.trim(),
        country: data.country,
        companyName: data.companyName?.trim() || '-',
        contactPerson: data.contactPerson.trim(),
        email: data.email.trim(),
        phone: [data.countryCode, data.phoneNumber].filter(Boolean).join(' ').trim(),
        productSlug: displaySlug?.trim() || '-',
        categorySlug: displayCategorySlug?.trim() || 'general',
      };
      if (data.additionalInfo?.trim()) payload.additionalInfo = data.additionalInfo.trim();
      if (data.coupon?.trim()) payload.coupon = data.coupon.trim();

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(result?.message || res.statusText || 'Failed to submit order');
      }
      if (variant === 'modal') {
        alert('Thank you! Our regional partners will get in touch with you shortly.');
        if (onClose) onClose();
      } else {
        setOrderPlaced(true);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to submit order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const imageSrc =
    displayImage && (displayImage.startsWith('http') || displayImage.startsWith('/'))
      ? displayImage
      : `https://via.placeholder.com/320x240?text=${encodeURIComponent(displayName)}`;

  const content = (
    <div
      className={variant === 'page' ? 'min-h-screen w-full' : 'bg-[#1658a1] rounded-xl shadow-2xl max-w-4xl w-full max-h-[120vh] overflow-y-auto'}
    >
      {variant === 'page' && (
        <div className="w-full relative overflow-hidden min-h-[200px] sm:min-h-[260px] md:min-h-[320px]">
          <Image
            src="https://res.cloudinary.com/dstnwi5iq/image/upload/v1771239351/businessman-hand-holding-e-mail-icon-contact-us-by-newsletter-email-protect-your-personal-information-from-spam-mail-customer-service-call-center-contact-us-concept.jpg_tsf0ob.jpg"
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-black/30" aria-hidden />
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)
              `,
              backgroundSize: '24px 24px',
            }}
          />
          <div className="absolute inset-0 flex items-center z-10">
           
          </div>
        </div>
      )}

      <div className="relative rounded-xl overflow-hidden">
        <div className={`relative ${variant === 'page' ? 'px-4 sm:px-6 py-6 sm:py-8 container mx-auto' : 'px-6 py-6 sm:px-8 sm:py-8'}`}>
          {orderPlaced && variant === 'page' ? (
            <div className="text-center py-12 max-w-xl mx-auto">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Order Request Submitted</h2>
              <p className="text-gray-600 mb-6">
                Thank you for your order request for <strong>{displayName}</strong>. Our regional partners will get in touch with you shortly.
              </p>
              <GradientButton href="/" variant="primary" size="lg">
                Go to Dashboard
              </GradientButton>
            </div>
          ) : (
            <>
          <div className={`flex ${variant === 'page' ? 'justify-between items-center' : 'justify-end'} mb-2`}>
            {variant === 'page' ? (
              <Link
                href={backHref}
                className="flex items-center gap-2 text-black/95 hover:text-black text-sm font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {prefill ? 'Back to profile' : 'Back to product'}
              </Link>
            ) : null}
            {variant === 'modal' && onClose ? (
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full text-white/90 hover:bg-white/10 transition-colors ml-auto"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : null}
          </div>

       

          <div className="grid md:grid-cols-2 gap-8">
            <div
              className={'flex flex-col items-center text-center'}
            >
              <h3
                className={`text-lg font-semibold mb-4 ${variant === 'page' ? 'text-[#282A4D]' : 'text-white'}`}
              >
                {displayName}
              </h3>
              <div className="relative w-full max-w-[280px] aspect-[4/3] rounded-lg overflow-hidden bg-white/10 mb-4">
                <Image
                  src={imageSrc}
                  alt={displayName}
                  fill
                  className="object-contain"
                  sizes="280px"
                  unoptimized={imageSrc.startsWith('https://via.placeholder')}
                />
              </div>
           
              <GradientButton href={viewMoreHref} variant="primary" size="lg" className="mt-4">
                View more
              </GradientButton>
              {selectedCoupon ? (
                <div className="w-full max-w-[300px] mt-6 flex drop-shadow-lg">
                  {/* Ticket perforation – left edge */}
                  <div
                    className="w-2 shrink-0 flex flex-col justify-around py-1"
                    style={{
                      background: `repeating-linear-gradient(180deg, transparent 0, transparent 4px, ${variant === 'page' ? '#e5e7eb' : 'rgba(255,255,255,0.3)'} 4px, ${variant === 'page' ? '#e5e7eb' : 'rgba(255,255,255,0.3)'} 6px)`,
                    }}
                  />
                  {/* Left section – value */}
                  <div
                    className="w-[90px] shrink-0 flex flex-col items-center justify-center py-5 px-2 text-white"
                    style={{ background: 'linear-gradient(180deg, #003a91 0%, #1658a1 50%, #9c0303 100%)' }}
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-wider opacity-90">
                      Save
                    </span>
                    <span className="text-2xl font-bold leading-tight mt-0.5 text-center">
                      {couponValueShort(selectedCoupon)}
                    </span>
                    <span className="text-[10px] font-medium uppercase mt-0.5 opacity-90">off</span>
                  </div>
                  {/* Right section – details (with inner ticket curve) */}
                  <div
                    className={`flex-1 min-w-0 py-4 pl-4 pr-4 border border-l-0 ${
                      variant === 'page'
                        ? 'bg-gray-50 border-gray-200'
                        : 'bg-white/10 border-white/20'
                    }`}
                    style={{
                      borderTopRightRadius: 12,
                      borderBottomRightRadius: 12,
                      marginLeft: -2,
                    }}
                  >
                    <p
                      className={`font-bold text-sm ${
                        variant === 'page' ? 'text-[#282A4D]' : 'text-white'
                      }`}
                    >
                      {selectedCoupon.code} Voucher
                    </p>
                    <p
                      className={`mt-1 text-xs font-medium ${
                        variant === 'page' ? 'text-[#1658a1]' : 'text-white'
                      }`}
                    >
                      {couponDiscountDetail(selectedCoupon)}
                    </p>
                    {selectedCoupon.valid_until && (
                      <p
                        className={`mt-0.5 text-[11px] ${
                          variant === 'page' ? 'text-gray-500' : 'text-white/75'
                        }`}
                      >
                        Valid till {selectedCoupon.valid_until}
                      </p>
                    )}
                    {selectedCoupon.min_order_value && (
                      <p
                        className={`mt-0.5 text-[11px] ${
                          variant === 'page' ? 'text-gray-500' : 'text-white/75'
                        }`}
                      >
                        Min order: AED {formatDiscountValue(selectedCoupon.min_order_value)}
                      </p>
                    )}
                    {selectedCoupon.description && (
                      <p
                        className={`mt-1 text-xs ${
                          variant === 'page' ? 'text-gray-500' : 'text-white/80'
                        } line-clamp-2`}
                      >
                        {selectedCoupon.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium ${
                          variant === 'page' ? 'bg-[#1658a1]/15 text-[#1658a1]' : 'bg-white/20 text-white'
                        }`}
                      >
                        Applied
                      </span>
                      <span className={variant === 'page' ? 'text-[10px] text-gray-500' : 'text-[10px] text-white/70'}>
                        At checkout
                      </span>
                    </div>
                  </div>
                  {/* Ticket perforation – right edge */}
                  <div
                    className="w-2 shrink-0 flex flex-col justify-around py-1"
                    style={{
                      background: `repeating-linear-gradient(180deg, transparent 0, transparent 4px, ${variant === 'page' ? '#e5e7eb' : 'rgba(255,255,255,0.3)'} 4px, ${variant === 'page' ? '#e5e7eb' : 'rgba(255,255,255,0.3)'} 6px)`,
                    }}
                  />
                </div>
              ) : (
                <div className="mb-4 min-h-[60px] " />
              )}
            </div>

            

            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-black/95 font-bold text-md mb-4">
                Kindly complete the fields below, and we&apos;ll ensure our regional partners get
                in touch with you.
              </p>
              <p className="text-black/80 text-sm mb-4">
                <span className="font-bold text-md">Model:</span> {displayName}
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-black text-sm font-medium mb-1">
                    Estimated Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Estimated Quantity"
                    className={`${inputClass} ${errors.estimatedQuantity ? inputErrorClass : ''}`}
                    onKeyDown={onKeyDownDigitsOnly}
                    onPaste={onPasteDigitsOnly}
                    {...register('estimatedQuantity')}
                  />
                  {errors.estimatedQuantity && (
                    <p className="mt-1 text-sm text-red-600">{errors.estimatedQuantity.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-black text-sm font-medium mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`${inputClass} ${errors.country ? inputErrorClass : ''}`}
                    {...register('country')}
                  >
                    <option value="">Confirm your country</option>
                    {COUNTRY_OPTIONS.map((c) => (
                      <option key={c} value={c} className="text-gray-900">
                        {c}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-black text-sm font-medium mb-1">
                    Company Name <span className="text-black/60 text-xs">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Company Name"
                    className={`${inputClass} ${errors.companyName ? inputErrorClass : ''}`}
                    onKeyDown={onKeyDownLettersOnly}
                    onPaste={onPasteLettersOnly}
                    {...register('companyName')}
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-black text-sm font-medium mb-1">
                    Contact Person <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contact Person (letters only)"
                    className={`${inputClass} ${errors.contactPerson ? inputErrorClass : ''}`}
                    onKeyDown={onKeyDownLettersOnly}
                    onPaste={onPasteLettersOnly}
                    {...register('contactPerson')}
                  />
                  {errors.contactPerson && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactPerson.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-black text-sm font-medium mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Email"
                    className={`${inputClass} ${errors.email ? inputErrorClass : ''}`}
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-black text-sm font-medium mb-1">
                    Person Contact No (Phone) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      className="w-24 px-2 py-2.5 rounded-lg border border-gray-400 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#1658a1]/50 shrink-0"
                      {...register('countryCode')}
                    >
                      {COUNTRY_CODES.map(({ code }) => (
                        <option key={code} value={code} className="text-gray-900">
                          {code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="Person Contact No"
                      className={`flex-1 ${inputClass} ${errors.phoneNumber ? inputErrorClass : ''}`}
                      onKeyDown={onKeyDownDigitsOnly}
                      onPaste={onPasteDigitsOnly}
                      {...register('phoneNumber')}
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-black text-sm font-medium mb-1">
                    Coupon <span className="text-black/60 text-xs">(optional – select one)</span>
                  </label>
                  <div className="space-y-2">
                    {availableCoupons.filter((c) => c.code).map((c) => (
                      <label
                        key={c.code}
                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-300 bg-white cursor-pointer hover:border-[#1658a1]/50 has-[:checked]:border-[#1658a1] has-[:checked]:ring-2 has-[:checked]:ring-[#1658a1]/30"
                      >
                        <input type="radio" value={c.code} className="w-4 h-4 text-[#1658a1]" {...register('coupon')} />
                        <span className="font-mono font-semibold text-black uppercase tracking-wider">{c.code}</span>
                        <span className="text-sm text-gray-600">{couponDiscountDetail(c)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-black text-sm font-medium mb-1">
                    Additional Information <span className="text-black/60 text-xs">(optional)</span>
                  </label>
                  <textarea
                    placeholder="Additional details"
                    rows={3}
                    className={`${inputClass} resize-none`}
                    {...register('additionalInfo')}
                  />
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/20">
                  <input
                    type="checkbox"
                    id="robot"
                    className="mt-1 w-4 h-4 rounded border-gray-400 bg-white text-[#1658a1] focus:ring-[#1658a1]/40"
                    {...register('robotChecked')}
                  />
                  <label htmlFor="robot" className="text-black text-sm">
                    I&apos;m not a robot
                  </label>
                </div>
                {errors.robotChecked && (
                  <p className="text-sm text-red-600">{errors.robotChecked.message}</p>
                )}

                <GradientButton
                  type="submit"
                  disabled={submitting}
                  variant="primary"
                  size="lg"
                  className="w-full disabled:opacity-70"
                >
                  {submitting ? 'Sending…' : 'Submit inquiry'}
                </GradientButton>
              </form>
            </div>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (variant === 'page') {
    return <div className="min-h-screen">{content}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      {content}
    </div>
  );
}
