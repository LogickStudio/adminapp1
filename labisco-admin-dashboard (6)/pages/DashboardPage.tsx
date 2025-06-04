
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import StatCard from '../components/StatCard.js';
import { INITIAL_STATS, INITIAL_SALES_DATA, INITIAL_ORDER_STATUS_DATA, CHART_COLORS_PRIMARY } from '../constants.js';
import type { StatCardData, SalesData, OrderStatusData } from '../types.js';
import { useTheme } from '../contexts/ThemeContext.js';

const DashboardPage: React.FC = () => {
  const { theme } = useTheme();
  const [stats, setStats] = useState<StatCardData[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<OrderStatusData[]>([]);

  useEffect(() => {
    setStats(INITIAL_STATS);
    setSalesData(INITIAL_SALES_DATA);
    setOrderStatusData(INITIAL_ORDER_STATUS_DATA);
  }, []);
  
  const productCategoriesChartData = INITIAL_ORDER_STATUS_DATA.map(cat => ({ name: cat.name, count: cat.value }));

  // Theme-dependent chart styles
  const tickFill = theme === 'dark' ? '#9CA3AF' : '#6B7280'; // neutral-400 dark, neutral-500 light
  const gridStroke = theme === 'dark' ? '#374151' : '#E5E7EB'; // neutral-700 dark, neutral-200 light
  const tooltipBg = theme === 'dark' ? '#1F2937' : '#FFFFFF'; // neutral-800 dark, white light
  const tooltipBorder = theme === 'dark' ? '#374151' : '#D1D5DB'; // neutral-700 dark, neutral-300 light
  const tooltipColor = theme === 'dark' ? '#F3F4F6' : '#1F2937'; // neutral-100 dark, neutral-800 light
  const legendColor = theme === 'dark' ? '#D1D5DB' : '#374151'; // neutral-300 dark, neutral-700 light

  return (
    <div className="space-y-6">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <div className="bg-cardLight dark:bg-cardDark p-4 sm:p-6 rounded-xl shadow-lg border border-borderLight dark:border-borderDark">
          <h2 className="text-xl font-semibold text-textLight dark:text-textDark mb-4">Sales Trend (Last 6 Months)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} stroke={gridStroke} />
              <XAxis dataKey="month" stroke={tickFill} tick={{ fill: tickFill }} />
              <YAxis stroke={tickFill} tick={{ fill: tickFill }} />
              <Tooltip 
                contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '0.5rem' }} 
                itemStyle={{ color: tooltipColor }}
                cursor={{fill: theme === 'dark' ? 'rgba(21, 128, 61, 0.1)' : 'rgba(22, 163, 74, 0.1)'}}
              />
              <Legend wrapperStyle={{color: legendColor}}/>
              <Line type="monotone" dataKey="sales" stroke={CHART_COLORS_PRIMARY[0]} strokeWidth={2} activeDot={{ r: 8, fill: CHART_COLORS_PRIMARY[0], stroke: tooltipBg, strokeWidth: 2 }} dot={{fill: CHART_COLORS_PRIMARY[0], strokeWidth:0}} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Pie Chart */}
        <div className="bg-cardLight dark:bg-cardDark p-4 sm:p-6 rounded-xl shadow-lg border border-borderLight dark:border-borderDark">
          <h2 className="text-xl font-semibold text-textLight dark:text-textDark mb-4">Order Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8" 
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                // Ensure label text is readable in both modes
                // This might require custom label component for full control
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS_PRIMARY[index % CHART_COLORS_PRIMARY.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '0.5rem' }} 
                itemStyle={{ color: tooltipColor }}
              />
              <Legend wrapperStyle={{color: legendColor}}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

       <div className="bg-cardLight dark:bg-cardDark p-4 sm:p-6 rounded-xl shadow-lg border border-borderLight dark:border-borderDark">
          <h2 className="text-xl font-semibold text-textLight dark:text-textDark mb-4">Order Breakdown (Example)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productCategoriesChartData} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} stroke={gridStroke}/>
              <XAxis type="number" stroke={tickFill} tick={{ fill: tickFill }} />
              <YAxis dataKey="name" type="category" stroke={tickFill} tick={{ fill: tickFill }} width={100} />
              <Tooltip 
                contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '0.5rem' }} 
                itemStyle={{ color: tooltipColor }}
                cursor={{fill: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)'}}
              />
              <Legend wrapperStyle={{color: legendColor}}/>
              <Bar dataKey="count" fill={CHART_COLORS_PRIMARY[1]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
    </div>
  );
};

export default DashboardPage;