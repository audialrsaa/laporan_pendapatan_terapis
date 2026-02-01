"use client";

import { useEffect, useState } from "react";
import SpreadsheetTable from "./components/SpreadsheetTable";
import SummaryReport from "./components/SummaryReport";

// Ikon User
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export default function DashboardPage() {
  const [transactionData, setTransactionData] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    console.log("📌 Isi currentUser dari localStorage:", storedUser);

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.username) {
          setUserName(parsedUser.username);
        }
      } catch (err) {
        console.error("❌ Gagal parse currentUser:", err);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-6 space-y-6 md:space-y-8">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-6 md:p-8">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wide mb-2">
            LAPORAN PENDAPATAN TERAPIS
          </h1>
          {userName && (
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mt-2">
              <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                <UserIcon className="text-white" />
              </div>
              <span className="text-white font-medium capitalize text-sm md:text-base">
                {userName}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* SUMMARY REPORT SECTION */}
      <div className="bg-white rounded-2xl shadow-xl border border-blue-200 p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-3 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-800">
              Summary Report
            </h2>
            <p className="text-blue-600 text-sm">
              Ringkasan pendapatan dan komisi
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <SummaryReport data={reportData} />
        </div>
      </div>

      {/* SPREADSHEET TABLE SECTION */}
      <div className="bg-gradient-to-b from-white to-blue-50 rounded-2xl shadow-xl border border-blue-200 overflow-hidden">
        <div className="p-4 md:p-6">
          <SpreadsheetTable
            data={transactionData}
            onSave={updateTransactionData}
            onClear={clearTransactionData}
            onAddToReport={addToReport}
          />
        </div>
      </div>

      {/* FOOTER */}
      <div className="text-center py-4">
        <p className="text-blue-600 text-sm">
          Sistem Laporan Pendapatan Terapis • Data tersimpan otomatis di browser Anda
        </p>
        <div className="flex justify-center items-center gap-2 mt-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-blue-400">Auto-save aktif</span>
        </div>
      </div>
    </div>
  );
}