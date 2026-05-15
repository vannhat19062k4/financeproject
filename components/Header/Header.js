'use client';
import { useState, useEffect } from 'react';
import { Calendar, Check, SlidersHorizontal, ChevronDown } from 'lucide-react';
import styles from './Header.module.css';

function formatRange(start, end) {
  if (!start || !end) return 'Chọn ngày';
  const fmt = (d) => {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };
  return `${fmt(start)} – ${fmt(end)}`;
}

export default function Header({ dateRange, onDatePickerOpen }) {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [greeting, setGreeting] = useState('Xin chào');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Chào buổi sáng');
    else if (hour < 18) setGreeting('Chào buổi chiều');
    else setGreeting('Chào buổi tối');
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.greeting}>
        <h1>{greeting}, Nhật 👋</h1>
      </div>

      <div className={styles.actions}>
        <button className={styles.autoRefresh} onClick={() => setAutoRefresh(!autoRefresh)}>
          <span className={`${styles.checkbox} ${autoRefresh ? styles.checkboxChecked : ''}`}>
            {autoRefresh && <Check size={12} />}
          </span>
          Auto-refresh
        </button>

        <button className={styles.dateButton} onClick={onDatePickerOpen}>
          <Calendar size={16} />
          {formatRange(dateRange?.start, dateRange?.end)}
          <ChevronDown size={14} />
        </button>

        <button className={styles.customizeBtn}>
          <SlidersHorizontal size={16} />
          Tuỳ chỉnh
        </button>
      </div>
    </header>
  );
}
