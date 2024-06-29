import React, { useState } from "react";

const BettingProp = ({ prop }) => {
  const [isSelected, setIsSelected] = useState(false);

  const bookLogos = {
    superbook: "/superbook.png",
    draftkings: "/draftkings.png",
    fanduel: "/fanduel.png",
    williamhill_us: "/caesars.png",
    mybookieag: "/mybookie.png",
    bovada: "/bovada.png",
    pointsbetus: "/pointsbet.png",
    betonlineag: "/betonlineag.png",
    betmgm: "/betmgm.png",
  };

  const bookNames = {
    superbook: "Superbook",
    draftkings: "DraftKings",
    fanduel: "Fanduel",
    williamhill_us: "Caesars",
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

  const formatOdds = (odds) => {
    return odds > 0 ? `+${odds}` : odds;
  };

  const getOdds = (book) => {
    if (book.hasOwnProperty("overOdds") && book.hasOwnProperty("underOdds")) {
      return formatOdds(prop.bestBet === "over" ? book.overOdds : book.underOdds);
    }
    return formatOdds(book.odds);
  };

  return (
    <div
      className={`border-2 ${
        isSelected ? "bg-gold bg-opacity-30 shadow-2xl" : "border-fullblack dark:border-white bg-white dark:bg-fullblack shadow-xl"
      } rounded-lg p-4 flex flex-col justify-between h-full transition-transform duration-300 ease-in-out cursor-pointer hover:bg-gold hover:bg-opacity-30 hover:scale-105 w-full`}
      onClick={toggleSelection}
    >
      <div className="flex flex-col items-center mb-4">
        <img className="w-32 h-32 rounded-full border-4 border-fullblack dark:border-white mb-2" src={prop.img_url} alt={`Image of ${prop.player}`} />
        <h2 className="text-2xl font-semibold text-center mb-1 text-fullblack dark:text-white">{prop.player}</h2>
        <p className="text-teal text-sm text-center mb-1">
          {prop.home_team} vs {prop.away_team}
        </p>
        <p className="text-fullblack dark:text-white text-sm text-center mb-1">
          {prop.player_team} - {prop.player_position}
        </p>
        <p className="text-lg text-center">
          <span className="text-gold font-bold drop-shadow-sm">
            {prop.prop_type.toUpperCase()}: {prop.line}
          </span>
        </p>
        <p className="text-fullblack dark:text-white text-sm text-center mb-1">{prop.game_time}</p>
      </div>
      <div className="flex justify-between items-center mb-4 w-full space-x-2">
        <div className={`flex-1 p-2 rounded-lg text-center font-bold shadow-md ${prop.bestBet === "over" ? "bg-green" : "bg-red"} bg-opacity-70`}>
          {prop.bestBet.toUpperCase()} ({formatOdds(prop.bestBetOdds)})
        </div>
        <div className={`flex-1 p-2 rounded-lg shadow-lg text-center font-bold ${prop.bestBetProbability >= 0.6 ? "bg-green bg-opacity-50" : prop.bestBetProbability >= 0.54 ? "bg-lightgreen bg-opacity-70" : "bg-gold bg-opacity-70"}`}>{(prop.bestBetProbability * 100).toFixed(2)}%</div>
      </div>
      <div className="flex flex-col space-y-2 w-full min-h-[8rem] max-h-32 overflow-auto custom-scrollbar">
        {sortedBookOdds.map((book, idx) => (
          <div key={idx} className="flex space-x-2">
            <div className="flex items-center bg-offwhite dark:bg-black rounded-lg p-2 w-4/5 justify-between">
              <div className="flex items-center">
                <img src={bookLogos[book.book]} alt={bookNames[book.book]} className="h-5 rounded border border-gray transition-transform transform group-hover:scale-125" />
                <span className="text-sm text-fullblack dark:text-white ml-2 sm:max-md:text-xs">{bookNames[book.book]}</span>
              </div>
              <div className="flex">
                <span className="text-sm font-bold text-fullblack dark:text-white sm:max-md:text-xs">Line: {book.line}</span>
              </div>
            </div>

            <div className="flex items-center bg-offwhite dark:bg-black rounded-lg p-2 w-20 justify-center h-full">
              <span className="text-sm font-bold text-fullblack dark:text-white sm:max-md:text-xs">{getOdds(book)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BettingProp;
