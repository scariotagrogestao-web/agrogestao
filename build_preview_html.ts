import fs from 'fs';
import path from 'path';
import { initialClientsAndVehicles, initialExpenses, initialLocalitySheets } from './src/initialData';
import { initialMotoristas, initialAreas, initialMaquinas, initialProducoes } from './src/utils/agroHelpers';

const templatePath = path.resolve('preview_template.html');
let content = fs.readFileSync(templatePath, 'utf8');

content = content.replace('##VEHICLES##', JSON.stringify(initialClientsAndVehicles));
content = content.replace('##LOCALITIES##', JSON.stringify(initialLocalitySheets));
content = content.replace('##EXPENSES##', JSON.stringify(initialExpenses));
content = content.replace('##MOTORISTAS##', JSON.stringify(initialMotoristas));
content = content.replace('##AREAS##', JSON.stringify(initialAreas));
content = content.replace('##MAQUINAS##', JSON.stringify(initialMaquinas));
content = content.replace('##PRODUCOES##', JSON.stringify(initialProducoes));

const outputPath = path.resolve('preview.html');
fs.writeFileSync(outputPath, content, 'utf8');

console.log('Build completed! Injected database sizes into preview.html:');
console.log(`- Vehicles: ${initialClientsAndVehicles.length}`);
console.log(`- Localities: ${initialLocalitySheets.length}`);
console.log(`- Expenses: ${initialExpenses.length}`);
console.log(`- Motoristas: ${initialMotoristas.length}`);
console.log(`- Areas: ${initialAreas.length}`);
console.log(`- Maquinas: ${initialMaquinas.length}`);
console.log(`- Producoes: ${initialProducoes.length}`);
