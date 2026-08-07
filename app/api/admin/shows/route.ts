// app/api/admin/shows/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Fetch all shows for the admin dashboard
export async function GET() {
  const shows = await prisma.show.findMany({
    orderBy: { createdAt: 'desc' },
    include: { seasons: { include: { episodes: { include: { links: true }, orderBy: { episodeNumber: 'asc' } } } } }
  });
  return NextResponse.json(shows);
}

// Delete a show
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    await prisma.show.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
}