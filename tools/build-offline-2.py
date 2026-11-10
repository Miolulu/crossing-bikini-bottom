# -*- coding: utf-8 -*-
import os, base64

D = os.path.dirname(os.path.abspath(__file__))
def img(name):
    return "data:image/jpeg;base64," + open(os.path.join(D, name+".b64")).read()

OPENING = img("01-opening")
PINE    = img("03-pineapple-house")
ROCK    = img("04-rock-house")
MOAI    = img("05-moai-house")
TREE    = img("06-treedome")
KRAB    = img("07-krusty-krab-exterior")
CHUM    = img("09-chum-bucket")
KRINT   = img("08-krusty-krab-interior")

HTML = r"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<title>比奇堡的一天 · 漫游原型 v0.2</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
  html,body{height:100%;background:#04141f;overflow:hidden;font-family:"PingFang SC","Microsoft YaHei",sans-serif;color:#fff;user-select:none}
  #fit{position:fixed;inset:0;display:flex;align-items:center;justify-content:center}
  #stage{position:relative;width:960px;height:600px;transform-origin:center center;overflow:hidden;
    border-radius:14px;box-shadow:0 30px 80px rgba(0,0,0,.6);background:#0a3550}
  /* 通用图层 */
  .layer{position:absolute;inset:0}
  /* 开场 */
  #opening{position:absolute;inset:0;z-index:50;background:#0a3a5a;overflow:hidden;cursor:pointer}
  #opening .bg{position:absolute;inset:-5%;background-size:cover;background-position:center;filter:brightness(.8)}
  #opening .sea{position:absolute;left:0;right:0;top:0;height:0;background:linear-gradient(180deg,#1b6ea0,#0e4f78);
    transition:height 2.2s cubic-bezier(.4,0,.2,1);box-shadow:0 8px 30px rgba(0,0,0,.4)}
  #opening .bub{position:absolute;bottom:-20px;border-radius:50%;background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.9),rgba(255,255,255,.15));opacity:.5;animation:rise linear infinite}
  @keyframes rise{to{transform:translateY(-720px);opacity:0}}
  #opening .title{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;
    z-index:3;text-align:center;opacity:0;transition:opacity 1s ease .4s}
  #opening .title h1{font-size:42px;letter-spacing:4px;text-shadow:0 3px 0 #0a3a5a,0 0 24px rgba(120,220,255,.6)}
  #opening .title p{margin-top:10px;font-size:15px;letter-spacing:6px;opacity:.85}
  #opening .title .tap{margin-top:26px;font-size:14px;padding:10px 22px;border:1.5px solid rgba(255,255,255,.7);
    border-radius:30px;animation:pulse 1.6s ease-in-out infinite}
  @keyframes pulse{50%{opacity:.4;transform:scale(.97)}}
  /* 身份 */
  #identity{position:absolute;inset:0;z-index:45;background:linear-gradient(160deg,#0c4a6e,#062a40);
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:30px}
  #identity h2{font-size:24px;letter-spacing:2px}
  #identity .hint{font-size:13px;opacity:.7}
  #gachaCard{width:300px;min-height:150px;border-radius:18px;padding:22px;background:rgba(255,255,255,.08);
    border:1px solid rgba(255,255,255,.18);text-align:center;display:flex;flex-direction:column;justify-content:center;gap:8px;
    transition:transform .25s,box-shadow .25s}
  #gachaCard.roll{animation:shake .5s}
  @keyframes shake{0%,100%{transform:translateY(0)}25%{transform:translateY(-8px) rotate(-1deg)}75%{transform:translateY(-8px) rotate(1deg)}}
  #gachaCard .rar{font-size:12px;letter-spacing:2px}
  #gachaCard .nm{font-size:30px;font-weight:700}
  #gachaCard .ds{font-size:13px;opacity:.85;line-height:1.5}
  .btn{font-size:15px;padding:12px 30px;border:none;border-radius:30px;background:#ffd23f;color:#06303f;font-weight:700;
    cursor:pointer;box-shadow:0 6px 0 #c9a200;transition:transform .1s}
  .btn:active{transform:translateY(4px);box-shadow:0 2px 0 #c9a200}
  .btn.ghost{background:rgba(255,255,255,.14);color:#fff;box-shadow:none;border:1px solid rgba(255,255,255,.3)}
  /* 场景通用 */
  .scene{position:absolute;inset:0;display:none}
  .scene.on{display:block}
  #camera{position:absolute;top:0;left:0;height:600px;will-change:transform}
  .sky{position:absolute;left:0;right:0;top:0;height:600px;
    background:linear-gradient(180deg,#2aa7d8 0%,#1d7fb0 38%,#0f5d8c 60%,#cdb98a 60%,#e6d2a3 100%)}
  .rays{position:absolute;left:0;right:0;top:-60px;height:500px;
    background:repeating-linear-gradient(100deg,rgba(255,255,255,.06) 0 40px,transparent 40px 120px);
    transform:skewX(-8deg);pointer-events:none;mix-blend-mode:screen}
  .ground{position:absolute;left:0;right:0;bottom:0;height:190px;
    background:linear-gradient(180deg,#e9d6a6,#d8bf86);box-shadow:inset 0 6px 18px rgba(120,90,40,.25)}
  .bub{position:absolute;border-radius:50%;background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.8),rgba(255,255,255,.08));
    pointer-events:none;animation:rise2 linear infinite;z-index:5}
  @keyframes rise2{from{transform:translateY(0);opacity:.5}to{transform:translateY(-560px);opacity:0}}
  .bld{position:absolute;bottom:150px;transform:translateX(-50%);filter:drop-shadow(0 10px 14px rgba(0,0,0,.3))}
  .bld img{display:block;height:240px;width:auto}
  .sign{position:absolute;transform:translate(-50%,-100%);background:rgba(6,40,60,.85);border:1px solid rgba(255,255,255,.25);
    padding:4px 10px;border-radius:8px;font-size:12px;white-space:nowrap;z-index:8;pointer-events:none}
  .sign b{color:#ffd23f}
  /* 角色 */
  .actor{position:absolute;transform:translate(-50%,-100%);z-index:10;transition:filter .2s}
  .actor .body{font-size:30px;line-height:52px;text-align:center;display:block;width:54px;height:54px;border-radius:50%;
    background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.55),transparent 60%),#3aa0d0;
    box-shadow:0 4px 8px rgba(0,0,0,.35),inset 0 -4px 8px rgba(0,0,0,.15);transition:transform .15s}
  .actor.walk .body{animation:bob .35s infinite}
  .actor.flip.walk .body{animation:bob .35s infinite}
  @keyframes bob{50%{transform:translateY(-4px) scaleY(.96)}}
  .actor .name{position:absolute;left:50%;top:-16px;transform:translateX(-50%);font-size:11px;background:rgba(0,0,0,.5);
    padding:1px 6px;border-radius:6px;white-space:nowrap}
  .actor.flip .body{transform:scaleX(-1)}
  .actor.flip.walk .body{animation:bob .35s infinite}
  /* 交互提示 */
  .prompt{position:absolute;transform:translate(-50%,-100%);z-index:20;background:#ffd23f;color:#06303f;font-weight:700;
    font-size:13px;padding:6px 12px;border-radius:20px;white-space:nowrap;box-shadow:0 4px 10px rgba(0,0,0,.35);
    animation:bobp 1s infinite;display:none}
  .prompt::after{content:"";position:absolute;left:50%;bottom:-6px;transform:translateX(-50%);border:6px solid transparent;border-top-color:#ffd23f}
  @keyframes bobp{50%{transform:translate(-50%,-108%)}}
  .prompt .k{display:inline-block;background:#06303f;color:#ffd23f;border-radius:5px;padding:0 6px;margin-right:4px;font-size:11px}
  /* 玩家头顶昵称 */
  #player .tag{position:absolute;left:50%;top:-30px;transform:translateX(-50%);font-size:10px;background:rgba(6,40,60,.8);
    padding:2px 8px;border-radius:8px;white-space:nowrap;border:1px solid rgba(255,255,255,.2)}
  #player{z-index:15}
  /* HUD */
  .hud{position:absolute;z-index:30;pointer-events:none}
  #dpad{position:absolute;left:16px;bottom:16px;z-index:35;width:132px;height:132px}
  #dpad .kb{position:absolute;width:44px;height:44px;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.3);
    border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;pointer-events:auto;color:#fff;backdrop-filter:blur(2px)}
  #dpad .kb:active{background:rgba(255,210,63,.6);color:#06303f}
  #dpad .u{left:44px;top:0}#dpad .l{left:0;top:44px}#dpad .r{left:88px;top:44px}#dpad .d{left:44px;top:88px}
  #actBtn{position:absolute;right:18px;bottom:18px;z-index:35;width:78px;height:78px;border-radius:50%;
    background:radial-gradient(circle at 35% 30%,#ffe27a,#ffc107);color:#06303f;font-weight:800;font-size:13px;border:none;
    box-shadow:0 6px 16px rgba(0,0,0,.4);pointer-events:auto;display:none}
  #actBtn:active{transform:scale(.92)}
  #miniTip{position:absolute;left:50%;top:14px;transform:translateX(-50%);z-index:32;background:rgba(6,40,60,.78);
    padding:6px 16px;border-radius:20px;font-size:12px;border:1px solid rgba(255,255,255,.2);display:none;pointer-events:none}
  #backBtn{position:absolute;left:14px;top:14px;z-index:36;background:rgba(6,40,60,.8);border:1px solid rgba(255,255,255,.25);
    color:#fff;font-size:12px;padding:6px 12px;border-radius:18px;display:none;cursor:pointer}
  /* 对话气泡 */
  .speak{position:absolute;transform:translate(-50%,-100%);z-index:25;max-width:240px;background:#fff;color:#06303f;
    border-radius:14px;padding:10px 14px;font-size:13px;line-height:1.5;box-shadow:0 6px 18px rgba(0,0,0,.35);display:none;pointer-events:none}
  .speak b{color:#0a6aa0}
  .speak::after{content:"";position:absolute;left:24px;bottom:-8px;border:8px solid transparent;border-top-color:#fff}
  /* 排队/取餐 UI */
  #krustyUI{position:absolute;inset:0;z-index:25;display:none}
  #ticket{position:absolute;right:16px;top:54px;background:#fff;color:#06303f;border-radius:12px;padding:10px 14px;font-size:13px;
    box-shadow:0 6px 16px rgba(0,0,0,.3);text-align:center}
  #ticket .big{font-size:26px;font-weight:800;color:#d23}
  #nowNum{position:absolute;left:50%;top:16px;transform:translateX(-50%);background:rgba(6,40,60,.85);color:#ffd23f;
    padding:6px 18px;border-radius:20px;font-size:15px;font-weight:700}
  /* 蟹黄堡 3D */
  #burgerModal{position:absolute;inset:0;z-index:40;background:rgba(4,26,42,.92);display:none;flex-direction:column;
    align-items:center;justify-content:center;gap:14px}
  #stage3d{width:240px;height:240px;perspective:700px}
  #burger{position:relative;width:200px;height:170px;margin:30px auto 0;transform-style:preserve-3d;transform:rotateX(-18deg)}
  .layer{position:absolute;left:50%;top:0;transform:translateX(-50%);border-radius:50%;background:#caa;transition:opacity .3s,transform .3s}
  .crumbs{position:absolute;width:6px;height:6px;border-radius:50%;background:#e7b34a;opacity:0;z-index:30}
  #biteBtn{background:#ffd23f;color:#06303f;border:none;padding:12px 34px;border-radius:30px;font-weight:800;font-size:15px;
    box-shadow:0 6px 0 #c9a200;cursor:pointer}
  #biteBtn:active{transform:translateY(4px);box-shadow:0 2px 0 #c9a200}
  #biteTxt{font-size:13px;opacity:.85;max-width:300px;text-align:center;line-height:1.5}
  #closeBurger{position:absolute;right:16px;top:14px;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.3);
    color:#fff;padding:6px 14px;border-radius:18px;cursor:pointer;font-size:12px}
  /* toast */
  #toast{position:absolute;left:50%;bottom:90px;transform:translateX(-50%);z-index:60;background:rgba(0,0,0,.82);
    padding:10px 18px;border-radius:22px;font-size:13px;opacity:0;transition:opacity .3s;pointer-events:none;max-width:80%;text-align:center}
  #toast.on{opacity:1}
  /* 进入转场 */
  #wipe{position:absolute;inset:0;z-index:55;background:#cdb98a;transform:scaleY(0);transform-origin:bottom;
    transition:transform .45s ease;pointer-events:none}
  #wipe.on{transform:scaleY(1)}
</style>
</head>
<body>
<div id="fit"><div id="stage">

  <!-- 开场 -->
  <div id="opening"><div class="bg" style="background-image:url('__OPENING__')"></div>
    <div class="sea" id="sea"></div>
    <div id="openingBub"></div>
    <div class="title" id="openTitle">
      <h1>正在前往比奇堡</h1>
      <p>A DAY IN BIKINI BOTTOM</p>
      <div class="tap">点击任意处 · 潜入海底</div>
    </div>
  </div>

  <!-- 身份 -->
  <div id="identity">
    <h2>你是比奇堡的哪位居民？</h2>
    <div id="gachaCard"><div class="rar">— 未知 —</div><div class="nm">？？？</div><div class="ds">点击按钮，让潮汐决定你的身份</div></div>
    <button class="btn" id="gachaBtn">🎲 抽取身份</button>
    <div class="hint">主角（海绵宝宝/派大星/章鱼哥/蟹老板）不会分配给你 · 罕见彩蛋随机降临</div>
    <button class="btn ghost" id="enterBtn" style="display:none">进入比奇堡 →</button>
  </div>

  <!-- 街道 -->
  <div class="scene" id="street">
    <div id="camera">
      <div class="sky"></div>
      <div class="rays"></div>
      <div class="ground"></div>
      <div id="streetBub"></div>
      <!-- 建筑 -->
      <div class="bld" data-b="pine" style="left:300px"><img src="__PINE__"></div>
      <div class="bld" data-b="moai" style="left:760px"><img src="__MOAI__"></div>
      <div class="bld" data-b="rock" style="left:1180px"><img src="__ROCK__"></div>
      <div class="bld" data-b="krab" style="left:1660px"><img src="__KRAB__"></div>
      <div class="bld" data-b="chum" style="left:2020px"><img src="__CHUM__"></div>
      <div class="bld" data-b="tree" style="left:2420px"><img src="__TREE__"></div>
      <!-- 招牌 -->
      <div class="sign" style="left:300px;top:330px">🍍 <b>海绵宝宝的家</b></div>
      <div class="sign" style="left:760px;top:330px">🗿 <b>章鱼哥的家</b></div>
      <div class="sign" style="left:1180px;top:330px">🪨 <b>派大星的家</b></div>
      <div class="sign" style="left:1660px;top:330px">🍔 <b>蟹堡王</b> · 可进入</div>
      <div class="sign" style="left:2020px;top:330px">🪣 <b>海之霸</b></div>
      <div class="sign" style="left:2420px;top:330px">🌳 <b>珊迪的树屋</b></div>
      <!-- NPC 在 JS 注入 -->
      <!-- 玩家 -->
      <div class="actor" id="player"><span class="body" data-col="#2f8fd0">🐟</span><span class="tag" id="playerTag">居民</span></div>
    </div>
    <div class="prompt" id="streetPrompt"><span class="k">E</span><span id="streetPromptTxt">交互</span></div>
    <div class="speak" id="streetSpeak"></div>
    <button id="backBtn" style="display:none"></button>
  </div>

  <!-- 蟹堡王内部 -->
  <div class="scene" id="krusty">
    <div id="cameraK" style="position:absolute;inset:0">
      <div class="layer" style="background:url('__KRINT__') center/cover"></div>
      <div class="rays"></div>
      <div id="krustyBub"></div>
      <!-- NPC 内部 -->
      <div class="actor" id="kBoss" data-n="boss" style="left:760px;top:430px"><span class="body" data-col="#d8412f">🦀</span><span class="name">蟹老板</span></div>
      <div class="actor" id="kSpong" data-n="spong" style="left:300px;top:400px"><span class="body" data-col="#f2d24a">🧽</span><span class="name">海绵宝宝</span></div>
      <div class="actor" id="kTables" data-n="tables" style="left:520px;top:520px"><span class="body" data-col="#c0703a">🪑</span><span class="name">餐桌区</span></div>
      <div class="actor" id="kJuke" data-n="juke" style="left:880px;top:520px"><span class="body" data-col="#6a8fd0">📻</span><span class="name">点唱机</span></div>
      <div class="actor" id="kExit" data-n="exit" style="left:80px;top:300px"><span class="body" data-col="#8a8a8a">🚪</span><span class="name">返回街道</span></div>
      <div class="actor" id="playerK"><span class="body" data-col="#2f8fd0">🐟</span><span class="tag" id="playerTagK">居民</span></div>
    </div>
    <div class="prompt" id="krustyPrompt"><span class="k">E</span><span id="krustyPromptTxt">交互</span></div>
    <div class="speak" id="krustySpeak"></div>
    <div id="krustyUI">
      <div id="nowNum">现在叫号：<span id="nowNumV">0</span></div>
      <div id="ticket">你的号码<br><span class="big" id="ticketV">—</span></div>
    </div>
    <button id="backBtnK" style="display:none"></button>
  </div>

  <!-- 蟹黄堡 3D -->
  <div id="burgerModal">
    <button id="closeBurger">关闭 ✕</button>
    <div id="stage3d"><div id="burger">
      <div class="layer" style="top:0;width:170px;height:46px;background:linear-gradient(#f4c64e,#e0a82e)"></div>
      <div class="layer" style="top:42px;width:178px;height:30px;background:#5fbf4e"></div>
      <div class="layer" style="top:70px;width:182px;height:22px;background:#ffd24a"></div>
      <div class="layer" style="top:90px;width:186px;height:40px;background:#9c5a2c"></div>
      <div class="layer" style="top:128px;width:176px;height:42px;background:linear-gradient(#f0bd44,#d89e2a)"></div>
    </div></div>
    <button id="biteBtn">😋 咬一口</button>
    <div id="biteTxt">刚出炉的蟹黄堡，还冒着热气。点「咬一口」尝尝看。</div>
  </div>

  <div id="wipe"></div>
  <div id="toast"></div>

  <!-- 操控 -->
  <div id="dpad" style="display:none">
    <div class="kb u" data-d="up">▲</div><div class="kb l" data-d="left">◀</div>
    <div class="kb r" data-d="right">▶</div><div class="kb d" data-d="down">▼</div>
  </div>
  <button id="actBtn">交互<br>E</button>
  <div id="miniTip"></div>

</div></div>

<script>
"use strict";
var $=function(s){return document.querySelector(s);};
var stage=$("#stage"), fit=$("#fit");
function fitStage(){
  var s=Math.min(window.innerWidth/960, window.innerHeight/600);
  stage.style.transform="scale("+s+")";
}
window.addEventListener("resize",fitStage); fitStage();

/* ---------- 身份池 ---------- */
var IDENT=[
  {rar:"普通居民",nm:"小丑鱼",ds:"比奇堡最常见的居民，热情但记性差。",emoji:"🐠"},
  {rar:"普通居民",nm:"神仙鱼",ds:"爱凑热闹，排队时总想往前挤。",emoji:"🐡"},
  {rar:"普通居民",nm:"海马",ds:"慢吞吞的，但很靠谱。",emoji:"🐴"},
  {rar:"普通居民",nm:"水母",ds:"飘忽不定，喜欢 jellyfish fields。",emoji:"🪼"},
  {rar:"稀有彩蛋",nm:"珊迪",ds:"来自德州的松鼠，穿着潜水服。大家对你充满好奇。",emoji:"🐿️"},
  {rar:"稀有彩蛋",nm:"珍珍",ds:"蟹老板的女儿，青春期的鲸鱼少女。",emoji:"🐳"},
  {rar:"稀有彩蛋",nm:"痞老板",ds:"只有一只眼睛的宿敌。比奇堡的居民对你戒心很重。",emoji:"👁️"},
  {rar:"极稀有恶搞",nm:"小蜗",ds:"海绵宝宝的宠物蜗牛，只会「喵」。",emoji:"🐌"}
];
var MY=null;

/* ---------- 开场 ---------- */
var opened=false;
$("#opening").addEventListener("click",function(){
  if(opened)return; opened=true;
  $("#sea").style.height="100%";
  setTimeout(function(){$("#openTitle").style.opacity="1";},900);
  setTimeout(function(){gotoIdentity();},2600);
});
(function(){ // 气泡
  var c=$("#openingBub");
  for(var i=0;i<14;i++){var b=document.createElement("div");b.className="bub";
    var sz=6+Math.random()*16; b.style.width=sz+"px";b.style.height=sz+"px";
    b.style.left=(Math.random()*100)+"%"; b.style.animationDuration=(4+Math.random()*5)+"s";
    b.style.animationDelay=(-Math.random()*6)+"s"; c.appendChild(b);}
})();

/* ---------- 身份抽取 ---------- */
var gachaRolling=false;
$("#gachaBtn").addEventListener("click",function(){
  if(gachaRolling)return; gachaRolling=true;
  var card=$("#gachaCard"); card.classList.add("roll");
  var ticks=0, iv=setInterval(function(){
    var r=IDENT[Math.floor(Math.random()*IDENT.length)];
    card.querySelector(".rar").textContent=r.rar;
    card.querySelector(".nm").textContent=r.emoji+" "+r.nm;
    card.querySelector(".ds").textContent=r.ds;
    if(++ticks>10){clearInterval(iv); gachaRolling=false; card.classList.remove("roll");
      // 真实抽取
      var roll=Math.random();
      var idx = roll<0.80?Math.floor(Math.random()*4): roll<0.97?4+Math.floor(Math.random()*3):7;
      MY=IDENT[idx];
      card.querySelector(".rar").textContent=MY.rar;
      card.querySelector(".nm").textContent=MY.emoji+" "+MY.nm;
      card.querySelector(".ds").textContent=MY.ds;
      var col = MY.rar==="普通居民"?"rgba(255,255,255,.08)":MY.rar==="稀有彩蛋"?"rgba(255,210,63,.18)":"rgba(255,120,160,.2)";
      card.style.background=col;
      $("#playerTag").textContent=MY.nm; $("#playerTagK").textContent=MY.nm;
      $("#enterBtn").style.display="inline-block";
    }
  },55);
});
$("#enterBtn").addEventListener("click",function(){ gotoStreet(); });

/* ---------- 场景切换 ---------- */
function show(id){ document.querySelectorAll(".scene").forEach(function(s){s.classList.remove("on");}); $(id).classList.add("on"); }
function gotoIdentity(){ $("#opening").style.display="none"; $("#identity").style.display="flex"; }
var SCENE="street";
function gotoStreet(){
  $("#identity").style.display="none"; show("#street"); SCENE="street";
  $("#dpad").style.display="block"; $("#backBtn").style.display="none";
  setupStreet(); toast("用方向键 / 屏幕方向键走动，靠近建筑或居民按 E 交互");
}
function gotoKrusty(){
  wipe(function(){
    show("#krusty"); SCENE="krusty"; $("#dpad").style.display="block";
    $("#krustyUI").style.display="block"; setupKrusty();
    toast("走进蟹堡王！走到柜台前按 E 点餐");
  });
}
function wipe(cb){
  var w=$("#wipe"); w.classList.add("on");
  setTimeout(function(){ cb(); setTimeout(function(){ w.classList.remove("on"); },60); },460);
}

/* ---------- 通用：移动 + 镜头 ---------- */
var keys={};
window.addEventListener("keydown",function(e){
  var k=e.key.toLowerCase();
  if(["arrowup","w","arrowdown","s","arrowleft","a","arrowright","d"].indexOf(k)>=0){keys[k]=true;e.preventDefault();}
  if(k==="e"||k===" "){e.preventDefault(); doInteract();}
});
window.addEventListener("keyup",function(e){keys[e.key.toLowerCase()]=false;});
// 屏幕方向键
document.querySelectorAll("#dpad .kb").forEach(function(b){
  var d=b.dataset.d;
  var kmap={up:"w",down:"s",left:"a",right:"d"};
  var key=kmap[d];
  var on=function(e){e.preventDefault();keys[key]=true;};
  var off=function(e){e.preventDefault();keys[key]=false;};
  b.addEventListener("touchstart",on);b.addEventListener("touchend",off);
  b.addEventListener("mousedown",on);b.addEventListener("mouseup",off);b.addEventListener("mouseleave",off);
});
$("#actBtn").addEventListener("click",doInteract);

/* ---------- 街道 ---------- */
var WORLD_W=2700, STREET_BAND=[430,545];
var player={x:200,y:500,flip:false,moving:false,el:$("#player")};
var npcs=[], blds=[], curTarget=null;
function setupStreet(){
  // NPC 注入
  var cam=$("#camera");
  npcs.forEach(function(n){if(n.el&&n.el.parentNode)n.el.parentNode.removeChild(n.el);});
  npcs=[
    {id:"spong",emoji:"🧽",col:"#f2d24a",x:430,y:500,name:"海绵宝宝",lines:["我终于等到朋友啦！","要来块蟹黄堡吗？刚出炉的！","♪ 啦啦啦~ 今天天气真好~","派大星说他在发呆，你去找他吧！"]},
    {id:"pat", emoji:"⭐",col:"#e98ab0",x:1230,y:520,name:"派大星",lines:["……（打哈欠）","我正在思考宇宙，你别吵。","海绵宝宝说你是新来的？","（继续发呆）"]},
    {id:"oct",  emoji:"🐙",col:"#3fb6a8",x:820,y:485,name:"章鱼哥",lines:["（叹气）又来一个。","我正在练习竖笛，别打扰我。","比奇堡这么吵，真烦。","你要蟹黄堡？去蟹堡王，别在我家门口。"]},
    {id:"boss", emoji:"🦀",col:"#d8412f",x:1720,y:500,name:"蟹老板",lines:["钱钱钱！哦你是来吃饭的？","本店今日特价——才不特价呢！","（盯着你）你身上……带钱了吗？","珊迪那套潜水服，花了我不少维修费。"]}
  ];
  blds=[
    {id:"pine",x:300,txt:"海绵宝宝的家",enter:false},
    {id:"moai",x:760,txt:"章鱼哥的家",enter:false},
    {id:"rock",x:1180,txt:"派大星的家",enter:false},
    {id:"krab",x:1660,txt:"进入蟹堡王",enter:true},
    {id:"chum",x:2020,txt:"海之霸",enter:false},
    {id:"tree",x:2420,txt:"珊迪的树屋",enter:false}
  ];
  npcs.forEach(function(n){
    var d=document.createElement("div");d.className="actor";d.style.left=n.x+"px";d.style.top=n.y+"px";
    d.innerHTML='<span class="body" data-col="'+n.col+'">'+n.emoji+'</span><span class="name">'+n.name+'</span>';
    cam.appendChild(d); n.el=d;
    // 待机微动
    d.querySelector(".body").style.animation="idle 3s ease-in-out infinite";
  });
  paintAvatars();
  // 注入 idle 动画
  if(!document.getElementById("idleCss")){
    var st=document.createElement("style");st.id="idleCss";
    st.textContent=".actor .body{animation:idle 3s ease-in-out infinite} @keyframes idle{50%{transform:translateY(-3px)}} .actor.flip .body{animation:idle 3s ease-in-out infinite}";
    document.head.appendChild(st);
  }
  player.x=200;player.y=500;player.flip=false; updatePlayerEl();
  // 气泡
  spawnBubbles($("#streetBub"),20);
  // 海绵宝宝偶尔哼歌
  scheduleHum();
}
function spawnBubbles(box,n){
  for(var i=0;i<n;i++){var b=document.createElement("div");b.className="bub";
    var sz=5+Math.random()*12;b.style.width=sz+"px";b.style.height=sz+"px";
    b.style.left=(Math.random()*100)+"%";b.style.bottom="0";
    b.style.animationDuration=(4+Math.random()*5)+"s";b.style.animationDelay=(-Math.random()*7)+"s";
    box.appendChild(b);}
}
var humTimer=null;
function paintAvatars(){
  document.querySelectorAll(".actor .body").forEach(function(b){
    var c=b.dataset.col||"#3aa0d0";
    b.style.background="radial-gradient(circle at 35% 30%,rgba(255,255,255,.55),transparent 60%),"+c;
  });
}
function scheduleHum(){
  if(humTimer)clearTimeout(humTimer);
  humTimer=setTimeout(function(){
    if(SCENE==="street"){var s=findNpc("spong"); if(s&&s.el) popSpeak($("#streetSpeak"),s.el,"♪ 啦啦啦~ 比奇堡的阳光真暖~",2200);}
    scheduleHum();
  }, 9000+Math.random()*6000);
}
function findNpc(id){return npcs.filter(function(n){return n.id===id;})[0];}

function updatePlayerEl(){
  player.el.style.left=player.x+"px";player.el.style.top=player.y+"px";
  player.el.style.zIndex=String(10+Math.floor(player.y/10));
  if(player.flip)player.el.classList.add("flip");else player.el.classList.remove("flip");
  if(player.moving)player.el.classList.add("walk");else player.el.classList.remove("walk");
}
var camX=0;
function updateCamera(){
  var vw=960;
  camX=Math.max(0,Math.min(player.x-vw/2, WORLD_W-vw));
  $("#camera").style.transform="translateX("+(-camX)+"px)";
}
function streetLoop(){
  if(SCENE!=="street")return;
  var sp=3.4, dx=0,dy=0;
  if(keys.w||keys.arrowup)dy-=1; if(keys.s||keys.arrowdown)dy+=1;
  if(keys.a||keys.arrowleft)dx-=1; if(keys.d||keys.arrowright)dx+=1;
  if(dx||dy){var l=Math.hypot(dx,dy);dx/=l;dy/=l;
    player.x+=dx*sp;player.y+=dy*sp;
    if(dx<0)player.flip=true; if(dx>0)player.flip=false;
    player.x=Math.max(60,Math.min(WORLD_W-60,player.x));
    player.y=Math.max(STREET_BAND[0],Math.min(STREET_BAND[1],player.y));
    player.moving=true;
  }else player.moving=false;
  updatePlayerEl(); updateCamera(); updatePrompts();
  requestAnimationFrame(streetLoop);
}
function updatePrompts(){
  // 找最近可交互对象
  var best=null,bd=1e9;
  function consider(tx,ty,obj){var d=Math.hypot(tx-player.x,ty-player.y);if(d<bd&&d<95){bd=d;best=obj;}}
  blds.forEach(function(b){consider(b.x,490,{type:"bld",ref:b});});
  npcs.forEach(function(n){consider(n.x,n.y-10,{type:"npc",ref:n});});
  curTarget=best;
  var pr=$("#streetPrompt");
  if(best){
    var bx = best.type==="bld"?best.ref.x:(best.ref.x);
    var by = best.type==="bld"?455:(best.ref.y-46);
    pr.style.left=bx+"px";pr.style.top=by+"px";pr.style.display="block";
    $("#streetPromptTxt").textContent = best.type==="bld"?(best.ref.enter?"进入":"（开发中）"):"对话";
    $("#actBtn").style.display="block";
  }else{pr.style.display="none";$("#actBtn").style.display="none";}
}

/* ---------- 交互 ---------- */
function doInteract(){
  if(SCENE==="street"){
    if(!curTarget)return;
    if(curTarget.type==="bld"){
      if(curTarget.ref.enter) gotoKrusty();
      else toast("「"+curTarget.ref.txt+"」内部正在装修，敬请期待～");
    }else{
      var n=curTarget.ref;
      var line=n.lines[Math.floor(Math.random()*n.lines.length)];
      // 次NPC态度彩蛋
      if(n.id==="boss"&&MY){
        if(MY.nm==="痞老板")line="（眯起眼）……是你？离我的秘方远点，否则叫警察。";
        else if(MY.nm==="珊迪")line="哦，珊迪！得州来的科学家，我的维修费可记着你呢。";
      }
      if(n.id==="spong"&&MY&&MY.nm==="痞老板")line="（警惕）你怎么长得像那个讨厌的痞老板……离蟹黄堡远点！";
      popSpeak($("#streetSpeak"),n.el,line,3000);
    }
  }else if(SCENE==="krusty"){
    if(!curKTarget)return;
    var t=curKTarget.ref;
    if(t==="exit"){ wipe(function(){gotoStreet();}); }
    else if(t==="boss"){ popSpeak($("#krustySpeak"),$("#kBoss"),"欢迎光临！要等位子吗？ today's special 不打折！",3000); }
    else if(t==="spong"){ takeOrder(); }
    else if(t==="tables"){ popSpeak($("#krustySpeak"),$("#kTables"),"这些红皮凳是老主顾的最爱，坐这儿能看清整个餐厅。",3200); }
    else if(t==="juke"){ popSpeak($("#krustySpeak"),$("#kJuke"),"🔊 点唱机正在放：Fun Song！（海绵宝宝最爱的歌）",3200); }
  }
}
function popSpeak(box,anchor,text,ms){
  box.innerHTML="<b>"+(anchor.querySelector(".name")?anchor.querySelector(".name").textContent:"")+"</b><br>"+text;
  box.style.left=anchor.style.left; box.style.top=(parseInt(anchor.style.top)-46)+"px";
  box.style.display="block";
  if(box._t)clearTimeout(box._t);
  box._t=setTimeout(function(){box.style.display="none";},ms);
}

/* ---------- 蟹堡王内部 ---------- */
var kWORLD=960, kBounds={x:[60,900],y:[320,560]};
var playerK={x:480,y:500,flip:false,moving:false,el:$("#playerK")};
var kTargets=[], curKTarget=null;
function setupKrusty(){
  playerK.x=480;playerK.y=520;playerK.flip=false;updatePlayerK();
  spawnBubbles($("#krustyBub"),12);
  kTargets=[
    {id:"spong",el:$("#kSpong"),ref:"spong",x:300,y:400},
    {id:"boss", el:$("#kBoss"), ref:"boss", x:760,y:430},
    {id:"tables",el:$("#kTables"),ref:"tables",x:520,y:520},
    {id:"juke", el:$("#kJuke"), ref:"juke", x:880,y:520},
    {id:"exit", el:$("#kExit"), ref:"exit", x:80,y:300}
  ];
  $("#nowNumV").textContent="0"; $("#ticketV").textContent="—";
  if(!krustyStarted){krustyStarted=true; startCalling();}
}
var krustyStarted=false, callTimer=null, nowNum=0;
function startCalling(){
  if(callTimer)clearInterval(callTimer);
  callTimer=setInterval(function(){
    if(SCENE!=="krusty")return;
    nowNum++; $("#nowNumV").textContent=nowNum;
    if(myNum&&nowNum===myNum){ toast("🍔 轮到你啦！去柜台领取蟹黄堡"); }
  },4000);
}
var myNum=null;
function takeOrder(){
  if(myNum){ openBurger(); return; }
  myNum = (nowNum+1); // 简单模拟：取当前叫号+1
  $("#ticketV").textContent=myNum;
  popSpeak($("#krustySpeak"),$("#kSpong"),"好嘞！这是你的号码牌 #"+myNum+"，等叫到号就能领堡～（demo 已自动帮你排上）",3500);
  setTimeout(openBurger,2600);
}
function updatePlayerK(){
  playerK.el.style.left=playerK.x+"px";playerK.el.style.top=playerK.y+"px";
  playerK.el.style.zIndex=String(10+Math.floor(playerK.y/10));
  if(playerK.flip)playerK.el.classList.add("flip");else playerK.el.classList.remove("flip");
  if(playerK.moving)playerK.el.classList.add("walk");else playerK.el.classList.remove("walk");
}
function krustyLoop(){
  if(SCENE!=="krusty")return;
  var sp=3.2,dx=0,dy=0;
  if(keys.w||keys.arrowup)dy-=1;if(keys.s||keys.arrowdown)dy+=1;
  if(keys.a||keys.arrowleft)dx-=1;if(keys.d||keys.arrowright)dx+=1;
  if(dx||dy){var l=Math.hypot(dx,dy);dx/=l;dy/=l;playerK.x+=dx*sp;playerK.y+=dy*sp;
    if(dx<0)playerK.flip=true;if(dx>0)playerK.flip=false;
    playerK.x=Math.max(kBounds.x[0],Math.min(kBounds.x[1],playerK.x));
    playerK.y=Math.max(kBounds.y[0],Math.min(kBounds.y[1],playerK.y));playerK.moving=true;
  }else playerK.moving=false;
  updatePlayerK();
  // 提示
  var best=null,bd=1e9;
  kTargets.forEach(function(t){var d=Math.hypot(t.x-playerK.x,t.y-playerK.y);if(d<bd&&d<85){bd=d;best=t;}});
  curKTarget=best;
  var pr=$("#krustyPrompt");
  if(best){pr.style.left=best.x+"px";pr.style.top=(best.y-46)+"px";pr.style.display="block";
    $("#krustyPromptTxt").textContent = best.ref==="exit"?"离开":(best.ref==="spong"?"点餐":(best.ref==="boss"?"对话":"查看"));
    $("#actBtn").style.display="block";
  }else{pr.style.display="none";$("#actBtn").style.display="none";}
  requestAnimationFrame(krustyLoop);
}
$("#closeBurger").addEventListener("click",function(){$("#burgerModal").style.display="none";});
function openBurger(){
  $("#burgerModal").style.display="flex";
  bites=0; biteStage();
}

/* ---------- 蟹黄堡 3D 啃咬 ---------- */
var bites=0, ry=0, autoSpin=true, dragging=false, lastX=0;
function applyRy(){if(!dragging)$("#burger").style.transform="rotateX(-18deg) rotateY("+ry+"deg)";}
function biteStage(){
  var layers=document.querySelectorAll("#burger .layer");
  layers.forEach(function(l,i){l.style.opacity="1";l.style.transform="translateX(-50%)";l.dataset.off="0";});
  $("#biteTxt").textContent="刚出炉的蟹黄堡，还冒着热气。点「咬一口」尝尝看。";
}
(function startSpin(){autoSpin=true;clearInterval(window._spin);window._spin=setInterval(function(){if(autoSpin&&!dragging){ry+=0.8;applyRy();}},30);})();
var stg=$("#stage3d");
stg.addEventListener("pointerdown",function(e){dragging=true;autoSpin=false;lastX=e.clientX;});
window.addEventListener("pointermove",function(e){if(dragging){ry+=(e.clientX-lastX)*0.6;lastX=e.clientX;applyRy();}});
window.addEventListener("pointerup",function(){if(dragging){dragging=false;autoSpin=true;}});
var crumbs=[];
(function initCrumbs(){var b=$("#burger");for(var i=0;i<10;i++){var c=document.createElement("div");c.className="crumbs";b.appendChild(c);crumbs.push(c);}}());
var BITE_TXT=[
  "第一口——面包酥脆，芝麻在嘴里蹦！",
  "第二口——生菜清爽，咔嚓咔嚓。",
  "第三口——芝士拉丝，热乎乎的。",
  "第四口——肉饼！这才是灵魂啊。",
  "第五口——底层面包，越来越小了……",
  "最后一口——嗝！蟹黄堡消灭完毕 🎉"
];
$("#biteBtn").addEventListener("click",function(){
  if(bites>=6)return;
  var layers=document.querySelectorAll("#burger .layer");
  if(bites<5){var l=layers[bites];l.style.transition="opacity .3s,transform .3s";l.style.opacity="0";l.style.transform="translateX(-50%) translateY(-16px) scale(.7)";}
  // 掉渣
  crumbs.forEach(function(c){if(c.dataset.used)return;c.dataset.used="1";
    c.style.left=(40+Math.random()*120)+"px";c.style.top=(60+Math.random()*90)+"px";
    c.style.transition="none";c.style.opacity="1";
    setTimeout(function(){c.style.transition="opacity .6s,transform .6s";c.style.opacity="0";c.style.transform="translateY(40px)";},10);
    setTimeout(function(){c.dataset.used="0";c.style.opacity="0";},700);
  });
  bites++;
  if(bites>=6){$("#biteTxt").textContent=BITE_TXT[5];$("#biteBtn").textContent="🎉 吃完了";}
  else{$("#biteTxt").textContent=BITE_TXT[bites-1];}
});

/* ---------- toast / tip ---------- */
var toastT=null;
function toast(msg){var t=$("#toast");t.textContent=msg;t.classList.add("on");if(toastT)clearTimeout(toastT);toastT=setTimeout(function(){t.classList.remove("on");},2600);}

/* ---------- 启动循环 ---------- */
paintAvatars();
requestAnimationFrame(streetLoop);
requestAnimationFrame(krustyLoop);
</script>
</body>
</html>"""

HTML = HTML.replace("__OPENING__",OPENING).replace("__PINE__",PINE).replace("__ROCK__",ROCK)\
  .replace("__MOAI__",MOAI).replace("__TREE__",TREE).replace("__KRAB__",KRAB)\
  .replace("__CHUM__",CHUM).replace("__KRINT__",KRINT)
open(os.path.join(D,"index.html"),"w").write(HTML)
print("written", len(HTML)//1024, "KB")
