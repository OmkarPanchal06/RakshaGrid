import React from 'react';
import { JunctionData } from '../../lib/api';

interface RankedListProps {
  junctions: JunctionData[];
  onJunctionClick: (id: string) => void;
}

export const RankedList: React.FC<RankedListProps> = ({ junctions, onJunctionClick }) => {
  // Sort junctions by risk score descending
  const sortedJunctions = [...junctions].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex-1 flex flex-col h-full overflow-hidden">
      <h3 className="font-semibold mb-4 text-white">Ranked Intersections</h3>
      <div className="overflow-y-auto flex-1 pr-2">
        <ul className="space-y-3">
          {sortedJunctions.map((j) => (
            <li 
              key={j.id}
              onClick={() => onJunctionClick(j.id)}
              className="flex justify-between items-center p-3 bg-gray-700 rounded cursor-pointer hover:bg-gray-600 border-l-4 transition-colors"
              style={{
                borderLeftColor: j.score >= 80 ? '#E74C3C' : j.score >= 50 ? '#F5A623' : '#2ECC71'
              }}
            >
              <div className="flex flex-col">
                <span className="font-medium text-gray-200">{j.name}</span>
                <span className="text-xs text-gray-400 uppercase tracking-wider">{j.coverage_status}</span>
              </div>
              <span className={`font-mono font-bold ${j.score >= 80 ? 'text-red-400' : j.score >= 50 ? 'text-yellow-400' : 'text-green-400'}`}>
                {j.score.toFixed(1)}
              </span>
            </li>
          ))}
          {sortedJunctions.length === 0 && (
            <div className="text-gray-500 text-center py-8">Loading live data...</div>
          )}
        </ul>
      </div>
    </div>
  );
};
