import React, { useState } from 'react';
import {
  Smartphone,
  Tablet,
  Monitor,
  Code2,
  Copy,
  Check,
  Download,
  Sparkles,
  Layers,
  Globe,
  Radio,
  Building,
  GraduationCap,
  Glasses,
  Watch,
} from 'lucide-react';

export const MobileExportView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'flutter' | 'react-native' | 'capacitor' | 'pwa'>('flutter');
  const [copied, setCopied] = useState(false);

  const codeSnippets = {
    flutter: `// Flutter (Dart) SignBridge AI Cross-Platform Architecture
import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'package:tflite_flutter/tflite_flutter.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final cameras = await availableCameras();
  runApp(SignBridgeApp(camera: cameras.first));
}

class SignBridgeApp extends StatelessWidget {
  final CameraDescription camera;
  const SignBridgeApp({Key? key, required this.camera}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SignBridge AI',
      theme: ThemeData.dark(),
      home: SignTranslatorScreen(camera: camera),
    );
  }
}`,
    'react-native': `// React Native SignBridge AI Mobile Scaffolding
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';

export default function App() {
  const devices = useCameraDevices();
  const device = devices.front;

  if (device == null) return <Text>Loading Sign Camera...</Text>;
  return (
    <View style={styles.container}>
      <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} />
      <View style={styles.overlay}>
        <Text style={styles.signText}>SignBridge AI v2.0</Text>
      </View>
    </View>
  );
}`,
    capacitor: `// Capacitor Native Mobile Wrapper Config (iOS & Android)
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.signbridge.ai',
  appName: 'SignBridge AI',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Camera: {
      permissions: ["camera", "microphone"]
    }
  }
};

export default config;`,
    pwa: `// PWA Web App Manifest (manifest.json)
{
  "short_name": "SignBridge",
  "name": "SignBridge AI - Accessible Sign Language Platform",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "start_url": "/",
  "background_color": "#0f172a",
  "theme_color": "#2563eb",
  "display": "standalone",
  "orientation": "any"
}`,
  };

  const copySnippet = () => {
    navigator.clipboard.writeText(codeSnippets[activeTab]);
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
              <Smartphone className="w-4 h-4" />
              <span>Mobile & Future Roadmap Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Cross-Platform & Ecosystem Scaffolding
            </h1>
            <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
              Future-ready mobile code generators for Flutter, React Native, Capacitor, and PWA, plus hospital and smartwatch roadmap integrations.
            </p>
          </div>
        </div>
      </div>

      {/* Code Export Selector */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 bg-[#09090b] border border-[#27272a] rounded-2xl p-1">
            {[
              { id: 'flutter', label: 'Flutter (Dart)' },
              { id: 'react-native', label: 'React Native' },
              { id: 'capacitor', label: 'Capacitor iOS/Android' },
              { id: 'pwa', label: 'PWA Manifest' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  activeTab === tab.id ? 'bg-blue-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={copySnippet}
            className="px-4 py-2 bg-[#27272a] hover:bg-[#3f3f46] text-zinc-200 border border-[#3f3f46] rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Code' : 'Copy Architecture Code'}</span>
          </button>
        </div>

        <pre className="bg-[#09090b] border border-[#27272a] p-4 rounded-2xl text-xs font-mono text-blue-300 overflow-x-auto leading-relaxed">
          {codeSnippets[activeTab]}
        </pre>
      </div>

      {/* Future Roadmap Cards */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-6 shadow-xl space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>Ecosystem Roadmap & Integration Readiness</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-[#09090b] border border-[#27272a] rounded-2xl space-y-2">
            <Glasses className="w-6 h-6 text-indigo-400" />
            <h3 className="font-bold text-white text-sm">AR Glasses Support</h3>
            <p className="text-zinc-400">Heads-up display live subtitle rendering on smart optical eyewear.</p>
          </div>

          <div className="p-4 bg-[#09090b] border border-[#27272a] rounded-2xl space-y-2">
            <Watch className="w-6 h-6 text-purple-400" />
            <h3 className="font-bold text-white text-sm">Smartwatch Companion</h3>
            <p className="text-zinc-400">Haptic vibration alerts for emergency SOS and quick sign notifications.</p>
          </div>

          <div className="p-4 bg-[#09090b] border border-[#27272a] rounded-2xl space-y-2">
            <Building className="w-6 h-6 text-emerald-400" />
            <h3 className="font-bold text-white text-sm">Hospital Integration</h3>
            <p className="text-zinc-400">HL7/FHIR medical system integration for deaf patient intake.</p>
          </div>

          <div className="p-4 bg-[#09090b] border border-[#27272a] rounded-2xl space-y-2">
            <GraduationCap className="w-6 h-6 text-amber-400" />
            <h3 className="font-bold text-white text-sm">School & Govt APIs</h3>
            <p className="text-zinc-400">Accessibility standards compliance for educational classrooms.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
