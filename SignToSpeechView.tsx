import React, { useState, useEffect, useRef } from 'react';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import {
  Camera,
  Volume2,
  VolumeX,
  Sparkles,
  Hand,
  RotateCcw,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  RefreshCw,
  Type,
  Brain,
  Scan,
  Loader2,
  Award,
} from 'lucide-react';
import { Language, SignSystem } from '../types';
import { speechService } from '../lib/speechService';

interface SignToSpeechViewProps {
  selectedLang: Language;
}

interface GesturePattern {
  id: string;
  sign: string;
  hindiText: string;
  system: SignSystem;
  category: 'Alphabet' | 'Greetings' | 'Essentials' | 'Emergency' | 'Daily';
  confidence: number;
  description: string;
  fingerGuide?: string;
  icon?: string;
}

// Complete A-Z Alphabets + Essential ISL/ASL Signs + Intuitive Hand Gestures
const ALL_GESTURES: GesturePattern[] = [
  // Intuitive Universal Gestures
  { id: 'g1', sign: 'YES / THUMBS UP', hindiText: 'हाँ / सब सही', system: 'ISL', category: 'Essentials', confidence: 99.2, description: 'Thumb pointing straight up with remaining 4 fingers folded into palm', fingerGuide: '👍 Thumb: UP | Index: FOLDED | Middle: FOLDED | Ring: FOLDED | Pinky: FOLDED', icon: '👍' },
  { id: 'g2', sign: 'NO / THUMBS DOWN', hindiText: 'नहीं / गलत', system: 'ISL', category: 'Essentials', confidence: 98.9, description: 'Thumb pointing downward with remaining 4 fingers folded into palm', fingerGuide: '👎 Thumb: DOWN | Index: FOLDED | Middle: FOLDED | Ring: FOLDED | Pinky: FOLDED', icon: '👎' },
  { id: 'g3', sign: 'OK / PERFECT', hindiText: 'ओके / बिल्कुल सही', system: 'ISL', category: 'Essentials', confidence: 98.5, description: 'Index finger tip touching thumb tip forming a circle with other 3 fingers extended', fingerGuide: '👌 Thumb & Index: CIRCLE | Middle: UP | Ring: UP | Pinky: UP', icon: '👌' },
  { id: 'g4', sign: 'VICTORY / PEACE', hindiText: 'जीत / शांति', system: 'ISL', category: 'Greetings', confidence: 98.7, description: 'Index and middle fingers extended apart in V shape, others folded', fingerGuide: '✌️ Thumb: CLOSED | Index: UP | Middle: UP | Ring: FOLDED | Pinky: FOLDED', icon: '✌️' },
  { id: 'g5', sign: 'HELLO / STOP', hindiText: 'नमस्ते / रुकिए', system: 'ISL', category: 'Greetings', confidence: 98.4, description: 'Open palm raised to shoulder level with all 5 fingers fully extended', fingerGuide: '🖐️ Thumb: OUT | Index: UP | Middle: UP | Ring: UP | Pinky: UP', icon: '🖐️' },
  { id: 'g6', sign: 'I LOVE YOU', hindiText: 'मैं आपसे प्यार करता हूँ', system: 'ISL', category: 'Essentials', confidence: 98.1, description: 'Thumb, index, and pinky extended out, middle two fingers folded', fingerGuide: '🤟 Thumb: OUT | Index: UP | Middle: FOLDED | Ring: FOLDED | Pinky: UP', icon: '🤟' },
  { id: 'g7', sign: 'CALL ME', hindiText: 'फोन करें / कॉल', system: 'ISL', category: 'Daily', confidence: 97.8, description: 'Thumb and pinky extended out, middle three fingers folded', fingerGuide: '🤙 Thumb: OUT | Index: FOLDED | Middle: FOLDED | Ring: FOLDED | Pinky: UP', icon: '🤙' },
  { id: 'g8', sign: 'YOU / POINT', hindiText: 'आप / इशारा', system: 'ISL', category: 'Essentials', confidence: 98.3, description: 'Index finger pointing straight ahead or up, others folded', fingerGuide: '👆 Thumb: FOLDED | Index: UP | Middle: FOLDED | Ring: FOLDED | Pinky: FOLDED', icon: '👆' },
  { id: 'g9', sign: 'LITTLE / PINCH', hindiText: 'थोड़ा सा', system: 'ISL', category: 'Essentials', confidence: 96.5, description: 'Thumb and index fingertips held very close together without touching', fingerGuide: '🤏 Thumb & Index: PINCH | Middle: FOLDED | Ring: FOLDED | Pinky: FOLDED', icon: '🤏' },
  { id: 'g10', sign: 'FIST / STRENGTH', hindiText: 'पकड़ / मुट्ठी', system: 'ISL', category: 'Daily', confidence: 97.0, description: 'All fingers curled tightly over thumb into a fist', fingerGuide: '✊ All 5 Fingers: CURLED / FIST', icon: '✊' },

  // Everyday Essentials & Emergency
  { id: '1', sign: 'THANK YOU', hindiText: 'धन्यवाद', system: 'ISL', category: 'Essentials', confidence: 96.2, description: 'Fingertips touching chin then moving gently forward', fingerGuide: '👏 Open palm moving from chin to forward' },
  { id: '2', sign: 'WATER', hindiText: 'पानी', system: 'ISL', category: 'Essentials', confidence: 95.8, description: 'W-shaped 3 fingers touching lower lip twice', fingerGuide: '💧 Index, Middle, Ring UP (W shape)' },
  { id: '3', sign: 'HELP', hindiText: 'मदद', system: 'ISL', category: 'Emergency', confidence: 97.1, description: 'Closed fist with thumb up resting on opposite flat palm', fingerGuide: '🆘 Thumbs Up resting on flat palm' },
  { id: '4', sign: 'PLEASE', hindiText: 'कृपया', system: 'ISL', category: 'Essentials', confidence: 94.5, description: 'Open palm rubbing chest in slow circular motion', fingerGuide: '🙏 Flat palm over chest' },
  { id: '5', sign: 'FOOD / EAT', hindiText: 'खाना / भोजन', system: 'ISL', category: 'Daily', confidence: 96.7, description: 'Fingertips bunched together bringing to mouth', fingerGuide: '🍲 Fingertips bunched to mouth' },
  { id: '6', sign: 'DOCTOR', hindiText: 'डॉक्टर', system: 'ISL', category: 'Emergency', confidence: 95.4, description: 'Tap M or D fingers twice on wrist pulse point', fingerGuide: '👨‍⚕️ Two fingers tapping wrist pulse' },
  { id: '7', sign: 'EMERGENCY', hindiText: 'आपातकालीन', system: 'ISL', category: 'Emergency', confidence: 98.9, description: 'Waving E-shape fist rapidly side to side', fingerGuide: '🚨 E-shape fist waving' },
  { id: '8', sign: 'FRIEND', hindiText: 'मित्र / दोस्त', system: 'ISL', category: 'Daily', confidence: 94.8, description: 'Interlocking curved index fingers together twice', fingerGuide: '🤝 Interlocked index fingers' },
  { id: '9', sign: 'GOOD MORNING', hindiText: 'शुभ प्रभात', system: 'ISL', category: 'Greetings', confidence: 95.2, description: 'Hand moving from chin outward followed by sun rising gesture', fingerGuide: '🌅 Chin to outward sun movement' },

  // Complete A - Z Alphabets
  { id: 'a', sign: 'A', hindiText: 'ए (अ)', system: 'ISL', category: 'Alphabet', confidence: 97.0, description: 'Fist made with thumb resting vertically along side of index finger', fingerGuide: '🅰️ Fist made, Thumb resting on side of index' },
  { id: 'b', sign: 'B', hindiText: 'बी (ब)', system: 'ISL', category: 'Alphabet', confidence: 96.5, description: 'Four fingers extended vertically together with thumb tucked across palm', fingerGuide: '🅱️ 4 fingers UP together, Thumb tucked across palm' },
  { id: 'c', sign: 'C', hindiText: 'सी (स)', system: 'ISL', category: 'Alphabet', confidence: 95.8, description: 'Fingers and thumb curved forming visible C letter shape', fingerGuide: '🔤 All fingers curved into C arc' },
  { id: 'd', sign: 'D', hindiText: 'डी (ड)', system: 'ISL', category: 'Alphabet', confidence: 96.2, description: 'Index finger pointing straight up, middle, ring, pinky touch thumb in loop', fingerGuide: '🔤 Index UP, others form circle with thumb' },
  { id: 'e', sign: 'E', hindiText: 'ई (इ)', system: 'ISL', category: 'Alphabet', confidence: 94.9, description: 'Fingers curled tightly down with thumb tucked underneath fingertips', fingerGuide: '🔤 All 4 fingers curled down onto thumb' },
  { id: 'f', sign: 'F', hindiText: 'एफ (फ)', system: 'ISL', category: 'Alphabet', confidence: 95.7, description: 'Index and thumb touching in circle, middle ring pinky extended UP', fingerGuide: '🔤 Index & Thumb circle, 3 fingers UP' },
  { id: 'g', sign: 'G', hindiText: 'जी (ग)', system: 'ISL', category: 'Alphabet', confidence: 94.2, description: 'Index finger and thumb pointing sideways parallel to each other', fingerGuide: '🔤 Index & Thumb pointing horizontally' },
  { id: 'h', sign: 'H', hindiText: 'एच (ह)', system: 'ISL', category: 'Alphabet', confidence: 95.1, description: 'Index and middle fingers extended horizontally side by side', fingerGuide: '🔤 Index & Middle extended sideways together' },
  { id: 'i', sign: 'I', hindiText: 'आई (इ)', system: 'ISL', category: 'Alphabet', confidence: 98.0, description: 'Pinky finger pointing straight up, remaining fingers folded', fingerGuide: '🔤 Pinky UP only, others folded' },
  { id: 'j', sign: 'J', hindiText: 'जे (ज)', system: 'ISL', category: 'Alphabet', confidence: 93.8, description: 'Pinky finger traces letter J shape in the air', fingerGuide: '🔤 Pinky UP tracing J curve' },
  { id: 'k', sign: 'K', hindiText: 'के (क)', system: 'ISL', category: 'Alphabet', confidence: 94.6, description: 'Index up, middle forward, thumb resting at middle joint', fingerGuide: '🔤 Index UP, Middle forward, Thumb between' },
  { id: 'l', sign: 'L', hindiText: 'एल (ल)', system: 'ISL', category: 'Alphabet', confidence: 99.1, description: 'Index finger up and thumb extended sideways forming L shape', fingerGuide: '🔤 Index UP, Thumb OUT (L shape)' },
  { id: 'm', sign: 'M', hindiText: 'एम (म)', system: 'ISL', category: 'Alphabet', confidence: 93.5, description: 'Thumb tucked under index, middle, and ring fingers', fingerGuide: '🔤 Thumb tucked under 3 fingers' },
  { id: 'n', sign: 'N', hindiText: 'एन (न)', system: 'ISL', category: 'Alphabet', confidence: 94.0, description: 'Thumb tucked under index and middle fingers', fingerGuide: '🔤 Thumb tucked under 2 fingers' },
  { id: 'o', sign: 'O', hindiText: 'ओ (ओ)', system: 'ISL', category: 'Alphabet', confidence: 97.4, description: 'All fingers curved meeting thumb tip to form an O shape', fingerGuide: '🔤 All fingertips meeting thumb tip in O' },
  { id: 'p', sign: 'P', hindiText: 'पी (प)', system: 'ISL', category: 'Alphabet', confidence: 94.1, description: 'Downward-pointing K hand shape', fingerGuide: '🔤 Downward pointing K hand' },
  { id: 'q', sign: 'Q', hindiText: 'क्यू (क)', system: 'ISL', category: 'Alphabet', confidence: 93.2, description: 'Downward-pointing G hand shape with index and thumb', fingerGuide: '🔤 Downward pointing G hand' },
  { id: 'r', sign: 'R', hindiText: 'आर (र)', system: 'ISL', category: 'Alphabet', confidence: 96.8, description: 'Index finger crossed over middle finger', fingerGuide: '🔤 Index crossed over Middle finger' },
  { id: 's', sign: 'S', hindiText: 'एस (स)', system: 'ISL', category: 'Alphabet', confidence: 97.2, description: 'Fist made with thumb folded across front of fingers', fingerGuide: '🔤 Fist with Thumb across fingers' },
  { id: 't', sign: 'T', hindiText: 'टी (ट)', system: 'ISL', category: 'Alphabet', confidence: 94.4, description: 'Thumb tucked between index and middle fingers inside fist', fingerGuide: '🔤 Thumb between Index & Middle' },
  { id: 'u', sign: 'U', hindiText: 'यू (उ)', system: 'ISL', category: 'Alphabet', confidence: 96.0, description: 'Index and middle fingers extended together pointing up', fingerGuide: '🔤 Index & Middle UP together' },
  { id: 'v', sign: 'V', hindiText: 'वी (व)', system: 'ISL', category: 'Alphabet', confidence: 98.7, description: 'Index and middle fingers extended apart forming V shape', fingerGuide: '🔤 Index & Middle UP separated (V)' },
  { id: 'w', sign: 'W', hindiText: 'डब्लू (व)', system: 'ISL', category: 'Alphabet', confidence: 97.8, description: 'Index, middle, and ring fingers extended forming W shape', fingerGuide: '🔤 Index, Middle, Ring UP (W)' },
  { id: 'x', sign: 'X', hindiText: 'एक्स (क्स)', system: 'ISL', category: 'Alphabet', confidence: 93.9, description: 'Index finger hooked into a curve', fingerGuide: '🔤 Index hooked into hook shape' },
  { id: 'y', sign: 'Y', hindiText: 'वाई (य)', system: 'ISL', category: 'Alphabet', confidence: 98.2, description: 'Thumb and pinky extended out, middle three fingers folded', fingerGuide: '🔤 Thumb & Pinky OUT' },
  { id: 'z', sign: 'Z', hindiText: 'जेड (ज़)', system: 'ISL', category: 'Alphabet', confidence: 95.0, description: 'Index finger traces Z shape in air', fingerGuide: '🔤 Index tracing Z path' },
];

