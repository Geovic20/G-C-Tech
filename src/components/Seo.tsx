import { useLocation } from 'react-router-dom';
import { COMPANY } from '@/src/lib/company';

interface SeoProps {
  /** Page-specific title (already localized). Brand suffix is appended automatically. */
  title: string;
  description?: string;
  /**
   * Absolute or root-relative image for social previews — a product photo on a
   * product page, for instance. Falls back to the site image.
   */
  image?: string;
}

/**
 * Sets per-page document metadata. React 19 natively hoists <title>, <meta> and
 * <link> rendered anywhere in the tree up to <head>, so no helmet library.
 *
 * Canonical and Open Graph URLs need an absolute address, which only exists
 * once the domain is bought. Until `COMPANY.domain` is filled in, those tags
 * are omitted rather than emitted with a wrong or relative value — a canonical
 * pointing at the wrong host is worse than none. Set the domain in
 * src/lib/company.ts and every page starts emitting them.
 */
const SITE_IMAGE = '/android-chrome-512x512.png';

export default function Seo({ title, description, image }: SeoProps) {
  const { pathname } = useLocation();
  const fullTitle = title ? `${title} | ${COMPANY.name}` : COMPANY.name;

  const origin = COMPANY.domain ? `https://${COMPANY.domain}` : null;
  const canonical = origin ? `${origin}${pathname}` : null;
  const imagePath = image ?? SITE_IMAGE;
  const absoluteImage = origin
    ? imagePath.startsWith('http')
      ? imagePath
      : `${origin}${imagePath}`
    : null;

  return (
    <>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}

      <meta property="og:site_name" content={COMPANY.name} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content="website" />
      {canonical && <link rel="canonical" href={canonical} />}
      {canonical && <meta property="og:url" content={canonical} />}
      {absoluteImage && <meta property="og:image" content={absoluteImage} />}

      {/* Twitter reads og:* as a fallback, but the card type must be explicit. */}
      <meta name="twitter:card" content={absoluteImage ? 'summary_large_image' : 'summary'} />
    </>
  );
}
