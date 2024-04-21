import React from "react";
import BettingProp from "@/components/BettingProp";
import "../app/globals.css";

export default function Home({ bettingProps }) {
  const hasProps = bettingProps && bettingProps.data && bettingProps.data.length > 0;

  return (
    <div className="min-h-screen bg-fullblack text-white p-10">
      <div className="flex justify-center mb-8">
        <h1 className="text-5xl font-bold text-white">FiveLegFlex</h1>
      </div>
      {hasProps ? (
        <>
          <div className="grid grid-cols-1 gap-6 place-items-center">
            {bettingProps.data.map((prop, index) => (
              <div className="max-w-xl w-full">
                <BettingProp key={index} prop={prop} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="text-center mt-20">
            <h2 className="text-2xl font-semibold">{bettingProps.message || "No NBA props live at this time."}</h2>
          </div>
        </>
      )}
    </div>
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
