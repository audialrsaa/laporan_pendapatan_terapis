"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useState, useEffect } from "react";

const SummaryReport = ({ data }) => {
  const [perTerapisData, setPerTerapisData] = useState({});
  const [perBulanData, setPerBulanData] = useState({});
  const [totalNominal, setTotalNominal] = useState(0);
  const [activeTab, setActiveTab] = useState("perTerapis"); // "perTerapis" atau "perBulan"

  // Proses data untuk summary report
  useEffect(() => {
    if (!data || data.length === 0) {
      setPerTerapisData({});
      setPerBulanData({});
      setTotalNominal(0);
      return;
    }

    console.log("📊 Data di SummaryReport:", data);

    // 1. Hitung total nominal
    const total = data.reduce((sum, item) => sum + (Number(item.nominal) || 0), 0);
    setTotalNominal(total);

    // 2. Hitung pendapatan per terapis (dengan detail bulan)
    const terapisReport = {};
    const bulanReport = {};

    data.forEach(item => {
      const { terapis, nominal, tanggal } = item;
      
      if (terapis && nominal) {
        // Untuk per terapis
        if (!terapisReport[terapis]) {
          terapisReport[terapis] = { 
            totalNominal: 0,
            detailBulan: {}
          };
        }
        terapisReport[terapis].totalNominal += (Number(nominal) || 0);

        // Tambahkan detail per bulan untuk setiap terapis
        if (tanggal) {
          const d = new Date(tanggal);
          const bulanKey = `${d.toLocaleString("id-ID", { month: "long" })} ${d.getFullYear()}`;
          
          if (!terapisReport[terapis].detailBulan[bulanKey]) {
            terapisReport[terapis].detailBulan[bulanKey] = 0;
          }
          terapisReport[terapis].detailBulan[bulanKey] += (Number(nominal) || 0);
        }

        // Untuk per bulan (global)
        if (tanggal) {
          const d = new Date(tanggal);
          const bulanKey = `${d.toLocaleString("id-ID", { month: "long" })} ${d.getFullYear()}`;
          
          if (!bulanReport[bulanKey]) {
            bulanReport[bulanKey] = { totalNominal: 0, terapis: {} };
          }
          bulanReport[bulanKey].totalNominal += (Number(nominal) || 0);
          
          if (!bulanReport[bulanKey].terapis[terapis]) {
            bulanReport[bulanKey].terapis[terapis] = 0;
          }
          bulanReport[bulanKey].terapis[terapis] += (Number(nominal) || 0);
        }
      }
    });

    setPerTerapisData(terapisReport);
    setPerBulanData(bulanReport);
  }, [data]);

  const totalKomisi = totalNominal * 0.02;

  // export ke PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(14);
    doc.text("Laporan Pendapatan Terapis", 14, 15);

    const date = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    doc.setFontSize(10);
    doc.text(`Tanggal export: ${date}`, 14, 22);

    // Total Pendapatan
    doc.setFontSize(11);
    doc.text(`Total Pendapatan: Rp ${totalNominal.toLocaleString("id-ID")}`, 14, 30);
    doc.text(`Total Komisi (2%): Rp ${totalKomisi.toLocaleString("id-ID")}`, 14, 36);

    // Tabel per terapis untuk PDF (disertai detail bulan)
    const therapistTable = [];
    Object.entries(perTerapisData).forEach(([terapis, val]) => {
      // Baris utama untuk terapis
      therapistTable.push([
        terapis,
        `Rp ${val.totalNominal.toLocaleString("id-ID")}`,
        `Rp ${(val.totalNominal * 0.02).toLocaleString("id-ID")}`
      ]);
      
      // Baris detail bulan untuk terapis ini
      Object.entries(val.detailBulan).forEach(([bulan, nominal]) => {
        therapistTable.push([
          `  └─ ${bulan}`,
          `Rp ${nominal.toLocaleString("id-ID")}`,
          `Rp ${(nominal * 0.02).toLocaleString("id-ID")}`
        ]);
      });
    });

    autoTable(doc, {
      head: [["Terapis", "Total Nominal", "Komisi 2%"]],
      body: therapistTable,
      startY: 45,
      styles: { 
        halign: "left",
        fontSize: 9
      },
      headStyles: { fillColor: [120, 50, 200] },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });

    // Footer
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    doc.setFontSize(9);
    doc.text("© Sistem Laporan Pendapatan Terapis", 14, pageHeight - 10);

    doc.save("Laporan_Terapis.pdf");
  };

  // Fungsi untuk render baris per terapis
  const renderTerapisRows = () => {
    if (Object.keys(perTerapisData).length === 0) {
      return (
        <tr>
          <td colSpan={3} className="text-center p-6 text-gray-500">
            <div className="py-4">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-lg font-medium">Belum ada data terapis</p>
              <p className="text-sm mt-1">Tambah data transaksi untuk melihat laporan</p>
            </div>
          </td>
        </tr>
      );
    }

    const rows = [];
    
    Object.entries(perTerapisData).forEach(([terapis, val], index) => {
      // Baris utama untuk terapis
      rows.push(
        <tr
          key={`terapis-${terapis}`}
          className="bg-gradient-to-r from-indigo-50 to-purple-50 text-gray-800 hover:from-indigo-100 hover:to-purple-100 transition duration-200 border-b border-indigo-100"
        >
          <td className="p-4 font-bold">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-2 rounded-lg">
                👤
              </div>
              <div>
                {terapis}
                <div className="text-sm font-normal text-gray-600 mt-1">
                  {Object.keys(val.detailBulan).length} bulan aktif
                </div>
              </div>
            </div>
          </td>
          <td className="p-4 font-bold text-lg">
            Rp {val.totalNominal.toLocaleString('id-ID')}
          </td>
          <td className="p-4 font-bold text-green-700 text-lg">
            Rp {(val.totalNominal * 0.02).toLocaleString('id-ID')}
          </td>
        </tr>
      );
      
      // Baris detail bulan untuk terapis ini
      Object.entries(val.detailBulan).forEach(([bulan, nominal]) => {
        rows.push(
          <tr
            key={`${terapis}-${bulan}`}
            className="text-gray-600 hover:bg-gray-50 transition duration-150 border-b border-gray-100"
          >
            <td className="p-4 pl-12">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">↳</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {bulan}
                </span>
              </div>
            </td>
            <td className="p-4 text-base">
              Rp {nominal.toLocaleString('id-ID')}
            </td>
            <td className="p-4 text-base text-green-600">
              Rp {(nominal * 0.02).toLocaleString('id-ID')}
            </td>
          </tr>
        );
      });
    });
    
    return rows;
  };

  // Fungsi untuk render baris per bulan
  const renderBulanRows = () => {
    if (Object.keys(perBulanData).length === 0) {
      return (
        <tr>
          <td colSpan={3} className="text-center p-6 text-gray-500">
            <div className="py-4">
              <div className="text-4xl mb-2">📅</div>
              <p className="text-lg font-medium">Belum ada data bulanan</p>
              <p className="text-sm mt-1">Data akan muncul setelah ada transaksi</p>
            </div>
          </td>
        </tr>
      );
    }

    const rows = [];
    
    Object.entries(perBulanData).forEach(([bulan, val]) => {
      // Baris utama untuk bulan
      rows.push(
        <tr
          key={`bulan-${bulan}`}
          className="bg-gradient-to-r from-blue-50 to-cyan-50 text-gray-800 hover:from-blue-100 hover:to-cyan-100 transition duration-200 border-b border-blue-100"
        >
          <td className="p-4 font-bold">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-2 rounded-lg">
                📅
              </div>
              <div>
                {bulan}
                <div className="text-sm font-normal text-gray-600 mt-1">
                  {Object.keys(val.terapis).length} terapis
                </div>
              </div>
            </div>
          </td>
          <td className="p-4 font-bold text-lg">
            Rp {val.totalNominal.toLocaleString('id-ID')}
          </td>
          <td className="p-4 font-bold text-green-700 text-lg">
            Rp {(val.totalNominal * 0.02).toLocaleString('id-ID')}
          </td>
        </tr>
      );
      
      // Baris detail terapis untuk bulan ini
      Object.entries(val.terapis).forEach(([terapis, nominal]) => {
        rows.push(
          <tr
            key={`${bulan}-${terapis}`}
            className="text-gray-600 hover:bg-gray-50 transition duration-150 border-b border-gray-100"
          >
            <td className="p-4 pl-12">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">↳</span>
                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm">
                  {terapis}
                </span>
              </div>
            </td>
            <td className="p-4 text-base">
              Rp {nominal.toLocaleString('id-ID')}
            </td>
            <td className="p-4 text-base text-green-600">
              Rp {(nominal * 0.02).toLocaleString('id-ID')}
            </td>
          </tr>
        );
      });
    });
    
    return rows;
  };

  return (
    <>
      {/* Card Total Pendapatan */}
      <div className="bg-gradient-to-br from-white to-indigo-50 p-6 rounded-2xl shadow-xl border border-indigo-100 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800 flex items-center gap-2">
            <span className="text-2xl">💰</span>
            Total Pendapatan
          </h2>
          <p className="text-4xl font-extrabold mb-1 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Rp {totalNominal.toLocaleString('id-ID')}
          </p>
          <p className="text-base text-gray-600 mb-6">
            Komisi 2%: <span className="font-bold text-green-600">Rp {totalKomisi.toLocaleString('id-ID')}</span>
          </p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={handleExportPDF}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          >
            <span className="text-xl">⬇️</span>
            <span>Export PDF Report</span>
          </button>
          <div className="flex justify-between text-base text-gray-600 px-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{data.length} transaksi</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>{Object.keys(perTerapisData).length} terapis</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🧾 Tabel Pendapatan per Terapis & Per Bulan */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 lg:col-span-2">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-1">
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-2 rounded-lg">📊</span>
              Laporan Detail Pendapatan
            </h2>
            <p className="text-gray-600 text-sm">Analisis berdasarkan terapis dan bulan</p>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex bg-gray-100 p-1 rounded-xl shadow-inner">
            <button
              onClick={() => setActiveTab("perTerapis")}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === "perTerapis" 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white'
              }`}
            >
              <span>👤</span>
              Per Terapis
            </button>
            <button
              onClick={() => setActiveTab("perBulan")}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === "perBulan" 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white'
              }`}
            >
              <span>📅</span>
              Per Bulan
            </button>
          </div>
        </div>

        {/* Tabel Container */}
        <div className="rounded-xl border border-gray-200 overflow-hidden shadow-lg">
          {/* Tabel Header */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200 p-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="font-semibold text-indigo-800 text-lg">
                {activeTab === "perTerapis" ? "Terapis & Bulan" : "Bulan & Terapis"}
              </div>
              <div className="font-semibold text-indigo-800 text-lg">Total Nominal</div>
              <div className="font-semibold text-indigo-800 text-lg">Komisi (2%)</div>
            </div>
          </div>

          {/* Tabel Body */}
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full">
              <tbody>
                {activeTab === "perTerapis" ? renderTerapisRows() : renderBulanRows()}
              </tbody>
            </table>
          </div>

          {/* Footer Stats */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-t border-gray-200">
            <div className="flex flex-wrap justify-between items-center text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                  <span>{Object.keys(activeTab === "perTerapis" ? perTerapisData : perBulanData).length} entri</span>
                </div>
                <div className="hidden md:block">
                  <span className="text-gray-400">•</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Komisi total: <span className="font-semibold">Rp {totalKomisi.toLocaleString('id-ID')}</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SummaryReport;