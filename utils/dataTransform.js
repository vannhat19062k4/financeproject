import { TRANSACTION_TYPES, CATEGORY_COLORS } from '@/config/categories';
import { parseDate, isDateInRange, getMonthName } from '@/utils/dateUtils';

export function filterByDateRange(transactions, startDate, endDate) {
  if (!startDate || !endDate) return transactions;
  return transactions.filter(t => {
    const date = parseDate(t.date);
    return date && isDateInRange(date, startDate, endDate);
  });
}

export function calculateKPIs(transactions, previousTransactions = []) {
  const totalIncome = transactions.filter(t => t.type === 'Thu nhập').reduce((s, t) => s + Math.abs(t.amount), 0);
  const totalExpense = transactions.filter(t => t.type === 'Chi tiêu').reduce((s, t) => s + Math.abs(t.amount), 0);
  const totalInvestment = transactions.filter(t => t.type === 'Đầu tư').reduce((s, t) => s + Math.abs(t.amount), 0);
  const netFlow = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  const prevIncome = previousTransactions.filter(t => t.type === 'Thu nhập').reduce((s, t) => s + Math.abs(t.amount), 0);
  const prevExpense = previousTransactions.filter(t => t.type === 'Chi tiêu').reduce((s, t) => s + Math.abs(t.amount), 0);
  const prevSavingsRate = prevIncome > 0 ? ((prevIncome - prevExpense) / prevIncome) * 100 : 0;

  return {
    totalIncome, totalExpense, totalInvestment, netFlow, savingsRate,
    incomeChange: prevIncome > 0 ? ((totalIncome - prevIncome) / prevIncome) * 100 : 0,
    expenseChange: prevExpense > 0 ? ((totalExpense - prevExpense) / prevExpense) * 100 : 0,
    netFlowChange: 0,
    savingsRateChange: savingsRate - prevSavingsRate,
  };
}

export function getExpenseByCategory(transactions) {
  const grouped = {};
  transactions.filter(t => t.type === 'Chi tiêu').forEach(t => {
    const cat = t.category || 'Khác';
    grouped[cat] = (grouped[cat] || 0) + Math.abs(t.amount);
  });
  return Object.entries(grouped).map(([name, value]) => ({
    name, value, fill: CATEGORY_COLORS[name] || '#64748B',
  })).sort((a, b) => b.value - a.value);
}

export function getTransactionsByType(transactions) {
  const grouped = {};
  transactions.forEach(t => {
    const type = t.type || 'Khác';
    grouped[type] = (grouped[type] || 0) + Math.abs(t.amount);
  });
  return Object.entries(grouped).map(([name, value]) => ({
    name, value, color: TRANSACTION_TYPES[name]?.color || '#64748B',
  })).sort((a, b) => b.value - a.value);
}

export function getMonthlyTrend(transactions) {
  const monthly = {};
  transactions.forEach(t => {
    const date = parseDate(t.date);
    if (!date) return;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!monthly[key]) monthly[key] = { month: getMonthName(date.getMonth()), income: 0, expense: 0 };
    if (t.type === 'Thu nhập') monthly[key].income += Math.abs(t.amount);
    else if (t.type === 'Chi tiêu') monthly[key].expense += Math.abs(t.amount);
  });
  return Object.entries(monthly).sort(([a], [b]) => a.localeCompare(b)).map(([, d]) => ({ ...d, net: d.income - d.expense }));
}

export function calculateBankBalances(transactions) {
  const balances = {};
  transactions.forEach(t => {
    const bank = t.bank || 'Khác';
    balances[bank] = (balances[bank] || 0) + t.amount;
  });
  return Object.entries(balances).map(([name, balance]) => ({ name, balance }));
}
