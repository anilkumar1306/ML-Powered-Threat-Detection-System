import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-red-500/20 rounded-xl p-8 max-w-lg w-full text-center space-y-4">
                        <div className="bg-red-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                            <AlertTriangle className="h-8 w-8 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-100">Something went wrong</h1>
                        <p className="text-slate-400">The application encountered an unexpected error.</p>
                        {this.state.error && (
                            <pre className="bg-black/50 p-4 rounded-lg text-left overflow-auto text-xs text-red-400 font-mono">
                                {this.state.error.toString()}
                            </pre>
                        )}
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
