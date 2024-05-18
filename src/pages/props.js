import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import BettingProp from "@/components/BettingProp";
import LoadingSpinner from "@/components/LoadingSpinner";
import Head from "next/head";

const LOCAL_URL = "http://localhost:8000/api/best-props";
const API_URL = "https://fivelegflex-backend.fly.dev/api/best-props";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url, {
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

const FilterButtons = ({ selectedFilter, setSelectedFilter, selectedPropType, setSelectedPropType }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex space-x-2">
        <button className={`px-4 py-2 font-semibold rounded-lg ${selectedFilter === "all" ? "bg-gold text-black" : "bg-black text-gray-300"}`} onClick={() => setSelectedFilter("all")}>
          All
        </button>
        <button className={`px-4 py-2 font-semibold rounded-lg ${selectedFilter === "over" ? "bg-gold text-black" : "bg-black text-gray-300"}`} onClick={() => setSelectedFilter("over")}>
          Over
        </button>
        <button className={`px-4 py-2 font-semibold rounded-lg ${selectedFilter === "under" ? "bg-gold text-black" : "bg-black text-gray-300"}`} onClick={() => setSelectedFilter("under")}>
          Under
        </button>
      </div>
      <div className="flex items-center">
        <select className="px-4 py-2 font-semibold rounded-lg bg-black text-gray-300" value={selectedPropType} onChange={(e) => setSelectedPropType(e.target.value)}>
          <option value="all">All Prop Types</option>
          {Object.entries(propTypeMapping).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

const PropsPage = () => {
  const { data: bettingProps, error, loading } = useFetch(API_URL);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedPropType, setSelectedPropType] = useState("all");

  if (loading) return <LoadingSpinner />;

  const hasProps = bettingProps?.data?.length > 0;

  const filteredProps = bettingProps?.data?.filter((prop) => {
    const filterMatch = selectedFilter === "all" || prop.bestBet === selectedFilter;
    const propTypeMatch = selectedPropType === "all" || prop.prop_type === propTypeMapping[selectedPropType];
    return filterMatch && propTypeMatch;
  });

  return (
    <Layout>
      <Head>
        <title>Props | FiveLegFlex</title>
      </Head>
      <div className="bg-fullblack text-white p-4 md:p-6 lg:p-8">
        <div className="container mx-auto">
          <FilterButtons selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} selectedPropType={selectedPropType} setSelectedPropType={setSelectedPropType} />
          {hasProps && !error ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 place-items-stretch">
              {filteredProps.map((prop, index) => (
                <BettingProp key={index} prop={prop} />
              ))}
            </div>
          ) : (
            <div className="bg-fullblack text-white p-4 md:p-6 lg:p-8">
              <h1 className="text-center text-4xl font-bold mb-4">Please try again later.</h1>
              <p className="text-center text-xl mb-4">Sorry.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PropsPage;
