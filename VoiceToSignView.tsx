import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Gauge,
  Sparkles,
  Volume2,
  Copy,
  Check,
  Globe2,
} from 'lucide-react';
import { Language, SignGesture, SignSystem } from '../types';
import { speechService } from '../lib/speechService';
import { textToSignSequence } from '../lib/signDictionary';
import { AvatarController } from '../lib/threeAvatar';

interface VoiceToSignViewProps {
  selectedLang: Language;
}

export const VoiceToSignView: React.FC<VoiceToSignViewProps> = ({ selectedLang }) => {
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [signSystem, setSignSystem] = useState<SignSystem>('ISL');
  const [signSequence, setSignSequence] = useState<SignGesture[]>([]);
  const [activeSignIndex, setActiveSignIndex] = useState(0);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Avatar ref & controller
  const avatarContainerRef = useRef<HTMLDivElement>(null);
  const avatarControllerRef = useRef<AvatarController | null>(null);

  // Initialize Avatar
  useEffect(() => {
    if (avatarContainerRef.current) {
      avatarControllerRef.current = new AvatarController(
        avatarContainerRef.current,
        (wordIndex) => setActiveSignIndex(wordIndex)
      );
    }

    return () => {
      if (avatarControllerRef.current) {
        avatarControllerRef.current.destroy();
        avatarControllerRef.current = null;
      }
    };
  }, []);

  // Sync speed changes
  useEffect(() => {
    if (avatarControllerRef.current) {
      avatarControllerRef.current.setPlaybackSpeed(playbackSpeed);
    }
  }, [playbackSpeed]);

  // Handle Speech Input
  const toggleListening = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      speechService.startListening(selectedLang, {
        onResult: (text) => {
          setSpokenText(text);
          processTextToSigns(text, signSystem);
        },
        onError: (err) => {
          console.error('Mic Error:', err);
          setIsListening(false);
        },
        onEnd: () => {
          setIsListening(false);
        },
      });
    }
  };

  const processTextToSigns = (text: string, system: SignSystem) => {
    const sequence = textToSignSequence(text, system);
    setSignSequence(sequence);
    setActiveSignIndex(0);

    if (sequence.length > 0 && avatarControllerRef.current) {
      avatarControllerRef.current.setGesture(sequence[0], 0);
      setIsPlaying(true);
    }
  };

  const handleManualInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setSpokenText(text);
    processTextToSigns(text, signSystem);
  };

  const handleSignSystemChange = (system: SignSystem) => {
    setSignSystem(system);
    processTextToSigns(spokenText, system);
  };

  const handlePlayPause = () => {
    if (!avatarControllerRef.current) return;
    if (isPlaying) {
      avatarControllerRef.current.pause();
      setIsPlaying(false);
    } else {
      avatarControllerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleReplay = () => {
    if (!avatarControllerRef.current) return;
    if (signSequence.length > 0) {
      setActiveSignIndex(0);
      avatarControllerRef.current.setGesture(signSequence[0], 0);
      setIsPlaying(true);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(spokenText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs tracking-widest uppercase mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Voice to Sign Language Reverse Translator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Live Voice & Speech to 3D Sign Avatar
            </h1>
            <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
              Capture voice from microphone in English, Hindi, or Gujarati. Auto-translates and streams signs using an animated 3D human avatar or sequential sign cards.
            </p>
          </div>

          {/* Regional Sign System Selector */}
          <div className="flex items-center bg-[#09090b] border border-[#27272a] rounded-2xl p-1.5 self-start md:self-auto">
            <span className="text-xs text-zinc-400 px-2.5 font-bold flex items-center space-x-1.5 uppercase tracking-wider">
              <Globe2 className="w-3.5 h-3.5 text-blue-400" />
              <span>System:</span>
            </span>
            {(['ISL', 'ASL', 'BSL'] as SignSystem[]).map((sys) => (
              <button
                key={sys}
                onClick={() => handleSignSystemChange(sys)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  signSystem === sys ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {sys}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Left Controls & Speech Input | Right 3D Avatar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Voice Input & Controls */}
        <div className="lg:col-span-5 space-y-6">
          {/* Microphone Card */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center space-x-1.5">
                <Mic className="w-4 h-4 text-blue-400" />
                <span>Microphone Speech Input</span>
              </span>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  isListening ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' : 'bg-[#27272a] text-zinc-400'
                }`}
              >
                {isListening ? 'Listening Live...' : 'Mic Standby'}
              </span>
            </div>

            {/* Mic Pulse Button */}
            <div className="flex justify-center py-4">
              <button
                onClick={toggleListening}
                className={`relative group w-24 h-24 rounded-2xl flex items-center justify-center transition-all transform active:scale-95 ${
                  isListening
                    ? 'bg-red-600 text-white shadow-2xl shadow-red-600/50 ring-8 ring-red-600/20'
                    : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-600/30 hover:scale-105'
                }`}
              >
                {isListening ? <MicOff className="w-10 h-10 animate-bounce" /> : <Mic className="w-10 h-10" />}
              </button>
            </div>

            {/* Manual Text Fallback Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Spoken / Typed Text</label>
                {spokenText && (
                  <button onClick={copyText} className="text-xs text-zinc-400 hover:text-white flex items-center space-x-1">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>
              <textarea
                value={spokenText}
                onChange={handleManualInput}
                placeholder="Speak via microphone above, or type text here (e.g. 'Hello how are you thank you help hospital')..."
                className="w-full h-28 bg-[#09090b] border border-[#27272a] rounded-2xl p-3.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            {/* Quick Demo Sentence Buttons */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Quick Test Phrases:</span>
              <div className="flex flex-wrap gap-1.5">
                {['Hello Namaste', 'How are you', 'Thank you', 'Need help hospital', 'Water please'].map((phrase) => (
                  <button
                    key={phrase}
                    onClick={() => {
                      setSpokenText(phrase);
                      processTextToSigns(phrase, signSystem);
                    }}
                    className="px-2.5 py-1 bg-[#27272a] hover:bg-[#3f3f46] text-zinc-300 rounded-xl text-xs font-medium border border-[#3f3f46] transition-colors"
                  >
                    "{phrase}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Animated Human Avatar */}
        <div className="lg:col-span-7 space-y-4">
          <div
            className={`bg-[#18181b] border border-[#27272a] rounded-3xl overflow-hidden shadow-2xl transition-all relative ${
              isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none flex flex-col' : 'h-[500px] flex flex-col'
            }`}
          >
            {/* Avatar Canvas Container */}
            <div ref={avatarContainerRef} className="flex-1 w-full bg-[#09090b] relative overflow-hidden">
              {/* Overlay active sign badge */}
              <div className="absolute top-4 left-4 z-20 bg-[#18181b]/90 backdrop-blur border border-[#27272a] px-3.5 py-1.5 rounded-2xl flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
                <span className="text-xs font-bold text-zinc-200 uppercase tracking-widest">
                  3D {signSystem} Avatar
                </span>
              </div>

              {/* Active word being signed overlay */}
              {signSequence.length > 0 && (
                <div className="absolute top-4 right-4 z-20 bg-blue-600 text-white px-4 py-1.5 rounded-2xl font-extrabold text-sm shadow-lg shadow-blue-600/30 uppercase tracking-widest animate-pulse">
                  {signSequence[activeSignIndex]?.name || 'SIGNING'}
                </div>
              )}

              {/* Fullscreen toggle button */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="absolute bottom-4 right-4 z-20 p-2.5 bg-[#18181b]/90 hover:bg-[#27272a] text-zinc-200 border border-[#27272a] rounded-2xl transition-colors shadow-lg"
                title={isFullscreen ? 'Exit Fullscreen' : 'Full-screen Avatar Mode'}
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
            </div>

            {/* Playback Controls Toolbar */}
            <div className="p-4 bg-[#18181b] border-t border-[#27272a] flex flex-wrap items-center justify-between gap-3">
              {/* Play / Pause / Replay Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePlayPause}
                  className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/30 transition-all font-bold flex items-center space-x-1.5"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span className="text-xs uppercase tracking-wider">{isPlaying ? 'Pause' : 'Play'}</span>
                </button>

                <button
                  onClick={handleReplay}
                  className="p-2.5 bg-[#27272a] hover:bg-[#3f3f46] text-zinc-200 rounded-xl border border-[#3f3f46] transition-colors flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Replay</span>
                </button>
              </div>

              {/* Speed Controller */}
              <div className="flex items-center space-x-2 bg-[#09090b] border border-[#27272a] rounded-xl px-3 py-1.5">
                <Gauge className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Speed:</span>
                {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((s) => (
                  <button
                    key={s}
                    onClick={() => setPlaybackSpeed(s)}
                    className={`px-2 py-0.5 text-xs font-bold rounded-lg transition-all ${
                      playbackSpeed === s ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sequential Sign Visual Cards (Fallback & Step-by-Step Viewer) */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                Sequential Sign Gesture Breakdown ({signSequence.length} Signs)
              </span>
              <span className="text-xs text-blue-400 font-medium">Click card to trigger</span>
            </div>

            {signSequence.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-[#27272a] rounded-2xl text-zinc-500 text-xs">
                Speak or enter text above to view sequential sign breakdown cards.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {signSequence.map((gesture, idx) => {
                  const isActive = idx === activeSignIndex;
                  return (
                    <div
                      key={`${gesture.id}-${idx}`}
                      onClick={() => {
                        setActiveSignIndex(idx);
                        if (avatarControllerRef.current) {
                          avatarControllerRef.current.setGesture(gesture, idx);
                          setIsPlaying(true);
                        }
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/20 scale-105'
                          : 'bg-[#09090b] border-[#27272a] hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-zinc-500">#{idx + 1}</span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-[#27272a] text-blue-400">
                          {gesture.category}
                        </span>
                      </div>

                      <div className="text-sm font-extrabold text-white tracking-wide uppercase mb-1">
                        {gesture.name}
                      </div>

                      {gesture.hindiText && (
                        <p className="text-xs text-indigo-300 font-medium">{gesture.hindiText}</p>
                      )}

                      <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">{gesture.description}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
