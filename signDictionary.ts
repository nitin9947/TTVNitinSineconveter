import { SignGesture, SignSystem } from '../types';

export const SIGN_DICTIONARY: SignGesture[] = [
  // Greetings
  {
    id: 'hello',
    name: 'HELLO',
    category: 'greetings',
    signSystem: 'ISL',
    description: 'Raise right hand near forehead, palm facing forward, move slightly outward in a friendly salute.',
    hindiText: 'नमस्ते / हेलो',
    gujaratiText: 'નમસ્તે / હેલો',
    keyframes: [
      { rightArm: { shoulder: [0, 0, 0.8], elbow: [0.8, 0.5, 0], wrist: [0, 0.2, 0] }, rightHandFingers: [0, 0, 0, 0, 0], head: [0, 0, 0], durationMs: 400 },
      { rightArm: { shoulder: [0.2, 0, 1.2], elbow: [0.6, 0.8, 0.2], wrist: [0.3, 0.4, 0] }, rightHandFingers: [0, 0, 0, 0, 0], head: [0.05, 0, 0], durationMs: 600 },
    ],
    tags: ['greetings', 'welcome', 'hi', 'namaste'],
  },
  {
    id: 'namaste',
    name: 'NAMASTE',
    category: 'greetings',
    signSystem: 'ISL',
    description: 'Press both palms together in front of chest (Anjali Mudra) and bow slightly.',
    hindiText: 'नमस्ते',
    gujaratiText: 'નમસ્તે',
    keyframes: [
      {
        leftArm: { shoulder: [0.2, 0, 0.6], elbow: [1.2, 0.2, -0.4], wrist: [0, 0, 0] },
        rightArm: { shoulder: [-0.2, 0, 0.6], elbow: [1.2, -0.2, -0.4], wrist: [0, 0, 0] },
        leftHandFingers: [0, 0, 0, 0, 0],
        rightHandFingers: [0, 0, 0, 0, 0],
        head: [0.2, 0, 0],
        durationMs: 800,
      },
    ],
    tags: ['greetings', 'respect', 'india'],
  },
  {
    id: 'thank_you',
    name: 'THANK YOU',
    category: 'greetings',
    signSystem: 'ISL',
    description: 'Touch fingertips of right hand to chin, then move hand forward and slightly down toward the person.',
    hindiText: 'धन्यवाद',
    gujaratiText: 'આભાર / થેંક યુ',
    keyframes: [
      { rightArm: { shoulder: [0.1, 0, 0.9], elbow: [1.2, 0.2, 0], wrist: [0, 0, 0] }, rightHandFingers: [0, 0, 0, 0, 0], head: [0, 0, 0], durationMs: 400 },
      { rightArm: { shoulder: [0, 0, 0.4], elbow: [0.4, 0, 0.8], wrist: [0, -0.2, 0] }, rightHandFingers: [0, 0, 0, 0, 0], head: [0.1, 0, 0], durationMs: 600 },
    ],
    tags: ['greetings', 'thanks', 'gratitude'],
  },
  {
    id: 'welcome',
    name: 'WELCOME',
    category: 'greetings',
    signSystem: 'ISL',
    description: 'Open both arms out wide with palms facing up, sweeping gently toward body.',
    hindiText: 'स्वागत हे',
    gujaratiText: 'સ્વાગત છે',
    keyframes: [
      {
        leftArm: { shoulder: [0.4, -0.5, 0.5], elbow: [0.4, 0, 0], wrist: [0, 0, 0] },
        rightArm: { shoulder: [-0.4, -0.5, 0.5], elbow: [0.4, 0, 0], wrist: [0, 0, 0] },
        leftHandFingers: [0, 0, 0, 0, 0],
        rightHandFingers: [0, 0, 0, 0, 0],
        durationMs: 700,
      },
    ],
    tags: ['greetings'],
  },

  // Questions
  {
    id: 'how_are_you',
    name: 'HOW ARE YOU',
    category: 'questions',
    signSystem: 'ISL',
    description: 'Place curved hands on chest, turn palms upward and extend forward while tilting head with inquiring expression.',
    hindiText: 'आप कैसे हैं?',
    gujaratiText: 'તમે કેમ છો?',
    keyframes: [
      {
        leftArm: { shoulder: [0.2, 0, 0.4], elbow: [0.8, 0, 0], wrist: [0, 0, 0] },
        rightArm: { shoulder: [-0.2, 0, 0.4], elbow: [0.8, 0, 0], wrist: [0, 0, 0] },
        head: [0.1, 0.1, 0],
        durationMs: 500,
      },
      {
        leftArm: { shoulder: [0.5, -0.2, 0.6], elbow: [0.3, 0.4, 0], wrist: [0.4, 0, 0] },
        rightArm: { shoulder: [-0.5, -0.2, 0.6], elbow: [0.3, -0.4, 0], wrist: [-0.4, 0, 0] },
        head: [0.15, -0.05, 0],
        durationMs: 700,
      },
    ],
    tags: ['questions', 'condition', 'health'],
  },
  {
    id: 'what',
    name: 'WHAT',
    category: 'questions',
    signSystem: 'ISL',
    description: 'Hold open palms up at waist level and shake hands side to side slightly.',
    hindiText: 'क्या',
    gujaratiText: 'શું',
    keyframes: [
      {
        leftArm: { shoulder: [0.3, -0.3, 0.3], elbow: [0.6, -0.2, 0], wrist: [0, 0, 0] },
        rightArm: { shoulder: [-0.3, -0.3, 0.3], elbow: [0.6, 0.2, 0], wrist: [0, 0, 0] },
        leftHandFingers: [0, 0, 0, 0, 0],
        rightHandFingers: [0, 0, 0, 0, 0],
        durationMs: 600,
      },
    ],
    tags: ['questions'],
  },
  {
    id: 'where',
    name: 'WHERE',
    category: 'questions',
    signSystem: 'ISL',
    description: 'Extend index finger up and move hand back and forth side to side with questioning facial expression.',
    hindiText: 'कहाँ',
    gujaratiText: 'ક્યાં',
    keyframes: [
      {
        rightArm: { shoulder: [0, 0, 0.6], elbow: [0.8, 0.2, 0], wrist: [0, 0.5, 0] },
        rightHandFingers: [1, 0, 1, 1, 1], // index extended
        head: [0.1, 0.1, 0],
        durationMs: 700,
      },
    ],
    tags: ['questions', 'location'],
  },

  // Essentials
  {
    id: 'help',
    name: 'HELP',
    category: 'essentials',
    signSystem: 'ISL',
    description: 'Place closed right fist thumb-up on open flat left palm, lift both hands together upward.',
    hindiText: 'मदद / सहायता',
    gujaratiText: 'મદદ / સહાય',
    keyframes: [
      {
        leftArm: { shoulder: [0.3, -0.2, 0.3], elbow: [0.8, -0.2, 0], wrist: [0, 0, 0] },
        rightArm: { shoulder: [-0.1, -0.1, 0.5], elbow: [0.9, 0.1, 0], wrist: [0, 0, 0] },
        leftHandFingers: [0, 0, 0, 0, 0],
        rightHandFingers: [0, 1, 1, 1, 1], // fist with thumb up
        durationMs: 500,
      },
      {
        leftArm: { shoulder: [0.3, -0.1, 0.7], elbow: [0.6, -0.2, 0], wrist: [0, 0, 0] },
        rightArm: { shoulder: [-0.1, 0, 0.9], elbow: [0.7, 0.1, 0], wrist: [0, 0, 0] },
        durationMs: 700,
      },
    ],
    tags: ['essentials', 'emergency', 'assist'],
  },
  {
    id: 'please',
    name: 'PLEASE',
    category: 'essentials',
    signSystem: 'ISL',
    description: 'Place flat right palm over center of chest and rub hand in gentle clockwise circular motion.',
    hindiText: 'कृपया',
    gujaratiText: 'મહેરબાની કરીને',
    keyframes: [
      {
        rightArm: { shoulder: [0, 0, 0.6], elbow: [1.2, 0, 0], wrist: [0, 0, 0] },
        rightHandFingers: [0, 0, 0, 0, 0],
        durationMs: 800,
      },
    ],
    tags: ['essentials', 'request'],
  },
  {
    id: 'yes',
    name: 'YES',
    category: 'essentials',
    signSystem: 'ISL',
    description: 'Form right hand into an S-fist and nod the fist up and down like a nodding head.',
    hindiText: 'हाँ',
    gujaratiText: 'હા',
    keyframes: [
      { rightArm: { shoulder: [0, 0, 0.6], elbow: [0.8, 0, 0], wrist: [0.3, 0, 0] }, rightHandFingers: [1, 1, 1, 1, 1], durationMs: 400 },
      { rightArm: { shoulder: [0, 0, 0.6], elbow: [0.8, 0, 0], wrist: [-0.3, 0, 0] }, rightHandFingers: [1, 1, 1, 1, 1], durationMs: 400 },
    ],
    tags: ['essentials', 'agree'],
  },
  {
    id: 'no',
    name: 'NO',
    category: 'essentials',
    signSystem: 'ISL',
    description: 'Snap index and middle fingers together against thumb twice.',
    hindiText: 'नहीं',
    gujaratiText: 'ના',
    keyframes: [
      { rightArm: { shoulder: [0, 0, 0.6], elbow: [0.8, 0, 0], wrist: [0, 0, 0] }, rightHandFingers: [0, 0, 0, 1, 1], durationMs: 500 },
    ],
    tags: ['essentials', 'deny'],
  },
  {
    id: 'water',
    name: 'WATER',
    category: 'essentials',
    signSystem: 'ISL',
    description: 'Form "W" shape with index, middle, ring fingers, tap index finger against chin twice.',
    hindiText: 'पानी / जल',
    gujaratiText: 'પાણી / જળ',
    keyframes: [
      { rightArm: { shoulder: [0, 0, 0.8], elbow: [1.3, 0.2, 0], wrist: [0, 0, 0] }, rightHandFingers: [1, 0, 0, 0, 1], durationMs: 600 },
    ],
    tags: ['essentials', 'drink', 'hydration'],
  },
  {
    id: 'food',
    name: 'FOOD / EAT',
    category: 'essentials',
    signSystem: 'ISL',
    description: 'Bring gathered fingertips of right hand to mouth repeatedly.',
    hindiText: 'खाना / भोजन',
    gujaratiText: 'ખોરાક / ખાવાનું',
    keyframes: [
      { rightArm: { shoulder: [0, 0, 0.8], elbow: [1.4, 0.3, 0], wrist: [0, 0, 0] }, rightHandFingers: [0.8, 0.8, 0.8, 0.8, 0.8], durationMs: 500 },
    ],
    tags: ['essentials', 'hungry', 'meal'],
  },

  // Emergency Signs
  {
    id: 'hospital',
    name: 'HOSPITAL',
    category: 'emergency',
    signSystem: 'ISL',
    description: 'Use index and middle finger to trace an "H" cross shape on the upper arm.',
    hindiText: 'अस्पताल',
    gujaratiText: 'હોસ્પિટલ',
    keyframes: [
      {
        leftArm: { shoulder: [0.2, 0, 0.4], elbow: [1.0, 0, 0] },
        rightArm: { shoulder: [-0.1, 0, 0.7], elbow: [1.2, 0.3, 0] },
        rightHandFingers: [1, 0, 0, 1, 1],
        durationMs: 700,
      },
    ],
    tags: ['emergency', 'medical', 'doctor'],
  },
  {
    id: 'police',
    name: 'POLICE',
    category: 'emergency',
    signSystem: 'ISL',
    description: 'Form C-shape with right hand and place over left chest like a police badge.',
    hindiText: 'पुलिस',
    gujaratiText: 'પોલીસ',
    keyframes: [
      { rightArm: { shoulder: [0.1, 0, 0.7], elbow: [1.1, -0.2, 0] }, rightHandFingers: [0.4, 0.4, 0.4, 0.4, 0.4], durationMs: 600 },
    ],
    tags: ['emergency', 'security', 'cops'],
  },
  {
    id: 'ambulance',
    name: 'AMBULANCE',
    category: 'emergency',
    signSystem: 'ISL',
    description: 'Rotate raised fist with index finger flashing like an emergency beacon above head.',
    hindiText: 'एम्बुलेंस',
    gujaratiText: 'એમ્બ્યુલન્સ',
    keyframes: [
      { rightArm: { shoulder: [0.2, 0, 1.4], elbow: [0.5, 0.2, 0] }, head: [-0.05, 0, 0], durationMs: 600 },
    ],
    tags: ['emergency', 'medical', 'vehicle'],
  },
  {
    id: 'fire',
    name: 'FIRE',
    category: 'emergency',
    signSystem: 'ISL',
    description: 'Wiggle fingers of both hands while moving them upward to mimic flickering flames.',
    hindiText: 'आग',
    gujaratiText: 'આગ',
    keyframes: [
      {
        leftArm: { shoulder: [0.2, -0.2, 0.5], elbow: [0.6, 0, 0] },
        rightArm: { shoulder: [-0.2, -0.2, 0.5], elbow: [0.6, 0, 0] },
        leftHandFingers: [0.2, 0.5, 0.1, 0.4, 0.3],
        rightHandFingers: [0.3, 0.1, 0.5, 0.2, 0.4],
        durationMs: 600,
      },
    ],
    tags: ['emergency', 'danger', 'flame'],
  },
  {
    id: 'family',
    name: 'FAMILY',
    category: 'essentials',
    signSystem: 'ISL',
    description: 'Touch thumbs of both hands together, sweep hands in a circle outwards and bring pinky fingers together.',
    hindiText: 'परिवार',
    gujaratiText: 'પરિવાર',
    keyframes: [
      {
        leftArm: { shoulder: [0.3, 0, 0.5], elbow: [0.8, -0.2, 0] },
        rightArm: { shoulder: [-0.3, 0, 0.5], elbow: [0.8, 0.2, 0] },
        durationMs: 800,
      },
    ],
    tags: ['essentials', 'relatives', 'home'],
  },
  {
    id: 'doctor',
    name: 'DOCTOR',
    category: 'emergency',
    signSystem: 'ISL',
    description: 'Tap fingertips of bent right hand onto inside of left wrist as if checking pulse.',
    hindiText: 'डॉक्टर / चिकित्सक',
    gujaratiText: 'ડૉક્ટર / વૈદ્ય',
    keyframes: [
      {
        leftArm: { shoulder: [0.3, -0.2, 0.3], elbow: [0.8, 0, 0] },
        rightArm: { shoulder: [-0.1, 0, 0.5], elbow: [1.1, 0.3, 0] },
        durationMs: 700,
      },
    ],
    tags: ['emergency', 'medical', 'clinic'],
  },
];

