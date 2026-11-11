/* ==========================================================================
   v11 交互引擎 · 「摇一摇，掉出来」
   --------------------------------------------------------------------------
   一次点击的完整生命周期：
     轻触物件 → 物件自己摇 → 从开口方向掉出实体小物（抛物线落地）
     → 点小物，沿弧线飞进右下角布口袋 → 一行手写题注淡出
   spin 类额外做原地 rotateY 转体，转到背面时换 *-back 立绘（不是卡片翻面）。
   rummage 类额外把物件换成「拉开的容器」立绘，里头的东西一次散出来。
   不产生任何居中弹窗 / 白卡 / 文字的说明页。
   依赖 window.__BB（index.html 末尾导出）与 assets/props/E-14 / E-15 素材。
   ========================================================================== */
(function () {
  'use strict';
  var BB = window.__BB;
  if (!BB || !BB.roomEl) return;

  var DROP_DIR = '../assets/props/';
  var LOOT = ['receipt', 'coin', 'cap', 'key', 'clip', 'conch', 'photo', 'note',
    'pouch', 'kelp', 'button', 'pencil', 'wrapper', 'ring', 'cork', 'vial'];

  /* 物件语义 → 最贴切的那一件掉落实体（不用逐条配表，按关键词归类） */
  var RULES = [
    [/coin|dollar|gold/, 'coin'],
    [/ticket|receipt|menu|note|ledger|calendar|magazine|flyer|paper|plan|whiteboard|board|draft/, 'note'],
    [/photo|portrait|frame|picture|calendar_photo/, 'photo'],
    [/key|lock|safe|drawer|cabinet|nightstand|desk/, 'key'],
    [/shell|conch|helmet|clip|hairpin/, 'clip'],
    [/net|kelp|plant|flower|pine|wreath|seaweed|tree/, 'kelp'],
    [/clock|lamp|button|switch|knob/, 'button'],
    [/pencil|easel|paintbox|brush|shovel|spatula|crayon/, 'pencil'],
    [/vinyl|record|gramophone|jukebox|clarinet|music|radio/, 'ring'],
    [/salt|sauce|coffee|cup|bottle|jar|candy|paint|vial|tube|drink|syrup/, 'vial'],
    [/bin|trash|waste|basket/, 'wrapper'],
    [/fries|chips|cookie|burger|food|patty/, 'wrapper'],
    [/sack|pouch|bucket|basket|bag/, 'pouch'],
    [/cap|hat|ornament|flag/, 'cap'],
    [/statue|moai|rock|anchor|stone|barbell/, 'conch'],
    [/snail|gary|conch/, 'conch'],
    [/fridge|freezer|cooler|ice/, 'cork']
  ];

  function hash(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return Math.abs(h);
  }

  function lootKey(o) {
    var s = ((o.id || '') + ' ' + (o.tx || '')).toLowerCase();
    for (var i = 0; i < RULES.length; i++) if (RULES[i][0].test(s)) return RULES[i][1];
    return LOOT[hash(s) % LOOT.length];
  }

  /* 容器开态：翻找类物件换成「拉开的抽屉 / 双开柜 / 开门冰箱 / 掀盖木箱」 */
  var OPEN_RULES = [
    [/fridge|freezer|cooler|cold|ice/, 'E-15-open_fridge'],
    [/cabinet|locker|safe|cupboard|wardrobe|liquor|medic/, 'E-15-open_locker'],
    [/bin|trash|chest|box|crate|basket|dumpster/, 'E-15-open_chest'],
    [/drawer|desk|nightstand|table|counter|shelf/, 'E-15-open_drawer']
  ];
  function openArt(o) {
    var s = ((o.id || '') + ' ' + (o.tx || '')).toLowerCase();
    for (var i = 0; i < OPEN_RULES.length; i++) if (OPEN_RULES[i][0].test(s)) return OPEN_RULES[i][1];
    return 'E-15-open_drawer';
  }

  /* 藏品 → 掉落实体（藏品册里用真立绘，不铺 emoji） */
  var EGG_LOOT = {
    e1_recipe: 'note', e2_photo: 'photo', e3_coin: 'coin', e4_draft: 'note',
    e5_spatula: 'pencil', e6_sesame: 'button', e7_tip: 'note', e8_menu: 'note',
    e9_clarinet: 'vial', e10_joy: 'vial', e11_resign: 'note', e12_vinyl: 'ring',
    e13_gary: 'conch', e14_pinedraft: 'note', e15_quiz: 'note', e16_doodle: 'kelp',
    e17_sandnote: 'note', e18_log: 'note', e19_fail: 'note', e20_lonely: 'note',
    e21_night: 'ring', e22_bubble: 'vial', e23_flag: 'cap', e24_cookie: 'wrapper',
    e25_helmet: 'clip', e26_acorn: 'conch', e27_weapon: 'vial'
  };

  /* ---------- 舞台 ---------- */
  var room = BB.roomEl();
  var layer = document.createElement('div');
  layer.id = 'roomDrops';
  room.appendChild(layer);

  var pocket = document.getElementById('pocket');
  var pkHang = document.getElementById('pkHang');
  var lastRoom = null;

  function clearDrops() {
    layer.innerHTML = '';
    pkHang.innerHTML = '';
  }

  /* ---------- 手写题注（唯一允许出现的文字，两行以内、自动淡出） ---------- */
  function caption(x, y, text, ms) {
    if (!text) return;
    text = String(text).replace(/\s+/g, ' ').slice(0, 34);
    var c = document.createElement('div');
    c.className = 'bbCap';
    c.textContent = text;
    c.style.left = Math.max(90, Math.min(1110, x)) + 'px';
    c.style.top = Math.max(60, Math.min(730, y)) + 'px';
    layer.appendChild(c);
    setTimeout(function () {
      c.style.transition = 'opacity .45s ease, transform .45s ease';
      c.style.opacity = '0';
      c.style.transform = 'translate(-50%,-118%) rotate(-1.5deg)';
      setTimeout(function () { if (c.parentNode) c.remove(); }, 480);
    }, ms || 2600);
    return c;
  }

  /* ---------- 摇晃 ---------- */
  function wobble(el, strength) {
    var ic = el && el.querySelector('.ic');
    if (!ic) return;
    var k = strength || 1;
    ic.animate([
      { transform: 'rotate(0deg) scale(1,1)' },
      { transform: 'rotate(' + (-9 * k) + 'deg) scale(' + (1 + .05 * k) + ',' + (1 - .05 * k) + ')' },
      { transform: 'rotate(' + (7.5 * k) + 'deg) scale(' + (1 - .04 * k) + ',' + (1 + .04 * k) + ')' },
      { transform: 'rotate(' + (-4.5 * k) + 'deg) scale(1.02,0.98)' },
      { transform: 'rotate(' + (2.5 * k) + 'deg) scale(1,1)' },
      { transform: 'rotate(0deg) scale(1,1)' }
    ], { duration: 520, easing: 'ease-out' });
  }

  function dust(x, y, n) {
    for (var i = 0; i < (n || 3); i++) {
      (function (i) {
        var d = document.createElement('i');
        d.className = 'bbDust';
        d.style.left = x + 'px';
        d.style.top = y + 'px';
        layer.appendChild(d);
        var dx = (Math.random() - .5) * 60;
        var dy = -14 - Math.random() * 22;
        d.animate([
          { transform: 'translate(-50%,-50%) scale(.6)', opacity: .85 },
          { transform: 'translate(-50%,-50%) translate(' + dx + 'px,' + dy + 'px) scale(1.25)', opacity: 0 }
        ], { duration: 560 + i * 90, easing: 'ease-out' }).onfinish = function () { d.remove(); };
      })(i);
    }
  }

  /* ---------- 掉落 ---------- */
  function dropPoint(o) {
    var w = o.w || 56, h = o.h || 52;
    var x0 = o.x + w / 2, y0 = o.y + h - 4;
    var lx = Math.max(90, Math.min(1110, x0 + (Math.random() - .5) * 190));
    var ly = Math.max(140, Math.min(694, y0 + 30 + Math.random() * 44));
    return { x: x0, y: y0, lx: lx, ly: ly, w: w, h: h };
  }

  var FAN = [[-62, 36], [2, 62], [64, 30], [-30, 74]];
var fanIdx = 0;
function spawnLoot(o, opt) {
    opt = opt || {};
    var key = opt.key || lootKey(o);
    var p = dropPoint(o);
    var f = FAN[(opt.slot != null ? opt.slot : fanIdx++) % FAN.length];
    p.lx = Math.max(90, Math.min(1110, p.x + f[0] + (Math.random() - .5) * 24));
    p.ly = Math.max(150, Math.min(694, p.y + f[1] + (Math.random() - .5) * 18));
    var size = opt.size || (52 + Math.round(Math.random() * 14));
    var el = document.createElement('div');
    el.className = 'drop' + (opt.rare ? ' rare' : '');
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.left = p.lx + 'px';
    el.style.top = p.ly + 'px';
    el.style.zIndex = String(120 + Math.round(p.ly / 10));
    el.innerHTML = '<img alt="" draggable="false" src="' + DROP_DIR + 'E-14-loot_' + key + '.png">';
    layer.appendChild(el);

    var dx = p.x - p.lx, dy = p.y - p.ly;
    var anim = el.animate([
      { transform: 'translate(-50%,-50%) translate(' + dx + 'px,' + dy + 'px) scale(.45) rotate(0deg)' },
      { transform: 'translate(-50%,-50%) translate(' + (dx * .42) + 'px,' + (dy * .58 - 58) + 'px) scale(.95) rotate(110deg)' },
      { transform: 'translate(-50%,-50%) translate(' + (dx * .12) + 'px,' + (dy * .12 - 26) + 'px) scale(1.04) rotate(180deg)' },
      { transform: 'translate(-50%,-50%) translate(0,0) scale(1.08,.9) rotate(220deg)' },
      { transform: 'translate(-50%,-50%) translate(0,-7px) scale(1) rotate(225deg)' },
      { transform: 'translate(-50%,-50%) translate(0,0) scale(1) rotate(225deg)' }
    ], { duration: 640, delay: opt.delay || 0, easing: 'cubic-bezier(.3,.1,.5,1)' });

    /* 兜底：动画没跑起来（无头截图 / prefers-reduced-motion）时也要停在落点，
       所以落点由 inline left/top 决定，动画只是装饰，结束后强制归位一次。 */
    var settled = false;
    function settle() {
      if (settled) return; settled = true;
      try { el.getAnimations().forEach(function (a) { a.cancel(); }); } catch (e) { }
      if (el.parentNode) el.style.transform = 'translate(-50%,-50%)';
    }
    if (anim && anim.onfinish !== undefined) { try { anim.onfinish = settle; } catch (e) { } }
    setTimeout(settle, (opt.delay || 0) + 700);

    el.onclick = function (ev) {
      ev.stopPropagation();
      pickUp(el, o, opt);
    };
    return el;
  }

  /* ---------- 拾取：沿弧线飞进口袋 ---------- */
  function pickUp(el, o, opt) {
    if (el.dataset.picked) return;
    el.dataset.picked = '1';
    var r = el.getBoundingClientRect();
    var pr = pocket ? pocket.getBoundingClientRect() : { left: innerWidth - 60, top: innerHeight - 120, width: 60, height: 60 };
    var tx = pr.left + pr.width / 2 - (r.left + r.width / 2);
    var ty = pr.top + pr.height / 2 - (r.top + r.height / 2);

    var fly = document.createElement('img');
    fly.className = 'bbFly';
    fly.src = el.querySelector('img').src;
    fly.style.cssText = 'position:fixed;z-index:620;pointer-events:none;left:' + r.left + 'px;top:' + r.top +
      'px;width:' + r.width + 'px;height:' + r.height + 'px;object-fit:contain;';
    document.body.appendChild(fly);
    el.style.visibility = 'hidden';

    fly.animate([
      { transform: 'translate(0,0) scale(1) rotate(0deg)', opacity: 1 },
      { transform: 'translate(' + (tx * .35) + 'px,' + (ty * .35 - 70) + 'px) scale(1.1) rotate(120deg)', opacity: 1, offset: .45 },
      { transform: 'translate(' + tx + 'px,' + ty + 'px) scale(.18) rotate(300deg)', opacity: .1 }
    ], { duration: 560, easing: 'cubic-bezier(.4,.05,.85,.55)' }).onfinish = function () {
      fly.remove();
      el.remove();
      bumpPocket(fly.dataset.src || '');
    };
    fly.dataset.src = fly.src;

    /* 落袋瞬间的一行题注（不等待动画结束，手感更跟手） */
    var line = opt.caption || o.secret || o.desc || '';
    var p = dropPoint(o);
    caption(p.lx, p.ly - 34, line);

    if (opt.egg && BB.collectEgg) BB.collectEgg(opt.egg);
    if (opt.onPick) opt.onPick(o);
  }

  function bumpPocket(src) {
    if (!pocket) return;
    pocket.classList.remove('bump');
    void pocket.offsetWidth;
    pocket.classList.add('bump');
    if (src) {
      var h = document.createElement('img');
      h.className = 'pkItem';
      h.src = src;
      pkHang.appendChild(h);
      while (pkHang.children.length > 4) pkHang.removeChild(pkHang.firstChild);
      h.animate([{ transform: 'translateY(6px) scale(.4)', opacity: 0 },
        { transform: 'translateY(0) scale(1)', opacity: 1 }], { duration: 260, easing: 'ease-out' });
    }
  }

  /* ---------- 六类物件 ---------- */
  function hit(id) {
    var o = BB.findObj(id);
    if (!o) return;
    if (BB.moveLocked && BB.moveLocked()) return;
    var el = BB.objEls()[id];
    var k = o.kind || 'peek';

    if (k === 'toggle') { wobble(el, 1.1); BB.doToggle(o); return; }
    if (k === 'spin') { spinLook(o, el); return; }
    if (k === 'collect') { collectObj(o, el); return; }
    if (k === 'egg') { eggHit(o, el); return; }
    if (k === 'rummage') { rummage(o, el); return; }

    /* peek：摇两下，掉出这件东西的「代表物」 */
    wobble(el);
    if (BB.popObj) BB.popObj(id);
    var p = dropPoint(o);
    dust(p.x, p.y, 3);
    var opts = { caption: o.secret || o.desc };
    if (o.data && o.data.egg) { opts.rare = true; opts.egg = o.data.egg; opts.caption = o.secret || o.desc; }
    setTimeout(function () { spawnLoot(o, opts); }, 150);
  }

  /* 开关：换立绘之外再加环境联动 */
  function afterToggle(o, on) {
    var id = (o.id || '') + ' ' + (o.tx || '');
    if (/lamp|light|desk/.test(id)) {
      document.body.classList.toggle('bb-warm', !!on);
    }
    if (/music|record|gramophone|jukebox|radio/.test(id)) {
      var el = BB.objEls()[o.id];
      var ic = el && el.querySelector('.ic');
      if (ic && on) {
        ic.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(6deg)' },
          { transform: 'rotate(-6deg)' }, { transform: 'rotate(0)' }],
          { duration: 700, iterations: 2, easing: 'ease-in-out' });
      }
    }
    var el2 = BB.objEls()[o.id];
    if (el2) {
      var r = { x: o.x + (o.w || 56) / 2, y: o.y - 8 };
      caption(r.x, r.y, on ? ((o.data && o.data.on) || '打开了') : ((o.data && o.data.off) || '关上了'), 2200);
    }
  }

  /* 旋转检视：原地转体，到背面换 *-back 立绘（不是翻牌） */
  function spinLook(o, el) {
    var ic = el && el.querySelector('.ic');
    if (!ic) return;
    var img = ic.querySelector('img');
    var back = !el.dataset.bbBack;
    wobble(el, .6);

    var canSwap = img && /-front\.png$/i.test(img.src);
    var frames = back
      ? [{ transform: 'rotateY(0deg) scale(1)' },
         { transform: 'rotateY(70deg) scale(1.1)' },
         { transform: 'rotateY(180deg) scaleX(-1) scale(1.14)' }]
      : [{ transform: 'rotateY(180deg) scaleX(-1) scale(1.14)' },
         { transform: 'rotateY(110deg) scale(1.1)' },
         { transform: 'rotateY(0deg) scale(1)' }];

    el.classList.add('bbSpinning');
    ic.style.transformOrigin = '50% 60%';
    var a = ic.animate(frames, { duration: 620, easing: 'ease-in-out', fill: 'forwards' });
    if (canSwap) {
      setTimeout(function () {
        img.src = back ? img.src.replace('-front.png', '-back.png') : img.src.replace('-back.png', '-front.png');
      }, 260);
    }
    a.onfinish = function () {
      el.classList.toggle('bbBack', back);
      el.dataset.bbBack = back ? '1' : '';
      if (back) {
        var line = (o.data && o.data.back) || o.secret || '背面什么也没有。';
        caption(o.x + (o.w || 56) / 2, o.y - 10, line, 3000);
        if (o.data && o.data.egg && BB.collectEgg) BB.collectEgg(o.data.egg);
      }
    };
  }

  function reflip(id) { hit(id); }

  /* 拾取类：物件自己缩小飞进口袋 */
  function collectObj(o, el) {
    wobble(el);
    if (BB.doCollect && BB.doCollect(o) === false) {
      caption(o.x + (o.w || 56) / 2, o.y - 8, '已经收进袋子里啦', 2000);
      return;
    }
    var ic = el && el.querySelector('.ic img');
    if (!ic) { caption(o.x + (o.w || 56) / 2, o.y - 8, o.tx + ' 收好了', 2200); return; }
    var fake = { src: ic.src };
    var r = el.getBoundingClientRect();
    var pr = pocket ? pocket.getBoundingClientRect() : { left: innerWidth - 60, top: innerHeight - 120, width: 60, height: 60 };
    var fly = document.createElement('img');
    fly.className = 'bbFly';
    fly.src = fake.src;
    fly.style.cssText = 'position:fixed;z-index:620;pointer-events:none;left:' + r.left + 'px;top:' + r.top +
      'px;width:' + r.width + 'px;height:' + r.height + 'px;object-fit:contain;';
    document.body.appendChild(fly);
    var tx = pr.left + pr.width / 2 - (r.left + r.width / 2);
    var ty = pr.top + pr.height / 2 - (r.top + r.height / 2);
    fly.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: 'translate(' + (tx * .3) + 'px,' + (ty * .3 - 60) + 'px) scale(.9)', opacity: 1, offset: .4 },
      { transform: 'translate(' + tx + 'px,' + ty + 'px) scale(.15)', opacity: .1 }
    ], { duration: 620, easing: 'cubic-bezier(.4,.05,.85,.55)' }).onfinish = function () {
      fly.remove();
      bumpPocket(fake.src);
    };
    caption(o.x + (o.w || 56) / 2, o.y - 8, o.secret || o.tx, 2400);
  }

  /* 彩蛋类：连点三次才掉 */
  function eggHit(o, el) {
    wobble(el, 1.2);
    var done = BB.doEgg && BB.doEgg(o);
    var p = dropPoint(o);
    dust(p.x, p.y, 2);
    if (done) {
      spawnLoot(o, { rare: true, key: lootKey(o), caption: (o.data && o.data.hint) || '它忽然开口了' });
    } else {
      var n = BB.eggTriesOf ? BB.eggTriesOf(o.id) : 1;
      caption(p.x, p.y - 18, ['好像有反应……再试试', '它动了一下', '快了，再一下'][Math.min(2, n - 1)], 1800);
    }
  }

  /* 翻找类：换成开着的容器立绘，里头的东西一次散出来 */
  var rumState = {};
  function rummage(o, el) {
    var img = el && el.querySelector('.ic img');
    if (img && !el.dataset.bbOpen) {
      el.dataset.bbOpen = '1';
      el.dataset.bbOrig = img.src;
      img.src = DROP_DIR + openArt(o) + '.png';
      img.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.1)' }, { transform: 'scale(1)' }],
        { duration: 420, easing: 'ease-out' });
      dust(o.x + (o.w || 56) / 2, o.y + (o.h || 52), 4);
    }
    var st = rumState[o.id] || (rumState[o.id] = { dropped: {} });
    var slots = (o.data && o.data.slots) || [];
    var normalPicked = st.picked || 0;

    st.used = st.used || {};
    slots.forEach(function (sl, i) {
      if (st.dropped[i]) return;
      if (sl.deep && normalPicked < 2) return;
      st.dropped[i] = true;
      var key = sl.key || lootKey({ id: o.id + '_' + i, tx: sl.tx || '' });
      /* 一个容器里连掉三张一样的「软木塞」很出戏：同容器内去重 */
      for (var g = 0; st.used[key] && g < LOOT.length; g++) {
        key = LOOT[(LOOT.indexOf(key) + 1) % LOOT.length];
      }
      st.used[key] = 1;
      setTimeout(function () {
        spawnLoot(o, {
          slot: i,
          key: key,
          rare: !!sl.deep || !!sl.egg,
          egg: sl.egg,
          size: sl.deep ? 56 : 46,
          caption: sl.desc || sl.tx,
          onPick: function () {
            st.picked = (st.picked || 0) + 1;
            if (st.picked >= 2) setTimeout(function () { rummagePeek(o, el); }, 320);
          }
        });
      }, 160 + i * 130);
    });

    if (!el.dataset.bbOpenNote) {
      el.dataset.bbOpenNote = '1';
      caption(o.x + (o.w || 56) / 2, o.y - 10, (o.data && o.data.title) || '里头有些东西', 2400);
    }
  }
  function rummagePeek(o, el) { /* 拿走两件后自动把夹层抖出来 */
    var st = rumState[o.id]; if (!st) return;
    var slots = (o.data && o.data.slots) || [];
    for (var i = 0; i < slots.length; i++) {
      if (!st.dropped[i]) { rummage(o, el); return; }
    }
  }

  /* 换房间时清场 */
  setInterval(function () {
    var r = BB.getRoom ? BB.getRoom() : null;
    if (r !== lastRoom) { lastRoom = r; clearDrops(); document.body.classList.remove('bb-warm'); }
  }, 260);

  window.BB_ACT = {
    hit: hit,
    afterToggle: afterToggle,
    reflip: reflip,
    caption: caption,
    clear: clearDrops,
    lootForEgg: function (eid) { var k = EGG_LOOT[eid]; return k ? 'E-14-loot_' + k : null; },
    lootKey: lootKey,
    /* QA 用：直接在某物件上触发一次 */
    poke: function (id) { hit(id); }
  };
})();
