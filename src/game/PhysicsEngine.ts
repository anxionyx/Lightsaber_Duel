/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

export class PhysicsEngine {
  private gravity = 0.02;
  private damping = 0.95;

  applyGravity(velocity: THREE.Vector3) {
    velocity.y -= this.gravity;
    velocity.multiplyScalar(this.damping);
  }

  checkCollision(
    pos1: THREE.Vector3,
    pos2: THREE.Vector3,
    radius1: number,
    radius2: number
  ): boolean {
    const distance = pos1.distanceTo(pos2);
    return distance < radius1 + radius2;
  }

  resolveCollision(
    pos1: THREE.Vector3,
    pos2: THREE.Vector3,
    vel1: THREE.Vector3,
    vel2: THREE.Vector3,
    mass1: number = 1,
    mass2: number = 1
  ) {
    const direction = new THREE.Vector3().subVectors(pos1, pos2).normalize();
    const distance = pos1.distanceTo(pos2);
    const overlap = (0.5 * (1 + 1)) - distance;

    if (overlap > 0) {
      pos1.addScaledVector(direction, overlap * 0.5);
      pos2.addScaledVector(direction, -overlap * 0.5);

      // Swap velocities proportionally
      const relativeVel = new THREE.Vector3().subVectors(vel1, vel2);
      const velocityAlongCollision = relativeVel.dot(direction);

      if (velocityAlongCollision < 0) {
        const restitution = 0.8;
        const impulse = (-(1 + restitution) * velocityAlongCollision) / (mass1 + mass2);
        vel1.addScaledVector(direction, impulse * mass2);
        vel2.addScaledVector(direction, -impulse * mass1);
      }
    }
  }

  calculateKnockback(
    attacker: THREE.Vector3,
    defender: THREE.Vector3,
    strength: number = 1
  ): THREE.Vector3 {
    const knockback = new THREE.Vector3().subVectors(defender, attacker).normalize();
    knockback.multiplyScalar(strength * 0.5);
    knockback.y = Math.max(knockback.y, 0.1);
    return knockback;
  }
}
