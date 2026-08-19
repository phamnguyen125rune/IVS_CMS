'use client';

import NextLink, { type LinkProps as NextLinkProps } from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import type { AnchorHTMLAttributes, PropsWithChildren } from 'react';

type LocalizedLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> &
  Omit<NextLinkProps, 'href'> & {
    to?: string;
    href?: string;
  };

const languageCodes = new Set(['vi', 'en', 'ja']);

export function localizePath(path: string, language?: string) {
  if (!path) return `/${language || 'vi'}`;
  if (
    path.startsWith('#') ||
    path.startsWith('mailto:') ||
    path.startsWith('tel:') ||
    path.startsWith('http://') ||
    path.startsWith('https://')
  ) {
    return path;
  }

  const lang = language || 'vi';
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const firstSegment = normalized.split('/')[1];

  if (languageCodes.has(firstSegment)) return normalized;
  if (normalized === '/') return `/${lang}`;

  return `/${lang}${normalized}`;
}

export function LocalizedLink({
  to,
  href,
  children,
  ...props
}: PropsWithChildren<LocalizedLinkProps>) {
  const params = useParams();
  const language = typeof params?.language === 'string' ? params.language : 'vi';

  return (
    <NextLink href={localizePath(to || href || '/', language)} {...props}>
      {children}
    </NextLink>
  );
}

export function useLocalizedNavigate() {
  const router = useRouter();
  const params = useParams();
  const language = typeof params?.language === 'string' ? params.language : 'vi';

  return (target: string | number) => {
    if (typeof target === 'number') {
      if (target < 0) router.back();
      return;
    }

    router.push(localizePath(target, language));
  };
}

export function useLocalizedParams() {
  return useParams() as Record<string, string | string[] | undefined>;
}
