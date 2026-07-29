import React, { useState } from 'react';
import {
  Languages,
  ArrowRightLeft,
  Volume2,
  Copy,
  Check,
  Mic,
  Sparkles,
  Bot,
  Hand,
} from 'lucide-react';
import { Language, SignGesture, SignSystem } from '../types';
import { speechService } from '../lib/speechService';
import { textToSignSequence } from '../lib/signDictionary';

export const MultiLangTranslateView: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [sourceLang, setSourceLang] = useState<Language | 'auto'>('auto');
  const [targetLang, setTargetLang] = useState<Language>('hi');
  const [signSystem, setSignSystem] = useState<SignSystem>('ISL');

  const [translatedText, setTranslatedText] = useState('');
  const [detectedLang, setDetectedLang] = useState<string>('');
  const [signSequence, setSignSequence] = useState<SignGesture[]>([]);
  const [culturalNote, setCulturalNote] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTranslate = async (text: string = inputText) => {
    if (!text.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          sourceLang,
          targetLang,
          signSystem,
        }),
      });

      const data = await res.json();
      setTranslatedText(data.translatedText || text);
      setDetectedLang(data.detectedLanguage || 'English');
      setCulturalNote(data.culturalNote || '');

      // Convert translated or source text to sign sequence
      const seq = textToSignSequence(data.translatedText || text, signSystem);
      setSignSequence(seq);
    } catch (err) {
      console.error('Translation error:', err);
      // Client offline fallback
      setTranslatedText(text);
      setDetectedLang('English');
      const seq = textToSignSequence(text, signSystem);
      setSignSequence(seq);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    if (sourceLang === 'auto') {
      setSourceLang(targetLang);
      setTargetLang('en');
    } else {
      const prevSource = sourceLang;
      setSourceLang(targetLang);
      setTargetLang(prevSource);
    }
    // Swap text if translation exists
    if (translatedText) {
      setInputText(translatedText);
      setTranslatedText(inputText);
    }
  };

  const speakOutput = () => {
    if (translatedText) {
      speechService.speak(translatedText, targetLang);
    }
  };

  const copyTranslation = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs tracking-widest uppercase mb-1">
              <Languages className="w-4 h-4" />
              <span>Multilingual Text, Speech & Sign Language Translator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              English • Hindi • Gujarati Bridge
            </h1>
            <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
              Bidirectional real-time translation with automatic language detection, spoken voice output, and Indian Sign Language (ISL) conversion.
            </p>
          </div>
        </div>
      </div>

      {/* Language Matrix Toolbar */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-4">
        {/* Source Language Picker */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">From:</span>
          <div className="flex bg-[#09090b] border border-[#27272a] rounded-2xl p-1">
            {[
              { id: 'auto', label: 'Auto Detect' },
              { id: 'en', label: 'English' },
              { id: 'hi', label: 'Hindi (हिंदी)' },
              { id: 'gu', label: 'Gujarati (ગુજરાતી)' },
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => setSourceLang(lang.id as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  sourceLang === lang.id ? 'bg-blue-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Swap Button */}
        <button
          onClick={handleSwapLanguages}
          className="p-2.5 bg-[#27272a] hover:bg-[#3f3f46] text-zinc-200 border border-[#3f3f46] rounded-xl transition-colors shadow"
          title="Swap Languages"
        >
          <ArrowRightLeft className="w-4 h-4" />
        </button>

        {/* Target Language Picker */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">To:</span>
          <div className="flex bg-[#09090b] border border-[#27272a] rounded-2xl p-1">
            {[
              { id: 'en', label: 'English' },
              { id: 'hi', label: 'Hindi (हिंदी)' },
              { id: 'gu', label: 'Gujarati (ગુજરાતી)' },
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => setTargetLang(lang.id as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  targetLang === lang.id ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Translation Dual Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Text Box */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Original Input Text</label>
            {detectedLang && (
              <span className="text-xs font-semibold px-3 py-0.5 rounded-full bg-[#27272a] text-blue-400 border border-blue-500/20">
                Detected: {detectedLang}
              </span>
            )}
          </div>

          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              handleTranslate(e.target.value);
            }}
            placeholder="Enter text in English, Hindi, or Gujarati to translate..."
            className="w-full h-44 bg-[#09090b] border border-[#27272a] rounded-2xl p-4 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"
          />

          <div className="flex justify-end">
            <button
              onClick={() => handleTranslate()}
              disabled={isLoading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? 'Translating...' : 'Translate Now'}</span>
            </button>
          </div>
        </div>

        {/* Output Translated Box */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
              Translated Output ({targetLang.toUpperCase()})
            </label>

            <div className="flex items-center space-x-2">
              <button
                onClick={speakOutput}
                disabled={!translatedText}
                className="p-2 bg-[#27272a] hover:bg-[#3f3f46] text-zinc-200 rounded-xl text-xs transition-colors flex items-center space-x-1 font-semibold"
                title="Speak Output Voice"
              >
                <Volume2 className="w-4 h-4 text-blue-400" />
                <span>Listen</span>
              </button>

              <button
                onClick={copyTranslation}
                disabled={!translatedText}
                className="p-2 bg-[#27272a] hover:bg-[#3f3f46] text-zinc-200 rounded-xl text-xs transition-colors flex items-center space-x-1 font-semibold"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="w-full h-44 bg-[#09090b] border border-[#27272a] rounded-2xl p-4 text-base text-zinc-100 overflow-y-auto">
            {translatedText ? (
              <p className="leading-relaxed">{translatedText}</p>
            ) : (
              <span className="text-zinc-600 italic">Translation output will appear here...</span>
            )}
          </div>

          {culturalNote && (
            <div className="p-3.5 bg-indigo-950/30 border border-indigo-800/40 rounded-2xl text-xs text-indigo-300 flex items-start space-x-2">
              <Bot className="w-4 h-4 shrink-0 mt-0.5 text-indigo-400" />
              <span>{culturalNote}</span>
            </div>
          )}
        </div>
      </div>

      {/* Translated Sign Language Sequence Preview */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center space-x-2">
          <Hand className="w-5 h-5 text-blue-400" />
          <h2 className="text-base font-extrabold text-white">Corresponding Sign Language Sequence ({signSystem})</h2>
        </div>

        {signSequence.length === 0 ? (
          <p className="text-xs text-zinc-500 italic">Enter text above to preview converted sign gestures.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {signSequence.map((gesture, idx) => (
              <div key={`${gesture.id}-${idx}`} className="p-3.5 bg-[#09090b] border border-[#27272a] rounded-2xl space-y-1">
                <span className="text-[10px] text-blue-400 font-bold uppercase">Sign #{idx + 1}</span>
                <div className="text-sm font-extrabold text-white uppercase">{gesture.name}</div>
                <p className="text-[11px] text-zinc-400 line-clamp-2">{gesture.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
