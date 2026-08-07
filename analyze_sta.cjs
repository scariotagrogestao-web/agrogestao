const XLSX = require('xlsx');

const file = 'C:/App_Anderson/FR700 RAMOS SILAGEM 03,07.xlsx';
const workbook = XLSX.readFile(file);
const worksheet = workbook.Sheets['STA Aracangua'];
const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

console.log("Sheet: STA Aracangua");
for (let i = 0; i < 15; i++) {
  console.log(`Row ${i}:`, json[i]);
}
