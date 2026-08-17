import React, { useEffect, useState } from 'react';
import { fetchAuditLogs } from '../../lib/api';
import { X, CheckCircle, XCircle, Edit2, ShieldCheck } from 'lucide-react';

interface AuditLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AuditLog {
  id: string;
  action: string;
  reason: string;
  junction_name: string;
  officer_name: string;
  operator_id: string;
  created_at: string;
}

export const AuditLogDrawer: React.FC<AuditLogDrawerProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadLogs();
    }
  }, [isOpen]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await fetchAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error("Failed to fetch audit logs", err);
    }
    setLoading(false);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'accept': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'reject': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'modify': return <Edit2 className="w-5 h-5 text-yellow-500" />;
      default: return <ShieldCheck className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-96 bg-[#141A22] border-l border-gray-700 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#0B0F14]">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">System Audit Log</h2>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        {loading ? (
          <div className="text-gray-500 text-center py-8">Loading logs...</div>
        ) : logs.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No overrides recorded yet.</div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700/50">
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  {getActionIcon(log.action)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-semibold text-gray-200">
                      Recommendation {log.action}ed
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(log.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mb-2">
                    <span className="text-gray-300 font-medium">{log.officer_name}</span> at <span className="text-gray-300 font-medium">{log.junction_name}</span>
                  </div>
                  <div className="bg-[#141A22] p-2 rounded text-xs text-gray-400 border border-gray-800">
                    <span className="font-semibold text-gray-500">Reason:</span> {log.reason}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
