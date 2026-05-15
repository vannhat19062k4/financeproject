'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, Download, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/dateUtils';
import { TRANSACTION_TYPES, BANK_CONFIG } from '@/config/categories';
import styles from './TransactionTable.module.css';

const PAGE_SIZE = 10;

const TransactionTable = React.memo(function TransactionTable({ transactions }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterBank, setFilterBank] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);

  // Debounce search input to prevent lag when typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filtered = useMemo(() => {
    let result = [...(transactions || [])];
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(t => t.description?.toLowerCase().includes(q) || t.category?.toLowerCase().includes(q));
    }
    if (filterType !== 'all') result = result.filter(t => t.type === filterType);
    if (filterBank !== 'all') result = result.filter(t => t.bank === filterBank);

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'date') {
        const da = a.date instanceof Date ? a.date.getTime() : new Date(a.date).getTime();
        const db = b.date instanceof Date ? b.date.getTime() : new Date(b.date).getTime();
        cmp = da - db;
      } else if (sortField === 'amount') {
        cmp = Math.abs(a.amount) - Math.abs(b.amount);
      } else if (sortField === 'description') {
        cmp = (a.description || '').localeCompare(b.description || '');
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [transactions, debouncedSearch, filterType, filterBank, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const handleExport = () => {
    const headers = ['Ngày,Mô tả,Loại,Danh mục,Số tiền,Ngân hàng'];
    const rows = filtered.map(t => {
      const dateStr = t.date instanceof Date ? formatDate(t.date) : t.date;
      return `${dateStr},"${t.description}",${t.type},${t.category},${t.amount},${t.bank}`;
    });
    const csv = [...headers, ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = 'giao_dich.csv'; link.click();
    URL.revokeObjectURL(url);
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronUp size={12} className={styles.sortIcon} />;
    return sortDir === 'asc'
      ? <ChevronUp size={12} className={`${styles.sortIcon} ${styles.sortActive}`} />
      : <ChevronDown size={12} className={`${styles.sortIcon} ${styles.sortActive}`} />;
  };

  const types = useMemo(() => [...new Set(transactions?.map(t => t.type) || [])], [transactions]);
  const banks = useMemo(() => [...new Set(transactions?.map(t => t.bank) || [])], [transactions]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Dữ liệu giao dịch</div>
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <Search size={16} color="var(--text-tertiary)" />
            <input className={styles.searchInput} placeholder="Tìm kiếm..." value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setPage(1); }} />
          </div>
          <button className={`${styles.filterBtn} ${showFilters ? styles.filterActive : ''}`}
            onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal size={14} /> Lọc
          </button>
          <button className={styles.exportBtn} onClick={handleExport}>
            <Download size={14} /> Xuất CSV
          </button>
        </div>
      </div>

      {showFilters && (
        <div className={styles.filterPanel}>
          <select className={styles.filterSelect} value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }}>
            <option value="all">Tất cả loại</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select className={styles.filterSelect} value={filterBank} onChange={e => { setFilterBank(e.target.value); setPage(1); }}>
            <option value="all">Tất cả ngân hàng</option>
            {banks.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      )}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => handleSort('date')}>Ngày <SortIcon field="date" /></th>
              <th onClick={() => handleSort('description')}>Mô tả <SortIcon field="description" /></th>
              <th>Loại</th>
              <th>Danh mục</th>
              <th onClick={() => handleSort('amount')}>Số tiền <SortIcon field="amount" /></th>
              <th>Ngân hàng</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length > 0 ? paginated.map((t) => {
              const typeConfig = TRANSACTION_TYPES[t.type] || {};
              const bankConfig = BANK_CONFIG[t.bank] || { color: '#6B7280' };
              return (
                <tr key={t.id}>
                  <td>{t.date instanceof Date ? formatDate(t.date) : t.date}</td>
                  <td>{t.description}</td>
                  <td>
                    <span className={styles.badge} style={{ background: typeConfig.bgColor, color: typeConfig.color }}>
                      {t.type}
                    </span>
                  </td>
                  <td>
                    <span className={styles.badge} style={{ background: `${typeConfig.color}10`, color: typeConfig.color }}>
                      {t.category}
                    </span>
                  </td>
                  <td className={styles.amountCell} style={{ color: t.amount >= 0 ? 'var(--income)' : 'var(--expense)' }}>
                    {formatCurrency(t.amount)}
                  </td>
                  <td>
                    <div className={styles.bankCell}>
                      <span className={styles.bankDot} style={{ background: bankConfig.color }} />
                      {t.bank}
                    </div>
                  </td>
                </tr>
              );
            }) : (
              <tr><td colSpan={6} className={styles.emptyRow}>Không tìm thấy giao dịch nào</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <span className={styles.pageInfo}>
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} / {filtered.length} giao dịch
          </span>
          <div className={styles.pageButtons}>
            <button className={styles.pageBtn} onClick={() => setPage(p => p - 1)} disabled={page <= 1}>
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = i + 1;
              return (
                <button key={p} className={`${styles.pageBtn} ${page === p ? styles.pageBtnActive : ''}`}
                  onClick={() => setPage(p)}>{p}</button>
              );
            })}
            <button className={styles.pageBtn} onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default TransactionTable;
