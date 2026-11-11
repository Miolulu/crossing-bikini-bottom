/* 比奇堡 v5 · 手绘图标库
   统一视觉语言：粗黑歪扭描边 + 平涂 + 小高光，与 assets 里的手绘 PNG 一致。
   全部图标为内联 SVG，零网络请求、零积分、可随容器缩放、可参与动画。 */
(function(){
  var P={ink:'#20303b',gold:'#FFC93C',coral:'#F2785C',teal:'#4FC3C7',blue:'#5B9BD5',
    green:'#8FC96A',brown:'#C08A50',pink:'#F2A0B4',purple:'#AC8BD8',gray:'#9CAEB6',
    sand:'#EED9A6',cream:'#FFF3D2',white:'#FFF9E8',red:'#E2523F',deep:'#2E6E86'};
  var S=function(c1,c2){return '<g stroke="'+P.ink+'" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round">'+
    '<g fill="'+c1+'">%BODY%</g><g fill="'+c2+'" stroke="'+P.ink+'">%ACC%</g></g>';};
  var shapes={
    paper:function(c1,c2){return S(c1,c2).replace('%BODY%','<path d="M15 7h27l8 9v41H15z"/><path d="M42 7v9h8" fill="none" stroke="'+P.ink+'"/>')
      .replace('%ACC%','<path d="M21 26h23M21 34h23M21 42h15" fill="none" stroke="'+P.ink+'" stroke-width="3"/>');},
    coin:function(c1,c2){return S(c1,c2).replace('%BODY%','<circle cx="32" cy="32" r="22"/>')
      .replace('%ACC%','<circle cx="32" cy="32" r="14" fill="none" stroke="'+P.ink+'" stroke-width="3"/><path d="M25 17q7-6 15-1" fill="none" stroke="'+P.white+'" stroke-width="3"/>');},
    jar:function(c1,c2){return S(c1,c2).replace('%BODY%','<path d="M21 19h22v5l4 7v25H17V31l4-7z"/>')
      .replace('%ACC%','<rect x="18" y="11" width="28" height="9" rx="3"/><path d="M22 38h20" fill="none" stroke="'+P.white+'" stroke-width="3"/>');},
    box:function(c1,c2){return S(c1,c2).replace('%BODY%','<path d="M8 23L32 11l24 12-24 12z"/><path d="M8 23v22l24 11V35z"/>')
      .replace('%ACC%','<path d="M56 23v22L32 56V35z"/><path d="M32 35v21" fill="none" stroke="'+P.ink+'"/>');},
    frame:function(c1,c2){return S(c1,c2).replace('%BODY%','<rect x="8" y="10" width="48" height="44" rx="4"/>')
      .replace('%ACC%','<rect x="15" y="17" width="34" height="29" rx="2"/><path d="M18 41l10-12 7 8 6-6 7 10z" fill="'+P.green+'" stroke="'+P.ink+'" stroke-width="2.5"/>');},
    rock:function(c1,c2){return S(c1,c2).replace('%BODY%','<path d="M8 49q1-22 15-27 9-13 25-4 15 7 8 31z"/>')
      .replace('%ACC%','<path d="M20 31q8-6 14-3" fill="none" stroke="'+P.white+'" stroke-width="3"/>');},
    shell:function(c1,c2){return S(c1,c2).replace('%BODY%','<path d="M32 55Q9 45 10 24q12-13 22 1 10-14 22-1 1 21-22 31z"/>')
      .replace('%ACC%','<path d="M32 25v28M20 21l8 30M44 21l-8 30" fill="none" stroke="'+P.ink+'" stroke-width="2.4"/>');},
    star:function(c1,c2){return S(c1,c2).replace('%BODY%','<path d="M32 6l8 17 19 2-14 13 4 19-17-9-17 9 4-19L5 25l19-2z"/>')
      .replace('%ACC%','<circle cx="32" cy="31" r="5" fill="'+P.white+'"/>');},
    gear:function(c1,c2){return S(c1,c2).replace('%BODY%','<circle cx="32" cy="32" r="17"/><path d="M28 4h8l2 9h-12zM28 60h8l-2-9h-6zM4 28v8l9 2v-12zM60 28v8l-9-2v-6zM11 11l6 6 7-7-6-6zM47 47l6 6 7-7-6-6z"/>')
      .replace('%ACC%','<circle cx="32" cy="32" r="7" fill="'+P.cream+'"/>');},
    tool:function(c1,c2){return S(c1,c2).replace('%BODY%','<rect x="28" y="8" width="8" height="38" rx="4"/>')
      .replace('%ACC%','<ellipse cx="32" cy="49" rx="13" ry="9"/><path d="M27 46q5-4 10 0" fill="none" stroke="'+P.white+'" stroke-width="2.4"/>');},
    furniture:function(c1,c2){return S(c1,c2).replace('%BODY%','<path d="M10 34q0-9 8-9h28q8 0 8 9v14H10z"/><path d="M13 48v8M51 48v8" fill="none" stroke="'+P.ink+'"/>')
      .replace('%ACC%','<rect x="15" y="25" width="34" height="12" rx="4"/>');},
    sea:function(c1,c2){return S(c1,c2).replace('%BODY%','<path d="M12 32q12-19 34 0-22 19-34 0z"/><path d="M46 32l12-10v20z"/>')
      .replace('%ACC%','<circle cx="24" cy="29" r="3.4" fill="'+P.ink+'"/><path d="M18 38q9 5 18 0" fill="none" stroke="'+P.white+'" stroke-width="2.4"/>');},
    fish1:function(c1,c2){return S(c1,c2).replace('%BODY%','<ellipse cx="29" cy="35" rx="19" ry="14"/><path d="M45 35l13-9v18z"/><path d="M24 21q9-7 17-2z"/>')
      .replace('%ACC%','<circle cx="21" cy="31" r="3.2" fill="'+P.ink+'" stroke="none"/><path d="M15 41q7 5 14 1" fill="none" stroke="'+P.ink+'" stroke-width="2.6"/><path d="M33 23v24M41 25v20" fill="none" stroke="'+P.ink+'" stroke-width="2.6" opacity=".5"/>');},
    fish2:function(c1,c2){return S(c1,c2).replace('%BODY%','<path d="M12 36q3-16 21-16 17 0 18 14 1 13-15 15-21 3-24-13z"/><path d="M49 29q10-4 8 7-2 8-10 5z"/>')
      .replace('%ACC%','<circle cx="23" cy="31" r="3" fill="'+P.ink+'" stroke="none"/><circle cx="34" cy="26" r="2.4" fill="'+P.ink+'" stroke="none" opacity=".45"/><circle cx="39" cy="39" r="2.6" fill="'+P.ink+'" stroke="none" opacity=".45"/><circle cx="28" cy="42" r="2.2" fill="'+P.ink+'" stroke="none" opacity=".45"/><path d="M17 41q6 4 12 1" fill="none" stroke="'+P.ink+'" stroke-width="2.4"/>');},
    fish3:function(c1,c2){return S(c1,c2).replace('%BODY%','<path d="M8 34q10-10 26-10 16 0 24 9-8 10-24 10-16 0-26-9z"/><path d="M55 29l5-8 2 10 2-2v8l-4-2z"/><path d="M30 24l4-9 6 8z"/>')
      .replace('%ACC%','<circle cx="18" cy="31" r="3" fill="'+P.ink+'" stroke="none"/><path d="M12 38q8 5 17 2" fill="none" stroke="'+P.ink+'" stroke-width="2.6"/><path d="M36 27v14M44 26v13" fill="none" stroke="'+P.ink+'" stroke-width="2.4" opacity=".5"/>');},
    bubble:function(c1,c2){return S(c1,c2).replace('%BODY%','<circle cx="32" cy="33" r="21"/>')
      .replace('%ACC%','<path d="M18 26q5-9 14-9" fill="none" stroke="'+P.white+'" stroke-width="4"/><circle cx="43" cy="43" r="4" fill="'+P.white+'" stroke="none"/>');},
    note:function(c1,c2){return S(c1,c2).replace('%BODY%','<path d="M26 10l24-5v34q-7 10-17 8-8-2-7-10 1-8 10-8 5 0 8 2V16l-18 4z"/>')
      .replace('%ACC%','<circle cx="25" cy="45" r="8"/><circle cx="47" cy="40" r="7"/>');},
    door:function(c1,c2){return S(c1,c2).replace('%BODY%','<path d="M14 56V19q18-12 36 0v37z"/>')
      .replace('%ACC%','<circle cx="42" cy="36" r="3.6" fill="'+P.gold+'"/><path d="M14 56h36" fill="none" stroke="'+P.ink+'"/>');},
    light:function(c1,c2){return S(c1,c2).replace('%BODY%','<path d="M32 6q16 0 16 17 0 10-8 14v7H24v-7q-8-4-8-14Q16 6 32 6z"/>')
      .replace('%ACC%','<rect x="24" y="45" width="16" height="6" rx="2"/><path d="M27 55h10" fill="none" stroke="'+P.ink+'"/>');},
    screen:function(c1,c2){return S(c1,c2).replace('%BODY%','<rect x="7" y="10" width="50" height="36" rx="4"/>')
      .replace('%ACC%','<path d="M25 52h14l3 6H22z"/><path d="M14 20h30M14 28h22" fill="none" stroke="'+P.teal+'" stroke-width="3"/>');},
    book:function(c1,c2){return S(c1,c2).replace('%BODY%','<path d="M10 12q12-5 22 3 10-8 22-3v40q-12-5-22 3-10-8-22-3z"/>')
      .replace('%ACC%','<path d="M32 15v40" fill="none" stroke="'+P.ink+'"/>');},
    clock:function(c1,c2){return S(c1,c2).replace('%BODY%','<circle cx="32" cy="33" r="22"/><path d="M25 5h14l-3 6H28z"/>')
      .replace('%ACC%','<path d="M32 20v14l9 6" fill="none" stroke="'+P.ink+'" stroke-width="3.4"/>');},
    flag:function(c1,c2){return S(c1,c2).replace('%BODY%','<path d="M18 6v52" fill="none" stroke="'+P.brown+'" stroke-width="5"/>')
      .replace('%ACC%','<path d="M21 9q15-8 30 2-15 12-30 8z"/><circle cx="18" cy="6" r="3.4" fill="'+P.gold+'"/>');},
    food:function(c1,c2){return S(c1,c2).replace('%BODY%','<path d="M9 30q0-13 23-13t23 13q0 6-23 6T9 30z"/><path d="M10 37h44v6H10z"/>')
      .replace('%ACC%','<path d="M11 46q21 10 42 0v6q-21 8-42 0z"/><circle cx="25" cy="25" r="2.6" fill="'+P.white+'" stroke="none"/>');},
    cup:function(c1,c2){return S(c1,c2).replace('%BODY%','<path d="M15 18h32l-4 38H19z"/><path d="M47 24q10 2 8 12-2 8-9 7" fill="none" stroke="'+P.ink+'"/>')
      .replace('%ACC%','<rect x="12" y="12" width="38" height="8" rx="3"/><path d="M28 5v8" fill="none" stroke="'+P.coral+'" stroke-width="4"/>');},
    plant:function(c1,c2){return S(c1,c2).replace('%BODY%','<path d="M32 57V24q-16-3-17-18 16 1 17 18z"/><path d="M32 38q16-3 18-19-17 2-18 19z"/>')
      .replace('%ACC%','<path d="M20 57h24" fill="none" stroke="'+P.brown+'" stroke-width="4"/>');},
    helmet:function(c1,c2){return S(c1,c2).replace('%BODY%','<circle cx="32" cy="30" r="22"/>')
      .replace('%ACC%','<path d="M14 34q18 14 36 0v8q-18 12-36 0z"/><path d="M20 20q8-7 16-3" fill="none" stroke="'+P.white+'" stroke-width="3"/>');},
    net:function(c1,c2){return S(c1,c2).replace('%BODY%','<path d="M12 12q20-6 40 0v40q-20 6-40 0z"/>')
      .replace('%ACC%','<path d="M12 25h40M12 38h40M25 12v40M38 12v40" fill="none" stroke="'+P.ink+'" stroke-width="2.4"/>');},
    sign:function(c1,c2){return S(c1,c2).replace('%BODY%','<path d="M32 8v48" fill="none" stroke="'+P.brown+'" stroke-width="5"/><path d="M10 14h44v26H10z"/>')
      .replace('%ACC%','<path d="M17 23h30M17 31h20" fill="none" stroke="'+P.cream+'" stroke-width="3"/>');},
    window:function(c1,c2){return S(c1,c2).replace('%BODY%','<rect x="10" y="9" width="44" height="46" rx="20"/>')
      .replace('%ACC%','<path d="M32 9v46M10 32h44" fill="none" stroke="'+P.ink+'" stroke-width="3"/>');},
    ladder:function(c1,c2){return S(c1,c2).replace('%BODY%','<path d="M17 6v52M47 6v52" fill="none" stroke="'+P.brown+'" stroke-width="5"/>')
      .replace('%ACC%','<path d="M17 18h30M17 30h30M17 42h30" fill="none" stroke="'+P.ink+'" stroke-width="4"/>');},
    misc:function(c1,c2){return S(c1,c2).replace('%BODY%','<rect x="10" y="10" width="44" height="44" rx="9"/>')
      .replace('%ACC%','<circle cx="32" cy="32" r="11"/><path d="M26 32q6-7 12 0" fill="none" stroke="'+P.white+'" stroke-width="2.6"/>');}
  };
  var C={gold:P.gold,coral:P.coral,teal:P.teal,blue:P.blue,green:P.green,brown:P.brown,
    pink:P.pink,purple:P.purple,gray:P.gray,sand:P.sand,cream:P.cream,red:P.red,deep:P.deep,white:P.white};
  var MAP={
    '🪑':'furniture:brown','🚪':'door:brown','🎵':'note:purple','🪨':'rock:gray','🖼️':'frame:teal','🖼':'frame:teal',
    '💡':'light:gold','🪜':'ladder:brown','🧾':'paper:cream','🔎':'tool:teal','🔍':'tool:teal','🪙':'coin:gold',
    '📄':'paper:cream','🧊':'bubble:teal','🥄':'tool:gray','🪟':'window:teal','📺':'screen:gray',
    '🛏':'furniture:pink','🛋':'furniture:purple','🛋️':'furniture:purple','⭐':'star:gold','🐠':'sea:coral',
    '🐟':'sea:teal','🥚':'bubble:cream','🎷':'note:teal','🍍':'food:gold','🍬':'jar:pink','🚩':'flag:red',
    '🍪':'food:brown','💵':'paper:green','🥤':'cup:coral','🔔':'light:gold','✨':'star:gold','🪸':'plant:coral',
    '📦':'box:brown','🐙':'sea:purple','🔄':'gear:gray','📋':'paper:cream','💿':'coin:gray','🐌':'sea:green',
    '🔬':'jar:teal','💻':'screen:deep','🖥️':'screen:deep','🖥':'screen:deep','🗺️':'paper:sand','🗺':'paper:sand',
    '🫙':'jar:teal','🪖':'helmet:gray','🌰':'rock:brown','🧪':'jar:green','🎫':'paper:pink','🧂':'jar:cream',
    '🍳':'tool:gray','💰':'coin:gold','🎨':'jar:coral','📝':'paper:cream','🥣':'cup:sand','🌿':'plant:green',
    '🐚':'shell:pink','🫧':'bubble:teal','🍔':'food:gold','📜':'paper:sand','✉️':'paper:cream','🌈':'star:pink',
    '🍽':'food:cream','🍽️':'food:cream','🔥':'light:coral','🗄':'box:gray','🗄️':'box:gray','📒':'book:brown',
    '☕':'cup:brown','🖌️':'tool:purple','📐':'tool:blue','🌡️':'tool:red','🦾':'gear:gray','🪵':'rock:brown',
    '🧽':'sea:gold','🦀':'sea:red','🐿️':'sea:brown','🦠':'sea:green','💫':'star:purple','🌟':'star:gold',
    '🎐':'note:teal','📸':'frame:blue','😋':'food:pink','🌙':'star:deep','♪':'note:teal','🍟':'food:gold',
    '🥩':'food:red','🥬':'plant:green','🧑':'helmet:sand','🗑️':'jar:gray','🈳':'misc:gray','📈':'paper:green',
    '⚓':'tool:deep','🎟️':'paper:pink','📅':'clock:blue','👓':'window:gray','🛢️':'jar:gray','🗿':'rock:gray',
    '📖':'book:brown','🥅':'net:teal','🧢':'helmet:blue','🪥':'tool:blue','🏖':'shell:sand','🏖️':'shell:sand',
    '🦷':'bubble:white','📞':'sign:red','🏰':'box:sand','📰':'paper:gray','🏋':'gear:gray','🏋️':'gear:gray',
    '📊':'paper:blue','🌼':'star:cream','🕸️':'net:gray','🪣':'jar:blue','🧹':'tool:brown','💛':'star:gold',
    '🎊':'star:coral','🐡':'sea:gold','🦔':'rock:brown','💨':'bubble:gray','🤫':'misc:purple','📱':'screen:blue'
  };
  var KEYS=Object.keys(shapes), COLS=Object.keys(C);
  function hash(s){var h=0;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h;}
  /* --- v10：界面图标改用生图手绘位图（assets/ui，G-15 系列） ---
     这些槽位渲染尺寸都在 20px 以上，位图比 SVG 更贴手绘风；未列出的占位
     仍走上面的 SVG 库兜底（小号内联字形用位图会糊）。 */
  var PNG_DIR='../assets/ui/';
  var PNG_MAP={
    '⏩':'G-15-icon_ff','⏭':'G-15-icon_ff',
    '🗺':'G-15-icon_map','🗺️':'G-15-icon_map','🌈':'G-15-icon_map',
    '🧾':'G-15-icon_receipt','📋':'G-15-icon_receipt','📄':'G-15-icon_receipt',
    '📜':'G-15-icon_receipt','📝':'G-15-icon_receipt','🎫':'G-15-icon_receipt',
    '🎟️':'G-15-icon_receipt','🎟':'G-15-icon_receipt','📰':'G-15-icon_receipt',
    '🗑':'G-15-icon_trash','🗑️':'G-15-icon_trash',
    '📦':'G-15-icon_crate','🗄':'G-15-icon_crate','🗄️':'G-15-icon_crate',
    '🗃':'G-15-icon_crate','🛢️':'G-15-icon_crate',
    '🔎':'G-15-icon_lens','🔍':'G-15-icon_lens',
    '🍔':'G-15-icon_bite','😋':'G-15-icon_bite','🍽':'G-15-icon_bite','🍽️':'G-15-icon_bite',
    '🔄':'G-15-icon_flip','↻':'G-15-icon_flip','↺':'G-15-icon_flip',
    '📸':'G-15-icon_camera',
    '🥚':'G-15-icon_egg','🧊':'G-15-icon_egg',
    '⏰':'G-15-icon_clock','🕐':'G-15-icon_clock','📅':'G-15-icon_clock',
    '🎯':'G-15-icon_target','💿':'G-15-icon_target',
    '🎵':'G-15-icon_note','🎷':'G-15-icon_note','♪':'G-15-icon_note','🎐':'G-15-icon_note',
    '✕':'G-15-icon_close','✖':'G-15-icon_close','✗':'G-15-icon_close',
    '🪑':'G-15-icon_stool','🛋':'G-15-icon_stool','🛋️':'G-15-icon_stool','🛏':'G-15-icon_stool',
    '🚪':'G-15-icon_door','🪜':'G-15-icon_door','🏰':'G-15-icon_door'
  };
  window.BB_ICON_PNG=PNG_DIR;
  window.BB_ICON=function(key,size){
    key=String(key||'').replace(/\uFE0F/g,'');
    if(!key)return '';
    var n=size||24;
    var png=PNG_MAP[key]||PNG_MAP[key+'\uFE0F'];
    if(png)return '<img class="bbIcoImg" alt="" draggable="false" src="'+PNG_DIR+png+'.png"'+
      ' width="'+n+'" height="'+n+'" style="width:'+n+'px;height:'+n+'px">';
    var spec=MAP[key];
    if(!spec){var h=hash(key);spec=KEYS[h%KEYS.length]+':'+COLS[(h>>4)%COLS.length];}
    var p=spec.split(':'),fn=shapes[p[0]]||shapes.misc,c1=C[p[1]]||C.sand;
    return '<svg class="bbSvg" viewBox="0 0 64 64" width="'+n+'" height="'+n+'" aria-hidden="true">'+
      fn(c1,P.cream)+'</svg>';
  };
  /* 世界/室内角色：六位主要居民用生成立绘；其余海洋邻居用大号手绘 SVG */
  var CH={
    '🧽':'D-02-sponge-portrait.png','⭐':'D-04-star-portrait.png','🐙':'D-03-squid-portrait.png',
    '🦀':'D-05-krabs-portrait.png','🐿️':'D-06-sandy-portrait.png','🦠':'D-07-plankton-portrait.png'
  };
  window.BB_CHAR=function(key){return CH[String(key||'').replace(/\uFE0F/g,'')]||null;};
  window.BB_CHAR_SVG=function(key,size){
    var k=String(key||'').replace(/\uFE0F/g,''),n=size||54;
    var map={'🐟':['fish1','teal'],'🐠':['fish1','coral'],'🐡':['fish2','gold'],'🐌':['shell','green'],
      '🐳':['fish3','blue'],'🦑':['fish2','purple'],'🪼':['bubble','pink'],'🧽':['sea','gold']};
    var pool=[['fish1','teal'],['fish1','coral'],['fish1','gold'],['fish2','purple'],['fish2','gold'],
      ['fish2','pink'],['fish3','blue'],['fish3','green'],['fish3','deep'],['sea','pink']];
    var p=map[k]||pool[hash(k)%pool.length];
    return '<svg class="bbCharSvg" viewBox="0 0 64 64" width="'+n+'" height="'+n+'">'+
      shapes[p[0]](C[p[1]],P.cream)+'</svg>';
  };
})();
