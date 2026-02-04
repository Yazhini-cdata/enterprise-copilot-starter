import React from 'react';
import { QUERY_TEMPLATES } from '../lib/templates';
import { DataSource } from '../lib/types';
import { ArrowRight, Sparkles } from 'lucide-react';

interface DashboardProps {
    onRunTemplate: (templateId: string) => void;
    dataSource: DataSource;
}

export function Dashboard({ onRunTemplate, dataSource }: DashboardProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Welcome Hero */}
            <div className="text-center py-10 space-y-4">
                <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-indigo-400">
                    Financial Intelligence, Real-Time.
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                    Ask complex questions about your financial data or use one of our pre-built specialized models.
                    Backed by live data from <span className="text-slate-200 font-medium">
                        {dataSource === 'SageIntacct7' ? 'Sage Intacct' :
                            dataSource === 'NetSuite7' ? 'NetSuite' :
                                dataSource === 'DynamicsGP' ? 'Dynamics GP' :
                                    dataSource === 'SQLServer' ? 'SQL Server' :
                                        dataSource}
                    </span>.
                </p>
            </div>

            {/* Template Grid */}
            <div>
                <div className="flex items-center gap-2 mb-6 px-1">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h2 className="text-lg font-semibold text-slate-200">Recommended Actions</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {QUERY_TEMPLATES.map((template) => (
                        <button
                            key={template.id}
                            onClick={() => onRunTemplate(template.id)}
                            className="group relative flex flex-col items-start p-5 rounded-xl bg-slate-900/50 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/30 transition-all duration-200 text-left"
                        >
                            <div className="mb-2 font-semibold text-slate-200 group-hover:text-blue-300 transition-colors">
                                {template.label}
                            </div>
                            <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                                {template.description}
                            </p>
                            <div className="mt-auto flex items-center text-xs font-medium text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-200">
                                Run Analysis <ArrowRight className="w-3 h-3 ml-1" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
