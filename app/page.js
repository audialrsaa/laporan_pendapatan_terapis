"use client";

import { useEffect, useState } from "react";
import SpreadsheetTable from "./components/SpreadsheetTable";
import SummaryReport from "./components/SummaryReport";

// Ikon yang lebih modern
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
  )
};

export default function DashboardPage() {
  const [transactionData, setTransactionData] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.username) {
          setUserName(parsedUser.username);
        }
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

  const addToReport = (data) => {
    if (data && data.tanggal && data.terapis && data.nominal) {
      setReportData((prev) => {
        const newData = [...prev, data];
        localStorage.setItem("reportData", JSON.stringify(newData));
        return newData;
      });
    }
  };

  const updateTransactionData = (newData) => {
    setTransactionData(newData);
  };

  const clearTransactionData = () => {
    setTransactionData([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
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
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
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
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <SummaryReport data={reportData} />
            </div>
          </div>
        </div>

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
            <p className="text-gray-600 text-sm">
              © 2025 • Terapay
            </p>
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