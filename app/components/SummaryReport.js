"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const SummaryReport = ({ data }) => {
  // Hitung total nominal dari semua transaksi
  const calculateTotal = (key) => {
    return data.reduce((sum, item) => sum + (Number(item[key]) || 0), 0);
  };

  // Hitung pendapatan per terapis
  const calculatePerTerapis = () => {
    const report = {};
    data.forEach(item => {
      const { terapis, nominal } = item;
      if (!report[terapis]) {
        report[terapis] = { totalNominal: 0 };
      }
      report[terapis].totalNominal += (Number(nominal) || 0);
    });
    return report;
  };

  const totalNominal = calculateTotal('nominal');
  const totalKomisi = totalNominal * 0.02;
  const perTerapisData = calculatePerTerapis();

  // 📝 Export ke PDF
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

    // Tabel per terapis
    const therapistTable = Object.entries(perTerapisData).map(([terapis, val]) => [
      terapis,
      `Rp ${val.totalNominal.toLocaleString("id-ID")}`,
      `Rp ${(val.totalNominal * 0.02).toLocaleString("id-ID")}`
    ]);

    autoTable(doc, {
      head: [["Terapis", "Total Nominal", "Komisi 2%"]],
      body: therapistTable,
      startY: 45,
      styles: { halign: "left" },
      headStyles: { fillColor: [120, 50, 200] },
    });

    // Footer
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    doc.setFontSize(9);
    doc.text("© Sistem Laporan Pendapatan Terapis", 14, pageHeight - 10);

    doc.save("Laporan_Terapis.pdf");
  };

  return (
    <>
      {/* Card Total Pendapatan - Aesthetic Update */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col justify-between">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Total Pendapatan</h2>
        <p className="text-4xl font-extrabold mb-1 text-indigo-600">
          Rp {totalNominal.toLocaleString('id-ID')}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Komisi 2%: <span className="font-medium text-gray-600">Rp {totalKomisi.toLocaleString('id-ID')}</span>
        </p>
        <button
          onClick={handleExportPDF}
          className="w-full outline-none bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-indigo-700 transition duration-300 ease-in-out shadow-md"
        >
          ⬇️ Export PDF
        </button>
      </div>

      {/* Tabel Pendapatan per Terapis - Aesthetic Update */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 lg:col-span-2">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Pendapatan per Terapis</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-indigo-50 text-indigo-800">
                <th className="p-3 text-left text-sm font-semibold border-b border-indigo-200 rounded-tl-xl">Terapis</th>
                <th className="p-3 text-left text-sm font-semibold border-b border-indigo-200">Total Nominal</th>
                <th className="p-3 text-left text-sm font-semibold border-b border-indigo-200 rounded-tr-xl">Komisi (2%)</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(perTerapisData).map((terapis, index) => (
                <tr 
                  key={terapis} 
                  className={`transition-colors text-gray-700 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-100`}
                >
                  <td className="p-3 border-b border-gray-200 font-medium">{terapis}</td>
                  <td className="p-3 border-b border-gray-200">
                    Rp {perTerapisData[terapis].totalNominal.toLocaleString('id-ID')}
                  </td>
                  <td className="p-3 border-b border-gray-200">
                    Rp {(perTerapisData[terapis].totalNominal * 0.02).toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default SummaryReport;