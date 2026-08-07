'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Sidebar({ topShows }: { topShows: any[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Weekly');
  const [genre, setGenre] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [orderBy, setOrderBy] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (genre) params.append('genre', genre);
    if (type) params.append('type', type);
    if (orderBy) params.append('orderBy', orderBy);
    router.push(`/search?${params.toString()}`);
  };

  let displayShows = topShows.slice(0, 10);
  if (activeTab === 'Monthly') displayShows = topShows.slice(10, 20);
  if (activeTab === 'All') displayShows = topShows.slice(20, 30);
  if (displayShows.length === 0) displayShows = topShows.slice(0, 10);

  return (
    <div className="space-y-6">
      
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <select value={genre} onChange={(e) => setGenre(e.target.value)} className="w-full p-2 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#1dbf73]">
            <option value="">Genre All</option>
            <option value="Action">Action & Adventure</option>
            <option value="Comedy">Comedy</option>
            <option value="Romance">Romance</option>
            <option value="Mystery">Mystery</option>
            <option value="Thriller">Thriller</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#1dbf73]">
            <option value="">Status All</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-2 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#1dbf73]">
            <option value="">Type All</option>
            <option value="Drama">Drama</option>
            <option value="Movie">Movie</option>
            <option value="Variety">Variety</option>
          </select>
          <select value={orderBy} onChange={(e) => setOrderBy(e.target.value)} className="w-full p-2 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#1dbf73]">
            <option value="">Order by Default</option>
            <option value="Latest">Latest Added</option>
            <option value="Top Rated">Top Rated</option>
          </select>
        </div>
        
        <button onClick={handleSearch} className="w-full bg-[#1dbf73] hover:bg-[#18a060] text-white font-bold py-2 rounded text-sm flex items-center justify-center gap-2 transition-colors">
          🔍 Search
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="flex text-sm text-center font-bold cursor-pointer select-none">
          <div onClick={() => setActiveTab('Weekly')} className={`flex-1 py-3 transition-colors ${activeTab === 'Weekly' ? 'bg-[#1dbf73] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>Weekly</div>
          <div onClick={() => setActiveTab('Monthly')} className={`flex-1 py-3 transition-colors border-l border-r border-gray-200 dark:border-gray-600 ${activeTab === 'Monthly' ? 'bg-[#1dbf73] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>Monthly</div>
          <div onClick={() => setActiveTab('All')} className={`flex-1 py-3 transition-colors ${activeTab === 'All' ? 'bg-[#1dbf73] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>All</div>
        </div>
        
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {displayShows.map((show, index) => (
            <Link href={`/show/${show.id}`} key={show.id} className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
              <div className="w-8 h-8 flex items-center justify-center font-bold text-[#1dbf73] text-lg border border-[#1dbf73] mr-4 rounded-sm flex-shrink-0">
                {index + 1}
              </div>
              <img src={show.posterPath.startsWith('http') ? show.posterPath : `https://image.tmdb.org/t/p/w92${show.posterPath}`} alt={show.title} className="w-12 h-16 object-cover rounded mr-4 shadow-sm flex-shrink-0" />
              <div className="flex-1 overflow-hidden">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-[#1dbf73] truncate">{show.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">Genres: {show.categories || 'N/A'}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300 font-bold mt-1"><span className="text-[#1dbf73]">★</span> {show.rating?.toFixed(1) || 'N/A'}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}