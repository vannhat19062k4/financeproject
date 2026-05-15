'use client';
import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getDateRange, getDaysInMonth, getFirstDayOfMonth, getMonthName, formatDateRange } from '@/utils/dateUtils';
import { DATE_PRESETS } from '@/config/categories';
import styles from './DateRangePicker.module.css';

function CalendarGrid({ year, month, startDate, endDate, onSelect, onNav }) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();
  const isToday = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const prevDays = getDaysInMonth(prevYear, prevMonth);

  const days = [];
  // Previous month fill
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: prevDays - i, current: false });
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ day: d, current: true });
  }
  // Next month fill
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    days.push({ day: d, current: false });
  }

  const isSelected = (d) => {
    if (!d.current) return false;
    const date = new Date(year, month, d.day);
    if (startDate && date.getTime() === startDate.getTime()) return true;
    if (endDate && date.getTime() === endDate.getTime()) return true;
    return false;
  };

  const isInRange = (d) => {
    if (!d.current || !startDate || !endDate) return false;
    const date = new Date(year, month, d.day);
    return date > startDate && date < endDate;
  };

  const isRangeStart = (d) => {
    if (!d.current || !startDate) return false;
    return new Date(year, month, d.day).getTime() === startDate.getTime();
  };

  const isRangeEnd = (d) => {
    if (!d.current || !endDate) return false;
    return new Date(year, month, d.day).getTime() === endDate.getTime();
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.calHeader}>
        <button className={styles.calNav} onClick={() => onNav(-1)}><ChevronLeft size={16} /></button>
        <span className={styles.calTitle}>{getMonthName(month)}, {year}</span>
        <button className={styles.calNav} onClick={() => onNav(1)}><ChevronRight size={16} /></button>
      </div>
      <div className={styles.weekDays}>
        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
          <span key={d} className={styles.weekDay}>{d}</span>
        ))}
      </div>
      <div className={styles.days}>
        {days.map((d, i) => {
          const selected = isSelected(d);
          const inRange = isInRange(d);
          const rangeStart = isRangeStart(d);
          const rangeEnd = isRangeEnd(d);
          let cls = styles.day;
          if (!d.current) cls += ` ${styles.dayOther}`;
          if (d.current && isToday(d.day)) cls += ` ${styles.dayToday}`;
          if (selected) cls += ` ${styles.daySelected}`;
          if (inRange) cls += ` ${styles.dayInRange}`;
          if (rangeStart) cls += ` ${styles.dayRangeStart}`;
          if (rangeEnd) cls += ` ${styles.dayRangeEnd}`;

          return (
            <button key={i} className={cls}
              onClick={() => d.current && onSelect(new Date(year, month, d.day))}>
              {d.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function DateRangePicker({ isOpen, onClose, onApply, initialRange }) {
  const now = new Date();
  const [leftMonth, setLeftMonth] = useState(now.getMonth());
  const [leftYear, setLeftYear] = useState(now.getFullYear());
  const [startDate, setStartDate] = useState(initialRange?.start || null);
  const [endDate, setEndDate] = useState(initialRange?.end || null);
  const [activePreset, setActivePreset] = useState(null);

  const rightMonth = leftMonth === 11 ? 0 : leftMonth + 1;
  const rightYear = leftMonth === 11 ? leftYear + 1 : leftYear;

  const handleNav = useCallback((dir) => {
    setLeftMonth(m => {
      const newM = m + dir;
      if (newM < 0) { setLeftYear(y => y - 1); return 11; }
      if (newM > 11) { setLeftYear(y => y + 1); return 0; }
      return newM;
    });
  }, []);

  const handleSelect = useCallback((date) => {
    setActivePreset(null);
    if (!startDate || (startDate && endDate) || date < startDate) {
      setStartDate(date);
      setEndDate(null);
    } else {
      setEndDate(date);
    }
  }, [startDate, endDate]);

  const handlePreset = useCallback((preset) => {
    setActivePreset(preset);
    const range = getDateRange(preset);
    setStartDate(range.start);
    setEndDate(range.end);
    setLeftMonth(range.start.getMonth());
    setLeftYear(range.start.getFullYear());
  }, []);

  const handleApply = useCallback(() => {
    if (startDate && endDate) {
      onApply({ start: startDate, end: endDate });
    }
    onClose();
  }, [startDate, endDate, onApply, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.body}>
          <div className={styles.presets}>
            {DATE_PRESETS.map(p => (
              <button key={p.value}
                className={`${styles.presetBtn} ${activePreset === p.value ? styles.presetActive : ''}`}
                onClick={() => handlePreset(p.value)}>
                {p.label}
              </button>
            ))}
          </div>
          <div className={styles.calendars}>
            <CalendarGrid year={leftYear} month={leftMonth} startDate={startDate} endDate={endDate}
              onSelect={handleSelect} onNav={handleNav} />
            <CalendarGrid year={rightYear} month={rightMonth} startDate={startDate} endDate={endDate}
              onSelect={handleSelect} onNav={handleNav} />
          </div>
        </div>
        <div className={styles.footer}>
          <div className={styles.rangeText}>
            Khoảng thời gian:
            <span className={styles.rangeLabel}>
              {startDate && endDate ? formatDateRange(startDate, endDate) : 'Chưa chọn'}
            </span>
          </div>
          <div className={styles.footerButtons}>
            <button className={styles.cancelBtn} onClick={onClose}>Huỷ</button>
            <button className={styles.applyBtn} onClick={handleApply}>Áp dụng</button>
          </div>
        </div>
      </div>
    </div>
  );
}
