/**
 * Parse date string from Google Sheets format (dd/mm/yyyy)
 */
export function parseDate(dateStr) {
  if (!dateStr) return null;
  if (dateStr instanceof Date) return dateStr;
  
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts.map(Number);
    return new Date(year, month - 1, day);
  }
  return new Date(dateStr);
}

/**
 * Format date for display
 */
export function formatDate(date, format = 'short') {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  
  if (format === 'short') {
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
  if (format === 'long') {
    return d.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  if (format === 'month') {
    return d.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' });
  }
  return d.toLocaleDateString('vi-VN');
}

/**
 * Get date range based on preset
 */
export function getDateRange(preset) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (preset) {
    case 'today':
      return { start: today, end: today };
    case '7days': {
      const start = new Date(today);
      start.setDate(start.getDate() - 6);
      return { start, end: today };
    }
    case '30days': {
      const start = new Date(today);
      start.setDate(start.getDate() - 29);
      return { start, end: today };
    }
    case '3months': {
      const start = new Date(today);
      start.setMonth(start.getMonth() - 3);
      return { start, end: today };
    }
    case '12months': {
      const start = new Date(today);
      start.setFullYear(start.getFullYear() - 1);
      return { start, end: today };
    }
    case 'mtd': {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      return { start, end: today };
    }
    case 'ytd': {
      const start = new Date(today.getFullYear(), 0, 1);
      return { start, end: today };
    }
    case 'all':
      return { start: new Date(2020, 0, 1), end: today };
    default:
      return { start: new Date(today.getFullYear(), today.getMonth(), 1), end: today };
  }
}

/**
 * Check if date is within range
 */
export function isDateInRange(date, start, end) {
  const d = date instanceof Date ? date : parseDate(date);
  if (!d) return false;
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59);
  return d >= s && d <= e;
}

/**
 * Get month name in Vietnamese
 */
export function getMonthName(monthIndex) {
  const months = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
    'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
    'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];
  return months[monthIndex];
}

/**
 * Get days in month
 */
export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Get first day of month (0 = Sunday ... 6 = Saturday), adjusted for Monday start
 */
export function getFirstDayOfMonth(year, month) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday = 0
}

export function formatDateRange(start, end) {
  if (!start || !end) return '';
  const fmt = (d) => {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };
  return `${fmt(start)} – ${fmt(end)}`;
}
