import { useMemo } from 'react';
import { ShieldAlert, ShieldCheck, FileSearch, AlertOctagon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import StatsCard from '../components/StatsCard';
import { ChartCard, DistributionPieChart, AttacksBarChart } from '../components/Charts';

const Dashboard = () => {
    const { results } = useAppContext();

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

    const topAttacksData = useMemo(() => {
        if (!results) return [];

        const attackCounts: Record<string, number> = {};
        results.results.forEach(r => {
            if (r.prediction !== 'BENIGN' && !r.anomaly_flag) {
                attackCounts[r.prediction] = (attackCounts[r.prediction] || 0) + 1;
            }
        });

        return Object.entries(attackCounts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    }, [results]);

    if (!results) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                <div className="p-6 bg-slate-900 rounded-full">
                    <FileSearch className="h-12 w-12 text-slate-500" />
                </div>
                <h2 className="text-xl font-semibold text-slate-300">No Data Available</h2>
                <p className="text-slate-500 max-w-md">
                    Please upload a CSV file to generate the security dashboard analysis.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Logs Processed"
                    value={stats?.total.toLocaleString() || 0}
                    icon={FileSearch}
                    color="text-slate-200"
                />
                <StatsCard
                    title="Benign Traffic"
                    value={stats?.benign.toLocaleString() || 0}
                    icon={ShieldCheck}
                    color="text-green-400"
                />
                <StatsCard
                    title="System Status"
                    value="Secure"
                    icon={ShieldCheck}
                    color="text-emerald-500"
                    trend="+100% uptime"
                />
                <StatsCard
                    title="Detected Attacks"
                    value={stats?.attack.toLocaleString() || 0}
                    icon={ShieldAlert}
                    color="text-red-400"
                />
                <StatsCard
                    title="Anomalies"
                    value={stats?.anomaly.toLocaleString() || 0}
                    icon={AlertOctagon}
                    color="text-orange-400"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <ChartCard title="Traffic Distribution">
                    <DistributionPieChart data={pieData} />
                </ChartCard>
                <ChartCard title="Top 5 Attack Types">
                    <AttacksBarChart data={topAttacksData} />
                </ChartCard>
            </div>
        </div>
    );
};

export default Dashboard;
