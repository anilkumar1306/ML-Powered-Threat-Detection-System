import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    UploadCloud,
    TableProperties,
    BarChart3,
    BrainCircuit,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: UploadCloud, label: 'Upload Analysis', path: '/upload' },
        { icon: TableProperties, label: 'Results & Logs', path: '/results' },
        { icon: BarChart3, label: 'Analytics', path: '/analytics' },
        { icon: BrainCircuit, label: 'Model Info', path: '/models' },
    ];

    return (
        <aside
            className={clsx(
                "h-[calc(100vh-4rem)] bg-slate-950 border-r border-slate-800 transition-all duration-300 flex flex-col sticky top-16",
                collapsed ? "w-20" : "w-64"
            )}
        >
            <div className="flex-1 py-6 px-3 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => clsx(
                            "flex items-center gap-3 px-3 py-3 rounded-lg transition-all group",
                            isActive
                                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                                : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                        )}
                        title={collapsed ? item.label : undefined}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={clsx("h-5 w-5 flex-shrink-0", collapsed ? "mx-auto" : "")} />
                                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                                {!collapsed && isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>

            <div className="p-3 border-t border-slate-800">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full flex items-center justify-center p-2 rounded-lg text-slate-500 hover:bg-slate-900 hover:text-slate-300 transition-colors"
                >
                    {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
