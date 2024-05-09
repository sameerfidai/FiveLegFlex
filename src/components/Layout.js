import Link from "next/link";
import { useState } from "react";
import "../app/globals.css";

const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-fullblack text-white">
      <nav className="bg-fullblack bg-opacity-60 backdrop-blur-lg w-full fixed top-0 z-50 px-5 sm:px-6 lg:px-8 py-4 border-b border-black2">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href="/" className="text-xl font-bold text-white hover:text-gold transition duration-300 ease-in-out">
              FiveLegFlex
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 space-x-6">
            <Link href="/props" className="whitespace-nowrap text-base font-medium text-white hover:text-gold transition duration-300 ease-in-out">
              NBA Props
            </Link>
            <Link href="/about" className="whitespace-nowrap text-base font-medium text-white hover:text-gold transition duration-300 ease-in-out">
              About
            </Link>
            <Link href="/contact" className="whitespace-nowrap text-base font-medium text-white hover:text-gold transition duration-300 ease-in-out">
              Contact Us
            </Link>
          </div>

          {/* Mobile Burger Menu Button */}
          <button className="md:hidden flex items-center justify-center p-2 text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
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
              <Link href="/contact" className="text-base font-medium text-white hover:text-gold transition duration-300 ease-in-out">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Page Content */}
      <div className="flex-grow p-10 flex flex-col justify-center items-center pt-20">{children}</div>
    </div>
  );
};

export default Layout;
