import type { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface SectionHeaderProps extends HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div className={twMerge('text-center', className)} {...props}>
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-lg leading-8 text-gray-600">{subtitle}</p>
      )}
    </div>
  );
}