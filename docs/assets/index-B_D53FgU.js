var E=Object.defineProperty;var L=(i,e,s)=>e in i?E(i,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):i[e]=s;var c=(i,e,s)=>L(i,typeof e!="symbol"?e+"":e,s);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))o(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&o(n)}).observe(document,{childList:!0,subtree:!0});function s(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerPolicy&&(r.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?r.credentials="include":t.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(t){if(t.ep)return;t.ep=!0;const r=s(t);fetch(t.href,r)}})();class B{constructor(){c(this,"grid");c(this,"score",0);c(this,"bestScore",0);c(this,"gameOver",!1);c(this,"won",!1);c(this,"tileIdCounter",0);c(this,"onGridChange");c(this,"onGameOver");c(this,"onWin");this.grid=this.createEmptyGrid(),this.loadBestScore(),this.addRandomTile(),this.addRandomTile()}setOnGridChange(e){this.onGridChange=e}setOnGameOver(e){this.onGameOver=e}setOnWin(e){this.onWin=e}createEmptyGrid(){return Array(4).fill(null).map(()=>Array(4).fill(null))}loadBestScore(){const e=localStorage.getItem("2048-best-score");e&&(this.bestScore=parseInt(e,10))}saveBestScore(){this.score>this.bestScore&&(this.bestScore=this.score,localStorage.setItem("2048-best-score",this.bestScore.toString()))}getGrid(){return this.grid}getScore(){return this.score}getBestScore(){return this.bestScore}isGameOver(){return this.gameOver}hasWon(){return this.won}addRandomTile(){const e=[];for(let r=0;r<4;r++)for(let n=0;n<4;n++)this.grid[r][n]||e.push({row:r,col:n});if(e.length===0)return;const{row:s,col:o}=e[Math.floor(Math.random()*e.length)],t=Math.random()<.9?2:4;this.grid[s][o]={value:t,id:this.tileIdCounter++}}notifyChange(){this.onGridChange&&this.onGridChange(this.grid,this.score)}move(e){if(this.gameOver)return!1;const s=this.serializeGrid();let o=!1,t=0;const r=(f,a)=>{let h=f.map(m=>[...m]);for(let m=0;m<a;m++){const d=this.createEmptyGrid();for(let g=0;g<4;g++)for(let p=0;p<4;p++)d[p][3-g]=h[g][p];h=d}return h},n=[3,2,1,0][e];let v=r(this.grid,n);for(let f=0;f<4;f++){const a=v[f].filter(d=>d!==null),h=[];let m=!1;for(let d=0;d<a.length;d++){if(m){m=!1;continue}if(d+1<a.length&&a[d].value===a[d+1].value){const g=a[d].value*2;t+=g,h.push({value:g,id:this.tileIdCounter++,mergedFrom:[a[d],a[d+1]]}),m=!0}else h.push(a[d])}for(;h.length<4;)h.push(null);v[f]=h}return v=r(v,(4-n)%4),this.serializeGrid(v)!==s&&(o=!0,this.grid=v,this.score+=t,this.saveBestScore(),this.addRandomTile(),this.notifyChange(),!this.won&&this.hasTileValue(2048)&&(this.won=!0,this.onWin&&this.onWin()),this.isGridFull()&&!this.canMove()&&(this.gameOver=!0,this.onGameOver&&this.onGameOver())),o}serializeGrid(e=this.grid){return e.map(s=>s.map(o=>o?o.value:0).join(",")).join(";")}hasTileValue(e){var s;for(let o=0;o<4;o++)for(let t=0;t<4;t++)if(((s=this.grid[o][t])==null?void 0:s.value)===e)return!0;return!1}isGridFull(){for(let e=0;e<4;e++)for(let s=0;s<4;s++)if(!this.grid[e][s])return!1;return!0}canMove(){var e,s,o,t;for(let r=0;r<4;r++)for(let n=0;n<3;n++)if(((e=this.grid[r][n])==null?void 0:e.value)===((s=this.grid[r][n+1])==null?void 0:s.value))return!0;for(let r=0;r<4;r++)for(let n=0;n<3;n++)if(((o=this.grid[n][r])==null?void 0:o.value)===((t=this.grid[n+1][r])==null?void 0:t.value))return!0;return!1}restart(){this.grid=this.createEmptyGrid(),this.score=0,this.gameOver=!1,this.won=!1,this.tileIdCounter=0,this.addRandomTile(),this.addRandomTile(),this.notifyChange()}}var u=(i=>(i[i.Up=0]="Up",i[i.Right=1]="Right",i[i.Down=2]="Down",i[i.Left=3]="Left",i))(u||{});const C=document.getElementById("app");C.innerHTML=`
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
`;const l=new B,b=document.getElementById("grid"),I=document.getElementById("score"),M=document.getElementById("bestScore"),x=document.getElementById("gameOverOverlay"),w=document.getElementById("winOverlay"),R=document.getElementById("finalScore");function y(){const i=l.getGrid();b.innerHTML="";for(let e=0;e<4;e++)for(let s=0;s<4;s++){const o=document.createElement("div");o.className="grid-cell";const t=i[e][s];if(t){const r=document.createElement("div");r.className=`tile tile-${t.value>2048?"super":t.value}`,r.textContent=t.value.toString(),t.mergedFrom&&r.classList.add("tile-merged"),o.appendChild(r)}b.appendChild(o)}}function G(){I.textContent=l.getScore().toString(),M.textContent=l.getBestScore().toString()}l.setOnGridChange((i,e)=>{y(),G()});l.setOnGameOver(()=>{R.textContent=`分数：${l.getScore()}`,x.classList.remove("hidden")});l.setOnWin(()=>{w.classList.remove("hidden")});document.getElementById("newGameBtn").addEventListener("click",()=>{l.restart(),x.classList.add("hidden"),w.classList.add("hidden")});document.getElementById("tryAgainBtn").addEventListener("click",()=>{l.restart(),x.classList.add("hidden")});document.getElementById("continueBtn").addEventListener("click",()=>{w.classList.add("hidden")});document.getElementById("newGameBtn2").addEventListener("click",()=>{l.restart(),w.classList.add("hidden")});document.addEventListener("keydown",i=>{if(!l.isGameOver())switch(i.key){case"ArrowUp":case"w":case"W":i.preventDefault(),l.move(u.Up);break;case"ArrowDown":case"s":case"S":i.preventDefault(),l.move(u.Down);break;case"ArrowLeft":case"a":case"A":i.preventDefault(),l.move(u.Left);break;case"ArrowRight":case"d":case"D":i.preventDefault(),l.move(u.Right);break}});let S=0,O=0;b.addEventListener("touchstart",i=>{S=i.touches[0].clientX,O=i.touches[0].clientY},{passive:!0});b.addEventListener("touchend",i=>{if(l.isGameOver())return;const e=i.changedTouches[0].clientX,s=i.changedTouches[0].clientY,o=e-S,t=s-O;Math.abs(o)<30&&Math.abs(t)<30||(Math.abs(o)>Math.abs(t)?o>0?l.move(u.Right):l.move(u.Left):t>0?l.move(u.Down):l.move(u.Up))},{passive:!0});y();G();
