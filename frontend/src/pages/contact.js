import React from "react";
import Layout from "@/components/Layout";
import Head from "next/head";

const Contact = () => {
  return (
    <Layout>
      <Head>
        <title>Contact Us</title>
      </Head>
      <div className="text-white p-6 md:p-10 lg:p-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-center text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-center text-xl mb-4">Have questions or need support? Get in touch with us.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
