import React, { useState } from 'react';
import { injectIncident, JunctionData } from '../../lib/api';
import { AlertTriangle, Car, CloudRain, Shield, AlertCircle } from 'lucide-react';

interface IncidentConsoleProps {
  junctions: JunctionData[];
  onIncidentInjected: () => void;
}

const INCIDENT_TYPES = [
  { id: 'accident', label: 'Accident', icon: <Car className="w-4 h-4" /> },
  { id: 'waterlogging', label: 'Waterlogging', icon: <CloudRain className="w-4 h-4" /> },
  { id: 'vip_movement', label: 'VIP Movement', icon: <Shield className="w-4 h-4" /> },
  { id: 'obstruction', label: 'Obstruction', icon: <AlertTriangle className="w-4 h-4" /> }
];

export const IncidentConsole: React.FC<IncidentConsoleProps> = ({ junctions, onIncidentInjected }) => {
  const [selectedJunction, setSelectedJunction] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('accident');
  const [severity, setSeverity] = useState<number>(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJunction) {
      setError('Please select a junction');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      await injectIncident(selectedJunction, selectedType, severity);
      
      // Reset form
      setSelectedJunction('');
      setSeverity(3);
      
      // Notify parent to refresh data
      onIncidentInjected();
    } catch (err) {
      console.error(err);
      setError('Failed to inject incident. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-red-900/30 flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-amber-500"></div>
      
      <div className="flex items-center mb-4">
        <AlertCircle className="text-red-400 mr-2 w-5 h-5" />
        <h3 className="font-semibold text-white">Incident Injection</h3>
      </div>
      
      {error && <div className="text-red-400 text-sm mb-3">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4 flex-1">
        <div>
          <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Location</label>
          <select 
            value={selectedJunction} 
            onChange={(e) => setSelectedJunction(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded focus:ring-red-500 focus:border-red-500 p-2"
          >
            <option value="">Select a junction...</option>
            {junctions.map(j => (
              <option key={j.id} value={j.id}>{j.name} ({j.zone})</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Incident Type</label>
          <div className="grid grid-cols-2 gap-2">
            {INCIDENT_TYPES.map(type => (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedType(type.id)}
                className={`flex items-center justify-center space-x-2 py-2 px-1 border rounded text-xs transition-colors ${
                  selectedType === type.id 
                    ? 'bg-red-900/40 border-red-500 text-white' 
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {type.icon} <span>{type.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="flex justify-between text-xs text-gray-400 mb-1 uppercase tracking-wider">
            <span>Severity</span>
            <span className="text-red-400 font-bold">{severity}/5</span>
          </label>
          <input 
            type="range" 
            min="1" max="5" 
            value={severity} 
            onChange={(e) => setSeverity(parseInt(e.target.value))}
            className="w-full accent-red-500"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded flex items-center justify-center transition-colors disabled:opacity-50"
        >
          {loading ? 'Simulating...' : 'Inject Incident (Trigger Rescore)'}
        </button>
      </form>
    </div>
  );
};
