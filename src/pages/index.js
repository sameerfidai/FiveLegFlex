import React from "react";
import "../app/globals.css";
/*
import fs from "fs";
import path from "path";
*/

export default function Home({ bettingProps }) {
  const hasProps = bettingProps && bettingProps.data && bettingProps.data.length > 0;

  return (
    <div className="min-h-screen bg-black2 text-white p-5">
      {hasProps ? (
        <>
          <div className="flex justify-center mb-8">
            <h1 className="text-5xl font-bold text-teal">FiveLegFlex</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bettingProps.data.map((prop, index) => (
              <div key={index} className="bg-black shadow-xl rounded-xl p-6 flex flex-col justify-between h-full">
                <div>
                  <h2 className="text-2xl font-semibold text-teal mb-2">{prop.player}</h2>
                  <p className="text-gold mb-1">
                    {prop.prop_type} - {prop.home_team} vs {prop.away_team}
                  </p>
                  <p className="mb-4">
                    Line: <span className="font-bold">{prop.line}</span>
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className={`flex-1 mr-2 p-2 rounded-lg text-center font-bold ${prop.bestBet === "over" ? "bg-green bg-opacity-50" : "bg-red bg-opacity-50"}`}>
                      Best Bet: {prop.bestBet} ({prop.bestBetOdds})
                    </div>
                    <div className={`flex-1 ml-2 p-2 rounded-lg text-center font-bold ${prop.bestBetProbability >= 0.6 ? "bg-green-600 bg-opacity-50" : prop.bestBetProbability >= 0.55 ? "bg-lightgreen bg-opacity-50" : "bg-gold bg-opacity-50"}`}>
                      Probability: {(prop.bestBetProbability * 100).toFixed(2)}%
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="bg-black2 flex-1 p-2 rounded-lg text-center font-bold">
                      Book: <span className="text-white">{prop.bestBook || "N/A"}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center mt-20">
          <h2 className="text-2xl font-semibold">{bettingProps.message || "No NBA props live at this time."}</h2>
        </div>
      )}
    </div>
  );
}

// fetching props at build time in Next.js
export async function getStaticProps() {
  /* Uncomment below if caching to a file is desired
  const filePath = path.join(process.cwd(), "cachedData.json");

  if (process.env.NODE_ENV !== "production") {
    try {
      if (fs.existsSync(filePath)) {
        const jsonData = fs.readFileSync(filePath, "utf8");
        return {
          props: {
            bettingProps: JSON.parse(jsonData),
          },
        };
      }
    } catch (err) {
      console.error("Failed to read from the cache file:", err);
    }
  }
  */

  // Initialize default props with a message
  let bettingProps = { data: [], message: "Initializing props..." };
  try {
    // Fetching data from the backend API
    const res = await fetch("http://localhost:8000/api/best-props");
    if (res.ok) {
      // If the response is OK, parse it as JSON
      bettingProps = await res.json();
    } else {
      console.error("Backend response was not ok.");
      bettingProps.message = "Failed to get data from backend.";
    }

    /* Uncomment below if caching to a file is desired
    if (process.env.NODE_ENV !== "production") {
      try {
        fs.writeFileSync(filePath, JSON.stringify(bettingProps), "utf8");
      } catch (err) {
        console.error("Failed to write to the cache file:", err);
      }
    }
    */
  } catch (error) {
    console.error("Error fetching data:", error);
    bettingProps.message = "Error fetching data.";
  }

  // Return the props to the component
  return {
    props: {
      bettingProps,
    },
  };
}
