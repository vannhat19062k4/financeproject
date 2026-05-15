'use client';
import React from 'react';
import { LayoutDashboard, ArrowLeftRight, Landmark, BarChart3, Settings, HelpCircle, Menu, X, Wallet } from 'lucide-react';
import styles from './Sidebar.module.css';

const ICONS = { LayoutDashboard, ArrowLeftRight, Landmark, BarChart3, Settings, HelpCircle };

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'transactions', label: 'Giao dịch', icon: 'ArrowLeftRight' },
  { id: 'accounts', label: 'Tài khoản', icon: 'Landmark' },
  { id: 'analytics', label: 'Phân tích', icon: 'BarChart3' },
];

const SETTINGS_ITEMS = [
  { id: 'settings', label: 'Cài đặt', icon: 'Settings' },
  { id: 'help', label: 'Trợ giúp', icon: 'HelpCircle' },
];

const Sidebar = React.memo(function Sidebar({ activeMenu = 'dashboard', onMenuChange, isOpen, onToggle }) {
  return (
    <>
      <button className={styles.mobileToggle} onClick={onToggle} aria-label="Toggle menu">
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {isOpen && <div className={styles.mobileOverlay} onClick={onToggle} />}

      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.logo}>
          <img src="/logo-2.png" alt="FinanceFlow Logo" className={styles.logoImg} />
          <div>
            <div className={styles.logoText}>FinanceFlow</div>
            <div className={styles.logoSub}>Quản lý tài chính</div>
          </div>
        </div>

        <nav className={styles.menuSection}>
          <div className={styles.menuLabel}>Menu</div>
          {MENU_ITEMS.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <button
                key={item.id}
                className={`${styles.menuItem} ${activeMenu === item.id ? styles.menuItemActive : ''}`}
                onClick={() => onMenuChange?.(item.id)}
              >
                <Icon className={styles.menuIcon} size={20} />
                {item.label}
              </button>
            );
          })}

          <div className={styles.menuLabel} style={{ marginTop: 24 }}>Cài đặt</div>
          {SETTINGS_ITEMS.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <button key={item.id} className={styles.menuItem} onClick={() => onMenuChange?.(item.id)}>
                <Icon className={styles.menuIcon} size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className={styles.bottomSection}>
          <div className={styles.userCard}>
            <div className={styles.avatar}>N</div>
            <div>
              <div className={styles.userName}>Nhật</div>
              <div className={styles.userEmail}>Tài chính cá nhân</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
});

export default Sidebar;
