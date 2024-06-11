import React, { useState } from "react";

const BettingProp = ({ prop }) => {
  const [isSelected, setIsSelected] = useState(false);

  const bookLogos = {
    draftkings: "/draftkings.png",
    fanduel: "/fanduel.png",
    williamhill_us: "/williamhill.png",
    mybookieag: "/mybookie.png",
    bovada: "/bovada.png",
    pointsbetus: "/pointsbet.png",
    betonlineag: "/betonlineag.png",
    betmgm: "/betmgm.png",
  };

  const bookNames = {
    draftkings: "DraftKings",
    fanduel: "Fanduel",
    williamhill_us: "William Hill US",
    mybookieag: "MyBookie",
    bovada: "Bovada",
    pointsbetus: "PointsBet",
    betonlineag: "BetOnline",
    betmgm: "BetMGM",
  };

  const sortedBookOdds = prop.allBookOdds.sort((a, b) => {
    const order = ["draftkings", "fanduel", "williamhill_us", "mybookieag", "bovada", "pointsbetus", "betonlineag", "betmgm"];
    return order.indexOf(a.book) - order.indexOf(b.book);
  });

  const toggleSelection = () => {
    setIsSelected(!isSelected);
  };

  return (
    <div
      className={`bg-fullblack border-2 ${
        isSelected ? "bg-gold bg-opacity-30 shadow-2xl" : "border-white bg-fullblack shadow-xl"
      } rounded-lg p-4 flex flex-col justify-between h-full transition-transform duration-300 ease-in-out cursor-pointer hover:bg-gold hover:bg-opacity-30 hover:scale-105 w-full max-w-sm mx-auto`}
      onClick={toggleSelection}
    >
      <div className="flex flex-col items-center mb-4">
        <img className="w-32 h-32 rounded-full border-4 border-white mb-2" src={prop.img_url} alt={`Image of ${prop.player}`} />
        <h2 className="text-2xl font-semibold text-center mb-1">{prop.player}</h2>
        <p className="text-teal text-sm text-center mb-1">
          {prop.home_team} vs {prop.away_team}
        </p>
        <p className="text-lg text-center">
          <span className="text-gold font-bold">
            {prop.prop_type.toUpperCase()}: {prop.line}
          </span>
        </p>
      </div>
      <div className="flex justify-between items-center mb-4 w-full space-x-2">
        <div className={`flex-1 p-2 rounded-lg text-center font-bold shadow-md ${prop.bestBet === "over" ? "bg-green" : "bg-red"} bg-opacity-70`}>
          {prop.bestBet.toUpperCase()} ({prop.bestBetOdds})
        </div>
        <div className={`flex-1 p-2 rounded-lg shadow-lg text-center font-bold ${prop.bestBetProbability >= 0.6 ? "bg-green bg-opacity-50" : prop.bestBetProbability >= 0.54 ? "bg-lightgreen bg-opacity-70" : "bg-gold bg-opacity-70"}`}>{(prop.bestBetProbability * 100).toFixed(2)}%</div>
      </div>
      <div className="flex flex-col space-y-2 w-full min-h-[8rem] max-h-32 overflow-auto custom-scrollbar">
        {sortedBookOdds.map((book, idx) => (
          <div key={idx} className="flex justify-between items-center bg-black rounded-lg p-2">
            <div className="flex items-center space-x-2">
              <img src={bookLogos[book.book]} alt={bookNames[book.book]} className="h-6 transition-transform transform group-hover:scale-125" />
              <span className="text-sm text-white">{bookNames[book.book]}</span>
            </div>
            <div className="text-sm font-bold text-white">{prop.bestBet === "over" ? book.overOdds : book.underOdds}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BettingProp;
