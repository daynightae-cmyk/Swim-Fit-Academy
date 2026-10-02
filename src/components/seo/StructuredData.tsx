import { getTranslations } from 'next-intl/server';

import { business, publicValue } from '@/content/business';
import { isPublicStatus } from '@/content/business';
import { faqsByCategory } from '@/content/faq';
import { appRoutes, localizedPath, type Locale } from '@/i18n/routing';

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
}

/**
 * Conservative structured data.
 *
 * Only facts that clear the verification policy are emitted. There is no
 * streetAddress, no geo, no openingHours, no priceRange, no aggregateRating,
 * no review, and no award data anywhere in this file. Instagram is excluded
 * from `sameAs` until the owner confirms ownership.
 */
export async function StructuredData({ locale }: { readonly locale: Locale }) {
  const origin = siteUrl();
  const name = publicValue(business.name);
  const telephone = publicValue(business.phone.international);
  const facebook = publicValue(business.social.facebook.url);
  const instagram = business.social.instagram;

  const organization = {
    '@type': 'Organization',
    '@id': `${origin}/#organization`,
    name,
    url: `${origin}${localizedPath(locale, '')}`,
    ...(telephone ? { telephone } : {}),
    ...(facebook ? { sameAs: [facebook] } : {}),
  };

  const swimmingSchool = {
    '@type': 'SwimmingSchool' as const,
    '@id': `${origin}/#swimf.academy`,
    name,
    url: `${origin}${localizedPath(locale, '')}`,
    ...(telephone ? { telephone } : {}),
    ...(facebook ? { sameAs: [facebook] } : {}),
    areaServed: {
      '@type': 'City',
      name: publicValue(business.city) ?? 'Abu Dhabi',
    },
    description:
      'Swimming instruction for all levels in Abu Dhabi, in Arabic and English.',
    availableLanguage: ['ar', 'en'],
    parentOrganization: { '@id': `${origin}/#organization` },
  };

  const website = {
    '@type': 'WebSite',
    '@id': `${origin}/#website`,
    url: `${origin}${localizedPath(locale, '')}`,
    name,
    inLanguage: locale,
    publisher: { '@id': `${origin}/#organization` },
  };

  const breadcrumb = {
    '@type': 'BreadcrumbList',
    itemListElement: appRoutes.map((route, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: route.key,
      item: `${origin}${localizedPath(locale, route.slug)}`,
    })),
  };

  // FAQPage is restricted to the answerable-now group and uses literal visible copy.
  const t = await getTranslations({ locale, namespace: 'faq' });
  const confirmed = faqsByCategory('answered').map((entry) => ({
    '@type': 'Question',
    name: t(`questions.${entry.id}`),
    acceptedAnswer: {
      '@type': 'Answer',
      text: t(`answers.${entry.id}`),
    },
  }));

  const faqPage = {
    '@type': 'FAQPage',
    '@id': `${origin}${localizedPath(locale, 'faq')}#faq`,
    mainEntity: confirmed,
  };

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      organization,
      swimmingSchool,
      website,
      ...(locale === 'ar' ? [breadcrumb] : []),
      ...(locale === 'ar' ? [faqPage] : []),
    ],
  };

  const instagramVerified = isPublicStatus(instagram.url.status);
  void instagramVerified;

  return (
    <script
      type="application/ld+json"
      // Content is generated from verified config only; no user input reaches it.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

export default StructuredData;
