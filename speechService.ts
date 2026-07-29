import { Language } from '../types';

export interface SpeechRecognitionHandlers {
  onResult: (text: string, isFinal: boolean, detectedLang?: string) => void;
  onError: (error: string) => void;
  onEnd: () => void;
}

export class SpeechService {
  private recognition: any = null;
  private isListening = false;

  constructor() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
    }
  }

  public getLanguageCode(lang: Language): string {
    switch (lang) {
      case 'hi':
        return 'hi-IN';
      case 'gu':
        return 'gu-IN';
      case 'en':
      default:
        return 'en-US';
    }
  }

  public startListening(lang: Language, handlers: SpeechRecognitionHandlers) {
    if (!this.recognition) {
      handlers.onError('Browser Speech Recognition API is not supported on this browser.');
      return;
    }

    if (this.isListening) {
      this.stopListening();
    }

    this.recognition.lang = this.getLanguageCode(lang);

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const activeText = finalTranscript || interimTranscript;
      if (activeText) {
        handlers.onResult(activeText, !!finalTranscript, lang);
      }
    };

    this.recognition.onerror = (event: any) => {
      console.warn('Speech Recognition Warning:', event.error);
      handlers.onError(`Mic Error: ${event.error}`);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      handlers.onEnd();
    };

    try {
      this.recognition.start();
      this.isListening = true;
    } catch (err: any) {
      handlers.onError(err.message || 'Failed to start microphone speech input');
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  public speak(text: string, lang: Language = 'en', onEnded?: () => void) {
    if (!('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis is not supported');
      if (onEnded) onEnded();
      return;
    }

    window.speechSynthesis.cancel(); // stop current utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.getLanguageCode(lang);
    utterance.rate = 0.95; // slightly clear pace for accessibility

    if (onEnded) {
      utterance.onend = onEnded;
      utterance.onerror = onEnded;
    }

    window.speechSynthesis.speak(utterance);
  }
}

export const speechService = new SpeechService();
