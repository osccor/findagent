import siteConfig from '@/components/seo/siteConfig';
import { getAllOmradePaths, getHubPaths } from '@/data/areas';
import { getAllAgentSlugs } from '@/data/agents';

// Lists every area URL so search engines can discover the full set of
// programmatic "bästa mäklare i …" pages. Generated on request (cheap; in
// production cache it or write a static file at build time).
function buildXml(urls) {
  const items = urls
    .map(
      (loc) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${siteConfig.dataUpdatedAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;
}

export async function getServerSideProps({ res }) {
  const segments = ['', ...getHubPaths(), ...getAllOmradePaths()].map((p) =>
    Array.isArray(p) ? `/${p.join('/')}` : p,
  );
  const areaUrls = segments.map((seg) => `${siteConfig.baseUrl}/maklare${seg}`);
  const profileUrls = getAllAgentSlugs().map((slug) => `${siteConfig.baseUrl}/maklare/profil/${slug}`);
  const urls = [...areaUrls, ...profileUrls];

  res.setHeader('Content-Type', 'text/xml');
  res.write(buildXml(urls));
  res.end();

  return { props: {} };
}

export default function SiteMap() {
  return null;
}
