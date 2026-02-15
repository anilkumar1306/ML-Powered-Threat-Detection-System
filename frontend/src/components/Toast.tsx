import { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import clsx from 'clsx'; // Assuming clsx is installed, or use template literals

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    onClose: () => void;
    duration?: number;
}

const Toast = ({ message, type = 'info', onClose, duration = 3000 }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle className="h-5 w-5 text-green-400" />,
        error: <AlertCircle className="h-5 w-5 text-red-400" />,
        warning: <AlertTriangle className="h-5 w-5 text-yellow-400" />,
        info: <CheckCircle className="h-5 w-5 text-blue-400" />,
    };

    const bgColors = {
        success: 'bg-slate-900 border-green-500/50',
        error: 'bg-slate-900 border-red-500/50',
        warning: 'bg-slate-900 border-yellow-500/50',
        info: 'bg-slate-900 border-blue-500/50',
    };

    return (
        <div className={clsx(
            "fixed bottom-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg transition-all animate-in slide-in-from-right",
            bgColors[type]
        )}>
            {icons[type]}
            <p className="text-slate-200 text-sm font-medium">{message}</p>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
            </button>
        </div>
    );
};

export default Toast;
