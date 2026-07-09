'use client';
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Info } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';
import { CATEGORY_COLORS } from '@/config/categories';
import styles from './ExpenseBarChart.module.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#0F172A', color: 'white', padding: '10px 14px',
      borderRadius: '8px', fontSize: '13px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
      <div>{formatCurrency(payload[0].value)}</div>
    </div>
  );
};

function computeExpenseByCategory(transactions) {
  const grouped = {};
  transactions.filter(t => t.type === 'Chi tiêu').forEach(t => {
    const cat = t.category || 'Khác';
    grouped[cat] = (grouped[cat] || 0) + t.amount;
  });
  return Object.entries(grouped)
    .map(([name, value]) => ({
      name,
      value: Math.abs(value),
      fill: CATEGORY_COLORS[name] || '#64748B',
    }))
    .sort((a, b) => b.value - a.value);
}

const ExpenseBarChart = React.memo(function ExpenseBarChart({ transactions }) {
  // Use transactions directly — already filtered by DateRangePicker at page level
  const data = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    return computeExpenseByCategory(transactions);
  }, [transactions]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          Chi tiêu theo danh mục
          <Info size={16} className={styles.infoIcon} />
        </div>
      </div>

      {data && data.length > 0 ? (
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(0)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(79, 70, 229, 0.04)' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className={styles.emptyState}>Không có dữ liệu chi tiêu</div>
      )}
    </div>
  );
});

export default ExpenseBarChart;

