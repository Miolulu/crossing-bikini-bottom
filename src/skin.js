/* =====================================================================
   比奇堡 v5 · 表现层注入
   不改玩法数据：emoji 只在渲染结果里换成手绘图标；角色换成生成立绘；
   房间按 key 做构图变体 + 主题道具层；世界补花云/水母/海草/石头。
   ===================================================================== */
(function(){
  var ICON=window.BB_ICON, CHAR=window.BB_CHAR, CHAR_SVG=window.BB_CHAR_SVG;
  var SKIP=/^[\u2715\u2713\u2717\u2606\u2726\u21BB\u21BA\u25BC\u266A\u26AA\u2190\u2192\u2191\u2193\u2716\u274C\s]+$/u;
  var EMOJI=/([\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]+)/gu;
  var busy=false;

  /* --- 1. emoji → 手绘图标（文本节点级，不破坏 DOM 结构） --- */
  function iconize(root){
    if(!root||!ICON)return;
    var nodes=[],w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null);
    while(w.nextNode())nodes.push(w.currentNode);
    nodes.forEach(function(n){
      var t=n.nodeValue;
      if(!t||!/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(t))return;
      if(n.parentNode&&/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA|SVG)$/.test(n.parentNode.nodeName))return;
      if(n.parentNode&&n.parentNode.closest&&n.parentNode.closest('.bb-ico'))return;
      var frag=document.createDocumentFragment(),last=0,m,hit=false;
      EMOJI.lastIndex=0;
      while((m=EMOJI.exec(t))){
        var key=m[0].replace(/\uFE0F/g,'');
        if(SKIP.test(m[0])||!key)continue;
        hit=true;
        frag.appendChild(document.createTextNode(t.slice(last,m.index)));
        var s=document.createElement('span');s.className='bb-ico';
        s.innerHTML=ICON(m[0],24);
        frag.appendChild(s);
        last=EMOJI.lastIndex;
      }
      if(!hit)return;
      frag.appendChild(document.createTextNode(t.slice(last)));
      n.parentNode.replaceChild(frag,n);
    });
  }

  /* --- 2. 角色立绘替换 emoji 圆盘 ---
     主角 = D-01 生成立绘（更大 + 金色标记）；bot 居民 = 12 位手绘居民随机换装；
     六位主要 NPC = 对应立绘；其余兜底走大号 SVG。 */
  var RESIDENTS=['G-14-01-suit_sardine.png','G-14-02-puffer_stripes.png',
    'G-14-03-angelfish_hat.png','G-14-04-old_flounder.png',
    'G-14-05-tuna_lifeguard.png','G-14-06-shrimp_sweater.png',
    'G-14-07-octopus_news.png','G-14-08-grouper_hawaii.png',
    'G-14-09-seahorse_postal.png','G-14-10-skay_mustache.png',
    'G-14-11-catfish_farmer.png','G-14-12-blowfish_grandma.png'];
  function dressActors(root){
    if(!root)return;
    var sel='.actor .disc,#iplayer .disc,#player .disc';
    var list=root.querySelectorAll?root.querySelectorAll(sel):[];
    if(root.matches&&root.matches(sel))list=[root].concat([].slice.call(list));
    [].slice.call(list).forEach(function(d){
      if(d.dataset.bbDressed)return;
      var host=d.parentNode;
      var isPlayer=host&&(host.id==='player'||host.id==='iplayer');
      var isBot=!!(host&&host.classList&&host.classList.contains('bot'));
      var f;
      if(isPlayer)f='D-01-player-portrait.png';
      else if(isBot)f=RESIDENTS[(Math.random()*RESIDENTS.length)|0];
      else f=CHAR?CHAR((d.textContent||'').trim().replace(/\uFE0F/g,'')):null;
      var html=f?'<img class="bbCharImg" alt="" src="../assets/characters/'+f+'">'
                :(CHAR_SVG?CHAR_SVG((d.textContent||'').trim(),88):'');
      if(!html)return;
      d.innerHTML=html;d.dataset.bbDressed='1';
      if(isPlayer&&!d.parentNode.querySelector('.bbMarker')){
        var m=document.createElement('div');m.className='bbMarker';
        m.innerHTML='<svg viewBox="0 0 36 26"><path d="M4 2h28L20 22z" fill="#FBE34B" stroke="#162C36" stroke-width="3" stroke-linejoin="round"/></svg>';
        d.parentNode.appendChild(m);
      }
    });
  }

  /* --- 2.5 房间物件手绘精灵表（E 系列，6 张 4x4 图集切分） ---
     key = 'roomId|objId'；s=常态，on=开关打开态，open=容器翻找后形态。
     未命中的物件走 icons.js 的 SVG 兜底。 */
  var OBJ_SPR={
    'krusty_hall|ticket':{s:'E-06-ticket_machine'},
    'krusty_hall|register':{s:'E-02-register-closed',open:'E-02-register-open'},
    'krusty_hall|window':{s:'E-10-serving_window'},
    'krusty_hall|pickup':{s:'E-10-pickup_counter'},
    'krusty_hall|tip':{s:'E-02-tip_jar'},
    'krusty_hall|jukebox':{s:'E-10-jukebox'},
    'krusty_hall|menu':{s:'E-02-menu'},
    'krusty_hall|salt':{s:'E-05-salt'},
    'krusty_hall|fries':{s:'E-05-fries'},
    'krusty_kitchen|grill':{s:'E-03-grill-off',on:'E-03-grill-on'},
    'krusty_kitchen|fridge':{s:'E-08-fridge'},
    'krusty_kitchen|cabinet':{s:'E-10-cabinet'},
    'krusty_kitchen|spatula':{s:'E-03-spatula-front'},
    'krusty_kitchen|sauce':{s:'E-03-sauce'},
    'krusty_kitchen|sesame':{s:'E-10-sesame'},
    'krusty_kitchen|drink':{s:'E-03-drink',on:'E-09-drink-on'},
    'krusty_kitchen|bin':{s:'E-03-bin-closed',open:'E-03-bin-open'},
    'krusty_office|safe':{s:'E-04-safe-closed',open:'E-04-safe-open'},
    'krusty_office|ledger':{s:'E-04-ledger-front'},
    'krusty_office|portrait':{s:'E-04-captain_frame'},
    'krusty_office|coin1':{s:'E-10-coin'},
    'krusty_office|desklamp':{s:'E-08-lamp',on:'E-09-lamp-on'},
    'krusty_office|anchor':{s:'E-05-anchor'},
    'moai_f1|clarinet':{s:'E-07-clarinet-front'},
    'moai_f1|lamp':{s:'E-08-lamp',on:'E-09-lamp-on'},
    'moai_f1|gramophone':{s:'E-10-gramophone'},
    'moai_f1|cushion':{s:'E-08-cushion'},
    'moai_f1|selfportrait':{s:'E-10-selfportrait'},
    'moai_f1|coffee':{s:'E-05-cup'},
    'moai_f2|paintbox':{s:'E-09-paintbox'},
    'moai_f2|easel':{s:'E-08-easel'},
    'moai_f2|curtain':{s:'E-10-curtain-closed',on:'E-10-curtain-open'},
    'moai_f2|record':{s:'E-09-vinyl'},
    'moai_f2|calendar':{s:'E-10-calendar'},
    'moai_f2|paint':{s:'E-08-paint'},
    'moai_f3|nightstand':{s:'E-10-nightstand'},
    'moai_f3|vinyl':{s:'E-09-vinyl'},
    'moai_f3|statue':{s:'E-09-mini_moai'},
    'moai_f3|window':{s:'E-08-round_window'},
    'moai_f3|magazine':{s:'E-10-magazine'},
    'moai_f3|coffee':{s:'E-05-cup'},
    'pineapple_main|clock':{s:'E-08-alarm_clock'},
    'pineapple_main|garyl':{s:'E-07-snail'},
    'pineapple_main|jellynet':{s:'E-09-jellynet'},
    'pineapple_main|tv':{s:'E-08-stone_tv',on:'E-09-stone_tv-on'},
    'pineapple_main|pine':{s:'E-09-pine_ornament'},
    'pineapple_kitchen|fridge':{s:'E-08-fridge'},
    'pineapple_kitchen|record':{s:'E-08-record_player'},
    'pineapple_kitchen|bed':{s:'E-08-pineapple_bed'},
    'pineapple_kitchen|jar':{s:'E-08-jar'},
    'pineapple_kitchen|toothbrush':{s:'E-09-toothbrush'},
    'pineapple_kitchen|photo':{s:'E-10-photo_frame'},
    'rock_main|tv':{s:'E-08-stone_tv',on:'E-09-stone_tv-on'},
    'rock_main|chips':{s:'E-08-candy_jar'},
    'rock_main|phone':{s:'E-10-stone_phone'},
    'rock_main|conch':{s:'E-09-conch'},
    'rock_main|sandcastle':{s:'E-09-sandcastle'},
    'rock_main|shovel':{s:'E-09-shovel'},
    'rock_under|fridge':{s:'E-08-fridge'},
    'rock_under|rocktop':{s:'E-10-rock'},
    'rock_under|paper':{s:'E-09-newspaper'},
    'rock_under|cookie':{s:'E-09-cookie'},
    'rock_under|lamp':{s:'E-08-lamp',on:'E-09-lamp-on'},
    'rock_under|star':{s:'E-09-starfig'},
    'treedome_main|scope':{s:'E-08-microscope'},
    'treedome_main|board':{s:'E-10-whiteboard'},
    'treedome_main|helmet':{s:'E-08-air_helmet'},
    'treedome_main|nutjar':{s:'E-09-nut_jar'},
    'treedome_main|gauge':{s:'E-10-gauge'},
    'treedome_main|robotarm':{s:'E-10-robot_arm'},
    'treedome_airlock|barbell':{s:'E-08-barbell'},
    'treedome_airlock|computer':{s:'E-10-terminal'},
    'treedome_airlock|flag':{s:'E-10-flag'},
    'treedome_airlock|flower':{s:'E-10-flower'},
    'treedome_airlock|treestump':{s:'E-10-treestump'},
    'treedome_airlock|acorn':{s:'E-10-acorn'},
    'chum_counter|karen':{s:'E-08-karen_screen',on:'E-09-karen-on'},
    'chum_counter|chum':{s:'E-10-chum_bucket'},
    'chum_counter|register':{s:'E-02-register-closed',open:'E-02-register-open'},
    'chum_counter|menu':{s:'E-02-menu'},
    'chum_counter|flyer':{s:'E-10-flyer'},
    'chum_counter|stool':{s:'E-10-stool'},
    'chum_lab|scanner':{s:'E-10-scanner'},
    'chum_lab|plan':{s:'E-10-plan_map'},
    'chum_lab|jar':{s:'E-10-test_tube'},
    'chum_lab|bucket':{s:'E-05-bucket'},
    'chum_lab|portrait':{s:'E-10-photo_frame'},
    'chum_lab|mop':{s:'E-05-mop'}
  };
  /* 无独立「亮态」立绘的开关类：打开时挂一枚浮动状态徽标 */
  var FXBADGE={'krusty_hall|jukebox':'♪','moai_f1|gramophone':'♪',
    'pineapple_kitchen|record':'♪','treedome_main|robotarm':'⚙','treedome_airlock|flag':'≈'};
  function objIdOf(el){
    var BB=window.__BB;if(!BB||!BB.objEls)return null;
    for(var id in BB.objEls())if(BB.objEls()[id]===el)return id;
    return null;
  }
  function objSpriteFor(el){
    var BB=window.__BB;if(!BB||!BB.getRoom)return null;
    var room=BB.getRoom();if(!room)return null;
    var id=objIdOf(el);if(!id)return null;
    return (OBJ_SPR[room+'|'+id]||{}).s||null;
  }

  /* --- 2.6 物件形态同步：开关(on) / 翻找后(open) / 点餐进度 → 换立绘 + 状态徽标 ---
     由 140ms 心跳驱动，dataset.bbSpr 缓存避免无谓重排。 */
  function syncObjState(){
    var BB=window.__BB;if(!BB||!BB.objEls||!BB.getRoom)return;
    var room=BB.getRoom();if(!room)return;
    var rst=BB.getRummageState?BB.getRummageState():{};
    var step=(BB.quest&&BB.quest.step)||0;
    var els=BB.objEls();
    for(var id in els){
      var el=els[id];if(!el||!el.classList||!el.classList.contains('obj'))continue;
      var key=room+'|'+id,def=OBJ_SPR[key];
      if(!def)continue;
      var on=el.classList.contains('on');
      var opened=rst[id]&&Object.keys(rst[id].f||{}).length>0;
      var spr=def.s;
      if(opened&&def.open)spr=def.open;
      if(on&&def.on)spr=def.on;
      if(id==='register'&&room==='krusty_hall'&&step>=2&&def.open)spr=def.open;
      var ic=el.querySelector('.ic');
      if(ic&&el.dataset.bbSpr!==spr){
        el.dataset.bbSpr=spr;
        ic.innerHTML='<img class="bbObjImg" alt="" src="../assets/props/'+spr+'.png">';
      }
      var fx=el.querySelector('.bbFx');
      if(on&&FXBADGE[key]){
        if(!fx){fx=document.createElement('div');fx.className='bbFx';
          fx.textContent=FXBADGE[key];el.appendChild(fx);}
      }else if(fx)fx.remove();
    }
    /* 旋转检视弹窗正面 → 手绘立绘 */
    var spin=document.getElementById('spin');
    var sf=document.getElementById('spinFront');
    if(spin&&sf&&spin.style.display==='flex'){
      var tt=((document.getElementById('spinTitle')||{}).textContent||'').split(' · ')[1]||'';
      if(sf.dataset.bbTx!==tt){
        sf.dataset.bbTx=tt;
        var objs=BB.OBJECTS?BB.OBJECTS():[],found=null;
        for(var i=0;i<objs.length;i++)if(objs[i].tx===tt)found=objs[i];
        var d2=found?OBJ_SPR[room+'|'+found.id]:null;
        if(d2)sf.innerHTML='<img class="bbObjImg" src="../assets/props/'+d2.s+'.png">';
      }
    }else if(sf&&sf.dataset.bbTx){sf.dataset.bbTx='';}
  }

  /* --- 2.7 房间道具化：图标按物件高度放大、微旋转、贴地阴影（莉娜式散布观感） --- */
  function propify(){
    [].slice.call(document.querySelectorAll('#room .obj')).forEach(function(el){
      if(el.dataset.bbProp==='1')return;
      el.dataset.bbProp='1';
      var ic=el.querySelector('.ic');if(!ic)return;
      var t=(ic.textContent||'').trim().replace(/\uFE0F/g,'');
      if(!t)return;
      var h=parseFloat(el.style.height)||52;
      var hh=hash(el.id||t+el.style.left);
      var size=Math.round(h*0.92+(hh%3)*6);
      var spr=objSpriteFor(el);
      if(spr)ic.innerHTML='<img class="bbObjImg" alt="" src="../assets/props/'+spr+'.png">';
      else if(ICON)ic.innerHTML=ICON(t,size);
      el.style.transform='rotate('+(((hh>>4)%7)-3)+'deg)';
      var sh=document.createElement('div');sh.className='bbPropShadow';
      el.appendChild(sh);
    });
  }

  /* --- 3. 世界手绘装饰层 --- */
  function cloud(x,y,s,c){
    var pet='';
    for(var i=0;i<6;i++){
      var a=i*Math.PI/3;
      pet+='<ellipse cx="'+(50+28*Math.cos(a)).toFixed(1)+'" cy="'+(50+28*Math.sin(a)).toFixed(1)+
           '" rx="24" ry="20" fill="'+c+'" stroke="#162C36" stroke-width="4"/>';
    }
    return '<div class="bbCloud" style="left:'+x+'px;top:'+y+'px;width:'+s+'px;height:'+s+'px;'+
      'animation-delay:'+(Math.random()*6).toFixed(1)+'s">'+
      '<svg viewBox="0 0 100 100" width="100%" height="100%">'+pet+
      '<circle cx="50" cy="50" r="13" fill="#FBE34B" stroke="#162C36" stroke-width="4"/></svg></div>';
  }
  function jelly(x,y,s,c){
    return '<div class="bbJelly" style="left:'+x+'px;top:'+y+'px;width:'+s+'px;height:'+(s*1.3)+'px;'+
      'animation-delay:'+(Math.random()*4).toFixed(1)+'s">'+
      '<svg viewBox="0 0 80 104" width="100%" height="100%">'+
      '<path d="M6 46Q6 8 40 8t34 38q-6 10-12 4-7 9-14 2-8 9-16 1-9 8-14-2-6 6-12-5z" fill="'+c+'" stroke="#162C36" stroke-width="4" stroke-linejoin="round"/>'+
      '<path d="M20 54q-6 22 2 42M40 56q-4 24 2 44M60 54q6 22-2 42" fill="none" stroke="#162C36" stroke-width="4" stroke-linecap="round"/>'+
      '<circle cx="29" cy="33" r="4" fill="#162C36"/><circle cx="51" cy="33" r="4" fill="#162C36"/></svg></div>';
  }
  function weed(x,y,s,c){
    return '<div class="bbWeed" style="left:'+x+'px;top:'+y+'px;width:'+s+'px;height:'+(s*1.6)+'px;'+
      'animation-delay:'+(Math.random()*3).toFixed(1)+'s">'+
      '<svg viewBox="0 0 60 96" width="100%" height="100%">'+
      '<path d="M30 94Q4 68 12 30q16 6 18 34Q36 22 50 6q8 40-12 76z" fill="'+c+'" stroke="#162C36" stroke-width="4" stroke-linejoin="round"/>'+
      '<path d="M30 92V34" fill="none" stroke="#162C36" stroke-width="3" opacity=".55"/></svg></div>';
  }
  function rock(x,y,s){
    return '<div class="bbRock" style="left:'+x+'px;top:'+y+'px;width:'+s+'px;height:'+(s*.6)+'px">'+
      '<svg viewBox="0 0 100 60" width="100%" height="100%">'+
      '<path d="M6 54Q2 24 30 14q22-14 44 2 24 8 20 38z" fill="#3C5A68" stroke="#162C36" stroke-width="4"/>'+
      '<path d="M24 26q14-10 28-4" fill="none" stroke="#7FA8B8" stroke-width="4" stroke-linecap="round"/></svg></div>';
  }
  function bub(x,y,s){
    return '<div class="bbBub" style="left:'+x+'px;top:'+y+'px;width:'+s+'px;height:'+s+'px;'+
      'animation-delay:'+(Math.random()*7).toFixed(1)+'s">'+
      '<svg viewBox="0 0 40 40" width="100%" height="100%"><circle cx="20" cy="20" r="16" fill="#FFFFFF" fill-opacity=".34" stroke="#FFFFFF" stroke-width="3"/>'+
      '<path d="M11 14q4-6 10-5" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg></div>';
  }
  /* 原 #paths 是一条竖向 S 弯，放粗后像蓝色河流；改成横向平缓的深灰蓝街道 */
  function fixRoad(){
    var d='M -60 980 C 320 930 520 1060 900 990 S 1480 900 1880 970 S 2320 1060 2660 960';
    [].slice.call(document.querySelectorAll('#paths path')).forEach(function(p){p.setAttribute('d',d);});
  }
  function buildWorldDeco(){
    var world=document.getElementById('world');if(!world||document.getElementById('bbWorldDeco'))return;
    var d=document.createElement('div');d.id='bbWorldDeco';
    var h='';
    var clouds=[[90,70,190,'#F49CC0'],[430,150,140,'#B49ADB'],[760,60,220,'#9AD35C'],
      [1120,180,160,'#7FA8D6'],[1480,90,200,'#F49CC0'],[1860,160,150,'#B49ADB'],
      [2220,70,230,'#7FA8D6'],[2500,220,140,'#9AD35C'],
      /* 中景组：首屏相机显示世界 y≥470，这组在建筑后方、部分被遮挡，保证第一屏有花云 */
      [300,430,150,'#B49ADB'],[620,470,120,'#F49CC0'],[950,440,140,'#9AD35C'],
      [1300,480,120,'#7FA8D6'],[1660,430,150,'#F49CC0'],[2100,470,130,'#B49ADB']];
    clouds.forEach(function(c){h+=cloud(c[0],c[1],c[2],c[3]);});
    [[160,330,54],[620,260,44],[980,360,62],[1360,250,48],[1720,330,58],[2120,280,50],[2460,400,44],
     [420,560,40],[1080,600,36],[1780,580,42],[2380,560,38]]
      .forEach(function(j){h+=jelly(j[0],j[1],j[2],'#F49CC0');});
    [[60,980,80],[300,1120,64],[560,930,92],[900,1180,70],[1240,980,84],[1580,1120,66],
      [1980,960,90],[2320,1150,76],[2520,990,62]]
      .forEach(function(w,i){h+=weed(w[0],w[1],w[2],i%2?'#4E9A40':'#8FC96A');});
    [[240,1080,54],[700,1240,42],[1080,1060,60],[1460,1260,48],[1820,1080,56],[2200,1240,44],[2500,1120,52]]
      .forEach(function(r){h+=rock(r[0],r[1],r[2]);});
    for(var i=0;i<22;i++)h+=bub(80+Math.random()*2400,420+Math.random()*700,10+Math.random()*20);
    d.innerHTML=h;
    world.insertBefore(d,world.firstChild);
  }

  /* --- 4. 房间构图变体 + 主题道具层 --- */
  var TINT={krusty:'rgba(240,160,70,.13)',pineapple:'rgba(210,225,80,.12)',moai:'rgba(120,150,170,.16)',
    rock:'rgba(190,140,90,.14)',treedome:'rgba(110,205,175,.14)',chum:'rgba(95,135,165,.16)'};
  function hash(s){var h=0;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h;}
  function applyRoom(force){
    var room=document.getElementById('room'),skin=document.getElementById('bbRoomSkin');
    if(!room)return;
    var key=(window.__BB&&window.__BB.getRoom)?window.__BB.getRoom():null;
    if(!key)return;
    var theme=key.split('_')[0];
    var svgs=window.BB_ROOM_SKIN||{},src=svgs[theme]||'';
    var stamp=key+'|'+src.length+'|'+theme;
    if(!force && room.dataset.bbKey===stamp && (!skin||skin.innerHTML))return;
    room.dataset.bbKey=stamp;
    var h=hash(key);
    var scale=1+(h%26)/100, dx=-((h>>3)%90), dy=-((h>>6)%55);
    busy=true;
    room.style.backgroundSize=(1200*scale)+'px '+(760*scale)+'px';
    room.style.backgroundPosition=dx+'px '+dy+'px';
    busy=false;
    var tint=document.getElementById('bbRoomTint');
    if(!tint){tint=document.createElement('div');tint.id='bbRoomTint';room.appendChild(tint);}
    tint.style.cssText='position:absolute;inset:0;z-index:3;pointer-events:none;background:'+
      (TINT[theme]||'rgba(255,255,255,.05)')+';mix-blend-mode:multiply;';
    if(!skin){skin=document.createElement('div');skin.id='bbRoomSkin';room.appendChild(skin);}
    skin.innerHTML=src;
    var svg=skin.querySelector('svg');
    if(svg){
      svg.style.transform=(h%2)?'scaleX(-1)':'none';
      svg.style.transformOrigin='center center';
      svg.style.opacity='.9';
    }
  }

  /* --- 5. 点击反馈：金色小星星 --- */
  function sparkle(x,y){
    for(var i=0;i<6;i++){
      var s=document.createElement('div');
      var a=Math.random()*Math.PI*2,r=26+Math.random()*46;
      s.textContent='✦';s.style.cssText='position:fixed;left:'+x+'px;top:'+y+'px;z-index:9999;'+
        'pointer-events:none;color:#FBE34B;font-size:20px;text-shadow:0 2px 0 #162C36;'+
        'transition:transform .6s ease-out,opacity .6s ease-out;';
      document.body.appendChild(s);
      (function(el,dx,dy){requestAnimationFrame(function(){
        el.style.transform='translate('+dx+'px,'+dy+'px) scale(.3) rotate(180deg)';el.style.opacity='0';
      });setTimeout(function(){el.remove();},650);})(s,Math.cos(a)*r,Math.sin(a)*r);
    }
  }

  /* --- 7. 动态景深：世界内按 y 排前后，玩家/NPC 走到建筑下方时应被建筑遮挡 --- */
  function syncDepth(){
    var p=document.getElementById('player');
    if(p&&p.style.top)p.style.zIndex=String(100+Math.round((parseFloat(p.style.top)||0)/10));
    [].slice.call(document.querySelectorAll('.building')).forEach(function(b){
      var y=parseFloat(b.style.top)||0,h=parseFloat(b.style.height)||0;
      b.style.zIndex=String(100+Math.round((y+h)/10));
    });
    [].slice.call(document.querySelectorAll('#world .actor')).forEach(function(a){
      if(a.style.top)a.style.zIndex=String(100+Math.round((parseFloat(a.style.top)||0)/10));
    });
    /* 室内同样按 y 景深：物件/座椅/NPC/玩家统一尺度，玩家走到物件前方会遮住它 */
    var ip=document.getElementById('iplayer');
    if(ip&&ip.style.top)ip.style.zIndex=String(100+Math.round((parseFloat(ip.style.top)||0)/10));
    [].slice.call(document.querySelectorAll(
      '#room .obj,#room .seat,#roomDecor .actor,#roomNpcs .actor')).forEach(function(el){
      if(el.style.top)el.style.zIndex=String(100+Math.round((parseFloat(el.style.top)||0)/10));
    });
  }

  /* --- 8. 免责角标 --- */
  function disclaimer(){
    if(document.getElementById('bbDisclaimer'))return;
    var d=document.createElement('div');d.id='bbDisclaimer';
    d.textContent='非商用同人练习作品 · 与 Nickelodeon / Paramount 无关联';
    document.body.appendChild(d);
  }

  /* --- 7. 引导与观察器 --- */
  function pass(root){
    if(busy)return;
    propify();
    dressActors(root);
    iconize(root);
  }
  function boot(){
    fixRoad();buildWorldDeco();disclaimer();applyRoom();pass(document.body);
    var mo=new MutationObserver(function(recs){
      var touched=false;
      recs.forEach(function(r){
        if(r.type==='childList'){
          [].slice.call(r.addedNodes).forEach(function(n){if(n.nodeType===1){pass(n);touched=true;}});
        }else if(r.type==='characterData'&&r.target.parentNode){
          pass(r.target.parentNode);touched=true;
        }else if(r.type==='attributes'&&r.target.id==='room'){
          applyRoom();
        }
      });
      if(touched)applyRoom();
    });
    mo.observe(document.body,{childList:true,subtree:true,characterData:true,
      attributes:true,attributeFilter:['style']});
    document.addEventListener('click',function(e){
      var t=e.target.closest?e.target.closest('.building,.obj,.seat,.playspot,.btn'):null;
      if(t)sparkle(e.clientX,e.clientY);
    },true);
    // 主题层脚本可能晚于本文件加载，首帧之后再强制补一次
    setTimeout(function(){applyRoom(true);},600);
    setInterval(function(){syncDepth();syncObjState();},140);
    window.addEventListener('resize',function(){var r=document.getElementById('room');
      if(r)r.dataset.bbKey='';applyRoom();});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
  else boot();
})();
