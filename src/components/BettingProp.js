import React from "react";

const BettingProp = ({ prop }) => {
  return (
    <div className="bg-black2 shadow-xl rounded-xl p-5 flex flex-col justify-between h-full hover:bg-fullblack hover:scale-105 hover:shadow-2xl transition-transform duration-300 ease-in-out">
      <div className="space-y-4">
        <img className="w-32 h-32 rounded-full mx-auto border border-white" src={prop.img_url} alt={prop.player} />
        <div>
          <h2 className="text-xl font-semibold text-teal text-center">{prop.player}</h2>
          <p className="text-white text-center">
            <span className="text-gold">{prop.prop_type}</span> - {prop.home_team} vs {prop.away_team}
          </p>
          <p className="text-xl text-center">
            Line: <span className="font-bold text-gold italic underline">{prop.line}</span>
          </p>
        </div>
      </div>
      <div className="pt-4">
        <div className="flex justify-between items-center mb-4">
          <div className={`flex-1 mr-2 p-2 rounded-lg text-center font-bold ${prop.bestBet === "over" ? "bg-green bg-opacity-50" : "bg-red bg-opacity-50"}`}>
            Best Bet: {prop.bestBet} ({prop.bestBetOdds})
          </div>
          <div className={`flex-1 ml-2 p-2 rounded-lg text-center font-bold ${prop.bestBetProbability >= 0.6 ? "bg-green bg-opacity-50" : prop.bestBetProbability >= 0.55 ? "bg-lightgreen bg-opacity-50" : "bg-gold bg-opacity-50"}`}>Probability: {(prop.bestBetProbability * 100).toFixed(2)}%</div>
        </div>
        <p className="bg-black p-2 rounded-lg text-center font-bold text-white">Book: {prop.bestBook || "N/A"}</p>
      </div>
    </div>
  );
};

export default BettingProp;
