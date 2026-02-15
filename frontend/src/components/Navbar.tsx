import { ShieldCheck, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiService } from '../services/api';

const Navbar = () => {
    const [health, setHealth] = useState<'online' | 'offline'>('offline');

    useEffect(() => {
        const checkHealth = async () => {
            try {
                await apiService.getHealth();
                setHealth('online');
            } catch (error) {
                setHealth('offline');
            }
        };

        checkHealth();
        const interval = setInterval(checkHealth, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, []);

    return (
        <nav className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                    <ShieldCheck className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                    <h1 className="text-white font-bold text-lg tracking-tight">SOC<span className="text-cyan-400">Dash</span></h1>
                    <p className="text-slate-500 text-xs">Threat Detection System</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
                    <Activity className={`h-4 w-4 ${health === 'online' ? 'text-green-400' : 'text-red-400'}`} />
                    <span className="text-xs font-medium text-slate-400">
                        System: <span className={health === 'online' ? 'text-green-400' : 'text-red-400'}>{health.toUpperCase()}</span>
                    </span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
