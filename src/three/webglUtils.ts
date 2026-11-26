import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

let cachedIsSoftwareGl: boolean | null = null;
let cachedWebGlAvailable: boolean | null = null;

export function isWebGLAvailable(): boolean {
  if (cachedWebGlAvailable !== null) return cachedWebGlAvailable;
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    cachedWebGlAvailable = Boolean(gl);
    if (gl && 'getExtension' in gl) {
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
    return cachedWebGlAvailable;
  } catch {
    cachedWebGlAvailable = false;
    return false;
  }
}

export function detectSoftwareGl(): boolean {
  if (cachedIsSoftwareGl !== null) return cachedIsSoftwareGl;
  if (typeof document === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) {
      cachedIsSoftwareGl = true;
      return true;
    }
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    cachedIsSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    return cachedIsSoftwareGl;
  } catch {
    cachedIsSoftwareGl = true;
    return true;
  }
}

export function applyStudioEnvironment(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
): () => void {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const envScene = new RoomEnvironment();
  const renderTarget = pmremGenerator.fromScene(envScene, 0.04);
  scene.environment = renderTarget.texture;
  envScene.dispose();
  pmremGenerator.dispose();
  return () => {
    renderTarget.dispose();
    if (scene.environment === renderTarget.texture) {
      scene.environment = null;
    }
  };
}

export function createOceanColorTexture(maxAnisotropy = 4): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 256, 256);
    grad.addColorStop(0, '#1677B8');
    grad.addColorStop(0.5, '#1D8AC9');
    grad.addColorStop(1, '#2BA8DA');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 3;
    for (let y = 16; y < 256; y += 32) {
      ctx.beginPath();
      for (let x = 0; x <= 256; x += 16) {
        const waveY = y + Math.sin((x / 256) * Math.PI * 4) * 5;
        if (x === 0) ctx.moveTo(x, waveY);
        else ctx.lineTo(x, waveY);
      }
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export function createTerrainColorTexture(maxAnisotropy = 4): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#79B36E';
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 160; i++) {
      const x = (i * 53) % 256;
      const y = (i * 97) % 256;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(131, 188, 122, 0.45)' : 'rgba(94, 150, 86, 0.35)';
      ctx.beginPath();
      ctx.arc(x, y, 8 + (i % 10), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.anisotropy = maxAnisotropy;
  return tex;
}
