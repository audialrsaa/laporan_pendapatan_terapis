"use client";
import React, { useState, useEffect, useMemo } from "react";
import menuData from "../data/menu.json";

const buildFlatMenu = (menu) =>
  menu.flatMap((m) =>
    m.options.map((opt, idx) => ({
      category: m.category,
      name: m.name,
      durationMin: opt.durationMin,
      price: opt.price,
      optionIndex: idx,
    }))
  );

const SpreadsheetTable = ({ data, onSave }) => {
  const [tableData, setTableData] = useState(data || []);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [formData, setFormData] = useState({
    tanggal: "",
    terapis: "",
    shift: "",
    jenisTreatment: "",
    durasi: "",
    namaTamu: "",
    ruang: "",
    report: "",
    nominal: "",
  });
  const [editIndex, setEditIndex] = useState(null);

  // Saat data berubah, langsung sort dari tanggal terkecil → terbesar
  useEffect(() => {
    if (data) {
      const sorted = [...data].sort(
        (a, b) => new Date(a.tanggal) - new Date(b.tanggal)
      );
      setTableData(sorted);
    } else {
      setTableData([]);
    }
  }, [data]);

  const flatMenu = useMemo(() => buildFlatMenu(menuData), []);

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    const q = query.toLowerCase();
    const matches = flatMenu
      .filter(
        (it) =>
          it.name.toLowerCase().includes(q) ||
          it.category.toLowerCase().includes(q)
      )
      .slice(0, 10);
    setSuggestions(matches);
  }, [query, flatMenu]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "nominal" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const pickSuggestion = (sug) => {
    const optionsForName =
      menuData.find((m) => m.name === sug.name)?.options || [];
    setFormData((prev) => ({
      ...prev,
      jenisTreatment: sug.name,
      durasi:
        optionsForName.length === 1
          ? String(optionsForName[0].durationMin)
          : String(sug.durationMin),
      nominal: sug.price,
    }));
    setQuery("");
    setSuggestions([]);
  };

  const handleDurasiChange = (e) => {
    const dur = e.target.value;
    setFormData((prev) => {
      const menuItem = menuData.find((m) => m.name === prev.jenisTreatment);
      let price = prev.nominal || "";
      if (menuItem) {
        const opt = menuItem.options.find(
          (o) => String(o.durationMin) === String(dur)
        );
        if (opt) price = opt.price;
      }
      return { ...prev, durasi: dur, nominal: price };
    });
  };

  const handleAddOrUpdate = () => {
    if (
      !formData.tanggal ||
      !formData.terapis ||
      !formData.shift ||
      !formData.nominal
    ) {
      alert("Tanggal, Terapis, Shift, dan Nominal wajib diisi!");
      return;
    }

    let newTable;
    if (editIndex !== null) {
      newTable = [...tableData];
      newTable[editIndex] = { ...formData };
      setEditIndex(null);
    } else {
      newTable = [...tableData, { ...formData }];
    }

    // 🔥 Urutkan berdasarkan tanggal
    newTable.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));

    setTableData(newTable);
    onSave?.(newTable);

    setFormData({
      tanggal: "",
      terapis: "",
      shift: "",
      jenisTreatment: "",
      durasi: "",
      namaTamu: "",
      ruang: "",
      report: "",
      nominal: "",
    });
  };

  const handleEdit = (i) => {
    setFormData(tableData[i]);
    setEditIndex(i);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (i) => {
    const updated = tableData.filter((_, idx) => idx !== i);
    // 🔥 setelah delete, sort juga biar rapi
    updated.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
    setTableData(updated);
    onSave?.(updated);
  };

  const totalNominal = tableData.reduce(
    (s, r) => s + (Number(r.nominal) || 0),
    0
  );
  const dates = tableData
    .map((r) => (r.tanggal ? new Date(r.tanggal) : null))
    .filter(Boolean);
  const minDate = dates.length
    ? new Date(Math.min(...dates)).toLocaleDateString("id-ID")
    : "-";
  const maxDate = dates.length
    ? new Date(Math.max(...dates)).toLocaleDateString("id-ID")
    : "-";

  const optionsForSelected = formData.jenisTreatment
    ? menuData.find((m) => m.name === formData.jenisTreatment)?.options || []
    : [];

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Input Data Transaksi
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          name="tanggal"
          type="date"
          value={formData.tanggal}
          onChange={handleChange}
          className="p-3 border rounded-lg"
        />
        <input
          name="terapis"
          placeholder="Terapis *"
          value={formData.terapis}
          onChange={handleChange}
          className="p-3 border rounded-lg"
        />
        <select
          name="shift"
          value={formData.shift}
          onChange={handleChange}
          className="p-3 border rounded-lg"
        >
          <option value="">Shift</option>
          <option value="A1">A1</option>
          <option value="Md">Md</option>
          <option value="B1">B1</option>
        </select>

        <input
          name="namaTamu"
          placeholder="Nama Tamu"
          value={formData.namaTamu}
          onChange={handleChange}
          className="p-3 border rounded-lg"
        />
      </div>

      {/* treatment autocomplete + durasi + nominal + ruang */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Autocomplete Treatment */}
        <div className="relative col-span-2">
          <input
            type="text"
            placeholder="Jenis Treatment"
            value={formData.jenisTreatment || query}
            onChange={(e) => {
              setQuery(e.target.value);
              setFormData((prev) => ({
                ...prev,
                jenisTreatment: e.target.value,
              }));
            }}
            className="w-full p-3 border rounded-lg"
          />
          {suggestions.length > 0 && (
            <div className="absolute z-30 mt-1 bg-white border rounded-lg w-full shadow">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => pickSuggestion(s)}
                >
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="text-xs text-gray-500">
                    {s.durationMin} min — Rp{" "}
                    {s.price.toLocaleString("id-ID")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Durasi */}
        <select
          name="durasi"
          value={formData.durasi}
          onChange={handleDurasiChange}
          className="p-3 border rounded-lg"
        >
          <option value="">
            {optionsForSelected.length
              ? "Pilih Durasi"
              : "Pilih treatment dahulu"}
          </option>
          {optionsForSelected.map((opt, idx) => (
            <option key={idx} value={opt.durationMin}>
              {opt.durationMin} min
            </option>
          ))}
        </select>

        {/* Ruang */}
        <select
          name="ruang"
          value={formData.ruang}
          onChange={handleChange}
          className="p-3 border rounded-lg"
        >
          <option value="">Ruang</option>
          <option value="Facial 1">Facial 1</option>
          <option value="Facial 2">Facial 2</option>
          <option value="Spa 1">Spa 1</option>
          <option value="Spa 2">Spa 2</option>
          <option value="Spa 3">Spa 3</option>
          <option value="Massage 1">Massage 1</option>
          <option value="Massage 2">Massage 2</option>
          <option value="Massage 3">Massage 3</option>
          <option value="Massage 4">Massage 4</option>
          <option value="Single">Single</option>
          <option value="Couple">Couple</option>
          <option value="Hair spa">Hair spa</option>
          <option value="Hair stayling">Hair stayling</option>
          <option value="Nails">Nails</option>
        </select>

        {/* Nominal */}
        <input
          name="nominal"
          type="number"
          placeholder="Nominal (Rp)"
          value={formData.nominal || ""}
          onChange={handleChange}
          className="p-3 border rounded-lg"
        />

        <input
          name="report"
          placeholder="Report (opsional)"
          value={formData.report}
          onChange={handleChange}
          className="p-3 border rounded-lg"
        />
      </div>

      {/* Tombol simpan */}
      <div className="flex gap-3">
        <button
          onClick={handleAddOrUpdate}
          className={`px-6 py-2 rounded-xl font-semibold shadow-md ${
            editIndex !== null
              ? "bg-green-500 text-white"
              : "bg-indigo-600 text-white"
          }`}
        >
          {editIndex !== null ? "✅ Update Data" : "➕ Tambah Data"}
        </button>
        <div className="self-center text-sm text-gray-500">
          Saran treatment dari menu resmi.
        </div>
      </div>

      {/* Tabel utama */}
      <div className="overflow-x-auto border border-gray-200 rounded-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Tanggal",
                "Terapis",
                "Shift",
                "JenisTreatment",
                "Durasi",
                "NamaTamu",
                "Ruang",
                "Nominal",
                "Report",
                "Aksi",
              ].map((h) => (
                <th
                  key={h}
                  className="p-3 text-left text-xs font-semibold text-gray-600"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableData.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="text-center p-6 text-gray-500 italic"
                >
                  Belum ada data
                </td>
              </tr>
            ) : (
              tableData.map((r, i) => (
                <tr key={i} className="hover:bg-indigo-50">
                  <td className="p-3 text-sm">
                    {r.tanggal
                      ? new Date(r.tanggal).toLocaleDateString("id-ID")
                      : ""}
                  </td>
                  <td className="p-3 text-sm font-medium">{r.terapis}</td>
                  <td className="p-3 text-sm">{r.shift}</td>
                  <td className="p-3 text-sm">{r.jenisTreatment}</td>
                  <td className="p-3 text-sm">
                    {r.durasi ? `${r.durasi} min` : ""}
                  </td>
                  <td className="p-3 text-sm">{r.namaTamu}</td>
                  <td className="p-3 text-sm">{r.ruang}</td>
                  <td className="p-3 text-sm text-indigo-600 font-semibold">
                    Rp {Number(r.nominal || 0).toLocaleString("id-ID")}
                  </td>
                  <td className="p-3 text-sm">{r.report}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleEdit(i)}
                      className="px-3 py-1 bg-yellow-400 text-white rounded-lg text-xs mr-2"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(i)}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot className="bg-gray-100">
            <tr>
              <td
                colSpan={7}
                className="px-4 py-3 font-bold text-right text-gray-700"
              >
                Total Nominal Periode ({minDate} s/d {maxDate}):
              </td>
              <td className="px-4 py-3 text-sm font-extrabold text-indigo-600">
                Rp {totalNominal.toLocaleString("id-ID")}
              </td>
              <td colSpan={2}></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Rekap Bulanan */}
      <div>
        <h2 className="text-xl font-bold mb-3 text-gray-800">
          📊 Pendapatan Per Bulan & Terapis
        </h2>
        <div className="overflow-x-auto border border-gray-200 rounded-xl">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 border-b text-left text-xs font-semibold text-gray-600">
                  Bulan
                </th>
                <th className="p-3 border-b text-left text-xs font-semibold text-gray-600">
                  Terapis
                </th>
                <th className="p-3 border-b text-left text-xs font-semibold text-gray-600">
                  Total Nominal
                </th>
                <th className="p-3 border-b text-left text-xs font-semibold text-gray-600">
                  Komisi (2%)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tableData.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center p-4 text-gray-500 italic"
                  >
                    Belum ada data bulanan
                  </td>
                </tr>
              ) : (() => {
                  const monthly = tableData.reduce((acc, row) => {
                    if (!row.tanggal || !row.terapis) return acc;
                    const d = new Date(row.tanggal);
                    const monthKey = `${d.toLocaleString("id-ID", {
                      month: "long",
                    })} ${d.getFullYear()}`;
                    acc[monthKey] = acc[monthKey] || {};
                    acc[monthKey][row.terapis] =
                      acc[monthKey][row.terapis] || { nominal: 0 };
                    acc[monthKey][row.terapis].nominal +=
                      Number(row.nominal) || 0;
                    return acc;
                  }, {});
                  return Object.entries(monthly).flatMap(
                    ([month, therapists]) =>
                      Object.entries(therapists).map(([therapist, val]) => (
                        <tr
                          key={`${month}-${therapist}`}
                          className="hover:bg-indigo-50"
                        >
                          <td className="p-3 text-sm font-medium">{month}</td>
                          <td className="p-3 text-sm">{therapist}</td>
                          <td className="p-3 text-sm text-indigo-600 font-semibold">
                            Rp {val.nominal.toLocaleString("id-ID")}
                          </td>
                          <td className="p-3 text-sm text-green-600 font-semibold">
                            Rp {(val.nominal * 0.02).toLocaleString("id-ID")}
                          </td>
                        </tr>
                      ))
                  );
                })()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SpreadsheetTable;
