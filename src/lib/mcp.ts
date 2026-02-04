import { DataSource, QueryResult } from "./types";

// In a real scenario, this would point to a localhost proxy that forwards to the CData MCP server
// or usage of the direct streamable HTTP endpoint if CORS allows.
const CDATA_ENDPOINT = "http://localhost:8080/api.rsc/query";
const AUTH_TOKEN = "Basic ..."; // Placeholder

export class MCPService {
    private dataSource: DataSource;

    constructor(dataSource: DataSource = 'SageIntacct7') {
        this.dataSource = dataSource;
    }

    async executeQuery(sql: string): Promise<QueryResult> {
        console.log(`Executing SQL on ${this.dataSource}:`, sql);

        // FOR PILOT: If the SQL starts with --, it's a comment/stub
        if (sql.trim().startsWith('--')) {
            return {
                sql,
                columns: ['Message'],
                data: [{ Message: 'Feature not configured or table missing in this environment.' }],
                summary: 'This feature is not available in the current demo configuration.',
                insights: [],
                followUps: []
            };
        }

        try {
            // simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // TODO: Uncomment this to use real backend when proxy is ready
            // const response = await fetch(CDATA_ENDPOINT, {
            //   method: 'POST',
            //   body: JSON.stringify({ query: sql }),
            //   headers: { 'Authorization': AUTH_TOKEN }
            // });
            // const data = await response.json();
            // return this.mapResponse(data, sql);

            // MOCK DATA FALLBACK FOR DEMO UI
            return this.getMockData(sql);

        } catch (error) {
            console.error("MCP Error", error);
            return {
                sql,
                columns: ['Error'],
                data: [],
                summary: 'Error connecting to CData MCP source.',
                insights: [],
                followUps: []
            };
        }
    }

    private getMockData(sql: string): QueryResult {
        // Simple pattern matching to return relevant mock data based on the query content

        if (sql.includes('Arinvoice') && sql.includes('Whendue <')) {
            // AR Aging
            return {
                sql,
                columns: ['Customername', 'AmountDue', 'InvoiceCount'],
                data: [
                    { Customername: 'Acme Corp', AmountDue: 45000.00, InvoiceCount: 3 },
                    { Customername: 'Globex Inc', AmountDue: 28500.50, InvoiceCount: 2 },
                    { Customername: 'Soylent Corp', AmountDue: 12000.00, InvoiceCount: 1 },
                    { Customername: 'Initech', AmountDue: 8500.00, InvoiceCount: 4 },
                    { Customername: 'Umbrella Corp', AmountDue: 5000.00, InvoiceCount: 1 },
                ],
                summary: 'Total overdue AR is $99,000. Acme Corp is the largest outstanding balance.',
                insights: [
                    'Acme Corp accounts for 45% of overdue receivables.',
                    '3 customers have invoices older than 90 days.',
                    'Collection efforts should prioritize the top 2 accounts.'
                ],
                followUps: [
                    'Draft a dunning email to Acme Corp',
                    'Show me payment history for Globex',
                    'What is our current cash collection rate?'
                ],
                kpi: [
                    { label: 'Total Overdue', value: '$99,000', trend: 'down', trendValue: '5% vs last month' },
                    { label: 'Avg Days Overdue', value: '72', trend: 'up', trendValue: '2 days' }
                ]
            }
        }

        if (sql.includes('Apbill') && sql.includes('TotalSpend')) {
            // Vendor Spend
            return {
                sql,
                columns: ['Vendorname', 'TotalSpend'],
                data: [
                    { Vendorname: 'AWS', TotalSpend: 120000.00 },
                    { Vendorname: 'WeWork', TotalSpend: 45000.00 },
                    { Vendorname: 'Salesforce', TotalSpend: 38000.00 },
                    { Vendorname: 'Google Ads', TotalSpend: 25000.00 },
                    { Vendorname: 'LinkedIn', TotalSpend: 15000.00 },
                ],
                summary: 'Top vendor spend is driven by Infrastructure (AWS) and Rent (WeWork).',
                insights: [
                    'AWS spend increased 10% QoQ.',
                    'Software licensing costs are 30% of total opex.',
                    'Marketing spend is within budget.'
                ],
                followUps: [
                    'Break down AWS spend by service',
                    'Show me contract renewal dates',
                    'Compare Q4 marketing spend to Q3'
                ],
                kpi: [
                    { label: 'Total Vendor Spend', value: '$243,000', trend: 'up', trendValue: '12%' }
                ]
            }
        }

        if (sql.includes('Cash Flow') || (sql.includes('Arinvoice') && sql.includes('Inflow'))) {
            // Cash Flow
            return {
                sql,
                columns: ['Type', 'Amount'],
                data: [
                    { Type: 'Inflow (AR)', Amount: 154000.00 },
                    { Type: 'Outflow (AP)', Amount: -89000.00 },
                ],
                summary: 'Net positive cash flow projected for the next 30 days.',
                insights: [
                    'Projected Net Cash: +$65,000',
                    'AP obligations are heavy in week 3',
                    'AR collections are trending positively'
                ],
                followUps: [
                    'What is our current cash balance?',
                    'Show me AP due next week',
                    'Simulate a 10% drop in collections'
                ],
                kpi: [
                    { label: 'Net Cash Flow', value: '+$65,000', trend: 'up' }
                ]
            }
        }

        // Default generic response
        return {
            sql,
            columns: ['Result'],
            data: [{ Result: 'No mock data configured for this specific query.' }],
            summary: 'Query executed successfully but no specific mock data pattern matched.',
            insights: [],
            followUps: []
        }
    }
}
