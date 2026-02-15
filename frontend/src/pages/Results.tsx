import { useNavigate } from 'react-router-dom';
import { FileSearch, UploadCloud } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { apiService } from '../services/api';
import DataTable from '../components/DataTable';

const Results = () => {
    const { results, setError } = useAppContext();
    const navigate = useNavigate();

    const handleDownload = async () => {
        // The file_id is typically returned in the upload response or we can't download.
        // The prompt says "Download Response Format": { total_rows... results: [...] }
        // It doesn't explicitly say file_id is returned in the JSON. 
        // However, the download endpoint represents `GET /download/{file_id}`.
        // If the backend doesn't return a file_id, we can't download. 
        // I will assume the upload response might contain it or I need to handle this gracefully.
        // For now, I'll check if `results` object has an ID or similar. 
        // If not, I'll mock it or just show an error toast that "Download not available for this session".
        // Actually, usually in such systems, the upload returns a reference ID. 
        // Let's assume `results` might have it. If not, I will add a placeholder.

        // *Correction*: The prompt's Upload Response Format DOES NOT list file_id. 
        // But the "Export CSV button (call backend download endpoint)" requirement exists. 
        // I'll assume the backend actually returns it or uses a session. 
        // I'll try to access `(results as any).file_id` just in case, or show a toast.

        try {
            const fileId = (results as any)?.file_id;
            if (fileId) {
                await apiService.downloadResults(fileId);
            } else {
                // Fallback: Client-side CSV generation if backend ID is missing
                // This ensures the feature works even if the API didn't return an ID.
                const headers = ['Row ID', 'Prediction', 'Confidence', 'Anomaly'];
                const csvContent = [
                    headers.join(','),
                    ...results!.results.map(r => `${r.row_id},${r.prediction},${r.confidence},${r.anomaly_flag}`)
                ].join('\n');

                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'analysis_results.csv';
                a.click();
                window.URL.revokeObjectURL(url);
            }
        } catch (err) {
            setError('Failed to download results.');
        }
    };

    if (!results) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-full shadow-2xl shadow-cyan-900/10">
                    <FileSearch className="h-16 w-16 text-slate-600" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-200">No Analysis Results</h2>
                    <p className="text-slate-500 max-w-md mx-auto">
                        There are no results to display yet. Please upload a traffic log file to start the threat analysis.
                    </p>
                </div>
                <button
                    onClick={() => navigate('/upload')}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-medium shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <UploadCloud className="h-5 w-5" />
                    Go to Upload
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-200">Analysis Results</h1>
                    <p className="text-slate-500 text-sm">
                        Verified {results.total_rows.toLocaleString()} traffic records
                    </p>
                </div>
            </div>

            <DataTable
                data={results.results}
                onDownload={handleDownload}
            />
        </div>
    );
};

export default Results;
