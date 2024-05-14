import React from "react";
import Layout from "@/components/Layout";
import Head from "next/head";

const About = () => {
  return (
    <Layout>
      <Head>
        <title>About</title>
      </Head>
      <div className="bg-fullblack text-white p-4 md:p-6 lg:p-8">
        <h1 className="text-center text-4xl font-bold mb-4">About FiveLegFlex</h1>
        <p className="text-center text-xl mb-4">Coming soon...</p>
      </div>
    </Layout>
  );
};

export default About;
