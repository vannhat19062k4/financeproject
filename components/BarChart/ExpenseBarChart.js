'use client';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Info, Calendar } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';
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

export default function ExpenseBarChart({ data }) {
  const [view, setView] = useState('month');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          Chi tiêu theo danh mục
          <Info size={16} className={styles.infoIcon} />
        </div>
        <div className={styles.viewToggle}>
          <Calendar size={14} style={{ margin: '0 6px', color: 'var(--text-tertiary)' }} />
          {['week', 'month', 'year'].map(v => (
            <button key={v} className={`${styles.toggleBtn} ${view === v ? styles.toggleBtnActive : ''}`} onClick={() => setView(v)}>
              {v === 'week' ? 'Tuần' : v === 'month' ? 'Tháng' : 'Năm'}
            </button>
          ))}
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
}
