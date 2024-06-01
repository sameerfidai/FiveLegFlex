import Link from "next/link";
import { useState } from "react";
import "../app/globals.css";

const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-fullblack text-white">
      <nav className="bg-fullblack bg-opacity-60 backdrop-blur-lg w-full sticky top-0 z-50 px-5 sm:px-6 lg:px-8 py-4 border-b border-black2">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href="/" className="text-xl font-bold text-white hover:text-gold transition duration-300 ease-in-out">
              FiveLegFlex
            </Link>
          </div>

          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 space-x-6">
            <Link href="/props" className="whitespace-nowrap text-base font-medium text-white hover:text-gold transition duration-300 ease-in-out">
              NBA Props
            </Link>
            <Link href="/topprojections" className="whitespace-nowrap text-base font-medium text-white hover:text-gold transition duration-300 ease-in-out">
              Projections
            </Link>
            <Link href="/about" className="whitespace-nowrap text-base font-medium text-white hover:text-gold transition duration-300 ease-in-out">
              About
            </Link>
            <a href="https://x.com/fiveLegFlex" target="_blank" rel="noopener noreferrer" className="flex items-center text-white hover:text-gold transition duration-300 ease-in-out">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.933 4.933 0 002.163-2.724 10.14 10.14 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482 13.978 13.978 0 01-10.15-5.146 4.822 4.822 0 001.523 6.574 4.886 4.886 0 01-2.23-.616c-.053 2.281 1.581 4.415 3.949 4.89a4.904 4.904 0 01-2.224.085 4.936 4.936 0 004.604 3.417A9.867 9.867 0 010 21.543a13.94 13.94 0 007.548 2.209c9.142 0 14.307-7.721 13.995-14.646a9.86 9.86 0 002.41-2.523z" />
              </svg>
            </a>
          </div>

          <button className="md:hidden flex items-center justify-center p-2 text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>

        <div className={`md:hidden absolute top-16 left-0 w-full bg-fullblack bg-opacity-90 border-t border-black2 px-5 py-4 transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "block" : "hidden"}`}>
          <ul className="flex flex-col space-y-4">
            <li>
              <Link href="/props" className="text-base font-medium text-white hover:text-gold transition duration-300 ease-in-out">
                NBA Props
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-base font-medium text-white hover:text-gold transition duration-300 ease-in-out">
                About
              </Link>
            </li>
            <li>
              <a href="https://x.com/fiveLegFlex" target="_blank" rel="noopener noreferrer" className="flex items-center text-white hover:text-gold transition duration-300 ease-in-out">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.933 4.933 0 002.163-2.724 10.14 10.14 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482 13.978 13.978 0 01-10.15-5.146 4.822 4.822 0 001.523 6.574 4.886 4.886 0 01-2.23-.616c-.053 2.281 1.581 4.415 3.949 4.89a4.904 4.904 0 01-2.224.085 4.936 4.936 0 004.604 3.417A9.867 9.867 0 010 21.543a13.94 13.94 0 007.548 2.209c9.142 0 14.307-7.721 13.995-14.646a9.86 9.86 0 002.41-2.523z" />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="flex-grow p-10 flex flex-col justify-center items-center">{children}</div>
    </div>
  );
};

export default Layout;