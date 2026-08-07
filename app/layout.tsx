import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // <-- Import the new footer!

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KCollect",
  description: "The ultimate hub to collect K-Dramas, Movies, and Variety shows",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* We added flex and flex-col to the body so the footer sticks to the bottom! */}
      <body className={`${inter.className} bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-200 min-h-screen flex flex-col`}>
        <Navbar />
        {/* flex-grow pushes the footer down if the page is short */}
        <div className="flex-grow"> 
          {children}
        </div>
        <Footer /> {/* <-- Drop the footer here! */}
      </body>
    </html>
  );
}