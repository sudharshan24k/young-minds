import type { HTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={twMerge(
        'rounded-2xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}