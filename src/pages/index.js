import Layout from "@/components/Layout";
import Head from "next/head";

export default function HomePage() {
  return (
    <Layout>
      <Head>
        <title>FiveLegFlex</title>
      </Head>
      <div className="bg-cover bg-center">
        <h1 className="text-7xl font-bold mb-4 text-white shadow-lg">FiveLegFlex</h1>
        <p className="text-2xl text-gold mb-6 animate-pulse font-light tracking-wide">The Ultimate NBA Betting Experience</p>
      </div>
    </Layout>
  );
}
