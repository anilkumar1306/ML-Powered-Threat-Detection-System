import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, UploadCloud } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ChartCard, DistributionPieChart, AttacksBarChart } from '../components/Charts';

const Analytics = () => {
    const { results } = useAppContext();
    const navigate = useNavigate();

    const stats = useMemo(() => {
        if (!results) return null;
        return {
            total: results.total_rows,
            benign: results.benign_count,
            attack: results.attack_count,
            anomaly: results.anomaly_count
        };
    }, [results]);

    const pieData = useMemo(() => {
        if (!stats) return [];
        return [
            { name: 'Benign', value: stats.benign },
            { name: 'Attack', value: stats.attack },
            { name: 'Anomaly', value: stats.anomaly }
        ].filter(item => item.value > 0);
    }, [stats]);

    const attackDistributionData = useMemo(() => {
        if (!results) return [];

        const counts: Record<string, number> = {};
        results.results.forEach(r => {
            counts[r.prediction] = (counts[r.prediction] || 0) + 1;
        });

        // Top 10 most frequent labels (including benign to see ratio)
        return Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10);
    }, [results]);

    if (!results) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
                <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-full">
                    <BarChart3 className="h-16 w-16 text-slate-600" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-200">No Analytics Data</h2>
                    <p className="text-slate-500 max-w-md mx-auto">
                        Upload a file to generate detailed visual analytics and insights.
                    </p>
                </div>
                <button
                    onClick={() => navigate('/upload')}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-medium shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02]"
                >
                    <UploadCloud className="h-5 w-5" />
                    Go to Upload
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-200">Traffic Analytics</h1>

            <div className="grid gap-6 md:grid-cols-2">
                <ChartCard title="Overall Traffic Distribution">
                    <DistributionPieChart data={pieData} />
                </ChartCard>
                <ChartCard title="Top 10 Detected Classes">
                    <AttacksBarChart data={attackDistributionData} />
                </ChartCard>
            </div>

            {/* Placeholder for Timeline or other advanced charts if data permitted */}
            {/* Since we don't have timestamps in requirements' upload response, 
                we skip the timeline but could add more specific breakdowns if needed. */}

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-slate-200 font-semibold mb-4">Summary Insights</h3>
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                        <p className="text-slate-500 text-sm mb-1">Attack Rate</p>
                        <p className="text-2xl font-bold text-red-400">
                            {((stats!.attack / stats!.total) * 100).toFixed(2)}%
                        </p>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                        <p className="text-slate-500 text-sm mb-1">Anomaly Rate</p>
                        <p className="text-2xl font-bold text-orange-400">
                            {((stats!.anomaly / stats!.total) * 100).toFixed(2)}%
                        </p>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                        <p className="text-slate-500 text-sm mb-1">Clean Traffic</p>
                        <p className="text-2xl font-bold text-green-400">
                            {((stats!.benign / stats!.total) * 100).toFixed(2)}%
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
