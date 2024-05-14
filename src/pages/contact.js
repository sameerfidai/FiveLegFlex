import React from "react";
import Layout from "@/components/Layout";
import Head from "next/head";

const Contact = () => {
  return (
    <Layout>
      <Head>
        <title>Contact Us</title>
      </Head>
      <div className="bg-fullblack text-white p-4 md:p-6 lg:p-8">
        <h1 className="text-center text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-center text-xl mb-4">Have questions or need support? Get in touch with us.</p>
      </div>
    </Layout>
  );
};

export default Contact;
