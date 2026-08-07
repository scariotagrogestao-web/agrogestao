const XLSX = require('xlsx');
const fs = require('fs');

const files = [
  'C:/App_Anderson/FR700 RAMOS SILAGEM 03,07.xlsx',
  'C:/App_Anderson/FR9050 RAMOS SILAGEM03,07.xlsx',
  'C:/App_Anderson/JD7250 AGROMEC SILAGEM03,07.xlsx'
];

files.forEach(file => {
  console.log(`\n--- Reading ${file} ---`);
  try {
    const workbook = XLSX.readFile(file);
    const sheetName = workbook.SheetNames[0];
    console.log(`First Sheet: ${sheetName}`);
    const worksheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    console.log(`Rows 1 to 20:`);
    json.slice(0, 20).forEach((row, i) => {
      console.log(`Row ${i + 1}:`, row);
    });
  } catch (err) {
    console.error(`Error reading ${file}:`, err.message);
  }
});
