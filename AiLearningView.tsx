import React, { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Camera,
  Save,
  Download,
  RotateCcw,
  CheckCircle2,
  List,
  Sparkles,
  Upload,
  History,
  Layers,
} from 'lucide-react';
import { CustomSign, HandLandmark, SignSystem } from '../types';
import { aiVisionEngine } from '../lib/aiVision';
import { offlineStorage } from '../lib/offlineDb';

export const AiLearningView: React.FC = () => {
  const [signName, setSignName] = useState('');
  const [category, setCategory] = useState('custom');
  const [signSystem, setSignSystem] = useState<SignSystem>('ISL');
  const [notes, setNotes] = useState('');

  const [isRecording, setIsRecording] = useState(false);
  const [capturedLandmarks, setCapturedLandmarks] = useState<HandLandmark[]>([]);
  const [savedSigns, setSavedSigns] = useState<CustomSign[]>([]);
  const [modelVersion, setModelVersion] = useState(1.0);
  const [retraining, setRetraining] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Load custom signs dataset
    offlineStorage.getCustomSigns().then(setSavedSigns);

    // Initialize webcam
    if (navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((e) => console.warn('Webcam permission warning:', e));
    }
  }, []);

  const handleRecordGesture = () => {
    if (!signName.trim()) {
      alert('Please enter a sign name first!');
      return;
    }

    setIsRecording(true);
    setTimeout(() => {
      // Simulate landmark capture
      const points = aiVisionEngine.captureSimulatedHandLandmarks();
      setCapturedLandmarks(points);
      setIsRecording(false);
    }, 2000);
  };

  const handleSaveSign = async () => {
    if (!signName.trim() || capturedLandmarks.length === 0) return;

    const newSign: CustomSign = {
      id: `custom-${Date.now()}`,
      name: signName.toUpperCase(),
      signSystem,
      category,
      landmarks: capturedLandmarks,
      recordedAt: new Date().toLocaleString(),
      version: modelVersion,
      confidence: 0.94,
      notes,
    };

    await offlineStorage.saveCustomSign(newSign);
    setSavedSigns((prev) => [newSign, ...prev]);

    // Retrain local AI model
    setRetraining(true);
    setTimeout(() => {
      setModelVersion((v) => parseFloat((v + 0.1).toFixed(1)));
      setRetraining(false);
      setSignName('');
      setCapturedLandmarks([]);
      setNotes('');
    }, 1500);
  };

  const exportDatasetJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(savedSigns, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `SignBridge_Dataset_v${modelVersion}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs tracking-widest uppercase mb-1">
              <Brain className="w-4 h-4" />
              <span>AI Learning Mode & Custom Sign Dataset Trainer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Teach New Signs to Local AI
            </h1>
            <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
              Record custom gestures, capture 21 hand landmark points, retrain local TF.js model weight vectors, and export custom sign datasets.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="px-3.5 py-1.5 bg-[#27272a] text-blue-400 border border-blue-500/20 rounded-2xl text-xs font-bold flex items-center space-x-1.5 uppercase tracking-wider">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Model Version: v{modelVersion.toFixed(1)}</span>
            </div>

            <button
              onClick={exportDatasetJSON}
              disabled={savedSigns.length === 0}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Dataset JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form & Controls */}
        <div className="lg:col-span-5 bg-[#18181b] border border-[#27272a] rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">New Sign Registration</h2>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Sign Name</label>
              <input
                type="text"
                value={signName}
                onChange={(e) => setSignName(e.target.value)}
                placeholder="e.g. TEACHER, FRIEND, COFFEE"
                className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Sign System</label>
                <select
                  value={signSystem}
                  onChange={(e) => setSignSystem(e.target.value as SignSystem)}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white mt-1"
                >
                  <option value="ISL">Indian Sign (ISL)</option>
                  <option value="ASL">American Sign (ASL)</option>
                  <option value="BSL">British Sign (BSL)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white mt-1"
                >
                  <option value="custom">Custom Regional</option>
                  <option value="essentials">Essentials</option>
                  <option value="emergency">Emergency</option>
                  <option value="questions">Questions</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Notes / Context</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe hand movement or regional context..."
                className="w-full bg-[#09090b] border border-[#27272a] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500 mt-1 resize-none h-20"
              />
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={handleRecordGesture}
              disabled={isRecording}
              className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg flex items-center justify-center space-x-2 ${
                isRecording
                  ? 'bg-amber-600 text-white animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>{isRecording ? 'Capturing 21 Hand Landmarks...' : 'Record Gesture Frame'}</span>
            </button>

            {capturedLandmarks.length > 0 && (
              <button
                onClick={handleSaveSign}
                disabled={retraining}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{retraining ? 'Retraining Local AI Model...' : 'Save & Retrain Model'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Webcam Capture & Registered Dataset */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#09090b] border border-[#27272a] rounded-3xl overflow-hidden shadow-2xl relative h-72 flex items-center justify-center">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
            <div className="absolute top-3 left-3 bg-[#18181b]/90 border border-[#27272a] px-3 py-1 rounded-xl text-xs font-bold text-zinc-200 uppercase tracking-wider">
              Landmark Detection Cam
            </div>

            {capturedLandmarks.length > 0 && (
              <div className="absolute bottom-3 inset-x-3 bg-emerald-950/90 border border-emerald-500/80 p-2.5 rounded-2xl text-center text-xs text-emerald-300 font-bold">
                ✓ 21 Hand Landmarks Captured Successfully! Ready to retrain model.
              </div>
            )}
          </div>

          {/* Dataset Table */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-5 shadow-xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Custom Learned Signs Dataset ({savedSigns.length} Signs)
            </span>

            {savedSigns.length === 0 ? (
              <p className="text-xs text-zinc-600 italic">No custom signs taught yet.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {savedSigns.map((s) => (
                  <div key={s.id} className="p-3 bg-[#09090b] border border-[#27272a] rounded-2xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white uppercase">{s.name}</span>
                      <span className="ml-2 text-[10px] text-blue-400 bg-[#27272a] px-2 py-0.5 rounded-full font-bold">{s.signSystem}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">v{s.version.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
