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

// Helper function to format decimal values as percentages
const formatPercent = (value) => {
  if (value === null || value === undefined) return '0.00%';
  return `${(value * 100).toFixed(2)}%`;
};

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
    isGMVP: gmvp && Math.abs(p.stdDev - gmvp.stdDev) < 0.00001 && Math.abs(p.return - gmvp.return) < 0.00001
  }));

  // GMVP data
  const gmvpChartData = gmvp ? [{
    x: gmvp.stdDev,
    y: gmvp.return,
    risk: gmvp.stdDev,
    return: gmvp.return,
    isGMVP: true
  }] : [];

  // Calculate domain with proper padding
  if (frontierChartData.length === 0) {
    return <div className="w-full h-96 flex items-center justify-center text-gray-600">No chart data available</div>;
  }

  const xValues = [...frontierChartData, ...gmvpChartData].map(d => d.x);
  const yValues = [...frontierChartData, ...gmvpChartData].map(d => d.y);

  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);

  // Add 5% padding to domain
  const xPadding = (xMax - xMin) * 0.05;
  const yPadding = (yMax - yMin) * 0.05;

  const xDomain = [Math.max(0, xMin - xPadding), xMax + xPadding];
  const yDomain = [Math.max(0, yMin - yPadding), yMax + yPadding];

  // Generate nice tick values for x-axis
  const xTickCount = 6;
  const xTicks = generateTicks(xDomain[0], xDomain[1], xTickCount);

  // Generate nice tick values for y-axis
  const yTickCount = 6;
  const yTicks = generateTicks(yDomain[0], yDomain[1], yTickCount);

  return (
    <div className="w-full h-96 bg-white rounded-xl shadow-md p-6">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 40, bottom: 100, left: 120 }}
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
              offset: 50, 
              fontSize: 13, 
              fontWeight: 600,
              fill: '#1f2937',
              style: { textAnchor: 'middle' }
            }}
            tick={{ fill: '#4b5563', fontSize: 11, fontWeight: 500 }}
            tickFormatter={formatPercent}
            ticks={xTicks}
            domain={xDomain}
            type="number"
          />

          <YAxis 
            type="number" 
            dataKey="y" 
            name="Return"
            label={{ 
              value: 'Expected Return', 
              angle: -90, 
              position: 'insideLeft', 
              offset: 10, 
              fontSize: 13, 
              fontWeight: 600,
              fill: '#1f2937',
              style: { textAnchor: 'middle' }
            }}
            tick={{ fill: '#4b5563', fontSize: 11, fontWeight: 500 }}
            tickFormatter={formatPercent}
            ticks={yTicks}
            domain={yDomain}
            type="number"
          />

          <Tooltip
            cursor={{ strokeDasharray: '3 3', stroke: '#999' }}
            contentStyle={{
              backgroundColor: '#fff',
              border: '2px solid #1f2937',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '13px',
              fontWeight: 500,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
            content={({ active, payload }) => {
              if (active && payload && payload[0]) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 rounded-lg border-2 border-gray-900 shadow-lg">
                    <p className="font-bold text-gray-900">Risk (σ): {formatPercent(data.x)}</p>
                    <p className="font-bold text-gray-900">Return (μ): {formatPercent(data.y)}</p>
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
            wrapperStyle={{ paddingTop: '30px' }}
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

/**
 * Generate evenly-spaced tick values for a given domain
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {number} tickCount - Target number of ticks
 * @returns {number[]} Array of tick values
 */
function generateTicks(min, max, tickCount) {
  if (min >= max) return [0];
  
  const range = max - min;
  const roughStep = range / (tickCount - 1);
  
  // Find a nice step size
  const step = getNiceStep(roughStep);
  
  // Generate ticks from floor(min/step)*step to ceil(max/step)*step
  const ticks = [];
  let start = Math.floor(min / step) * step;
  let current = start;
  
  while (current <= max + step * 0.0001) {
    if (current >= min - step * 0.0001) {
      ticks.push(Math.round(current * 1e10) / 1e10); // Fix floating point errors
    }
    current += step;
  }
  
  return ticks.length > 0 ? ticks : [min, max];
}

/**
 * Find a nice step size for axis ticks
 * @param {number} roughStep - Initial step size
 * @returns {number} Nice step size
 */
function getNiceStep(roughStep) {
  const exponent = Math.floor(Math.log10(roughStep));
  const mantissa = roughStep / Math.pow(10, exponent);
  
  let niceMantissa;
  if (mantissa < 1.5) {
    niceMantissa = 1;
  } else if (mantissa < 3) {
    niceMantissa = 2;
  } else if (mantissa < 7) {
    niceMantissa = 5;
  } else {
    niceMantissa = 10;
  }
  
  return niceMantissa * Math.pow(10, exponent);
}
