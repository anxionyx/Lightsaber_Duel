import * as THREE from 'three';

export interface GameState {
  playerHP: number;
  enemyHP: number;
  isGameOver: boolean;
  winner: 'player' | 'enemy' | null;
}

export type CombatAction = 'idle' | 'attack' | 'parry' | 'block';

export interface PlayerData {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  action: CombatAction;
  bladeActive: boolean;
}
