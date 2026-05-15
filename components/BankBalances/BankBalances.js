'use client';
import React from 'react';
import { Landmark } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';
import { BANK_CONFIG } from '@/config/categories';
import styles from './BankBalances.module.css';

const BankBalances = React.memo(function BankBalances({ balances }) {
  const total = balances?.reduce((sum, b) => sum + b.balance, 0) || 0;

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <Landmark size={18} />
        Số dư tài khoản
      </div>

      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>Tổng số dư</span>
        <span className={styles.totalValue}>{formatCurrency(total)}</span>
      </div>

      <div className={styles.list}>
        {balances?.map((bank, i) => {
          const config = BANK_CONFIG[bank.name] || { color: '#6B7280', label: bank.name };
          const balanceClass = bank.balance > 0 ? styles.positive : bank.balance < 0 ? styles.negative : styles.zero;

          return (
            <div key={i} className={styles.bankItem}>
              <div className={styles.bankLeft}>
                <span className={styles.bankDot} style={{ background: config.color }} />
                <span className={styles.bankName}>{config.label}</span>
              </div>
              <span className={`${styles.bankBalance} ${balanceClass}`}>
                {formatCurrency(bank.balance)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default BankBalances;
