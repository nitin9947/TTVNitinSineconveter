import * as THREE from 'three';
import { KeyframePose, SignGesture } from '../types';

export class AvatarController {
  private container: HTMLDivElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private reqId: number | null = null;

  // Joints & Meshes
  private torso!: THREE.Mesh;
  private head!: THREE.Group;
  private headMesh!: THREE.Mesh;
  private leftEye!: THREE.Mesh;
  private rightEye!: THREE.Mesh;
  private mouth!: THREE.Mesh;

  private leftShoulder!: THREE.Group;
  private leftElbow!: THREE.Group;
  private leftWrist!: THREE.Group;
  private leftFingerJoints: THREE.Group[][] = []; // 5 fingers x 3 joints [knuckle, mid, tip]

  private rightShoulder!: THREE.Group;
  private rightElbow!: THREE.Group;
  private rightWrist!: THREE.Group;
  private rightFingerJoints: THREE.Group[][] = []; // 5 fingers x 3 joints [knuckle, mid, tip]

  // Animation & Interactive State
  private currentGesture: SignGesture | null = null;
  private currentFrameIndex = 0;
  private isPlaying = false;
  private playbackSpeed = 1.0;
  private onWordHighlight?: (wordIndex: number) => void;

  private frameStartTime = 0;
  private targetPose: KeyframePose | null = null;
  private startPose: KeyframePose | null = null;

  // Mouse Head Tracking
  private mouseX = 0;
  private mouseY = 0;
  private targetHeadRotX = 0;
  private targetHeadRotY = 0;

  constructor(container: HTMLDivElement, onWordHighlight?: (wordIndex: number) => void) {
    this.container = container;
    this.onWordHighlight = onWordHighlight;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x090d16); // Deep slate studio backdrop

