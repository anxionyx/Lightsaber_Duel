/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameStats, DEFAULT_STATS } from '../types/GameTypes';

const STORAGE_KEY = 'lightsaber_duel_stats';

export class StorageManager {
  static loadStats(): GameStats {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : { ...DEFAULT_STATS };
    } catch (err) {
      console.error('Failed to load stats:', err);
      return { ...DEFAULT_STATS };
    }
  }

  static saveStats(stats: GameStats): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch (err) {
      console.error('Failed to save stats:', err);
    }
  }

  static updateStats(updates: Partial<GameStats>): void {
    const stats = this.loadStats();
    this.saveStats({ ...stats, ...updates });
  }

  static clearStats(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
