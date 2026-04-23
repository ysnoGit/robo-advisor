import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function PortfolioChart({ portfolios, gmvp, frontier }) {
  // Format data for scatter chart
  const allData = portfolios.map((p) => ({
    x: p.stdDev,
    y: p.return,
    isGMVP: gmvp && p === gmvp,
    isFrontier: frontier && frontier.includes(p)
  }));

  const regularData = allData.filter((d) => !d.isGMVP && !d.isFrontier);
  const frontierData = allData.filter((d) => d.isFrontier);
  const gmvpData = allData.filter((d) => d.isGMVP);

  return (
    <div className="w-full h-96 bg-white rounded-xl shadow-md p-6">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 30, bottom: 80, left: 80 }}
          data={allData}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            type="number" 
            dataKey="x" 
            name="Risk (Std Dev)"
            label={{ value: 'Risk - Standard Deviation', position: 'bottom', offset: 20, fontSize: 12, fill: '#333' }}
            tick={{ fill: '#666', fontSize: 11 }}
            domain={['dataMin - 0.001', 'dataMax + 0.001']}
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            name="Expected Return"
            label={{ value: 'Expected Return', angle: -90, position: 'insideLeft', offset: -10, fontSize: 12, fill: '#333' }}
            tick={{ fill: '#666', fontSize: 11 }}
            domain={['dataMin - 0.0001', 'dataMax + 0.0001']}
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3', stroke: '#999' }}
            contentStyle={{
              backgroundColor: '#fff',
              border: '2px solid #ccc',
              borderRadius: '8px',
              padding: '8px',
              fontSize: '12px',
            }}
            content={({ active, payload }) => {
              if (active && payload && payload[0]) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 rounded-lg border border-gray-300 shadow-lg">
                    <p className="font-semibold text-gray-800">Risk: {(data.x * 100).toFixed(2)}%</p>
                    <p className="font-semibold text-gray-800">Return: {(data.y * 100).toFixed(2)}%</p>
                    {data.isGMVP && <p className="text-red-600 font-bold">★ GMVP</p>}
                    {data.isFrontier && <p className="text-green-600 font-bold">◆ Efficient Frontier</p>}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
            verticalAlign="bottom"
            height={36}
            fontSize={12}
          />
          <Scatter
            name="All Portfolios"
            data={regularData}
            fill="#8884d8"
            fillOpacity={0.6}
          />
          {frontierData.length > 0 && (
            <Scatter
              name="Efficient Frontier"
              data={frontierData}
              fill="#82ca9d"
              fillOpacity={0.8}
            />
          )}
          {gmvpData.length > 0 && (
            <Scatter
              name="GMVP (Min Risk)"
              data={gmvpData}
              fill="#ff7300"
              shape="star"
              fillOpacity={1}
            />
          )}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
