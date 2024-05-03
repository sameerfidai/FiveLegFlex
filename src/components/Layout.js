import Link from "next/link";
import "../app/globals.css";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-fullblack text-white">
      <nav className="bg-fullblack bg-opacity-70 backdrop-blur-sm w-full fixed top-0 z-50 px-5 sm:px-6 lg:px-8 py-4 border-b border-black2">
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
            <Link href="/about" className="whitespace-nowrap text-base font-medium text-white hover:text-gold transition duration-300 ease-in-out">
              About
            </Link>
            <Link href="/contact" className="whitespace-nowrap text-base font-medium text-white hover:text-gold transition duration-300 ease-in-out">
              Contact Us
            </Link>
          </div>
        </div>
      </nav>
      <div className="flex-grow p-10 flex flex-col justify-center items-center pt-20">{children}</div>
    </div>
  );
};

export default Layout;
