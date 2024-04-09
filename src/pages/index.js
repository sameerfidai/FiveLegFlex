import React from "react";
import "../app/globals.css";
//import fs from "fs";
//import path from "path";

export default function Home({ bettingProps }) {
  return (
    <div className="p-8 bg-black2 text-white">
      <div className="flex justify-center">
        <h1 className="text-3xl font-bold mb-6 text-teal">NBA Betting Props</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bettingProps.map((prop, index) => (
          <div key={index} className="bg-black shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-teal mb-2">{prop.player}</h2>
            <p className="">{prop.prop_type}</p>
            <p className="mb-4">
              {prop.home_team} vs {prop.away_team}
            </p>
            <div className="mt-4 mb-4">
              <p className="text-xl">
                Line: <span className="text-2xl font-bold text-gold">{prop.line}</span>
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className={`flex-1 mr-2 p-2 rounded-lg ${prop.bestBet === "over" ? "bg-green text-black" : "bg-red text-white"}`}>
                <p className="font-bold">
                  Best Bet: {prop.bestBet} ({prop.bestBetOdds})
                </p>
              </div>

              <div className={`flex-1 ml-2 p-2 rounded-lg ${prop.bestBetProbability >= 0.6 ? "bg-green" : prop.bestBetProbability >= 0.55 ? "bg-lightgreen" : "bg-gold"} text-black`}>
                <p className="font-bold">Probability: {(prop.bestBetProbability * 100).toFixed(2)}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  /*
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

  let bettingProps = [];
  try {
    const res = await fetch("http://localhost:8000/api/best-props");
    bettingProps = await res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  /*
  if (process.env.NODE_ENV !== "production") {
    try {
      fs.writeFileSync(filePath, JSON.stringify(bettingProps), "utf8");
    } catch (err) {
      console.error("Failed to write to the cache file:", err);
    }
  }
  */

  return {
    props: {
      bettingProps,
    },
    // revalidate: 60, // Revalidate at most once per minute
  };
}
