import React, { useEffect, useState } from 'react';
import { fetchRecommendedDeployments, overrideDeployment } from '../../lib/api';
import { Check, X, Edit, Loader2 } from 'lucide-react';

interface Recommendation {
  officer_id: string;
  officer_name: string;
  junction_id: string;
  junction_name: string;
  eta_min: number;
  reason: string;
}

export const DeploymentPanel: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const data = await fetchRecommendedDeployments();
      setRecommendations(data);
    } catch (err) {
      console.error("Failed to load recommendations", err);
    }
    setLoading(false);
  };

  const handleAction = async (junctionId: string, officerId: string, action: 'accept' | 'reject') => {
    setActionLoading(junctionId);
    try {
      await overrideDeployment(junctionId, action, `Operator ${action}ed recommendation`, officerId);
      // Remove from list after action
      setRecommendations(prev => prev.filter(r => r.junction_id !== junctionId));
    } catch (err) {
      console.error(`Failed to ${action} deployment`, err);
    }
    setActionLoading(null);
  };

  if (loading) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex-1 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-4" />
        <span className="text-gray-400">Running Allocation Optimizer...</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex-1 flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-white">Recommended Deployments</h3>
        <button 
          onClick={loadRecommendations}
          className="text-xs text-blue-400 hover:text-blue-300"
        >
          Refresh
        </button>
      </div>
      
      <div className="overflow-y-auto flex-1 pr-2 space-y-4">
        {recommendations.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No current recommendations.</div>
        ) : (
          recommendations.map(rec => (
            <div key={rec.junction_id} className="bg-gray-700 p-4 rounded border-l-4 border-blue-500">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-gray-200">{rec.junction_name}</h4>
                  <p className="text-sm text-blue-300 font-medium">Assign: {rec.officer_name} (ETA {rec.eta_min}m)</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-4 bg-gray-800 p-2 rounded">
                <span className="font-semibold text-gray-300">Why:</span> {rec.reason}
              </p>
              
              <div className="flex space-x-2">
                <button
                  disabled={actionLoading === rec.junction_id}
                  onClick={() => handleAction(rec.junction_id, rec.officer_id, 'accept')}
                  className="flex-1 bg-green-600/20 text-green-400 hover:bg-green-600/40 border border-green-700 rounded py-1.5 flex items-center justify-center text-sm transition-colors"
                >
                  <Check className="w-4 h-4 mr-1" /> Accept
                </button>
                <button
                  className="flex-1 bg-gray-600 text-gray-300 hover:bg-gray-500 rounded py-1.5 flex items-center justify-center text-sm transition-colors"
                >
                  <Edit className="w-4 h-4 mr-1" /> Modify
                </button>
                <button
                  disabled={actionLoading === rec.junction_id}
                  onClick={() => handleAction(rec.junction_id, rec.officer_id, 'reject')}
                  className="flex-1 bg-red-600/20 text-red-400 hover:bg-red-600/40 border border-red-800 rounded py-1.5 flex items-center justify-center text-sm transition-colors"
                >
                  <X className="w-4 h-4 mr-1" /> Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
