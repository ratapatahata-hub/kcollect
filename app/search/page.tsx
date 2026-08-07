import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const params = await searchParams;
  
  const q = params.q || '';
  const genre = params.genre || '';
  const type = params.type || '';
  const orderByQuery = params.orderBy || '';

  // 1. Build Dynamic Filter Rules
  const whereClause: any = {};
  
  if (q) whereClause.title = { contains: q, mode: 'insensitive' };
  if (genre) whereClause.categories = { contains: genre, mode: 'insensitive' };
  if (type) whereClause.type = { contains: type, mode: 'insensitive' };

  // 2. Build Dynamic Sorting Rules
  let orderClause: any = {};
  if (orderByQuery === 'Latest') {
    orderClause = { createdAt: 'desc' };
  } else if (orderByQuery === 'Top Rated') {
    orderClause = { rating: 'desc' };
  }

  // 3. Fetch from Database based on the dynamic rules!
  const shows = await prisma.show.findMany({
    where: whereClause,
    orderBy: Object.keys(orderClause).length > 0 ? orderClause : undefined
  });

  // (We only search actors if it's a basic text search)
  const actors = q ? await prisma.actor.findMany({
    where: { name: { contains: q, mode: 'insensitive' } },
  }) : [];

  return (
    <main className="min-h-screen p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Search Results</h1>
        <div className="flex gap-2 mb-8 text-sm text-gray-500">
           {q && <span className="bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-full">Query: {q}</span>}
           {genre && <span className="bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-full">Genre: {genre}</span>}
           {type && <span className="bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-full">Type: {type}</span>}
           {orderByQuery && <span className="bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-full">Order: {orderByQuery}</span>}
        </div>

        {shows.length === 0 && actors.length === 0 && (
          <p className="text-gray-500 text-lg">No results found matching your filters.</p>
        )}

        {/* Show Results Grid */}
        {shows.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2 border-gray-300 dark:border-gray-700">Dramas & Movies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {shows.map((show) => (
                <Link href={`/show/${show.id}`} key={show.id} className="block group">
                  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 group-hover:scale-105 transition-transform h-full flex flex-col">
                    {show.posterPath ? (
                      <img src={`https://image.tmdb.org/t/p/w500${show.posterPath}`} alt={show.title} className="w-full aspect-[2/3] object-cover"/>
                    ) : (
                      <div className="w-full aspect-[2/3] bg-gray-200 dark:bg-gray-700 flex items-center justify-center">No Image</div>
                    )}
                    <div className="p-3 flex flex-col justify-between flex-grow">
                      <div>
                        <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate group-hover:text-[#1dbf73]">{show.title}</h3>
                        <p className="text-xs text-[#1dbf73] mt-1">{show.type}</p>
                      </div>
                      <p className="text-xs text-yellow-500 font-bold mt-2">⭐ {show.rating?.toFixed(1)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Actor Results Grid */}
        {actors.length > 0 && (
           /* ... existing actors code from previous step ... */
           <div>
            <h2 className="text-2xl font-bold mb-6 border-b pb-2 border-gray-300 dark:border-gray-700">Cast & Entertainers</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {actors.map((actor) => (
                <Link href={`/actor/${actor.id}`} key={actor.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform text-center pb-3">
                  {actor.profilePath ? (
                    <img src={`https://image.tmdb.org/t/p/w200${actor.profilePath}`} alt={actor.name} className="w-full aspect-[2/3] object-cover mb-2"/>
                  ) : (
                    <div className="w-full aspect-[2/3] bg-gray-200 dark:bg-gray-700 mb-2"></div>
                  )}
                  <p className="font-bold text-sm text-gray-900 dark:text-white px-2 truncate">{actor.name}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}