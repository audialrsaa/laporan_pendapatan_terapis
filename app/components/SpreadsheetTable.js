"use client";

import React, { useState, useEffect } from "react";

const SpreadsheetTable = ({ data, onSave }) => {
  const [tableData, setTableData] = useState(data || []);

  const [formData, setFormData] = useState({
    tanggal: "",
    terapis: "",
    shift: "",
    namaTamu: "",
    jenisTreatment: "",
    durasi: "",
    ruang: "",
    report: "",
    nominal: "",
  });

  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    setTableData(data || []);
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "nominal" ? Number(value) || 0 : value,
    }));
  };

  const handleAddOrUpdateData = () => {
    if (!formData.terapis || !formData.shift || !formData.nominal) {
      alert("Nama Terapis, Shift, dan Nominal wajib diisi!");
      return;
    }

    const today = new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    let updatedData;
    if (editIndex !== null) {
      updatedData = [...tableData];
      updatedData[editIndex] = { ...formData, tanggal: today };
      setEditIndex(null);
    } else {
      updatedData = [...tableData, { ...formData, tanggal: today }];
    }

    setTableData(updatedData);
    onSave?.(updatedData);
    setFormData({
      tanggal: "",
      terapis: "",
      shift: "",
      namaTamu: "",
      jenisTreatment: "",
      durasi: "",
      ruang: "",
      report: "",
      nominal: "",
    });
  };

  const handleDelete = (index) => {
    const updatedData = tableData.filter((_, i) => i !== index);
    setTableData(updatedData);
    onSave?.(updatedData);
  };

  const handleEdit = (index) => {
    setFormData(tableData[index]);
    setEditIndex(index);
  };

  const totalNominal = tableData.reduce((sum, row) => sum + (Number(row.nominal) || 0), 0);

  // tanggal
  const dates = tableData.map((row) => new Date(row.tanggal));
  const minDate = dates.length > 0 ? new Date(Math.min(...dates)).toLocaleDateString("id-ID") : "-";
  const maxDate = dates.length > 0 ? new Date(Math.max(...dates)).toLocaleDateString("id-ID") : "-";

  // ✅ Rekap per bulan + terapis + komisi
  const monthlySummary = tableData.reduce((acc, row) => {
    if (!row.tanggal || !row.terapis) return acc;
    const parts = row.tanggal.split(" ");
    if (parts.length < 3) return acc;
    const monthName = parts[1];
    const year = parts[2];
    const monthKey = `${monthName} ${year}`;
    const therapistKey = row.terapis;

    if (!acc[monthKey]) acc[monthKey] = {};
    if (!acc[monthKey][therapistKey]) acc[monthKey][therapistKey] = { nominal: 0 };

    acc[monthKey][therapistKey].nominal += Number(row.nominal) || 0;
    return acc;
  }, {});

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Input Data Transaksi</h2>

      {/* Form Input */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.keys(formData).map((key) =>
          key !== "tanggal" ? (
            <input
              key={key}
              type={key === "nominal" ? "number" : "text"}
              name={key}
              placeholder={
                key.charAt(0).toUpperCase() +
                key.slice(1) +
                (["terapis", "shift", "nominal"].includes(key) ? " *" : "")
              }
              value={formData[key]}
              onChange={handleChange}
              className="border border-gray-300 bg-white text-gray-800 placeholder-gray-500 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
            />
          ) : null
        )}
      </div>

      <button
        onClick={handleAddOrUpdateData}
        className={`px-6 py-2 rounded-xl font-semibold shadow-md transition duration-300 ease-in-out ${
          editIndex !== null
            ? "bg-green-500 hover:bg-green-600 text-white"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        }`}
      >
        {editIndex !== null ? "✅ Update Data" : "➕ Tambah Data"}
      </button>

      {/* Data Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {Object.keys(formData).map((key) => (
                <th
                  key={key}
                  className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </th>
              ))}
              <th className="p-3 text-xs font-semibold uppercase tracking-wider text-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableData.length === 0 ? (
              <tr>
                <td
                  colSpan={Object.keys(formData).length + 1}
                  className="text-center p-6 text-gray-500 italic"
                >
                  Belum ada data
                </td>
              </tr>
            ) : (
              tableData.map((row, index) => (
                <tr key={index} className="hover:bg-indigo-50 transition-colors">
                  {Object.keys(formData).map((key) => (
                    <td key={key} className="p-3 text-sm text-gray-700">
                      {key === "nominal"
                        ? `Rp ${Number(row[key]).toLocaleString("id-ID")}`
                        : row[key]}
                    </td>
                  ))}
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="px-3 py-1 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 text-xs font-medium transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-xs font-medium transition"
                    >
                      🗑️ Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot className="bg-gray-100">
            <tr>
              <td
                colSpan={Object.keys(formData).length - 1}
                className="px-4 py-3 font-bold text-right text-gray-700"
              >
                Total Nominal Periode ({minDate} s/d {maxDate}):
              </td>
              <td className="px-4 py-3 text-sm font-extrabold text-indigo-600">
                Rp {totalNominal.toLocaleString("id-ID")}
              </td>
              <td className="bg-gray-100"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ✅ Rekap per Bulan & Terapis */}
      <div>
        <h2 className="text-xl font-bold mb-3 text-gray-800">📊 Pendapatan Per Bulan & Terapis</h2>
        <div className="overflow-x-auto border border-gray-200 rounded-xl">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Bulan
                </th>
                <th className="p-3 border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Terapis
                </th>
                <th className="p-3 border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Total Nominal Treatment
                </th>
                <th className="p-3 border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Total Komisi (2%)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.keys(monthlySummary).length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center p-4 text-gray-500 italic">
                    Belum ada data bulanan
                  </td>
                </tr>
              ) : (
                Object.entries(monthlySummary).map(([month, therapists]) =>
                  Object.entries(therapists).map(([terapis, data]) => (
                    <tr key={`${month}-${terapis}`} className="hover:bg-indigo-50 transition-colors">
                      <td className="p-3 text-sm text-gray-700 font-medium">{month}</td>
                      <td className="p-3 text-sm text-gray-700">{terapis}</td>
                      <td className="p-3 text-sm text-gray-700">
                        <span className="font-semibold text-indigo-600">
                          Rp {data.nominal.toLocaleString("id-ID")}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-gray-700">
                        <span className="font-semibold text-green-600">
                          Rp {(data.nominal * 0.02).toLocaleString("id-ID")}
                        </span>
                      </td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SpreadsheetTable;
