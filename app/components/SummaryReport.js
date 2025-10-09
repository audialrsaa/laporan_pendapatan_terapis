const SummaryReport = ({ data }) => {
  // total nominal
  const calculateTotal = (key) => {
    return data.reduce((sum, item) => sum + (Number(item[key]) || 0), 0);
  };

  // total per terapis
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
  const perTerapisData = calculatePerTerapis();

  return (
    <>
      {/* total pendapatan */}
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-semibold mb-2">Total Pendapatan</h2>
        <p className="text-3xl font-bold">
          Rp {totalNominal.toLocaleString('id-ID')}
        </p>
      </div>

      {/* table perterapis */}
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 rounded-2xl shadow-xl text-white lg:col-span-2">
        <h2 className="text-xl font-semibold mb-4">Pendapatan per Terapis</h2>
        <div className="overflow-x-auto rounded-lg bg-white/10 backdrop-blur-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white/20">
                <th className="p-3 text-left text-sm font-semibold border-b border-white/30">
                  Terapis
                </th>
                <th className="p-3 text-left text-sm font-semibold border-b border-white/30">
                  Total Nominal
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(perTerapisData).map(terapis => (
                <tr key={terapis} className="hover:bg-white/10 transition-colors">
                  <td className="p-3 border-b border-white/20 font-medium">{terapis}</td>
                  <td className="p-3 border-b border-white/20">
                    Rp {perTerapisData[terapis].totalNominal.toLocaleString('id-ID')}
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
