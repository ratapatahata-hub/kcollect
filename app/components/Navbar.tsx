'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState({ shows: [], actors: [] });
  const [isSearching, setIsSearching] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  useEffect(() => {
    const fetchResults = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        const res = await fetch(`/api/search?q=${searchQuery}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
        setIsSearching(false);
      } else {
        setResults({ shows: [], actors: [] });
      }
    }, 300);
    return () => clearTimeout(fetchResults);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchQuery(''); 
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFullSearch = () => {
    if (searchQuery.trim().length > 0) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(''); 
    }
  };

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'DRAMAS', path: '/dramas' },
    { name: 'MOVIES', path: '/movies' },
    { name: 'OST', path: '/ost' },
    { name: 'VARIETY', path: '/variety' },
    { name: 'HOW TO DOWNLOAD', path: '/download-guide' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <div className="flex-shrink-0 flex items-center">
            {/* LOGO REBRANDED TO KCOLLECT */}
            <Link href="/" className="text-2xl font-black tracking-tighter text-[#1dbf73]">
              KCollect
            </Link>
          </div>

          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.path} className="text-sm font-bold text-gray-600 hover:text-[#1dbf73] dark:text-gray-300 dark:hover:text-[#1dbf73] transition-colors">
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block" ref={searchRef}>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFullSearch()}
                placeholder="Search..." 
                className="w-56 pl-4 pr-10 py-1.5 rounded-full text-sm border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#1dbf73] transition-colors"
              />
              <button onClick={handleFullSearch} className="absolute right-3 top-1.5 text-gray-500 dark:text-gray-400 hover:text-[#1dbf73] transition-colors">
                {isSearching ? '⏳' : '🔍'}
              </button>

              {(results.shows.length > 0 || results.actors.length > 0) && searchQuery.length >= 2 && (
                <div className="absolute top-full mt-2 right-0 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
                  {results.shows.length > 0 && (
                    <div>
                      <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-xs font-black tracking-wider text-[#1dbf73]">DRAMAS & MOVIES</div>
                      {results.shows.map((show: any) => (
                        <Link href={`/show/${show.id}`} key={show.id} onClick={() => setSearchQuery('')} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0">
                          {show.posterPath ? <img src={`https://image.tmdb.org/t/p/w92${show.posterPath}`} className="w-10 h-14 object-cover rounded shadow-sm" alt={show.title} /> : <div className="w-10 h-14 bg-gray-200 dark:bg-gray-600 rounded shadow-sm"></div>}
                          <div>
                            <div className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{show.title}</div>
                            <div className="text-xs text-[#1dbf73] font-medium">{show.type}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  {results.actors.length > 0 && (
                    <div>
                      <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-xs font-black tracking-wider text-[#1dbf73]">CAST & ENTERTAINERS</div>
                      {results.actors.map((actor: any) => (
                        <Link href={`/actor/${actor.id}`} key={actor.id} onClick={() => setSearchQuery('')} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0">
                          {actor.profilePath ? <img src={`https://image.tmdb.org/t/p/w92${actor.profilePath}`} className="w-10 h-10 object-cover rounded-full shadow-sm" alt={actor.name} /> : <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full shadow-sm"></div>}
                          <div className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{actor.name}</div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700">
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}