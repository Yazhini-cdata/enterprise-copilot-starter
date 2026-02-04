// Basic types for our app domain

export type Persona = 'CFO' | 'Controller' | 'AP Clerk' | 'AR Clerk';
export type DataSource = 'SageIntacct7' | 'NetSuite7' | 'QuickBooks' | 'DynamicsGP' | 'SQLServer';

export interface QueryResult {
    sql: string;
    data: any[];
    columns: string[];
    summary?: string;
    insights?: string[];
    followUps?: string[];
    kpi?: {
        label: string;
        value: string;
        trend?: 'up' | 'down' | 'neutral';
        trendValue?: string;
    }[];
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    result?: QueryResult;
    timestamp: number;
}
