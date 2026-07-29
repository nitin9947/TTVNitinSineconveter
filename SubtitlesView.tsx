import React, { useState, useEffect } from 'react';
import {
  Subtitles,
  Mic,
  Camera,
  Download,
  FileText,
  FileCode,
  FileSpreadsheet,
  Settings2,
  Trash2,
  Check,
  Play,
  Square,
  Sparkles,
} from 'lucide-react';
import { Language, SubtitleItem, SubtitleStyle } from '../types';
import { speechService } from '../lib/speechService';
import { offlineStorage } from '../lib/offlineDb';

export const SubtitlesView: React.FC = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [streamSource, setStreamSource] = useState<'mic' | 'webcam' | 'speaker'>('mic');
  const [primaryLang, setPrimaryLang] = useState<Language>('en');
  const [secondaryLang, setSecondaryLang] = useState<Language | 'none'>('hi');

  const [subtitleStyle, setSubtitleStyle] = useState<SubtitleStyle>({
    textColor: 'yellow',
    bgColor: 'black',
    fontSize: 'lg',
    showSignIcons: true,
  });

  const [subtitles, setSubtitles] = useState<SubtitleItem[]>([
    {
      id: 'sub-1',
      timestamp: '00:00:04',
      speaker: 'Speaker 1',
      text: 'Welcome everyone to today’s accessible communication conference.',
      translatedText: 'आज के सुलभ संचार सम्मेलन में आप सभी का स्वागत है।',
      confidence: 0.98,
      language: 'en',
    },
    {
      id: 'sub-2',
      timestamp: '00:00:09',
      speaker: 'Deaf Participant',
      text: 'I am using SignBridge AI for live subtitle generation.',
      translatedText: 'मैं लाइव उपशीर्षक निर्माण के लिए साइनब्रिज एआई का उपयोग कर रहा हूं।',
      confidence: 0.95,
      language: 'en',
    },
  ]);

  useEffect(() => {
    // Load historical transcripts from IndexedDB
    offlineStorage.getSubtitleHistory().then((history) => {
      if (history.length > 0) {
        setSubtitles((prev) => [...prev, ...history]);
      }
    });
  }, []);

  const toggleCapture = () => {
    if (isCapturing) {
      speechService.stopListening();
      setIsCapturing(false);
    } else {
      setIsCapturing(true);
      speechService.startListening(primaryLang, {
        onResult: async (text, isFinal) => {
          if (!text.trim()) return;

          const time = new Date().toTimeString().split(' ')[0];
          let translatedText = '';

          // Dual language translation
          if (secondaryLang !== 'none') {
            try {
              const res = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  text,
                  sourceLang: primaryLang,
                  targetLang: secondaryLang,
                }),
              });
              const data = await res.json();
              translatedText = data.translatedText || '';
            } catch (e) {
              translatedText = text;
            }
          }

          const newItem: SubtitleItem = {
            id: `sub-${Date.now()}`,
            timestamp: time,
            speaker: streamSource === 'mic' ? 'Live Mic' : streamSource === 'webcam' ? 'Sign Webcam' : 'Audio Speaker',
            text,
            translatedText,
            confidence: 0.96,
            language: primaryLang,
          };

          setSubtitles((prev) => [...prev, newItem]);
          if (isFinal) {
            offlineStorage.saveSubtitleItem(newItem);
          }
        },
        onError: (err) => {
          console.error('Subtitle Capture Error:', err);
          setIsCapturing(false);
        },
        onEnd: () => {
          setIsCapturing(false);
        },
      });
    }
  };

  const clearSubtitles = () => {
    setSubtitles([]);
  };

  // EXPORT FUNCTIONS
  const exportAsTXT = () => {
    const textContent = subtitles
      .map((s) => `[${s.timestamp}] ${s.speaker}: ${s.text} ${s.translatedText ? `(${s.translatedText})` : ''}`)
      .join('\n');
    downloadFile(textContent, 'SignBridge_Subtitles.txt', 'text/plain');
  };

  const exportAsSRT = () => {
    const srtContent = subtitles
      .map((s, i) => {
        const start = s.timestamp + ',000';
        const end = s.timestamp + ',500';
        return `${i + 1}\n${start} --> ${end}\n${s.text}\n${s.translatedText || ''}\n`;
      })
      .join('\n');
    downloadFile(srtContent, 'SignBridge_Subtitles.srt', 'text/plain');
  };

  const exportAsPDF = () => {
    // Printable PDF html window generator
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>SignBridge AI Live Subtitle Transcript</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; color: #1e293b; }
            h1 { color: #2563eb; }
            .item { margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #e2e8f0; }
            .time { font-size: 12px; color: #64748b; font-weight: bold; }
            .speaker { font-weight: bold; color: #0f172a; }
            .text { font-size: 16px; margin-top: 4px; }
            .trans { font-size: 14px; color: #475569; font-style: italic; }
          </style>
        </head>
        <body>
          <h1>SignBridge AI Live Subtitle Transcript</h1>
          <p>Generated on ${new Date().toLocaleString()}</p>
          <hr />
          ${subtitles
            .map(
              (s) => `
            <div className="item">
              <span className="time">[${s.timestamp}]</span> <span className="speaker">${s.speaker}</span>
              <div className="text">${s.text}</div>
              ${s.translatedText ? `<div className="trans">${s.translatedText}</div>` : ''}
            </div>
          `
            )
            .join('')}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs tracking-widest uppercase mb-1">
              <Subtitles className="w-4 h-4" />
              <span>Real-Time Multi-Stream Subtitle Generator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Live Subtitle Studio & Export
            </h1>
            <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
              Generate real-time dual-language subtitles from mic, webcam sign stream, or system audio. Customize font styles and export to TXT, SRT, or PDF.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleCapture}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all shadow-lg flex items-center space-x-2 ${
                isCapturing
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30 animate-pulse'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
              }`}
            >
              {isCapturing ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isCapturing ? 'Stop Capturing' : 'Start Live Subtitles'}</span>
            </button>

            <button
              onClick={clearSubtitles}
              className="p-2.5 bg-[#27272a] hover:bg-[#3f3f46] text-zinc-300 border border-[#3f3f46] rounded-xl transition-colors"
              title="Clear Transcript"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Settings Bar */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-5 shadow-lg grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stream Source */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Stream Input Source</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'mic', label: 'Mic', icon: <Mic className="w-3.5 h-3.5" /> },
              { id: 'webcam', label: 'Webcam Sign', icon: <Camera className="w-3.5 h-3.5" /> },
              { id: 'speaker', label: 'Speaker', icon: <Subtitles className="w-3.5 h-3.5" /> },
            ].map((src) => (
              <button
                key={src.id}
                onClick={() => setStreamSource(src.id as any)}
                className={`p-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1 border transition-all ${
                  streamSource === src.id
                    ? 'bg-blue-600 text-white border-blue-500 shadow'
                    : 'bg-[#09090b] border-[#27272a] text-zinc-400 hover:text-white'
                }`}
              >
                {src.icon}
                <span>{src.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dual Language Subtitle Options */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Dual Language Setup</label>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={primaryLang}
              onChange={(e) => setPrimaryLang(e.target.value as Language)}
              className="bg-[#09090b] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="en">Primary: English</option>
              <option value="hi">Primary: Hindi</option>
              <option value="gu">Primary: Gujarati</option>
            </select>

            <select
              value={secondaryLang}
              onChange={(e) => setSecondaryLang(e.target.value as any)}
              className="bg-[#09090b] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="none">Secondary: None</option>
              <option value="hi">Secondary: Hindi</option>
              <option value="gu">Secondary: Gujarati</option>
              <option value="en">Secondary: English</option>
            </select>
          </div>
        </div>

        {/* Subtitle Style Customizer */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-between">
            <span>Style Customizer</span>
            <Settings2 className="w-3.5 h-3.5 text-blue-400" />
          </label>
          <div className="flex items-center space-x-2">
            {/* Text Color */}
            <select
              value={subtitleStyle.textColor}
              onChange={(e) => setSubtitleStyle({ ...subtitleStyle, textColor: e.target.value as any })}
              className="bg-[#09090b] border border-[#27272a] rounded-xl px-2.5 py-2 text-xs text-white flex-1"
            >
              <option value="yellow">Yellow Text</option>
              <option value="white">White Text</option>
              <option value="cyan">Cyan Text</option>
              <option value="green">Green Text</option>
            </select>

            {/* Background */}
            <select
              value={subtitleStyle.bgColor}
              onChange={(e) => setSubtitleStyle({ ...subtitleStyle, bgColor: e.target.value as any })}
              className="bg-[#09090b] border border-[#27272a] rounded-xl px-2.5 py-2 text-xs text-white flex-1"
            >
              <option value="black">Black BG</option>
              <option value="dark-blue">Dark Blue BG</option>
              <option value="transparent">Transparent BG</option>
            </select>

            {/* Font Size */}
            <select
              value={subtitleStyle.fontSize}
              onChange={(e) => setSubtitleStyle({ ...subtitleStyle, fontSize: e.target.value as any })}
              className="bg-[#09090b] border border-[#27272a] rounded-xl px-2.5 py-2 text-xs text-white flex-1"
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
              <option value="xl">XL Font</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Live Subtitle Display Box */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Live Subtitle Preview Box ({subtitles.length} lines)
            </span>
          </div>

          {/* Export Actions */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider hidden sm:inline">Export:</span>
            <button
              onClick={exportAsTXT}
              className="px-3 py-1.5 bg-[#27272a] hover:bg-[#3f3f46] text-zinc-200 rounded-xl text-xs font-bold border border-[#3f3f46] transition-colors flex items-center space-x-1"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>TXT</span>
            </button>
            <button
              onClick={exportAsSRT}
              className="px-3 py-1.5 bg-[#27272a] hover:bg-[#3f3f46] text-zinc-200 rounded-xl text-xs font-bold border border-[#3f3f46] transition-colors flex items-center space-x-1"
            >
              <FileCode className="w-3.5 h-3.5 text-indigo-400" />
              <span>SRT</span>
            </button>
            <button
              onClick={exportAsPDF}
              className="px-3 py-1.5 bg-[#27272a] hover:bg-[#3f3f46] text-zinc-200 rounded-xl text-xs font-bold border border-[#3f3f46] transition-colors flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5 text-purple-400" />
              <span>PDF</span>
            </button>
          </div>
        </div>

        {/* Subtitle Teleprompter Area */}
        <div className="w-full h-80 bg-[#09090b] border border-[#27272a] rounded-2xl p-6 overflow-y-auto space-y-4 flex flex-col justify-end">
          {subtitles.length === 0 ? (
            <div className="text-center py-12 text-zinc-600 italic text-sm">
              Press "Start Live Subtitles" above to stream real-time speech and sign translation subtitles...
            </div>
          ) : (
            subtitles.map((sub) => {
              // Styling calculations
              const textColorClass =
                subtitleStyle.textColor === 'yellow'
                  ? 'text-yellow-300'
                  : subtitleStyle.textColor === 'white'
                  ? 'text-white'
                  : subtitleStyle.textColor === 'cyan'
                  ? 'text-cyan-300'
                  : 'text-emerald-300';

              const bgColorClass =
                subtitleStyle.bgColor === 'black'
                  ? 'bg-black/90 border-black'
                  : subtitleStyle.bgColor === 'dark-blue'
                  ? 'bg-[#18181b] border-[#27272a]'
                  : 'bg-transparent border-transparent';

              const fontSizeClass =
                subtitleStyle.fontSize === 'sm'
                  ? 'text-sm'
                  : subtitleStyle.fontSize === 'md'
                  ? 'text-base'
                  : subtitleStyle.fontSize === 'lg'
                  ? 'text-lg'
                  : 'text-2xl font-bold';

              return (
                <div
                  key={sub.id}
                  className={`p-4 rounded-2xl border backdrop-blur transition-all ${bgColorClass} shadow-lg`}
                >
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                    <span className="font-bold text-blue-400">[{sub.timestamp}] {sub.speaker}</span>
                    <span className="text-[10px] bg-[#27272a] text-zinc-300 px-2 py-0.5 rounded-full font-mono">
                      Confidence: {Math.round(sub.confidence * 100)}%
                    </span>
                  </div>

                  <p className={`${textColorClass} ${fontSizeClass} tracking-wide leading-relaxed font-sans`}>
                    {sub.text}
                  </p>

                  {sub.translatedText && (
                    <p className="text-zinc-300 text-xs sm:text-sm font-medium mt-1.5 italic border-t border-[#27272a] pt-1.5">
                      {sub.translatedText}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
