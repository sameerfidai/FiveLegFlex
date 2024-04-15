import React from "react";

const BettingProp = ({ prop }) => {
  return (
    <div className="bg-fullblack border-2 border-white shadow-xl rounded-xl p-5 flex flex-col justify-between h-full hover:bg-black2 hover:scale-105 hover:shadow-2xl transition-transform duration-300 ease-in-out hover:cursor-pointer">
      <div className="">
        <img className="w-32 h-32 rounded-full mx-auto border border-white" src={prop.img_url} alt={prop.player} />
        <div className="mt-2 mb-2">
          <h2 className="text-3xl font-semibold text-white text-center">{prop.player}</h2>
          <p className="text-teal text-center">
            {prop.home_team} vs {prop.away_team}
          </p>
          <p className="text-xl text-center">
            <span className="text-gold text-xl">{prop.prop_type.toUpperCase()}: </span>
            <span className="font-bold text-xl text-gold">{prop.line}</span>
          </p>
        </div>
      </div>
      <div className="">
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
