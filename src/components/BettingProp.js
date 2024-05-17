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
      className={`max-w-sm border-2 ${isSelected ? "bg-gold bg-opacity-30 shadow-2xl" : "border-white bg-fullblack shadow-xl"} rounded-xl p-5 flex flex-col justify-between h-full transition-transform duration-300 ease-in-out cursor-pointer hover:bg-gold hover:bg-opacity-30 hover:scale-105`}
      onClick={toggleSelection}
    >
      <div>
        <img className={`w-32 h-32 rounded-full mx-auto border-4 border-white mb-4`} src={prop.img_url} alt={`Image of ${prop.player}`} />
        <div className="mt-2 mb-2">
          <h2 className={`text-2xl font-semibold text-center`}>{prop.player}</h2>
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
          <div className={`flex-1 mr-2 p-2 rounded-lg text-center font-bold shadow-md ${prop.bestBet === "over" ? "bg-green bg-opacity-70" : "bg-red bg-opacity-70"}`}>
            {prop.bestBet.toUpperCase()} ({prop.bestBetOdds})
          </div>
          <div className={`flex-1 ml-2 p-2 rounded-lg shadow-lg text-center font-bold ${prop.bestBetProbability >= 0.6 ? "bg-green bg-opacity-50" : prop.bestBetProbability >= 0.55 ? "bg-lightgreen bg-opacity-70" : "bg-gold bg-opacity-70"}`}>{(prop.bestBetProbability * 100).toFixed(2)}%</div>
        </div>

        {/* Odds Section with Always Visible and Smaller Scrollbar */}
        <div className="flex overflow-x-scroll custom-scrollbar bg-black p-3 rounded-lg shadow-lg space-x-3">
          {sortedBookOdds.map((book, idx) => (
            <div key={idx} className="text-center text-white p-2 relative group min-w-[70px] flex-shrink-0">
              <img src={bookLogos[book.book]} alt={bookNames[book.book]} className="mx-auto h-6 mb-2 transition-transform transform group-hover:scale-125" />
              <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded-lg py-1 px-2 shadow-lg ${isSelected ? "block" : ""}`}>{bookNames[book.book]}</div>
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
