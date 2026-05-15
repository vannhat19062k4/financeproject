const SHEET_ID = '1p53bkBhARQwbMt8aib6GPK9VaOnf6797XbaIHV27EuI';

function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const action = e?.parameter?.action || 'transactions';
    
    let result;
    switch (action) {
      case 'transactions':
        result = getTransactions(ss);
        break;
      case 'balances':
        result = getBankBalances(ss);
        break;
      case 'all':
        result = {
          transactions: getTransactions(ss),
          balances: getBankBalances(ss),
        };
        break;
      default:
        result = { error: 'Invalid action' };
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getTransactions(ss) {
  // Thay bằng tên sheet chứa các dòng giao dịch thu chi của bạn
  const sheet = ss.getSheetByName('Sheet1'); 
  if (!sheet) return { error: 'Sheet giao dịch not found' };
  
  const data = sheet.getDataRange().getValues();
  const transactions = [];
  
  // Bỏ qua dòng tiêu đề (i=1)
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0]) continue; 
    
    let dateStr = '';
    if (row[0] instanceof Date) {
      dateStr = Utilities.formatDate(row[0], Session.getScriptTimeZone(), 'dd/MM/yyyy');
    } else {
      dateStr = String(row[0]);
    }
    
    transactions.push({
      id: i,
      date: dateStr,                               // Cột A: Ngày
      description: String(row[2] || ''),           // Cột C: Mô tả/Ghi chú
      type: String(row[3] || ''),                  // Cột D: Loại (Thu nhập/Chi tiêu/...)
      category: String(row[4] || ''),              // Cột E: Danh mục
      amount: Number(row[5]) || 0,                 // Cột F: Số tiền
      bank: String(row[6] || ''),                  // Cột G: Ngân hàng
    });
  }
  return transactions;
}

function getBankBalances(ss) {
  // Thay bằng tên sheet chứa bảng số dư các ngân hàng của bạn
  const sheet = ss.getSheetByName('Sheet2'); 
  if (!sheet) return [];
  
  // Cập nhật lại Range chứa bảng số dư của bạn (VD: A2:B7)
  const data = sheet.getRange('A2:B7').getValues(); 
  
  return data
    .filter(row => row[0])
    .map(row => ({
      name: String(row[0]),
      balance: Number(row[1]) || 0,
    }));
}
