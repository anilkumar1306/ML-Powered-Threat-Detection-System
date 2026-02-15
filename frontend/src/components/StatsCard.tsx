import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    color?: string; // Text color class for the value/icon
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, trend, color = "text-cyan-400" }) => {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg hover:border-slate-700 transition-colors">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
                    <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
                    {trend && <p className="text-slate-500 text-xs mt-2">{trend}</p>}
                </div>
                <div className={`p-3 rounded-lg bg-slate-800/50 ${color}`}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
