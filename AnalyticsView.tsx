import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Cpu,
  Clock,
  Globe2,
  CheckCircle2,
  Target,
  Zap,
} from 'lucide-react';
import { UsageAnalytics } from '../types';

export const AnalyticsView: React.FC = () => {
  const stats: UsageAnalytics = {
    dailyCount: 148,
    weeklyCount: 932,
    monthlyCount: 3840,
    recognitionAccuracy: 96.4,
    translationAccuracy: 97.8,
    mostUsedSigns: [
      { name: 'HELLO', count: 420 },
      { name: 'THANK YOU', count: 310 },
      { name: 'HELP', count: 280 },
      { name: 'HOSPITAL', count: 190 },
      { name: 'WATER', count: 165 },
    ],
    languageStats: [
      { language: 'English', percentage: 45 },
      { language: 'Hindi', percentage: 35 },
      { language: 'Gujarati', percentage: 20 },
    ],
    avgResponseTimeMs: 185,
    modelPerformance: { fps: 30, latencyMs: 12, memoryMb: 48 },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs tracking-widest uppercase mb-1">
              <BarChart3 className="w-4 h-4" />
              <span>SignBridge AI Platform Analytics & AI Performance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Usage, Accuracy & Latency Dashboard
            </h1>
            <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
              Track daily usage metrics, sign recognition accuracy percentages, language distributions, and local AI model latency statistics.
            </p>
          </div>
        </div>
      </div>

      {/* Top Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-bold uppercase tracking-widest">
            <span>Daily Usage</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">{stats.dailyCount} <span className="text-xs text-zinc-400 font-normal">signs</span></div>
          <p className="text-[11px] text-emerald-400 font-medium">↑ +14% vs yesterday</p>
        </div>

        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-bold uppercase tracking-widest">
            <span>Recognition Accuracy</span>
            <Target className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-blue-400">{stats.recognitionAccuracy}%</div>
          <p className="text-[11px] text-zinc-400 font-medium">Verified by ISL Benchmark</p>
        </div>

        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-bold uppercase tracking-widest">
            <span>Translation Accuracy</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-indigo-400">{stats.translationAccuracy}%</div>
          <p className="text-[11px] text-zinc-400 font-medium">Gemini 3.6 Flash Engine</p>
        </div>

        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-bold uppercase tracking-widest">
            <span>Avg Latency</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-purple-400">{stats.avgResponseTimeMs} <span className="text-xs font-normal">ms</span></div>
          <p className="text-[11px] text-purple-300 font-medium">Real-time low latency</p>
        </div>
      </div>

      {/* Main Grid Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most Used Signs */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Most Used Signs Frequency</h2>
          <div className="space-y-3">
            {stats.mostUsedSigns.map((sign) => (
              <div key={sign.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{sign.name}</span>
                  <span className="text-zinc-400 font-mono">{sign.count} times</span>
                </div>
                <div className="w-full h-2 bg-[#09090b] rounded-full overflow-hidden border border-[#27272a]">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(sign.count / 420) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Language Breakdown */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Language Statistics</h2>
          <div className="space-y-4">
            {stats.languageStats.map((lang) => (
              <div key={lang.language} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{lang.language}</span>
                  <span className="text-blue-400 font-bold">{lang.percentage}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#09090b] rounded-full overflow-hidden border border-[#27272a]">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${lang.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Model Performance */}
          <div className="pt-4 border-t border-[#27272a] grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-[#09090b] p-2.5 rounded-2xl border border-[#27272a]">
              <span className="text-zinc-500 block text-[10px] font-bold uppercase tracking-wider">FPS</span>
              <span className="font-bold text-emerald-400">{stats.modelPerformance.fps} FPS</span>
            </div>
            <div className="bg-[#09090b] p-2.5 rounded-2xl border border-[#27272a]">
              <span className="text-zinc-500 block text-[10px] font-bold uppercase tracking-wider">Model Frame</span>
              <span className="font-bold text-blue-400">{stats.modelPerformance.latencyMs} ms</span>
            </div>
            <div className="bg-[#09090b] p-2.5 rounded-2xl border border-[#27272a]">
              <span className="text-zinc-500 block text-[10px] font-bold uppercase tracking-wider">RAM Use</span>
              <span className="font-bold text-indigo-400">{stats.modelPerformance.memoryMb} MB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
