
import React, { useEffect, useState } from 'react';
import { History, Search, Clock, Info, User as UserIcon } from 'lucide-react';
import { mockApiService } from '../services/api';
import { AuditLog } from '../types';

const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      const data = await mockApiService.getAuditLogs();
      setLogs(data);
      setLoading(false);
    };
    loadLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Audit Logs</h1>
          <p className="text-slate-500">Security history and administrative activity trail</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
             <div className="animate-spin h-8 w-8 border-b-2 border-indigo-600 mx-auto rounded-full"></div>
          </div>
        ) : logs.length > 0 ? (
          <div className="divide-y divide-slate-50">
            {logs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4">
                <div className={`mt-1 p-2 rounded-lg ${
                  log.action.includes('DELETE') ? 'bg-red-50 text-red-600' :
                  log.action.includes('CREATE') ? 'bg-emerald-50 text-emerald-600' :
                  'bg-indigo-50 text-indigo-600'
                }`}>
                  <History className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-slate-900 text-sm">{log.action}</p>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" /> {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{log.details}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-500 rounded flex items-center gap-1">
                      <UserIcon className="w-3 h-3" /> By: {log.performedBy}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-500 rounded flex items-center gap-1">
                      <Info className="w-3 h-3" /> Target ID: {log.targetId}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400">
            <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No activity recorded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAuditLogs;
