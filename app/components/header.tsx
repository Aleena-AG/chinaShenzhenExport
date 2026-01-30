'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getCartCount, getCartTotal, CART_UPDATED_EVENT } from '../lib/cart';

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState('0.00');
  const [compareCount] = useState(0);

  const refreshCart = () => {
    if (typeof window !== 'undefined') {
      setCartCount(getCartCount());
      setCartTotal(getCartTotal());
    }
  };

  useEffect(() => {
    refreshCart();
    window.addEventListener(CART_UPDATED_EVENT, refreshCart);
    return () => window.removeEventListener(CART_UPDATED_EVENT, refreshCart);
  }, []);

  return (
    <header className="w-full text-[#1658a1]">
      {/* Top Utility Bar - white bg, red text */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between text-sm text-[#1658a1]">
          {/* Left: Welcome Message */}
          <div className="text-[#1658a1] text-xs sm:text-sm font-medium">
            Welcome to Worldwide CSE Store
          </div>

          {/* Right: Utility Links */}
          <div className="hidden md:flex items-center gap-0">
            <UtilityLink icon="location" text="Store Locator" isMailBar />
            <Divider isLight />
            <UtilityLink icon="truck" text="Track Your Order" isMailBar />
            <Divider isLight />
            <UtilityLink icon="bag" text="Shop" isMailBar />
            <Divider isLight />
            <UtilityLink icon="user" text="My Account" isMailBar />
          </div>
        </div>
      </div>

      {/* Main Navigation Bar - white bg, red text */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-8">
          <div className="flex items-center justify-between h-20 text-[#1658a1]">
            {/* Left: Logo */}
            <div className="flex items-center">
           <Image src="https://res.cloudinary.com/dstnwi5iq/image/upload/v1769773702/161d8737-4a02-4882-8ddd-5363a1b95eb8-removebg-preview_4_uzklux.png" alt="Logo" width={250} height={100} />
            </div>

            {/* Center: Navigation Menu */}
            <nav className="hidden font-semibold text-base lg:flex items-center gap-10 hover:text-[#1658a1] transition-colors">
              <NavLink text="Home" href="/" />
              <NavLink text="About Us" />
              
              <NavLink text="Shop" />
              <NavLink text="Contact Us" />
            </nav>

            {/* Right: Action Icons & Cart */}
            <div className="flex items-center gap-4 sm:gap-6">
              <IconButton icon="refresh" badge={compareCount} variant="blue" />
              <IconButton icon="heart" variant="blue" />
              <IconButton icon="user" variant="blue" />
              <Link href="/cart" className="flex items-center gap-2">
                <IconButton icon="cart" badge={cartCount} variant="blue" />
                <span className="hidden sm:inline text-sm text-[#1658a1] font-medium">
                  ${cartTotal}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// Utility Link Component
function UtilityLink({ icon, text, isMailBar }: { icon: string; text: string; isMailBar?: boolean }) {
  const IconComponent = getIcon(icon);
  const linkClass = isMailBar
    ? "flex items-center gap-2 px-3 py-1 text-[#1658a1] hover:opacity-90 transition-colors text-xs sm:text-sm font-medium"
    : "flex items-center gap-2 px-3 py-1 text-[#1658a1] hover:opacity-90 transition-colors text-xs sm:text-sm";
  
  return (
    <a href="#" className={linkClass}>
      <IconComponent className="w-4 h-4" />
      <span>{text}</span>
    </a>
  );
}

// Divider Component
function Divider({ isLight }: { isLight?: boolean }) {
  return <div className={`w-px h-4 ${isLight ? "bg-gray-300" : "bg-[#333]"}`} />;
}

// Navigation Link Component
function NavLink({ text, hasDropdown = false, href = '#' }: { text: string; hasDropdown?: boolean; href?: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1 text-base font-semibold hover:text-[#1658a1] transition-colors"
    >
      {text}
      {hasDropdown && (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      )}
    </Link>
  );
}

// Icon Button Component
function IconButton({ icon, badge, variant }: { icon: string; badge?: number; variant?: 'blue' | 'blue' }) {
  const IconComponent = getIcon(icon);
  const btnClass = variant === 'blue'
    ? "relative p-2 text-[#1658a1] hover:text-[#1658a1] transition-colors"
    : "relative p-2 hover:text-[#1658a1] transition-colors";
  
  return (
    <button className={btnClass}>
      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#1658a1] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {badge}
        </span>
      )}
      {badge !== undefined && badge === 0 && (
          <span className="absolute -top-1 -right-1 bg-[#1658a1] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          0
        </span>
      )}
    </button>
  );
}

// Hamburger Icon Component
function HamburgerIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );
}

// Icon Getter Function
function getIcon(iconName: string) {
  const icons: Record<string, React.FC<{ className?: string }>> = {
    location: ({ className }) => (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    truck: ({ className }) => (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
        />
        <circle cx="7" cy="18" r="2" strokeWidth={2} />
        <circle cx="17" cy="18" r="2" strokeWidth={2} />
      </svg>
    ),
    bag: ({ className }) => (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    ),
    user: ({ className }) => (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    refresh: ({ className }) => (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    ),
    heart: ({ className }) => (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
    cart: ({ className }) => (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  };

  return icons[iconName] || icons.user;
}
