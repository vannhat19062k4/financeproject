import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCompactCurrency } from '@/utils/formatCurrency';
import styles from './TrendChart.module.css';

export default function TrendChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>Xu hướng hàng tháng</div>
        </div>
        <div className={styles.emptyState}>Không có dữ liệu xu hướng</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Xu hướng hàng tháng</div>
      </div>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} tickFormatter={formatCompactCurrency} width={60} />
            <Tooltip 
              formatter={(value) => formatCompactCurrency(value)}
              contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
            <Line type="monotone" dataKey="income" name="Thu nhập" stroke="var(--income)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="expense" name="Chi tiêu" stroke="var(--expense)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
