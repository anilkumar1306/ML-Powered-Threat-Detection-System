import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Search, Filter, Download, AlertTriangle } from 'lucide-react';
import type { PredictionResult } from '../services/api';

interface DataTableProps {
    data: PredictionResult[];
    onDownload: () => void;
}

const ROWS_PER_PAGE = 25;

const DataTable: React.FC<DataTableProps> = ({ data, onDownload }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterClass, setFilterClass] = useState('ALL');
    const [showAnomaliesOnly, setShowAnomaliesOnly] = useState(false);

    // Extract unique classes for filter dropdown
    // predefined labels mapping as per requirement
    const CLASS_LABELS: Record<string, string> = {
        "BENIGN": "0: BENIGN",
        "Bot": "1: Bot",
        "DDoS": "2: DDoS",
        "DoS GoldenEye": "3: DoS GoldenEye",
        "DoS Hulk": "4: DoS Hulk",
        "DoS Slowhttptest": "5: DoS Slowhttptest",
        "DoS slowloris": "6: DoS slowloris",
        "FTP-Patator": "7: FTP-Patator",
        "Heartbleed": "8: Heartbleed",
        "Infiltration": "9: Infiltration",
        "PortScan": "10: PortScan",
        "SSH-Patator": "11: SSH-Patator",
        "Web Attack - Brute Force": "12: Web Attack - Brute Force",
        "Web Attack - Sql Injection": "13: Web Attack - Sql Injection",
        "Web Attack - XSS": "14: Web Attack - XSS"
    };

    // Use all defined classes for the dropdown
    const uniqueClasses = useMemo(() => {
        return ['ALL', ...Object.keys(CLASS_LABELS)];
    }, []);

    // Filter and Sort Data
    const filteredData = useMemo(() => {
        return data.filter(row => {
            const matchesSearch =
                row.prediction.toLowerCase().includes(searchTerm.toLowerCase()) ||
                row.row_id.toString().includes(searchTerm);

            const matchesClass = filterClass === 'ALL' || row.prediction === filterClass;
            const matchesAnomaly = !showAnomaliesOnly || row.anomaly_flag;

            return matchesSearch && matchesClass && matchesAnomaly;
        });
    }, [data, searchTerm, filterClass, showAnomaliesOnly]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * ROWS_PER_PAGE;
        return filteredData.slice(start, start + ROWS_PER_PAGE);
    }, [filteredData, currentPage]);

    const getBadgeColor = (prediction: string, isAnomaly: boolean) => {
        if (isAnomaly) return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
        if (prediction === 'BENIGN') return 'bg-green-500/10 text-green-400 border-green-500/20';
        return 'bg-red-500/10 text-red-400 border-red-500/20';
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">

            {/* Table Header Controls */}
            <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by ID or class..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                        />
                    </div>

                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <select
                            value={filterClass}
                            onChange={(e) => setFilterClass(e.target.value)}
                            className="bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-8 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 appearance-none"
                        >
                            {uniqueClasses.map(c => (
                                <option key={c} value={c}>
                                    {c === 'ALL' ? 'ALL' : CLASS_LABELS[c] || c}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showAnomaliesOnly}
                            onChange={(e) => setShowAnomaliesOnly(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-offset-slate-900 focus:ring-cyan-500"
                        />
                        <span className="text-sm text-slate-300">Show Anomalies Only</span>
                    </label>

                    <button
                        onClick={onDownload}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors border border-slate-700"
                    >
                        <Download className="h-4 w-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider">
                            <th className="p-4 font-medium border-b border-slate-800">Row ID</th>
                            <th className="p-4 font-medium border-b border-slate-800">Prediction</th>
                            <th className="p-4 font-medium border-b border-slate-800">Confidence</th>
                            <th className="p-4 font-medium border-b border-slate-800">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {paginatedData.length > 0 ? (
                            paginatedData.map((row) => (
                                <tr key={row.row_id} className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="p-4 text-slate-400 font-mono text-sm">#{row.row_id}</td>
                                    <td className="p-4">
                                        <span className="text-slate-200 font-medium">{row.prediction}</span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${row.confidence > 0.8 ? 'bg-green-500' : row.confidence > 0.5 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                    style={{ width: `${row.confidence * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-slate-400">{(row.confidence * 100).toFixed(1)}%</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getBadgeColor(row.prediction, row.anomaly_flag)}`}>
                                            {row.anomaly_flag && <AlertTriangle className="h-3 w-3" />}
                                            {row.anomaly_flag ? 'ANOMALY' : row.prediction === 'BENIGN' ? 'BENIGN' : 'ATTACK'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-500">
                                    No results found matching your criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-slate-800 flex items-center justify-between text-sm text-slate-400">
                <p>Showing <span className="text-slate-200 font-medium">{filteredData.length > 0 ? (currentPage - 1) * ROWS_PER_PAGE + 1 : 0}</span> to <span className="text-slate-200 font-medium">{Math.min(currentPage * ROWS_PER_PAGE, filteredData.length)}</span> of <span className="text-slate-200 font-medium">{filteredData.length}</span> results</p>

                <div className="flex items-center gap-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className="p-2 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-slate-200">Page {currentPage} of {Math.max(1, totalPages)}</span>
                    <button
                        disabled={currentPage === totalPages || totalPages === 0}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className="p-2 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DataTable;
