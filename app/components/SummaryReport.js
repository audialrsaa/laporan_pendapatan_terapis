"use client";

//cek

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useState, useEffect } from "react";

// Ikon SVG
const Icons = {
  Report: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Calendar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Download: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Money: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  ChevronRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  Transaction: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  EmptyState: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
};

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
      headStyles: { fillColor: [66, 133, 244] }, // Biru
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [240, 248, 255] } // Biru muda
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
              <div className="flex justify-center mb-2">
                <Icons.EmptyState />
              </div>
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
          className="bg-gradient-to-r from-blue-50 to-sky-50 text-gray-800 hover:from-blue-100 hover:to-sky-100 transition duration-200 border-b border-blue-100"
        >
          <td className="p-4 font-bold">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2 rounded-lg">
                <Icons.User />
              </div>
              <div>
                {terapis}
                <div className="text-sm font-normal text-blue-600 mt-1">
                  {Object.keys(val.detailBulan).length} bulan aktif
                </div>
              </div>
            </div>
          </td>
          <td className="p-4 font-bold text-lg">
            Rp {val.totalNominal.toLocaleString('id-ID')}
          </td>
          <td className="p-4 font-bold text-blue-700 text-lg">
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
                <Icons.ChevronRight />
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {bulan}
                </span>
              </div>
            </td>
            <td className="p-4 text-base">
              Rp {nominal.toLocaleString('id-ID')}
            </td>
            <td className="p-4 text-base text-blue-600">
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
              <div className="flex justify-center mb-2">
                <Icons.EmptyState />
              </div>
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
                <Icons.Calendar />
              </div>
              <div>
                {bulan}
                <div className="text-sm font-normal text-blue-600 mt-1">
                  {Object.keys(val.terapis).length} terapis
                </div>
              </div>
            </div>
          </td>
          <td className="p-4 font-bold text-lg">
            Rp {val.totalNominal.toLocaleString('id-ID')}
          </td>
          <td className="p-4 font-bold text-blue-700 text-lg">
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
                <Icons.ChevronRight />
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {terapis}
                </span>
              </div>
            </td>
            <td className="p-4 text-base">
              Rp {nominal.toLocaleString('id-ID')}
            </td>
            <td className="p-4 text-base text-blue-600">
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
      <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-xl border border-blue-100 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800 flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <Icons.Money />
            </div>
            Total Pendapatan
          </h2>
          <p className="text-4xl font-extrabold mb-1 bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            Rp {totalNominal.toLocaleString('id-ID')}
          </p>
          <p className="text-base text-gray-600 mb-6">
            Komisi 2%: <span className="font-bold text-blue-600">Rp {totalKomisi.toLocaleString('id-ID')}</span>
          </p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={handleExportPDF}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          >
            <Icons.Download />
            <span>Export PDF Report</span>
          </button>
          <div className="flex justify-between text-base text-gray-600 px-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>{data.length} transaksi</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>{Object.keys(perTerapisData).length} terapis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Pendapatan per Terapis & Per Bulan */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 lg:col-span-2">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-1">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2 rounded-lg">
                <Icons.Report />
              </div>
              Laporan Detail Pendapatan
            </h2>
            <p className="text-gray-600 text-sm">Analisis berdasarkan terapis dan bulan</p>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex bg-blue-100 p-1 rounded-xl shadow-inner">
            <button
              onClick={() => setActiveTab("perTerapis")}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === "perTerapis" 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                  : 'text-blue-700 hover:text-blue-900 hover:bg-white'
              }`}
            >
              <Icons.User className="h-4 w-4" />
              Per Terapis
            </button>
            <button
              onClick={() => setActiveTab("perBulan")}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === "perBulan" 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                  : 'text-blue-700 hover:text-blue-900 hover:bg-white'
              }`}
            >
              <Icons.Calendar className="h-4 w-4" />
              Per Bulan
            </button>
          </div>
        </div>

        {/* Tabel Container */}
        <div className="rounded-xl border border-gray-200 overflow-hidden shadow-lg">
          {/* Tabel Header */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 p-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="font-semibold text-blue-800 text-lg">
                {activeTab === "perTerapis" ? "Terapis & Bulan" : "Bulan & Terapis"}
              </div>
              <div className="font-semibold text-blue-800 text-lg">Total Nominal</div>
              <div className="font-semibold text-blue-800 text-lg">Komisi (2%)</div>
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
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-t border-blue-200">
            <div className="flex flex-wrap justify-between items-center text-sm text-blue-700">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>{Object.keys(activeTab === "perTerapis" ? perTerapisData : perBulanData).length} entri</span>
                </div>
                <div className="hidden md:block">
                  <span className="text-blue-400">•</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
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