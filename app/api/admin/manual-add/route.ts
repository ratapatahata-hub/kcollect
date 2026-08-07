import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Create a guaranteed unique "fake" ID using the current timestamp (make it negative to avoid TMDb collisions)
    const fakeTmdbId = -Math.floor(Date.now() / 1000);

    const newShow = await prisma.show.create({
      data: {
        tmdbId: fakeTmdbId,
        title: body.title,
        type: body.type || 'Drama',
        categories: body.categories || 'Unknown',
        overview: body.overview || '',
        posterPath: body.posterPath || '', // You can paste direct image URLs here!
        rating: Number(body.rating) || 0,
        network: body.network || 'Web',
        status: body.status || 'Completed',
        
        // We automatically create a "Season 1, Episode 1" so your Link Editor works instantly!
        seasons: {
          create: [{
            seasonNumber: 1,
            episodes: {
                create: [{ episodeNumber: 1, title: 'Full Batch / Ep 1' }]
            }
          }]
        }
      }
    });

    return NextResponse.json({ success: true, show: newShow });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}