import React from 'react';
import { User, Settings, PieChart, Database, Terminal } from 'lucide-react';
import { Persona, DataSource } from '../lib/types';
import { cn } from '../lib/utils';

interface LayoutProps {
    children: React.ReactNode;
    persona: Persona;
    setPersona: (p: Persona) => void;
    dataSource: DataSource;
    setDataSource: (d: DataSource) => void;
    onSettingsClick: () => void;
}

const PERSONAS: Persona[] = ['CFO', 'Controller', 'AP Clerk', 'AR Clerk'];
const SOURCES: DataSource[] = ['SageIntacct7', 'NetSuite7', 'QuickBooks', 'DynamicsGP', 'SQLServer'];

export function Layout({ children, persona, setPersona, dataSource, setDataSource, onSettingsClick }: LayoutProps) {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
            {/* Header */}
            <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <PieChart className="w-6 h-6 text-blue-500" />
                        <span className="font-bold text-xl tracking-tight">CFO Copilot</span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
                            BETA
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Data Source Selector */}
                        <div className="flex items-center gap-2 text-sm">
                            <Database className="w-4 h-4 text-slate-400" />
                            <select
                                value={dataSource}
                                onChange={(e) => setDataSource(e.target.value as DataSource)}
                                className="bg-slate-800 border-none rounded-md px-2 py-1 text-slate-200 focus:ring-1 focus:ring-blue-500"
                            >
                                {SOURCES.map(s => (
                                    <option key={s} value={s}>
                                        {s === 'SageIntacct7' ? 'Sage Intacct' :
                                            s === 'NetSuite7' ? 'NetSuite' :
                                                s === 'DynamicsGP' ? 'Dynamics GP' :
                                                    s === 'SQLServer' ? 'SQL Server' :
                                                        s}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="h-6 w-px bg-slate-800" />

                        {/* Persona Selector */}
                        <div className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4 text-slate-400" />
                            <select
                                value={persona}
                                onChange={(e) => setPersona(e.target.value as Persona)}
                                className="bg-slate-800 border-none rounded-md px-2 py-1 text-slate-200 focus:ring-1 focus:ring-blue-500"
                            >
                                {PERSONAS.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>

                        <div className="h-6 w-px bg-slate-800" />

                        <button
                            onClick={onSettingsClick}
                            className="p-2 hover:bg-slate-800 rounded-full transition-colors"
                        >
                            <Settings className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 py-8">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-800 py-6 text-center text-slate-500 text-sm">
                <div className="flex items-center justify-center gap-2">
                    <Terminal className="w-4 h-4" />
                    <span>Powered by CData MCP & OpenAI</span>
                </div>
            </footer>
        </div>
    );
}
