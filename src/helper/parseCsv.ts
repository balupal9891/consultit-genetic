import fs from 'fs';
import csv from 'csv-parser';
import { GeneticCondition } from './addGeneticResponse';


async function parseCsv(csvFilePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const results: any[] = [];

        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (data: any) => {
                const condition = data['Condition name']?.trim();
                const gene = data['Gene']?.trim();
                const response = data['Response']?.trim();

                if (condition || gene || response) {
                    results.push({
                        condition: condition || '',
                        gene: gene || '',
                        response: response || ''
                    });
                }
            })
            .on('end', () => {
                resolve(results);
            })
            .on('error', (err: any) => {
                reject(err);
            });
    });
}

// helper/parseCsvFromString.ts
import { parse } from 'csv-parse/sync';

const keyMap: Record<string, keyof GeneticCondition> = {
  'condition name': 'condition',
  'gene': 'gene',
  'response': 'response'
};

export function parseCsvFromString(content: string): GeneticCondition[] {
  return parse(content, {
    columns: (headers: string[]) =>
      headers.map(h => {
        const cleaned = h.trim().toLowerCase();
        return keyMap[cleaned] ?? cleaned; // fallback to raw key
      }),
    skip_empty_lines: true,
    trim: true
  });
}


export { parseCsv };