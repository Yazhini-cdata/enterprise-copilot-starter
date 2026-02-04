import React from 'react';
import { QueryResult } from '../lib/types';
import { ArrowDown, ArrowUp, BarChart3, Copy, FileText, Lightbulb, MessageSquare } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';

interface ResultsViewProps {
    result: QueryResult;
    isLoading: boolean;
    onBack: () => void;
    onRunQuery: (query: string) => void;
}

export function ResultsView({ result, isLoading, onBack, onRunQuery }: ResultsViewProps) {
    if (isLoading) {
        return (
            <div className="w-full h-96 flex items-center justify-center animate-pulse">
                <div className="text-slate-500 flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    Loading live financial data...
                </div>
            </div>
        );
    }

    // Handle errors or empty states
    if (!result || !result.data || result.data.length === 0) {
        if (result?.summary) {
            return (
                <div className="p-8 border border-slate-800 rounded-xl bg-slate-900/50 text-center">
                    <p className="text-slate-400">{result.summary}</p>
                </div>
            )
        }
        return null;
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center text-sm text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowDown className="w-4 h-4 rotate-90 mr-2" />
                    Back to Dashboard
                </button>
            </div>

            {/* KPI Row */}
            {result.kpi && result.kpi.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {result.kpi.map((k, i) => (
                        <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
                            <div className="text-sm text-slate-400 mb-1">{k.label}</div>
                            <div className="flex items-end gap-2">
                                <div className="text-2xl font-semibold text-white">{k.value}</div>
                                {k.trend && (
                                    <div className={cn(
                                        "flex items-center text-xs font-medium px-2 py-0.5 rounded-full mb-1",
                                        k.trend === 'up' ? "text-emerald-400 bg-emerald-400/10" :
                                            k.trend === 'down' ? "text-rose-400 bg-rose-400/10" : "text-slate-400"
                                    )}>
                                        {k.trend === 'up' ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                                        {k.trendValue}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Executive Summary & Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    {/* Summary Card */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-slate-900 to-slate-900/50 border border-slate-800">
                        <div className="flex items-center gap-2 mb-4 text-blue-400">
                            <FileText className="w-5 h-5" />
                            <h3 className="font-semibold">Executive Summary</h3>
                        </div>
                        <p className="text-slate-300 leading-relaxed">
                            {result.summary}
                        </p>
                    </div>

                    {/* Data Table */}
                    <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/50">
                        <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/80 flex justify-between items-center">
                            <span className="font-medium text-slate-200">Details</span>
                            <span className="text-xs text-slate-500">{result.data.length} rows</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-400 uppercase bg-slate-950/50">
                                    <tr>
                                        {result.columns.map(col => (
                                            <th key={col} className="px-6 py-3 font-medium">{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {result.data.map((row, i) => (
                                        <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                                            {result.columns.map(col => (
                                                <td key={`${i}-${col}`} className="px-6 py-4 text-slate-300">
                                                    {typeof row[col] === 'number' && col.toLowerCase().includes('amount') || col.toLowerCase().includes('spend') || col.toLowerCase().includes('revenue') || col.toLowerCase().includes('due')
                                                        ? formatCurrency(row[col])
                                                        : row[col]?.toString()}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Insights */}
                    <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="flex items-center gap-2 mb-4 text-amber-400">
                            <Lightbulb className="w-5 h-5" />
                            <h3 className="font-semibold">Key Insights</h3>
                        </div>
                        <ul className="space-y-3">
                            {result.insights?.map((insight, i) => (
                                <li key={i} className="flex gap-3 text-sm text-slate-300">
                                    <span className="block mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400/50 flex-shrink-0" />
                                    {insight}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Follow-up Questions */}
                    <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="flex items-center gap-2 mb-4 text-violet-400">
                            <MessageSquare className="w-5 h-5" />
                            <h3 className="font-semibold">Suggested Follow-ups</h3>
                        </div>
                        <div className="flex flex-col gap-2">
                            {result.followUps?.map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => onRunQuery(q)}
                                    className="w-full text-left px-3 py-2 rounded-lg bg-slate-950/50 hover:bg-slate-800 border border-slate-800 transition-colors text-sm text-slate-300 hover:text-white"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* SQL Viewer */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-mono text-slate-500">GENERATED SQL</span>
                            <button className="p-1 hover:text-white text-slate-500" title="Copy SQL">
                                <Copy className="w-3 h-3" />
                            </button>
                        </div>
                        <div className="p-3 rounded bg-black/20 font-mono text-xs text-slate-400 overflow-x-auto border border-white/5">
                            {result.sql}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
