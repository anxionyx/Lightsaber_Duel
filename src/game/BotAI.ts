import * as THREE from 'three';
import { Player } from './Player';

export type BotDifficulty = 'easy' | 'medium' | 'hard';

export class BotAI {
  private player: Player;
  private bot: Player;
  private state: 'approach' | 'retreat' | 'attack' | 'idle' = 'idle';
  private nextActionTime: number = 0;
  private difficulty: BotDifficulty;

  constructor(bot: Player, player: Player, difficulty: BotDifficulty = 'medium') {
    this.bot = bot;
    this.player = player;
    this.difficulty = difficulty;
  }

  public update(delta: number) {
    const dist = this.bot.group.position.distanceTo(this.player.group.position);
    const now = Date.now();

    if (now > this.nextActionTime) {
      if (dist > 4) {
        this.state = 'approach';
      } else if (dist < 1.2) {
        this.state = 'retreat';
      } else {
        const attackProb = this.difficulty === 'easy' ? 0.3 : (this.difficulty === 'hard' ? 0.7 : 0.5);
        this.state = Math.random() < attackProb ? 'attack' : 'idle';
      }

      const reactSpeed = this.difficulty === 'easy' ? 1200 : (this.difficulty === 'hard' ? 400 : 800);
      this.nextActionTime = now + reactSpeed + Math.random() * (reactSpeed / 2);
    }

    const moveDir = new THREE.Vector3();
    if (this.state === 'approach') {
      moveDir.subVectors(this.player.group.position, this.bot.group.position).normalize();
    } else if (this.state === 'retreat') {
      moveDir.subVectors(this.bot.group.position, this.player.group.position).normalize();
    }

    const speedMult = this.difficulty === 'easy' ? 0.7 : (this.difficulty === 'hard' ? 1.2 : 1.0);
    this.bot.move(moveDir, delta * speedMult);
    
    // In Hard mode, the bot blocks sometimes
    if (this.difficulty === 'hard' && this.state === 'idle' && dist < 2) {
        this.bot.action = 'block';
    } else {
        this.bot.action = this.state === 'attack' ? 'attack' : 'idle';
    }
    
    this.bot.saber.toggle(true);
  }
}
