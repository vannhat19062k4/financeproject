/**
 * Format number as Vietnamese Dong currency
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '0 đ';
  
  const absAmount = Math.abs(amount);
  const formatted = new Intl.NumberFormat('vi-VN').format(absAmount);
  
  if (amount < 0) {
    return `-${formatted} đ`;
  }
  return `${formatted} đ`;
}

/**
 * Format number as compact currency (e.g., 43.5M, 4.6K)
 */
export function formatCompactCurrency(amount) {
  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  
  if (absAmount >= 1_000_000_000) {
    return `${sign}${(absAmount / 1_000_000_000).toFixed(1)}B đ`;
  }
  if (absAmount >= 1_000_000) {
    return `${sign}${(absAmount / 1_000_000).toFixed(1)}M đ`;
  }
  if (absAmount >= 1_000) {
    return `${sign}${(absAmount / 1_000).toFixed(1)}K đ`;
  }
  return `${sign}${absAmount} đ`;
}

/**
 * Format percentage
 */
export function formatPercent(value) {
  if (value === null || value === undefined || isNaN(value)) return '0%';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}
