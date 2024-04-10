import React from "react";
import "../app/globals.css";

export default function Home({ bettingProps }) {
  // check if there are betting props available by examining the 'data' field of the props
  const hasProps = bettingProps.data && bettingProps.data.length > 0;

  return (
    <div className="p-5 bg-black1 text-white">
      {hasProps ? (
        <div className="text-white">
          <div className="flex justify-center">
            {/* Title of the page */}
            <h1 className="text-4xl font-bold mb-4">FiveLegFlex</h1>
          </div>

          {/* Grid layout for displaying betting props */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bettingProps.data.map((prop, index) => (
              // Each betting prop is displayed within a card-like div
              <div key={index} className="bg-black shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-teal mb-2">{prop.player}</h2>
                <p className="italic underline">{prop.prop_type}</p>
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
      ) : (
        // display a message if there are no live NBA props
        <div className="text-center">
          <h2 className="text-l font-semibold">{bettingProps.message || "No NBA props live at this time"}</h2>
        </div>
      )}
    </div>
  );
}

// fetching props at build time in Next.js
export async function getStaticProps() {
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
