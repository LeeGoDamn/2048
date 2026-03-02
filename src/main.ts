import './style.css';
import { Game2048 } from './Game';
import { Direction } from './types';

const app = document.getElementById('app')!;
app.innerHTML = `
  <div class="text-center mb-6">
    <h1 class="text-6xl font-bold text-white mb-2">2048</h1>
    <p class="text-white/60 text-sm">合并数字，达到 2048！</p>
  </div>
  
  <div class="flex gap-4 mb-6">
    <div class="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/20">
      <div class="text-white/60 text-xs uppercase">分数</div>
      <div id="score" class="text-2xl font-bold text-white">0</div>
    </div>
    <div class="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/20">
      <div class="text-white/60 text-xs uppercase">最佳</div>
      <div id="bestScore" class="text-2xl font-bold text-white">0</div>
    </div>
  </div>
  
  <div class="flex gap-3 mb-6">
    <button id="newGameBtn" class="btn px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl transition-all shadow-lg">
      🔄 新游戏
    </button>
  </div>
  
  <div class="game-container relative">
    <div id="grid" class="grid-container"></div>
    <div id="gameOverOverlay" class="game-over-overlay hidden">
      <div class="text-4xl font-bold text-white mb-4">🎉 游戏结束!</div>
      <div id="finalScore" class="text-2xl text-white/80 mb-6">分数：0</div>
      <button id="tryAgainBtn" class="btn px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold rounded-xl transition-all shadow-lg text-xl">
        🔄 再来一局
      </button>
    </div>
    <div id="winOverlay" class="game-over-overlay hidden">
      <div class="text-4xl font-bold text-yellow-400 mb-4">🏆 你赢了!</div>
      <div class="text-2xl text-white/80 mb-6">达到 2048!</div>
      <button id="continueBtn" class="btn px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl transition-all shadow-lg text-xl mr-4">
        ➡️ 继续
      </button>
      <button id="newGameBtn2" class="btn px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold rounded-xl transition-all shadow-lg text-xl">
        🔄 新游戏
      </button>
    </div>
  </div>
  
  <div class="text-white/40 text-xs mt-6 bg-white/5 px-4 py-2 rounded-full">
    💡 键盘：方向键 / WASD · 手机：滑动屏幕
  </div>
`;

// 初始化游戏
const game = new Game2048();
const gridEl = document.getElementById('grid')!;
const scoreEl = document.getElementById('score')!;
const bestScoreEl = document.getElementById('bestScore')!;
const gameOverOverlay = document.getElementById('gameOverOverlay')!;
const winOverlay = document.getElementById('winOverlay')!;
const finalScoreEl = document.getElementById('finalScore')!;

// 渲染网格
function renderGrid() {
  const grid = game.getGrid();
  gridEl.innerHTML = '';
  
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      
      const tile = grid[row][col];
      if (tile) {
        const tileEl = document.createElement('div');
        tileEl.className = `tile tile-${tile.value > 2048 ? 'super' : tile.value}`;
        tileEl.textContent = tile.value.toString();
        
        if (tile.mergedFrom) {
          tileEl.classList.add('tile-merged');
        }
        
        cell.appendChild(tileEl);
      }
      
      gridEl.appendChild(cell);
    }
  }
}

// 更新分数
function updateScore() {
  scoreEl.textContent = game.getScore().toString();
  bestScoreEl.textContent = game.getBestScore().toString();
}

// 游戏状态变化回调
game.setOnGridChange((grid, score) => {
  renderGrid();
  updateScore();
});

game.setOnGameOver(() => {
  finalScoreEl.textContent = `分数：${game.getScore()}`;
  gameOverOverlay.classList.remove('hidden');
});

game.setOnWin(() => {
  winOverlay.classList.remove('hidden');
});

// 按钮事件
document.getElementById('newGameBtn')!.addEventListener('click', () => {
  game.restart();
  gameOverOverlay.classList.add('hidden');
  winOverlay.classList.add('hidden');
});

document.getElementById('tryAgainBtn')!.addEventListener('click', () => {
  game.restart();
  gameOverOverlay.classList.add('hidden');
});

document.getElementById('continueBtn')!.addEventListener('click', () => {
  winOverlay.classList.add('hidden');
});

document.getElementById('newGameBtn2')!.addEventListener('click', () => {
  game.restart();
  winOverlay.classList.add('hidden');
});

// 键盘控制
document.addEventListener('keydown', (e) => {
  if (game.isGameOver()) return;
  
  switch (e.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      e.preventDefault();
      game.move(Direction.Up);
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      e.preventDefault();
      game.move(Direction.Down);
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      e.preventDefault();
      game.move(Direction.Left);
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      e.preventDefault();
      game.move(Direction.Right);
      break;
  }
});

// 触摸滑动控制
let touchStartX = 0;
let touchStartY = 0;

gridEl.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

gridEl.addEventListener('touchend', (e) => {
  if (game.isGameOver()) return;
  
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;
  
  const dx = touchEndX - touchStartX;
  const dy = touchEndY - touchStartY;
  
  if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;
  
  if (Math.abs(dx) > Math.abs(dy)) {
    // 水平滑动
    if (dx > 0) {
      game.move(Direction.Right);
    } else {
      game.move(Direction.Left);
    }
  } else {
    // 垂直滑动
    if (dy > 0) {
      game.move(Direction.Down);
    } else {
      game.move(Direction.Up);
    }
  }
}, { passive: true });

// 初始渲染
renderGrid();
updateScore();
