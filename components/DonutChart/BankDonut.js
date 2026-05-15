import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '@/utils/formatCurrency';
import { BANK_CONFIG } from '@/config/categories';
import styles from './BankDonut.module.css';

const BankDonut = React.memo(function BankDonut({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.title}>Phân bổ tài khoản</div>
        <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: 14 }}>
          Không có dữ liệu
        </div>
      </div>
    );
  }

  // Filter out negative balances for the pie chart and sort
  const chartData = data
    .filter(d => d.balance > 0)
    .sort((a, b) => b.balance - a.balance)
    .map(d => ({
      ...d,
      color: BANK_CONFIG[d.name]?.color || '#6B7280'
    }));

  const total = chartData.reduce((s, item) => s + item.balance, 0);

  return (
    <div className={styles.container}>
      <div className={styles.title}>Phân bổ tài khoản</div>
      
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="balance"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => formatCurrency(value)}
              contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.legend}>
        {chartData.map((item, i) => {
          const percent = total > 0 ? (item.balance / total) * 100 : 0;
          return (
            <div key={i} className={styles.legendItem}>
              <div className={styles.legendLeft}>
                <span className={styles.legendDot} style={{ background: item.color }} />
                <span className={styles.legendName}>{BANK_CONFIG[item.name]?.label || item.name}</span>
              </div>
              <div className={styles.legendRight}>
                <span className={styles.legendValue}>{formatCurrency(item.balance)}</span>
                <span className={styles.legendPercent} style={{ background: `${item.color}15`, color: item.color }}>
                  {percent.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default BankDonut;
