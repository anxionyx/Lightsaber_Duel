import * as THREE from 'three';
import { Lightsaber } from './Lightsaber';
import { CombatAction } from './types';

export class Player {
  public group: THREE.Group;
  public saber: Lightsaber;
  public health: number = 100;
  public action: CombatAction = 'idle';
  private targetRotation: THREE.Quaternion = new THREE.Quaternion();
  private moveSpeed: number = 3;
  
  constructor(color: number, isEnemy: boolean = false) {
    this.group = new THREE.Group();
    this.saber = new Lightsaber(color);
    
    // Simple body placeholder
    const bodyGeo = new THREE.CapsuleGeometry(0.3, 1, 4, 8);
    const bodyMat = new THREE.MeshStandardMaterial({ color: isEnemy ? 0xcc3333 : 0x3333cc });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.8;
    this.group.add(body);

    // Position saber relative to body
    this.saber.group.position.set(0.4, 1.2, 0.4);
    this.saber.group.rotation.x = Math.PI / 4;
    this.group.add(this.saber.group);

    if (isEnemy) {
      this.group.position.z = -5;
      this.group.rotation.y = Math.PI;
    }
  }

  public update(delta: number) {
    this.saber.update(delta);
    
    // Animation based on action
    if (this.action === 'attack') {
        this.saber.group.rotation.x = Math.sin(Date.now() * 0.015) * 1.5;
    } else if (this.action === 'block') {
        this.saber.group.rotation.x = 0;
        this.saber.group.rotation.z = Math.PI / 2;
    } else {
        this.saber.group.rotation.x = Math.PI / 4 + Math.sin(Date.now() * 0.002) * 0.1;
        this.saber.group.rotation.z = Math.sin(Date.now() * 0.003) * 0.1;
    }
  }

  public move(dir: THREE.Vector3, delta: number) {
    this.group.position.addScaledVector(dir, this.moveSpeed * delta);
  }

  public face(target: THREE.Vector3) {
    const lookTarget = new THREE.Vector3(target.x, this.group.position.y, target.z);
    this.group.lookAt(lookTarget);
  }
}
