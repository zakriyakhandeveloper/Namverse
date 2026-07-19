import { getSiteUrl } from '@/lib/seo/site';

/**
 * GoogleBotMeta
 * Adds crawl directives and helpful hints for search engine bots.
 *
 * NOTE: The global <meta name="robots"> is set via the `robots` export in
 * layout.js. This component only adds bot-specific hints that supplement it.
 */
export default function GoogleBotMeta({ siteUrl }) {
  if (!siteUrl) siteUrl = getSiteUrl();
  const crawlDirectives =
    "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1";

  return (
    <>
      <meta name="googlebot" content={crawlDirectives} />
      <meta name="googlebot-news" content="index, follow" />
      <meta name="bingbot" content={crawlDirectives} />
      <link
        rel="sitemap"
        href={`${siteUrl}/sitemap.xml`}
        type="application/xml"
        title="NameVerse Sitemap"
      />
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
    </>
  );
}
