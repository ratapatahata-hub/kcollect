import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function formatDate(dateStr: string) {
  if (!dateStr) return 'TBA';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${date.getFullYear()}-${months[date.getMonth()]}-${String(date.getDate()).padStart(2, '0')}`;
}

export async function POST(request: Request) {
  try {
    const { tmdbId } = await request.json();
    const apiKey = process.env.TMDB_API_KEY;

    if (!tmdbId || !apiKey) return NextResponse.json({ error: 'Missing ID or API Key' }, { status: 400 });

    let isMovie = false;
    let tmdbResponse = await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${apiKey}&append_to_response=credits`);
    
    if (!tmdbResponse.ok) {
      tmdbResponse = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${apiKey}&append_to_response=credits`);
      isMovie = true;
      if (!tmdbResponse.ok) return NextResponse.json({ error: 'Show/Movie not found on TMDb' }, { status: 404 });
    }

    const data = await tmdbResponse.json();

    // 1. Determine Type & Categories
    let showType = isMovie ? "Movie" : "Drama";
    const genres = data.genres?.map((g: any) => g.name) || [];
    if (!isMovie && (data.type === "Reality" || data.type === "Talk Show" || genres.includes("Reality") || genres.includes("Variety"))) {
      showType = "Variety Show";
    }

    // 2. Extract Network & Broadcast Details
    const networkName = isMovie 
      ? (data.production_companies?.[0]?.name || 'Movie Release')
      : (data.networks?.map((n: any) => n.name).join(', ') || 'Unknown Network');

    const firstAir = isMovie ? data.release_date : data.first_air_date;
    const lastAir = isMovie ? data.release_date : data.last_air_date;
    const broadcastPeriodStr = `${formatDate(firstAir)} to ${formatDate(lastAir)}`;

// NEW: Determine Status
    let derivedStatus = "Completed";
    if (!isMovie) {
      if (data.status === "Returning Series" || data.status === "In Production") derivedStatus = "Ongoing";
      else if (data.status === "Planned" || data.status === "Upcoming") derivedStatus = "Upcoming";
    } else {
      if (data.status === "Released") derivedStatus = "Completed";
      else derivedStatus = "Upcoming";
    }



    // 3. Format Cast
    const actorsData = data.credits?.cast?.slice(0, 10).map((actor: any) => ({
      where: { tmdbId: actor.id },
      create: { tmdbId: actor.id, name: actor.name, profilePath: actor.profile_path || '' }
    })) || [];

    // 4. Fetch Episodes
    let episodesData = [];
    if (!isMovie) {
      const seasonRes = await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}/season/1?api_key=${apiKey}`);
      if (seasonRes.ok) episodesData = (await seasonRes.json()).episodes || [];
    } else {
      episodesData = [{ episode_number: 1, name: 'Full Movie' }];
    }

    // 5. Upsert into Database
    const upsertedShow = await prisma.show.upsert({
      where: { tmdbId: data.id },
      update: {
        title: isMovie ? data.title : data.name,
        type: showType,
        categories: genres.join(', '),
        overview: data.overview || '',
        posterPath: data.poster_path || '',
        rating: data.vote_average || 0,
        network: networkName,
        broadcastPeriod: broadcastPeriodStr,
        airTime: isMovie ? 'N/A' : 'Monday & Tuesday 20:45 KST',
        actors: { connectOrCreate: actorsData },
      },
      create: {
        tmdbId: data.id,
        title: isMovie ? data.title : data.name,
        type: showType,
        categories: genres.join(', '),
        overview: data.overview || '',
        posterPath: data.poster_path || '',
        rating: data.vote_average || 0,
        network: networkName,
        broadcastPeriod: broadcastPeriodStr,
        airTime: isMovie ? 'N/A' : 'Monday & Tuesday 20:45 KST',
        actors: { connectOrCreate: actorsData },
        seasons: {
          create: [{
            seasonNumber: 1,
            episodes: {
              create: episodesData.map((ep: any) => ({
                episodeNumber: ep.episode_number,
                title: ep.name || `Episode ${ep.episode_number}`,
              }))
            }
          }]
        }
      },
    });

    return NextResponse.json({ message: 'Success!', show: upsertedShow });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}