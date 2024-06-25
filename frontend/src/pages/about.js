import React from "react";
import Layout from "@/components/Layout";
import Head from "next/head";

const About = () => {
  return (
    <Layout>
      <Head>
        <title>About</title>
      </Head>
      <div className="bg-offwhite dark:bg-fullblack text-fullblack dark:text-white p-6 md:p-10 lg:p-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-center text-5xl font-bold mb-6 text-fullblack dark:text-white">About FiveLegFlex</h1>
          <p className="text-center text-xl mb-4 text-fullblack dark:text-white">
            FiveLegFlex provides real-time data and forecasts for NBA and soccer player prop bets. Our platform helps you make informed betting decisions and maximize your potential for high-value outcomes. We're also excited to expand to more sports in the future.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
