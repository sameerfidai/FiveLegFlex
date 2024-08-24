"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import "../app/globals.css";

const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white text-fullblack dark:bg-fullblack dark:text-white">
      <nav className="bg-white border-b border-lightgray dark:bg-fullblack bg-opacity-60 backdrop-blur-lg w-full sticky top-0 z-50 py-4 dark:border-b dark:border-black2">
        <div className="flex justify-between items-center px-10 w-full">
          <div className="flex justify-start">
            <Link
              href="/"
              className="text-xl font-bold text-fullblack dark:text-white hover:text-gold dark:hover:text-gold transition duration-300 ease-in-out"
            >
              FiveLegFlex
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleDropdownToggle}
                className="whitespace-nowrap text-base font-bold text-fullblack dark:text-white hover:text-gold dark:hover:text-gold transition duration-300 ease-in-out flex items-center"
              >
                Sports
                <svg
                  className={`w-4 h-4 ml-1 transition-transform duration-300 ease-in-out ${
                    dropdownOpen ? "transform rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-fullblack bg-opacity-95 border border-black2 dark:border-black2 rounded-md shadow-lg py-1 z-20">
                  <Link
                    href="/props/nba"
                    className="block px-4 py-2 text-base font-medium text-fullblack dark:text-white hover:text-gold dark:hover:text-gold hover:bg-offwhite dark:hover:bg-black transition duration-300 ease-in-out rounded-t-md"
                  >
                    NBA
                  </Link>
                  <Link
                    href="/props/cfb"
                    className="block px-4 py-2 text-base font-medium text-fullblack dark:text-white hover:text-gold dark:hover:text-gold hover:bg-offwhite dark:hover:bg-black transition duration-300 ease-in-out rounded-t-md"
                  >
                    CFB
                  </Link>
                  <Link
                    href="/props/mlb"
                    className="block px-4 py-2 text-base font-medium text-fullblack dark:text-white hover:text-gold dark:hover:text-gold hover:bg-offwhite dark:hover:bg-black transition duration-300 ease-in-out rounded-t-md"
                  >
                    MLB
                  </Link>
                  <Link
                    href="/props/wnba"
                    className="block px-4 py-2 text-base font-medium text-fullblack dark:text-white hover:text-gold dark:hover:text-gold hover:bg-offwhite dark:hover:bg-black transition duration-300 ease-in-out rounded-t-md"
                  >
                    WNBA
                  </Link>
                  <Link
                    href="/props/mls"
                    className="block px-4 py-2 text-base font-medium text-fullblack dark:text-white hover:text-gold dark:hover:text-gold hover:bg-offwhite dark:hover:bg-black transition duration-300 ease-in-out rounded-b-md"
                  >
                    MLS
                  </Link>
                  <Link
                    href="/props/epl"
                    className="block px-4 py-2 text-base font-medium text-fullblack dark:text-white hover:text-gold dark:hover:text-gold hover:bg-offwhite dark:hover:bg-black transition duration-300 ease-in-out rounded-b-md"
                  >
                    EPL
                  </Link>
                  <Link
                    href="/props/laliga"
                    className="block px-4 py-2 text-base font-medium text-fullblack dark:text-white hover:text-gold dark:hover:text-gold hover:bg-offwhite dark:hover:bg-black transition duration-300 ease-in-out rounded-b-md"
                  >
                    La Liga
                  </Link>
                  {/* <Link href="/props/euros" className="block px-4 py-2 text-base font-medium text-fullblack dark:text-white hover:text-gold dark:hover:text-gold hover:bg-offwhite dark:hover:bg-black transition duration-300 ease-in-out rounded-b-md">
                    Euros 2024
                  </Link> */}
                </div>
              )}
            </div>
            <Link
              href="/about"
              className="whitespace-nowrap text-base font-bold text-fullblack dark:text-white hover:text-gold dark:hover:text-gold transition duration-300 ease-in-out"
            >
              About
            </Link>
            {/* Twitter Icon */}
            {/* <a href="https://x.com/fiveLegFlex" target="_blank" rel="noopener noreferrer" className="flex items-center text-fullblack dark:text-white hover:text-gold dark:hover:text-gold transition duration-300 ease-in-out">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.933 4.933 0 002.163-2.724 10.14 10.14 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482 13.978 13.978 0 01-10.15-5.146 4.822 4.822 0 001.523 6.574 4.886 4.886 0 01-2.23-.616c-.053 2.281 1.581 4.415 3.949 4.89a4.904 4.904 0 01-2.224.085 4.936 4.936 0 004.604 3.417A9.867 9.867 0 010 21.543a13.94 13.94 0 007.548 2.209c9.142 0 14.307-7.721 13.995-14.646a9.86 9.86 0 002.41-2.523z" />
              </svg>
            </a> */}
          </div>

          <button
            className="md:hidden flex items-center justify-center p-2 text-fullblack dark:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>

        <div
          className={`md:hidden absolute top-16 left-0 w-full bg-white dark:bg-fullblack bg-opacity-90 border-t border-black2 dark:border-black2 px-5 py-4 transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "block" : "hidden"
          }`}
        >
          <ul className="flex flex-col space-y-4">
            <li>
              <Link
                href="/props/nba"
                className="text-base font-medium text-fullblack dark:text-white hover:text-gold dark:hover:text-gold transition duration-300 ease-in-out"
              >
                NBA
              </Link>
            </li>
            <li>
              <Link
                href="/props/cfb"
                className="text-base font-medium text-fullblack dark:text-white hover:text-gold dark:hover:text-gold transition duration-300 ease-in-out"
              >
                CFB
              </Link>
            </li>
            <li>
              <Link
                href="/props/mlb"
                className="text-base font-medium text-fullblack dark:text-white hover:text-gold dark:hover:text-gold transition duration-300 ease-in-out"
              >
                MLB
              </Link>
            </li>
            <li>
              <Link
                href="/props/wnba"
                className="text-base font-medium text-fullblack dark:text-white hover:text-gold dark:hover:text-gold transition duration-300 ease-in-out"
              >
                WNBA
              </Link>
            </li>
            <li>
              <Link
                href="/props/mls"
                className="text-base font-medium text-fullblack dark:text-white hover:text-gold dark:hover:text-gold transition duration-300 ease-in-out"
              >
                MLS
              </Link>
            </li>
            <li>
              <Link
                href="/props/epl"
                className="text-base font-medium text-fullblack dark:text-white hover:text-gold dark:hover:text-gold transition duration-300 ease-in-out"
              >
                EPL
              </Link>
            </li>
            <li>
              <Link
                href="/props/laliga"
                className="text-base font-medium text-fullblack dark:text-white hover:text-gold dark:hover:text-gold transition duration-300 ease-in-out"
              >
                La Liga
              </Link>
            </li>
            {/* <li>
              <Link href="/props/euros" className="text-base font-medium text-fullblack dark:text-white hover:text-gold dark:hover:text-gold transition duration-300 ease-in-out">
                Euros 2024
              </Link>
            </li> */}
            <li>
              <Link
                href="/about"
                className="text-base font-medium text-fullblack dark:text-white hover:text-gold dark:hover:text-gold transition duration-300 ease-in-out"
              >
                About
              </Link>
            </li>
            {/* Twitter Icon */}
            {/* <li>
              <a href="https://x.com/fiveLegFlex" target="_blank" rel="noopener noreferrer" className="flex items-center text-fullblack dark:text-white hover:text-gold dark:hover:text-gold transition duration-300 ease-in-out">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.933 4.933 0 002.163-2.724 10.14 10.14 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482 13.978 13.978 0 01-10.15-5.146 4.822 4.822 0 001.523 6.574 4.886 4.886 0 01-2.23-.616c-.053 2.281 1.581 4.415 3.949 4.89a4.904 4.904 0 01-2.224.085 4.936 4.936 0 004.604 3.417A9.867 9.867 0 010 21.543a13.94 13.94 0 007.548 2.209c9.142 0 14.307-7.721 13.995-14.646a9.86 9.86 0 002.41-2.523z" />
              </svg>
            </a> */}
          </ul>
        </div>
      </nav>

      <div className="flex-grow flex p-6 justify-center items-center bg-offwhite dark:bg-fullblack text-fullblack dark:text-white">
        {children}
      </div>

      <footer className="bg-offwhite dark:bg-fullblack text-fullblack dark:text-white py-4 mt-auto">
        <div className="">
          <div className="flex justify-center items-center">
            <p className="text-sm font-medium text-fullblack dark:text-white">
              &copy; 2024 FiveLegFlex. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
