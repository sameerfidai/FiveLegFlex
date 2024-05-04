import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import NProgress from "nprogress";
import BettingProp from "@/components/BettingProp";
import "nprogress/nprogress.css";

// Initial props are fetched at build time and passed to the Home component
export default function Home({ initialBettingProps }) {
  const [bettingProps, setBettingProps] = useState(initialBettingProps);

  useEffect(() => {
    const fetchProps = async () => {
      NProgress.start(); // Start the progress bar when the fetch begins
      try {
        const res = await fetch("http://localhost:8000/api/best-props");
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setBettingProps(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setBettingProps((prevProps) => ({ ...prevProps, message: error.toString() }));
      }
      NProgress.done(); // Stop the progress bar regardless of fetch success or failure
    };

    // Optionally, set an interval or trigger based on user actions
    // const fetchInterval = setInterval(fetchProps, 10000); // For example, fetch every 10 seconds

    // Uncomment to enable periodic fetching
    // return () => clearInterval(fetchInterval); // Clean up the interval on component unmount
  }, []);

  const hasProps = bettingProps && bettingProps.data && bettingProps.data.length > 0;

  return (
    <Layout>
      <div className="bg-fullblack text-white p-4 md:p-6 lg:p-8">
        {hasProps ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 place-items-stretch">
            {bettingProps.data.map((prop, index) => (
              <BettingProp key={index} prop={prop} />
            ))}
          </div>
        ) : (
          <div className="text-center mt-20">
            <h2 className="text-2xl font-semibold">{bettingProps.message || "No NBA props live at this time."}</h2>
          </div>
        )}
      </div>
    </Layout>
  );
}

// Fetch initial props using getStaticProps
export async function getStaticProps() {
  // Simulate fetching data as you would in your existing getStaticProps
  const props = await fetchInitialProps(); // This should contain the logic to fetch data similar to your previous getStaticProps
  return {
    props: {
      initialBettingProps: props,
    },
    // revalidate: 10,
  };
}

// Placeholder function to simulate fetching data for initial props
async function fetchInitialProps() {
  try {
    const res = await fetch("http://localhost:8000/api/best-props");
    if (!res.ok) throw new Error("Failed to load the initial props.");
    return await res.json();
  } catch (error) {
    return { data: [], message: "Error loading initial props: " + error.message };
  }
}
