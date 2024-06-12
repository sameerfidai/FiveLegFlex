import Layout from "@/components/Layout";
import Head from "next/head";
import Link from "next/link";

export default function NotFound() {
  return (
    <Layout>
      <Head>
        <title>Not Found</title>
      </Head>
      <div className="h-full flex flex-col items-center justify-center bg-fullblack text-white">
        <h1 className="text-6xl font-bold mb-4 text-white shadow">Not Found</h1>
        <p className="text-xl text-gold mb-4">Oops! The page you're looking for doesn't exist.</p>
        <Link href="/" className="px-6 py-3 bg-white text-black rounded-md hover:bg-black2 hover:text-white transition duration-200">
          Go back Home
        </Link>
      </div>
    </Layout>
  );
}
