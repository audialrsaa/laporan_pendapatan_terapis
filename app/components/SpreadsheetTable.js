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

  // rekap per bulan
  const monthlySummary = tableData.reduce((acc, row) => {
    if (!row.tanggal) return acc;
    const parts = row.tanggal.split(" ");
    if (parts.length < 3) return acc;
    const monthName = parts[1];
    const year = parts[2];
    const monthKey = `${monthName} ${year}`;
    if (!acc[monthKey]) {
      acc[monthKey] = { nominal: 0 };
    }
    acc[monthKey].nominal += Number(row.nominal) || 0;
    return acc;
  }, {});

  return (
    <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 rounded-2xl shadow-xl text-white space-y-8">
      {/* form */}
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
                (["terapis", "shift", "nominal"].includes(key) ? "*" : "")
              }
              value={formData[key]}
              onChange={handleChange}
              className="border border-white/30 bg-white/10 text-white placeholder-white/60 p-2 rounded-lg focus:ring-2 focus:ring-white focus:outline-none"
            />
          ) : null
        )}
      </div>

      <button
        onClick={handleAddOrUpdateData}
        className={`px-5 py-2 rounded-lg font-medium shadow-lg backdrop-blur-sm transition-colors ${
          editIndex !== null
            ? "bg-green-400 hover:bg-green-500 text-white"
            : "bg-white text-indigo-600 hover:bg-gray-100"
        }`}
      >
        {editIndex !== null ? "Update Data" : "Tambah Data"}
      </button>

      {/* table */}
      <div className="overflow-x-auto rounded-lg bg-white/10 backdrop-blur-sm">
        <table className="w-full border-collapse">
          <thead className="bg-white/20">
            <tr>
              {Object.keys(formData).map((key) => (
                <th key={key} className="p-3 text-left text-sm font-semibold border-b border-white/30">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </th>
              ))}
              <th className="p-3 border-b border-white/30 text-sm font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {tableData.length === 0 ? (
              <tr>
                <td
                  colSpan={Object.keys(formData).length + 1}
                  className="text-center p-4 text-white/80"
                >
                  Belum ada data
                </td>
              </tr>
            ) : (
              tableData.map((row, index) => (
                <tr key={index} className="hover:bg-white/10 transition-colors">
                  {Object.keys(formData).map((key) => (
                    <td key={key} className="p-3 border-b border-white/20">
                      {key === "nominal"
                        ? `Rp ${Number(row[key]).toLocaleString("id-ID")}`
                        : row[key]}
                    </td>
                  ))}
                  <td className="p-3 border-b border-white/20 space-x-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm font-medium"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot className="bg-white/20">
            <tr>
              <td
                colSpan={Object.keys(formData).length - 1}
                className="px-4 py-2 font-bold text-right"
              >
                Total ({minDate} s/d {maxDate}):
              </td>
              <td className="border px-4 py-2 text-right font-semibold">
                Rp {totalNominal.toLocaleString("id-ID")}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* rekap perbulan */}
      <div>
        <h2 className="text-lg font-bold mb-3">Pendapatan Per Bulan</h2>
        <div className="overflow-x-auto rounded-lg bg-white/10 backdrop-blur-sm">
          <table className="w-full border-collapse">
            <thead className="bg-white/20">
              <tr>
                <th className="p-3 border-b border-white/30 text-left text-sm font-semibold">Bulan</th>
                <th className="p-3 border-b border-white/30 text-left text-sm font-semibold">
                  Total Nominal Treatment
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(monthlySummary).length === 0 ? (
                <tr>
                  <td colSpan={2} className="text-center p-4 text-white/80">
                    Belum ada data bulanan
                  </td>
                </tr>
              ) : (
                Object.entries(monthlySummary).map(([month, data]) => (
                  <tr key={month} className="hover:bg-white/10 transition-colors">
                    <td className="p-3 border-b border-white/20 font-medium">{month}</td>
                    <td className="p-3 border-b border-white/20 text-right">
                      Rp {data.nominal.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SpreadsheetTable;
