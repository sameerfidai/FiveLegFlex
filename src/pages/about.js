import React from "react";
import Layout from "@/components/Layout";
import Head from "next/head";
import { FaTwitter } from "react-icons/fa";

const About = () => {
  return (
    <Layout>
      <Head>
        <title>About | FiveLegFlex</title>
      </Head>
      <div className="text-white p-6 md:p-10 lg:p-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-center text-5xl font-bold mb-6">About FiveLegFlex</h1>
          <p className="text-center text-xl mb-4">At FiveLegFlex, we provide data-driven insights and real-time updates on NBA player props to help you make informed betting decisions.</p>
          <div className="flex justify-center">
            <a href="https://twitter.com/FiveLegFlex" target="_blank" className="flex items-center bg-gold hover:bg-opacity-50 text-black font-medium py-2 px-4 rounded-full transition duration-150">
              <FaTwitter className="text-2xl mr-2" />
              Follow us on X!
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
