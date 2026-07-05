import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'FinanceFlow - Quản lý tài chính cá nhân',
  description: 'Dashboard quản lý chi tiêu và dòng tiền cá nhân. Theo dõi thu nhập, chi tiêu, đầu tư và tiết kiệm một cách hiệu quả.',
  keywords: 'quản lý tài chính, chi tiêu, dòng tiền, tiết kiệm, đầu tư',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={inter.variable}>
      <body style={{ fontFamily: 'var(--font-inter, var(--font-sans))' }}>
        {children}
      </body>
    </html>
  );
}
