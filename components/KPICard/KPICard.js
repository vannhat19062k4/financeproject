'use client';
import React from 'react';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency, formatPercent } from '@/utils/formatCurrency';
import styles from './KPICard.module.css';

const CARD_CONFIG = [
  { key: 'totalIncome', label: 'Tổng Thu nhập', icon: TrendingUp, changeKey: 'incomeChange', iconBg: '#ECFDF5', iconColor: '#10B981' },
  { key: 'totalExpense', label: 'Tổng Chi tiêu', icon: TrendingDown, changeKey: 'expenseChange', iconBg: '#FEF2F2', iconColor: '#EF4444' },
  { key: 'netFlow', label: 'Dòng tiền ròng', icon: Wallet, changeKey: 'netFlowChange', iconBg: '#EEF2FF', iconColor: '#4F46E5' },
  { key: 'savingsRate', label: 'Tỷ lệ Tiết kiệm', icon: PiggyBank, changeKey: 'savingsRateChange', iconBg: '#ECFEFF', iconColor: '#06B6D4', isPercent: true },
];

const KPICards = React.memo(function KPICards({ kpis }) {
  return (
    <div className={styles.grid}>
      {CARD_CONFIG.map((config) => {
        const value = kpis?.[config.key] ?? 0;
        const change = kpis?.[config.changeKey] ?? 0;
        const Icon = config.icon;
        const isPositive = change >= 0;

        return (
          <div className={styles.card} key={config.key}>
            <div className={styles.cardHeader}>
              <span className={styles.cardLabel}>
                <span className={styles.iconWrapper} style={{ background: config.iconBg }}>
                  <Icon size={18} color={config.iconColor} />
                </span>
                {config.label}
              </span>
            </div>
            <div className={styles.cardValue}>
              {config.isPercent ? `${value.toFixed(1)}%` : formatCurrency(value)}
            </div>
            <div className={styles.cardFooter}>
              <span className={isPositive ? styles.changePositive : styles.changeNegative}>
                {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {formatPercent(change)}
              </span>
              <span className={styles.changeLabel}>so với kỳ trước</span>
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default KPICards;
