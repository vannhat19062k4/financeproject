'use client';
import React, { useState, useMemo, useEffect } from 'react';
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
import { MOCK_TRANSACTIONS, MOCK_BANK_BALANCES } from '@/data/mockData';
import { filterByDateRange, calculateKPIs, getExpenseByCategory, getTransactionsByType, getMonthlyTrend } from '@/utils/dataTransform';
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
  const [bankBalances, setBankBalances] = useState(MOCK_BANK_BALANCES); // Fallback to mock if API returns empty balances
  const [loadingData, setLoadingData] = useState(true);

  // API URL
  const API_URL = 'https://script.google.com/macros/s/AKfycbxNdchWTKM5h6G3hePOpbDiGT6SDWugKcIUKZOxgtidzGaW6xyOOIcRvdYvHyMyTKG2Yw/exec';

  useEffect(() => {
    // Fetch data from Google Sheets
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const response = await fetch(`${API_URL}?action=all`);
        const data = await response.json();
        
        if (data.transactions && data.transactions.length > 0) {
          // Parse dates correctly
          const parsedTransactions = data.transactions.map(t => ({
            ...t,
            // Convert string date back to Date object
            date: new Date(t.date)
          }));
          // Sort by date descending
          parsedTransactions.sort((a, b) => b.date - a.date);
          setTransactions(parsedTransactions);
        }
        
        if (data.balances && data.balances.length > 0) {
          setBankBalances(data.balances);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to mock data if fetch fails
        setTransactions(MOCK_TRANSACTIONS);
      } finally {
        setLoadingData(false);
        setDateRange(getDateRange('ytd'));
        setMounted(true);
      }
    };

    fetchData();
  }, []);

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
  const expenseByCategory = useMemo(() => getExpenseByCategory(filteredTransactions), [filteredTransactions]);
  const transactionsByType = useMemo(() => getTransactionsByType(filteredTransactions), [filteredTransactions]);

  if (!mounted || loadingData) {
    return (
      <div className="appLayout">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="mainContent">
          <Header dateRange={null} onDatePickerOpen={() => {}} />
          <div className="pageContent" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>
              <div style={{ fontSize: 32, marginBottom: 16 }} className={styles.pulseAnim}>⏳</div>
              <div style={{ fontSize: 16 }}>Đang đồng bộ dữ liệu từ Google Sheets...</div>
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes pulse {
                  0% { transform: scale(1); opacity: 1; }
                  50% { transform: scale(1.2); opacity: 0.7; }
                  100% { transform: scale(1); opacity: 1; }
                }
                .${styles.pulseAnim} { animation: pulse 1.5s infinite; }
              `}} />
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
        const monthlyTrend = getMonthlyTrend(filteredTransactions);
        return (
          <div className="pageContent">
            <div style={{ marginBottom: 24 }}>
              <TrendChart data={monthlyTrend} />
            </div>
            <div className={styles.dashboardGrid}>
              <div className={styles.chartSection}>
                <ExpenseBarChart data={expenseByCategory} />
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
            <KPICards kpis={kpis} />

            <div className={styles.dashboardGrid}>
              <div className={styles.chartSection}>
                <ExpenseBarChart data={expenseByCategory} />
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
        onMenuChange={setActiveMenu}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <main className="mainContent">
        <Header
          dateRange={dateRange}
          onDatePickerOpen={() => setDatePickerOpen(true)}
        />

        {renderContent()}
      </main>

      <DateRangePicker
        isOpen={datePickerOpen}
        onClose={() => setDatePickerOpen(false)}
        onApply={setDateRange}
        initialRange={dateRange}
      />
    </div>
  );
}
