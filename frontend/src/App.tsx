import React, { useEffect, useState, useCallback } from 'react';
import { HeatMap } from './components/map/HeatMap';
import { RankedList } from './components/panels/RankedList';
import { DeploymentPanel } from './components/panels/DeploymentPanel';
import { IncidentConsole } from './components/panels/IncidentConsole';
import { fetchJunctions, JunctionData } from './lib/api';
import { ShieldAlert, Users } from 'lucide-react';

function App() {
  const [junctions, setJunctions] = useState<JunctionData[]>([]);

  const loadData = useCallback(async () => {
    try {
      const data = await fetchJunctions();
      setJunctions(data);
    } catch (err) {
      console.error("Failed to fetch junctions", err);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // Poll every 5s for demo
    return () => clearInterval(interval);
  }, [loadData]);

  const criticalCount = junctions.filter(j => j.score >= 80).length;
  const elevatedCount = junctions.filter(j => j.score >= 50 && j.score < 80).length;

  return (
    <div className="flex h-screen bg-[#0B0F14] text-[#C9D1D9] font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#141A22] p-4 border-r border-gray-800 flex flex-col">
        <div className="flex items-center space-x-3 mb-8">
          <ShieldAlert className="text-[#3D9DF6] w-8 h-8" />
          <h1 className="text-2xl font-bold text-white tracking-wide">RakshaGrid</h1>
        </div>
        <nav className="space-y-2 flex-1">
          <a href="#" className="block py-2 px-4 rounded bg-gray-800 text-[#3D9DF6] border-l-2 border-[#3D9DF6]">Live Dashboard</a>
          <a href="#" className="block py-2 px-4 rounded hover:bg-gray-800/50 transition-colors">Deployments</a>
          <a href="#" className="block py-2 px-4 rounded hover:bg-gray-800/50 transition-colors">Audit Log</a>
        </nav>
        <div className="text-xs text-gray-500 mt-auto">
          Logged in as: Control Room Op
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-[#141A22] p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Live Traffic Risk Map - Nagpur</h2>
          <div className="flex items-center space-x-6">
            <div className="flex space-x-3">
              <span className="px-3 py-1 bg-red-900/30 text-red-400 border border-red-900/50 rounded-full text-sm font-medium flex items-center">
                <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
                Critical: {criticalCount}
              </span>
              <span className="px-3 py-1 bg-yellow-900/30 text-yellow-400 border border-yellow-900/50 rounded-full text-sm font-medium">
                Elevated: {elevatedCount}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400 border-l border-gray-700 pl-6">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium text-white">12/15 Deployed</span>
            </div>
          </div>
        </header>

        {/* Dashboard Panels */}
        <main className="flex-1 p-6 flex gap-6 overflow-hidden">
          {/* Map Section */}
          <div className="flex-1 bg-[#141A22] rounded-lg border border-gray-800 overflow-hidden relative shadow-lg flex flex-col">
             <HeatMap junctions={junctions} onJunctionClick={(id) => console.log('Clicked', id)} />
          </div>
          
          {/* Middle Panel - Ranked List & Incident Console */}
          <div className="w-80 flex flex-col gap-6">
            <div className="flex-1 min-h-0">
              <RankedList junctions={junctions} onJunctionClick={(id) => console.log('Clicked', id)} />
            </div>
            <div className="shrink-0">
              <IncidentConsole junctions={junctions} onIncidentInjected={loadData} />
            </div>
          </div>
          
          {/* Right Panel - Deployments */}
          <div className="w-96 flex flex-col gap-6">
            <DeploymentPanel />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
