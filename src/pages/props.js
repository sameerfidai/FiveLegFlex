import React from "react";
import BettingProp from "@/components/BettingProp";
import Layout from "@/components/Layout";
import "../app/globals.css";

export default function Home({ bettingProps }) {
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

// fetching props at build time in Next.js
export async function getStaticProps() {
  // only require fs and path inside getStaticProps to avoid including them in the client bundle
  const fs = require("fs");
  const path = require("path");

  const filePath = path.join(process.cwd(), "cachedData.json");

  let bettingProps = { data: [], message: "Initializing props..." };

  //*
  if (process.env.NODE_ENV !== "production") {
    try {
      if (fs.existsSync(filePath)) {
        const jsonData = fs.readFileSync(filePath, "utf8");
        bettingProps = JSON.parse(jsonData);
      }
    } catch (err) {
      console.error("Failed to read from the cache file:", err);
    }
  }
  //*/

  if (bettingProps.data.length === 0) {
    try {
      const res = await fetch("http://localhost:8000/api/best-props");
      if (res.ok) {
        bettingProps = await res.json();

        //*
        if (process.env.NODE_ENV !== "production") {
          fs.writeFileSync(filePath, JSON.stringify(bettingProps), "utf8");
        }
        //*/
      } else {
        bettingProps.message = "Failed to get data from backend.";
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      bettingProps.message = "Error fetching data: " + error.message;
    }
  }

  return {
    props: {
      bettingProps,
    },
    // revalidate: 10, // In seconds
  };
}
