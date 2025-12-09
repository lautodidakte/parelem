import React from 'react';

type Variant = 'success' | 'warning' | 'error' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
}

const styles: Record<Variant, string> = {
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
  neutral: 'bg-gray-100 text-gray-800',
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral' }) => {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[variant]}`}>
      {children}
    </span>
  );
};