    // 2. Camera
    const aspect = container.clientWidth / (container.clientHeight || 420);
    this.camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 100);
    this.camera.position.set(0, 1.25, 3.1);

    // 3. Renderer with High-Quality Shadows & Antialiasing
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight || 420);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    container.appendChild(this.renderer.domElement);

    // 4. Studio Lighting & Shadows
    this.setupLighting();

    // 5. Build Realistic 3D Human Avatar
    this.buildHumanAvatar();

    // 6. Interactive Listeners
    window.addEventListener('resize', this.handleResize);
    this.container.addEventListener('mousemove', this.handleMouseMove);

    // 7. Start Animation Loop
    this.animate(performance.now());
  }

  private setupLighting() {
    // Soft Ambient Light
    const ambient = new THREE.AmbientLight(0xffffff, 0.65);
    this.scene.add(ambient);

    // Main Studio Key Light (Soft Warm Daylight)
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 1.4);
    keyLight.position.set(2.5, 4.5, 3.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0001;
    this.scene.add(keyLight);

    // Cool Fill Light (Cyan/Blue Soft Fill)
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
    fillLight.position.set(-3, 2, 2);
    this.scene.add(fillLight);

    // Dramatic Rim / Backlight (Magenta/Purple Highlight for Silhouette)
    const rimLight = new THREE.DirectionalLight(0xc084fc, 1.1);
    rimLight.position.set(0, 3, -3);
    this.scene.add(rimLight);

    // Studio Floor Grid Disk
    const floorGeo = new THREE.CircleGeometry(3.5, 32);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.6,
      metalness: 0.2,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.85;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  private buildHumanAvatar() {
    // Realistic PBR Materials
    const skinMaterial = new THREE.MeshStandardMaterial({
      color: 0xedd2c0, // Natural warm skin tone
      roughness: 0.38,
      metalness: 0.05,
    });

    const lipMaterial = new THREE.MeshStandardMaterial({
      color: 0xd9777f, // Soft natural lip tint
      roughness: 0.4,
    });

    const eyeWhiteMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
    });

    const irisMaterial = new THREE.MeshStandardMaterial({
      color: 0x2563eb, // Vibrant blue-hazel iris
      roughness: 0.2,
    });

    const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x09090b });

    const hairMaterial = new THREE.MeshStandardMaterial({
      color: 0x1c1917, // Dark natural hair
      roughness: 0.8,
    });

    const jacketMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b, // Dark Navy/Slate Tech Blazer
      roughness: 0.5,
      metalness: 0.1,
    });

    const shirtMaterial = new THREE.MeshStandardMaterial({
      color: 0x2563eb, // Modern Royal Blue Shirt
      roughness: 0.6,
    });

    // --- 1. TORSO & CLOTHING ---
    const torsoGeo = new THREE.CylinderGeometry(0.34, 0.29, 0.9, 24);
    this.torso = new THREE.Mesh(torsoGeo, jacketMaterial);
    this.torso.position.set(0, 0.8, 0);
    this.torso.castShadow = true;
    this.torso.receiveShadow = true;
    this.scene.add(this.torso);

    // Inner Shirt V-Collar
    const collarGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.2, 16);
    const collar = new THREE.Mesh(collarGeo, shirtMaterial);
    collar.position.set(0, 0.4, 0.02);
    this.torso.add(collar);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.16, 16);
    const neck = new THREE.Mesh(neckGeo, skinMaterial);
    neck.position.set(0, 0.52, 0);
    this.torso.add(neck);

    // --- 2. HEAD & FACIAL FEATURES ---
    this.head = new THREE.Group();
    this.head.position.set(0, 0.68, 0);
    this.torso.add(this.head);

    // Head Base Mesh
    const headGeo = new THREE.SphereGeometry(0.22, 32, 32);
    headGeo.scale(1, 1.12, 1.02); // Slightly elongated realistic skull shape
    this.headMesh = new THREE.Mesh(headGeo, skinMaterial);
    this.headMesh.castShadow = true;
    this.head.add(this.headMesh);

    // Chin / Jaw Definition
    const chinGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const chin = new THREE.Mesh(chinGeo, skinMaterial);
    chin.position.set(0, -0.18, 0.12);
    this.head.add(chin);

    // Realistic Hair Styling (Layered top + sides)
    const hairTopGeo = new THREE.SphereGeometry(0.23, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2.1);
    const hairTop = new THREE.Mesh(hairTopGeo, hairMaterial);
    hairTop.position.set(0, 0.03, -0.01);
    this.head.add(hairTop);

    // Hair Quiff / Bangs Volume
    const quiffGeo = new THREE.BoxGeometry(0.18, 0.08, 0.12);
    const quiff = new THREE.Mesh(quiffGeo, hairMaterial);
    quiff.position.set(0, 0.21, 0.12);
    quiff.rotation.x = -0.2;
    this.head.add(quiff);

    // Ears (Left & Right)
    [-0.22, 0.22].forEach((xSide) => {
      const earGeo = new THREE.SphereGeometry(0.045, 12, 12);
      earGeo.scale(0.5, 1.2, 0.8);
      const ear = new THREE.Mesh(earGeo, skinMaterial);
      ear.position.set(xSide, -0.02, -0.02);
      this.head.add(ear);
    });

    // Realistic Eyes (Sclera + Iris + Pupil + Glint)
    [-0.08, 0.08].forEach((xPos, idx) => {
      const eyeGroup = new THREE.Group();
      eyeGroup.position.set(xPos, 0.04, 0.18);

      // Sclera (White)
      const eyeSclera = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 16), eyeWhiteMaterial);
      eyeGroup.add(eyeSclera);

      // Iris (Hazel Blue)
      const iris = new THREE.Mesh(new THREE.SphereGeometry(0.02, 16, 16), irisMaterial);
      iris.position.set(0, 0, 0.02);
      eyeGroup.add(iris);

      // Pupil (Black)
      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.01, 12, 12), pupilMaterial);
      pupil.position.set(0, 0, 0.028);
      eyeGroup.add(pupil);

      // Eyebrow
      const eyebrowGeo = new THREE.BoxGeometry(0.07, 0.012, 0.015);
      const eyebrow = new THREE.Mesh(eyebrowGeo, hairMaterial);
      eyebrow.position.set(0, 0.05, 0.01);
      eyebrow.rotation.z = idx === 0 ? 0.08 : -0.08;
      eyeGroup.add(eyebrow);

      this.head.add(eyeGroup);
      if (idx === 0) this.leftEye = eyeSclera;
      else this.rightEye = eyeSclera;
    });

    // Nose Bridge & Tip
    const noseGeo = new THREE.ConeGeometry(0.028, 0.08, 12);
    const nose = new THREE.Mesh(noseGeo, skinMaterial);
    nose.position.set(0, -0.01, 0.22);
    nose.rotation.x = -0.2;
    this.head.add(nose);

    // Lips & Mouth
    const lipGeo = new THREE.TorusGeometry(0.045, 0.012, 12, 24, Math.PI);
    this.mouth = new THREE.Mesh(lipGeo, lipMaterial);
    this.mouth.position.set(0, -0.11, 0.19);
    this.mouth.rotation.x = Math.PI / 1.1;
    this.head.add(this.mouth);

    // --- 3. LEFT ARM & ARTICULATED 3-JOINT HAND ---
    this.leftShoulder = new THREE.Group();
    this.leftShoulder.position.set(-0.38, 0.38, 0);
    this.torso.add(this.leftShoulder);

    const leftUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.075, 0.45, 16), jacketMaterial);
    leftUpperArm.position.set(-0.06, -0.22, 0);
    leftUpperArm.castShadow = true;
    this.leftShoulder.add(leftUpperArm);

    this.leftElbow = new THREE.Group();
    this.leftElbow.position.set(-0.06, -0.45, 0);
    this.leftShoulder.add(this.leftElbow);

    const leftForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.058, 0.4, 16), skinMaterial);
    leftForearm.position.set(0, -0.2, 0);
    leftForearm.castShadow = true;
    this.leftElbow.add(leftForearm);

    this.leftWrist = new THREE.Group();
    this.leftWrist.position.set(0, -0.4, 0);
    this.leftElbow.add(this.leftWrist);

    const leftPalm = new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.12, 0.035), skinMaterial);
    leftPalm.position.set(0, -0.06, 0);
    leftPalm.castShadow = true;
    this.leftWrist.add(leftPalm);

    // Build Left 5 Articulated 3-Joint Fingers
    this.leftFingerJoints = this.buildHandFingers(this.leftWrist, skinMaterial, true);

    // --- 4. RIGHT ARM & ARTICULATED 3-JOINT HAND ---
    this.rightShoulder = new THREE.Group();
    this.rightShoulder.position.set(0.38, 0.38, 0);
    this.torso.add(this.rightShoulder);

    const rightUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.075, 0.45, 16), jacketMaterial);
    rightUpperArm.position.set(0.06, -0.22, 0);
    rightUpperArm.castShadow = true;
    this.rightShoulder.add(rightUpperArm);

    this.rightElbow = new THREE.Group();
    this.rightElbow.position.set(0.06, -0.45, 0);
    this.rightShoulder.add(this.rightElbow);

    const rightForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.058, 0.4, 16), skinMaterial);
    rightForearm.position.set(0, -0.2, 0);
    rightForearm.castShadow = true;
    this.rightElbow.add(rightForearm);

    this.rightWrist = new THREE.Group();
    this.rightWrist.position.set(0, -0.4, 0);
    this.rightElbow.add(this.rightWrist);

    const rightPalm = new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.12, 0.035), skinMaterial);
    rightPalm.position.set(0, -0.06, 0);
    rightPalm.castShadow = true;
    this.rightWrist.add(rightPalm);

    // Build Right 5 Articulated 3-Joint Fingers
    this.rightFingerJoints = this.buildHandFingers(this.rightWrist, skinMaterial, false);
  }

  // Helper to build 5 anatomical fingers with 3 articulated joint chains per finger
  private buildHandFingers(parentWrist: THREE.Group, skinMaterial: THREE.Material, isLeft: boolean): THREE.Group[][] {
    const handJoints: THREE.Group[][] = [];

    for (let fIdx = 0; fIdx < 5; fIdx++) {
      const fingerChain: THREE.Group[] = [];

      // Thumb vs 4 Fingers positioning
      const isThumb = fIdx === 0;
      const xOffset = isThumb ? (isLeft ? -0.055 : 0.055) : (fIdx - 2.5) * 0.022;
      const yOffset = isThumb ? -0.04 : -0.12;
      const zOffset = isThumb ? 0.02 : 0;

      // 1. Knuckle Joint (Base)
      const knuckle = new THREE.Group();
      knuckle.position.set(xOffset, yOffset, zOffset);
      if (isThumb) {
        knuckle.rotation.z = isLeft ? -0.5 : 0.5;
        knuckle.rotation.y = isLeft ? 0.4 : -0.4;
      }
      parentWrist.add(knuckle);
      fingerChain.push(knuckle);

      const phalanx1Geo = new THREE.CylinderGeometry(0.012, 0.011, isThumb ? 0.045 : 0.05, 10);
      const mesh1 = new THREE.Mesh(phalanx1Geo, skinMaterial);
      mesh1.position.set(0, -0.025, 0);
      knuckle.add(mesh1);

      // 2. Middle Joint
      const midJoint = new THREE.Group();
      midJoint.position.set(0, -0.045, 0);
      knuckle.add(midJoint);
      fingerChain.push(midJoint);

      const phalanx2Geo = new THREE.CylinderGeometry(0.011, 0.009, isThumb ? 0.035 : 0.04, 10);
      const mesh2 = new THREE.Mesh(phalanx2Geo, skinMaterial);
      mesh2.position.set(0, -0.02, 0);
      midJoint.add(mesh2);

      // 3. Tip Joint
      const tipJoint = new THREE.Group();
      tipJoint.position.set(0, -0.038, 0);
      midJoint.add(tipJoint);
      fingerChain.push(tipJoint);

      const phalanx3Geo = new THREE.CylinderGeometry(0.009, 0.007, 0.03, 10);
      const mesh3 = new THREE.Mesh(phalanx3Geo, skinMaterial);
      mesh3.position.set(0, -0.015, 0);
      tipJoint.add(mesh3);

      handJoints.push(fingerChain);
    }

    return handJoints;
  }

  public setGesture(gesture: SignGesture, index = 0) {
    this.currentGesture = gesture;
    this.currentFrameIndex = 0;
    this.isPlaying = true;
    this.frameStartTime = performance.now();

    if (this.onWordHighlight) {
      this.onWordHighlight(index);
    }

    if (gesture.keyframes && gesture.keyframes.length > 0) {
      this.targetPose = gesture.keyframes[0];
      this.startPose = this.getCurrentPoseSnapshot();
    }
  }

  public setPlaybackSpeed(speed: number) {
    this.playbackSpeed = speed;
  }

  public play() {
    this.isPlaying = true;
    this.frameStartTime = performance.now();
  }

  public pause() {
    this.isPlaying = false;
  }

  public replay() {
    if (this.currentGesture) {
      this.setGesture(this.currentGesture);
    }
  }

  private getCurrentPoseSnapshot(): KeyframePose {
    return {
      leftArm: {
        shoulder: [this.leftShoulder.rotation.x, this.leftShoulder.rotation.y, this.leftShoulder.rotation.z],
        elbow: [this.leftElbow.rotation.x, this.leftElbow.rotation.y, this.leftElbow.rotation.z],
        wrist: [this.leftWrist.rotation.x, this.leftWrist.rotation.y, this.leftWrist.rotation.z],
      },
      rightArm: {
        shoulder: [this.rightShoulder.rotation.x, this.rightShoulder.rotation.y, this.rightShoulder.rotation.z],
        elbow: [this.rightElbow.rotation.x, this.rightElbow.rotation.y, this.rightElbow.rotation.z],
        wrist: [this.rightWrist.rotation.x, this.rightWrist.rotation.y, this.rightWrist.rotation.z],
      },
      head: [this.head.rotation.x, this.head.rotation.y, this.head.rotation.z],
    };
  }

  private lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  private applyPoseInterpolation(start: KeyframePose, target: KeyframePose, progress: number) {
    const t = Math.min(Math.max(progress, 0), 1);

    // Left Arm
    if (target.leftArm?.shoulder) {
      const s = start.leftArm?.shoulder || [0, 0, 0];
      this.leftShoulder.rotation.set(
        this.lerp(s[0], target.leftArm.shoulder[0], t),
        this.lerp(s[1], target.leftArm.shoulder[1], t),
        this.lerp(s[2], target.leftArm.shoulder[2], t)
      );
    }
    if (target.leftArm?.elbow) {
      const s = start.leftArm?.elbow || [0, 0, 0];
      this.leftElbow.rotation.set(
        this.lerp(s[0], target.leftArm.elbow[0], t),
        this.lerp(s[1], target.leftArm.elbow[1], t),
        this.lerp(s[2], target.leftArm.elbow[2], t)
      );
    }

    // Right Arm
    if (target.rightArm?.shoulder) {
      const s = start.rightArm?.shoulder || [0, 0, 0];
      this.rightShoulder.rotation.set(
        this.lerp(s[0], target.rightArm.shoulder[0], t),
        this.lerp(s[1], target.rightArm.shoulder[1], t),
        this.lerp(s[2], target.rightArm.shoulder[2], t)
      );
    }
    if (target.rightArm?.elbow) {
      const s = start.rightArm?.elbow || [0, 0, 0];
      this.rightElbow.rotation.set(
        this.lerp(s[0], target.rightArm.elbow[0], t),
        this.lerp(s[1], target.rightArm.elbow[1], t),
        this.lerp(s[2], target.rightArm.elbow[2], t)
      );
    }

    // Head Pose
    if (target.head) {
      const s = start.head || [0, 0, 0];
      this.head.rotation.set(
        this.lerp(s[0], target.head[0], t),
        this.lerp(s[1], target.head[1], t),
        this.lerp(s[2], target.head[2], t)
      );
    }

    // Multi-Joint Anatomical Finger Bending (Right Hand)
    if (target.rightHandFingers) {
      target.rightHandFingers.forEach((flex, fIdx) => {
        const chain = this.rightFingerJoints[fIdx];
        if (chain && chain.length === 3) {
          const bendVal = flex * Math.PI * 0.55;
          // Anatomical curl ratio across 3 joints
          chain[0].rotation.x = bendVal * 0.5; // Knuckle
          chain[1].rotation.x = bendVal * 0.35; // Mid
          chain[2].rotation.x = bendVal * 0.25; // Tip
        }
      });
    }

    // Multi-Joint Anatomical Finger Bending (Left Hand)
    if (target.leftHandFingers) {
      target.leftHandFingers.forEach((flex, fIdx) => {
        const chain = this.leftFingerJoints[fIdx];
        if (chain && chain.length === 3) {
          const bendVal = flex * Math.PI * 0.55;
          chain[0].rotation.x = bendVal * 0.5;
          chain[1].rotation.x = bendVal * 0.35;
          chain[2].rotation.x = bendVal * 0.25;
        }
      });
    }
  }

  private animate = (now: number) => {
    this.reqId = requestAnimationFrame(this.animate);

    // Interactive Head Tracking toward cursor when idle or active
    this.targetHeadRotY = (this.mouseX / (this.container.clientWidth || 1)) * 0.4;
    this.targetHeadRotX = -(this.mouseY / (this.container.clientHeight || 1)) * 0.25;

    this.head.rotation.y += (this.targetHeadRotY - this.head.rotation.y) * 0.05;
    this.head.rotation.x += (this.targetHeadRotX - this.head.rotation.x) * 0.05;

    if (this.isPlaying && this.currentGesture && this.targetPose) {
      const duration = (this.targetPose.durationMs || 650) / this.playbackSpeed;
      const elapsed = now - this.frameStartTime;
      const progress = elapsed / duration;

      if (this.startPose) {
        this.applyPoseInterpolation(this.startPose, this.targetPose, progress);
      }

      if (progress >= 1.0) {
        // Advance keyframe
        this.currentFrameIndex++;
        if (this.currentFrameIndex < this.currentGesture.keyframes.length) {
          this.startPose = this.getCurrentPoseSnapshot();
          this.targetPose = this.currentGesture.keyframes[this.currentFrameIndex];
          this.frameStartTime = now;
        } else {
          // Finished gesture
          this.isPlaying = false;
        }
      }
    }

    // Natural Lifelike Idle Breathing & Micro-sway
    if (!this.isPlaying) {
      const idleTime = now * 0.002;
      this.torso.position.y = 0.8 + Math.sin(idleTime) * 0.015;
      this.torso.rotation.z = Math.cos(idleTime * 0.7) * 0.008;
    }

    this.renderer.render(this.scene, this.camera);
  };

  private handleMouseMove = (e: MouseEvent) => {
    const rect = this.container.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left - rect.width / 2;
    this.mouseY = e.clientY - rect.top - rect.height / 2;
  };

  private handleResize = () => {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight || 420;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  public destroy() {
    if (this.reqId !== null) cancelAnimationFrame(this.reqId);
    window.removeEventListener('resize', this.handleResize);
    this.container.removeEventListener('mousemove', this.handleMouseMove);
    if (this.renderer.domElement && this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}

