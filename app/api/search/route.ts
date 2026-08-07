import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  // 1. Get the search query from the URL (e.g., ?q=running)
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  // If the search is too short, return empty arrays
  if (!q || q.length < 2) {
    return NextResponse.json({ shows: [], actors: [] });
  }

  try {
    // 2. Search for SHOWS where the title contains the letters (case-insensitive)
    const shows = await prisma.show.findMany({
      where: {
        title: {
          contains: q,
          mode: 'insensitive',
        },
      },
      take: 5, // Only grab the top 5 results so it doesn't lag
      select: { id: true, title: true, posterPath: true, type: true }
    });

    // 3. Search for ACTORS where their name contains the letters
    const actors = await prisma.actor.findMany({
      where: {
        name: {
          contains: q,
          mode: 'insensitive',
        },
      },
      take: 4, 
      select: { id: true, name: true, profilePath: true }
    });

    // 4. Send both lists back to the Navbar!
    return NextResponse.json({ shows, actors });
    
  } catch (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}