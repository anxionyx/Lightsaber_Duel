import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export class GameEngine {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private composer: EffectComposer;
  private clock: THREE.Clock;
  private onUpdate: (delta: number) => void;

  constructor(container: HTMLElement, onUpdate: (delta: number) => void) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x050505);
    
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 1.7, 4);

    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(container.clientWidth || window.innerWidth, container.clientHeight || window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();
    this.onUpdate = onUpdate;

    // Post-processing for bloom
    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    // Optimized bloom for mobile
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.0, // strength
      0.3, // radius
      0.9  // threshold
    );
    this.composer.addPass(bloomPass);

    this.setupLighting();
    this.setupEnvironment();
    
    window.addEventListener('resize', this.onResize);
    this.animate();
  }

  private setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x404040, 1.0);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 10, 7);
    this.scene.add(directionalLight);
  }

  private setupEnvironment() {
    // Ground
    const gridHelper = new THREE.GridHelper(100, 100, 0x444444, 0x222222);
    this.scene.add(gridHelper);

    const floorGeo = new THREE.PlaneGeometry(100, 100);
    const floorMat = new THREE.MeshStandardMaterial({ 
      color: 0x111111, 
      roughness: 0.1, 
      metalness: 0.8 
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  private onResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.composer.setSize(window.innerWidth, window.innerHeight);
  }

  private animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    const delta = this.clock.getDelta();
    this.onUpdate(delta);
    this.composer.render();
  }

  private animationId: number = 0;

  private cameraRotation: THREE.Euler = new THREE.Euler(0, 0, 0, 'YXZ');
  private cameraDistance: number = 5;

  public getScene() { return this.scene; }
  public getCamera() { return this.camera; }

  public setCameraRotation(yaw: number, pitch: number) {
    this.cameraRotation.y = yaw;
    this.cameraRotation.x = pitch;
    this.cameraRotation.x = Math.max(-0.5, Math.min(0.5, this.cameraRotation.x));
  }

  public updateCamera(targetPosition: THREE.Vector3) {
    const offset = new THREE.Vector3(0, 0, this.cameraDistance);
    offset.applyEuler(this.cameraRotation);
    this.camera.position.copy(targetPosition).add(offset);
    this.camera.position.y += 1.5; // Look at head height
    this.camera.lookAt(targetPosition.x, targetPosition.y + 1.2, targetPosition.z);
  }

  public getCameraRotation() {
    return this.cameraRotation;
  }
  
  public destroy() {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.onResize);
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}
