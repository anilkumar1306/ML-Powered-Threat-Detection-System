import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import FileUpload from '../components/FileUpload';

const Upload = () => {
    const { setResults, setError, setIsLoading } = useAppContext();
    const navigate = useNavigate();

    const handleUploadSuccess = (data: any) => {
        setResults(data);
        setIsLoading(false);
        navigate('/results');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-slate-200">Upload Traffic Logs</h1>
                <p className="text-slate-500">
                    Upload your network traffic CSV file for analysis.
                    The system will predict attacks and detect anomalies using the selected model.
                </p>
            </div>

            <FileUpload
                onUploadSuccess={handleUploadSuccess}
                setError={setError}
            />

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-8">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">CSV Format Requirements</h3>
                <code className="block bg-slate-950 p-4 rounded-lg text-xs text-slate-400 font-mono overflow-x-auto">
                    Destination Port, Flow Duration, Total Fwd Packets, Total Backward Packets, Total Length of Fwd Packets...
                </code>
                <p className="text-xs text-slate-500 mt-3">
                    Ensure your CSV file contains the required CICIDS2017 dataset features.
                    The model expects standard pre-processed features.
                </p>
            </div>
        </div>
    );
};

export default Upload;
