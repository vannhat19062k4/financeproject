'use client';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import Header from '@/components/Header/Header';
import KPICards from '@/components/KPICard/KPICard';
import ExpenseBarChart from '@/components/BarChart/ExpenseBarChart';
import CategoryDonut from '@/components/DonutChart/CategoryDonut';
import BankDonut from '@/components/DonutChart/BankDonut';
import BankBalances from '@/components/BankBalances/BankBalances';
import TransactionTable from '@/components/TransactionTable/TransactionTable';
import DateRangePicker from '@/components/DateRangePicker/DateRangePicker';
import TrendChart from '@/components/TrendChart/TrendChart';
import TransactionDetailModal from '@/components/TransactionDetailModal/TransactionDetailModal';
import { MOCK_TRANSACTIONS } from '@/data/mockData';
import { filterByDateRange, calculateKPIs, getTransactionsByType, getMonthlyTrend, calculateBankBalances } from '@/utils/dataTransform';
import { getDateRange } from '@/utils/dateUtils';
import styles from './page.module.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    this.setState({ info });
    console.error("ErrorBoundary caught:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, color: 'red', background: '#fee', minHeight: '100vh', width: '100vw', zIndex: 9999, position: 'fixed', top: 0, left: 0 }}>
          <h2>Đã có lỗi xảy ra! (React Error)</h2>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{this.state.error?.toString()}</pre>
          <pre style={{ fontSize: 12, marginTop: 20 }}>{this.state.info?.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function DashboardWrapper() {
  return (
    <ErrorBoundary>
      <Dashboard />
    </ErrorBoundary>
  );
}

function Dashboard() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Real data state
  const [transactions, setTransactions] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Transaction detail modal state
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailFilterType, setDetailFilterType] = useState(null);
  const [detailTitle, setDetailTitle] = useState('');

  // API URL
  const API_URL = 'https://script.google.com/macros/s/AKfycbxNdchWTKM5h6G3hePOpbDiGT6SDWugKcIUKZOxgtidzGaW6xyOOIcRvdYvHyMyTKG2Yw/exec';

  const handleMenuChange = useCallback((menu) => {
    setActiveMenu(menu);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const openDatePicker = useCallback(() => {
    setDatePickerOpen(true);
  }, []);

  const closeDatePicker = useCallback(() => {
    setDatePickerOpen(false);
  }, []);

  const handleDateApply = useCallback((range) => {
    setDateRange(range);
  }, []);

  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch data function (memoized for use in interval)
  const fetchData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoadingData(true);
      const response = await fetch(`${API_URL}?action=all`);
      const data = await response.json();

      if (data.transactions && data.transactions.length > 0) {
        const parsedTransactions = data.transactions
          .map(t => ({
            ...t,
            date: new Date(t.date)
          }))
          .filter(t => !isNaN(t.date.getTime()));

        parsedTransactions.sort((a, b) => b.date - a.date);
        setTransactions(parsedTransactions);
      }

      // Bank balances are now calculated from transactions via useMemo
    } catch (error) {
      console.error('Error fetching data:', error);
      if (showLoading) setTransactions(MOCK_TRANSACTIONS);
    } finally {
      if (showLoading) {
        setLoadingData(false);
        setDateRange(getDateRange('ytd'));
        setMounted(true);
      }
    }
  }, [API_URL]);

  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  // Auto-refresh interval (every 30 seconds)
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchData(false); // Silent refresh
    }, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  // Filter transactions by date range
  const filteredTransactions = useMemo(() => {
    if (!dateRange) return transactions;
    return filterByDateRange(transactions, dateRange.start, dateRange.end);
  }, [dateRange, transactions]);

  // Calculate previous period for comparison
  const previousTransactions = useMemo(() => {
    if (!dateRange) return [];
    const duration = dateRange.end.getTime() - dateRange.start.getTime();
    const prevEnd = new Date(dateRange.start.getTime() - 1);
    const prevStart = new Date(prevEnd.getTime() - duration);
    return filterByDateRange(transactions, prevStart, prevEnd);
  }, [dateRange, transactions]);

  // KPIs
  const kpis = useMemo(() => calculateKPIs(filteredTransactions, previousTransactions), [filteredTransactions, previousTransactions]);

  // Chart data
  const transactionsByType = useMemo(() => getTransactionsByType(filteredTransactions), [filteredTransactions]);
  const monthlyTrend = useMemo(() => getMonthlyTrend(filteredTransactions), [filteredTransactions]);

  // Bank balances: calculated from ALL transactions (not filtered by date)
  // Groups by bank field (column G) and sums all amounts per bank
  const bankBalances = useMemo(() => calculateBankBalances(transactions), [transactions]);

  const handleAutoRefreshToggle = useCallback(() => {
    setAutoRefresh(prev => !prev);
  }, []);

  const handleKPICardClick = useCallback((filterType, label) => {
    setDetailFilterType(filterType);
    setDetailTitle(label);
    setDetailModalOpen(true);
  }, []);

  const closeDetailModal = useCallback(() => {
    setDetailModalOpen(false);
  }, []);

  if (!mounted || loadingData) {
    return (
      <div className="appLayout">
        <Sidebar activeMenu={activeMenu} onMenuChange={handleMenuChange} isOpen={sidebarOpen} onToggle={toggleSidebar} />
        <main className="mainContent">
          <Header dateRange={null} onDatePickerOpen={openDatePicker} />
          <div className="pageContent" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>
              <div style={{ fontSize: 32, marginBottom: 16 }} className={styles.pulseAnim}>⏳</div>
              <div style={{ fontSize: 16 }}>Đang đồng bộ dữ liệu từ Google Sheets...</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeMenu) {
      case 'transactions':
        return (
          <div className="pageContent">
            <TransactionTable transactions={filteredTransactions} />
          </div>
        );

      case 'accounts':
        return (
          <div className="pageContent">
            <div className={styles.dashboardGrid}>
              <div className={styles.chartSection}>
                <BankBalances balances={bankBalances} />
              </div>
              <div className={styles.rightPanel}>
                <BankDonut data={bankBalances} />
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="pageContent">
            <div style={{ marginBottom: 24 }}>
              <TrendChart data={monthlyTrend} />
            </div>
            <div className={styles.dashboardGrid}>
              <div className={styles.chartSection}>
                <ExpenseBarChart transactions={filteredTransactions} />
              </div>
              <div className={styles.rightPanel}>
                <CategoryDonut data={transactionsByType} />
              </div>
            </div>
          </div>
        );

      case 'dashboard':
      default:
        return (
          <div className="pageContent">
            <KPICards kpis={kpis} onCardClick={handleKPICardClick} />

            <div className={styles.dashboardGrid}>
              <div className={styles.chartSection}>
                <ExpenseBarChart transactions={filteredTransactions} />
              </div>
              <div className={styles.rightPanel}>
                <CategoryDonut data={transactionsByType} />
                <BankBalances balances={bankBalances} />
              </div>
            </div>

            <TransactionTable transactions={filteredTransactions} />
          </div>
        );
    }
  };



  return (
    <div className="appLayout">
      <Sidebar
        activeMenu={activeMenu}
        onMenuChange={handleMenuChange}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
      />

      <main className="mainContent">
        <Header
          dateRange={dateRange}
          onDatePickerOpen={openDatePicker}
          autoRefresh={autoRefresh}
          onAutoRefreshToggle={handleAutoRefreshToggle}
        />

        {renderContent()}
      </main>

      <DateRangePicker
        isOpen={datePickerOpen}
        onClose={closeDatePicker}
        onApply={handleDateApply}
        initialRange={dateRange}
      />

      <TransactionDetailModal
        isOpen={detailModalOpen}
        onClose={closeDetailModal}
        transactions={filteredTransactions}
        filterType={detailFilterType}
        title={detailTitle}
      />
    </div>
  );
}
