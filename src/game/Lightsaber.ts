import * as THREE from 'three';

export class Lightsaber {
  public group: THREE.Group;
  private hilt: THREE.Mesh;
  private blade: THREE.Mesh;
  private pointLight: THREE.PointLight;
  private color: THREE.Color;
  private isActive: boolean = false;
  private bladeLength: number = 1.2;

  constructor(color: number = 0x00ffff) {
    this.color = new THREE.Color(color);
    this.group = new THREE.Group();

    // Hilt
    const hiltGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.25, 12);
    const hiltMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.2 });
    this.hilt = new THREE.Mesh(hiltGeo, hiltMat);
    this.group.add(this.hilt);

    // Blade (starts scale 0)
    const bladeGeo = new THREE.CylinderGeometry(0.015, 0.015, this.bladeLength, 12);
    bladeGeo.translate(0, this.bladeLength / 2 + 0.125, 0);
    const bladeMat = new THREE.MeshBasicMaterial({ color: this.color });
    this.blade = new THREE.Mesh(bladeGeo, bladeMat);
    this.blade.scale.y = 0;
    this.group.add(this.blade);

    // Light
    this.pointLight = new THREE.PointLight(this.color, 0, 5);
    this.pointLight.position.set(0, 0.5, 0);
    this.group.add(this.pointLight);
  }

  public toggle(active: boolean) {
    this.isActive = active;
  }

  public update(delta: number) {
    const targetScale = this.isActive ? 1 : 0;
    this.blade.scale.y = THREE.MathUtils.lerp(this.blade.scale.y, targetScale, delta * 15);
    this.pointLight.intensity = this.blade.scale.y * 2;
  }

  public getBladeWorldPosition(): THREE.Vector3 {
    const worldPos = new THREE.Vector3();
    this.blade.getWorldPosition(worldPos);
    return worldPos;
  }
}
