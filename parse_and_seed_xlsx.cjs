const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');

// 1. Dynamic extraction of existing initialData from TypeScript file
const tsPath = path.resolve('src/initialData.ts');
let tsContent = fs.readFileSync(tsPath, 'utf8');

// Convert TS export syntax to CJS exports
let jsContent = tsContent
  .replace(/import {.*} from .*/g, '')
  .replace(/export const /g, 'exports.')
  .replace(/: ClientOrVehicle\[\]/g, '')
  .replace(/: LocalitySheet\[\]/g, '')
  .replace(/: Expense\[\]/g, '');

const tempPath = path.resolve('temp_initial_data.cjs');
fs.writeFileSync(tempPath, jsContent, 'utf8');

let baseData;
try {
  baseData = require(tempPath);
  console.log('Loaded base initialData successfully!');
  console.log(`- Base Vehicles: ${baseData.initialClientsAndVehicles.length}`);
  console.log(`- Base Locality Sheets: ${baseData.initialLocalitySheets.length}`);
  console.log(`- Base Expenses: ${baseData.initialExpenses.length}`);
} catch (err) {
  console.error('Failed to load base initialData:', err);
  process.exit(1);
} finally {
  if (fs.existsSync(tempPath)) {
    fs.unlinkSync(tempPath);
  }
}

// 2. Parsed state accumulators
const vehicles = [...baseData.initialClientsAndVehicles];
const sheets = [...baseData.initialLocalitySheets];
const expenses = [...baseData.initialExpenses];

// Helpers to search/merge
function findOrCreateVehicle(name, rate, type = 'Máquina') {
  const normalized = name.toLowerCase().replace(/\s/g, '');
  let found = vehicles.find(v => v.name.toLowerCase().replace(/\s/g, '') === normalized);
  if (!found) {
    let vType = type;
    if (name.toLowerCase().includes('caminhão') || name.toLowerCase().includes('volks') || name.toLowerCase().includes('cargo') || name.toLowerCase().includes('mula') || name.toLowerCase().includes('rodrigo') || name.toLowerCase().includes('bigode') || name.toLowerCase().includes('eduardo') || name.toLowerCase().includes('1620') || name.toLowerCase().includes('constellation') || name.toLowerCase().includes('carreta')) {
      vType = 'Caminhão';
    }
    found = {
      id: `V${(vehicles.length + 1).toString().padStart(2, '0')}`,
      name: name.trim(),
      type: vType,
      details: `${vType} importado das planilhas`,
      plateOrFleet: `FROTA-${name.toUpperCase().replace(/\s/g, '')}`,
      responsible: '-',
      status: 'Ativo',
      rate: rate || 0
    };
    vehicles.push(found);
    console.log(`[Registry] Created vehicle: ${name} (Rate: ${rate}, Type: ${vType})`);
  } else {
    // Update rate if not set
    if (rate && (!found.rate || found.rate === 0)) {
      found.rate = rate;
    }
  }
  return found;
}

function excelDateToDateStr(excelDate) {
  if (typeof excelDate !== 'number') return String(excelDate);
  const date = new Date((excelDate - 25569) * 86400 * 1000);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const month = months[date.getUTCMonth()];
  return `${day}/${month}`;
}

function excelDateToISO(excelDate) {
  if (typeof excelDate !== 'number') return String(excelDate);
  const date = new Date((excelDate - 25569) * 86400 * 1000);
  return date.toISOString().split('T')[0];
}

// 3. Scan & parse Excel files
const dir = 'C:\\App_Anderson';
const files = [
  'JD7250 AGROMEC SILAGEM03,07.xlsx',
  'FR9050 RAMOS SILAGEM03,07.xlsx',
  'FR700 RAMOS SILAGEM 03,07.xlsx'
];

