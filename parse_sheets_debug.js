const path = require('path');
const fs = require('fs');
const XLSX = require(path.join('C:', 'App_Anderson', 'agrogestion-erp', 'node_modules', 'xlsx'));

const dir = 'C:\\App_Anderson';
const files = [
  'JD7250 AGROMEC SILAGEM03,07.xlsx',
  'FR9050 RAMOS SILAGEM03,07.xlsx',
  'FR700 RAMOS SILAGEM 03,07.xlsx'
];

files.forEach(file => {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${file}`);
    return;
  }
  
  console.log(`\n========================================`);
  console.log(`FILE: ${file}`);
  console.log(`========================================`);
  
  const workbook = XLSX.readFile(filePath);
  workbook.SheetNames.forEach(sheetName => {
    // skip MATRIZ if it is empty or has zero rows
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    console.log(`Sheet "${sheetName}" has ${data.length} rows.`);
    
    // Look at first 15 rows
    for (let i = 0; i < Math.min(data.length, 20); i++) {
      const row = data[i];
      if (row.some(c => c !== '')) {
        console.log(`  Row ${i}: ${JSON.stringify(row.slice(0, 10))}`);
      }
    }
  });
});
