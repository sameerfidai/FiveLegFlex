import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import BettingProp from "@/components/BettingProp";
import LoadingSpinner from "@/components/LoadingSpinner";
import Head from "next/head";

const LOCAL_URL = "http://localhost:8000/api/best-props";
const API_URL = "https://fivelegflex-backend.fly.dev/api/best-props";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
        }
        const result = await res.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return { data, error, loading };
};

const PropsPage = () => {
  const { data: bettingProps, error, loading } = useFetch(API_URL);

  if (loading) return <LoadingSpinner />;

  const hasProps = bettingProps?.data?.length > 0;

  return (
    <Layout>
      <Head>
        <title>Props | FiveLegFlex</title>
      </Head>
      <div className="bg-fullblack text-white p-4 md:p-6 lg:p-8">
        {hasProps && !error ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 place-items-stretch">
            {bettingProps.data.map((prop, index) => (
              <BettingProp key={index} prop={prop} />
            ))}
          </div>
        ) : (
          <div className="bg-fullblack text-white p-4 md:p-6 lg:p-8">
            <h1 className="text-center text-4xl font-bold mb-4">Please try again later.</h1>
            <p className="text-center text-xl mb-4">Sorry.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PropsPage;
