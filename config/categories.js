// Category configuration with colors and icons
export const TRANSACTION_TYPES = {
  'Thu nhập': {
    color: '#10B981',
    bgColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    icon: 'TrendingUp',
  },
  'Chi tiêu': {
    color: '#EF4444',
    bgColor: '#FEF2F2',
    borderColor: '#FECACA',
    icon: 'TrendingDown',
  },
  'Đầu tư': {
    color: '#8B5CF6',
    bgColor: '#F5F3FF',
    borderColor: '#DDD6FE',
    icon: 'LineChart',
  },
  'Vay': {
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A',
    icon: 'HandCoins',
  },
  'Trả nợ': {
    color: '#F97316',
    bgColor: '#FFF7ED',
    borderColor: '#FED7AA',
    icon: 'CreditCard',
  },
};

export const CATEGORIES = {
  'Thu nhập': ['Lương', 'Đầu tư', 'Khác'],
  'Chi tiêu': ['Nhà ở', 'Ăn uống', 'Đi lại', 'Giải trí', 'Mua sắm', 'Sức khỏe', 'Giáo dục'],
  'Đầu tư': ['Chứng khoán', 'Tiết kiệm', 'Kinh doanh', 'Cho vay'],
  'Vay': ['Vay mới'],
  'Trả nợ': ['Trả nợ'],
};

export const CATEGORY_COLORS = {
  'Nhà ở': '#4F46E5',
  'Ăn uống': '#06B6D4',
  'Đi lại': '#8B5CF6',
  'Giải trí': '#EC4899',
  'Mua sắm': '#F59E0B',
  'Sức khỏe': '#10B981',
  'Giáo dục': '#EF4444',
  'Lương': '#10B981',
  'Đầu tư': '#8B5CF6',
  'Khác': '#64748B',
  'Chứng khoán': '#3B82F6',
  'Tiết kiệm': '#14B8A6',
  'Kinh doanh': '#F97316',
  'Cho vay': '#A855F7',
  'Vay mới': '#EAB308',
  'Trả nợ': '#F97316',
};

export const BANK_CONFIG = {
  'TP': { color: '#6C3A97', label: 'TP' },
  'VCB': { color: '#00703C', label: 'Vietcombank' },
  'TCB': { color: '#0066B3', label: 'Techcombank' },
  'Quỹ momo': { color: '#A50064', label: 'Quỹ Momo' },
  'TK Exness': { color: '#FFCC00', label: 'TK Exness' },
  'Tiền mặt': { color: '#6B7280', label: 'Tiền mặt' },
};

export const SIDEBAR_MENU = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'transactions', label: 'Giao dịch', icon: 'ArrowLeftRight' },
  { id: 'accounts', label: 'Tài khoản', icon: 'Landmark' },
  { id: 'analytics', label: 'Phân tích', icon: 'BarChart3' },
];

export const DATE_PRESETS = [
  { label: 'Hôm nay', value: 'today' },
  { label: '7 ngày qua', value: '7days' },
  { label: '30 ngày qua', value: '30days' },
  { label: '3 tháng qua', value: '3months' },
  { label: '12 tháng qua', value: '12months' },
  { label: 'Từ đầu tháng', value: 'mtd' },
  { label: 'Từ đầu năm', value: 'ytd' },
  { label: 'Tất cả', value: 'all' },
];
