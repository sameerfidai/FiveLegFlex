import React, { useState } from "react";
import Layout from "@/components/Layout";
import Head from "next/head";
import axios from "axios";

const TopProjections = ({ projections }) => {
  const [selectedIndices, setSelectedIndices] = useState([]);

  const handleClick = (index) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter((i) => i !== index));
    } else {
      setSelectedIndices([...selectedIndices, index]);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Top Projections | FiveLegFlex</title>
      </Head>
      <div className="text-white min-h-screen p-6 md:p-10 lg:p-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-center text-5xl font-bold mb-8 text-gold">Top Prop Projections Today</h1>
          <div className="flex flex-col space-y-8">
            {projections.map((prop, index) => (
              <div
                key={index}
                className={`w-full border-2 ${
                  selectedIndices.includes(index) ? "bg-gold bg-opacity-30 shadow-2xl" : "border-white bg-fullblack shadow-xl"
                } rounded-xl p-5 flex flex-col sm:flex-row justify-between items-center h-full transition-transform duration-300 ease-in-out cursor-pointer hover:bg-gold hover:bg-opacity-30 hover:scale-105`}
                onClick={() => handleClick(index)}
              >
                <div className="flex items-center space-x-4 sm:w-1/2 sm:mr-8 mb-4 sm:mb-0">
                  <img className="w-24 h-24 rounded-full border-4 border-gray" src={prop.img_url} alt={`Image of ${prop.player}`} />
                  <div>
                    <h2 className="text-3xl font-semibold text-white">{prop.player}</h2>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 w-full sm:w-1/2">
                  <div className="flex justify-between">
                    <span className="font-bold text-l text-gray">Projection:</span>
                    <span className="font-bold text-l text-white">{prop.projection}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-l text-gray">Difference:</span>
                    <span className="font-bold text-l text-white">{prop.difference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-l text-gray">Line:</span>
                    <span className="font-bold text-gold text-xl">{prop.ftsy_score}</span>
                  </div>
                  <div className={`text-center font-bold py-2 px-4 rounded-lg shadow-md ${prop.recommendation.toLowerCase() === "over" ? "bg-green bg-opacity-80" : "bg-red bg-opacity-80"}`}>{prop.recommendation.toUpperCase()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps() {
  let projections = [];
  try {
    const { data } = await axios.get("https://five-leg-flex.vercel.app/api/scrape");
    projections = data;
  } catch (error) {
    console.error("Error fetching projections:", error);
  }

  return { props: { projections } };
}

export default TopProjections;
