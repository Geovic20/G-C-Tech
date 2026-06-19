import React from 'react';

interface SeoProps {
  /** Page-specific title (already localized). Brand suffix is appended automatically. */
  title: string;
  description?: string;
}

const BRAND = 'G&C Tech';

/**
 * Sets per-page document metadata. React 19 natively hoists <title>/<meta>
 * rendered anywhere in the tree up to <head>, so no helmet library is needed.
 */
export default function Seo({ title, description }: SeoProps) {
  const fullTitle = title ? `${title} | ${BRAND}` : BRAND;

  return (
    <>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content="website" />
    </>
  );
}
