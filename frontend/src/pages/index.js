import Layout from "@/components/Layout";
import Head from "next/head";
import Link from "next/link";

const HomePage = () => {
  return (
    <Layout>
      <Head>
        <title>FiveLegFlex</title>
      </Head>
      <div className="w-full flex flex-col justify-center items-center bg-offwhite dark:bg-fullblack">
        <div className="text-center p-4">
          <h1 className="text-6xl font-bold mb-4 text-fullblack dark:text-white">FiveLegFlex</h1>
          <p className="text-2xl text-gold animate-pulse font-light tracking-wide">Player Props Optimizer</p>
          {/* <Link href="/props">
            <div className="px-7 py-2 bg-gold text-fullblack dark:text-white rounded-full font-bold text-lg hover:bg-opacity-50 hover:text-white transition duration-150 cursor-pointer">View Props</div>
          </Link> */}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
