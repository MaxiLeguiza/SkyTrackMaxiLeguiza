import React, { useState } from 'react';
import { AppProvider, useApp } from './app/context/AppContext';
import { Login } from './app/components/Login';
import { Layout } from './app/components/Layout';
import { Dashboard } from './app/components/Dashboard';
import { FlightsView } from './app/components/FlightsView';
import { PlanesView } from './app/components/PlanesView';
import { CrewView } from './app/components/CrewView';
import { Toaster } from './app/components/ui/sonner';

const AppContent: React.FC = () => {
  const { user } = useApp();
  const [currentView, setCurrentView] = useState<string>('dashboard');

  if (!user) {
    return <Login />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'flights':
        return <FlightsView />;
      case 'planes':
        return <PlanesView />;
      case 'crew':
        return <CrewView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
      <Toaster />
    </AppProvider>
  );
};

export default App;
