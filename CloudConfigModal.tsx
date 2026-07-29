import React, { useState } from 'react';
import { Cloud, Check, ShieldCheck, Database, Lock, RefreshCw, X } from 'lucide-react';

interface CloudConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CloudConfigModal: React.FC<CloudConfigModalProps> = ({ isOpen, onClose }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [synced, setSynced] = useState(true);

  if (!isOpen) return null;

  const triggerCloudSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSynced(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#18181b] border border-[#27272a] rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-3 bg-[#27272a] text-blue-400 border border-blue-500/20 rounded-2xl">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">Cloud Ready Engine & Sync</h2>
            <p className="text-xs text-zinc-400">Firebase Firestore, Auth & Personal Dictionary Backup</p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 bg-[#09090b] border border-[#27272a] rounded-2xl flex items-center justify-between">
            <span className="text-zinc-300 font-bold uppercase tracking-wider text-[11px]">Firestore Database Sync</span>
            <span className="text-emerald-400 font-bold flex items-center space-x-1 uppercase text-[10px] tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Ready</span>
            </span>
          </div>

          <div className="p-3.5 bg-[#09090b] border border-[#27272a] rounded-2xl flex items-center justify-between">
            <span className="text-zinc-300 font-bold uppercase tracking-wider text-[11px]">Firebase Authentication</span>
            <span className="text-emerald-400 font-bold flex items-center space-x-1 uppercase text-[10px] tracking-wider">
              <Lock className="w-4 h-4" />
              <span>Secure</span>
            </span>
          </div>

          <div className="p-3.5 bg-[#09090b] border border-[#27272a] rounded-2xl flex items-center justify-between">
            <span className="text-zinc-300 font-bold uppercase tracking-wider text-[11px]">Personal Dictionary Cloud Backup</span>
            <span className="text-blue-400 font-bold uppercase text-[10px] tracking-wider">Auto-Sync On</span>
          </div>
        </div>

        <div className="pt-2 flex justify-end space-x-3">
          <button
            onClick={triggerCloudSync}
            disabled={isSyncing}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing to Cloud...' : 'Sync Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
