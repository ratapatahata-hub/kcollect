import { prisma } from '@/lib/prisma';

export async function GET() {
  const shows = await prisma.show.findMany({ select: { id: true, updatedAt: true } });
  
  const baseUrl = "https://kcollect.com"; // Replace with your actual domain later!

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url><loc>${baseUrl}</loc></url>
      <url><loc>${baseUrl}/dramas</loc></url>
      <url><loc>${baseUrl}/movies</loc></url>
      ${shows.map(show => `
        <url>
          <loc>${baseUrl}/show/${show.id}</loc>
          <lastmod>${show.updatedAt.toISOString()}</lastmod>
        </url>
      `).join('')}
    </urlset>`;

  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml' }
  });
}