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
      const worksheet = workbook.Sheets[sheetName];
      const dataRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      let found = false;
      for (let r = 0; r < Math.min(dataRows.length, 15); r++) {
        const row = dataRows[r];
        if (!row) continue;
        
        const dIdx = row.findIndex(c => String(c).toLowerCase().trim() === 'data');
        if (dIdx !== -1) {
          console.log(`\n  Sheet: ${sheetName}`);
          console.log(`    Header row ${r}:`, row.map((c, i) => `${i}:${c}`).filter(c => c));
          
          for (let nr = r + 1; nr < Math.min(dataRows.length, r + 4); nr++) {
            const nextRow = dataRows[nr];
            if (!nextRow) continue;
            console.log(`    Data row ${nr}:`, nextRow.map((c, i) => `${i}:${c} (${typeof c})`).filter(c => c));
          }
          found = true;
          break;
        }
      }
      if (!found) {
        console.log(`\n  Sheet: ${sheetName} (No 'data' header found)`);
      }
    });
  } catch (err) {
    console.error(`  Error: ${err.message}`);
  }
});
