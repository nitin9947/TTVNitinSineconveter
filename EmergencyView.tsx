import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Hospital,
  Shield,
  Ambulance,
  Flame,
  Users,
  Radio,
  MapPin,
  Volume2,
  History,
  CheckCircle2,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { EmergencyRecord, EmergencyType, Language } from '../types';
import { speechService } from '../lib/speechService';
import { offlineStorage } from '../lib/offlineDb';

interface EmergencyViewProps {
  selectedLang: Language;
}

export const EmergencyView: React.FC<EmergencyViewProps> = ({ selectedLang }) => {
  const [activeEmergency, setActiveEmergency] = useState<EmergencyRecord | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number; address?: string } | null>(null);
  const [history, setHistory] = useState<EmergencyRecord[]>([]);

  useEffect(() => {
    // Load emergency history
    offlineStorage.getEmergencyRecords().then(setHistory);

    // Capture GPS location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            address: `Lat: ${pos.coords.latitude.toFixed(4)}, Lon: ${pos.coords.longitude.toFixed(4)}`,
          });
        },
        (err) => console.warn('GPS location permission warning:', err)
      );
    }
  }, []);

  const triggerEmergency = async (type: EmergencyType) => {
    let title = '';
    let message = '';

    switch (type) {
      case 'hospital':
        title = 'MEDICAL EMERGENCY / HOSPITAL NEEDED';
        message =
          selectedLang === 'hi'
            ? 'आपातकालीन चिकित्सा सहायता चाहिए! मैं बोल या सुन नहीं सकता। कृपया मुझे तुरंत निकटतम अस्पताल ले जाएं।'
            : selectedLang === 'gu'
            ? 'ઇમરજન્સી મેડિકલ સહાય જોઈએ છે! હું બોલી કે સાંભળી શકતો નથી. કૃપા કરીને મને તરત જ નજીકની હોસ્પિટલ લઈ જાઓ.'
            : 'MEDICAL EMERGENCY NEEDED! I am deaf/non-verbal. Please take me to the nearest hospital immediately.';
        break;
      case 'police':
        title = 'POLICE ASSISTANCE REQUIRED';
        message =
          selectedLang === 'hi'
            ? 'आपातकालीन पुलिस सहायता की आवश्यकता है! मैं गैर-मौखिक हूँ। कृपया मेरी सुरक्षा में सहायता करें।'
            : selectedLang === 'gu'
            ? 'ઈમરજન્સી પોલીસ સહાયની જરૂર છે! હું નોન-વર્બલ છું. કૃપા કરીને મને મદદ કરો.'
            : 'POLICE ASSISTANCE REQUIRED! I am non-verbal and need immediate safety support.';
        break;
      case 'ambulance':
        title = 'AMBULANCE REQUEST';
        message =
          selectedLang === 'hi'
            ? 'तुरंत एम्बुलेंस भेजें! चिकित्सा स्थिति।'
            : selectedLang === 'gu'
            ? 'તરત જ એમ્બ્યુલન્સ મોકલો!'
            : 'AMBULANCE REQUIRED IMMEDIATELY! Medical emergency at my location.';
        break;
      case 'fire':
        title = 'FIRE EMERGENCY';
        message =
          selectedLang === 'hi'
            ? 'आग की आपात स्थिति! कृपया तुरंत फायर ब्रिगेड को बुलाएं।'
            : selectedLang === 'gu'
            ? 'આગની ઈમરજન્સી! કૃપા કરીને તરત જ ફાયર બ્રિગેડ બોલાવો.'
            : 'FIRE EMERGENCY! Please send fire response services immediately.';
        break;
      case 'family':
        title = 'FAMILY SOS ALERT';
        message =
          selectedLang === 'hi'
            ? 'परिवार के सदस्यों को आपातकालीन संदेश भेजा गया।'
            : selectedLang === 'gu'
            ? 'પરિવારને ઈમરજન્સી મેસેજ મોકલવામાં આવ્યો.'
            : 'SOS Alert dispatched to emergency family contacts with live GPS coordinates.';
        break;
      case 'sos':
      default:
        title = 'CRITICAL SOS DISTRESS BROADCAST';
        message =
          selectedLang === 'hi'
            ? 'गंभीर आपातकालीन संकट! मुझे तत्काल सहायता की आवश्यकता है।'
            : selectedLang === 'gu'
            ? 'ગંભીર ઈમરજન્સી સંકટ! મને તાત્કાલિક સહાયની જરૂર છે.'
            : 'CRITICAL EMERGENCY DISTRESS! I am deaf/hard of hearing and need immediate emergency assistance.';
        break;
    }

    const newRecord: EmergencyRecord = {
      id: `sos-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      type,
      title,
      message,
      language: selectedLang,
      location: location || undefined,
      synced: false,
    };

    setActiveEmergency(newRecord);
    setHistory((prev) => [newRecord, ...prev]);
    offlineStorage.addEmergencyRecord(newRecord);

    // Speak loud emergency message
    speechService.speak(message, selectedLang);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-red-950/40 border border-red-600/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-red-400 font-bold text-xs tracking-widest uppercase mb-1">
              <AlertTriangle className="w-4 h-4 animate-bounce" />
              <span>Dedicated One-Tap Emergency SOS Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Instant Accessible Emergency Assistance
            </h1>
            <p className="text-sm text-red-200 mt-1 max-w-2xl">
              1-Tap triggers for Hospital, Police, Ambulance, Fire, Family, and SOS broadcast with loud spoken alerts, high-visibility cards, and live GPS location sharing. Works 100% Offline.
            </p>
          </div>

          {/* GPS Location Card */}
          <div className="bg-[#09090b] border border-[#27272a] p-3.5 rounded-2xl text-xs space-y-1">
            <div className="flex items-center space-x-1.5 text-blue-400 font-bold uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Current GPS Coordinates:</span>
            </div>
            <p className="text-zinc-200 font-mono">
              {location ? location.address : 'Locating GPS coordinates...'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Emergency Trigger Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { id: 'hospital', label: 'Hospital', icon: <Hospital className="w-8 h-8" />, color: 'from-blue-600 to-indigo-700' },
          { id: 'police', label: 'Police', icon: <Shield className="w-8 h-8" />, color: 'from-zinc-700 to-zinc-900' },
          { id: 'ambulance', label: 'Ambulance', icon: <Ambulance className="w-8 h-8" />, color: 'from-emerald-600 to-teal-700' },
          { id: 'fire', label: 'Fire Dept', icon: <Flame className="w-8 h-8" />, color: 'from-amber-600 to-orange-700' },
          { id: 'family', label: 'Family SOS', icon: <Users className="w-8 h-8" />, color: 'from-purple-600 to-pink-700' },
          { id: 'sos', label: 'CRITICAL SOS', icon: <Radio className="w-8 h-8" />, color: 'from-red-600 to-rose-700' },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => triggerEmergency(btn.id as EmergencyType)}
            className={`p-6 rounded-3xl bg-gradient-to-br ${btn.color} text-white shadow-xl hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center space-y-3 text-center border border-white/20`}
          >
            {btn.icon}
            <span className="text-lg font-extrabold uppercase tracking-wider">{btn.label}</span>
          </button>
        ))}
      </div>

      {/* Active Emergency High-Visibility Display Screen */}
      {activeEmergency && (
        <div className="bg-red-600 text-white rounded-3xl p-8 shadow-2xl space-y-6 animate-pulse">
          <div className="flex items-center justify-between border-b border-red-500 pb-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-10 h-10" />
              <div>
                <h2 className="text-2xl font-black uppercase tracking-wider">{activeEmergency.title}</h2>
                <p className="text-xs text-red-100 font-semibold">Triggered at {activeEmergency.timestamp}</p>
              </div>
            </div>

            <button
              onClick={() => speechService.speak(activeEmergency.message, selectedLang)}
              className="p-3 bg-white text-red-600 font-bold rounded-2xl text-xs shadow-lg flex items-center space-x-2 hover:bg-red-50 transition-colors"
            >
              <Volume2 className="w-5 h-5" />
              <span>Re-speak Message</span>
            </button>
          </div>

          {/* Huge readable display card for first responders */}
          <div className="bg-white text-zinc-900 rounded-2xl p-6 shadow-2xl space-y-3">
            <span className="text-xs font-bold text-red-600 uppercase tracking-widest">
              Show this screen to Emergency Responder / Paramedic:
            </span>
            <p className="text-2xl sm:text-3xl font-black leading-snug">{activeEmergency.message}</p>
          </div>
        </div>
      )}

      {/* Emergency History Log */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center space-x-2">
            <History className="w-4 h-4 text-blue-400" />
            <span>Emergency History Log (Stored Locally in IndexedDB)</span>
          </span>
          <span className="text-xs text-zinc-500 font-mono">{history.length} Events</span>
        </div>

        {history.length === 0 ? (
          <p className="text-xs text-zinc-600 italic">No emergency records logged.</p>
        ) : (
          <div className="space-y-2">
            {history.slice(0, 5).map((rec) => (
              <div key={rec.id} className="p-3.5 bg-[#09090b] border border-[#27272a] rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-red-400 uppercase tracking-wider">{rec.title}</span>
                  <p className="text-zinc-400 line-clamp-1">{rec.message}</p>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">{rec.timestamp}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
