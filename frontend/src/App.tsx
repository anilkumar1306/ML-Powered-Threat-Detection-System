import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Loader from './components/Loader';
import Toast from './components/Toast';

// Lazy load pages for performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Upload = lazy(() => import('./pages/Upload'));
const Results = lazy(() => import('./pages/Results'));
const Analytics = lazy(() => import('./pages/Analytics'));
const ModelInfo = lazy(() => import('./pages/ModelInfo'));

// Layout wrapper to handle sidebar and content area
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
      <GlobalToast />
    </div>
  );
};

// Component to consume context and show toast
const GlobalToast = () => {
  const { error, clearError } = useAppContext();

  if (!error) return null;

  return (
    <Toast
      message={error}
      type="error"
      onClose={clearError}
    />
  );
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <Suspense fallback={
            <div className="flex h-[50vh] items-center justify-center">
              <Loader />
            </div>
          }>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/results" element={<Results />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/models" element={<ModelInfo />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
