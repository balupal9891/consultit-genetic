
export interface GeneticCondition {
    condition: string;
    gene: string;
    response: string;
}

type GeneEntry = {
    Gene: string;
    condition?: string;
    response?: string;
};

type Category = {
    title: string;
    icon: string;
    focus: string;
    data: GeneEntry[];
};

type GeneticData = {
    genetic_data: Category[];
};


export function enrichGeneticDataWithResponses(
    geneticData: GeneticData,
    responses: GeneticCondition[]
): GeneticData {
    // Normalize keys for quick lookup
    const responseMap: Record<string, GeneticCondition> = {};

    for (const res of responses) {
        console.log('Response:', res);
        if (res.gene) {
            responseMap[res.gene.trim().toLowerCase()] = res;
        }
    }

    const enrichedData = geneticData.genetic_data.map(category => {
        const enrichedGenes = category.data.map(geneEntry => {
            const geneKey = geneEntry.Gene.trim().toLowerCase();
            const match = responseMap[geneKey];

            // Assign matched data
            if (match) {
                return {
                    ...geneEntry,
                    condition: match.condition,
                    response: match.response
                };
            }

            // No match found
            return geneEntry;
        });

        return {
            ...category,
            data: enrichedGenes
        };
    });

    return { genetic_data: enrichedData };
}