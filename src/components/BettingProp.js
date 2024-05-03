import React, { useState } from "react";

const BettingProp = ({ prop }) => {
  const [isSelected, setIsSelected] = useState(false);

  const bookLogos = {
    draftkings: "/draftkings.png",
    fanduel: "/fanduel.png",
    williamhill_us: "/williamhill.png",
    bovada: "/bovada.png",
    pointsbetus: "/pointsbet.png",
    betonlineag: "/betonlineag.png",
    betmgm: "/betmgm.png",
  };

  const bookNames = {
    draftkings: "DraftKings",
    fanduel: "Fanduel",
    williamhill_us: "William Hill US",
    bovada: "Bovada",
    pointsbetus: "PointsBet",
    betonlineag: "BetOnline",
    betmgm: "BetMGM",
  };

  const toggleSelection = () => {
    setIsSelected(!isSelected);
  };

  return (
    <div className={`bg-fullblack border-2 ${isSelected ? "border-green bg-black2 shadow-2xl" : "border-white bg-fullblack shadow-xl"} rounded-xl p-5 flex flex-col justify-between h-full hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer`} onClick={toggleSelection}>
      <div>
        <img className="w-32 h-32 rounded-full mx-auto border border-white" src={prop.img_url} alt={`Image of ${prop.player}`} />
        <div className="mt-2 mb-2">
          <h2 className={`text-3xl font-semibold ${isSelected ? "text-green" : "text-white"} text-center`}>{prop.player}</h2>
          <p className="text-teal text-center">
            {prop.home_team} vs {prop.away_team}
          </p>
          <p className="text-xl text-center">
            <span className="text-gold">{prop.prop_type.toUpperCase()}: </span>
            <span className="font-bold text-gold">{prop.line}</span>
          </p>
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className={`flex-1 mr-2 p-2 rounded-lg text-center font-bold ${prop.bestBet === "over" ? "bg-green bg-opacity-70" : "bg-red bg-opacity-70"}`}>
            Bet: {prop.bestBet.toUpperCase()} ({prop.bestBetOdds})
          </div>
          <div className={`flex-1 ml-2 p-2 rounded-lg text-center font-bold ${prop.bestBetProbability >= 0.6 ? "bg-green bg-opacity-70" : prop.bestBetProbability >= 0.55 ? "bg-lightgreen bg-opacity-70" : "bg-gold bg-opacity-70"}`}>Probability: {(prop.bestBetProbability * 100).toFixed(2)}%</div>
        </div>
        <p className={`bg-black p-2 rounded-lg text-center font-bold ${isSelected ? "text-green" : "text-white"}`}>Best Book: {bookNames[prop.bestBook] || "N/A"}</p>
        <div className="flex justify-around items-center bg-black p-4 rounded-lg mt-4 shadow-lg">
          {prop.allBookOdds.map((book, idx) => (
            <div key={idx} className="text-center text-white p-2 relative tooltip">
              <img src={bookLogos[book.book]} alt={bookNames[book.book]} className="mx-auto h-8 mb-2" />
              <div className="tooltip-text">{bookNames[book.book]}</div>
              <div className="text-sm mb-1">{book.line}</div>
              <div className="text-sm font-bold">{prop.bestBet === "over" ? book.overOdds : book.underOdds}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BettingProp;
