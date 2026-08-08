'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState({ shows: [], actors: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  
  const searchRef = useRef<HTMLElement>(null);
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

  // Moved the ref to the root <nav> element so clicking outside the entire navbar closes search
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
      setIsOpen(false); // Close mobile menu on search
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
    setSearchQuery('');
  };

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'DRAMAS', path: '/dramas' },
    { name: 'MOVIES', path: '/movies' },
    { name: 'OST', path: '/ost' },
    { name: 'VARIETY', path: '/variety' },
    { name: 'HOW TO DOWNLOAD', path: '/download-guide' },
  ];

  // Extracted the results dropdown so it can be reused in both Desktop and Mobile views
  const SearchResultsDropdown = () => (
    (results.shows.length > 0 || results.actors.length > 0) && searchQuery.length >= 2 ? (
      <div className="absolute top-full mt-2 left-0 md:left-auto md:right-0 w-full md:w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
        {results.shows.length > 0 && (
          <div>
            <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-xs font-black tracking-wider text-[#1dbf73]">DRAMAS & MOVIES</div>
            {results.shows.map((show: any) => (
              <Link href={`/show/${show.id}`} key={show.id} onClick={closeMenu} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0">
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
              <Link href={`/actor/${actor.id}`} key={actor.id} onClick={closeMenu} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0">
                {actor.profilePath ? <img src={`https://image.tmdb.org/t/p/w92${actor.profilePath}`} className="w-10 h-10 object-cover rounded-full shadow-sm" alt={actor.name} /> : <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full shadow-sm"></div>}
                <div className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{actor.name}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    ) : null
  );

  return (
    <nav ref={searchRef} className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <div className="flex-shrink-0 flex items-center">
            {/* LOGO REBRANDED TO KCOLLECT */}
            <Link href="/" onClick={closeMenu} className="text-2xl font-black tracking-tighter text-[#1dbf73]">
              KCollect
            </Link>
          </div>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.path} className="text-sm font-bold text-gray-600 hover:text-[#1dbf73] dark:text-gray-300 dark:hover:text-[#1dbf73] transition-colors">
                {link.name}
              </Link>
            ))}
          </div>

          {/* DESKTOP SEARCH, THEME, AND MOBILE BURGER */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* DESKTOP SEARCH */}
            <div className="relative hidden md:block">
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
              
              <SearchResultsDropdown />
            </div>

            {/* THEME TOGGLE (Visible on Desktop & Mobile) */}
            <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700">
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            {/* MOBILE HAMBURGER BUTTON */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-[#1dbf73] focus:outline-none"
            >
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

          </div>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 absolute w-full left-0 shadow-xl">
          <div className="px-4 pt-4 pb-6 space-y-4">
            
            {/* MOBILE SEARCH */}
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFullSearch()}
                placeholder="Search dramas, movies, actors..." 
                className="w-full pl-4 pr-10 py-2.5 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#1dbf73] transition-colors"
              />
              <button onClick={handleFullSearch} className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400 hover:text-[#1dbf73]">
                {isSearching ? '⏳' : '🔍'}
              </button>
              
              <SearchResultsDropdown />
            </div>

            {/* MOBILE LINKS */}
            <div className="flex flex-col space-y-2 mt-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.path} 
                  onClick={closeMenu} 
                  className="block px-3 py-2 rounded-md text-base font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#1dbf73] dark:hover:text-[#1dbf73]"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
          </div>
        </div>
      )}
    </nav>
  );
}