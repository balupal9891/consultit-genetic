import fs from 'fs';
import csv from 'csv-parser';


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


export {parseCsv};