(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const d of s.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&o(d)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();class O{grid;score=0;bestScore=0;gameOver=!1;won=!1;tileIdCounter=0;onGridChange;onGameOver;onWin;constructor(){this.grid=this.createEmptyGrid(),this.loadBestScore(),this.addRandomTile(),this.addRandomTile()}setOnGridChange(e){this.onGridChange=e}setOnGameOver(e){this.onGameOver=e}setOnWin(e){this.onWin=e}createEmptyGrid(){return Array(4).fill(null).map(()=>Array(4).fill(null))}loadBestScore(){const e=localStorage.getItem("2048-best-score");e&&(this.bestScore=parseInt(e,10))}saveBestScore(){this.score>this.bestScore&&(this.bestScore=this.score,localStorage.setItem("2048-best-score",this.bestScore.toString()))}getGrid(){return this.grid}getScore(){return this.score}getBestScore(){return this.bestScore}isGameOver(){return this.gameOver}hasWon(){return this.won}addRandomTile(){const e=[];for(let s=0;s<4;s++)for(let d=0;d<4;d++)this.grid[s][d]||e.push({row:s,col:d});if(e.length===0)return;const{row:t,col:o}=e[Math.floor(Math.random()*e.length)],r=Math.random()<.9?2:4;this.grid[t][o]={value:r,id:this.tileIdCounter++}}notifyChange(){this.onGridChange&&this.onGridChange(this.grid,this.score)}move(e){if(this.gameOver)return!1;const t=this.serializeGrid();let o=!1,r=0;const s=(v,a)=>{let c=v.map(u=>[...u]);for(let u=0;u<a;u++){const l=this.createEmptyGrid();for(let m=0;m<4;m++)for(let f=0;f<4;f++)l[f][3-m]=c[m][f];c=l}return c},d=[3,2,1,0][e];let g=s(this.grid,d);for(let v=0;v<4;v++){const a=g[v].filter(l=>l!==null),c=[];let u=!1;for(let l=0;l<a.length;l++){if(u){u=!1;continue}if(l+1<a.length&&a[l].value===a[l+1].value){const m=a[l].value*2;r+=m,c.push({value:m,id:this.tileIdCounter++,mergedFrom:[a[l],a[l+1]]}),u=!0}else c.push(a[l])}for(;c.length<4;)c.push(null);g[v]=c}return g=s(g,(4-d)%4),this.serializeGrid(g)!==t&&(o=!0,this.grid=g,this.score+=r,this.saveBestScore(),this.addRandomTile(),this.notifyChange(),!this.won&&this.hasTileValue(2048)&&(this.won=!0,this.onWin&&this.onWin()),this.isGridFull()&&!this.canMove()&&(this.gameOver=!0,this.onGameOver&&this.onGameOver())),o}serializeGrid(e=this.grid){return e.map(t=>t.map(o=>o?o.value:0).join(",")).join(";")}hasTileValue(e){for(let t=0;t<4;t++)for(let o=0;o<4;o++)if(this.grid[t][o]?.value===e)return!0;return!1}isGridFull(){for(let e=0;e<4;e++)for(let t=0;t<4;t++)if(!this.grid[e][t])return!1;return!0}canMove(){for(let e=0;e<4;e++)for(let t=0;t<3;t++)if(this.grid[e][t]?.value===this.grid[e][t+1]?.value)return!0;for(let e=0;e<4;e++)for(let t=0;t<3;t++)if(this.grid[t][e]?.value===this.grid[t+1][e]?.value)return!0;return!1}restart(){this.grid=this.createEmptyGrid(),this.score=0,this.gameOver=!1,this.won=!1,this.tileIdCounter=0,this.addRandomTile(),this.addRandomTile(),this.notifyChange()}}var h=(i=>(i[i.Up=0]="Up",i[i.Right=1]="Right",i[i.Down=2]="Down",i[i.Left=3]="Left",i))(h||{});const E=document.getElementById("app");E.innerHTML=`
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
`;const n=new O,p=document.getElementById("grid"),L=document.getElementById("score"),B=document.getElementById("bestScore"),w=document.getElementById("gameOverOverlay"),b=document.getElementById("winOverlay"),C=document.getElementById("finalScore");function x(){const i=n.getGrid();p.innerHTML="";for(let e=0;e<4;e++)for(let t=0;t<4;t++){const o=document.createElement("div");o.className="grid-cell";const r=i[e][t];if(r){const s=document.createElement("div");s.className=`tile tile-${r.value>2048?"super":r.value}`,s.textContent=r.value.toString(),r.mergedFrom&&s.classList.add("tile-merged"),o.appendChild(s)}p.appendChild(o)}}function y(){L.textContent=n.getScore().toString(),B.textContent=n.getBestScore().toString()}n.setOnGridChange((i,e)=>{x(),y()});n.setOnGameOver(()=>{C.textContent=`分数：${n.getScore()}`,w.classList.remove("hidden")});n.setOnWin(()=>{b.classList.remove("hidden")});document.getElementById("newGameBtn").addEventListener("click",()=>{n.restart(),w.classList.add("hidden"),b.classList.add("hidden")});document.getElementById("tryAgainBtn").addEventListener("click",()=>{n.restart(),w.classList.add("hidden")});document.getElementById("continueBtn").addEventListener("click",()=>{b.classList.add("hidden")});document.getElementById("newGameBtn2").addEventListener("click",()=>{n.restart(),b.classList.add("hidden")});document.addEventListener("keydown",i=>{if(!n.isGameOver())switch(i.key){case"ArrowUp":case"w":case"W":i.preventDefault(),n.move(h.Up);break;case"ArrowDown":case"s":case"S":i.preventDefault(),n.move(h.Down);break;case"ArrowLeft":case"a":case"A":i.preventDefault(),n.move(h.Left);break;case"ArrowRight":case"d":case"D":i.preventDefault(),n.move(h.Right);break}});let G=0,S=0;p.addEventListener("touchstart",i=>{G=i.touches[0].clientX,S=i.touches[0].clientY},{passive:!0});p.addEventListener("touchend",i=>{if(n.isGameOver())return;const e=i.changedTouches[0].clientX,t=i.changedTouches[0].clientY,o=e-G,r=t-S;Math.abs(o)<30&&Math.abs(r)<30||(Math.abs(o)>Math.abs(r)?o>0?n.move(h.Right):n.move(h.Left):r>0?n.move(h.Down):n.move(h.Up))},{passive:!0});x();y();
