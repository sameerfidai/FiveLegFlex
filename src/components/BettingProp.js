import React from "react";

const BettingProp = ({ prop }) => {
  const bookLogos = {
    draftkings: "/draftkings.png",
    fanduel: "/fanduel.png",
    williamhill_us: "/williamhill.png",
    bovada: "/bovada.png",
    pointsbetus: "/pointsbet.png",
    betonlineag: "/betonlineag.png",
    betmgm: "/betmgm.png",
  };

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
            <span className="text-gold">{prop.prop_type.toUpperCase()}: </span>
            <span className="font-bold text-gold">{prop.line}</span>
          </p>
        </div>
      </div>
      <div className="">
        <div className="flex justify-between items-center mb-4">
          <div className={`flex-1 mr-2 p-2 rounded-lg text-center font-bold ${prop.bestBet === "over" ? "bg-green bg-opacity-50" : "bg-red bg-opacity-50"}`}>
            Best Bet: {prop.bestBet.toUpperCase()} ({prop.bestBetOdds})
          </div>
          <div className={`flex-1 ml-2 p-2 rounded-lg text-center font-bold ${prop.bestBetProbability >= 0.6 ? "bg-green bg-opacity-50" : prop.bestBetProbability >= 0.55 ? "bg-lightgreen bg-opacity-50" : "bg-gold bg-opacity-50"}`}>Probability: {(prop.bestBetProbability * 100).toFixed(2)}%</div>
        </div>
        <p className="bg-black p-2 rounded-lg text-center font-bold text-white">Best Book: {prop.bestBook || "N/A"}</p>

        <div className="flex justify-around items-center bg-black p-4 rounded-lg mt-4 shadow-lg">
          {prop.allBookOdds.map((book, idx) => (
            <div key={idx} className="text-center text-white p-2">
              <img src={bookLogos[book.book]} alt={`${book.book} logo`} className="mx-auto h-11 mb-2" />
              <div className="text-sm mb-1">{book.line}</div>
              {/* Display overOdds or underOdds based on bestBet */}
              <div className="font-bold">{prop.bestBet === "over" ? book.overOdds : book.underOdds}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BettingProp;
