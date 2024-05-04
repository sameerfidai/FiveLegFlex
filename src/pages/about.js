import React from "react";
import Layout from "@/components/Layout";

const About = () => {
  return (
    <Layout>
      <div className="bg-fullblack text-white p-4 md:p-6 lg:p-8">
        <h1 className="text-center text-4xl font-bold mb-4">About FiveLegFlex</h1>
        <p className="text-center text-xl mb-4">FiveLegFlex is the premier destination for NBA betting enthusiasts.</p>
      </div>
    </Layout>
  );
};

export default About;
