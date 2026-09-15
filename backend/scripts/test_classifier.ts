import fs from 'fs';
import path from 'path';
import { classifyJobText } from '../src/classifier/classifier';

async function testClassifierOnSamples() {
  console.log('=== Probando Motor de Clasificación sobre Muestras Reales ===\n');

  const samplesDir = path.resolve(process.cwd(), 'data', 'samples');
  const files = fs.readdirSync(samplesDir).filter((f) => f.endsWith('.json') && !f.includes('46-25-412Z'));

  for (const file of files) {
    const content = JSON.parse(fs.readFileSync(path.join(samplesDir, file), 'utf-8'));
    const elements = content.elements || [];

    console.log(`\n📄 Archivo: ${file} (${elements.length} elementos)`);

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const title = el.jobDetails?.jobTitle || '';
      const desc = el.jobDetails?.jobDescription || '';

      const matches = classifyJobText(title, desc);
      const matchNames = matches.map((m) => m.name + (m.matchedInTitle ? '*' : '')).join(', ');

      console.log(`  [${i + 1}] "${title}"`);
      console.log(`      Empresa: ${el.jobDetails?.organizationName}`);
      console.log(`      Tecnologías detectadas: ${matchNames || '(ninguna)'}`);
    }
  }
}

testClassifierOnSamples();
