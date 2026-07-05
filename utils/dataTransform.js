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
  // Use raw sums to match Google Sheet SUMIF formulas
  // Income: sum raw amounts (positive income, negative transfers cancel out)
  const totalIncome = transactions.filter(t => t.type === 'Thu nhập').reduce((s, t) => s + t.amount, 0);
  // Expense: sum raw amounts (negative expenses), show as positive
  const totalExpense = Math.abs(transactions.filter(t => t.type === 'Chi tiêu').reduce((s, t) => s + t.amount, 0));
  // Trả nợ: sum raw amounts (negative), show as positive
  const totalDebtPayment = Math.abs(transactions.filter(t => t.type === 'Trả nợ').reduce((s, t) => s + t.amount, 0));
  // Vay: sum raw amounts (positive)
  const totalLoan = transactions.filter(t => t.type === 'Vay').reduce((s, t) => s + t.amount, 0);
  // Net flow = Thu nhập - Chi tiêu + Vay - Trả nợ
  const netFlow = totalIncome - totalExpense + totalLoan - totalDebtPayment;
  const savingsRate = totalIncome > 0 ? (netFlow / totalIncome) * 100 : 0;

  const prevIncome = previousTransactions.filter(t => t.type === 'Thu nhập').reduce((s, t) => s + t.amount, 0);
  const prevExpense = Math.abs(previousTransactions.filter(t => t.type === 'Chi tiêu').reduce((s, t) => s + t.amount, 0));
  const prevDebtPayment = Math.abs(previousTransactions.filter(t => t.type === 'Trả nợ').reduce((s, t) => s + t.amount, 0));
  const prevLoan = previousTransactions.filter(t => t.type === 'Vay').reduce((s, t) => s + t.amount, 0);
  const prevNetFlow = prevIncome - prevExpense + prevLoan - prevDebtPayment;
  const prevSavingsRate = prevIncome > 0 ? (prevNetFlow / prevIncome) * 100 : 0;

  return {
    totalIncome, totalExpense, totalDebtPayment, totalLoan, netFlow, savingsRate,
    incomeChange: prevIncome > 0 ? ((totalIncome - prevIncome) / prevIncome) * 100 : 0,
    expenseChange: prevExpense > 0 ? ((totalExpense - prevExpense) / prevExpense) * 100 : 0,
    debtPaymentChange: prevDebtPayment > 0 ? ((totalDebtPayment - prevDebtPayment) / prevDebtPayment) * 100 : 0,
    loanChange: prevLoan > 0 ? ((totalLoan - prevLoan) / prevLoan) * 100 : 0,
    netFlowChange: prevNetFlow !== 0 ? ((netFlow - prevNetFlow) / Math.abs(prevNetFlow)) * 100 : 0,
    savingsRateChange: savingsRate - prevSavingsRate,
  };
}

export function getExpenseByCategory(transactions) {
  const grouped = {};
  transactions.filter(t => t.type === 'Chi tiêu').forEach(t => {
    const cat = t.category || 'Khác';
    grouped[cat] = (grouped[cat] || 0) + t.amount; // sum raw (negative) amounts
  });
  return Object.entries(grouped).map(([name, value]) => ({
    name, value: Math.abs(value), fill: CATEGORY_COLORS[name] || '#64748B', // abs for display
  })).sort((a, b) => b.value - a.value);
}

export function getTransactionsByType(transactions) {
  const grouped = {};
  transactions.forEach(t => {
    const type = t.type || 'Khác';
    grouped[type] = (grouped[type] || 0) + t.amount; // sum raw amounts
  });
  return Object.entries(grouped).map(([name, value]) => ({
    name, value: Math.abs(value), color: TRANSACTION_TYPES[name]?.color || '#64748B', // abs for display
  })).sort((a, b) => b.value - a.value);
}

export function getMonthlyTrend(transactions) {
  const monthly = {};
  transactions.forEach(t => {
    const date = parseDate(t.date);
    if (!date) return;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!monthly[key]) monthly[key] = { month: getMonthName(date.getMonth()), income: 0, expense: 0, loan: 0, debt: 0 };
    if (t.type === 'Thu nhập') monthly[key].income += t.amount;
    else if (t.type === 'Chi tiêu') monthly[key].expense += Math.abs(t.amount);
    else if (t.type === 'Vay') monthly[key].loan += t.amount;
    else if (t.type === 'Trả nợ') monthly[key].debt += Math.abs(t.amount);
  });
  return Object.entries(monthly).sort(([a], [b]) => a.localeCompare(b)).map(([, d]) => ({
    ...d,
    net: d.income - d.expense + d.loan - d.debt,
  }));
}

export function calculateBankBalances(transactions) {
  const balances = {};
  transactions.forEach(t => {
    const bank = t.bank || 'Khác';
    balances[bank] = (balances[bank] || 0) + t.amount;
  });
  return Object.entries(balances).map(([name, balance]) => ({ name, balance }));
}
