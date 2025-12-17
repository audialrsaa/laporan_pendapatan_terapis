"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
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

const SpreadsheetTable = ({ data, onSave, onClear, onAddToReport }) => {
  const [tableData, setTableData] = useState([]);
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
    komisi: 0,
  });
  const [editIndex, setEditIndex] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const initialLoadRef = useRef(false); // Tambah ref untuk tracking initial load

  // Hitung komisi otomatis dari nominal
  const calculateKomisi = (nominal) => {
    const nominalNum = Number(nominal) || 0;
    return nominalNum * 0.02; // 2% dari nominal
  };

  // Load data dari localStorage saat pertama kali komponen dimuat
  useEffect(() => {
    if (initialLoadRef.current) return;
    
    const savedTableData = localStorage.getItem("tableData");
    if (savedTableData) {
      try {
        const parsedData = JSON.parse(savedTableData);
        const dataWithKomisi = parsedData.map(item => ({
          ...item,
          komisi: item.komisi || calculateKomisi(item.nominal)
        }));
        const sorted = [...dataWithKomisi].sort(
          (a, b) => new Date(a.tanggal) - new Date(b.tanggal)
        );
        setTableData(sorted);
        onSave?.(sorted);
      } catch (err) {
        console.error("❌ Gagal parse tableData dari localStorage:", err);
      }
    }
    setIsInitialized(true);
    initialLoadRef.current = true;
  }, []); // Hanya dijalankan sekali saat mount

  // Simpan data ke localStorage setiap kali tableData berubah
  useEffect(() => {
    if (!isInitialized) return;

    localStorage.setItem("tableData", JSON.stringify(tableData));
    onSave?.(tableData); // Notify parent component
  }, [tableData, isInitialized, onSave]);

  // Sync dengan data dari parent jika ada (hanya untuk initial data)
  useEffect(() => {
    if (!isInitialized) return;
    if (!data || data.length === 0) return;
    if (tableData.length > 0) return;

    const dataWithKomisi = data.map(item => ({
      ...item,
      komisi: item.komisi || calculateKomisi(item.nominal)
    }));

    const sorted = [...dataWithKomisi].sort(
      (a, b) => new Date(a.tanggal) - new Date(b.tanggal)
    );

    setTableData(sorted);
    localStorage.setItem("tableData", JSON.stringify(sorted));
  }, [data, isInitialized]); // Hapus tableData.length dari dependencies

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
    const newFormData = {
      ...formData,
      [name]:
        name === "nominal" ? (value === "" ? "" : Number(value)) : value,
    };
    
    // Hitung komisi otomatis saat nominal berubah
    if (name === "nominal") {
      newFormData.komisi = calculateKomisi(value);
    }
    
    setFormData(newFormData);
  };

  const pickSuggestion = (sug) => {
    const optionsForName =
      menuData.find((m) => m.name === sug.name)?.options || [];
    const newFormData = {
      tanggal: formData.tanggal,
      terapis: formData.terapis,
      shift: formData.shift,
      namaTamu: formData.namaTamu,
      ruang: formData.ruang,
      report: formData.report,
      jenisTreatment: sug.name,
      durasi:
        optionsForName.length === 1
          ? String(optionsForName[0].durationMin)
          : String(sug.durationMin),
      nominal: sug.price,
      komisi: calculateKomisi(sug.price),
    };
    
    setFormData(newFormData);
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
      return { 
        ...prev, 
        durasi: dur, 
        nominal: price,
        komisi: calculateKomisi(price)
      };
    });
  };

  const handleDeleteAll = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus semua data transaksi? Data di Summary Report tetap tersimpan permanen.")) {
      setTableData([]);
      localStorage.removeItem("tableData");
      onClear?.();
    }
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
    const newEntry = {
      ...formData,
      komisi: calculateKomisi(formData.nominal)
    };

    if (editIndex !== null) {
      newTable = [...tableData];
      newTable[editIndex] = newEntry;
      setEditIndex(null);
    } else {
      newTable = [...tableData, newEntry];
      onAddToReport?.(newEntry);
    }

    newTable.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));

    setTableData(newTable);
    // Tidak perlu panggil onSave di sini karena useEffect sudah menanganinya
    // Tidak perlu localStorage.setItem di sini karena useEffect sudah menanganinya

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
      komisi: 0,
    });
  };

  const handleEdit = (i) => {
    setFormData(tableData[i]);
    setEditIndex(i);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (i) => {
    const updated = tableData.filter((_, idx) => idx !== i);
    updated.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
    setTableData(updated);
    // Tidak perlu panggil onSave di sini karena useEffect sudah menanganinya
    // Tidak perlu localStorage.setItem di sini karena useEffect sudah menanganinya
  };

  const handleExportTableData = () => {
    if (tableData.length === 0) {
      alert("Tidak ada data untuk di-export.");
      return;
    }
    
    const dataStr = JSON.stringify(tableData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'data_transaksi.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportTableData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target.result);
          
          if (!Array.isArray(importedData)) {
            alert("Format file tidak valid. Harus berupa array.");
            return;
          }
          
          const importedDataWithKomisi = importedData.map(item => ({
            ...item,
            komisi: item.komisi || calculateKomisi(item.nominal)
          }));
          
          const combinedData = [...tableData, ...importedDataWithKomisi];
          const uniqueData = Array.from(
            new Map(
              combinedData.map(item => [
                `${item.tanggal}-${item.terapis}-${item.nominal}`,
                item
              ])
            ).values()
          );
          
          const sortedData = uniqueData.sort(
            (a, b) => new Date(a.tanggal) - new Date(b.tanggal)
          );
          
          setTableData(sortedData);
          // Tidak perlu panggil onSave atau localStorage.setItem di sini
          // karena useEffect sudah menanganinya
          
          alert(`✅ ${importedData.length} data berhasil diimpor!`);
        } catch (err) {
          alert("Gagal membaca file. Pastikan file JSON valid.");
          console.error(err);
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  };

  const totalNominal = tableData.reduce(
    (s, r) => s + (Number(r.nominal) || 0),
    0
  );
  
  const totalKomisi = tableData.reduce(
    (s, r) => s + (Number(r.komisi) || 0),
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
    <div className="bg-gradient-to-b from-white to-gray-50 p-6 rounded-2xl shadow-2xl border border-gray-200 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            📊 Input Data Transaksi
          </h2>
          <p className="text-gray-600 text-sm mt-1">Kelola data transaksi harian terapis</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleDeleteAll}
            className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Hapus semua data transaksi"
            disabled={tableData.length === 0}
          >
            <span className="text-lg">🗑️</span> Hapus Semua
          </button>   
        </div>
      </div>

      {/* Form Input Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-100 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <span className="bg-indigo-100 p-2 rounded-lg">📝</span>
          Form Input Transaksi Baru
        </h3>
        
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal *</label>
            <input
              name="tanggal"
              type="date"
              value={formData.tanggal}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Terapis *</label>
            <input
              name="terapis"
              placeholder="Nama terapis"
              value={formData.terapis}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shift *</label>
            <select
              name="shift"
              value={formData.shift}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200 bg-white"
            >
              <option value="">Pilih Shift</option>
              <option value="A1">A1</option>
              <option value="Md">Md</option>
              <option value="B1">B1</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Tamu</label>
            <input
              name="namaTamu"
              placeholder="Nama tamu"
              value={formData.namaTamu}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
            />
          </div>
        </div>

        {/* Row 2 - Treatment Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Treatment</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ketik nama treatment..."
                value={formData.jenisTreatment || query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    jenisTreatment: e.target.value,
                  }));
                }}
                className="w-full p-3 border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
              />
              {suggestions.length > 0 && (
                <div className="absolute z-30 mt-1 bg-white border border-gray-200 rounded-xl w-full shadow-2xl max-h-60 overflow-y-auto">
                  {suggestions.map((s, i) => (
                    <div
                      key={i}
                      className="p-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition duration-150"
                      onClick={() => pickSuggestion(s)}
                    >
                      <div className="font-medium text-gray-800">{s.name}</div>
                      <div className="text-xs text-gray-500 mt-1 flex justify-between">
                        <span>{s.durationMin} min</span>
                        <span className="font-semibold text-indigo-600">Rp {s.price.toLocaleString("id-ID")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Durasi</label>
            <select
              name="durasi"
              value={formData.durasi}
              onChange={handleDurasiChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200 bg-white"
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
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ruang</label>
            <select
              name="ruang"
              value={formData.ruang}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200 bg-white"
            >
              <option value="">Pilih Ruang</option>
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
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nominal (Rp) *</label>
            <input
              name="nominal"
              type="number"
              placeholder="Masukkan nominal"
              value={formData.nominal || ""}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report</label>
            <input
              name="report"
              placeholder="Catatan tambahan (opsional)"
              value={formData.report}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
            />
          </div>
        </div>

        {/* Info Komisi Otomatis */}
        <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <span className="text-green-600">💰</span>
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">Komisi otomatis: 2% dari nominal</p>
              <p className="text-xs text-green-700">
                {formData.nominal ? 
                  `Rp ${Number(formData.nominal).toLocaleString('id-ID')} → Komisi: Rp ${calculateKomisi(formData.nominal).toLocaleString('id-ID')}` : 
                  'Masukkan nominal untuk melihat komisi'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleAddOrUpdate}
            className={`px-8 py-3 rounded-xl font-semibold shadow-lg transition duration-300 flex items-center gap-2 ${
              editIndex !== null
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
            }`}
          >
            {editIndex !== null ? (
              <>
                <span className="text-lg">✅</span>
                Update Data
              </>
            ) : (
              <>
                <span className="text-lg">➕</span>
                Tambah Data Baru
              </>
            )}
          </button>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span className="bg-white p-2 rounded-lg shadow">📋</span>
            Daftar Transaksi ({tableData.length} data)
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-indigo-500 to-purple-600">
              <tr>
                {[
                  "Tanggal",
                  "Terapis",
                  "Shift",
                  "Jenis Treatment",
                  "Durasi",
                  "Nama Tamu",
                  "Ruang",
                  "Nominal",
                  "Komisi (2%)",
                  "Report",
                  "Aksi",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider"
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
                    colSpan={11}
                    className="text-center py-12 text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-5xl mb-4">📭</div>
                      <p className="text-lg font-medium text-gray-600 mb-2">Belum ada data transaksi</p>
                      <p className="text-gray-500">Mulai tambahkan data menggunakan form di atas</p>
                    </div>
                  </td>
                </tr>
              ) : (
                tableData.map((r, i) => (
                  <tr key={i} className="hover:bg-indigo-50/50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {r.tanggal
                        ? new Date(r.tanggal).toLocaleDateString("id-ID", {
                            weekday: 'short',
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })
                        : ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {r.terapis}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        r.shift === 'A1' ? 'bg-blue-100 text-blue-800' :
                        r.shift === 'Md' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {r.shift}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {r.jenisTreatment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {r.durasi ? (
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-lg text-xs">
                          {r.durasi} min
                        </span>
                      ) : ""}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {r.namaTamu || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {r.ruang ? (
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-lg text-xs">
                          {r.ruang}
                        </span>
                      ) : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-700">
                      Rp {Number(r.nominal || 0).toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-700">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-2 rounded-lg border border-green-200">
                        Rp {Number(r.komisi || calculateKomisi(r.nominal)).toLocaleString("id-ID")}
                        <div className="text-xs text-green-600 font-normal">
                          2% dari nominal
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {r.report || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(i)}
                          className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-600 transition duration-300 shadow flex items-center gap-1"
                          title="Edit data"
                        >
                          <span>✏️</span>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(i)}
                          className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition duration-300 shadow flex items-center gap-1"
                          title="Hapus data"
                        >
                          <span>🗑️</span>
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-4 font-bold text-right text-gray-700"
                >
                  <div className="flex flex-col items-end">
                    <span>Total Periode:</span>
                    <span className="text-sm font-normal text-gray-600">
                      {minDate} s/d {maxDate}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xl font-extrabold text-indigo-700 bg-white p-3 rounded-xl shadow-inner">
                    Rp {totalNominal.toLocaleString("id-ID")}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xl font-extrabold text-green-700 bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl shadow-inner border border-green-200">
                    Rp {totalKomisi.toLocaleString("id-ID")}
                  </div>
                </td>
                <td colSpan={2} className="px-6 py-4">
                  <div className="text-xs text-gray-500 text-center">
                    {tableData.length} transaksi
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SpreadsheetTable;