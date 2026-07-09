'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, Check, SlidersHorizontal, ChevronDown, RefreshCw } from 'lucide-react';
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

function formatLastSynced(date) {
  if (!date) return '';
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);
  if (diffSec < 5) return 'Vừa xong';
  if (diffSec < 60) return `${diffSec}s trước`;
  const diffMin = Math.floor(diffSec / 60);
  return `${diffMin} phút trước`;
}

const Header = React.memo(function Header({ dateRange, onDatePickerOpen, autoRefresh, onAutoRefreshToggle, onManualRefresh, isSyncing, lastSynced }) {
  const [greeting, setGreeting] = useState('Xin chào');
  const [, setTick] = useState(0);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Chào buổi sáng');
    else if (hour < 18) setGreeting('Chào buổi chiều');
    else setGreeting('Chào buổi tối');
  }, []);

  // Update "last synced" display every 5 seconds
  useEffect(() => {
    if (!lastSynced) return;
    const interval = setInterval(() => setTick(t => t + 1), 5000);
    return () => clearInterval(interval);
  }, [lastSynced]);

  return (
    <header className={styles.header}>
      <div className={styles.greeting}>
        <h1>{greeting}, Nhật 👋</h1>
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.syncBtn} ${isSyncing ? styles.syncBtnActive : ''}`}
          onClick={onManualRefresh}
          disabled={isSyncing}
          title={lastSynced ? `Đồng bộ lần cuối: ${lastSynced.toLocaleTimeString('vi-VN')}` : 'Chưa đồng bộ'}
        >
          <RefreshCw size={14} className={isSyncing ? styles.spinning : ''} />
          {isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ'}
        </button>

        {lastSynced && (
          <span className={styles.lastSynced}>{formatLastSynced(lastSynced)}</span>
        )}

        <button className={styles.autoRefresh} onClick={onAutoRefreshToggle}>
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
});

export default Header;

