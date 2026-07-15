const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const files = [
  'C:/App_Anderson/FR700 RAMOS SILAGEM 03,07.xlsx',
  'C:/App_Anderson/FR9050 RAMOS SILAGEM03,07.xlsx',
  'C:/App_Anderson/JD7250 AGROMEC SILAGEM03,07.xlsx'
];

function excelDateToDateStr(excelDate) {
  if (typeof excelDate !== 'number') return '';
  const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
  const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  const dd = String(utcDate.getDate()).padStart(2, '0');
  const mm = String(utcDate.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}`;
}

function excelDateToISO(excelDate) {
  if (typeof excelDate !== 'number') return '';
  const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
  const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return utcDate.toISOString().split('T')[0];
}

const getDriverNameForMachine = (machName) => {
  const m = machName.toLowerCase().trim();
  if (m.includes('bigode') || m.includes('jd7250')) return 'Bigode';
  if (m.includes('ramos') || m.includes('fr 9050') || m.includes('fr 700')) return 'Ramos';
  if (m.includes('claudinei') || m.includes('1620')) return 'Claudinei';
  if (m.includes('chico') || m.includes('constellation')) return 'Chico';
  if (m.includes('lecão') || m.includes('lecao')) return 'Lecão';
  if (m.includes('leonir') || m.includes('2213')) return 'Leonir';
  if (m.includes('rodrigo') || m.includes('2220')) return 'Rodrigo';
  if (m.includes('marcos')) return 'Marcos';
  if (m.includes('rogerio')) return 'Rogério';
  if (m.includes('cowboy')) return 'Cowboy';
  return null;
};

let allAreas = [];
let allLocalitySheets = [];
let allMachinesConfig = [];
let allClientsVehicles = [];
let allExpenses = [];
let allMotoristas = [];

let expIdCounter = 1;

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  
  const workbook = XLSX.readFile(file);
  workbook.SheetNames.forEach(sheetName => {
    // Skip empty or summary sheets if needed, but we'll parse all.
    const worksheet = workbook.Sheets[sheetName];
    const dataRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (dataRows.length === 0) return;

    // Add Area
    const areaName = sheetName.trim();
    if (areaName && !allAreas.find(a => a.name.toLowerCase() === areaName.toLowerCase())) {
      allAreas.push({
        id: `A${allAreas.length + 1}`,
        name: areaName,
        culture: 'Silagem',
        sizeHectares: 150
      });
    }

    const sheetId = areaName.toLowerCase().replace(/\s+/g, '-');
    let localSheet = allLocalitySheets.find(s => s.id === sheetId);
    if (!localSheet) {
      localSheet = {
        id: sheetId,
        name: areaName,
        machines: [],
        dates: []
      };
      allLocalitySheets.push(localSheet);
    }

    // Find Headers
    let headerRowIdx = -1;
    for (let r = 0; r < Math.min(dataRows.length, 10); r++) {
      const row = dataRows[r];
      if (!row) continue;
      // Look for "Hora inicial" in the row below
      const nextRow = dataRows[r + 1];
      if (nextRow && nextRow.some(c => String(c).toLowerCase().trim().includes('hora inicial'))) {
        headerRowIdx = r;
        break;
      }
    }

    if (headerRowIdx !== -1) {
      const headerRow = dataRows[headerRowIdx];
      let sheetMachines = [];
      let rateMachine = 800; // default
      let rateTruck = 180; // default

      // Find rates
      for (let r = 0; r < headerRowIdx; r++) {
        const rData = dataRows[r];
        if (!rData) continue;
        const text = rData.join(' ').toLowerCase();
        if (text.includes('valor') && text.includes('máquina')) {
          const val = rData.find(c => typeof c === 'number');
          if (val) rateMachine = val;
        }
        if (text.includes('valor') && text.includes('caminhão')) {
          const val = rData.find(c => typeof c === 'number');
          if (val) rateTruck = val;
        }
      }

      // Extract machines
      for (let c = 1; c < headerRow.length; c++) {
        const val = headerRow[c];
        if (val && typeof val === 'string' && val.trim() !== '' && !val.toLowerCase().includes('data') && !val.toLowerCase().includes('despesa') && !val.toLowerCase().includes('valor')) {
          const machName = val.trim();
          const isTruck = machName.toLowerCase().includes('caminhão') || machName.toLowerCase().includes('cargo') || machName.toLowerCase().includes('constellation') || machName.toLowerCase().includes('1620');
          sheetMachines.push({
            name: machName,
            colIdx: c,
            ratePerHour: isTruck ? rateTruck : rateMachine
          });

          // Add to global machines
          if (!allMachinesConfig.find(m => m.name.toLowerCase() === machName.toLowerCase())) {
            allMachinesConfig.push({
              id: `MQ_${allMachinesConfig.length + 1}`,
              name: machName,
              type: isTruck ? 'caminhao' : 'trator',
              brand: 'Desconhecida',
              status: 'ativo'
            });
            allClientsVehicles.push({
              id: `CV_${allClientsVehicles.length + 1}`,
              name: machName,
              type: isTruck ? 'Caminhão' : 'Máquina',
              responsible: getDriverNameForMachine(machName) || ''
            });
          }
        }
      }

      // Add driver
      sheetMachines.forEach(sm => {
        const driverName = getDriverNameForMachine(sm.name);
        if (driverName && !allMotoristas.find(m => m.name.toLowerCase() === driverName.toLowerCase())) {
          allMotoristas.push({
            id: `MOT_${allMotoristas.length + 1}`,
            name: driverName,
            phone: '',
            cnh: '',
            status: 'ativo'
          });
        }
      });

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

      // Data Rows
      for (let r = headerRowIdx + 2; r < dataRows.length; r++) {
        const row = dataRows[r];
        if (!row || typeof row[0] !== 'number' || row[0] < 40000) continue;

        const dateStr = excelDateToDateStr(row[0]);
        if (!localSheet.dates.includes(dateStr)) localSheet.dates.push(dateStr);

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
      }
    }

    // Dynamic Expense Parsing
    let expDataCol = -1;
    let expDescCol = -1;
    let expValCol = -1;

    for (let r = 0; r < Math.min(dataRows.length, 10); r++) {
      const row = dataRows[r];
      if (!row) continue;
      const dIdx = row.findIndex(c => String(c).toLowerCase().trim() === 'data');
      const descIdx = row.findIndex(c => {
        const str = String(c).toLowerCase().trim();
        return str === 'despesa' || str === 'descrição' || str === 'tipo' || str === 'despesas';
      });
      let vIdx = row.findIndex(c => String(c).toLowerCase().trim() === 'valor');
      
      if (dIdx !== -1 && descIdx !== -1) {
        if (vIdx === -1) {
          // If no explicitly named 'valor' column, assume it's one or two columns to the right of 'descIdx'
          // We can determine by checking the next data row where type is a string and value is a number
          for (let nr = r + 1; nr < dataRows.length; nr++) {
            if (typeof dataRows[nr][dIdx] === 'number') {
               for (let i = 1; i <= 5; i++) {
                 if (typeof dataRows[nr][descIdx + i] === 'number') {
                   vIdx = descIdx + i;
                   break;
                 }
               }
               break;
            }
          }
        }
        
        if (vIdx !== -1) {
          expDataCol = dIdx;
          expDescCol = descIdx;
          expValCol = vIdx;
          break;
        }
      }
    }

    if (expDataCol !== -1) {
      for (let r = 0; r < dataRows.length; r++) {
        const row = dataRows[r];
        if (!row) continue;
        const expDateExcel = row[expDataCol];
        if (typeof expDateExcel === 'number' && expDateExcel > 40000) {
          const rawType = String(row[expDescCol] || '').toLowerCase().trim();
          const expVal = parseFloat(row[expValCol]) || 0;
          if (expVal > 0) {
            const isoDate = excelDateToISO(expDateExcel);
            // Default driver and machine logic
            let expMach = null;
            if (rawType.includes('jd7250')) expMach = 'JD7250';
            else if (rawType.includes('lecão') || rawType.includes('lecao')) expMach = 'LECÃO';
            else if (rawType.includes('1620')) expMach = 'CLAUDINEI 1620';
            else if (rawType.includes('constellation')) expMach = 'CONSTELLATION CHICO';
            
            const expDriver = getDriverNameForMachine(rawType);
            
            allExpenses.push({
              id: `E_${expIdCounter++}`,
              date: isoDate,
              type: rawType === 'hospedagem e alimentação' || rawType.includes('alimen') ? 'alimentação' : rawType,
              value: expVal,
              machineName: expMach || undefined,
              responsibleName: expDriver || undefined,
              localityName: areaName
            });
          }
        }
      }
    }
  });
});

// Build initialData.ts
const initialDataStr = `
import { ClientOrVehicle, LocalitySheet, Expense } from './types';

export const initialClientsAndVehicles: ClientOrVehicle[] = ${JSON.stringify(allClientsVehicles, null, 2)};

export const initialLocalitySheets: LocalitySheet[] = ${JSON.stringify(allLocalitySheets, null, 2)};

export const initialExpenses: Expense[] = ${JSON.stringify(allExpenses, null, 2)};
`;

fs.writeFileSync('C:/App_Anderson/agrogestion-erp/src/initialData.ts', initialDataStr);
console.log('Saved initialData.ts');

// Build agroHelpers.ts replacements (we just replace the specific exports using regex or simple replace)
let agroHelpersStr = fs.readFileSync('C:/App_Anderson/agrogestion-erp/src/utils/agroHelpers.ts', 'utf-8');

const regexMotoristas = /export const initialMotoristas: Motorista\[\] = \[[\s\S]*?\];/;
agroHelpersStr = agroHelpersStr.replace(regexMotoristas, `export const initialMotoristas: Motorista[] = ${JSON.stringify(allMotoristas, null, 2)};`);

const regexAreas = /export const initialAreas: Area\[\] = \[[\s\S]*?\];/;
agroHelpersStr = agroHelpersStr.replace(regexAreas, `export const initialAreas: Area[] = ${JSON.stringify(allAreas, null, 2)};`);

const regexMaquinas = /export const initialMaquinas: Maquina\[\] = \[[\s\S]*?\];/;
agroHelpersStr = agroHelpersStr.replace(regexMaquinas, `export const initialMaquinas: Maquina[] = ${JSON.stringify(allMachinesConfig, null, 2)};`);

fs.writeFileSync('C:/App_Anderson/agrogestion-erp/src/utils/agroHelpers.ts', agroHelpersStr);
console.log('Saved agroHelpers.ts');
