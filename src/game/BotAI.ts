import * as THREE from 'three';
import { Player } from './Player';

export class BotAI {
  private player: Player;
  private bot: Player;
  private state: 'approach' | 'retreat' | 'attack' | 'idle' = 'idle';
  private nextActionTime: number = 0;

  constructor(bot: Player, player: Player) {
    this.bot = bot;
    this.player = player;
  }

  public update(delta: number) {
    const dist = this.bot.group.position.distanceTo(this.player.group.position);
    const now = Date.now();

    if (now > this.nextActionTime) {
      if (dist > 3) {
        this.state = 'approach';
      } else if (dist < 1.5) {
        this.state = 'retreat';
      } else {
        this.state = Math.random() > 0.5 ? 'attack' : 'idle';
      }
      this.nextActionTime = now + 500 + Math.random() * 1000;
    }

    const moveDir = new THREE.Vector3();
    if (this.state === 'approach') {
      moveDir.subVectors(this.player.group.position, this.bot.group.position).normalize();
    } else if (this.state === 'retreat') {
      moveDir.subVectors(this.bot.group.position, this.player.group.position).normalize();
    }

    this.bot.move(moveDir, delta);
    this.bot.action = this.state === 'attack' ? 'attack' : 'idle';
    this.bot.saber.toggle(true);
  }
}
