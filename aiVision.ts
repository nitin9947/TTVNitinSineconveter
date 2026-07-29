import { AiVisionMetrics, HandLandmark } from '../types';

export class AiVisionEngine {
  // Analyze a video element or canvas feed frame
  public analyzeFrame(videoElement: HTMLVideoElement | HTMLCanvasElement | null): AiVisionMetrics {
    if (!videoElement) {
      return {
        emotion: 'neutral',
        fatigueScore: 12,
        attentionScore: 94,
        handInFrame: true,
        lightingQuality: 'good',
        gestureQualityScore: 92,
      };
    }

    let brightness = 120;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 160;
      canvas.height = 120;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoElement as any, 0, 0, 160, 120);
        const imgData = ctx.getImageData(0, 0, 160, 120);
        let sum = 0;
        for (let i = 0; i < imgData.data.length; i += 16) {
          sum += (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
        }
        brightness = sum / (imgData.data.length / 16);
      }
    } catch (e) {
      // cross-origin or canvas security fallback
    }

    let lightingQuality: 'good' | 'dim' | 'overexposed' = 'good';
    if (brightness < 60) lightingQuality = 'dim';
    else if (brightness > 210) lightingQuality = 'overexposed';

    // Simulate smart dynamic AI pose metrics
    const time = Date.now() * 0.001;
    const smileFactor = Math.sin(time) * 0.5 + 0.5;

    let emotion: 'smile' | 'sad' | 'angry' | 'surprised' | 'neutral' = 'neutral';
    if (smileFactor > 0.7) emotion = 'smile';
    else if (smileFactor < 0.2) emotion = 'surprised';

    return {
      emotion,
      fatigueScore: Math.round(15 + Math.sin(time * 0.2) * 10),
      attentionScore: Math.round(92 + Math.cos(time * 0.3) * 6),
      handInFrame: Math.sin(time * 0.5) > -0.8,
      lightingQuality,
      gestureQualityScore: Math.round(88 + Math.sin(time * 0.8) * 10),
    };
  }

  // Generate 21 hand landmarks for recording custom sign
  public captureSimulatedHandLandmarks(): HandLandmark[] {
    const landmarks: HandLandmark[] = [];
    const baseThumbX = 0.5;
    const baseThumbY = 0.6;

    for (let i = 0; i < 21; i++) {
      landmarks.push({
        x: baseThumbX + Math.sin(i * 0.3) * 0.2,
        y: baseThumbY - (i / 21) * 0.4 + Math.cos(i * 0.2) * 0.05,
        z: Math.sin(i * 0.5) * 0.1,
      });
    }

    return landmarks;
  }
}

export const aiVisionEngine = new AiVisionEngine();
