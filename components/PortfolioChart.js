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
  const chartData = portfolios.map((p) => ({
    x: p.stdDev,
    y: p.return,
    isGMVP: gmvp && p === gmvp,
    isFrontier: frontier && frontier.includes(p)
  }));

  return (
    <div style={{ width: '100%', height: 500 }}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            dataKey="x" 
            name="Standard Deviation"
            label={{ value: 'Risk (Std Dev)', position: 'insideBottom', offset: -10 }}
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            name="Return"
            label={{ value: 'Return', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload && payload[0]) {
                const data = payload[0].payload;
                return (
                  <div
                    style={{
                      backgroundColor: '#fff',
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                  >
                    <p>Risk: {(data.x * 100).toFixed(2)}%</p>
                    <p>Return: {(data.y * 100).toFixed(2)}%</p>
                    {data.isGMVP && <p style={{ color: 'red' }}>GMVP</p>}
                    {data.isFrontier && <p style={{ color: 'green' }}>On Frontier</p>}
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter
            name="Portfolios"
            data={chartData.filter((d) => !d.isGMVP && !d.isFrontier)}
            fill="#8884d8"
          />
          {frontier && (
            <Scatter
              name="Efficient Frontier"
              data={chartData.filter((d) => d.isFrontier)}
              fill="#82ca9d"
            />
          )}
          {gmvp && (
            <Scatter
              name="GMVP"
              data={chartData.filter((d) => d.isGMVP)}
              fill="#ff7300"
              shape="diamond"
            />
          )}
          <Legend />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
