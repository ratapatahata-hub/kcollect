// app/api/admin/links/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const { episodeId, links } = await request.json();
  
  // 1. Delete old links for this episode to prevent duplicates
  await prisma.link.deleteMany({ where: { episodeId: Number(episodeId) } });
  
  // 2. Save the new links
  if (links && links.length > 0) {
    await prisma.link.createMany({
      data: links.map((link: any) => ({
        quality: link.quality,
        url: link.url,
        episodeId: Number(episodeId)
      }))
    });
  }
  
  return NextResponse.json({ success: true });
}