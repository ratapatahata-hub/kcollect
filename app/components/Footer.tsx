import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Column */}
          <div className="md:col-span-2">
            <Link href="/" className="text-3xl font-black tracking-tighter text-[#1dbf73] mb-4 inline-block hover:scale-105 transition-transform duration-300">
              KCollect
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
              Your ultimate digital library for Korean entertainment. From the latest blockbuster dramas to classic movies and hilarious variety shows, we collect it all in one beautifully organized place.
            </p>
          </div>

          {/* Explore Links */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#1dbf73] rounded-full"></span> Explore
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/dramas" className="hover:text-[#1dbf73] transition-colors">Korean Dramas</Link></li>
              <li><Link href="/movies" className="hover:text-[#1dbf73] transition-colors">Movies</Link></li>
              <li><Link href="/variety" className="hover:text-[#1dbf73] transition-colors">Variety Shows</Link></li>
              <li><Link href="/ost" className="hover:text-[#1dbf73] transition-colors">Original Soundtracks</Link></li>
            </ul>
          </div>

          {/* Support / Legal Links */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#1dbf73] rounded-full"></span> Support
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/download-guide" className="hover:text-[#1dbf73] transition-colors">How to Download</Link></li>
              <li><a href="#" className="hover:text-[#1dbf73] transition-colors">Request a Show</a></li>
              <li><a href="#" className="hover:text-[#1dbf73] transition-colors">DMCA / Copyright</a></li>
              <li><a href="#" className="hover:text-[#1dbf73] transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} KCollect. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
            Made with <span className="text-[#1dbf73] text-sm animate-pulse">♥</span> for K-Drama fans everywhere
          </div>
        </div>
      </div>
    </footer>
  );
}