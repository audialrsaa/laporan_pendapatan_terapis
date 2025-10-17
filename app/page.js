"use client";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import SpreadsheetTable from "./components/SpreadsheetTable";
import SummaryReport from "./components/SummaryReport";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("treatmentData");
    if (stored) setData(JSON.parse(stored));
    setLoading(false);
  }, []);

  const handleSave = (newData) => {
    localStorage.setItem("treatmentData", JSON.stringify(newData));
    setData(newData);
  };

  if (loading) return <div className="p-8 text-center text-lg font-medium text-gray-600">Loading...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Head>
        <title>Sistem Laporan Pendapatan Terapis</title>
      </Head>

      <h1 className="text-4xl font-extrabold mb-2 text-center text-gray-800">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
          Sistem Laporan Pendapatan Terapis
        </span>
      </h1>

      <h2 className="text-4xl font-extrabold mb-5 text-center text-gray-800">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
          Adhe
        </span>
      </h2>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <SummaryReport data={data} />
        </div>

        <SpreadsheetTable data={data} onSave={handleSave} />
      </div>
    </div>
  );
}
