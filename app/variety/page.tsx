import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function VarietyPage() {
  const shows = await prisma.show.findMany({
    where: { type: { contains: 'Variety', mode: 'insensitive' } },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="p-10 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-[#1dbf73]">Variety Shows</h1>
        {shows.length === 0 ? (
          <p className="text-gray-500">No variety shows found in the database yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {shows.map((show) => (
              <Link href={`/show/${show.id}`} key={show.id} className="block group">
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 group-hover:scale-105 transition-transform h-full flex flex-col">
                  {show.posterPath ? <img src={`https://image.tmdb.org/t/p/w500${show.posterPath}`} className="w-full aspect-[2/3] object-cover" /> : <div className="w-full aspect-[2/3] bg-gray-100 dark:bg-gray-700"></div>}
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <h2 className="text-xl font-bold mb-2 truncate text-gray-900 dark:text-white group-hover:text-[#1dbf73] transition-colors">{show.title}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">{show.overview}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}