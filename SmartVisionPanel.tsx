import React, { useState, useEffect } from 'react';
import {
  Eye,
  Smile,
  AlertCircle,
  Sun,
  Activity,
  Zap,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { AiVisionMetrics } from '../types';
import { aiVisionEngine } from '../lib/aiVision';

export const SmartVisionPanel: React.FC = () => {
  const [metrics, setMetrics] = useState<AiVisionMetrics>({
    emotion: 'smile',
    fatigueScore: 12,
    attentionScore: 96,
    handInFrame: true,
    lightingQuality: 'good',
    gestureQualityScore: 94,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(aiVisionEngine.analyzeFrame(null));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            Smart AI Vision Metrics HUD (Section 8)
          </span>
        </div>
        <span className="text-[10px] bg-[#27272a] text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
          Live Realtime
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Emotion */}
        <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-3 space-y-1">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Emotion</span>
          <div className="text-sm font-extrabold text-white flex items-center space-x-1 capitalize">
            <Smile className="w-4 h-4 text-amber-400" />
            <span>{metrics.emotion}</span>
          </div>
        </div>

        {/* Fatigue */}
        <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-3 space-y-1">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Fatigue Score</span>
          <div className="text-sm font-extrabold text-blue-400">{metrics.fatigueScore}% (Low)</div>
        </div>

        {/* Attention */}
        <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-3 space-y-1">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Attention</span>
          <div className="text-sm font-extrabold text-emerald-400 flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{metrics.attentionScore}%</span>
          </div>
        </div>

        {/* Hand Visibility */}
        <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-3 space-y-1">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Hand Visibility</span>
          <div
            className={`text-xs font-extrabold flex items-center space-x-1 ${
              metrics.handInFrame ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {metrics.handInFrame ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
            <span>{metrics.handInFrame ? 'In Frame' : 'Warning! Raise Hands'}</span>
          </div>
        </div>

        {/* Lighting */}
        <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-3 space-y-1">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Lighting</span>
          <div className="text-sm font-extrabold text-amber-300 flex items-center space-x-1 capitalize">
            <Sun className="w-4 h-4 text-amber-400" />
            <span>{metrics.lightingQuality}</span>
          </div>
        </div>

        {/* Gesture Score */}
        <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-3 space-y-1">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Gesture Score</span>
          <div className="text-sm font-extrabold text-purple-400 flex items-center space-x-1">
            <Activity className="w-4 h-4" />
            <span>{metrics.gestureQualityScore}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