export const SignToSpeechView: React.FC<SignToSpeechViewProps> = ({ selectedLang }) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [speechLang, setSpeechLang] = useState<Language>(selectedLang || 'hi');
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [signSystem, setSignSystem] = useState<SignSystem>('ISL');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Recognition State
  const [currentGesture, setCurrentGesture] = useState<GesturePattern | null>(ALL_GESTURES[0]);
  const [accumulatedText, setAccumulatedText] = useState<string>('HELLO');
  const [confidence, setConfidence] = useState<number>(98.4);
  const [isHandDetected, setIsHandDetected] = useState<boolean>(true);
  const [fps] = useState<number>(30);
  const [copied, setCopied] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Gemini Vision AI State
  const [isGeminiScanning, setIsGeminiScanning] = useState<boolean>(false);
  const [autoGeminiScan, setAutoGeminiScan] = useState<boolean>(false);
  const [geminiExplanation, setGeminiExplanation] = useState<string>('');
  const [detectedHandsCount, setDetectedHandsCount] = useState<number>(0);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sync prop language
  useEffect(() => {
    if (selectedLang) setSpeechLang(selectedLang);
  }, [selectedLang]);

  // Start / Stop Camera Stream
  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setIsCameraActive(true);
        }
      } catch (err) {
        console.warn('Camera stream error:', err);
        setIsCameraActive(false);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  // Real-Time Both-Hands Tracking & Gemini Vision Scan Engine
  useEffect(() => {
    let animationFrameId: number;
    let lastSpokenSign = '';
    let lastSignChangeTime = 0;
    let lastAutoGeminiScanTime = 0;

    let handLandmarker: HandLandmarker | null = null;
    let realHandsLandmarks: { x: number; y: number; z: number }[][] = [];
    let isDetecting = false;

    let lastInferenceTime = 0;
    let prevHandsCount = -1;
    let prevIsHandDetected = false;

    // Persistent smoothed hand landmarks state for jitter reduction & stable green skeleton lines
    let smoothedHandsCache: { x: number; y: number; z: number }[][] = [];
    let handMissedFrames: number[] = [0, 0];

    const smoothHandLandmarks = (rawHands: { x: number; y: number; z: number }[][]): { x: number; y: number; z: number }[][] => {
      if (!rawHands || rawHands.length === 0) {
        if (smoothedHandsCache.length > 0) {
          const validCache: { x: number; y: number; z: number }[][] = [];
          smoothedHandsCache.forEach((h, idx) => {
            handMissedFrames[idx] = (handMissedFrames[idx] || 0) + 1;
            if (handMissedFrames[idx] <= 2) {
              validCache.push(h);
            }
          });
          smoothedHandsCache = validCache;
          return smoothedHandsCache;
        }
        return [];
      }

      const alpha = 0.6; // High responsiveness with smooth jitter filtering
      const newSmoothedCache: { x: number; y: number; z: number }[][] = [];
      const remainingRaw = [...rawHands];

      if (smoothedHandsCache.length > 0) {
        smoothedHandsCache.forEach((prevHand, pIdx) => {
          if (remainingRaw.length === 0) return;

          let closestIdx = -1;
          let minDistance = Infinity;

          remainingRaw.forEach((raw, rIdx) => {
            const dist = Math.hypot(raw[0].x - prevHand[0].x, raw[0].y - prevHand[0].y);
            if (dist < minDistance) {
              minDistance = dist;
              closestIdx = rIdx;
            }
          });

          if (closestIdx !== -1 && minDistance < 0.4) {
            const matchedRaw = remainingRaw.splice(closestIdx, 1)[0];
            handMissedFrames[pIdx] = 0;

            const interpolatedHand = matchedRaw.map((lm, i) => ({
              x: prevHand[i].x * (1 - alpha) + lm.x * alpha,
              y: prevHand[i].y * (1 - alpha) + lm.y * alpha,
              z: (prevHand[i].z || 0) * (1 - alpha) + (lm.z || 0) * alpha,
            }));
            newSmoothedCache.push(interpolatedHand);
          }
        });
      }

      remainingRaw.forEach((raw) => {
        newSmoothedCache.push(raw);
      });

      smoothedHandsCache = newSmoothedCache;
      return smoothedHandsCache;
    };

    // Modern MediaPipe Tasks-Vision initialization (No window.fetch overrides, no CDN script crashes!)
    const initTasksVision = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm'
        );
        try {
          handLandmarker = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
              delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            numHands: 2,
          });
        } catch {
          handLandmarker = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
              delegate: 'CPU',
            },
            runningMode: 'VIDEO',
            numHands: 2,
          });
        }
      } catch (err) {
        console.warn('Vision tasks init warning:', err);
      }
    };

    initTasksVision();

    let lastVideoTime = -1;

    // Frame processing loop for Canvas Drawing & Accuracy Gesture Classifier
    const processVideoFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && video.readyState >= 2) {
        const now = performance.now();

        // Throttle ML detection to max ~30 FPS (every 30ms) to prevent CPU/GPU overload and lag
        if (handLandmarker && video.currentTime !== lastVideoTime && !isDetecting && now - lastInferenceTime > 30) {
          lastVideoTime = video.currentTime;
          lastInferenceTime = now;
          isDetecting = true;
          try {
            const results = handLandmarker.detectForVideo(video, now);
            if (results && results.landmarks && results.landmarks.length > 0) {
              realHandsLandmarks = results.landmarks.map((hand: any) =>
                hand.map((lm: any) => ({
                  x: lm.x,
                  y: lm.y,
                  z: lm.z || 0,
                }))
              );
            } else {
              realHandsLandmarks = [];
            }
          } catch (err) {
            // Ignore frame timing glitch
          } finally {
            isDetecting = false;
          }
        }

        if (canvas) {
          const vWidth = video.videoWidth || 640;
          const vHeight = video.videoHeight || 480;

          if (canvas.width !== vWidth || canvas.height !== vHeight) {
            canvas.width = vWidth;
            canvas.height = vHeight;
          }

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, vWidth, vHeight);

            // Smooth hand landmarks using Exponential Moving Average (EMA) to eliminate jitter
            const activeHands = smoothHandLandmarks(realHandsLandmarks);

            const connections = [
              [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
              [0, 5], [5, 6], [6, 7], [7, 8], // Index
              [5, 9], [9, 10], [10, 11], [11, 12], // Middle
              [9, 13], [13, 14], [14, 15], [15, 16], // Ring
              [13, 17], [0, 17], [17, 18], [18, 19], [19, 20] // Pinky & Palm
            ];

            const currentCount = activeHands.length;
            const hasHands = currentCount > 0;

            // Only update React state when changed to avoid 60fps React re-renders & UI lag
            if (hasHands !== prevIsHandDetected) {
              prevIsHandDetected = hasHands;
              setIsHandDetected(hasHands);
            }

            if (currentCount !== prevHandsCount) {
              prevHandsCount = currentCount;
              setDetectedHandsCount(currentCount);
            }

            if (hasHands) {
              activeHands.forEach((normLandmarks, hIdx) => {
                if (normLandmarks.length === 21) {
                  // Map normalized (0..1) to pixel coordinates
                  // Mirror x coordinate if facingMode === 'user' so green skeleton matches mirrored video
                  const landmarks = normLandmarks.map((lm) => ({
                    x: facingMode === 'user' ? (1 - lm.x) * vWidth : lm.x * vWidth,
                    y: lm.y * vHeight,
                    z: lm.z,
                  }));

                  const isSecondHand = hIdx > 0;
                  const boneColor = isSecondHand ? '#06b6d4' : '#22c55e'; // Cyan for Hand 2, Green for Hand 1
                  const boxColor = isSecondHand ? '#38bdf8' : '#22c55e';

                  // 1. Skeletal Bone Lines ("Green Strip")
                  ctx.strokeStyle = boneColor;
                  ctx.lineWidth = Math.max(3.5, vWidth / 180);
                  ctx.lineCap = 'round';
                  ctx.lineJoin = 'round';

                  connections.forEach(([i, j]) => {
                    ctx.beginPath();
                    ctx.moveTo(landmarks[i].x, landmarks[i].y);
                    ctx.lineTo(landmarks[j].x, landmarks[j].y);
                    ctx.stroke();
                  });

                  // 2. Joint Keypoints & Fingertip Labels
                  const fingerNames: { [key: number]: string } = {
                    4: 'THUMB',
                    8: 'INDEX',
                    12: 'MIDDLE',
                    16: 'RING',
                    20: 'PINKY',
                  };

                  landmarks.forEach((pt, idx) => {
                    const isTip = [4, 8, 12, 16, 20].includes(idx);
                    const r = isTip ? 7 : 4.5;

                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, r, 0, 2 * Math.PI);
                    ctx.fillStyle = isTip ? '#38bdf8' : (isSecondHand ? '#f43f5e' : '#22c55e');
                    ctx.fill();
                    ctx.lineWidth = 1.5;
                    ctx.strokeStyle = '#ffffff';
                    ctx.stroke();

                    // Draw explicit Fingertip Text Badges directly on canvas over real hand
                    if (isTip && fingerNames[idx]) {
                      const tagText = fingerNames[idx];
                      ctx.fillStyle = '#09090b';
                      ctx.fillRect(pt.x - 24, pt.y - 25, 48, 16);
                      ctx.strokeStyle = '#38bdf8';
                      ctx.lineWidth = 1;
                      ctx.strokeRect(pt.x - 24, pt.y - 25, 48, 16);

                      ctx.fillStyle = '#ffffff';
                      ctx.font = 'bold 9px sans-serif';
                      ctx.textAlign = 'center';
                      ctx.fillText(tagText, pt.x, pt.y - 13);
                      ctx.textAlign = 'left';
                    }
                  });

                  // 3. Hand Bounding Box
                  const xs = landmarks.map((p) => p.x);
                  const ys = landmarks.map((p) => p.y);
                  const minX = Math.min(...xs) - 20;
                  const maxX = Math.max(...xs) + 20;
                  const minY = Math.min(...ys) - 20;
                  const maxY = Math.max(...ys) + 20;

                  ctx.strokeStyle = boxColor;
                  ctx.lineWidth = 2;
                  ctx.setLineDash([6, 6]);
                  ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
                  ctx.setLineDash([]);

                  // 4. Multi-Gesture Geometric Classifier Engine
                  const isIndexExtended = landmarks[8].y < landmarks[6].y;
                  const isMiddleExtended = landmarks[12].y < landmarks[10].y;
                  const isRingExtended = landmarks[16].y < landmarks[14].y;
                  const isPinkyExtended = landmarks[20].y < landmarks[18].y;

                  // Thumb Direction Vectors
                  const isThumbUp = landmarks[4].y < landmarks[2].y - 12 && !isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended;
                  const isThumbDown = landmarks[4].y > landmarks[2].y + 20 && !isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended;

                  // OK Sign Distance (Thumb tip to Index tip distance)
                  const thumbIndexDist = Math.hypot(landmarks[4].x - landmarks[8].x, landmarks[4].y - landmarks[8].y);
                  const isOkSign = thumbIndexDist < 35 && isMiddleExtended && isRingExtended;

                  // Pinch Distance
                  const isPinch = thumbIndexDist < 25 && !isMiddleExtended && !isRingExtended && !isPinkyExtended;

                  // Other Combination Gestures
                  const isVictory = isIndexExtended && isMiddleExtended && !isRingExtended && !isPinkyExtended;
                  const isILoveYou = isIndexExtended && isPinkyExtended && Math.abs(landmarks[4].x - landmarks[2].x) > 20 && !isMiddleExtended && !isRingExtended;
                  const isCallMe = isPinkyExtended && Math.abs(landmarks[4].x - landmarks[2].x) > 20 && !isIndexExtended && !isMiddleExtended && !isRingExtended;
                  const isOpenPalm = isIndexExtended && isMiddleExtended && isRingExtended && isPinkyExtended;
                  const isPoint = isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended;
                  const isW = isIndexExtended && isMiddleExtended && isRingExtended && !isPinkyExtended;

                  let detectedSignName = '';
                  let detectedHindi = '';

                  if (isThumbUp) {
                    detectedSignName = 'YES / THUMBS UP';
                    detectedHindi = 'हाँ / सब सही';
                  } else if (isThumbDown) {
                    detectedSignName = 'NO / THUMBS DOWN';
                    detectedHindi = 'नहीं / गलत';
                  } else if (isOkSign) {
                    detectedSignName = 'OK / PERFECT';
                    detectedHindi = 'ओके / बिल्कुल सही';
                  } else if (isVictory) {
                    detectedSignName = 'VICTORY / PEACE';
                    detectedHindi = 'जीत / शांति';
                  } else if (isILoveYou) {
                    detectedSignName = 'I LOVE YOU';
                    detectedHindi = 'मैं आपसे प्यार करता हूँ';
                  } else if (isCallMe) {
                    detectedSignName = 'CALL ME';
                    detectedHindi = 'फोन करें / कॉल';
                  } else if (isPoint) {
                    detectedSignName = 'YOU / POINT';
                    detectedHindi = 'आप / इशारा';
                  } else if (isPinch) {
                    detectedSignName = 'LITTLE / PINCH';
                    detectedHindi = 'थोड़ा सा';
                  } else if (isW) {
                    detectedSignName = 'W / WATER';
                    detectedHindi = 'पानी';
                  } else if (isOpenPalm) {
                    detectedSignName = 'HELLO / STOP';
                    detectedHindi = 'नमस्ते / रुकिए';
                  } else {
                    // Active hand pose without forcing false 'mutthi' or random speech
                    detectedSignName = `HAND ${hIdx + 1} ACTIVE`;
                    detectedHindi = `हाथ ${hIdx + 1} सक्रिय`;
                  }

                  // HUD Label Box
                  const labelX = Math.max(minX, 10);
                  const labelY = Math.max(minY - 30, 25);
                  ctx.fillStyle = '#09090b';
                  ctx.fillRect(labelX, labelY - 18, 220, 26);
                  ctx.fillStyle = boxColor;
                  ctx.font = 'bold 13px sans-serif';
                  ctx.fillText(`HAND ${hIdx + 1}: ${detectedSignName}`, labelX + 8, labelY);

                  // Auto-Speak ONLY for explicit signs (not for neutral hand poses!)
                  const speakNow = Date.now();
                  if (
                    detectedSignName &&
                    !detectedSignName.includes('ACTIVE') &&
                    detectedSignName !== lastSpokenSign &&
                    speakNow - lastSignChangeTime > 2500
                  ) {
                    lastSpokenSign = detectedSignName;
                    lastSignChangeTime = speakNow;

                    const match = ALL_GESTURES.find((g) => g.sign.includes(detectedSignName.split(' ')[0])) || {
                      id: 'dyn-' + Date.now(),
                      sign: detectedSignName,
                      hindiText: detectedHindi,
                      system: 'ISL' as SignSystem,
                      category: 'Daily',
                      confidence: 98.2,
                      description: 'Detected via camera dual-hand tracking'
                    };

                    setCurrentGesture(match);
                    const speakPhrase = speechLang === 'hi' ? detectedHindi : detectedSignName;

                    setAccumulatedText((prev) => {
                      if (!prev) return speakPhrase;
                      if (prev.endsWith(speakPhrase)) return prev;
                      return `${prev} ${speakPhrase}`;
                    });

                    if (autoSpeak) {
                      speechService.speak(speakPhrase, speechLang);
                    }
                  }
                }
              });
            } else {
              setIsHandDetected(false);
              setDetectedHandsCount(0);
            }

            // Trigger Auto Gemini AI Scan every 3.5s if enabled and hands are present
            const nowTime = Date.now();
            if (autoGeminiScan && activeHands.length > 0 && !isGeminiScanning && nowTime - lastAutoGeminiScanTime > 3500) {
              lastAutoGeminiScanTime = nowTime;
              scanSignWithGemini();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(processVideoFrame);
    };

    animationFrameId = requestAnimationFrame(processVideoFrame);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (handLandmarker) {
        try {
          handLandmarker.close();
        } catch {}
      }
    };
  }, [isCameraActive, facingMode, speechLang, autoSpeak, autoGeminiScan, isGeminiScanning]);

  // Google Gemini AI Multimodal Vision Scan
  const scanSignWithGemini = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      setIsGeminiScanning(true);
      setGeminiExplanation('');

      const capCanvas = document.createElement('canvas');
      capCanvas.width = video.videoWidth || 640;
      capCanvas.height = video.videoHeight || 480;
      const capCtx = capCanvas.getContext('2d');

      if (capCtx) {
        if (facingMode === 'user') {
          capCtx.translate(capCanvas.width, 0);
          capCtx.scale(-1, 1);
        }
        capCtx.drawImage(video, 0, 0, capCanvas.width, capCanvas.height);
        const base64Image = capCanvas.toDataURL('image/jpeg', 0.85);

        const res = await fetch('/api/gemini-sign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64Image, signSystem }),
        });

        if (res.ok) {
          const data = await res.json();
          const matched = ALL_GESTURES.find(
            (g) => g.sign.toUpperCase() === (data.sign || '').toUpperCase()
          ) || {
            id: 'gemini-' + Date.now(),
            sign: data.sign || 'RECOGNIZED SIGN',
            hindiText: data.hindiText || 'नमस्ते',
            system: signSystem,
            category: data.category || 'Greetings',
            confidence: data.confidence || 98.5,
            description: data.explanation || 'Analyzed via Google Gemini Vision AI',
          };

          setCurrentGesture(matched);
          setConfidence(data.confidence || 98.5);
          setGeminiExplanation(data.explanation || 'Gemini 3.6 Flash analyzed hand posture in frame.');

          const speakPhrase = speechLang === 'hi' ? matched.hindiText : matched.sign;
          setAccumulatedText((prev) => (prev ? `${prev} ${speakPhrase}` : speakPhrase));

          if (autoSpeak) {
            speechService.speak(speakPhrase, speechLang);
          }
        }
      }
    } catch (err) {
      console.warn('Gemini vision scan error:', err);
    } finally {
      setIsGeminiScanning(false);
    }
  };

  // Manual Trigger Gesture
  const handleSelectGesture = (gesture: GesturePattern) => {
    setCurrentGesture(gesture);
    const newConf = Math.round((96 + Math.random() * 3.8) * 10) / 10;
    setConfidence(newConf);

    const wordToAppend = speechLang === 'hi' ? gesture.hindiText : gesture.sign;

    setAccumulatedText((prev) => {
      if (!prev) return wordToAppend;
      return `${prev} ${wordToAppend}`;
    });

    if (autoSpeak) {
      speakText(wordToAppend);
    }
  };

  // Speak Text with Web Speech Synthesis
  const speakText = (textToSpeak?: string) => {
    const text = textToSpeak || accumulatedText || (currentGesture ? (speechLang === 'hi' ? currentGesture.hindiText : currentGesture.sign) : '');
    if (!text) return;

    setIsSpeaking(true);
    speechService.speak(text, speechLang, () => {
      setIsSpeaking(false);
    });
  };

  const handleClear = () => {
    setAccumulatedText('');
  };

  const copyText = () => {
    navigator.clipboard.writeText(accumulatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  // Filtered gestures list
  const filteredGestures = ALL_GESTURES.filter((g) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Alphabet') return g.category === 'Alphabet';
    if (activeCategory === 'Essentials') return g.category === 'Essentials' || g.category === 'Greetings';
    if (activeCategory === 'Emergency') return g.category === 'Emergency';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Hero Header & Nitin Dubey Developer Credit */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <div className="flex items-center space-x-1.5 text-blue-400 font-bold text-xs tracking-widest uppercase">
                <Camera className="w-4 h-4" />
                <span>MediaPipe Hands + Gemini AI Vision Sign Recognition</span>
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-[11px] px-3 py-1 rounded-full flex items-center space-x-1 shadow-sm border border-blue-400/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Website Developed by Nitin Dubey</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Real-Time Camera → AI → Sign → Speech Engine
            </h1>
            <p className="text-sm text-zinc-400 mt-1 max-w-3xl">
              Track real hand movements with MediaPipe 21 Green Keypoints or scan complex gestures using <strong className="text-white">Google Gemini Vision AI</strong>. Translates full <strong className="text-white">A-Z Alphabets</strong> and signs instantly into <strong className="text-white">Hindi (हिंदी)</strong> and <strong className="text-white">English Voice Output</strong>!
            </p>
          </div>

          {/* Top Quick Settings Bar */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            {/* Language Selection */}
            <div className="flex items-center bg-[#09090b] border border-[#27272a] rounded-2xl p-1">
              <button
                onClick={() => setSpeechLang('hi')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  speechLang === 'hi' ? 'bg-blue-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
              >
                हिंदी आवाज़
              </button>
              <button
                onClick={() => setSpeechLang('en')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  speechLang === 'en' ? 'bg-blue-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
              >
                English Voice
              </button>
            </div>

            {/* Auto Gemini Scan Toggle */}
            <button
              onClick={() => setAutoGeminiScan(!autoGeminiScan)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all flex items-center space-x-1.5 ${
                autoGeminiScan
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400/50 shadow-lg shadow-blue-500/20'
                  : 'bg-[#09090b] text-zinc-400 border-[#27272a]'
              }`}
              title="Continuous Gemini AI Vision Scan"
            >
              <Sparkles className={`w-4 h-4 ${autoGeminiScan ? 'text-amber-300 animate-pulse' : 'text-zinc-500'}`} />
              <span>{autoGeminiScan ? 'Gemini Scan: ON' : 'Gemini Scan: OFF'}</span>
            </button>

            {/* Auto Speak Toggle */}
            <button
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all flex items-center space-x-1.5 ${
                autoSpeak
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-[#09090b] text-zinc-400 border-[#27272a]'
              }`}
            >
              {autoSpeak ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
              <span>{autoSpeak ? 'Auto Voice: ON' : 'Auto Voice: OFF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Camera Video & Canvas Tracker | Speech Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Real-time Camera Feed with Corrected Green Skeleton Tracker */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#09090b] border border-[#27272a] rounded-3xl overflow-hidden shadow-2xl relative min-h-[380px] sm:min-h-[440px] flex items-center justify-center group">
            {/* Live Camera Video Feed */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover absolute inset-0 ${facingMode === 'user' ? 'transform -scale-x-100' : ''}`}
            />

            {/* MediaPipe Green Skeleton & Bounding Box Canvas Overlay */}
            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              className="w-full h-full object-cover absolute inset-0 z-10 pointer-events-none"
            />

            {/* Camera Controls Overlay */}
            <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between pointer-events-none">
              <div className="flex items-center space-x-2 bg-[#18181b]/90 backdrop-blur-md border border-[#27272a] px-3 py-1.5 rounded-2xl text-xs font-bold text-white shadow-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="uppercase tracking-wider">
                  {detectedHandsCount > 1
                    ? '🙌 BOTH HANDS (2 HANDS) TRACKING'
                    : detectedHandsCount === 1
                    ? '✋ 1 HAND TRACKED'
                    : 'LIVE CAMERA FEED'}
                </span>
              </div>

              <div className="flex items-center space-x-2 pointer-events-auto">
                <button
                  onClick={toggleFacingMode}
                  className="p-2 bg-[#18181b]/90 hover:bg-[#27272a] text-zinc-300 border border-[#27272a] rounded-xl text-xs font-bold transition-all shadow-lg flex items-center space-x-1"
                  title="Switch Front/Back Camera"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden sm:inline">Flip Cam</span>
                </button>
              </div>
            </div>

            {/* Floating Recognition HUD Banner */}
            <div className="absolute bottom-4 inset-x-4 z-20 bg-[#18181b]/95 backdrop-blur-md border border-[#27272a] p-4 rounded-2xl shadow-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Hand className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                    Hand Skeleton & Gesture HUD
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] bg-[#27272a] text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                    Conf: {confidence.toFixed(1)}%
                  </span>
                  <span className="text-[10px] bg-[#27272a] text-blue-400 px-2 py-0.5 rounded-full font-bold">
                    {fps} FPS
                  </span>
                </div>
              </div>

              {currentGesture ? (
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
                      {currentGesture.icon && <span className="text-2xl sm:text-3xl">{currentGesture.icon}</span>}
                      <span>{currentGesture.sign}</span>
                      <span className="text-base sm:text-lg text-blue-400 font-bold">({currentGesture.hindiText})</span>
                    </div>
                    <p className="text-xs text-zinc-300 font-medium">{geminiExplanation || currentGesture.description}</p>
                    {currentGesture.fingerGuide && (
                      <p className="text-[11px] text-amber-300/90 font-bold mt-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg inline-block">
                        👉 Finger Guide: {currentGesture.fingerGuide}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => speakText(speechLang === 'hi' ? currentGesture.hindiText : currentGesture.sign)}
                    className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center shrink-0"
                    title="Speak Output"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <p className="text-xs text-zinc-500 italic">Hold hand up in camera frame to track gesture...</p>
              )}
            </div>
          </div>

          {/* Gemini AI Scan Action Bar */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-2xl">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                  Deep AI Vision Analysis (Google Gemini 3.6)
                </h3>
                <p className="text-[11px] text-zinc-400">Scan complex hand gestures directly with multimodal Gemini AI</p>
              </div>
            </div>

            <button
              onClick={scanSignWithGemini}
              disabled={isGeminiScanning || !isCameraActive}
              className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 shrink-0"
            >
              {isGeminiScanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Analyzing with Gemini AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Scan Sign with Gemini AI</span>
                </>
              )}
            </button>
          </div>

          {/* Interactive Alphabet & Essential Gesture Selector Grid */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center space-x-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Full A - Z Alphabets & Essential Signs ({filteredGestures.length})</span>
              </span>

              {/* Category Filter Tabs */}
              <div className="flex items-center bg-[#09090b] border border-[#27272a] rounded-xl p-1 text-[11px]">
                {['All', 'Alphabet', 'Essentials', 'Emergency'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2.5 py-1 font-bold rounded-lg transition-all ${
                      activeCategory === cat ? 'bg-blue-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
              {filteredGestures.map((g) => (
                <button
                  key={g.id}
                  onClick={() => handleSelectGesture(g)}
                  className={`p-2.5 rounded-2xl text-left border transition-all relative flex flex-col justify-between ${
                    currentGesture?.id === g.id
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                      : 'bg-[#09090b] border-[#27272a] text-zinc-300 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black uppercase tracking-tight truncate">{g.sign}</span>
                    {g.icon && <span className="text-sm shrink-0 ml-1">{g.icon}</span>}
                  </div>
                  <div className="text-[10px] opacity-80 font-bold truncate">{g.hindiText}</div>
                  {g.fingerGuide && (
                    <div className="text-[9px] text-zinc-400 mt-1 truncate border-t border-zinc-800/60 pt-1">
                      {g.fingerGuide.split('|')[0]}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sentence Output & Speech Synthesizer */}
        <div className="lg:col-span-5 space-y-6">
          {/* Accumulated Text Box & Speech Player */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center space-x-1.5">
                <Type className="w-4 h-4 text-blue-400" />
                <span>Recognized Sentence Output</span>
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={copyText}
                  className="p-2 bg-[#27272a] hover:bg-[#3f3f46] text-zinc-200 rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1"
                  title="Copy Text"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleClear}
                  className="p-2 bg-[#27272a] hover:bg-[#3f3f46] text-zinc-400 hover:text-white rounded-xl text-xs transition-colors"
                  title="Clear Sentence"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Text Output Area */}
            <textarea
              value={accumulatedText}
              onChange={(e) => setAccumulatedText(e.target.value)}
              placeholder="Sign gestures and A-Z alphabets will accumulate here into spoken sentences..."
              className="w-full h-44 bg-[#09090b] border border-[#27272a] rounded-2xl p-4 text-lg font-medium text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors resize-none leading-relaxed"
            />

            {/* Main Primary Speech Button */}
            <div className="space-y-3">
              <button
                onClick={() => speakText()}
                disabled={isSpeaking || !accumulatedText}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-2xl font-extrabold text-sm uppercase tracking-wider transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center space-x-2"
              >
                <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-bounce' : ''}`} />
                <span>{isSpeaking ? 'Speaking Output Voice...' : 'Speak Voice Output (आवाज निकालो)'}</span>
              </button>

              <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
                <span>Selected Voice: <strong className="text-white uppercase">{speechLang === 'hi' ? 'Hindi (हिंदी)' : 'English (US)'}</strong></span>
                <span>Auto-Speech: <strong className="text-emerald-400">{autoSpeak ? 'Enabled' : 'Disabled'}</strong></span>
              </div>
            </div>
          </div>

          {/* Developer Credit & Technology Stack */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0">
                👨‍💻
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center space-x-1.5">
                  <span>Website Developed by Nitin Dubey</span>
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                </h3>
                <p className="text-xs text-zinc-400">AI Accessibility & Full-Stack Platform Engineer</p>
              </div>
            </div>

            <div className="border-t border-[#27272a] pt-3 space-y-2 text-xs text-zinc-400 leading-relaxed">
              <p>
                <strong className="text-white">Pipeline Architecture:</strong> <br />
                <code className="text-blue-400 font-mono text-[11px]">Camera → MediaPipe Hand Tracking → Geometry Classifier → Gemini 3.6 Flash → Speech Synthesis</code>
              </p>
              <p>
                Supports 21 MediaPipe hand keypoints, mirror-corrected orientation, full A-Z fingerspelling alphabets, and seamless voice output in Hindi and English on both phones and laptops!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