// Alphabet A-Z & 0-9 Fingerspelling fallback key generator
export function getFingerspellingSign(letter: string, signSystem: SignSystem = 'ISL'): SignGesture {
  const char = letter.toUpperCase();
  return {
    id: `finger_${char}`,
    name: char,
    category: 'alphabet',
    signSystem,
    description: `Fingerspelling character ${char} in ${signSystem}`,
    keyframes: [
      {
        rightArm: { shoulder: [0, 0, 0.7], elbow: [0.9, 0.1, 0], wrist: [0, 0.1, 0] },
        rightHandFingers: getFingerFlexForChar(char),
        durationMs: 400,
      },
    ],
  };
}

function getFingerFlexForChar(char: string): number[] {
  // Simple deterministic flex mapping for 5 fingers: [thumb, index, middle, ring, pinky]
  const code = char.charCodeAt(0) || 65;
  const mod = code % 5;
  switch (mod) {
    case 0: return [0, 1, 1, 1, 1]; // Thumb only / A
    case 1: return [1, 0, 0, 0, 0]; // Index up / B
    case 2: return [0.5, 0.5, 0.5, 0.5, 0.5]; // C shape
    case 3: return [1, 0, 1, 1, 1]; // Index up / D
    case 4: return [0.9, 0.9, 0.9, 0.9, 0.9]; // E closed fist
    default: return [0, 0, 0, 0, 0];
  }
}

// Convert any input sentence into a sequence of SignGesture objects
export function textToSignSequence(text: string, signSystem: SignSystem = 'ISL'): SignGesture[] {
  if (!text) return [];
  const clean = text.toUpperCase().replace(/[^A-Z0-9\s]/g, '');
  const words = clean.split(/\s+/).filter(Boolean);

  const sequence: SignGesture[] = [];

  for (const word of words) {
    // Check if word matches exact sign in dictionary
    const match = SIGN_DICTIONARY.find(
      (s) => s.name === word || s.tags?.includes(word.toLowerCase())
    );

    if (match) {
      sequence.push({ ...match, signSystem });
    } else {
      // Look for multi-word matches like "THANK YOU", "HOW ARE YOU"
      const multiMatch = SIGN_DICTIONARY.find((s) => s.name.replace(/\s+/g, '') === word);
      if (multiMatch) {
        sequence.push({ ...multiMatch, signSystem });
      } else {
        // Fallback to fingerspelling character by character
        for (let i = 0; i < word.length; i++) {
          sequence.push(getFingerspellingSign(word[i], signSystem));
        }
      }
    }
  }

  return sequence;
}
