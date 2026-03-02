"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import menuData from "../data/menu.json";

const Icons = {
  Add: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
  Edit: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
  ),
  Delete: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  ),
  Trash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  ),
  Money: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
    </svg>
  ),
  Table: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5M3.75 3.75h16.5v16.5H3.75V3.75z" />
    </svg>
  ),
  Form: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  EmptyData: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375 7.444 2.25 12 2.25s8.25 1.847 8.25 4.125zm0 4.5c0 2.278-3.694 4.125-8.25 4.125S3.75 13.153 3.75 10.875m16.5 4.5c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
    </svg>
  ),
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  ),
  Close: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Info: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  )
};

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
  const [showSuggestions, setShowSuggestions] = useState(false);
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const initialLoadRef = useRef(false);
  const searchRef = useRef(null);

  const calculateKomisi = (nominal) => {
    const nominalNum = Number(nominal) || 0;
    return nominalNum * 0.02;
  };

  useEffect(() => {
  if (initialLoadRef.current) return;

  const savedTableData = localStorage.getItem("tableData");

  if (savedTableData) {
    try {
      const parsedData = JSON.parse(savedTableData);

      const safeData = parsedData.map((item) => ({
        tanggal: item.tanggal ?? "",
        terapis: item.terapis ?? "",
        shift: item.shift ?? "",
        jenisTreatment: item.jenisTreatment ?? "",
        durasi: item.durasi ?? "",
        namaTamu: item.namaTamu ?? "",
        ruang: item.ruang ?? "",
        report: item.report ?? "",
        nominal: item.nominal ?? 0,
        komisi:
          item.komisi !== undefined
            ? item.komisi
            : calculateKomisi(item.nominal),
      }));

      const sorted = [...safeData].sort(
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
}, []);
  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem("tableData", JSON.stringify(tableData));
    onSave?.(tableData);
  }, [tableData, isInitialized, onSave]);

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
  }, [data, isInitialized]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      .slice(0, 8);
    setSuggestions(matches);
  }, [query, flatMenu]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value,
    };
    
    if (name === "nominal") {
      newFormData.komisi = calculateKomisi(value);
    }
    
    setFormData(newFormData);
  };

  const pickSuggestion = (sug) => {
    const optionsForName =
      menuData.find((m) => m.name === sug.name)?.options || [];
    const newFormData = {
      ...formData,
      jenisTreatment: sug.name,
      durasi: optionsForName.length === 1
        ? String(optionsForName[0].durationMin)
        : String(sug.durationMin),
      nominal: sug.price,
      komisi: calculateKomisi(sug.price),
    };
    
    setFormData(newFormData);
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
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
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAll = () => {
    setTableData([]);
    localStorage.removeItem("tableData");
    onClear?.();
    setShowDeleteConfirm(false);
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
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      const updated = tableData.filter((_, idx) => idx !== i);
      updated.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
      setTableData(updated);
    }
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
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
    setQuery("");
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
    ? new Date(Math.min(...dates)).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })
    : "-";
  const maxDate = dates.length
    ? new Date(Math.max(...dates)).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })
    : "-";

  const optionsForSelected = formData.jenisTreatment
    ? menuData.find((m) => m.name === formData.jenisTreatment)?.options || []
    : [];

  return (
    <div className="space-y-6">
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-3 rounded-full text-red-600">
                <Icons.Trash className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Hapus Semua Data</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus semua data transaksi? 
              Data yang sudah dihapus tidak dapat dikembalikan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmDeleteAll}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:from-red-700 hover:to-red-800 transition-colors shadow-lg shadow-red-200"
              >
                Ya, Hapus Semua
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-2 rounded-xl shadow-md shadow-blue-200">
              <Icons.Table className="h-5 w-5" />
            </div>
            Input Data Transaksi
          </h2>
          <p className="text-gray-600 text-sm mt-1">Kelola data transaksi harian terapis</p>
        </div>
        
        <button
          onClick={handleDeleteAll}
          className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg shadow-red-200 hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={tableData.length === 0}
        >
          <Icons.Trash className="h-5 w-5" /> 
          Hapus Semua
          {tableData.length > 0 && (
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
              {tableData.length}
            </span>
          )}
        </button>   
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <div className="bg-white p-2 rounded-lg shadow-sm text-blue-600">
              <Icons.Form className="h-5 w-5" />
            </div>
            {editIndex !== null ? 'Edit Transaksi' : 'Form Input Transaksi Baru'}
          </h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal <span className="text-red-500">*</span>
              </label>
              <input
                name="tanggal"
                type="date"
                value={formData.tanggal}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Terapis <span className="text-red-500">*</span>
              </label>
              <input
                name="terapis"
                placeholder="Nama terapis"
                value={formData.terapis}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shift <span className="text-red-500">*</span>
              </label>
              <select
                name="shift"
                value={formData.shift}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white"
              >
                <option value="">Pilih Shift</option>
                <option value="A1">A1 (Pagi)</option>
                <option value="Md">Md (Siang)</option>
                <option value="B1">B1 (Malam)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Tamu</label>
              <input
                name="namaTamu"
                placeholder="Nama tamu"
                value={formData.namaTamu}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="col-span-2" ref={searchRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Treatment</label>
              <div className="relative">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ketik nama treatment..."
                    value={formData.jenisTreatment || query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setShowSuggestions(true);
                      setFormData((prev) => ({
                        ...prev,
                        jenisTreatment: e.target.value,
                      }));
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full p-3  border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                  />
                </div>
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-30 mt-1 bg-white border border-gray-200 rounded-xl w-full shadow-2xl max-h-72 overflow-y-auto animate-slide-down">
                    {suggestions.map((s, i) => (
                      <div
                        key={i}
                        className="p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-all duration-150"
                        onClick={() => pickSuggestion(s)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-gray-800">{s.name}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                {s.category}
                              </span>
                              <span className="text-xs text-gray-500">
                                {s.durationMin} min
                              </span>
                            </div>
                          </div>
                          <div className="text-sm font-semibold text-blue-600">
                            Rp {s.price.toLocaleString("id-ID")}
                          </div>
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
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white"
                disabled={!formData.jenisTreatment}
              >
                <option value="">
                  {optionsForSelected.length
                    ? "Pilih Durasi"
                    : "Pilih treatment dahulu"}
                </option>
                {optionsForSelected.map((opt, idx) => (
                  <option key={idx} value={opt.durationMin}>
                    {opt.durationMin} menit
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ruang</label>
              <select
                name="ruang"
                value={formData.ruang}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white"
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
                <option value="Hair styling">Hair styling</option>
                <option value="Nails">Nails</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nominal (Rp) <span className="text-red-500">*</span>
              </label>
              <input
                name="nominal"
                type="number"
                placeholder="Masukkan nominal"
                value={formData.nominal || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report</label>
              <input
                name="report"
                placeholder="Catatan tambahan (opsional)"
                value={formData.report}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
              />
            </div>
          </div>

          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg shadow-sm text-blue-600">
                <Icons.Info className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">Komisi otomatis: 2% dari nominal</p>
                <p className="text-xs text-blue-600 mt-1">
                  {formData.nominal ? 
                    `Rp ${Number(formData.nominal).toLocaleString('id-ID')} → Komisi: Rp ${calculateKomisi(formData.nominal).toLocaleString('id-ID')}` : 
                    'Masukkan nominal untuk melihat komisi'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-end items-center gap-3 pt-4 border-t border-gray-200">
            {editIndex !== null && (
              <button
                onClick={handleCancelEdit}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
              >
                <Icons.Close className="h-5 w-5" />
                Batal
              </button>
            )}
            <button
              onClick={handleAddOrUpdate}
              className={`px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center gap-2 ${
                editIndex !== null
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-green-200"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-blue-200"
              }`}
            >
              {editIndex !== null ? (
                <>
                  <Icons.Check className="h-5 w-5" />
                  Update Data
                </>
              ) : (
                <>
                  <Icons.Add className="h-5 w-5" />
                  Tambah Data Baru
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <div className="bg-white p-2 rounded-lg shadow-sm text-blue-600">
                <Icons.Table className="h-5 w-5" />
              </div>
              Daftar Transaksi
            </h3>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {tableData.length} data
            </span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Tanggal",
                  "Terapis",
                  "Shift",
                  "Treatment",
                  "Durasi",
                  "Tamu",
                  "Ruang",
                  "Nominal",
                  "Komisi (2%)",
                  "Report",
                  "Aksi",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
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
                    className="text-center py-16 text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-gray-300 mb-4">
                        <Icons.EmptyData />
                      </div>
                      <p className="text-lg font-medium text-gray-700 mb-2">Belum ada data transaksi</p>
                      <p className="text-gray-500">Mulai tambahkan data menggunakan form di atas</p>
                    </div>
                  </td>
                </tr>
              ) : (
                tableData.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50/80 transition-colors duration-150">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {r.tanggal
                        ? new Date(r.tanggal).toLocaleDateString("id-ID", {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })
                        : ""}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {r.terapis}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        r.shift === 'A1' ? 'bg-blue-100 text-blue-700' :
                        r.shift === 'Md' ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {r.shift}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 max-w-[150px] truncate">
                      {r.jenisTreatment}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {r.durasi ? (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs">
                          {r.durasi} menit
                        </span>
                      ) : "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {r.namaTamu || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {r.ruang ? (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs">
                          {r.ruang}
                        </span>
                      ) : "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-blue-600">
                      Rp {Number(r.nominal || 0).toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-2 py-1 rounded-lg border border-blue-100">
                        <span className="text-sm font-semibold text-blue-600">
                          Rp {Number(r.komisi || calculateKomisi(r.nominal)).toLocaleString("id-ID")}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-[100px] truncate">
                      {r.report || "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEdit(i)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                          title="Edit data"
                        >
                          <Icons.Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(i)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          title="Hapus data"
                        >
                          <Icons.Delete className="h-4 w-4" />
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
                  className="px-4 py-4 font-medium text-right text-gray-700"
                >
                  <div className="flex flex-col items-end">
                    <span>Total Periode:</span>
                    <span className="text-sm font-normal text-gray-600">
                      {minDate} — {maxDate}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-lg font-bold text-blue-600 bg-white px-3 py-2 rounded-lg shadow-sm border border-blue-100">
                    Rp {totalNominal.toLocaleString("id-ID")}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-lg font-bold text-indigo-600 bg-white px-3 py-2 rounded-lg shadow-sm border border-indigo-100">
                    Rp {totalKomisi.toLocaleString("id-ID")}
                  </div>
                </td>
                <td colSpan={2} className="px-4 py-4">
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