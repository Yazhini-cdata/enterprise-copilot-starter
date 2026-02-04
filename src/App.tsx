import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ResultsView } from './components/ResultsView';
import { Persona, DataSource, QueryResult } from './lib/types';
import { QUERY_TEMPLATES } from './lib/templates';
import { MCPService } from './lib/mcp';
import { LLMService } from './lib/llm';
import { Search, Send } from 'lucide-react';
import { cn } from './lib/utils';

function App() {
    const [persona, setPersona] = useState<Persona>('CFO');
    const [dataSource, setDataSource] = useState<DataSource>('SageIntacct7');
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeResult, setActiveResult] = useState<QueryResult | null>(null);

    const [history, setHistory] = useState<string[]>([]);
    const [showSettings, setShowSettings] = useState(false);

    // Services
    // Note: specific instances should probably be memoized in a real app
    const mcp = new MCPService(dataSource);
    const llm = new LLMService();

    const addToHistory = (q: string) => {
        setHistory(prev => {
            const newHistory = [q, ...prev.filter(h => h !== q)].slice(0, 10);
            return newHistory;
        });
    };

    const handleRunTemplate = async (templateId: string) => {
        const template = QUERY_TEMPLATES.find(t => t.id === templateId);
        if (!template) return;

        setIsLoading(true);
        setQuery(template.description);
        addToHistory(template.description);
        setActiveResult(null);

        try {
            const sql = template.sql(dataSource);
            const result = await mcp.executeQuery(sql);
            setActiveResult(result);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const runQuery = async (text: string) => {
        setIsLoading(true);
        setQuery(text);
        addToHistory(text);
        setActiveResult(null);

        try {
            let sql = '';
            if (text.toLowerCase().includes('spend') || text.toLowerCase().includes('vendor')) {
                sql = QUERY_TEMPLATES.find(t => t.id === 'vendor_spend')?.sql(dataSource) || '';
            } else if (text.toLowerCase().includes('due') || text.toLowerCase().includes('ar') || text.toLowerCase().includes('aging')) {
                sql = QUERY_TEMPLATES.find(t => t.id === 'ar_aging')?.sql(dataSource) || '';
            } else {
                sql = `-- Could not interpret intent from: "${text}". \n-- Showing generic mock data.`;
            }

            const result = await mcp.executeQuery(sql);
            setActiveResult(result);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        runQuery(query);
    };

    return (
        <Layout
            persona={persona}
            setPersona={setPersona}
            dataSource={dataSource}
            setDataSource={setDataSource}
            onSettingsClick={() => setShowSettings(!showSettings)}
        >
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Search / Query Bar */}
                <div className={cn(
                    "relative transition-all duration-500 ease-in-out",
                    activeResult ? "py-0" : "py-4 md:py-8"
                )}>
                    <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto group z-10">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask a financial question (e.g., 'Who are my top vendors?')..."
                            className="block w-full pl-11 pr-12 py-4 bg-slate-900 border border-slate-700 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-lg shadow-black/20"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !query.trim()}
                            className="absolute right-2 top-2 bottom-2 aspect-square bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>

                    {/* Search History Popover (Simple list below search when empty) */}
                    {!activeResult && history.length > 0 && (
                        <div className="mt-4 max-w-2xl mx-auto">
                            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Recent Searches</h3>
                            <div className="flex flex-wrap gap-2">
                                {history.map((h, i) => (
                                    <button
                                        key={i}
                                        onClick={() => runQuery(h)}
                                        className="text-xs px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                                    >
                                        {h}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Settings Modal (Placeholder) */}
                {showSettings && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowSettings(false)}>
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
                            <h2 className="text-xl font-bold text-white mb-4">Settings</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Default Data Source</label>
                                    <select
                                        value={dataSource}
                                        onChange={(e) => setDataSource(e.target.value as DataSource)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                                    >
                                        <option value="SageIntacct7">Sage Intacct</option>
                                        <option value="NetSuite7">NetSuite</option>
                                        <option value="QuickBooks">QuickBooks</option>
                                        <option value="DynamicsGP">Dynamics GP</option>
                                        <option value="SQLServer">SQL Server</option>
                                    </select>
                                </div>
                                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-300">
                                    <p>Connected to CData MCP v2.1</p>
                                    <p>OpenAI GPT-4 Enabled</p>
                                </div>
                                <button
                                    onClick={() => setShowSettings(false)}
                                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Dynamic Content Switcher */}
                {activeResult || isLoading ? (
                    <ResultsView
                        result={activeResult!}
                        isLoading={isLoading}
                        onBack={() => setActiveResult(null)}
                        onRunQuery={runQuery}
                    />
                ) : (
                    <Dashboard onRunTemplate={handleRunTemplate} dataSource={dataSource} />
                )}

            </div>
        </Layout>
    );
}

export default App;
