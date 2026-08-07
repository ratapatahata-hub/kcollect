import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const show = await prisma.show.findUnique({ where: { id: Number(id) } });
  
  return {
    title: show ? `${show.title} - KCollect` : "KCollect",
    description: show?.overview?.substring(0, 160) || "Watch and download latest Korean Dramas and Movies on KCollect.",
    keywords: `${show?.title}, Korean Drama, download ${show?.title}, KCollect, watch online`,
  };
}

export default async function ShowDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const show = await prisma.show.findUnique({
    where: { id: Number(id) },
    include: { actors: true, seasons: { include: { episodes: { include: { links: true }, orderBy: { episodeNumber: 'asc' } } } } }
  });

  if (!show) notFound();

  // Fetch Recommended Shows (Matches the same 'type', excluding the current show)
  const recommendedShows = await prisma.show.findMany({
    where: { 
      type: show.type,
      id: { not: Number(id) } 
    },
    take: 8, // Grab up to 8 similar shows
    orderBy: { rating: 'desc' }
  });

  const episodes = show.seasons[0]?.episodes || [];
  const epCount = episodes.length;
  const epRange = epCount > 0 ? `01 - ${epCount < 10 ? '0' + epCount : epCount}` : 'Full Batch';

  return (
    // Changed bg-gray-900 to dynamic Light/Dark mode background
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 pb-20">
      
      {/* Expanded to max-w-[1400px] for full-screen feel */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        
        {/* Navigation */}
        
        <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "TVSeries",
      "name": show.title,
      "description": show.overview,
      "image": show.posterPath?.startsWith('http') ? show.posterPath : `https://image.tmdb.org/t/p/w500${show.posterPath}`,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": show.rating,
        "bestRating": "10",
        "ratingCount": "100"
      }
    }),
  }}
/>

        {/* Header Block: Poster & Metadata */}
        <div className="md:flex gap-10 mb-12 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
          
          <div className="md:w-[350px] flex-shrink-0 mb-8 md:mb-0">
            {show.posterPath ? (
              <img src={show.posterPath.startsWith('http') ? show.posterPath : `https://image.tmdb.org/t/p/w500${show.posterPath}`} alt={show.title} className="w-full rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700" />
            ) : (
              <div className="w-full aspect-[2/3] bg-gray-200 dark:bg-gray-800 rounded-xl flex items-center justify-center">No Image</div>
            )}
          </div>

          <div className="md:w-2/3 flex flex-col justify-start">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-gray-900 dark:text-white">{show.title}</h1>
            
            <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm md:text-base mb-8 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
              <p><span className="font-semibold text-gray-900 dark:text-gray-400 w-40 inline-block">Title:</span> {show.title}</p>
              <p>
                <span className="font-semibold text-gray-900 dark:text-gray-400 w-40 inline-block">Status:</span> 
                <span className={`font-bold ${show.status === 'Ongoing' ? 'text-[#1dbf73]' : show.status === 'Upcoming' ? 'text-blue-500' : 'text-gray-500'}`}>
                  {show.status || 'Completed'}
                </span>
              </p>
              <p><span className="font-semibold text-gray-900 dark:text-gray-400 w-40 inline-block">Genre:</span> {show.categories || 'Drama, Mystery'}</p>
              <p><span className="font-semibold text-gray-900 dark:text-gray-400 w-40 inline-block">Episodes:</span> {epCount}</p>
              <p><span className="font-semibold text-gray-900 dark:text-gray-400 w-40 inline-block">Broadcast network:</span> {show.network || 'tvN'}</p>
              <p><span className="font-semibold text-gray-900 dark:text-gray-400 w-40 inline-block">Broadcast period:</span> {show.broadcastPeriod || 'TBA'}</p>
              <p><span className="font-semibold text-gray-900 dark:text-gray-400 w-40 inline-block">Air time:</span> {show.airTime || 'Monday & Tuesday 20:45 KST'}</p>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">{show.overview}</p>
          </div>
        </div>

        {/* Subtitles Note */}
        <div className="mb-4 italic text-gray-500 dark:text-gray-400 text-sm pl-2">
          <span className="font-semibold text-gray-700 dark:text-gray-300 not-italic">Subtitles:</span> Internal eng & other softsubs embedded
        </div>

        {/* FULL SERIES BATCH DOWNLOAD TABLE */}
        <div className="mb-16 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-md">
          <div className="bg-[#1dbf73] text-white font-bold py-3 px-6 text-sm tracking-wide">
            Episode {epRange}
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
            {['540p', '720p', '1080p', '1080pHD'].map((quality) => {
              const firstEpisode = episodes[0];
              const qualityLinks = firstEpisode?.links?.filter((l: any) => l.quality === quality) || [];

              if (qualityLinks.length === 0) return null; 

              return (
                <div key={quality} className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="w-24 bg-[#1dbf73] text-white text-xs font-bold py-1.5 px-3 text-center rounded mr-6 shadow-sm">
                    {quality}
                  </div>
                  <div className="text-sm font-medium flex gap-3">
                    {qualityLinks.map((link: any, index: number) => (
                      <span key={link.id} className="flex items-center">
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="bg-[#1dbf73] dark:bg-[#1dbf73] hover:underline">
                          Link {index + 1}
                        </a>
                        {index < qualityLinks.length - 1 && <span className="text-gray-400 dark:text-gray-600 ml-3">|</span>}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}

            {(!episodes[0]?.links || episodes[0].links.length === 0) && (
              <div className="p-8 text-gray-500 text-center text-sm bg-white dark:bg-gray-900">
                Links coming soon...
              </div>
            )}
          </div>
        </div>

        {/* CAST SECTION */}
        {show.actors && show.actors.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-[#1dbf73] rounded"></span> Top Cast
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6">
              {show.actors.map((actor) => (
                <Link href={`/actor/${actor.id}`} key={actor.id} className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  {actor.profilePath ? (
                    <img src={`https://image.tmdb.org/t/p/w200${actor.profilePath}`} alt={actor.name} className="w-full aspect-[2/3] object-cover"/>
                  ) : (
                    <div className="w-full aspect-[2/3] bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs text-gray-400 p-2 text-center">No Photo</div>
                  )}
                  <div className="p-3 text-center">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{actor.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* HORIZONTAL RECOMMENDED SECTION */}
        {recommendedShows.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-800 pt-12 mt-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-[#1dbf73] rounded"></span> You May Also Like
            </h2>
            
            {/* Horizontal scroll container */}
            <div className="flex overflow-x-auto pb-6 gap-6 snap-x no-scrollbar">
              {recommendedShows.map((recShow) => (
                <Link href={`/show/${recShow.id}`} key={recShow.id} className="min-w-[160px] md:min-w-[200px] flex-shrink-0 snap-start group">
                  <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800 group-hover:border-blue-500 transition-colors">
                    {recShow.posterPath ? (
                      <img src={recShow.posterPath.startsWith('http') ? recShow.posterPath : `https://image.tmdb.org/t/p/w300${recShow.posterPath}`} alt={recShow.title} className="w-full aspect-[2/3] object-cover" />
                    ) : (
                      <div className="w-full aspect-[2/3] bg-gray-100 dark:bg-gray-800"></div>
                    )}
                    <div className="p-3">
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate group-hover:text-blue-500">{recShow.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">⭐ {recShow.rating?.toFixed(1) || 'N/A'}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}