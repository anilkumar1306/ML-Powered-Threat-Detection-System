import React, { useState, useCallback } from 'react';
import { UploadCloud, File, X } from 'lucide-react';
import { apiService } from '../services/api';

interface FileUploadProps {
    onUploadSuccess: (data: any) => void;
    setError: (msg: string | null) => void;
}

const MODELS = [
    'Random Forest',
    'XGBoost',
    'Decision Tree',
    'Gradient Boosting',
    'Logistic Regression'
];

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess, setError }) => {
    const [file, setFile] = useState<File | null>(null);
    const [model, setModel] = useState<string>(MODELS[0]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        validateAndSetFile(droppedFile);
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (file: File) => {
        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            setError('Please upload a valid CSV file.');
            return;
        }
        setError(null);
        setFile(file);
        setProgress(0);
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);
        try {
            // Simulated progress since Axios progress can be fast for small files
            const progressInterval = setInterval(() => {
                setProgress(prev => Math.min(prev + 10, 90));
            }, 200);

            const data = await apiService.uploadFile(file, model, (event) => {
                const percentCompleted = Math.round((event.loaded * 100) / event.total);
                setProgress(percentCompleted);
            });

            clearInterval(progressInterval);
            setProgress(100);
            setTimeout(() => {
                onUploadSuccess(data);
                setUploading(false);
                setFile(null); // Reset after success
                setProgress(0);
            }, 500);

        } catch (err: any) {
            setUploading(false);
            setError(err.response?.data?.detail || 'Upload failed. Please try again.');
            setProgress(0);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div
                className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${isDragging
                    ? 'border-cyan-400 bg-cyan-400/10'
                    : 'border-slate-700 hover:border-slate-600 bg-slate-900/50'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-slate-800">
                        <UploadCloud className={`h-10 w-10 ${isDragging ? 'text-cyan-400' : 'text-slate-400'}`} />
                    </div>

                    <div>
                        <p className="text-lg font-medium text-slate-200">
                            Drag & drop your CSV file here
                        </p>
                        <p className="text-slate-500 text-sm mt-1">
                            or click to browse from your computer
                        </p>
                    </div>

                    <input
                        type="file"
                        accept=".csv"
                        className="hidden"
                        id="file-upload"
                        onChange={handleFileSelect}
                        disabled={uploading}
                    />
                    <label
                        htmlFor="file-upload"
                        className={`px-6 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-medium cursor-pointer transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        Browse Files
                    </label>
                </div>
            </div>

            {file && (
                <div className="mt-6 p-4 bg-slate-900 rounded-xl border border-slate-800 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-800 rounded-lg">
                                <File className="h-5 w-5 text-cyan-400" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-200">{file.name}</p>
                                <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>
                        {!uploading && (
                            <button
                                onClick={() => setFile(null)}
                                className="text-slate-500 hover:text-red-400 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Select Model</label>
                            <select
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                disabled={uploading}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                            >
                                {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                    </div>

                    {uploading && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Uploading & Analyzing...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-cyan-500 transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {!uploading && (
                        <button
                            onClick={handleUpload}
                            className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-medium shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Start Analysis
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default FileUpload;
