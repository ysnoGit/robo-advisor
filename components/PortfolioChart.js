import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart
} from 'recharts';

export default function PortfolioChart({ portfolios, gmvp, frontier }) {
  if (!frontier || frontier.length === 0) {
    return <div className="w-full h-96 flex items-center justify-center text-gray-600">No frontier data available</div>;
  }

  // Prepare frontier data with x/y coordinates
  const frontierChartData = frontier.map((p) => ({
    x: p.stdDev,
    y: p.return,
    risk: p.stdDev,
    return: p.return,
    isGMVP: gmvp && p.stdDev === gmvp.stdDev && p.return === gmvp.return
  }));

  // GMVP data
  const gmvpChartData = gmvp ? [{
    x: gmvp.stdDev,
    y: gmvp.return,
    risk: gmvp.stdDev,
    return: gmvp.return,
    isGMVP: true
  }] : [];

  return (
    <div className="w-full h-96 bg-white rounded-xl shadow-md p-6">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 30, bottom: 80, left: 100 }}
          data={[...frontierChartData, ...gmvpChartData]}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            type="number" 
            dataKey="x" 
            name="Risk"
            label={{ 
              value: 'Risk (Standard Deviation)', 
              position: 'bottom', 
              offset: 30, 
              fontSize: 13, 
              fontWeight: 600,
              fill: '#1f2937' 
            }}
            tick={{ fill: '#4b5563', fontSize: 12, fontWeight: 500 }}
            tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
            domain={['dataMin - 0.002', 'dataMax + 0.002']}
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            name="Return"
            label={{ 
              value: 'Expected Return', 
              angle: -90, 
              position: 'insideLeft', 
              offset: -15, 
              fontSize: 13, 
              fontWeight: 600,
              fill: '#1f2937' 
            }}
            tick={{ fill: '#4b5563', fontSize: 12, fontWeight: 500 }}
            tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
            domain={['dataMin - 0.0005', 'dataMax + 0.0005']}
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3', stroke: '#999' }}
            contentStyle={{
              backgroundColor: '#fff',
              border: '2px solid #1f2937',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '12px',
              fontWeight: 500,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
            content={({ active, payload }) => {
              if (active && payload && payload[0]) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 rounded-lg border-2 border-gray-900 shadow-lg">
                    <p className="font-bold text-gray-900">Risk (σ): {(data.x * 100).toFixed(3)}%</p>
                    <p className="font-bold text-gray-900">Return (μ): {(data.y * 100).toFixed(3)}%</p>
                    {data.isGMVP && (
                      <p className="text-orange-600 font-bold text-sm mt-1">★ Global Minimum Variance Portfolio</p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '25px' }}
            iconType="circle"
            verticalAlign="bottom"
            height={40}
            fontSize={13}
            fontWeight={500}
          />
          
          {/* Efficient Frontier - main line/curve */}
          <Scatter
            name="Efficient Frontier"
            data={frontierChartData.filter(d => !d.isGMVP)}
            fill="#10b981"
            stroke="#059669"
            strokeWidth={2}
            fillOpacity={0.9}
            shape="circle"
          />
          
          {/* GMVP - distinct marker */}
          {gmvpChartData.length > 0 && (
            <Scatter
              name="GMVP (Global Min Variance)"
              data={gmvpChartData}
              fill="#ff6b35"
              stroke="#d63000"
              strokeWidth={2}
              fillOpacity={1}
              shape="diamond"
            />
          )}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
