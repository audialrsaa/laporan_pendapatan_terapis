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
    komisi: 0,
  });

  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    setTableData(data || []);
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "nominal") {
      const nominalValue = Number(value) || 0;
      setFormData((prev) => ({
        ...prev,
        nominal: nominalValue,
        komisi: nominalValue * 0.02,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
      komisi: 0,
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

  // Hitung total
  const totalNominal = tableData.reduce((sum, row) => sum + (Number(row.nominal) || 0), 0);
  const totalKomisi = tableData.reduce((sum, row) => sum + (Number(row.komisi) || 0), 0);

  //tanggal
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
    acc[monthKey] = { nominal: 0, komisi: 0 };
  }

  acc[monthKey].nominal += Number(row.nominal) || 0;
  acc[monthKey].komisi += Number(row.komisi) || 0;

  return acc;
}, {});


  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-8">
      {/* FORM INPUT */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.keys(formData).map((key) =>
          key !== "komisi" && key !== "tanggal" ? (
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
              className="border p-2 rounded"
            />
          ) : null
        )}
      </div>

      <button
        onClick={handleAddOrUpdateData}
        className={`px-4 py-2 rounded text-white transition-colors ${
          editIndex !== null
            ? "bg-green-500 hover:bg-green-600"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {editIndex !== null ? "Update Data" : "Tambah Data"}
      </button>

      {/* TABLE DATA */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-200">
            <tr>
              {Object.keys(formData).map((key) => (
                <th key={key} className="p-2 border border-gray-300 text-left">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </th>
              ))}
              <th className="p-2 border border-gray-300">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {tableData.length === 0 ? (
              <tr>
                <td
                  colSpan={Object.keys(formData).length + 1}
                  className="text-center p-4"
                >
                  Belum ada data
                </td>
              </tr>
            ) : (
              tableData.map((row, index) => (
                <tr key={index}>
                  {Object.keys(formData).map((key) => (
                    <td key={key} className="p-2 border border-gray-300">
                      {key === "nominal" || key === "komisi"
                        ? `Rp ${Number(row[key]).toLocaleString("id-ID")}`
                        : row[key]}
                    </td>
                  ))}
                  <td className="p-2 border border-gray-300 space-x-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot className="bg-gray-100">
            <tr>
              <td
                colSpan={Object.keys(formData).length - 2}
                className="px-4 py-2 font-bold text-right"
              >
                Total ({minDate} s/d {maxDate}):
              </td>
              <td className="border px-4 py-2 text-right">
                Rp {totalNominal.toLocaleString("id-ID")}
              </td>
              <td className="border px-4 py-2 text-right">
                Rp {totalKomisi.toLocaleString("id-ID")}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* REKAP PER BULAN */}
      <div>
        <h2 className="text-lg font-bold mb-2">Pendapatan Per Bulan</h2>
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border border-gray-300">Bulan</th>
              <th className="p-2 border border-gray-300">Total Nominal Treatment</th>
              <th className="p-2 border border-gray-300">Total Komisi</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(monthlySummary).length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center p-4">
                  Belum ada data bulanan
                </td>
              </tr>
            ) : (
              Object.entries(monthlySummary).map(([month, data]) => (
                <tr key={month}>
                  <td className="p-2 border border-gray-300 font-medium">{month}</td>
                  <td className="p-2 border border-gray-300 text-right">
                    Rp {data.nominal.toLocaleString("id-ID")}
                  </td>
                  <td className="p-2 border border-gray-300 text-right">
                    Rp {data.komisi.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpreadsheetTable;
