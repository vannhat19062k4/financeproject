'use client';
import React, { useMemo } from 'react';
import { X, FileText } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/dateUtils';
import { TRANSACTION_TYPES, getBankConfig } from '@/config/categories';
import styles from './TransactionDetailModal.module.css';

const TransactionDetailModal = React.memo(function TransactionDetailModal({
  isOpen,
  onClose,
  transactions,
  filterType,
  title,
}) {
  const filtered = useMemo(() => {
    if (!transactions) return [];
    if (!filterType) return [...transactions].sort((a, b) => {
      const da = a.date instanceof Date ? a.date : new Date(a.date);
      const db = b.date instanceof Date ? b.date : new Date(b.date);
      return db - da;
    });
    return transactions
      .filter(t => t.type === filterType)
      .sort((a, b) => {
        const da = a.date instanceof Date ? a.date : new Date(a.date);
        const db = b.date instanceof Date ? b.date : new Date(b.date);
        return db - da;
      });
  }, [transactions, filterType]);

  const stats = useMemo(() => {
    if (filtered.length === 0) return { total: 0, count: 0, avg: 0 };
    const total = filtered.reduce((s, t) => s + t.amount, 0);
    return {
      total,
      count: filtered.length,
      avg: total / filtered.length,
    };
  }, [filtered]);

  if (!isOpen) return null;

  const typeConfig = filterType ? TRANSACTION_TYPES[filterType] : null;
  const iconBg = typeConfig?.bgColor || '#EEF2FF';
  const iconColor = typeConfig?.color || '#4F46E5';

  return (
    <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon} style={{ background: iconBg }}>
              <FileText size={20} color={iconColor} />
            </div>
            <div>
              <div className={styles.headerTitle}>
                {title || 'Tất cả giao dịch'}
                <span className={styles.headerCount}> ({filtered.length})</span>
              </div>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Tổng cộng</span>
            <span className={styles.summaryValue} style={{ color: stats.total >= 0 ? 'var(--income)' : 'var(--expense)' }}>
              {formatCurrency(stats.total)}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Số giao dịch</span>
            <span className={styles.summaryValue}>{stats.count}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Trung bình</span>
            <span className={styles.summaryValue}>{formatCurrency(Math.round(stats.avg))}</span>
          </div>
        </div>

        <div className={styles.body}>
          {filtered.length > 0 ? (
            filtered.map((t) => {
              const tConfig = TRANSACTION_TYPES[t.type] || {};
              const bConfig = getBankConfig(t.bank);
              return (
                <div key={t.id} className={styles.listItem}>
                  <div className={styles.itemLeft}>
                    <div className={styles.itemDesc}>{t.description}</div>
                    <div className={styles.itemMeta}>
                      <span className={styles.itemDate}>
                        {t.date instanceof Date ? formatDate(t.date) : t.date}
                      </span>
                      <span
                        className={styles.itemCategory}
                        style={{ background: `${tConfig.color || '#64748B'}15`, color: tConfig.color || '#64748B' }}
                      >
                        {t.category}
                      </span>
                      <span className={styles.itemBank}>
                        <span className={styles.bankDot} style={{ background: bConfig.color }} />
                        {bConfig.label || t.bank}
                      </span>
                    </div>
                  </div>
                  <div className={styles.itemRight}>
                    <span
                      className={styles.itemAmount}
                      style={{ color: t.amount >= 0 ? 'var(--income)' : 'var(--expense)' }}
                    >
                      {formatCurrency(t.amount)}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.emptyState}>
              <FileText size={32} />
              <span>Không có giao dịch nào</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default TransactionDetailModal;