files.forEach(fileName => {
  const filePath = path.join(dir, fileName);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${fileName}`);
    return;
  }

  console.log(`\nParsing: ${fileName}`);
  const workbook = XLSX.readFile(filePath);

  workbook.SheetNames.forEach(sheetName => {
    // Skip utility or blank sheets
    if (sheetName.toLowerCase().includes('matriz') || sheetName.toLowerCase().includes('acerto') || sheetName.toLowerCase().includes('planilha')) {
      return;
    }

    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    if (data.length < 5) return;

    // Locate header row containing machine names and rates
    let headerRowIdx = -1;
    for (let rIdx = 0; rIdx < data.length; rIdx++) {
      const row = data[rIdx];
      if (row && row.some(cell => typeof cell === 'string' && cell.toLowerCase().includes('hora inicial'))) {
        headerRowIdx = rIdx - 1;
        break;
      }
    }

    if (headerRowIdx === -1) {
      console.log(`  [Hours] Sheet "${sheetName}" has no recognizable horimeter header. Skipping hours.`);
      return;
    }

    console.log(`  Parsing Sheet "${sheetName}" (Header Row: ${headerRowIdx})`);

    // Parse machines from header row
    const sheetMachines = [];
    const headerRow = data[headerRowIdx];
    
    for (let col = 1; col < headerRow.length; col += 3) {
      const mName = headerRow[col];
      const rate = parseFloat(headerRow[col + 2]) || 0;
      const mNameStr = String(mName || '').trim();
      
      if (mNameStr === '') break;

      // Skip expenses headers parsed as machines
      const mNameLower = mNameStr.toLowerCase();
      if (mNameLower.includes('data') || mNameLower.includes('despesa') || mNameLower.includes('descri') || mNameLower.includes('coluna') || mNameLower.includes('valor')) {
        continue;
      }

      const cleanedName = mNameStr.replace(/\s+/g, ' ');
      const vehicle = findOrCreateVehicle(cleanedName, rate);
      sheetMachines.push({
        name: cleanedName,
        ratePerHour: rate || vehicle.rate || 0,
        colIdx: col
      });
    }

    // Find or create LocalitySheet
    const sheetId = sheetName.toLowerCase().trim().replace(/\s+/g, '-');
    let localSheet = sheets.find(s => s.id === sheetId);
    if (!localSheet) {
      localSheet = {
        id: sheetId,
        name: sheetName.trim(),
        machines: [],
        dates: []
      };
      sheets.push(localSheet);
      console.log(`  [Locality] Created locality sheet: ${sheetName}`);
    }

    // Initialize machines in localSheet if not already present
    sheetMachines.forEach(sm => {
      let machConfig = localSheet.machines.find(m => m.name.toLowerCase() === sm.name.toLowerCase());
      if (!machConfig) {
        machConfig = {
          id: `M_${Date.now()}_${Math.floor(Math.random() * 100)}`,
          name: sm.name,
          ratePerHour: sm.ratePerHour,
          readings: {}
        };
        localSheet.machines.push(machConfig);
      }
    });

    // Parse date rows and readings
    for (let rIdx = headerRowIdx + 2; rIdx < data.length; rIdx++) {
      const row = data[rIdx];
      if (!row || typeof row[0] !== 'number' || row[0] < 40000) continue;

      const dateStr = excelDateToDateStr(row[0]);
      if (!localSheet.dates.includes(dateStr)) {
        localSheet.dates.push(dateStr);
      }

      // Read horimeters for each machine
      sheetMachines.forEach(sm => {
        const initVal = row[sm.colIdx];
        const finVal = row[sm.colIdx + 1];

        if (initVal !== '' && finVal !== '' && initVal !== undefined && finVal !== undefined) {
          const machConfig = localSheet.machines.find(m => m.name.toLowerCase() === sm.name.toLowerCase());
          if (machConfig) {
            machConfig.readings[dateStr] = {
              initial: String(initVal),
              final: String(finVal)
            };
          }
        }
      });

      // Parse expenses on the right (usually starting at index 16 / Column Q)
      if (row.length > 17 && row[16] !== '' && row[17] !== '') {
        const expDateExcel = row[16];
        const expType = String(row[17]).toLowerCase().trim();
        const expDesc = String(row[18] || '').trim();
        const expVal = parseFloat(row[19]) || 0;

        if (typeof expDateExcel === 'number' && expDateExcel > 40000 && expVal > 0) {
          const isoDate = excelDateToISO(expDateExcel);
          
          // Avoid exact duplicates
          const isDup = expenses.some(e => e.date === isoDate && e.type === expType && e.value === expVal);
          if (!isDup) {
            expenses.push({
              id: `E_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
              date: isoDate,
              type: expType === 'hospedagem e alimentação' ? 'alimentação' : expType,
              value: expVal,
              machineName: smNameFromDesc(expDesc) || undefined,
              responsibleName: driverNameFromDesc(expDesc) || undefined,
              localityName: sheetName.trim()
            });
            console.log(`  [Expense] Parsed expense: ${isoDate} - ${expType} (R$ ${expVal})`);
          }
        }
      }
    }
  });
});

// Helper to extract driver from description
function driverNameFromDesc(desc) {
  if (!desc) return null;
  const d = desc.toLowerCase();
  if (d.includes('rogerio')) return 'Rogério';
  if (d.includes('marcos')) return 'Marcos';
  if (d.includes('chico')) return 'Chico';
  if (d.includes('rodrigo')) return 'Rodrigo';
  if (d.includes('leonir')) return 'Leonir';
  if (d.includes('cowboy')) return 'Cowboy';
  if (d.includes('bigode')) return 'Bigode';
  if (d.includes('eduardo')) return 'Eduardo';
  return null;
}

// Helper to extract machine name from description
function smNameFromDesc(desc) {
  if (!desc) return null;
  const d = desc.toLowerCase();
  if (d.includes('fr 700') || d.includes('fr700')) return 'FR 700';
  if (d.includes('fr 9050') || d.includes('fr9050')) return 'FR 9050';
  if (d.includes('fr 9060') || d.includes('fr9060')) return 'FR 9060';
  if (d.includes('jd7250') || d.includes('jd 7250')) return 'JD7250';
  return null;
}

// 4. Overwrite src/initialData.ts with the uncompiled data
const newTsContent = `import { ClientOrVehicle, LocalitySheet, Expense } from './types';

export const initialClientsAndVehicles: ClientOrVehicle[] = ${JSON.stringify(vehicles, null, 2)};

export const initialLocalitySheets: LocalitySheet[] = ${JSON.stringify(sheets, null, 2)};

export const initialExpenses: Expense[] = ${JSON.stringify(expenses, null, 2)};
`;

fs.writeFileSync(tsPath, newTsContent, 'utf8');
console.log('\n========================================');
console.log('Successfully completed merge & overwrite of initialData.ts!');
console.log(`- Final Vehicles Count: ${vehicles.length}`);
console.log(`- Final Locality Sheets: ${sheets.length}`);
console.log(`- Final Expenses Count: ${expenses.length}`);
console.log('========================================');
