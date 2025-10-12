"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';
import SpreadsheetTable from './components/SpreadsheetTable';
import SummaryReport from './components/SummaryReport';

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Memuat data dari localStorage saat komponen dimuat
    const storedData = localStorage.getItem('treatmentData');
    if (storedData) {
      setData(JSON.parse(storedData));
    }
    setLoading(false);
  }, []);

  const handleSaveData = (newData) => {
    // Menyimpan data ke localStorage
    localStorage.setItem('treatmentData', JSON.stringify(newData));
    setData(newData);
  };

  if (loading) {
    return <div className="p-8 text-center text-lg font-medium text-gray-600">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen"> 
      <Head>
        <title>Sistem Laporan Pendapatan Terapis</title>
      </Head>

      {/* Header dengan style modern dan bersih */}
      <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-800">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
          Sistem Laporan Pendapatan Terapis
        </span>
      </h1>

      {/* Ringkasan */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <SummaryReport data={data} />
        </div>

        {/* Tabel Input */}
        <SpreadsheetTable data={data} onSave={handleSaveData} />
      </div>
    </div>
  );
}