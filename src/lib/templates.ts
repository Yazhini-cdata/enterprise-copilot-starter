import { DataSource } from "./types";

export const QUERY_TEMPLATES = [
    {
        id: 'ar_aging',
        label: 'AR Aging',
        description: 'Invoices over 60 days grouped by customer',
        sql: (source: DataSource) => {
            if (source === 'SageIntacct7') {
                return `SELECT Customername, SUM(Totaldue) as AmountDue, COUNT(*) as InvoiceCount 
FROM [SageIntacct7].[SageIntacct].[Arinvoice] 
WHERE Whendue < DATEADD(day, -60, CURRENT_DATE()) 
AND Totaldue > 0 
GROUP BY Customername 
ORDER BY AmountDue DESC 
LIMIT 10`;
            }
            return `-- NetSuite implementation not available`;
        }
    },
    {
        id: 'vendor_spend',
        label: 'Vendor Spend',
        description: 'Top vendors by spend this year',
        sql: (source: DataSource) => {
            if (source === 'SageIntacct7') {
                return `SELECT Vendorname, SUM(Totalentered) as TotalSpend 
FROM [SageIntacct7].[SageIntacct].[Apbill] 
WHERE Whencreated >= DATE_TRUNC('year', CURRENT_DATE())
GROUP BY Vendorname 
ORDER BY TotalSpend DESC 
LIMIT 10`;
            }
            return `-- NetSuite implementation not available`;
        }
    },
    {
        id: 'customer_profitability',
        label: 'Customer Profitability',
        description: 'Customers generating most revenue',
        sql: (source: DataSource) => {
            if (source === 'SageIntacct7') {
                return `SELECT Customername, SUM(Totalentered) as TotalRevenue 
FROM [SageIntacct7].[SageIntacct].[Arinvoice] 
WHERE Whencreated >= DATE_TRUNC('year', CURRENT_DATE())
GROUP BY Customername 
ORDER BY TotalRevenue DESC 
LIMIT 10`;
            }
            return `-- NetSuite implementation not available`;
        }
    },
    {
        id: 'budget_vs_actuals',
        label: 'Budget vs Actuals',
        description: 'Q4 spend vs budget by department',
        sql: () => `-- Table [SageIntacct7].[SageIntacct].[Budget] not found in verification. 
-- Please configure Budget module.`
    },
    {
        id: 'cash_flow',
        label: 'Cash Flow Projection',
        description: 'Projected cash position next 30 days',
        sql: (source: DataSource) => {
            if (source === 'SageIntacct7') {
                return `SELECT 'Inflow (AR)' as Type, SUM(Totaldue) as Amount 
FROM [SageIntacct7].[SageIntacct].[Arinvoice] 
WHERE Whendue BETWEEN CURRENT_DATE() AND DATEADD(day, 30, CURRENT_DATE())
UNION ALL
SELECT 'Outflow (AP)' as Type, SUM(Totaldue) * -1 as Amount 
FROM [SageIntacct7].[SageIntacct].[Apbill] 
WHERE Whendue BETWEEN CURRENT_DATE() AND DATEADD(day, 30, CURRENT_DATE())`;
            }
            return `-- NetSuite implementation not available`;
        }
    },
    {
        id: 'top_expenses',
        label: 'Top Expenses',
        description: 'Top 10 expenses this quarter',
        sql: (source: DataSource) => {
            if (source === 'SageIntacct7') {
                return `SELECT Vendorname, SUM(Totalentered) as ExpenseAmount
FROM [SageIntacct7].[SageIntacct].[Apbill]
WHERE Whencreated >= DATE_TRUNC('quarter', CURRENT_DATE())
GROUP BY Vendorname
ORDER BY ExpenseAmount DESC
LIMIT 10`;
            }
            return `-- NetSuite implementation not available`;
        }
    },
    {
        id: 'revenue_rec',
        label: 'Revenue Recognition',
        description: 'Deferred revenue by product line',
        sql: () => `-- Deferred Revenue module not detected.`
    },
    {
        id: 'margin_analysis',
        label: 'Margin Analysis',
        description: 'Products with margins below 30%',
        sql: () => `-- Product/COGS data not available in simplified Arinvoice table.`
    },
    {
        id: 'payroll_analysis',
        label: 'Payroll Analysis',
        description: 'Headcount + payroll by dept',
        sql: () => `-- HRIS module not connected.`
    },
    {
        id: 'month_end_close',
        label: 'Month-End Close',
        description: 'Accounts pending reconciliation',
        sql: () => `-- GL Reconciliation data not available.`
    }
];
