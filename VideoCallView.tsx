import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  MessageSquare,
  Subtitles,
  Hand,
  Volume2,
  PhoneOff,
  Settings,
  Users,
  Shield,
  Wifi,
  History,
  Send,
  Sparkles,
  Maximize,
  Minimize,
} from 'lucide-react';
import { Language, VideoCallState } from '../types';
import { speechService } from '../lib/speechService';

export const VideoCallView: React.FC = () => {
  const [callState, setCallState] = useState<VideoCallState>({
    isCallActive: true,
    isCameraOn: true,
    isMicOn: true,
    isScreenSharing: false,
    isPiP: false,
    noiseSuppression: true,
    echoCancellation: true,
    lowBandwidth: false,
    dualSubtitles: true,
    signDetection: true,
    remoteParticipantName: 'Dr. Nitin Sharma (Speech Therapist)',
  });

  const [chatMessages, setChatMessages] = useState<
    { sender: string; text: string; time: string; signTranslation?: string }[]
  >([
    {
      sender: 'Dr. Nitin Sharma',
      text: 'Hello! I can see your sign gestures clearly.',
      time: '10:14 AM',
      signTranslation: 'HELLO SEE SIGN CLEAR',
    },
    {
      sender: 'You (SignBridge AI)',
      text: 'Thank you doctor, I am using live voice translation.',
      time: '10:15 AM',
      signTranslation: 'THANK YOU DOCTOR USE LIVE VOICE',
    },
  ]);

  const [inputMsg, setInputMsg] = useState('');
  const [liveSubtitle, setLiveSubtitle] = useState('Dr. Nitin: "Let us start the sign therapy session today."');

  // Video element refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Initialize camera stream
  useEffect(() => {
    if (callState.isCallActive && callState.isCameraOn) {
      navigator.mediaDevices
        ?.getUserMedia({
          video: true,
          audio: {
            echoCancellation: callState.echoCancellation,
            noiseSuppression: callState.noiseSuppression,
          },
        })
        .then((stream) => {
          mediaStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.warn('Camera stream permission warning:', err);
        });
    }

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [callState.isCameraOn, callState.isCallActive, callState.echoCancellation, callState.noiseSuppression]);

  const toggleCamera = () => {
    setCallState((prev) => ({ ...prev, isCameraOn: !prev.isCameraOn }));
  };

  const toggleMic = () => {
    setCallState((prev) => ({ ...prev, isMicOn: !prev.isMicOn }));
  };

  const handleScreenShare = async () => {
    if (!callState.isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        setCallState((prev) => ({ ...prev, isScreenSharing: true }));
      } catch (err) {
        console.warn('Screen share cancelled');
      }
    } else {
      if (mediaStreamRef.current && localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStreamRef.current;
      }
      setCallState((prev) => ({ ...prev, isScreenSharing: false }));
    }
  };

  const sendMessage = () => {
    if (!inputMsg.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [
      ...prev,
      {
        sender: 'You (SignBridge AI)',
        text: inputMsg,
        time,
        signTranslation: inputMsg.toUpperCase().split(' ').join(' '),
      },
    ]);
    setInputMsg('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs tracking-widest uppercase mb-1">
            <Video className="w-4 h-4" />
            <span>Accessible Video Call Mode</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sign & Speech Video Call Room
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Real-time dual subtitles, PiP camera, sign gesture recognition overlays, and noise-suppression audio.
          </p>
        </div>

        {/* Room Status Badges */}
        <div className="flex items-center space-x-2">
          <div className="px-3 py-1.5 bg-[#27272a] text-emerald-400 border border-emerald-500/20 rounded-2xl text-xs font-bold flex items-center space-x-2 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Encrypted Room</span>
          </div>

          <button
            onClick={() => setCallState((prev) => ({ ...prev, lowBandwidth: !prev.lowBandwidth }))}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold border transition-all uppercase tracking-wider ${
              callState.lowBandwidth
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-[#27272a] text-zinc-300 border-[#3f3f46]'
            }`}
          >
            {callState.lowBandwidth ? 'Low Bandwidth ON' : 'Standard HD'}
          </button>
        </div>
      </div>

      {/* Main Video Call Stage & Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Primary Video Feed */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#09090b] border border-[#27272a] rounded-3xl overflow-hidden shadow-2xl relative h-[480px] flex items-center justify-center">
            {/* Remote Participant Primary Video Feed (Simulated / Active) */}
            <div className="absolute inset-0 bg-[#18181b] flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="w-24 h-24 rounded-2xl bg-blue-600 mx-auto flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                  NS
                </div>
                <div className="text-sm font-bold text-zinc-200">{callState.remoteParticipantName}</div>
                <span className="text-xs text-blue-400 font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#27272a] border border-blue-500/20">
                  Speaking (English)
                </span>
              </div>
            </div>

            {/* Picture-in-Picture Local Self Camera Feed */}
            <div
              className={`absolute top-4 right-4 z-30 w-44 h-32 bg-[#09090b] border-2 border-blue-500/80 rounded-2xl overflow-hidden shadow-2xl transition-all ${
                callState.isPiP ? 'w-64 h-48' : ''
              }`}
            >
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
              <div className="absolute bottom-1.5 left-2 text-[10px] text-white bg-[#18181b]/90 px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider border border-[#27272a]">
                You (Sign Cam)
              </div>
            </div>

            {/* Real-time Subtitle Overlay directly on Video */}
            {callState.dualSubtitles && (
              <div className="absolute bottom-16 inset-x-6 z-20 bg-[#09090b]/90 backdrop-blur-md border border-[#27272a] p-3.5 rounded-2xl shadow-2xl text-center space-y-1">
                <p className="text-yellow-300 font-bold text-sm sm:text-base">{liveSubtitle}</p>
                <p className="text-indigo-300 text-xs font-medium italic">
                  [Sign Overlay]: "DR NITIN: START SIGN THERAPY SESSION"
                </p>
              </div>
            )}

            {/* Bottom Floating Control Bar */}
            <div className="absolute bottom-3 inset-x-4 z-30 bg-[#18181b]/90 backdrop-blur border border-[#27272a] rounded-2xl p-2.5 flex items-center justify-between px-6 shadow-2xl">
              <div className="flex items-center space-x-3">
                {/* Mic */}
                <button
                  onClick={toggleMic}
                  className={`p-3 rounded-xl transition-all ${
                    callState.isMicOn ? 'bg-[#27272a] text-zinc-200 hover:bg-[#3f3f46]' : 'bg-red-600 text-white'
                  }`}
                >
                  {callState.isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>

                {/* Camera */}
                <button
                  onClick={toggleCamera}
                  className={`p-3 rounded-xl transition-all ${
                    callState.isCameraOn ? 'bg-[#27272a] text-zinc-200 hover:bg-[#3f3f46]' : 'bg-red-600 text-white'
                  }`}
                >
                  {callState.isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>

                {/* Screen Share */}
                <button
                  onClick={handleScreenShare}
                  className={`p-3 rounded-xl transition-all ${
                    callState.isScreenSharing ? 'bg-blue-600 text-white' : 'bg-[#27272a] text-zinc-200 hover:bg-[#3f3f46]'
                  }`}
                >
                  <Monitor className="w-5 h-5" />
                </button>
              </div>

              {/* End Call Button */}
              <button
                onClick={() => setCallState((prev) => ({ ...prev, isCallActive: !prev.isCallActive }))}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 flex items-center space-x-2"
              >
                <PhoneOff className="w-4 h-4" />
                <span>End Call</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: In-Call Chat & Real-Time Sign Translation Stream */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between bg-[#18181b] border border-[#27272a] rounded-3xl p-5 shadow-xl h-[480px]">
          <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center space-x-1.5">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <span>In-Call Sign & Text Chat</span>
            </span>
            <span className="text-[10px] bg-[#27272a] text-blue-400 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border border-blue-500/20">
              Live Bridge
            </span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-2 text-xs">
            {chatMessages.map((msg, i) => (
              <div key={i} className="bg-[#09090b] border border-[#27272a] rounded-2xl p-3 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold uppercase">
                  <span className="text-blue-400">{msg.sender}</span>
                  <span>{msg.time}</span>
                </div>
                <p className="text-zinc-100 font-medium">{msg.text}</p>
                {msg.signTranslation && (
                  <p className="text-[10px] text-indigo-300 font-bold tracking-wider uppercase border-t border-[#27272a] pt-1">
                    [ISL]: {msg.signTranslation}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div className="flex items-center space-x-2 pt-2 border-t border-[#27272a]">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type message or sign text..."
              className="flex-1 bg-[#09090b] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={sendMessage}
              className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
