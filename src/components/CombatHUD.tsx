/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

interface CombatHUDProps {
  playerHP: number;
  enemyHP: number;
  combo: number;
  playerDamageMultiplier: number;
  playerSpeedMultiplier: number;
  enemyDamageMultiplier: number;
  enemySpeedMultiplier: number;
}

export function CombatHUD({
  playerHP,
  enemyHP,
  combo,
  playerDamageMultiplier,
  playerSpeedMultiplier,
  enemyDamageMultiplier,
  enemySpeedMultiplier,
}: CombatHUDProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Health Bars */}
      <div className="absolute top-8 inset-x-0 flex justify-between px-8 items-start">
        {/* Player Health */}
        <div className="flex flex-col w-48">
          <span className="text-[10px] font-black tracking-widest text-white/40 mb-1">PLAYER</span>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/5">
            <motion.div
              animate={{ width: `${playerHP}%` }}
              className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]">
            </motion.div>
          </div>
          <div className="text-[10px] text-cyan-400 mt-1 font-bold">{Math.round(playerHP)} / 100</div>
          
          {/* Power-ups Status */}
          <div className="flex gap-2 mt-3">
            {playerSpeedMultiplier > 1 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-2 py-1 bg-green-500/30 border border-green-500 rounded text-[8px] font-bold">
                ⚡ SPEED
              </motion.div>
            )}
            {playerDamageMultiplier > 1 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-2 py-1 bg-red-500/30 border border-red-500 rounded text-[8px] font-bold">
                ⚔️ DMG
              </motion.div>
            )}
          </div>
        </div>

        {/* Combo Counter */}
        {combo > 0 && (
          <motion.div
            initial={{ scale: 0, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            className="text-center">
            <div className="text-6xl font-black text-yellow-400 tracking-tighter drop-shadow-lg">
              {combo}
            </div>
            <div className="text-xs font-bold text-yellow-300 uppercase tracking-widest">COMBO</div>
          </motion.div>
        )}

        {/* Enemy Health */}
        <div className="flex flex-col w-48 items-end">
          <span className="text-[10px] font-black tracking-widest text-white/40 mb-1">OPPONENT</span>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/5">
            <motion.div
              animate={{ width: `${enemyHP}%` }}
              className="h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
            </motion.div>
          </div>
          <div className="text-[10px] text-red-400 mt-1 font-bold">{Math.round(enemyHP)} / 100</div>
          
          {/* Enemy Power-ups Status */}
          <div className="flex gap-2 mt-3 justify-end">
            {enemySpeedMultiplier > 1 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-2 py-1 bg-green-500/30 border border-green-500 rounded text-[8px] font-bold">
                ⚡
              </motion.div>
            )}
            {enemyDamageMultiplier > 1 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-2 py-1 bg-red-500/30 border border-red-500 rounded text-[8px] font-bold">
                ⚔️
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
