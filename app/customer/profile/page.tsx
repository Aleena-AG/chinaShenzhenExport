'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

type OrderItem = {
  id?: number;
  orderNo?: number | string;
  order_id?: number;
  model?: string;
  estimatedQuantity?: string;
  country?: string;
  companyName?: string;
  contactPerson?: string;
  productSlug?: string;
  categorySlug?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
};

function formatDate(iso: string | undefined): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function getStatusColor(status: string | undefined): string {
  const s = (status ?? '').toLowerCase();
  if (s === 'completed') return 'text-green-600 bg-green-50';
  if (s === 'paid' || s === 'processing') return 'text-blue-600 bg-blue-50';
  if (s === 'cancelled') return 'text-red-600 bg-red-50';
  return 'text-amber-600 bg-amber-50';
}

function isOrderComplete(status: string | undefined): boolean {
  const s = (status ?? '').toLowerCase();
  return s === 'complete' || s === 'completed' || s === 'delivered';
}

export default function CustomerProfilePage() {
  const router = useRouter();
  const { customer, isAuthenticated, isLoading } = useAuth();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !customer) {
      router.replace('/customer/login');
      return;
    }
  }, [isLoading, isAuthenticated, customer, router]);

  useEffect(() => {
    if (!isAuthenticated && !customer) return;
    setOrdersLoading(true);
    fetch('/api/customer/profile', { credentials: 'include' })
      .then((res) => {
        if (res.status === 401) {
          router.replace('/customer/login');
          return {};
        }
        return res.json();
      })
      .then((json) => {
        const list = json?.orders ?? json?.data?.orders ?? json?.data;
        if (Array.isArray(list)) {
          setOrders(list);
        } else if (json?.success && Array.isArray(json?.data)) {
          setOrders(json.data);
        } else {
          setOrders([]);
        }
      })
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [isAuthenticated, customer, router]);

  if (isLoading || (!isAuthenticated && !customer)) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <div className="min-h-[60vh] py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold text-[#1658a1] mb-8">My Profile</h1>

        {/* Account info */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account details</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs text-gray-500 uppercase tracking-wider">Name</dt>
              <dd className="text-gray-900 font-medium mt-0.5">{customer.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500 uppercase tracking-wider">Email</dt>
              <dd className="text-gray-900 font-medium mt-0.5">{customer.email}</dd>
              <p className="text-sm text-gray-500 mt-1">Orders are matched to this email (checkout email).</p>
            </div>
            {customer.phone && (
              <div>
                <dt className="text-xs text-gray-500 uppercase tracking-wider">Phone</dt>
                <dd className="text-gray-900 font-medium mt-0.5">{customer.phone}</dd>
              </div>
            )}
          </dl>
        </section>

        {/* Order history */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order history</h2>
          {ordersLoading ? (
            <p className="text-gray-500 text-sm">Loading orders…</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-500 text-sm">No orders yet. Orders placed with {customer.email} will appear here.</p>
          ) : (
            <ul className="space-y-4">
              {orders.map((order, i) => (
                <li
                  key={order.id ?? order.orderNo ?? i}
                  className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-[#1658a1]">
                      #{String(order.orderNo ?? order.order_id ?? order.id ?? i + 1)}
                    </span>
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status as string
                      )}`}
                    >
                      {String(order.status ?? '—')}
                    </span>
                  </div>
                  {(order.model || order.companyName || order.country) && (
                    <div className="mt-2 text-sm text-gray-600 space-y-0.5">
                      {order.model && <p>Model: {String(order.model)}</p>}
                      {order.companyName && <p>Company: {String(order.companyName)}</p>}
                      {order.country && <p>Country: {String(order.country)}</p>}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    {formatDate((order.createdAt ?? order.updatedAt) as string)}
                  </p>
                  {isOrderComplete(order.status as string) && (order.id != null || order.order_id != null) && (
                    <Link
                      href={`/customer/order-again/${order.id ?? order.order_id}`}
                      className="mt-3 inline-block w-full py-2 text-center text-sm font-medium rounded-lg text-white transition-colors"
                      style={{ background: 'linear-gradient(135deg, #003a91 0%, #9c0303 100%)' }}
                    >
                      Order Again
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="mt-6 text-center">
          <Link href="/" className="text-[#1658a1] font-medium hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
