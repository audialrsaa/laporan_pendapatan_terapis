const SummaryReport = ({ data }) => {
  // untuk menghitung total pendapatan
  const calculateTotal = (key) => {
    return data.reduce((sum, item) => sum + (Number(item[key]) || 0), 0);
  };

  // untuk menghitung pendapatan per terapis
  const calculatePerTerapis = () => {
    const report = {};
    data.forEach(item => {
      const { terapis, nominal, komisi } = item;
      if (!report[terapis]) {
        report[terapis] = { totalNominal: 0, totalKomisi: 0 };
      }
      report[terapis].totalNominal += (Number(nominal) || 0);
      report[terapis].totalKomisi += (Number(komisi) || 0);
    });
    return report;
  };

  const totalNominal = calculateTotal('nominal');
  const totalKomisi = calculateTotal('komisi');
  const perTerapisData = calculatePerTerapis();

  return (
    <>
      {/* Ringkasan Pendapatan */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Ringkasan Pendapatan</h2>
        <div className="space-y-2">
          <p className="flex justify-between font-medium">
            <span>Total Nominal Treatment:</span>
            <span>Rp {totalNominal.toLocaleString('id-ID')}</span>
          </p>
          <p className="flex justify-between font-medium">
            <span>Total Komisi:</span>
            <span>Rp {totalKomisi.toLocaleString('id-ID')}</span>
          </p>
        </div>
      </div>

      {/* Pendapatan per Terapis */}
      <div className="bg-white p-6 rounded-lg shadow-lg lg:col-span-2">
        <h2 className="text-xl font-semibold mb-4">Pendapatan per Terapis</h2>
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border border-gray-300">Terapis</th>
              <th className="p-2 border border-gray-300">Total Nominal</th>
              <th className="p-2 border border-gray-300">Total Komisi</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(perTerapisData).map(terapis => (
              <tr key={terapis}>
                <td className="p-2 border border-gray-300 font-medium">{terapis}</td>
                <td className="p-2 border border-gray-300">
                  Rp {perTerapisData[terapis].totalNominal.toLocaleString('id-ID')}
                </td>
                <td className="p-2 border border-gray-300">
                  Rp {perTerapisData[terapis].totalKomisi.toLocaleString('id-ID')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SummaryReport;
