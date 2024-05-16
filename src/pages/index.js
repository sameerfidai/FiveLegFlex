import Layout from "@/components/Layout";
import Head from "next/head";
import Link from "next/link";

export default function HomePage() {
  return (
    <Layout>
      <Head>
        <title>FiveLegFlex</title>
      </Head>
      <div className="bg-cover bg-center overflow-hidden">
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <h1 className="text-7xl font-bold mb-4 text-white shadow">FiveLegFlex</h1>
          <p className="text-2xl text-gold mb-6 animate-pulse font-light tracking-wide">The Ultimate NBA Player Prop Betting Experience</p>
          <Link href="/props" className="px-7 py-2 bg-gold text-black rounded-full font-bold text-lg hover:bg-opacity-50 transition duration-150">
            View Props
          </Link>
        </div>
      </div>
    </Layout>
  );
}
