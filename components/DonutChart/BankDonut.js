import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '@/utils/formatCurrency';
import { getBankConfig } from '@/config/categories';
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

  // Show all non-zero balances in the distribution chart
  const chartData = data
    .filter(d => d.balance !== 0)
    .sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance))
    .map(d => ({
      ...d,
      absBalance: Math.abs(d.balance),
      config: getBankConfig(d.name)
    }));

  const totalAbs = chartData.reduce((s, item) => s + item.absBalance, 0);

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
              dataKey="absBalance"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.config.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name, props) => [formatCurrency(props.payload.balance), props.payload.config.label]}
              contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.legend}>
        {chartData.map((item, i) => {
          const percent = totalAbs > 0 ? (item.absBalance / totalAbs) * 100 : 0;
          return (
            <div key={i} className={styles.legendItem}>
              <div className={styles.legendLeft}>
                <span className={styles.legendDot} style={{ background: item.config.color }} />
                <span className={styles.legendName}>{item.config.label}</span>
              </div>
              <div className={styles.legendRight}>
                <span className={styles.legendValue} style={{ color: item.balance < 0 ? 'var(--expense)' : 'var(--text-primary)' }}>
                  {formatCurrency(item.balance)}
                </span>
                <span className={styles.legendPercent} style={{ background: `${item.config.color}15`, color: item.config.color }}>
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
