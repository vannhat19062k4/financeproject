'use client';
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Info } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';
import styles from './CategoryDonut.module.css';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#0F172A', color: 'white', padding: '10px 14px',
      borderRadius: '8px', fontSize: '13px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    }}>
      <div style={{ fontWeight: 600 }}>{payload[0].name}</div>
      <div>{formatCurrency(payload[0].value)}</div>
    </div>
  );
};

const CategoryDonut = React.memo(function CategoryDonut({ data }) {
  const total = data?.reduce((sum, d) => sum + d.value, 0) || 0;

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        Phân bổ theo loại
        <Info size={16} style={{ color: 'var(--text-tertiary)' }} />
      </div>

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
              paddingAngle={3} dataKey="value" stroke="none">
              {data?.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.legend}>
        {data?.map((item, i) => {
          const percent = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
          return (
            <div key={i} className={styles.legendItem}>
              <div className={styles.legendLeft}>
                <span className={styles.legendDot} style={{ background: item.color }} />
                <span className={styles.legendName}>{item.name}</span>
              </div>
              <div className={styles.legendRight}>
                <span className={styles.legendValue}>{formatCurrency(item.value)}</span>
                <span className={styles.legendPercent} style={{ background: `${item.color}15`, color: item.color }}>
                  {percent}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default CategoryDonut;
