import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import BettingProp from "@/components/BettingProp";
import LoadingSpinner from "@/components/LoadingSpinner";
import Head from "next/head";

const LOCAL_URL = "http://0.0.0.0:8080/api/best-props-mls";
const API_URL = "https://fivelegflex-backend.fly.dev/api/best-props-mls";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${url}`, {
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
  }, [url]);

  return { data, error, loading };
};

const propTypeMapping = {
  player_shots: "Shots",
  player_shots_on_target: "Shots On Target",
};

const FilterButtons = ({ selectedFilter, setSelectedFilter, selectedPropType, setSelectedPropType, selectedGame, setSelectedGame, games }) => {
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
    </div>
  );
};

const MLSPropsPage = () => {
  const { data: bettingProps, error, loading } = useFetch(API_URL);
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
        <title>MLS Props</title>
      </Head>
      <div className="bg-fullblack text-white min-h-screen min-w-full">
        <div className="container mx-auto">
          <FilterButtons selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} selectedPropType={selectedPropType} setSelectedPropType={setSelectedPropType} selectedGame={selectedGame} setSelectedGame={setSelectedGame} games={uniqueGames} />
          {hasProps && !error ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 justify-items-center">
              {filteredProps.map((prop, index) => (
                <BettingProp key={index} prop={prop} />
              ))}
            </div>
          ) : (
            <div className="bg-fullblack text-white p-4 md:p-6 lg:p-8">
              <h1 className="text-center text-4xl font-bold mb-4">{bettingProps?.message || "No props available"}</h1>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MLSPropsPage;
