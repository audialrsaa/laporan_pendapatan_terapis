"use client";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useState, useEffect } from "react";

// ─── Nama terapis tunggal ────────────────────────────────────────────────────
const NAMA_TERAPIS = "Adhe";

const Icons = {
  Report: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
  Calendar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  Download: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  ),
  Money: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  ChevronRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  ),
  Transaction: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  EmptyState: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  )
};

const SummaryReport = ({ data, selectedBulan }) => {
  const [perTerapisData, setPerTerapisData] = useState({});
  const [perBulanData, setPerBulanData] = useState({});
  const [totalNominal, setTotalNominal] = useState(0);
  const [activeTab, setActiveTab] = useState("perTerapis");
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    if (!data) return;

    if (data.length === 0) {
      setPerTerapisData({});
      setPerBulanData({});
      setTotalNominal(0);
      return;
    }

    // Filter data berdasarkan bulan yang dipilih
    const filteredData = selectedBulan
      ? data.filter(item => {
          if (!item.tanggal) return false;
          const d = new Date(item.tanggal);
          const bulanKey = `${d.toLocaleString("id-ID", { month: "long" })} ${d.getFullYear()}`;
          return bulanKey === selectedBulan;
        })
      : data;

    const total = filteredData.reduce((sum, item) => sum + (Number(item.nominal) || 0), 0);
    setTotalNominal(total);

    const terapisReport = {};
    const bulanReport = {};

    data.forEach(item => {
      // ── Normalisasi: trim spasi + paksa nama terapis = NAMA_TERAPIS ──
      const terapis = NAMA_TERAPIS;
      const nominal = item.nominal;
      const tanggal = item.tanggal;

      if (nominal) {
        if (!terapisReport[terapis]) {
          terapisReport[terapis] = {
            totalNominal: 0,
            detailBulan: {},
            totalTransaksi: 0
          };
        }
        terapisReport[terapis].totalNominal += (Number(nominal) || 0);
        terapisReport[terapis].totalTransaksi += 1;

        if (tanggal) {
          const d = new Date(tanggal);
          const bulanKey = `${d.toLocaleString("id-ID", { month: "long" })} ${d.getFullYear()}`;

          if (!terapisReport[terapis].detailBulan[bulanKey]) {
            terapisReport[terapis].detailBulan[bulanKey] = 0;
          }
          terapisReport[terapis].detailBulan[bulanKey] += (Number(nominal) || 0);

          if (!bulanReport[bulanKey]) {
            bulanReport[bulanKey] = {
              totalNominal: 0,
              terapis: {},
              totalTransaksi: 0
            };
          }
          bulanReport[bulanKey].totalNominal += (Number(nominal) || 0);
          bulanReport[bulanKey].totalTransaksi += 1;

          if (!bulanReport[bulanKey].terapis[terapis]) {
            bulanReport[bulanKey].terapis[terapis] = 0;
          }
          bulanReport[bulanKey].terapis[terapis] += (Number(nominal) || 0);
        }
      }
    });

    setPerTerapisData(terapisReport);
    setPerBulanData(bulanReport);
  }, [data, selectedBulan]);

  const totalKomisi = totalNominal * 0.02;

  const toggleRow = (key) => {
    setExpandedRows(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleExportPDF = () => {
    const doc = new jsPDF("l", "mm", "a4");

    const exportDate = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 297, 25, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("LAPORAN PENDAPATAN TERAPIS", 14, 15);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Tanggal Export: ${exportDate}`, 14, 22);

    const groupedByMonth = {};

    data.forEach((item) => {
      if (!item.tanggal) return;

      const date = new Date(item.tanggal);
      const monthYear = date.toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      });

      if (!groupedByMonth[monthYear]) {
        groupedByMonth[monthYear] = [];
      }

      groupedByMonth[monthYear].push(item);
    });

    let startY = 35;

    Object.entries(groupedByMonth).forEach(([bulan, transaksi]) => {
      if (startY > 180) {
        doc.addPage();
        startY = 20;
        doc.setFillColor(37, 99, 235);
        doc.rect(0, 0, 297, 10, 'F');
        startY = 15;
      }

      doc.setTextColor(37, 99, 235);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`Bulan: ${bulan}`, 14, startY);

      const rows = transaksi.map((item) => [
        new Date(item.tanggal).toLocaleDateString("id-ID"),
        NAMA_TERAPIS,
        item.shift,
        item.jenisTreatment,
        item.durasi ? `${item.durasi} min` : "",
        item.ruang || "-",
        `Rp ${(Number(item.nominal) || 0).toLocaleString("id-ID")}`,
        `Rp ${(Number(item.nominal) * 0.02).toLocaleString("id-ID")}`,
      ]);

      autoTable(doc, {
        head: [[
          "Tanggal",
          "Terapis",
          "Shift",
          "Treatment",
          "Durasi",
          "Ruang",
          "Nominal",
          "Komisi 2%"
        ]],
        body: rows,
        startY: startY + 5,
        styles: {
          fontSize: 8,
          cellPadding: 3,
          lineColor: [226, 232, 240],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [37, 99, 235],
          textColor: [255, 255, 255],
          fontSize: 8,
          fontStyle: 'bold',
          halign: 'center'
        },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 30 },
          2: { cellWidth: 15 },
          3: { cellWidth: 40 },
          4: { cellWidth: 20 },
          5: { cellWidth: 25 },
          6: { cellWidth: 30, halign: 'right' },
          7: { cellWidth: 30, halign: 'right' }
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251]
        }
      });
      startY = doc.lastAutoTable.finalY + 10;
    });

    doc.addPage();
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 297, 15, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("RINGKASAN KESELURUHAN", 14, 10);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Total Pendapatan: Rp ${totalNominal.toLocaleString('id-ID')}`, 20, 30);
    doc.text(`Total Komisi (2%): Rp ${totalKomisi.toLocaleString('id-ID')}`, 20, 40);
    doc.text(`Total Transaksi: ${data.length} transaksi`, 20, 50);
    doc.text(`Terapis: ${NAMA_TERAPIS}`, 20, 60);

    doc.save("Laporan_Pendapatan_Per_Bulan.pdf");
  };

  const renderTerapisRows = () => {
    if (Object.keys(perTerapisData).length === 0) {
      return (
        <tr>
          <td colSpan={3} className="text-center p-12 text-gray-500">
            <div className="flex flex-col items-center justify-center">
              <div className="text-blue-200 mb-4">
                <Icons.EmptyState />
              </div>
              <p className="text-lg font-medium text-gray-700 mb-2">Belum ada data terapis</p>
              <p className="text-sm text-gray-500">Tambah data transaksi untuk melihat laporan</p>
            </div>
          </td>
        </tr>
      );
    }

    const rows = [];

    Object.entries(perTerapisData).forEach(([terapis, val]) => {
      const isExpanded = expandedRows[`terapis-${terapis}`];

      rows.push(
        <tr
          key={`terapis-${terapis}`}
          className="group cursor-pointer hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80 transition-all duration-200 border-b border-gray-200"
          onClick={() => toggleRow(`terapis-${terapis}`)}
        >
          <td className="p-4">
            <div className="flex items-center gap-3">
              <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
                <Icons.ChevronRight />
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-2.5 rounded-xl shadow-md shadow-blue-200">
                  <Icons.User />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{terapis}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      {val.totalTransaksi} transaksi
                    </span>
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                      {Object.keys(val.detailBulan).length} bulan
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </td>
          <td className="p-4">
            <div className="font-semibold text-lg text-gray-800">
              Rp {val.totalNominal.toLocaleString('id-ID')}
            </div>
          </td>
          <td className="p-4">
            <div className="font-semibold text-lg bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              Rp {(val.totalNominal * 0.02).toLocaleString('id-ID')}
            </div>
          </td>
        </tr>
      );

      if (isExpanded) {
        Object.entries(val.detailBulan)
          .sort((a, b) => {
            const dateA = new Date(a[0].split(' ')[1], a[0].split(' ')[0]);
            const dateB = new Date(b[0].split(' ')[1], b[0].split(' ')[0]);
            return dateB - dateA;
          })
          .forEach(([bulan, nominal]) => {
            rows.push(
              <tr
                key={`${terapis}-${bulan}`}
                className="bg-gradient-to-r from-gray-50/80 to-gray-100/30 hover:bg-gray-100/50 transition-colors duration-150 border-b border-gray-200"
              >
                <td className="p-4 pl-14">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">{bulan}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm font-medium text-gray-800">
                    Rp {nominal.toLocaleString('id-ID')}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm font-medium text-blue-600">
                    Rp {(nominal * 0.02).toLocaleString('id-ID')}
                  </div>
                </td>
              </tr>
            );
          });
      }
    });

    return rows;
  };

  const renderBulanRows = () => {
    if (Object.keys(perBulanData).length === 0) {
      return (
        <tr>
          <td colSpan={3} className="text-center p-12 text-gray-500">
            <div className="flex flex-col items-center justify-center">
              <div className="text-blue-200 mb-4">
                <Icons.EmptyState />
              </div>
              <p className="text-lg font-medium text-gray-700 mb-2">Belum ada data bulanan</p>
              <p className="text-sm text-gray-500">Data akan muncul setelah ada transaksi</p>
            </div>
          </td>
        </tr>
      );
    }

    const rows = [];

    Object.entries(perBulanData)
      .sort((a, b) => {
        const dateA = new Date(a[0].split(' ')[1], a[0].split(' ')[0]);
        const dateB = new Date(b[0].split(' ')[1], b[0].split(' ')[0]);
        return dateB - dateA;
      })
      .forEach(([bulan, val]) => {
        const isExpanded = expandedRows[`bulan-${bulan}`];

        rows.push(
          <tr
            key={`bulan-${bulan}`}
            className="group cursor-pointer hover:bg-gradient-to-r hover:from-indigo-50/80 hover:to-blue-50/80 transition-all duration-200 border-b border-gray-200"
            onClick={() => toggleRow(`bulan-${bulan}`)}
          >
            <td className="p-4">
              <div className="flex items-center gap-3">
                <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
                  <Icons.ChevronRight />
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white p-2.5 rounded-xl shadow-md shadow-indigo-200">
                    <Icons.Calendar />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{bulan}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                        {val.totalTransaksi} transaksi
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        {Object.keys(val.terapis).length} terapis
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </td>
            <td className="p-4">
              <div className="font-semibold text-lg text-gray-800">
                Rp {val.totalNominal.toLocaleString('id-ID')}
              </div>
            </td>
            <td className="p-4">
              <div className="font-semibold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Rp {(val.totalNominal * 0.02).toLocaleString('id-ID')}
              </div>
            </td>
          </tr>
        );

        if (isExpanded) {
          Object.entries(val.terapis)
            .sort((a, b) => b[1] - a[1])
            .forEach(([terapis, nominal]) => {
              rows.push(
                <tr
                  key={`${bulan}-${terapis}`}
                  className="bg-gradient-to-r from-gray-50/80 to-gray-100/30 hover:bg-gray-100/50 transition-colors duration-150 border-b border-gray-200"
                >
                  <td className="p-4 pl-14">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-1 bg-indigo-400 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">{terapis}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-gray-800">
                      Rp {nominal.toLocaleString('id-ID')}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-indigo-600">
                      Rp {(nominal * 0.02).toLocaleString('id-ID')}
                    </div>
                  </td>
                </tr>
              );
            });
        }
      });

    return rows;
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-1"></div>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg shadow-blue-200">
              <Icons.Money />
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-600">Total Pendapatan</h2>
              <p className="text-2xl font-bold text-gray-800">
                Rp {totalNominal.toLocaleString('id-ID')}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <span className="text-sm font-medium text-gray-700">Komisi 2%</span>
              <span className="text-lg font-bold text-blue-600">
                Rp {totalKomisi.toLocaleString('id-ID')}
              </span>
            </div>

            <button
              onClick={handleExportPDF}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
            >
              <Icons.Download />
              <span>Export PDF Report</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full group-hover:bg-white/30 transition-colors">
                {data.length}
              </span>
            </button>

            <div className="flex justify-between text-sm text-gray-600 px-2 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>{data.length} transaksi</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                <span>{NAMA_TERAPIS}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden lg:col-span-2">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-2 rounded-xl shadow-md shadow-blue-200">
                  <Icons.Report />
                </div>
                Laporan Detail Pendapatan
              </h2>
              <p className="text-gray-600 text-sm mt-1">Analisis berdasarkan terapis dan bulan</p>
            </div>

            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab("perTerapis")}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeTab === "perTerapis"
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Icons.User />
                Per Terapis
              </button>
              <button
                onClick={() => setActiveTab("perBulan")}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeTab === "perBulan"
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Icons.Calendar />
                Per Bulan
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {activeTab === "perTerapis" ? "Terapis & Bulan" : "Bulan & Terapis"}
                </th>
                <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Total Nominal
                </th>
                <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Komisi (2%)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {activeTab === "perTerapis" ? renderTerapisRows() : renderBulanRows()}
            </tbody>
          </table>
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">
                  {Object.keys(activeTab === "perTerapis" ? perTerapisData : perBulanData).length} entri
                </span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <span className="text-gray-600">
                  Total komisi: <span className="font-semibold text-blue-600">Rp {totalKomisi.toLocaleString('id-ID')}</span>
                </span>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Klik baris untuk melihat detail
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SummaryReport;