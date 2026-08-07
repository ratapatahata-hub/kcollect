import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function ActorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Find the actor and include EVERY show they are connected to
  const actor = await prisma.actor.findUnique({
    where: { id: Number(id) },
    include: { shows: true }
  });

  if (!actor) notFound();

  return (
    <main className="min-h-screen bg-gray-900 text-white p-10">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-[#1dbf73] hover:text-blue-300 mb-8 inline-block">&larr; Back to Home</Link>
        
        <div className="flex items-center gap-6 mb-12 bg-gray-800 p-6 rounded-xl border border-gray-700">
          {actor.profilePath ? (
            <img src={`https://image.tmdb.org/t/p/w200${actor.profilePath}`} className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-gray-600"/>
          ) : <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center">No Photo</div>}
          <div>
            <h1 className="text-4xl font-bold">{actor.name}</h1>
            <p className="text-gray-400 mt-2">Actor Portfolio</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">Filmography ({actor.shows.length})</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {actor.shows.map((show) => (
            <Link href={`/show/${show.id}`} key={show.id} className="block group">
              <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 group-hover:scale-105 transition-transform duration-200 h-full">
                {show.posterPath ? (
                  <img src={`https://image.tmdb.org/t/p/w500${show.posterPath}`} className="w-full h-auto object-cover" />
                ) : <div className="w-full h-64 bg-gray-700"></div>}
                <div className="p-4">
                  <h3 className="font-bold text-gray-200 group-hover:text-[#1dbf73] truncate">{show.title}</h3>
                  <p className="text-xs text-blue-300 mt-1">{show.type}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}