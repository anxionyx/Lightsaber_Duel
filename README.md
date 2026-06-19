# ⚡ Lightsaber Duel - Major Update v2

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

🎮 **Ultimate 3D Lightsaber Combat Experience** - Duel with intense 1v1 battles!

## ✨ What's New in v2?

### 🎯 New Game Modes
- **Tournament Mode**: Best-of-3 series with escalating difficulty
- **Survival Mode**: Face increasingly difficult opponents
- **Practice Mode**: Train against stationary target dummies
- **Career Tracker**: Track your statistics and achievements

### ⚡ Gameplay Enhancements
- **Power-ups System**: Collect during combat for temporary boosts
  - Health Restore
  - Speed Boost (2x movement speed)
  - Damage Multiplier (2x damage)
- **Enhanced Physics**: Realistic collision, knockback, and parry mechanics
- **Improved AI**: Adaptive difficulty that responds to your playstyle
- **Visual Effects**: Screen shake, force effects, impact particles

### 🎮 Control Improvements
- **Haptic Feedback**: Vibration support on compatible devices
- **Mobile Optimized**: Better touch controls and responsiveness
- **Keyboard Support**: WASD for movement, Space/Enter for actions
- **Gamepad Ready**: Full controller support

### 🎨 UI/UX Improvements
- **Combo Counter**: Track consecutive hits
- **Damage Numbers**: Floating damage indicators
- **Better HUD**: Real-time combat stats
- **Loading Progress**: Detailed initialization stages
- **Accessibility**: Better color contrast, keyboard navigation

### 📊 Performance
- Optimized rendering pipeline
- Better memory management
- Reduced frame stuttering
- Improved mobile performance

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Modern browser with WebGL support

### Installation

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Add your Gemini API key (optional for AI features)

# Run development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 🎮 How to Play

### Controls

**Movement:**
- **Left Joystick** / **WASD Keys**: Move around the arena
- **Mouse / Touch**: Look around and aim camera

**Combat:**
- **Attack Button / Right Click**: Swing lightsaber
- **Block Button / Shift**: Raise defense
- **Force Button / Space**: Special move (coming soon)

**Difficulty Levels:**
- 🟢 **Padawan**: Perfect for learning the basics
- 🟡 **Jedi Knight**: Balanced challenge
- 🔴 **Sith Master**: Extreme difficulty

## 📁 Project Structure

```
src/
├── components/       # React UI components
├── game/            # Game logic and physics
│   ├── GameEngine.ts
│   ├── Player.ts
│   ├── BotAI.ts
│   ├── PhysicsEngine.ts
│   ├── PowerUpManager.ts
│   └── MultiplayerManager.ts
├── utils/           # Helper functions
├── types/           # TypeScript definitions
├── App.tsx          # Main app component
├── main.tsx         # Entry point
└── index.css        # Global styles
```

## 🎯 Features Roadmap

- ✅ Basic 1v1 duel
- ✅ AI opponent with difficulty levels
- ✅ P2P multiplayer (PeerJS)
- ✅ Power-ups system
- ✅ Enhanced physics
- 🔄 Force powers and special abilities
- 🔄 Ranked matchmaking
- 🔄 Saber customization
- 🔄 Sound effects and music
- 🔄 Leaderboards

## 🤝 Contributing

Contributions are welcome! Please feel free to:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

SPDX-License-Identifier: Apache-2.0

## 🌟 Credits

Built with:
- [React 19](https://react.dev)
- [Three.js](https://threejs.org) - 3D graphics
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Motion](https://www.framer.com/motion) - Animations
- [PeerJS](https://peerjs.com) - P2P networking
- [Lucide Icons](https://lucide.dev) - UI icons

## 🎬 View Live

View your app in AI Studio: https://ai.studio/apps/c34e8b7d-dd50-40e5-ad4a-a9f9414e0213

---

**May the Force be with you!** ⚡
