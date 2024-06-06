import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import BettingProp from "@/components/BettingProp";
import LoadingSpinner from "@/components/LoadingSpinner";
import Head from "next/head";

const LOCAL_URL = "http://0.0.0.0:8080/api/best-props";
const API_URL = "https://fivelegflex-backend.fly.dev/api/best-props";

const useFetch = (url, includePrizePicks) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${url}?include_prizepicks=${includePrizePicks}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
        }
        const result = await res.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url, includePrizePicks]);

  return { data, error, loading };
};

const propTypeMapping = {
  player_points: "Points",
  player_assists: "Assists",
  player_rebounds: "Rebounds",
  player_threes: "3-PT Made",
  player_blocks: "Blocked Shots",
  player_steals: "Steals",
  player_blocks_steals: "Blks+Stls",
  player_turnovers: "Turnovers",
  player_points_rebounds_assists: "Pts+Rebs+Asts",
  player_points_rebounds: "Pts+Rebs",
  player_points_assists: "Pts+Asts",
  player_rebounds_assists: "Rebs+Asts",
};

const FilterButtons = ({ selectedFilter, setSelectedFilter, selectedPropType, setSelectedPropType, selectedGame, setSelectedGame, games, includePrizePicks, setIncludePrizePicks }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0 md:space-x-4">
      <div className="flex flex-row space-x-2 mb-2 md:mb-0">
        <button className={`px-4 py-2 font-semibold rounded-lg transition-transform duration-300 ${selectedFilter === "all" ? "bg-gold text-black shadow-lg transform scale-105" : "bg-black text-white hover:bg-opacity-80"} h-12 md:h-10`} onClick={() => setSelectedFilter("all")}>
          All
        </button>
        <button className={`px-4 py-2 font-semibold rounded-lg transition-transform duration-300 ${selectedFilter === "over" ? "bg-green text-black shadow-lg transform scale-105" : "bg-black text-white hover:bg-opacity-80"} h-12 md:h-10`} onClick={() => setSelectedFilter("over")}>
          Over
        </button>
        <button className={`px-4 py-2 font-semibold rounded-lg transition-transform duration-300 ${selectedFilter === "under" ? "bg-red text-black shadow-lg transform scale-105" : "bg-black text-white hover:bg-opacity-80"} h-12 md:h-10`} onClick={() => setSelectedFilter("under")}>
          Under
        </button>
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 items-center">
        <select
          className="px-4 py-2 font-semibold rounded-lg bg-black text-white h-12 md:h-10 appearance-none pr-8 hover:bg-opacity-80 cursor-pointer"
          value={selectedPropType}
          onChange={(e) => setSelectedPropType(e.target.value)}
          style={{
            backgroundImage: `url('data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath fill="white" d="M7 7l3-3 3 3zM7 13l3 3 3-3z"/%3E%3C/svg%3E')`,
            backgroundPosition: "right 0.5rem center",
            backgroundSize: "1.5em 1.5em",
            backgroundRepeat: "no-repeat",
          }}
        >
          <option value="all">All Prop Types</option>
          {Object.entries(propTypeMapping).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>

        <select
          className="px-4 py-2 font-semibold rounded-lg bg-black text-white h-12 md:h-10 appearance-none pr-8 hover:bg-opacity-80 cursor-pointer"
          value={selectedGame}
          onChange={(e) => setSelectedGame(e.target.value)}
          style={{
            backgroundImage: `url('data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath fill="white" d="M7 7l3-3 3 3zM7 13l3 3 3-3z"/%3E%3C/svg%3E')`,
            backgroundPosition: "right 0.5rem center",
            backgroundSize: "1.5em 1.5em",
            backgroundRepeat: "no-repeat",
          }}
        >
          <option value="all">All Games</option>
          {games.map((game, index) => (
            <option key={index} value={game}>
              {game}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <label className="text-white font-semibold">PrizePicks Only</label>
        <div className="inline-flex items-center">
          <label className="relative flex items-center p-3 rounded-full cursor-pointer" htmlFor="checkbox">
            <input
              type="checkbox"
              className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-gold before:opacity-0 before:transition-opacity checked:border-gold checked:bg-gold checked:before:bg-gold hover:before:opacity-10"
              id="checkbox"
              checked={includePrizePicks}
              onChange={(e) => setIncludePrizePicks(e.target.checked)}
            />
            <span className="absolute text-black transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

const NBAPropsPage = () => {
  const [includePrizePicks, setIncludePrizePicks] = useState(true);
  const { data: bettingProps, error, loading } = useFetch(API_URL, includePrizePicks);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedPropType, setSelectedPropType] = useState("all");
  const [selectedGame, setSelectedGame] = useState("all");

  if (loading) return <LoadingSpinner />;

  const hasProps = bettingProps?.data?.length > 0;

  const uniqueGames = [...new Set(bettingProps?.data?.map((prop) => `${prop.home_team} vs ${prop.away_team}`))];

  const filteredProps = bettingProps?.data?.filter((prop) => {
    const filterMatch = selectedFilter === "all" || prop.bestBet === selectedFilter;
    const propTypeMatch = selectedPropType === "all" || prop.prop_type === propTypeMapping[selectedPropType];
    const gameMatch = selectedGame === "all" || `${prop.home_team} vs ${prop.away_team}` === selectedGame;
    return filterMatch && propTypeMatch && gameMatch;
  });

  return (
    <Layout>
      <Head>
        <title>NBA Props</title>
      </Head>
      <div className="bg-fullblack text-white min-h-screen min-w-full">
        <div className="container mx-auto">
          <FilterButtons
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            selectedPropType={selectedPropType}
            setSelectedPropType={setSelectedPropType}
            selectedGame={selectedGame}
            setSelectedGame={setSelectedGame}
            games={uniqueGames}
            includePrizePicks={includePrizePicks}
            setIncludePrizePicks={setIncludePrizePicks}
          />
          {hasProps && !error ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 place-items-stretch">
              {filteredProps.map((prop, index) => (
                <BettingProp key={index} prop={prop} />
              ))}
            </div>
          ) : (
            <div className="bg-fullblack text-white p-4 md:p-6 lg:p-8">
              <h1 className="text-center text-4xl font-bold mb-4">No props available</h1>
              <p className="text-center text-xl mb-4">Please check back later.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NBAPropsPage;
