const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');

// 1. Initialize empty state accumulators to start with ONLY spreadsheet data
const vehicles = [];
const sheets = [];
const expenses = [];
const motoristas = [];
const areas = [];
const maquinas = [];
const producoes = []; // start empty to allow manual silage logins

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
      responsible: getDriverNameForMachine(name) || '-',
      status: 'Ativo',
      rate: rate || 0
    };
    vehicles.push(found);
    
    // Also add to maquinas list
    maquinas.push({
      id: `MA${(maquinas.length + 1).toString().padStart(2, '0')}`,
      name: name.trim(),
      type: vType === 'Caminhão' ? 'Caminhão' : 'Trator'
    });
  } else {
    if (rate && (!found.rate || found.rate === 0)) {
      found.rate = rate;
    }
  }
  return found;
}

function findOrCreateDriver(name) {
  if (!name || name === '-') return;
  const normalized = name.toLowerCase().trim();
  let found = motoristas.find(m => m.name.toLowerCase().trim() === normalized);
  if (!found) {
    found = {
      id: `M${(motoristas.length + 1).toString().padStart(2, '0')}`,
      name: name.trim(),
      ratePerHectare: 50.00, // default payment rate per hectare worked
      status: 'Ativo'
    };
    motoristas.push(found);
  }
}

