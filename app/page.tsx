import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Sidebar from './components/Sidebar'; 

export default async function Home() {
  const shows = await prisma.show.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const topShows = await prisma.show.findMany({
    orderBy: { rating: 'desc' },
    take: 30 
  });

  return (
    <main className="p-4 sm:p-6 md:p-10 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1dbf73]">Recently Added</h1>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        
        {/* MAIN SHOW GRID */}
        <div className="lg:w-3/4 w-full">
          {shows.length === 0 ? (
            <p className="text-gray-500">No shows found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {shows.map((show) => (
                // Added "relative" here so the absolute status badge stays inside the card
                <Link href={`/show/${show.id}`} key={show.id} className="block group relative">
                  <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow border border-gray-200 dark:border-gray-700 group-hover:scale-105 transition-transform duration-200 h-full flex flex-col">
                   
                    {/* STATUS BADGE - Scales text size on mobile vs desktop */}
                    <div className={`absolute top-2 right-2 text-[10px] sm:text-xs font-black px-2 py-1 rounded shadow-md z-10 text-white
                      ${show.status === 'Ongoing' ? 'bg-[#1dbf73]' : 
                        show.status === 'Upcoming' ? 'bg-blue-500' : 'bg-gray-800 dark:bg-gray-600'}`}
                    >
                      {show.status?.toUpperCase() || 'COMPLETED'}
                    </div>
                   
                    {/* POSTER - Uses aspect-[2/3] to maintain perfect movie poster ratio */}
                    {show.posterPath ? (
                      <div className="relative aspect-[2/3] w-full">
                         <img 
                            src={show.posterPath.startsWith('http') ? show.posterPath : `https://image.tmdb.org/t/p/w500${show.posterPath}`} 
                            alt={show.title} 
                            className="absolute top-0 left-0 w-full h-full object-cover" 
                          />
                      </div>
                    ) : (
                      <div className="w-full aspect-[2/3] bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs">No Image</div>
                    )}

                    {/* TEXT CONTENT - Adjusts padding and text sizes for smaller screens */}
                    <div className="p-2 sm:p-3 flex-grow flex flex-col justify-between">
                      <div>
                        <h2 className="text-sm sm:text-base font-bold mb-1 truncate text-gray-900 dark:text-white group-hover:text-[#1dbf73] transition-colors">
                          {show.title}
                        </h2>
                        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                          {show.overview}
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-3 flex items-center gap-1 text-[10px] sm:text-xs font-bold text-gray-600 dark:text-gray-300">
                        <span className="text-[#1dbf73]">★</span> {show.rating?.toFixed(1) || 'N/A'}
                      </div>
                    </div>
                    
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="lg:w-1/4 w-full mt-6 lg:mt-0">
           <Sidebar topShows={topShows} /> 
        </div> 

      </div>
    </main>
  );
}