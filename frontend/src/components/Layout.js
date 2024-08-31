import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import "../app/globals.css";

const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sportsDropdownOpen, setSportsDropdownOpen] = useState(false);
  const [soccerDropdownOpen, setSoccerDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSportsDropdownToggle = () => {
    setSportsDropdownOpen(!sportsDropdownOpen);
    setSoccerDropdownOpen(false);
  };

  const handleSoccerDropdownToggle = (e) => {
    e.stopPropagation();
    setSoccerDropdownOpen(!soccerDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setSportsDropdownOpen(false);
      setSoccerDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white text-fullblack dark:bg-fullblack dark:text-white overflow-x-hidden">
      <nav className="bg-white border-b border-lightgray dark:bg-fullblack bg-opacity-60 backdrop-blur-lg w-full sticky top-0 z-50 py-4 dark:border-b dark:border-black2">
        <div className="flex justify-between items-center px-4 md:px-10 w-full">
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
                onClick={handleSportsDropdownToggle}
                className="whitespace-nowrap text-base font-bold text-fullblack dark:text-white hover:text-gold dark:hover:text-gold transition duration-300 ease-in-out flex items-center"
              >
                Sports
                <svg
                  className={`w-4 h-4 ml-1 transition-transform duration-300 ease-in-out ${
                    sportsDropdownOpen ? "transform rotate-180" : ""
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
              {sportsDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-fullblack bg-opacity-95 border border-black2 dark:border-black2 rounded-md shadow-lg py-1 z-20">
                  <Link
                    href="/props/nba"
                    className="block px-4 py-2 text-base font-medium text-fullblack dark:text-white hover:text-gold dark:hover:text-gold hover:bg-offwhite dark:hover:bg-black transition duration-300 ease-in-out"
                  >
                    NBA
                  </Link>
                  <Link
                    href="/props/cfb"
                    className="block px-4 py-2 text-base font-medium text-fullblack dark:text-white hover:text-gold dark:hover:text-gold hover:bg-offwhite dark:hover:bg-black transition duration-300 ease-in-out"
                  >
                    CFB
                  </Link>
                  <Link
                    href="/props/mlb"
                    className="block px-4 py-2 text-base font-medium text-fullblack dark:text-white hover:text-gold dark:hover:text-gold hover:bg-offwhite dark:hover:bg-black transition duration-300 ease-in-out"
                  >
                    MLB
                  </Link>
                  <Link
                    href="/props/wnba"
                    className="block px-4 py-2 text-base font-medium text-fullblack dark:text-white hover:text-gold dark:hover:text-gold hover:bg-offwhite dark:hover:bg-black transition duration-300 ease-in-out"
                  >
                    WNBA
                  </Link>
                  <div className="relative group">
                    <button
                      onClick={handleSoccerDropdownToggle}
                      className="flex justify-between items-center w-full px-4 py-2 text-base font-medium text-fullblack dark:text-white hover:text-gold dark:hover:text-gold hover:bg-offwhite dark:hover:bg-black transition duration-300 ease-in-out"
                    >
                      Soccer
                      <svg
                        className={`w-4 h-4 ml-1 transition-transform duration-300 ease-in-out ${
                          soccerDropdownOpen ? "transform rotate-180" : ""
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
                          d="M9 5l7 7-7 7"
                        ></path>
                      </svg>
                    </button>
                    {soccerDropdownOpen && (
                      <div className="absolute left-0 top-0 mt-0 -ml-48 w-48 bg-white dark:bg-fullblack bg-opacity-95 border border-black2 dark:border-black2 rounded-md shadow-lg py-1 z-30">
                        <Link
                          href="/props/mls"
                          className="block px-4 py-2 text-base font-medium text-fullblack dark:text-white hover:text-gold dark:hover:text-gold hover:bg-offwhite dark:hover:bg-black transition duration-300 ease-in-out"
                        >
                          MLS
                        </Link>
                        <Link
                          href="/props/epl"
                          className="block px-4 py-2 text-base font-medium text-fullblack dark:text-white hover:text-gold dark:hover:text-gold hover:bg-offwhite dark:hover:bg-black transition duration-300 ease-in-out"
                        >
                          EPL
                        </Link>
                        <Link
                          href="/props/laliga"
                          className="block px-4 py-2 text-base font-medium text-fullblack dark:text-white hover:text-gold dark:hover:text-gold hover:bg-offwhite dark:hover:bg-black transition duration-300 ease-in-out"
                        >
                          La Liga
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <Link
              href="/about"
              className="whitespace-nowrap text-base font-bold text-fullblack dark:text-white hover:text-gold dark:hover:text-gold transition duration-300 ease-in-out"
            >
              About
            </Link>
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

        {/* Mobile menu */}
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
              <span className="text-base font-medium text-fullblack dark:text-white">
                Soccer
              </span>
              <ul className="ml-4 mt-2 space-y-2">
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
              </ul>
            </li>
            <li>
              <Link
                href="/about"
                className="text-base font-medium text-fullblack dark:text-white hover:text-gold dark:hover:text-gold transition duration-300 ease-in-out"
              >
                About
              </Link>
            </li>
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
