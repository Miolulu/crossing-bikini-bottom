# -*- coding: utf-8 -*-
import os

HERE = os.path.dirname(os.path.abspath(__file__))
def b64(name):
    return open(os.path.join(HERE, name), "r").read().strip()

OPENING = b64("01-opening.b64")
MAP = b64("02-map.b64")
INTERIOR = b64("08-krusty-krab-interior.b64")

TEMPLATE = r"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<title>比奇堡的一天 · Demo v0.1</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
  :root{
    --sea:#0a6e8c; --sea2:#0b4f6b; --foam:#bdeaf5; --sand:#e9d8a6;
    --ink:#0a2a3a; --bubble:#9fe3f0; --gold:#ffcf4d; --coral:#ff7a59;
  }
  html,body{height:100%;overflow:hidden;background:#04222e;font-family:"PingFang SC","Microsoft YaHei",system-ui,sans-serif;color:#eaf6fb;-webkit-user-select:none;user-select:none}
  #app{position:fixed;inset:0;overflow:hidden}
  .screen{position:absolute;inset:0;display:none;flex-direction:column}
  .screen.on{display:flex}

  /* ---------- 开场 ---------- */
  #opening{background:#04222e}
  #opening .bg{position:absolute;inset:0;background-image:url(__OPENING__);background-size:cover;background-position:center;opacity:.55;filter:saturate(1.1)}
  #opening .water{position:absolute;left:0;right:0;top:0;height:0%;background:linear-gradient(180deg,rgba(11,79,107,.92),rgba(10,110,140,.78) 60%,rgba(11,79,107,.95));transition:height 2.6s cubic-bezier(.4,0,.2,1);z-index:2}
  #opening .title{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:3;text-align:center;opacity:1}
  #opening .title h1{font-size:clamp(30px,8vw,64px);letter-spacing:.18em;text-shadow:0 4px 18px rgba(0,0,0,.5);color:#fff}
  #opening .title p{margin-top:14px;font-size:clamp(13px,3.4vw,18px);color:#bdeaf5;letter-spacing:.12em}
  #opening .go{margin-top:34px;font-size:14px;color:#ffcf4d;opacity:0;animation:blink 1.6s infinite}
  @keyframes blink{50%{opacity:.25}}
  .bub{position:absolute;bottom:-40px;border-radius:50%;background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.9),rgba(159,227,240,.25));z-index:4;animation:rise linear infinite}
  @keyframes rise{to{transform:translateY(-115vh) translateX(20px);opacity:0}}

  /* ---------- 身份抽取 ---------- */
  #identity{background:radial-gradient(ellipse at 50% 30%,#0e7a9a,#063347);align-items:center;justify-content:center;padding:24px}
  .card{width:min(360px,86vw);background:rgba(255,255,255,.08);border:1px solid rgba(159,227,240,.35);border-radius:22px;padding:26px 22px;text-align:center;backdrop-filter:blur(6px);box-shadow:0 18px 50px rgba(0,0,0,.4)}
  .card .hint{color:#bdeaf5;font-size:14px;min-height:22px;margin-bottom:16px}
  .card .face{font-size:72px;line-height:1;margin:6px 0 8px;filter:drop-shadow(0 6px 10px rgba(0,0,0,.4))}
  .card .nm{font-size:24px;font-weight:700}
  .card .rar{font-size:13px;color:#8fb8cc;margin-top:4px;letter-spacing:.1em}
  .card .ds{font-size:13.5px;color:#dff1f7;margin-top:14px;line-height:1.7;min-height:64px}
  .btn{margin-top:20px;display:inline-block;background:linear-gradient(180deg,#ffd564,#f3a83a);color:#5a3500;font-weight:800;border:none;border-radius:999px;padding:13px 30px;font-size:16px;cursor:pointer;box-shadow:0 8px 18px rgba(243,168,58,.4);transition:transform .1s}
  .btn:active{transform:scale(.95)}
  .btn.ghost{background:rgba(255,255,255,.12);color:#dff1f7;box-shadow:none;margin-left:8px}

  /* ---------- HUD ---------- */
  .hud{position:absolute;top:0;left:0;right:0;z-index:30;display:flex;align-items:center;gap:8px;padding:10px 12px;background:linear-gradient(180deg,rgba(4,34,46,.7),transparent);font-size:13px}
  .hud .me{background:rgba(255,255,255,.14);border-radius:999px;padding:6px 12px;display:flex;align-items:center;gap:6px;max-width:60%}
  .hud .me b{font-weight:700}
  .hud .spacer{flex:1}
  .hud .pill{background:rgba(255,255,255,.12);border-radius:999px;padding:6px 12px;cursor:pointer}
  .toast{position:absolute;left:50%;top:64px;transform:translateX(-50%);background:rgba(4,34,46,.92);border:1px solid rgba(159,227,240,.3);padding:9px 16px;border-radius:12px;font-size:13px;z-index:60;opacity:0;transition:opacity .25s;pointer-events:none;max-width:80vw;text-align:center}

  /* ---------- 街道 (2.5D) ---------- */
  #street{background:#063347}
  #street .world{position:absolute;inset:0;background-image:url(__MAP__);background-size:cover;background-position:center bottom;overflow:hidden}
  #street .world::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,51,71,.15),rgba(6,51,71,.55) 78%,rgba(6,51,71,.85))}
  .token{position:absolute;z-index:10;transform:translate(-50%,-100%);text-align:center;cursor:pointer}
  .token .spr{font-size:46px;line-height:1;filter:drop-shadow(0 6px 6px rgba(0,0,0,.45));transition:transform .12s}
  .token:active .spr{transform:scale(1.12)}
  .token .tag{margin-top:2px;font-size:11px;background:rgba(4,34,46,.8);border-radius:8px;padding:1px 7px;white-space:nowrap;display:inline-block}
  .shadow{position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);width:42px;height:12px;background:rgba(0,0,0,.35);border-radius:50%;filter:blur(2px)}
  .player{z-index:20}
  .player .spr{font-size:42px}
  .player .nametag{font-size:11px;background:#ffcf4d;color:#5a3500;border-radius:8px;padding:2px 8px;font-weight:700;white-space:nowrap;display:inline-block;margin-top:2px}
  .bubble{position:absolute;z-index:40;background:#fff;color:#0a2a3a;border-radius:14px;padding:9px 13px;font-size:13px;line-height:1.5;max-width:200px;box-shadow:0 8px 20px rgba(0,0,0,.35);transform:translate(-50%,-100%);opacity:0;transition:opacity .2s,transform .2s;pointer-events:none}
  .bubble.show{opacity:1;transform:translate(-50%,-115%)}
  .bubble:after{content:"";position:absolute;left:50%;bottom:-7px;transform:translateX(-50%);border:7px solid transparent;border-top-color:#fff}
  .bubble .who{font-weight:800;color:#0b6e8c;display:block;margin-bottom:2px;font-size:12px}
  .hot{position:absolute;z-index:9;transform:translate(-50%,-50%);border:2px dashed rgba(255,207,77,.0);border-radius:14px;cursor:pointer}
  .hot .lbl{position:absolute;left:50%;top:-26px;transform:translateX(-50%);background:rgba(4,34,46,.85);color:#ffcf4d;font-size:11px;padding:2px 9px;border-radius:8px;white-space:nowrap;opacity:0;transition:opacity .2s}
  .hot:active .lbl,.hot:hover .lbl{opacity:1}
  .dpad{position:absolute;left:14px;bottom:18px;z-index:30;display:grid;grid-template-columns:repeat(3,46px);grid-template-rows:repeat(3,46px);gap:6px}
  .dpad div{background:rgba(255,255,255,.14);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;color:#eaf6fb;cursor:pointer}
  .dpad div:active{background:rgba(255,207,77,.5)}
  .dpad .up{grid-area:1/2}.dpad .left{grid-area:2/1}.dpad .right{grid-area:2/3}.dpad .down{grid-area:3/2}
  .hintbar{position:absolute;right:12px;bottom:22px;z-index:30;font-size:11px;color:#bdeaf5;background:rgba(4,34,46,.6);padding:6px 10px;border-radius:10px;max-width:42vw;line-height:1.5}

  /* ---------- 蟹堡王 ---------- */
  #krusty{background:#063347}
  #krusty .room{position:absolute;inset:0;background-image:url(__INTERIOR__);background-size:cover;background-position:center;overflow:hidden}
  #krusty .room::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,51,71,.1),rgba(6,51,71,.4))}
  .ticket{position:absolute;top:64px;left:50%;transform:translateX(-50%);z-index:20;background:#fff;color:#0a2a3a;border-radius:12px;padding:10px 18px;text-align:center;box-shadow:0 10px 24px rgba(0,0,0,.4);font-size:14px;min-width:170px}
  .ticket b{font-size:22px;color:#c0392b}
  .ticket .small{font-size:12px;color:#5a6b72}
  .callbtn{position:absolute;top:150px;left:50%;transform:translateX(-50%);z-index:20}
  .stage{position:absolute;left:50%;top:54%;transform:translate(-50%,-50%);z-index:15;width:240px;height:240px;perspective:700px;display:flex;align-items:center;justify-content:center}
  .burger{position:relative;width:170px;height:170px;transform-style:preserve-3d;transform:rotateX(-16deg) rotateY(0deg);transition:transform .15s}
  .layer{position:absolute;left:50%;border-radius:50%;box-shadow:0 6px 10px rgba(0,0,0,.3)}
  .l-top{top:8px;width:150px;height:64px;background:linear-gradient(180deg,#f4c069,#e0a23c);transform:translateX(-50%);border-radius:50% 50% 46% 46%/70% 70% 40% 40%}
  .l-top:before{content:"";position:absolute;inset:6px 10px auto 10px;height:10px;background:repeating-linear-gradient(90deg,#fff 0 4px,transparent 4px 9px);opacity:.7;border-radius:6px}
  .l-lett{top:56px;width:166px;height:26px;background:linear-gradient(180deg,#7fbf5a,#5e9c3f);transform:translateX(-50%);border-radius:40%}
  .l-cheese{top:74px;width:172px;height:24px;background:linear-gradient(180deg,#ffd84d,#f0b429);transform:translateX(-50%);border-radius:40%;clip-path:polygon(0 40%,12% 10%,26% 45%,40% 8%,55% 45%,70% 12%,84% 45%,100% 30%,100% 100%,0 100%)}
  .l-patty{top:92px;width:160px;height:34px;background:linear-gradient(180deg,#7a4326,#5a2f18);transform:translateX(-50%);border-radius:46%}
  .l-bot{top:120px;width:150px;height:52px;background:linear-gradient(180deg,#e0a23c,#c9882c);transform:translateX(-50%);border-radius:46% 46% 50% 50%/40% 40% 70% 70%}
  .plate{position:absolute;left:50%;top:150px;width:200px;height:40px;background:radial-gradient(ellipse,rgba(255,255,255,.85),rgba(255,255,255,.2));transform:translateX(-50%);border-radius:50%;box-shadow:0 10px 18px rgba(0,0,0,.35)}
  .crumb{position:absolute;width:9px;height:9px;border-radius:2px;z-index:30;pointer-events:none}
  .controls{position:absolute;left:50%;bottom:24px;transform:translateX(-50%);z-index:25;display:flex;gap:10px;align-items:center}
  .controls .btn{padding:11px 22px;font-size:15px;margin-top:0}
  .bite-text{position:absolute;left:50%;bottom:84px;transform:translateX(-50%);z-index:25;font-size:13px;color:#eaf6fb;background:rgba(4,34,46,.7);padding:7px 14px;border-radius:10px;max-width:80vw;text-align:center}
  .spin-hint{position:absolute;left:50%;top:30%;transform:translate(-50%,-50%);z-index:18;font-size:12px;color:#bdeaf5;background:rgba(4,34,46,.6);padding:5px 12px;border-radius:10px;pointer-events:none;animation:blink 2s infinite}
</style>
</head>
<body>
<div id="app">

  <!-- 开场 -->
  <section id="opening" class="screen on">
    <div class="bg"></div>
    <div class="water" id="water"></div>
    <div class="title" id="otitle">
      <h1>正在前往比奇堡</h1>
      <p>A DAY IN BIKINI BOTTOM</p>
      <div class="go" id="ogo">点击任意处 · 沉入海底</div>
    </div>
  </section>

  <!-- 身份 -->
  <section id="identity" class="screen">
    <div class="card">
      <div class="hint" id="idHint">泡泡正在下沉……</div>
      <div class="face" id="idFace">🫧</div>
      <div class="nm" id="idName">？</div>
      <div class="rar" id="idRar"></div>
      <div class="ds" id="idDesc"></div>
      <button class="btn" id="idBtn">抽一个身份</button>
      <button class="btn ghost" id="idReset" style="display:none">再抽一次</button>
    </div>
  </section>

  <!-- 街道 -->
  <section id="street" class="screen">
    <div class="hud">
      <div class="me"><span id="hudFace">🐟</span><b id="hudName">居民</b></div>
      <div class="spacer"></div>
      <div class="pill" id="toKrusty">🍔 蟹堡王</div>
      <div class="pill" id="backHome">↺ 重抽</div>
    </div>
    <div class="world" id="world">
      <!-- hotspots + tokens 由 JS 注入 -->
      <div class="bubble" id="npcBubble"><span class="who"></span><span class="line"></span></div>
    </div>
    <div class="toast" id="toast"></div>
    <div class="dpad">
      <div class="up" data-dir="up">▲</div>
      <div class="left" data-dir="left">◀</div>
      <div class="right" data-dir="right">▶</div>
      <div class="down" data-dir="down">▼</div>
    </div>
    <div class="hintbar">点地面移动 · 点角色聊天 · 点建筑进入</div>
  </section>

  <!-- 蟹堡王 -->
  <section id="krusty" class="screen">
    <div class="hud">
      <div class="me"><span id="kFace">🐟</span><b id="kName">居民</b></div>
      <div class="spacer"></div>
      <div class="pill" id="backStreet">← 回到街道</div>
    </div>
    <div class="room"></div>
    <div class="ticket" id="ticket" style="display:none"></div>
    <button class="btn callbtn" id="getBurger" style="display:none">取餐</button>
    <div class="stage" id="stage" style="display:none">
      <div class="plate"></div>
      <div class="burger" id="burger">
        <div class="layer l-top" data-l="1"></div>
        <div class="layer l-lett" data-l="2"></div>
        <div class="layer l-cheese" data-l="3"></div>
        <div class="layer l-patty" data-l="4"></div>
        <div class="layer l-bot" data-l="5"></div>
      </div>
      <div class="spin-hint" id="spinHint">拖动旋转查看</div>
    </div>
    <div class="bite-text" id="biteText" style="display:none"></div>
    <div class="controls" id="kControls" style="display:none">
      <button class="btn" id="biteBtn">咬一口</button>
    </div>
  </section>

</div>

<script>
(function(){
  "use strict";
  var $ = function(s){return document.querySelector(s);};
  function show(id){document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('on');});$('#'+id).classList.add('on');}

  /* ===== 身份池 ===== */
  var POOL = [
    {p:88, name:'普通比奇堡居民', face:'🐟', rar:'★☆☆ 常见', desc:'你是这条街上 88% 的人之一。名字随机，职业随机，但你确实住在这儿。', color:'#8FB8CC'},
    {p:4,  name:'珊迪 · Sandy', face:'🐿️', rar:'★★☆ 稀有', desc:'德州松鼠科学家。移动最快，NPC 对你格外客气。', color:'#FFD23F'},
    {p:3,  name:'珍珍 · Pearl', face:'🐳', rar:'★★☆ 稀有', desc:'蟹老板的女儿。蟹老板见到你会立刻免单。', color:'#FF8FB1'},
    {p:2.5,name:'痞老板 · Plankton', face:'🟢', rar:'★★★ 极稀有', desc:'只有一只眼，身高是别人六分之一。全镇都防着你。', color:'#3F8C5A'},
    {p:1.5,name:'泡芙老师 · Mrs.Puff', face:'🐡', rar:'★★☆ 稀有', desc:'驾校老师，一受惊就膨胀成球。', color:'#7FB2D8'},
    {p:1,  name:'小蜗 · Gary', face:'🐌', rar:'★★★ 极稀有', desc:'你只能"喵"。移动慢，章鱼哥却因此对你最好。', color:'#C7A1E8'}
  ];
  var TOTAL = POOL.reduce(function(s,x){return s+x.p;},0);
  function pick(){var r=Math.random()*TOTAL,a=0;for(var i=0;i<POOL.length;i++){a+=POOL[i].p;if(r<=a)return POOL[i];}return POOL[0];}
  var ME = null;

  /* ===== 开场 ===== */
  var started=false;
  $('#opening').addEventListener('click', function(){
    if(started) return; started=true;
    $('#water').style.height='100%';
    $('#otitle').style.opacity='1';
    setTimeout(function(){show('identity');}, 2700);
  });

  /* ===== 身份抽取 ===== */
  var idBusy=false;
  function drawIdentity(){
    if(idBusy) return; idBusy=true;
    $('#idHint').textContent='泡泡正在下沉……';
    $('#idFace').textContent='🫧'; $('#idName').textContent='？'; $('#idRar').textContent=''; $('#idDesc').textContent='';
    $('#idBtn').style.display='none'; $('#idReset').style.display='none';
    setTimeout(function(){
      var it=pick(); ME=it;
      $('#idHint').textContent='你成为了——';
      $('#idFace').textContent=it.face;
      $('#idName').textContent=it.name; $('#idName').style.color=it.color;
      $('#idRar').textContent=it.rar; $('#idDesc').textContent=it.desc;
      $('#idReset').style.display='inline-block';
      $('#idBtn').textContent='进入比奇堡 →'; $('#idBtn').style.display='inline-block';
      idBusy=false;
    }, 700);
  }
  $('#idBtn').addEventListener('click', function(){
    if($('#idBtn').textContent.indexOf('进入')>=0){ enterStreet(); }
    else { drawIdentity(); }
  });
  $('#idReset').addEventListener('click', function(){ drawIdentity(); });

  /* ===== 街道 ===== */
  var world=$('#world');
  var player=null, px=52, py=84;
  function enterStreet(){
    show('street');
    $('#hudFace').textContent=ME.face; $('#hudName').textContent=ME.name;
    if(!player){ buildStreet(); }
    placePlayer(px,py,true);
  }
  function buildStreet(){
    // 建筑热点
    var spots=[
      {x:50,y:46,label:'🍔 蟹堡王',act:'krusty'},
      {x:18,y:58,label:'🪣 海之霸',act:'locked'},
      {x:80,y:60,label:'🍍 凤梨屋',act:'locked'},
      {x:34,y:66,label:'🗿 石像屋',act:'locked'},
      {x:64,y:64,label:'🪨 石头屋',act:'locked'},
      {x:88,y:50,label:'🌳 圆顶树屋',act:'locked'}
    ];
    spots.forEach(function(s){
      var h=document.createElement('div'); h.className='hot';
      h.style.left=s.x+'%'; h.style.top=s.y+'%';
      h.style.width='86px'; h.style.height='70px';
      var lbl=document.createElement('div'); lbl.className='lbl'; lbl.textContent=s.label; h.appendChild(lbl);
      h.addEventListener('click',function(e){e.stopPropagation(); if(s.act==='krusty'){enterKrusty();} else {toast('（demo 暂仅开放蟹堡王内部，其余建筑在开发中）');}});
      world.appendChild(h);
    });
    // NPC
    var npcs=[
      {x:30,y:70,face:'🐙',name:'章鱼哥',lines:['……（瞥了你一眼）我没空。','艺术，是需要安静的。你挡光了。','哼，又一个新来的。']},
      {x:62,y:74,face:'🧽',name:'海绵宝宝',lines:['嗨！！！你是新来的居民吗？太棒啦！！','今天也要元气满满哦～叮叮叮！','要不要一起去抓水母？']},
      {x:74,y:70,face:'⭐',name:'派大星',lines:['我的大脑在放假～你要一起发呆吗？','薯片……我是说，石头很好吃。','噢！你是飘过来的云吗？']},
      {x:38,y:78,face:'🦀',name:'蟹老板',lines:['钱钱钱！哦你是来吃蟹黄堡的吧？','本店今日特价——才不特价呢！','（盯着你）你身上……有没有带钱？']}
    ];
    npcs.forEach(function(n){
      var t=document.createElement('div'); t.className='token';
      t.style.left=n.x+'%'; t.style.top=n.y+'%';
      t.innerHTML='<div class="shadow"></div><div class="spr">'+n.face+'</div><div class="tag">'+n.name+'</div>';
      t.addEventListener('click',function(e){e.stopPropagation(); sayNPC(n);});
      world.appendChild(t);
    });
    // 玩家
    player=document.createElement('div'); player.className='token player';
    player.innerHTML='<div class="shadow"></div><div class="spr">🐟</div><div class="nametag" id="pName">居民</div>';
    world.appendChild(player);
    // 点击地面移动
    world.addEventListener('click', function(e){
      if(e.target.closest('.token')||e.target.closest('.hot')) return;
      var r=world.getBoundingClientRect();
      var nx=((e.clientX-r.left)/r.width)*100;
      var ny=((e.clientY-r.top)/r.height)*100;
      ny=Math.max(60,Math.min(86,ny));
      placePlayer(nx,ny,false);
    });
  }
  function placePlayer(x,y,instant){
    px=x; py=y;
    player.style.left=x+'%'; player.style.top=y+'%';
    if(instant){player.style.transition='none';} else {player.style.transition='left .5s ease,top .5s ease';}
    $('#pName').textContent = ME? ME.name : '居民';
  }
  function sayNPC(n){
    var b=$('#npcBubble');
    // 次NPC 态度差异（彩蛋）
    var line=n.lines[Math.floor(Math.random()*n.lines.length)];
    if(ME){
      if(ME.name.indexOf('痞老板')>=0 && n.name==='蟹老板'){ line='（眯起眼）你……你来干嘛？离我的秘方远点！'; }
      if(ME.name.indexOf('痞老板')>=0 && n.name==='海绵宝宝'){ line='嘿，痞老板！要一起想办法吗？你人其实不坏～'; }
      if(ME.name.indexOf('珊迪')>=0 && n.name==='海绵宝宝'){ line='珊迪！一起去树屋做实验吧！'; }
      if(ME.name.indexOf('小蜗')>=0 && n.name==='章鱼哥'){ line='（难得地）……喵。你比大多数居民安静，算你过关。'; }
    }
    b.querySelector('.who').textContent=n.name;
    b.querySelector('.line').textContent=line;
    b.style.left=n.x+'%'; b.style.top=(n.y-8)+'%';
    b.classList.add('show');
    clearTimeout(b._t); b._t=setTimeout(function(){b.classList.remove('show');},3200);
  }
  var toastT;
  function toast(msg){var t=$('#toast');t.textContent=msg;t.style.opacity='1';clearTimeout(toastT);toastT=setTimeout(function(){t.style.opacity='0';},2600);}
  $('#toKrusty').addEventListener('click',enterKrusty);
  $('#backHome').addEventListener('click',function(){show('identity');$('#idBtn').textContent='抽一个身份';$('#idReset').style.display='none';});

  /* 键盘 + 方向键移动 */
  var STEP=4;
  document.addEventListener('keydown',function(e){
    if(!$('#street').classList.contains('on'))return;
    if(e.key==='ArrowLeft'||e.key==='a'){px=Math.max(6,px-STEP);placePlayer(px,py,false);}
    if(e.key==='ArrowRight'||e.key==='d'){px=Math.min(94,px+STEP);placePlayer(px,py,false);}
    if(e.key==='ArrowUp'||e.key==='w'){py=Math.max(58,py-STEP);placePlayer(px,py,false);}
    if(e.key==='ArrowDown'||e.key==='s'){py=Math.min(88,py+STEP);placePlayer(px,py,false);}
  });
  document.querySelectorAll('.dpad div').forEach(function(d){
    d.addEventListener('click',function(){
      var dir=d.getAttribute('data-dir');
      if(dir==='left')px=Math.max(6,px-STEP);
      if(dir==='right')px=Math.min(94,px+STEP);
      if(dir==='up')py=Math.max(58,py-STEP);
      if(dir==='down')py=Math.min(88,py+STEP);
      placePlayer(px,py,false);
    });
  });

  /* ===== 蟹堡王 ===== */
  var bites=0;
  function enterKrusty(){
    show('krusty');
    $('#kFace').textContent=ME.face; $('#kName').textContent=ME.name;
    // 重置
    bites=0; resetBurgerLayers();
    $('#ticket').style.display='block';
    var mynum=Math.floor(Math.random()*40)+1;
    var now=mynum; if(ME && ME.name.indexOf('珍珍')>=0) now=mynum; // 珍珍免单彩蛋保留
    $('#ticket').innerHTML='你的叫号票<br><b>#'+String(mynum).padStart(2,'0')+'</b><div class="small">前方还有 '+Math.floor(Math.random()*6+1)+' 位</div>';
    $('#getBurger').style.display='inline-block';
    $('#stage').style.display='none'; $('#biteText').style.display='none'; $('#kControls').style.display='none';
    $('#getBurger').textContent='取餐';
  }
  $('#getBurger').addEventListener('click',function(){
    $('#getBurger').style.display='none';
    $('#ticket').innerHTML='<b>请取餐！</b><div class="small">「'+ME.name+'」的蟹黄堡好了</div>';
    $('#stage').style.display='flex'; $('#biteText').style.display='block'; $('#kControls').style.display='flex';
    $('#biteText').textContent='完整的一个。还热着。拖动可旋转查看。';
    $('#spinHint').style.display='block';
    setTimeout(function(){$('#spinHint').style.display='none';},3500);
    startSpin();
  });
  function resetBurgerLayers(){
    document.querySelectorAll('.layer').forEach(function(l){l.style.display='block';l.style.opacity='1';});
    $('#burger').style.transform='rotateX(-16deg) rotateY(0deg)';
  }
  /* 旋转：轻摆（始终正脸可辨认）+ 拖动自由转 */
  var ry=0, autoSpin=true, dragging=false, lastX=0, phase=0;
  function applyRy(){ $('#burger').style.transform='rotateX(-16deg) rotateY('+ry+'deg)'; }
  function startSpin(){ autoSpin=true; clearInterval(window._spin); window._spin=setInterval(function(){ if(autoSpin&&!dragging){ phase+=0.03; ry=Math.sin(phase)*22; applyRy(); } },30); }
  var st=$('#stage');
  st.addEventListener('pointerdown',function(e){dragging=true;autoSpin=false;lastX=e.clientX;});
  window.addEventListener('pointermove',function(e){ if(dragging){ ry+=(e.clientX-lastX)*0.6; lastX=e.clientX; applyRy(); }});
  window.addEventListener('pointerup',function(){ if(dragging){dragging=false; if(ry>22)ry=22; if(ry<-22)ry=-22; phase=Math.asin(ry/22); autoSpin=true;} });

  var biteLines=['第一口：面包、肉汁和一点芝士。','第二口：嘴角沾了点酱。章鱼哥"啧"了一声。','第三口：闭眼，0.8 秒的满足。','第四口：生菜掉了两片，小鱼冲过来抢走。','第五口：打了个嗝，气泡从头顶飘上去。','吃完了。盘子里只剩一点芝麻。"今天也是完美的一天。"'];
  $('#biteBtn').addEventListener('click',function(){
    if(bites>=6) return; bites++;
    var layers=document.querySelectorAll('.layer');
    if(bites<=5){ var l=layers[bites-1]; if(l){ l.style.transition='opacity .3s, transform .3s'; l.style.opacity='0'; l.style.transform='translateX(-50%) translateY(-14px) scale(.7)'; } }
    ry+=18; applyRy();
    crumbs();
    $('#biteText').textContent=biteLines[bites-1];
    if(bites>=6){ $('#biteText').textContent='吃完了。"今天也是完美的一天。"'; $('#biteBtn').textContent='吃完了'; $('#biteBtn').disabled=true; $('#biteBtn').style.opacity='.5'; $('#biteBtn').style.cursor='default'; }
  });
  function crumbs(){
    var stg=$('#stage');
    for(var i=0;i<10;i++){
      var c=document.createElement('span'); c.className='crumb';
      c.style.background=Math.random()>.5?'#C98B4B':'#7FBF6A';
      c.style.left=(90+Math.random()*60)+'px'; c.style.top=(90+Math.random()*40)+'px';
      stg.appendChild(c);
      (function(el){var vx=(Math.random()-.5)*6,vy=-3-Math.random()*3,x=0,y=0,t=0;
        var tm=setInterval(function(){t++;vy+=.9;x+=vx;y+=vy;el.style.transform='translate('+x+'px,'+y+'px) rotate('+(t*30)+'deg)';el.style.opacity=Math.max(0,1-t/22);if(t>22){clearInterval(tm);el.remove();}},16);
      })(c);
    }
  }
  $('#backStreet').addEventListener('click',enterStreet);

  /* 气泡装饰（开场） */
  (function(){var o=$('#opening');for(var i=0;i<18;i++){var b=document.createElement('div');b.className='bub';var s=6+Math.random()*22;b.style.width=s+'px';b.style.height=s+'px';b.style.left=(Math.random()*100)+'%';b.style.animationDuration=(5+Math.random()*7)+'s';b.style.animationDelay=(Math.random()*6)+'s';o.appendChild(b);}})();
})();
</script>
</body>
</html>
"""

html = (TEMPLATE
        .replace("__OPENING__", "data:image/jpeg;base64," + OPENING)
        .replace("__MAP__", "data:image/jpeg;base64," + MAP)
        .replace("__INTERIOR__", "data:image/jpeg;base64," + INTERIOR))

out = os.path.join(HERE, "index.html")
open(out, "w", encoding="utf-8").write(html)
print("written:", out, round(os.path.getsize(out)/1024/1024, 2), "MB")
