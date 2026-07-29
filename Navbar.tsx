import React from 'react';
import {
  Camera,
  Mic,
  Languages,
  Subtitles,
  Video,
  AlertTriangle,
  Brain,
  BarChart3,
  Smartphone,
  Cloud,
  Wifi,
  WifiOff,
  Code2,
} from 'lucide-react';
import { AppView, Language } from '../types';

interface NavbarProps {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  selectedLang: Language;
  setSelectedLang: (lang: Language) => void;
  isOnline: boolean;
  onOpenCloudConfig: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  selectedLang,
  setSelectedLang,
  isOnline,
  onOpenCloudConfig,
}) => {
  const navItems: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: 'sign-to-speech', label: 'Camera → Speech', icon: <Camera className="w-4 h-4 text-emerald-400" /> },
    { id: 'voice-to-sign', label: 'Voice to Sign', icon: <Mic className="w-4 h-4" /> },
    { id: 'multilang', label: 'Multilingual', icon: <Languages className="w-4 h-4" /> },
    { id: 'subtitles', label: 'Subtitles', icon: <Subtitles className="w-4 h-4" /> },
    { id: 'videocall', label: 'Video Call', icon: <Video className="w-4 h-4" /> },
    { id: 'emergency', label: 'Emergency SOS', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'ai-learning', label: 'AI Learning', icon: <Brain className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'mobile-export', label: 'Mobile & Code', icon: <Smartphone className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-[#18181b] border-b border-[#27272a] text-[#fafafa] sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Creator Badge */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveView('sign-to-speech')}>
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20">
              🤟
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  SIGN<span className="text-blue-500">AI</span>
                </span>
                <span className="text-[10px] font-bold tracking-widest bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded-md uppercase">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:flex items-center space-x-1">
                <span>Dev:</span>
                <strong className="text-blue-400 font-semibold">Nitin Dubey</strong>
              </p>
            </div>
          </div>

          {/* Quick Actions & Status */}
          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <div className="flex items-center bg-[#27272a] border border-[#27272a] rounded-xl p-1">
              <button
                onClick={() => setSelectedLang('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  selectedLang === 'en' ? 'bg-blue-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setSelectedLang('hi')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  selectedLang === 'hi' ? 'bg-blue-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setSelectedLang('gu')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  selectedLang === 'gu' ? 'bg-blue-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                }`}
              >
                ગુજરાતી
              </button>
            </div>

            {/* Offline Badge */}
            <div
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                isOnline
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}
              title={isOnline ? 'Connected to Cloud AI' : 'Offline AI Mode Active (TF.js + Local Cache)'}
            >
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span className="hidden md:inline font-mono uppercase text-[11px]">{isOnline ? 'Online Engine' : 'Offline AI'}</span>
            </div>

            {/* Cloud Setup Button */}
            <button
              onClick={onOpenCloudConfig}
              className="p-2 bg-[#27272a] hover:bg-[#3f3f46] text-zinc-300 border border-[#3f3f46] rounded-xl text-xs font-medium transition-colors flex items-center space-x-1"
              title="Cloud Ready Setup"
            >
              <Cloud className="w-4 h-4 text-indigo-400" />
            </button>

            {/* Quick Emergency SOS Header Button */}
            <button
              onClick={() => setActiveView('emergency')}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-red-600/30 animate-pulse flex items-center space-x-1.5 uppercase tracking-wider"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>SOS</span>
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex space-x-1 overflow-x-auto py-2 no-scrollbar border-t border-[#27272a]">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            const isEmergency = item.id === 'emergency';

            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all uppercase tracking-wider ${
                  isActive
                    ? isEmergency
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                      : 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : isEmergency
                    ? 'text-red-400 hover:bg-red-950/40 border border-red-900/40'
                    : 'text-zinc-400 hover:text-white hover:bg-[#27272a]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
