import React from 'react';

function App() {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="w-64 bg-gray-800 p-4 border-r border-gray-700">
        <h1 className="text-2xl font-bold mb-6 text-blue-400">RakshaGrid</h1>
        <nav className="space-y-2">
          <a href="#" className="block py-2 px-4 rounded bg-gray-700 text-blue-300">Live Dashboard</a>
          <a href="#" className="block py-2 px-4 rounded hover:bg-gray-700">Deployments</a>
          <a href="#" className="block py-2 px-4 rounded hover:bg-gray-700">Audit Log</a>
        </nav>
      </div>
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Live Traffic Risk Map - Nagpur</h2>
          <div className="flex space-x-4">
            <span className="px-3 py-1 bg-red-900/50 text-red-400 rounded-full text-sm">Critical: 2</span>
            <span className="px-3 py-1 bg-yellow-900/50 text-yellow-400 rounded-full text-sm">Elevated: 5</span>
          </div>
        </header>
        <main className="flex-1 p-6 flex gap-6">
          <div className="flex-1 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden relative">
             <div className="absolute inset-0 flex items-center justify-center text-gray-500">
               Map Placeholder
             </div>
          </div>
          <div className="w-96 flex flex-col gap-6">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex-1">
              <h3 className="font-semibold mb-4">Ranked Intersections</h3>
              <ul className="space-y-3">
                <li className="flex justify-between items-center p-3 bg-gray-700 rounded cursor-pointer hover:bg-gray-600">
                  <span>Sitabuldi Square</span>
                  <span className="text-red-400 font-mono">85</span>
                </li>
                <li className="flex justify-between items-center p-3 bg-gray-700 rounded cursor-pointer hover:bg-gray-600">
                  <span>Sadar Bazar</span>
                  <span className="text-red-400 font-mono">78</span>
                </li>
                <li className="flex justify-between items-center p-3 bg-gray-700 rounded cursor-pointer hover:bg-gray-600">
                  <span>Dharampeth</span>
                  <span className="text-yellow-400 font-mono">62</span>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
