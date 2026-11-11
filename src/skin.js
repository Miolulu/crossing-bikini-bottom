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
    'G-14-09-seahorse_postal.png','G-14-10-catfish_farmer.png',
    'G-14-11-blowfish_grandma.png','G-14-12-skay_mustache.png'];
  /* 居民名字必须和外形对得上：一次出图 12 格，切分后文件名与画面并非一一对应，
     已按实际画面把 09/10/11/12 四张的文件名校正（见 assets/art-params.md §十三） */
  var RES_BY_NAME={
    '泡泡鱼':'G-14-11-blowfish_grandma.png',   // 圆鼓鼓的斑点河豚
    '条纹鱼':'G-14-02-puffer_stripes.png',     // 红白条纹的河豚
    '神仙鱼':'G-14-03-angelfish_hat.png',      // 戴帽子的神仙鱼
    '比目鱼':'G-14-04-old_flounder.png',       // 扁扁的、拄拐的老比目鱼
    '石头鱼':'G-14-12-skay_mustache.png',      // 贴着地面像块石头、还留着胡子
    '海鲶先生':'G-14-10-catfish_farmer.png'    // 有胡子的鲶鱼、穿背带裤
  };
  window.BB_RES_SPRITE=RES_BY_NAME;   // 供对话面板取同一位居民的立绘
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
      else if(isBot){
        var nmEl=host.querySelector('.nm');
        var nm=nmEl?(nmEl.textContent||'').trim():'';
        f=RES_BY_NAME[nm]||RESIDENTS[(Math.random()*RESIDENTS.length)|0];
      }
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
    'moai_f1|cushion':{s:'E-09-cushion'},
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
    'pineapple_main|hat':{s:'E-08-soda_cap'},
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

  /* --- 3. 世界装饰层（v10：全部换手绘 PNG 立绘，不再用内联 SVG 拼形状） ---
     A-01 底图本身已经画了海草/卵石/气泡/沙路，所以这里只补「底图没有」的东西：
     花云、水母，以及零星散在沙地上的海星 / 贝壳 / 鹅卵石点缀。
     kelp / rock / bubble 三组 SVG 已删除（会和底图重复、且比角色还高）。 */
  var DECO_DIR = '../assets/world/';
  function decoTag(dir, file) {
    return '<img class="bbDecoImg" alt="" src="' + dir + file + '.png" draggable="false">';
  }
  function cloud(x, y, s, variant) {
    return '<div class="bbCloud" style="left:' + x + 'px;top:' + y + 'px;width:' + s +
      'px;height:' + s + 'px;animation-delay:' + (Math.random() * 6).toFixed(1) + 's">' +
      decoTag(DECO_DIR, 'A-03-flower_cloud' + variant) + '</div>';
  }
  function jelly(x, y, s, variant) {
    return '<div class="bbJelly" style="left:' + x + 'px;top:' + y + 'px;width:' + s +
      'px;height:' + (s * 1.25) + 'px;animation-delay:' + (Math.random() * 4).toFixed(1) + 's">' +
      decoTag(DECO_DIR, 'A-03-jellyfish' + variant) + '</div>';
  }
  function ground(x, y, s, file) {
    return '<div class="bbGround" style="left:' + x + 'px;top:' + y + 'px;width:' + s +
      'px;height:' + s + 'px">' + decoTag(DECO_DIR, file) + '</div>';
  }
  /* 原 #paths 是一条竖向 S 弯，放粗后像河流；v10 起 #paths 已在 skin.css 里关掉，
     底图自带的手绘沙路才是唯一的路，这里不再改写路径。 */
  function buildWorldDeco(){
    var world=document.getElementById('world');if(!world||document.getElementById('bbWorldDeco'))return;
    var d=document.createElement('div');d.id='bbWorldDeco';
    var h='';
    [[90,70,190,1],[430,150,140,2],[760,60,220,3],[1120,180,160,1],[1480,90,200,2],
     [1860,160,150,3],[2220,70,230,1],[2500,220,140,2],
     /* 中景组：首屏相机显示世界 y≥470，这组在建筑后方、部分被遮挡，保证第一屏有花云 */
     [300,430,150,3],[620,470,120,1],[950,440,140,2],
     [1300,480,120,3],[1660,430,150,1],[2100,470,130,2]]
      .forEach(function(c){h+=cloud(c[0],c[1],c[2],c[3]);});
    [[160,330,54,1],[620,260,44,2],[980,360,62,3],[1360,250,48,1],[1720,330,58,2],
     [2120,280,50,3],[2460,400,44,1],[420,560,40,2],[1080,600,36,3],[1780,580,42,1],[2380,560,38,2]]
      .forEach(function(j){h+=jelly(j[0],j[1],j[2],j[3]);});
    /* 沙地点缀：海星 / 贝壳 / 鹅卵石（底图这些位置是空沙） */
    [[240,1080,46,'A-03-starfish'],[700,1240,38,'A-03-shell'],[1080,1060,40,'A-03-pebble1'],
     [1460,1260,34,'A-03-pebble2'],[1820,1080,42,'A-03-shell'],[2200,1240,36,'A-03-starfish'],
     [2500,1120,44,'A-03-pebble1'],[520,980,34,'A-03-pebble2'],[1620,1010,30,'A-03-shell']]
      .forEach(function(g){h+=ground(g[0],g[1],g[2],g[3]);});
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
    /* v9：14 个房间已各自重绘，不再做「随机缩放/偏移/镜像」伪造差异化，
       也不叠加 room-skins 的 SVG 家具层（会和新手绘图里的柜台桌椅打架）。 */
    var h=hash(key);
    busy=true;
    room.style.backgroundSize='1200px 760px';
    room.style.backgroundPosition='0px 0px';
    busy=false;
    var tint=document.getElementById('bbRoomTint');
    if(tint)tint.remove();
    if(!skin){skin=document.createElement('div');skin.id='bbRoomSkin';room.appendChild(skin);}
    skin.innerHTML='';
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
    buildWorldDeco();disclaimer();applyRoom();pass(document.body);
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
