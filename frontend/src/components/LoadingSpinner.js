import Layout from "./Layout";
import { useEffect } from "react";

const LoadingSpinner = () => {
  useEffect(() => {
    // Disable scrolling when the spinner is shown
    document.body.style.overflow = "hidden";

    return () => {
      // Enable scrolling again when the spinner is hidden
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <Layout>
      <div className="flex flex-col justify-center items-center">
        <svg className="animate-spin h-12 w-12 text-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <p className="mt-4 text-white text-lg">Loading...</p>
      </div>
    </Layout>
  );
};

export default LoadingSpinner;
