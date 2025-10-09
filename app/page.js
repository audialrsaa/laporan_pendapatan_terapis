"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';
import SpreadsheetTable from './components/SpreadsheetTable';
import SummaryReport from './components/SummaryReport';

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedData = localStorage.getItem('treatmentData');
    if (storedData) {
      setData(JSON.parse(storedData));
    }
    setLoading(false);
  }, []);

  const handleSaveData = (newData) => {
    localStorage.setItem('treatmentData', JSON.stringify(newData));
    setData(newData);
  };

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <Head>
        <title>Sistem Laporan Gaji Terapis</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6 text-center">
        Laporan Pendapatan Terapis
      </h1>

      {/* ringkasan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <SummaryReport data={data} />
      </div>

      {/* tble input data perbulan */}
      <SpreadsheetTable data={data} onSave={handleSaveData} />
    </div>
  );
}
