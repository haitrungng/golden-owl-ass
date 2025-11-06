import { PrismaClient } from '../generated';
import * as fs from 'fs';
import * as path from 'path';
import { Score } from '../generated';

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, './dataset/diem_thi_thpt_2024.csv');
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/).filter((l) => l.length > 0);

  const headers = lines[0].split(','); // ["sbd","toan","ngu_van",...]

  const records = lines.slice(1).map((line) => {
    const cols = line.split(',');
    const obj: Score = {
      sbd: 'random',
      toan: null,
      ngu_van: null,
      ngoai_ngu: null,
      vat_li: null,
      hoa_hoc: null,
      sinh_hoc: null,
      lich_su: null,
      dia_li: null,
      gdcd: null,
      ma_ngoai_ngu: null,
    };
    headers.forEach((h, i) => {
      const value = cols[i]?.trim();
      if (value === '') obj[h] = null;
      else if (h === 'sbd' || h === 'ma_ngoai_ngu') obj[h] = value;
      else obj[h] = parseFloat(value);
    });
    return obj;
  });

  console.log(`\t Importing ${records.length} rows...`);

  // insert in batch to avoid memory overflow
  const BATCH_SIZE = 1000;
  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    await prisma.score.createMany({
      data: batch,
      skipDuplicates: true,
    });

    const percent = (i + batch.length) / records.length;
    const barLength = 30;
    const filledLength = Math.round(barLength * percent);
    const bar = '█'.repeat(filledLength) + '-'.repeat(barLength - filledLength);

    process.stdout.write(
      `\r Importing [${bar}] ${(percent * 100).toFixed(2)}%`,
    );
  }
}

main()
  .then(async () => {
    console.log('\t Done seeding database!');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
