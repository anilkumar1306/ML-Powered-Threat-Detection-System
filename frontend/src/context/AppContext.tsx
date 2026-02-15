import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { UploadResponse } from '../services/api';

interface AppContextType {
    results: UploadResponse | null;
    setResults: (data: UploadResponse | null) => void;
    selectedModel: string;
    setSelectedModel: (model: string) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    clearError: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [results, setResults] = useState<UploadResponse | null>(null);
    const [selectedModel, setSelectedModel] = useState<string>('Random Forest');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const clearError = () => setError(null);

    return (
        <AppContext.Provider
            value={{
                results,
                setResults,
                selectedModel,
                setSelectedModel,
                isLoading,
                setIsLoading,
                error,
                setError,
                clearError,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
