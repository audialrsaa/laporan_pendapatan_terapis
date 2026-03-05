"use client";

import { useEffect, useState } from "react";
import SpreadsheetTable from "./components/SpreadsheetTable";
import SummaryReport from "./components/SummaryReport";

const Icons = {
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  Logo: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
  AutoSave: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Calendar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  )
};

export default function DashboardPage() {
  const [transactionData, setTransactionData] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [userName, setUserName] = useState("");
  const [selectedBulan, setSelectedBulan] = useState(""); // "" = tampilkan semua

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.username) setUserName(parsedUser.username);
      } catch (err) {
        console.error("Gagal parse currentUser:", err);
      }
    }

    const savedReportData = localStorage.getItem("reportData");
    if (savedReportData) {
      try {
        setReportData(JSON.parse(savedReportData));
      } catch (err) {
        console.error("❌ Gagal parse reportData:", err);
      }
    }
  }, []);

  useEffect(() => {
    if (reportData.length > 0) {
      localStorage.setItem("reportData", JSON.stringify(reportData));
    }
  }, [reportData]);

  // Ambil daftar bulan unik dari reportData untuk opsi dropdown
  const daftarBulan = Array.from(
    new Set(
      reportData
        .filter(item => item.tanggal)
        .map(item => {
          const d = new Date(item.tanggal);
          return `${d.toLocaleString("id-ID", { month: "long" })} ${d.getFullYear()}`;
        })
    )
  ).sort((a, b) => {
    // Sort descending: bulan terbaru di atas
    const [mA, yA] = a.split(" ");
    const [mB, yB] = b.split(" ");
    const dateA = new Date(`${mA} 1, ${yA}`);
    const dateB = new Date(`${mB} 1, ${yB}`);
    return dateB - dateA;
  });

  // Data yang dikirim ke SummaryReport: filter jika selectedBulan dipilih
  const filteredReportData = selectedBulan
    ? reportData.filter(item => {
        if (!item.tanggal) return false;
        const d = new Date(item.tanggal);
        const bulanKey = `${d.toLocaleString("id-ID", { month: "long" })} ${d.getFullYear()}`;
        return bulanKey === selectedBulan;
      })
    : reportData;

  const addToReport = (data) => {
    if (data && data.tanggal && data.terapis && data.nominal) {
      setReportData((prev) => {
        const newData = [...prev, data];
        localStorage.setItem("reportData", JSON.stringify(newData));
        return newData;
      });
    }
  };

  const updateTransactionData = (newData) => setTransactionData(newData);
  const clearTransactionData = () => setTransactionData([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white shadow-2xl">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-lg p-3 rounded-2xl shadow-xl">
                <Icons.Logo />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  LAPORAN PENDAPATAN TERAPIS
                </h1>
                <p className="text-blue-100 text-sm mt-1">
                  Sistem manajemen dan pelaporan pendapatan
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {userName && (
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-lg px-4 py-2 rounded-2xl">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <Icons.User />
                  </div>
                  <span className="font-medium capitalize">{userName}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Summary Report Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-3 rounded-xl shadow-lg shadow-blue-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Summary Report</h2>
                  <p className="text-gray-600 text-sm">Ringkasan pendapatan dan komisi terapis</p>
                </div>
              </div>

              {/* ✅ Filter Bulan Dropdown */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-gray-500">
                  <Icons.Calendar />
                  <span className="text-sm font-medium">Filter Bulan:</span>
                </div>
                <select
                  value={selectedBulan}
                  onChange={(e) => setSelectedBulan(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-800 text-sm rounded-xl px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer min-w-[180px]"
                >
                  <option value="">Semua Bulan</option>
                  {daftarBulan.map(bulan => (
                    <option key={bulan} value={bulan}>{bulan}</option>
                  ))}
                </select>

                {/* Tombol reset filter */}
                {selectedBulan && (
                  <button
                    onClick={() => setSelectedBulan("")}
                    className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-xl transition-colors font-medium"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Badge info filter aktif */}
            {selectedBulan && (
              <div className="mt-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-blue-700 font-medium">
                  Menampilkan data: <span className="font-bold">{selectedBulan}</span>
                  {" "}({filteredReportData.length} transaksi)
                </span>
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* ✅ Kirim filteredReportData, bukan allData */}
              {/* SummaryReport cukup terima data yang sudah difilter */}
              <SummaryReport data={filteredReportData} />
            </div>
          </div>
        </div>

        {/* Spreadsheet Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-6">
            <SpreadsheetTable
              data={transactionData}
              onSave={updateTransactionData}
              onClear={clearTransactionData}
              onAddToReport={addToReport}
            />
          </div>
        </div>
      </div>

      <footer className="bg-white border-t border-gray-200 py-4 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-gray-600 text-sm">© 2025 • Terapay</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-medium">
                <Icons.AutoSave />
                <span>Auto-save aktif</span>
              </div>
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">Data tersimpan di browser</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}