"use client";

import { useEffect, useState } from "react";
import SpreadsheetTable from "./components/SpreadsheetTable";
import SummaryReport from "./components/SummaryReport";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6 space-y-6 md:space-y-8">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-6 md:p-8">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wide mb-2">
            LAPORAN PENDAPATAN TERAPIS
          </h1>
          {userName && (
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mt-2">
              <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                <span className="text-white">👤</span>
              </div>
              <span className="text-white font-medium capitalize text-sm md:text-base">
                {userName}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* SUMMARY REPORT SECTION */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-3 rounded-xl">
            <span className="text-2xl text-indigo-600">📊</span>
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-800">
              Summary Report
            </h2>
            <p className="text-gray-600 text-sm">
              Ringkasan pendapatan dan komisi
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <SummaryReport data={reportData} />
        </div>
      </div>

      {/* SPREADSHEET TABLE SECTION */}
      <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
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
        <p className="text-gray-500 text-sm">
          Sistem Laporan Pendapatan Terapis • Data tersimpan otomatis di browser Anda
        </p>
        <div className="flex justify-center items-center gap-2 mt-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-400">Auto-save aktif</span>
        </div>
      </div>
    </div>
  );
}