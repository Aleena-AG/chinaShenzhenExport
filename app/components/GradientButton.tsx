'use client';

import Link from 'next/link';

const GRADIENT_PRIMARY = 'linear-gradient(90deg, #003a91 24%, #9c0303 100%)';
const GRADIENT_SECONDARY = 'linear-gradient(90deg, #e85d04 0%, #dc2f02 100%)';

const baseClasses =
  'inline-flex items-center justify-center font-semibold text-xs uppercase tracking-wide rounded-xl shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:pointer-events-none';

const sizeClasses = {
  sm: 'py-2 px-4 text-xs rounded-lg',
  md: 'py-2.5 px-5 text-xs rounded-xl',
  lg: 'py-3 px-6 text-sm rounded-xl',
};

const variantStyles: Record<string, React.CSSProperties> = {
  primary: { background: GRADIENT_PRIMARY },
  secondary: { background: GRADIENT_SECONDARY },
};

const variantColorClasses: Record<string, string> = {
  primary: 'text-white hover:opacity-95 focus:ring-white/50',
  secondary: 'text-white hover:opacity-95 focus:ring-white/50',
  outline: 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow focus:ring-gray-400/50',
};

export type GradientButtonVariant = 'primary' | 'secondary' | 'outline';
export type GradientButtonSize = 'sm' | 'md' | 'lg';

export type GradientButtonProps = {
  children: React.ReactNode;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: GradientButtonVariant;
  size?: GradientButtonSize;
  /** Use when button is inside a Link (e.g. card "MORE INFO") – renders as span */
  asSpan?: boolean;
  ariaLabel?: string;
};

export default function GradientButton({
  children,
  href,
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  variant = 'primary',
  size = 'md',
  asSpan = false,
  ariaLabel,
}: GradientButtonProps) {
  const sizeClass = sizeClasses[size];
  const isOutline = variant === 'outline';
  const style = !isOutline ? variantStyles[variant] : undefined;
  const variantClasses = variantColorClasses[variant] ?? variantColorClasses.primary;
  const classes = [baseClasses, sizeClass, variantClasses, className]
    .filter(Boolean)
    .join(' ');

  const commonProps = {
    className: classes,
    style,
    'aria-label': ariaLabel,
  };

  if (asSpan) {
    return <span {...commonProps}>{children}</span>;
  }

  if (href) {
    return (
      <Link href={href} {...commonProps}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} {...commonProps}>
      {children}
    </button>
  );
}
