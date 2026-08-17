import React, { useEffect, useState } from 'react';
import { fetchJunctionExplain, JunctionData } from '../../lib/api';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';

interface JunctionDetailProps {
  junctionId: string;
  onClose: () => void;
}

interface ExplainData {
  id: string;
  name: string;
  score: number;
  nl_explanation: string;
  factors: Array<{
    name: string;
    contribution: number;
  }>;
}

export const JunctionDetail: React.FC<JunctionDetailProps> = ({ junctionId, onClose }) => {
  const [data, setData] = useState<ExplainData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true);
      try {
        const result = await fetchJunctionExplain(junctionId);
        setData(result);
      } catch (err) {
        console.error("Failed to load junction detail", err);
      }
      setLoading(false);
    };

    if (junctionId) {
      loadDetail();
    }
  }, [junctionId]);

  if (!junctionId) return null;

  return (
    <div className={`fixed inset-y-0 right-0 w-96 bg-[#141A22] border-l border-gray-700 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${junctionId ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Risk Explainability</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {loading ? (
        <div className="p-6 flex-1 flex items-center justify-center text-gray-500">
          Loading AI explanation...
        </div>
      ) : data ? (
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-1">{data.name}</h3>
            <div className="flex items-center space-x-3">
              <span className={`text-2xl font-black ${data.score >= 80 ? 'text-red-500' : data.score >= 50 ? 'text-yellow-500' : 'text-green-500'}`}>
                {data.score.toFixed(1)}
              </span>
              <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Risk Score</span>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-gray-700/50">
            <div className="flex items-start space-x-3">
              <ShieldAlert className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-1">AI Diagnosis</h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {data.nl_explanation}
                </p>
              </div>
            </div>
          </div>

          <h4 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Factor Breakdown</h4>
          <div className="space-y-4">
            {data.factors.sort((a, b) => b.contribution - a.contribution).map((factor, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400 capitalize">{factor.name.replace(/_/g, ' ')}</span>
                  <span className="text-gray-200 font-medium">{factor.contribution.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${idx === 0 ? 'bg-red-500' : idx === 1 ? 'bg-yellow-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min(100, (factor.contribution / 30) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-800">
             <button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark as Reviewed</span>
             </button>
          </div>
        </div>
      ) : (
        <div className="p-6 text-gray-500">Failed to load data.</div>
      )}
    </div>
  );
};
