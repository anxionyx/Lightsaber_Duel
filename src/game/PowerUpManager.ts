/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { Player } from './Player';

export type PowerUpType = 'health' | 'speed' | 'damage';

export interface PowerUp {
  type: PowerUpType;
  position: THREE.Vector3;
  group: THREE.Group;
  mesh: THREE.Mesh;
  collected: boolean;
}

export class PowerUpManager {
  private powerUps: PowerUp[] = [];
  private scene: THREE.Scene;
  private spawnRadius = 5;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  spawnRandomPowerUp(position: THREE.Vector3): PowerUp {
    const types: PowerUpType[] = ['health', 'speed', 'damage'];
    const type = types[Math.floor(Math.random() * types.length)];
    return this.spawnPowerUp(type, position);
  }

  spawnPowerUp(type: PowerUpType, position: THREE.Vector3): PowerUp {
    const group = new THREE.Group();
    
    let color = 0x00ff00;
    let shape: THREE.Geometry | THREE.BufferGeometry;
    
    switch (type) {
      case 'health':
        color = 0xff0000;
        shape = new THREE.BoxGeometry(0.3, 0.6, 0.1);
        break;
      case 'speed':
        color = 0x00ff00;
        shape = new THREE.IcosahedronGeometry(0.25, 2);
        break;
      case 'damage':
        color = 0xffaa00;
        shape = new THREE.TetrahedronGeometry(0.25);
        break;
    }

    const material = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      metalness: 0.7,
      roughness: 0.3,
    });

    const mesh = new THREE.Mesh(shape, material);
    mesh.position.copy(position);
    
    const light = new THREE.PointLight(color, 2, 3);
    light.position.copy(position);
    group.add(mesh);
    group.add(light);
    
    this.scene.add(group);

    const powerUp: PowerUp = {
      type,
      position: position.clone(),
      group,
      mesh,
      collected: false,
    };

    this.powerUps.push(powerUp);
    return powerUp;
  }

  update(delta: number, player: Player, enemy: Player) {
    this.powerUps.forEach((powerUp, index) => {
      if (powerUp.collected) return;

      // Rotate and bob
      powerUp.mesh.rotation.x += delta * 2;
      powerUp.mesh.rotation.y += delta * 1.5;
      powerUp.mesh.position.y += Math.sin(Date.now() * 0.001 + index) * 0.02;

      // Check collision with player
      const distToPlayer = player.group.position.distanceTo(powerUp.position);
      if (distToPlayer < 0.8) {
        this.applyPowerUp(powerUp, player);
        powerUp.collected = true;
      }

      // Check collision with enemy
      const distToEnemy = enemy.group.position.distanceTo(powerUp.position);
      if (distToEnemy < 0.8) {
        this.applyPowerUp(powerUp, enemy);
        powerUp.collected = true;
      }
    });

    // Remove collected power-ups
    this.powerUps = this.powerUps.filter((pu) => {
      if (pu.collected) {
        this.scene.remove(pu.group);
      }
      return !pu.collected;
    });
  }

  private applyPowerUp(powerUp: PowerUp, player: Player) {
    switch (powerUp.type) {
      case 'health':
        player.health = Math.min(100, player.health + 30);
        break;
      case 'speed':
        player.speedMultiplier = 2;
        setTimeout(() => (player.speedMultiplier = 1), 8000);
        break;
      case 'damage':
        player.damageMultiplier = 2;
        setTimeout(() => (player.damageMultiplier = 1), 8000);
        break;
    }
  }

  clear() {
    this.powerUps.forEach((pu) => this.scene.remove(pu.group));
    this.powerUps = [];
  }
}