function getDriverNameForMachine(machineName) {
  const d = machineName.toLowerCase();
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

// 2. Scan & parse Excel files
const dir = 'C:\\App_Anderson';
const files = [
  'JD7250 AGROMEC SILAGEM03,07.xlsx',
  'FR9050 RAMOS SILAGEM03,07.xlsx',
  'FR700 RAMOS SILAGEM 03,07.xlsx'
];

files.forEach(fileName => {
  const filePath = path.join(dir, fileName);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  console.log(`Parsing: ${fileName}`);
  const workbook = XLSX.readFile(filePath);

  workbook.SheetNames.forEach(sheetName => {
    // Skip Matriz template or blank sheets
    if (sheetName.toLowerCase().includes('matriz') || sheetName.toLowerCase().includes('acerto') || sheetName.toLowerCase().includes('planilha')) {
      return;
    }

    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    if (data.length < 5) return;

    // Locate horimeter header row
    let headerRowIdx = -1;
    for (let rIdx = 0; rIdx < data.length; rIdx++) {
      const row = data[rIdx];
      if (row && row.some(cell => typeof cell === 'string' && cell.toLowerCase().includes('hora inicial'))) {
        headerRowIdx = rIdx - 1;
        break;
      }
    }

    if (headerRowIdx === -1) {
      return;
    }

    // Parse machines and rates from header row
    const sheetMachines = [];
    const headerRow = data[headerRowIdx];
    
    for (let col = 1; col < headerRow.length; col += 3) {
      const mName = headerRow[col];
      const rate = parseFloat(headerRow[col + 2]) || 0;
      const mNameStr = String(mName || '').trim();
      
      if (mNameStr === '') break;

      const mNameLower = mNameStr.toLowerCase();
      if (mNameLower.includes('data') || mNameLower.includes('despesa') || mNameLower.includes('descri') || mNameLower.includes('coluna') || mNameLower.includes('valor')) {
        continue;
      }

      const cleanedName = mNameStr.replace(/\s+/g, ' ');
      
      // Auto-extract driver/operator name from machine name if present
      const driverName = getDriverNameForMachine(cleanedName);
      if (driverName) {
        findOrCreateDriver(driverName);
      }

      const vehicle = findOrCreateVehicle(cleanedName, rate);
      sheetMachines.push({
        name: cleanedName,
        ratePerHour: rate || vehicle.rate || 0,
        colIdx: col
      });
    }

    // Create Area/Fazenda for Silagem production
    const areaId = `A${(areas.length + 1).toString().padStart(2, '0')}`;
    areas.push({
      id: areaId,
      name: sheetName.trim(),
      culture: 'Silagem', // defaults to Silagem as requested
      sizeHectares: 150
    });

    // Create LocalitySheet
    const sheetId = sheetName.toLowerCase().trim().replace(/\s+/g, '-');
    let localSheet = {
      id: sheetId,
      name: sheetName.trim(),
      machines: [],
      dates: []
    };
    sheets.push(localSheet);

    sheetMachines.forEach(sm => {
      localSheet.machines.push({
        id: `M_${Date.now()}_${Math.floor(Math.random() * 100)}`,
        name: sm.name,
        ratePerHour: sm.ratePerHour,
        readings: {}
      });
    });

    // Parse readings and expenses
    for (let rIdx = headerRowIdx + 2; rIdx < data.length; rIdx++) {
      const row = data[rIdx];
      if (!row || typeof row[0] !== 'number' || row[0] < 40000) continue;

      const dateStr = excelDateToDateStr(row[0]);
      if (!localSheet.dates.includes(dateStr)) {
        localSheet.dates.push(dateStr);
      }

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

      // Parse expenses
      if (row.length > 17 && row[16] !== '' && row[17] !== '') {
        const expDateExcel = row[16];
        const expType = String(row[17]).toLowerCase().trim();
        const expDesc = String(row[18] || '').trim();
        const expVal = parseFloat(row[19]) || 0;

        if (typeof expDateExcel === 'number' && expDateExcel > 40000 && expVal > 0) {
          const isoDate = excelDateToISO(expDateExcel);
          const isDup = expenses.some(e => e.date === isoDate && e.type === expType && e.value === expVal);
          
          if (!isDup) {
            const expMach = smNameFromDesc(expDesc);
            const expDriver = driverNameFromDesc(expDesc);

            if (expDriver) {
              findOrCreateDriver(expDriver);
            }

            expenses.push({
              id: `E_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
              date: isoDate,
              type: expType === 'hospedagem e alimentação' ? 'alimentação' : expType,
              value: expVal,
              machineName: expMach || undefined,
              responsibleName: expDriver || undefined,
              localityName: sheetName.trim()
            });
          }
        }
      }
    }
  });
});

// Add standard driver fallback if empty
if (motoristas.length === 0) {
  motoristas.push({ id: 'M01', name: 'Rogério', ratePerHectare: 50.00, status: 'Ativo' });
}

// Helpers
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

function smNameFromDesc(desc) {
  if (!desc) return null;
  const d = desc.toLowerCase();
  if (d.includes('fr 700') || d.includes('fr700')) return 'FR 700';
  if (d.includes('fr 9050') || d.includes('fr9050')) return 'FR 9050';
  if (d.includes('fr 9060') || d.includes('fr9060')) return 'FR 9060';
  if (d.includes('jd7250') || d.includes('jd 7250')) return 'JD7250';
  return null;
}

// Write C:\App_Anderson\agrogestion-erp\src\initialData.ts
const initialDataPath = path.resolve('src/initialData.ts');
const newInitialDataContent = `import { ClientOrVehicle, LocalitySheet, Expense } from './types';

export const initialClientsAndVehicles: ClientOrVehicle[] = ${JSON.stringify(vehicles, null, 2)};

export const initialLocalitySheets: LocalitySheet[] = ${JSON.stringify(sheets, null, 2)};

export const initialExpenses: Expense[] = ${JSON.stringify(expenses, null, 2)};
`;
fs.writeFileSync(initialDataPath, newInitialDataContent, 'utf8');

// Write C:\App_Anderson\agrogestion-erp\src\utils\agroHelpers.ts
const agroHelpersPath = path.resolve('src/utils/agroHelpers.ts');
const newAgroHelpersContent = `import { Motorista, Area, Maquina, Producao } from '../types/agro';

export function getWeekString(dateStr: string): string {
  if (!dateStr) return 'Semana Indefinida';
  const d = new Date(dateStr + 'T12:00:00');
  if (isNaN(d.getTime())) return 'Semana Indefinida';
  const tempDate = new Date(d.valueOf());
  tempDate.setDate(tempDate.getDate() + 4 - (tempDate.getDay() || 7));
  const yearStart = new Date(tempDate.getFullYear(), 0, 1);
  const weekNo = Math.ceil((((tempDate.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return \`Semana \${weekNo}/\${tempDate.getFullYear()}\`;
}

export const initialMotoristas: Motorista[] = ${JSON.stringify(motoristas, null, 2)};

export const initialAreas: Area[] = ${JSON.stringify(areas, null, 2)};

export const initialMaquinas: Maquina[] = ${JSON.stringify(maquinas, null, 2)};

export const initialProducoes: Producao[] = ${JSON.stringify(producoes, null, 2)};
`;
fs.writeFileSync(agroHelpersPath, newAgroHelpersContent, 'utf8');

console.log('\n========================================');
console.log('Successfully wrote CJS files to clean database!');
console.log(`- final Vehicles count: ${vehicles.length}`);
console.log(`- final Locality Sheets: ${sheets.length}`);
console.log(`- final Expenses count: ${expenses.length}`);
console.log(`- final Motoristas count: ${motoristas.length}`);
console.log(`- final Areas (Fazendas): ${areas.length}`);
console.log(`- final Maquinas: ${maquinas.length}`);
console.log(`- final Producoes (Silagem): ${producoes.length}`);
console.log('========================================');
