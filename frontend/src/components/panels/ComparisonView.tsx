import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TrendingDown } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

interface ComparisonData {
  baseline_uncovered: number;
  recommended_uncovered: number;
  pct_improvement: number;
}

export const ComparisonView: React.FC = () => {
  const [data, setData] = useState<ComparisonData | null>(null);

  useEffect(() => {
    const fetchComparison = async () => {
      try {
        const res = await axios.get(`${API_BASE}/deployment/comparison`);
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch comparison data", err);
      }
    };
    fetchComparison();
    
    // Poll every 10s to keep it updated with incidents
    const interval = setInterval(fetchComparison, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return null;

  return (
    <div className="absolute top-4 right-4 bg-gray-900/90 backdrop-blur-sm border border-gray-700 p-4 rounded-lg shadow-xl z-[1000] min-w-[300px]">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-gray-300 font-semibold text-sm">High-Risk Coverage Gap</h4>
        <span className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded font-bold flex items-center">
          <TrendingDown className="w-3 h-3 mr-1" />
          {data.pct_improvement}%
        </span>
      </div>
      
      <div className="flex justify-between items-end">
        <div>
          <div className="text-xs text-gray-500 uppercase">Manual Roster</div>
          <div className="text-2xl font-bold text-gray-200">{data.baseline_uncovered} <span className="text-sm font-normal text-gray-500">uncovered</span></div>
        </div>
        
        <div className="text-gray-600 px-2">→</div>
        
        <div className="text-right">
          <div className="text-xs text-blue-400 uppercase font-semibold">RakshaGrid</div>
          <div className="text-2xl font-bold text-blue-400">{data.recommended_uncovered} <span className="text-sm font-normal text-blue-900/50">uncovered</span></div>
        </div>
      </div>
    </div>
  );
};
