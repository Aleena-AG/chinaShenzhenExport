'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

type Tab = 'profile' | 'orders';

function isOrderComplete(status: unknown): boolean {
  const s = String(status ?? '').toLowerCase();
  return s === 'complete' || s === 'completed' || s === 'delivered';
}

export default function AccountDrawer({
  isOpen,
  onClose,
  initialTab = 'profile',
}: {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: Tab;
}) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [orders, setOrders] = useState<unknown[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [profileCustomer, setProfileCustomer] = useState<{ id: number; name: string; email: string; phone?: string } | null>(null);
  const { customer } = useAuth();
  const displayCustomer = profileCustomer ?? customer;

  useEffect(() => {
    if (!isOpen) return;
    setTab(initialTab);
    setOrdersLoading(true);
    const parseOrders = (json: unknown): unknown[] => {
      const j = json as Record<string, unknown>;
      const list = j?.orders ?? (j?.data as Record<string, unknown>)?.orders ?? (j?.data as Record<string, unknown>)?.data ?? (Array.isArray(j?.data) ? j.data : null) ?? j?.data;
      if (Array.isArray(list)) return list;
      if (j?.success && j?.data && Array.isArray(j.data)) return j.data;
      return [];
    };

    fetch('/api/customer/profile', { credentials: 'include' })
      .then((res) => res.json())
      .then(async (json) => {
        const c = json?.customer ?? json?.data?.customer;
        if (c) setProfileCustomer(c);
        let ordersList = parseOrders(json);
        if (ordersList.length === 0) {
          const ordRes = await fetch('/api/customer/orders', { credentials: 'include' });
          const ordJson = await ordRes.json();
          ordersList = parseOrders(ordJson);
        }
        setOrders(ordersList);
      })
      .catch(async () => {
        try {
          const r = await fetch('/api/customer/orders', { credentials: 'include' });
          const j = await r.json();
          setOrders(parseOrders(j));
        } catch {
          setOrders([]);
        }
      })
      .finally(() => setOrdersLoading(false));
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[90] bg-black/40"
        aria-hidden="true"
        onClick={onClose}
      />
      <aside
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[91] flex flex-col animate-slide-in-right"
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-drawer-title"
      >
        <div
          className="px-6 py-6 text-white flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, #003a91 0%, #9c0303 100%)' }}
        >
          <h2 id="account-drawer-title" className="text-xl font-bold tracking-tight">
            My Account
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => setTab('profile')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'profile' ? 'text-[#1658a1] border-b-2 border-[#1658a1]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Profile
          </button>
          <button
            type="button"
            onClick={() => setTab('orders')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'orders' ? 'text-[#1658a1] border-b-2 border-[#1658a1]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Orders
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'profile' && (displayCustomer || customer) && (
            <div className="space-y-4">
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Name</span>
                <p className="text-gray-900 font-medium mt-1">{(displayCustomer ?? customer)!.name}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Email</span>
                <p className="text-gray-900 font-medium mt-1">{(displayCustomer ?? customer)!.email}</p>
              </div>
              {(displayCustomer ?? customer)?.phone && (
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Phone</span>
                  <p className="text-gray-900 font-medium mt-1">{(displayCustomer ?? customer)!.phone}</p>
                </div>
              )}
            </div>
          )}

          {tab === 'orders' && (
            <div className="space-y-4">
              {ordersLoading ? (
                <p className="text-gray-500 text-sm">Loading orders…</p>
              ) : orders.length === 0 ? (
                <p className="text-gray-500 text-sm">No orders yet.</p>
              ) : (
                <ul className="space-y-3">
                  {orders.map((o, i) => {
                    const order = o as Record<string, unknown>;
                    return (
                      <li
                        key={String(order.id ?? order.orderNo ?? order.order_id ?? i + 1)}
                        className="p-4 rounded-lg border border-gray-200 bg-gray-50"
                      >
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-[#1658a1]">
                            #{String(order.orderNo ?? order.order_id ?? order.id ?? i + 1)}
                          </span>
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                              String(order.status ?? '').toLowerCase() === 'completed'
                                ? 'text-green-600 bg-green-50'
                                : String(order.status ?? '').toLowerCase() === 'cancelled'
                                  ? 'text-red-600 bg-red-50'
                                  : 'text-amber-600 bg-amber-50'
                            }`}
                          >
                            {String(order.status ?? '—')}
                          </span>
                        </div>
                        {(order.model ?? order.companyName ?? order.country ?? order.estimatedQuantity) != null && (
                          <div className="mt-2 text-sm text-gray-600 space-y-0.5">
                            {order.model != null && <p>Model: {String(order.model)}</p>}
                            {order.estimatedQuantity != null && <p>Qty: {String(order.estimatedQuantity)}</p>}
                            {order.companyName != null && <p>Company: {String(order.companyName)}</p>}
                            {order.country != null && <p>Country: {String(order.country)}</p>}
                          </div>
                        )}
                        {(order.createdAt != null || order.updatedAt != null) && (
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(String(order.createdAt ?? order.updatedAt ?? '')).toLocaleDateString()}
                          </p>
                        )}
                        {isOrderComplete(order.status) && (order.id != null || order.order_id != null) && (
                          <Link
                            href={`/customer/order-again/${order.id ?? order.order_id}`}
                            className="mt-3 inline-block w-full py-2 text-center text-sm font-medium rounded-lg text-white transition-colors"
                            style={{ background: 'linear-gradient(135deg, #003a91 0%, #9c0303 100%)' }}
                          >
                            Order Again
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
