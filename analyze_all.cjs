const XLSX = require('xlsx');

const files = [
  'C:/App_Anderson/FR700 RAMOS SILAGEM 03,07.xlsx',
  'C:/App_Anderson/FR9050 RAMOS SILAGEM03,07.xlsx',
  'C:/App_Anderson/JD7250 AGROMEC SILAGEM03,07.xlsx'
];

files.forEach(file => {
  console.log(`\n============================`);
  console.log(`File: ${file}`);
  try {
    const workbook = XLSX.readFile(file);
    workbook.SheetNames.forEach(sheetName => {
      console.log(`\n  Sheet: ${sheetName}`);
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      // Look for machine definitions
      let machineRow = -1;
      let expCols = null;

      for (let i = 0; i < Math.min(json.length, 10); i++) {
        const row = json[i];
        if (!row) continue;
        
        // Find expenses header
        const dataIdx = row.findIndex(c => String(c).toLowerCase().trim() === 'data');
        const despesaIdx = row.findIndex(c => String(c).toLowerCase().trim() === 'despesa' || String(c).toLowerCase().trim() === 'tipo');
        const valorIdx = row.findIndex(c => String(c).toLowerCase().trim() === 'valor');
        
        if (dataIdx !== -1 && despesaIdx !== -1 && valorIdx !== -1) {
          expCols = { data: dataIdx, type: despesaIdx, val: valorIdx };
          console.log(`    -> Expenses found at row ${i}, cols: Date=${dataIdx}, Type=${despesaIdx}, Val=${valorIdx}`);
        }
      }

      console.log(`    Rows count: ${json.length}`);
    });
  } catch (err) {
    console.error(`  Error: ${err.message}`);
  }
});
