import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SignToSpeechView } from './components/SignToSpeechView';
import { VoiceToSignView } from './components/VoiceToSignView';
import { MultiLangTranslateView } from './components/MultiLangTranslateView';
import { SubtitlesView } from './components/SubtitlesView';
import { VideoCallView } from './components/VideoCallView';
import { EmergencyView } from './components/EmergencyView';
import { AiLearningView } from './components/AiLearningView';
import { SmartVisionPanel } from './components/SmartVisionPanel';
import { AnalyticsView } from './components/AnalyticsView';
import { MobileExportView } from './components/MobileExportView';
import { CloudConfigModal } from './components/CloudConfigModal';
import { AppView, Language } from './types';

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('sign-to-speech');
  const [selectedLang, setSelectedLang] = useState<Language>('hi');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        selectedLang={selectedLang}
        setSelectedLang={setSelectedLang}
        isOnline={isOnline}
        onOpenCloudConfig={() => setIsCloudModalOpen(true)}
      />

      {/* Main Content Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Render View Based on Active Tab */}
        {activeView === 'sign-to-speech' && <SignToSpeechView selectedLang={selectedLang} />}
        {activeView === 'voice-to-sign' && <VoiceToSignView selectedLang={selectedLang} />}
        {activeView === 'multilang' && <MultiLangTranslateView />}
        {activeView === 'subtitles' && <SubtitlesView />}
        {activeView === 'videocall' && <VideoCallView />}
        {activeView === 'emergency' && <EmergencyView selectedLang={selectedLang} />}
        {activeView === 'ai-learning' && <AiLearningView />}
        {activeView === 'analytics' && <AnalyticsView />}
        {activeView === 'mobile-export' && <MobileExportView />}

        {/* Global Smart AI Vision HUD Panel (Visible across main live gesture views) */}
        {(activeView === 'sign-to-speech' || activeView === 'voice-to-sign' || activeView === 'videocall' || activeView === 'subtitles') && (
          <SmartVisionPanel />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#27272a] bg-[#18181b] py-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="flex items-center space-x-1.5">
            <span>© 2026 SignBridge AI.</span>
            <span className="text-white font-bold bg-[#27272a] px-2 py-0.5 rounded-md border border-blue-500/30 text-blue-400">
              Website Developed by Nitin Dubey
            </span>
          </p>
          <div className="flex items-center space-x-4 text-zinc-400">
            <span className="bg-[#27272a] px-2 py-0.5 rounded text-[10px] text-zinc-300 font-mono">ISL • ASL • BSL</span>
            <span className="bg-[#27272a] px-2 py-0.5 rounded text-[10px] text-emerald-400 font-mono border border-emerald-500/20">REAL-TIME CAMERA → SPEECH</span>
            <span className="text-zinc-500">WCAG 2.1 AA</span>
          </div>
        </div>
      </footer>

      {/* Cloud Ready Setup Modal */}
      <CloudConfigModal isOpen={isCloudModalOpen} onClose={() => setIsCloudModalOpen(false)} />
    </div>
  );
}

