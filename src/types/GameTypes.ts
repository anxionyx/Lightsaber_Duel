/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GameMode = 'menu' | 'ai' | 'pvp_host' | 'pvp_join' | 'tournament' | 'survival' | 'practice';

export interface GameStats {
  totalDuels: number;
  wins: number;
  losses: number;
  totalDamageDealt: number;
  totalDamageReceived: number;
  hitAccuracy: number;
  longestCombo: number;
}

export interface CombatEvent {
  timestamp: number;
  attacker: 'player' | 'enemy';
  damage: number;
  type: 'hit' | 'block' | 'miss';
}

export interface ComboTracker {
  count: number;
  lastHitTime: number;
  maxCombo: number;
}

export const DEFAULT_STATS: GameStats = {
  totalDuels: 0,
  wins: 0,
  losses: 0,
  totalDamageDealt: 0,
  totalDamageReceived: 0,
  hitAccuracy: 0,
  longestCombo: 0,
};
