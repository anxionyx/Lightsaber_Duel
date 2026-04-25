/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { Swords, Shield, Zap, Users, Monitor, Info, ArrowLeft, Send } from 'lucide-react';
import { GameEngine } from './game/GameEngine';
import { Player } from './game/Player';
import { BotAI, BotDifficulty } from './game/BotAI';
import { MultiplayerManager } from './game/MultiplayerManager';

type GameMode = 'menu' | 'ai' | 'pvp_host' | 'pvp_join';

export default function App() {
  const [mode, setMode] = useState<GameMode>('menu');
  const [botDifficulty, setBotDifficulty] = useState<BotDifficulty>('medium');
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [gameState, setGameState] = useState({ playerHP: 100, enemyHP: 100, isGameOver: false });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [peerId, setPeerId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [status, setStatus] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const playerRef = useRef<Player | null>(null);
  const enemyRef = useRef<Player | null>(null);
  const aiRef = useRef<BotAI | null>(null);
  const multiRef = useRef<MultiplayerManager | null>(null);
  const joystickRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ yaw: 0, pitch: 0 });
  const touchStartRef = useRef<{ x: number, y: number } | null>(null);
  const isGameOverRef = useRef(false);

  useEffect(() => {
    if (mode === 'menu') return;
    if (!containerRef.current) return;

    const initGame = async () => {
      setLoading(true);
      setProgress(20);
      isGameOverRef.current = false;
      setGameState({ playerHP: 100, enemyHP: 100, isGameOver: false });

      // Small delay to ensure DOM is ready and show progress
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(50);

      try {
        const engine = new GameEngine(containerRef.current!, (delta) => {
          if (isGameOverRef.current) return;
          updateGame(delta);
        });
        engineRef.current = engine;
        setProgress(70);

        const player = new Player(0x00ffff);
        engine.getScene().add(player.group);
        playerRef.current = player;

        const enemy = new Player(0xff0000, true);
        engine.getScene().add(enemy.group);
        enemyRef.current = enemy;

        player.saber.toggle(true);
        enemy.saber.toggle(true);
        setProgress(90);

        if (mode === 'ai') {
          aiRef.current = new BotAI(enemy, player, botDifficulty);
        } else {
          multiRef.current = new MultiplayerManager();
          multiRef.current.onConnected = () => setStatus('Connected!');
          
          const interval = setInterval(() => {
            if (multiRef.current?.myId) {
              setPeerId(multiRef.current.myId);
              clearInterval(interval);
            }
          }, 500);

          multiRef.current.onData = (data) => {
            if (enemyRef.current) {
              enemyRef.current.group.position.set(data.pos.x, data.pos.y, data.pos.z);
              enemyRef.current.action = data.action;
              enemyRef.current.saber.toggle(data.saberActive);
              if (data.hit) {
                playerRef.current!.health -= 10;
              }
            }
          };
        }

        setProgress(100);
        setTimeout(() => setLoading(false), 200);
      } catch (err) {
        console.error("Failed to init game:", err);
        setMode('menu');
      }
    };

    initGame();

    return () => {
      if (engineRef.current) engineRef.current.destroy();
      engineRef.current = null;
      multiRef.current = null;
      aiRef.current = null;
    };
  }, [mode]);

  const updateGame = (delta: number) => {
    if (!playerRef.current || !enemyRef.current) return;

    // Movement relative to camera
    const cameraRotation = engineRef.current!.getCameraRotation();
    const moveDir = new THREE.Vector3(joystickRef.current.x, 0, joystickRef.current.y);
    moveDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraRotation.y);
    
    playerRef.current.move(moveDir, delta);
    playerRef.current.face(enemyRef.current.group.position);
    playerRef.current.update(delta);
    
    enemyRef.current.face(playerRef.current.group.position);
    enemyRef.current.update(delta);

    // Update Camera position
    engineRef.current!.setCameraRotation(rotationRef.current.yaw, rotationRef.current.pitch);
    engineRef.current!.updateCamera(playerRef.current.group.position);

    if (aiRef.current) aiRef.current.update(delta);

    // Collision Check (Simplified)
    const dist = playerRef.current.group.position.distanceTo(enemyRef.current.group.position);
    const pAction = playerRef.current.action;
    const eAction = enemyRef.current.action;

    if (dist < 1.5) {
        if (pAction === 'attack' && eAction !== 'block') {
            enemyRef.current.health -= 0.8;
        }
        if (eAction === 'attack' && pAction !== 'block') {
            playerRef.current.health -= 0.8;
        }
    }

    const isOver = playerRef.current.health <= 0 || enemyRef.current.health <= 0;
    if (isOver) isGameOverRef.current = true;

    setGameState({
      playerHP: Math.max(0, playerRef.current.health),
      enemyHP: Math.max(0, enemyRef.current.health),
      isGameOver: isOver,
    });

    if (multiRef.current) {
      multiRef.current.send({
        pos: playerRef.current.group.position,
        action: playerRef.current.action,
        saberActive: true,
        hit: false, // In a real app we'd send events
      });
    }
  };

  const setAction = (action: any) => {
    if (playerRef.current) playerRef.current.action = action;
  };

  const toggleSaber = () => {
    if (playerRef.current) playerRef.current.saber.toggle(true);
  };

  return (
    <div className="w-full h-screen bg-black overflow-hidden touch-none select-none text-white font-sans">
      <AnimatePresence mode="wait">
        {mode === 'menu' ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-full space-y-8 bg-gradient-to-b from-blue-900/20 to-black p-4"
          >
            <motion.h1 
              initial={{ y: -50 }} animate={{ y: 0 }}
              className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-200"
            >
              SABER DUEL
            </motion.h1>
            
            <div className="flex flex-col space-y-4 w-full max-w-md">
              <MenuButton icon={<Monitor size={24} />} title="Player vs Robot" onClick={() => setShowDifficultyModal(true)} />
              <MenuButton icon={<Users size={24} />} title="Human vs Human (P2P)" onClick={() => setMode('pvp_host')} />
              <div className="text-xs text-center text-gray-500 mt-4 px-8">
                Master the force. Move with left stick, strike with right controls.
              </div>
            </div>

            {/* Difficulty Selection Modal */}
            <AnimatePresence>
              {showDifficultyModal && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                >
                  <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="bg-zinc-900 border border-white/10 p-8 rounded-3xl w-full max-w-sm space-y-8"
                  >
                    <div className="text-center space-y-2">
                       <h2 className="text-3xl font-black italic tracking-tighter text-cyan-400">SELECT INTENSITY</h2>
                       <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">How strong is the force in this one?</p>
                    </div>

                    <div className="space-y-3">
                      <DifficultyOption 
                        label="Padawan" 
                        desc="Calm and predictable movements." 
                        active={botDifficulty === 'easy'} 
                        onClick={() => { setBotDifficulty('easy'); setMode('ai'); setShowDifficultyModal(false); }} 
                        color="border-cyan-400"
                      />
                      <DifficultyOption 
                        label="Jedi Knight" 
                        desc="Balanced offense and defense." 
                        active={botDifficulty === 'medium'} 
                        onClick={() => { setBotDifficulty('medium'); setMode('ai'); setShowDifficultyModal(false); }} 
                        color="border-yellow-400"
                      />
                      <DifficultyOption 
                        label="Sith Master" 
                        desc="Aggressive strikes and lethal precision." 
                        active={botDifficulty === 'hard'} 
                        onClick={() => { setBotDifficulty('hard'); setMode('ai'); setShowDifficultyModal(false); }} 
                        color="border-red-500"
                      />
                    </div>
                    
                    <button 
                      onClick={() => setShowDifficultyModal(false)}
                      className="w-full text-sm font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest pt-2"
                    >
                      Back to Hangar
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div 
            className="relative w-full h-full"
            onPointerDown={(e) => {
              // Only start swipe if not on controls
              const target = e.target as HTMLElement;
              if (target === containerRef.current || target.classList.contains('absolute')) {
                touchStartRef.current = { x: e.clientX, y: e.clientY };
              }
            }}
            onPointerMove={(e) => {
              if (touchStartRef.current) {
                const dx = e.clientX - touchStartRef.current.x;
                const dy = e.clientY - touchStartRef.current.y;
                rotationRef.current.yaw -= dx * 0.005;
                rotationRef.current.pitch -= dy * 0.005;
                touchStartRef.current = { x: e.clientX, y: e.clientY };
              }
            }}
            onPointerUp={() => touchStartRef.current = null}
            onPointerLeave={() => touchStartRef.current = null}
          >
            <div ref={containerRef} className="absolute inset-0" />
            
            {/* HUD */}
            <div className="absolute top-8 inset-x-0 flex justify-between px-8 items-start pointer-events-none">
              <HealthBar label="YOU" hp={gameState.playerHP} color="bg-cyan-400" />
              <div className="flex flex-col items-center">
                 <div className="text-xs font-bold tracking-widest text-cyan-200 uppercase mb-1">Combat Zone</div>
                 <button onClick={() => setMode('menu')} className="pointer-events-auto bg-black/40 border border-white/20 p-2 rounded-full hover:bg-white/10 transition-colors">
                    <ArrowLeft size={16} />
                 </button>
              </div>
              <HealthBar label="OPPONENT" hp={gameState.enemyHP} color="bg-red-500" right />
            </div>

            {/* Controls */}
            <div className="absolute bottom-20 inset-x-0 px-8 flex justify-between items-end pointer-events-none">
              {/* Left Joystick */}
              <div 
                className="w-32 h-32 bg-white/5 border border-white/20 rounded-full flex items-center justify-center relative touch-none pointer-events-auto"
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                }}
                onPointerMove={(e) => {
                  if (e.buttons === 0) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = (e.clientX - rect.left - 64) / 64;
                  const y = (e.clientY - rect.top - 64) / 64;
                  joystickRef.current = { x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) };
                }}
                onPointerUp={(e) => {
                  e.currentTarget.releasePointerCapture(e.pointerId);
                  joystickRef.current = { x: 0, y: 0 };
                }}
              >
                <div className="w-12 h-12 bg-white/20 rounded-full border border-white/40 shadow-xl" style={{ transform: `translate(${joystickRef.current.x * 32}px, ${joystickRef.current.y * 32}px)` }} />
              </div>

              {/* Right Action Buttons */}
              <div className="flex space-x-4 pointer-events-auto">
                <ActionButton icon={<Shield />} label="BLOCK" onDown={() => setAction('block')} onUp={() => setAction('idle')} />
                <ActionButton icon={<Swords />} label="ATTACK" onDown={() => setAction('attack')} onUp={() => setAction('idle')} color="bg-cyan-500" />
              </div>
            </div>

            {/* Multiplayer Setup Modal (if in pvp mode) */}
            {mode === 'pvp_host' && !status && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4">
                <div className="bg-zinc-900 border border-white/10 p-8 rounded-2xl w-full max-w-sm space-y-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2"><Users className="text-cyan-400" /> Initiate Duel</h2>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Your Secret Code</label>
                    <div className="bg-black/50 p-4 rounded-lg font-mono text-cyan-300 break-all border border-cyan-900/30">
                      {peerId || 'Generating...'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Opponent's Code</label>
                    <input 
                      className="w-full bg-black/50 p-4 rounded-lg border border-white/10 focus:border-cyan-500 outline-none transition-colors"
                      placeholder="Paste code here..."
                      value={targetId}
                      onChange={(e) => setTargetId(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={() => multiRef.current?.connect(targetId)}
                    className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Zap size={18} /> Connect Gear
                  </button>
                  <button onClick={() => setMode('menu')} className="w-full text-sm text-zinc-500 hover:text-white transition-colors">Cancel</button>
                </div>
              </div>
            )}

            {/* Game Over Message */}
            {gameState.isGameOver && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                 <motion.h2 initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="text-6xl font-black italic mb-8 tracking-tighter">
                    {gameState.playerHP > 0 ? 'VICTORY' : 'DEFEATED'}
                 </motion.h2>
                 <button onClick={() => setMode('menu')} className="px-12 py-4 bg-white text-black font-bold tracking-widest uppercase rounded-full hover:scale-105 active:scale-95 transition-transform">
                    Return to Hangar
                 </button>
              </div>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-8"
          >
            <div className="w-full max-w-xs space-y-4">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center font-black tracking-tighter text-cyan-400 text-2xl mb-4"
              >
                INITIALIZING GEAR...
              </motion.div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold tracking-widest text-white/30 uppercase">
                <span>Calibrating Crystals</span>
                <span>{progress}%</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DifficultyOption({ label, desc, active, onClick, color }: { label: string, desc: string, active: boolean, onClick: () => void, color: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full p-4 rounded-2xl border-2 transition-all text-left space-y-1 ${active ? `${color} bg-white/5` : 'border-white/5 hover:border-white/20 bg-white/0'}`}
    >
      <div className={`text-xl font-black italic tracking-tighter ${active ? 'text-white' : 'text-zinc-500'}`}>{label}</div>
      <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{desc}</div>
    </button>
  );
}

function MenuButton({ icon, title, onClick }: { icon: any, title: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="group flex items-center justify-between w-full p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-cyan-500/50 transition-all duration-300"
    >
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className="text-xl font-bold tracking-tight">{title}</span>
      </div>
      <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black transition-colors">
        →
      </div>
    </button>
  );
}

function HealthBar({ label, hp, color, right = false }: { label: string, hp: number, color: string, right?: boolean }) {
  return (
    <div className={`flex flex-col w-48 ${right ? 'items-end' : 'items-start'}`}>
      <span className="text-[10px] font-black tracking-widest text-white/40 mb-1">{label}</span>
      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/5">
        <motion.div 
          initial={{ width: '100%' }}
          animate={{ width: `${hp}%` }}
          className={`h-full ${color} shadow-[0_0_10px_rgba(34,211,238,0.5)]`}
        />
      </div>
    </div>
  );
}

function ActionButton({ icon, label, onDown, onUp, color = "bg-white/10" }: { icon: any, label: string, onDown: () => void, onUp: () => void, color?: string }) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <button 
        onPointerDown={onDown} onPointerUp={onUp}
        className={`w-20 h-20 grow-0 shrink-0 ${color} rounded-2xl flex items-center justify-center active:scale-90 transition-transform border border-white/10`}
      >
        {icon}
      </button>
      <span className="text-[10px] font-bold tracking-widest text-white/40">{label}</span>
    </div>
  );
}
