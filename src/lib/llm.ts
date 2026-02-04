import { QueryResult } from "./types";

// In a real app, this would call OpenAI API
export class LLMService {
    private apiKey: string;

    constructor(apiKey: string = '') {
        this.apiKey = apiKey;
    }

    // System Prompt Context for the AI
    private systemPrompt = `
      You are CFO Copilot, an expert financial analyst.
      Context:
      - Revenue GL Accounts: 4000-4999
      - COGS GL Accounts: 5000-5999
      - Opex GL Accounts: 6000-8999
      - Fiscal Year: Calendar Year (Jan-Dec)
      - Key Metrics: EBITDA = Revenue - COGS - Opex. Gross Margin = (Revenue - COGS) / Revenue.
      
      Instructions:
      1. Reference only provided data.
      2. Explain calculations if asked.
      3. Use professional, executive tone.
    `;

    async generateSummary(query: string, data: any[]): Promise<Partial<QueryResult>> {
        // Mock LLM generation
        // In a real app, we would send the query + data snippet + this.systemPrompt to GPT-4

        return {
            summary: `Based on the analysis of ${data.length} records, specific trends were identified matching the query "${query}".`,
            insights: [
                'Data indicates stable performance.',
                'No significant anomalies detected.',
                'Review detailed rows for specific outliers.'
            ],
            followUps: [
                'Drill down by department',
                'Compare with previous period',
                'Export this data to Excel'
            ]
        };
    }
}
