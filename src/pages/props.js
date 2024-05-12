import React, { useState, useEffect } from "react";
import NProgress from "nprogress"; // Import NProgress here
import Layout from "@/components/Layout";
import BettingProp from "@/components/BettingProp";
import LoadingSpinner from "@/components/LoadingSpinner";

const LOCAL_URL = "http://localhost:8000/api/best-props";
const API_URL = "https://fivelegflex-backend.onrender.com/api/best-props";

const PropsPage = () => {
  const [bettingProps, setBettingProps] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProps = async () => {
      try {
        const res = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        setBettingProps(data);
        NProgress.done(); // NProgress is now available
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        NProgress.done(); // NProgress is now available
      }
    };
    fetchProps();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!bettingProps) return <LoadingSpinner />;

  const hasProps = bettingProps.data && bettingProps.data.length > 0;

  return (
    <Layout>
      <div className="bg-fullblack text-white p-4 md:p-6 lg:p-8">
        {hasProps ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 place-items-stretch">
            {bettingProps.data.map((prop, index) => (
              <BettingProp key={index} prop={prop} />
            ))}
          </div>
        ) : (
          <div className="text-center mt-20">
            <h2 className="text-2xl font-semibold">No NBA props live at this time.</h2>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PropsPage;
