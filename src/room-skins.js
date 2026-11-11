/* room-skins.js —— 六个主题房间的手绘家具 / 装饰叠加层
 * 仅暴露 window.BB_ROOM_SKIN，值为 6 段完整内联 SVG 字符串。
 * 视觉规范见「比奇堡-IP视觉调研.md」§5 / §7.1 / §7.2：
 *   粗深蓝黑墨线 #162C36、宽约 8px、linejoin/linecap round；
 *   硬边平涂 + 块状暗面，摇摆不对称形状，无渐变 / 无高光 / 无文字。
 *   中间交互区 x∈[300,900] 且 y∈[260,560] 保持透明留空。
 * 元素上的 class 供主代理统一挂动画，本文件不写 <style>。
 */
(function () {
  'use strict';

  var C = {
    ink: '#162C36', inkSoft: '#2C4A55',
    wood: '#B87A3E', woodDark: '#8A5729',
    sandL: '#F6DEA8', sand: '#EAC684', sandSh: '#CFA059',
    banana: '#FBE34B', bananaD: '#E7C332',
    pineapple: '#EDA63C', pineappleSh: '#C9842C',
    leaf: '#4E9A40', lime: '#9AD35C',
    moai: '#82A7B4', moaiSh: '#648996',
    rock: '#AC7C52',
    glass: '#C6ECF5', frame: '#8FB6C4',
    metal: '#6E7C86', metalD: '#49565F', glove: '#8E7BC4',
    pink: '#F49CC0', lilac: '#B49ADB', blue: '#7FA8D6',
    warm: '#D2662E', cream: '#FFF2CE'
  };

  function beads(pairs, r, fill, extra) {
    var out = '';
    for (var i = 0; i < pairs.length; i++) {
      out += '<circle cx="' + pairs[i][0] + '" cy="' + pairs[i][1] + '" r="' + r +
        '" fill="' + fill + '" stroke="none"' + (extra || '') + '/>';
    }
    return out;
  }

  function gear(cx, cy, r, cls) {
    return '<g class="' + cls + '">' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r + 5) + '" fill="none" stroke="' + C.metal + '" stroke-width="15" stroke-dasharray="15 13"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + C.metal + '"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + Math.round(r * 0.36) + '" fill="' + C.metalD + '" stroke-width="4"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke-width="6"/>' +
      '</g>';
  }

  function frame(body) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 760" preserveAspectRatio="none" ' +
      'style="position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none">' +
      '<g stroke="' + C.ink + '" stroke-width="8" stroke-linejoin="round" stroke-linecap="round" fill="none">' +
      body + '</g></svg>';
  }

  window.BB_ROOM_SKIN = {

    /* 1. 暖木餐厅：顶部木梁 + 渔网 / 信号旗 / 救生圈，左下舟形点餐台 + 收银机，右下船舵桌 + 木桶椅 */
    krusty: frame(`
<path d="M-20 30 Q300 20 610 34 Q900 44 1220 28 L1220 92 Q900 102 600 88 Q300 76 -20 96 Z" fill="${C.wood}"/>
<path d="M-20 92 Q300 80 600 90 Q900 100 1220 90 L1220 104 Q900 114 600 102 Q300 92 -20 106 Z" fill="${C.woodDark}" stroke="none"/>
<path d="M42 92 Q34 400 46 760 L104 760 Q114 400 104 92 Z" fill="${C.wood}"/>
<path d="M104 92 Q114 400 104 760 L120 760 Q128 400 118 92 Z" fill="${C.woodDark}" stroke="none"/>
<path d="M50 330 Q80 322 108 330 M50 520 Q80 512 108 520" fill="none" stroke-width="5"/>
<g class="skinSway">
  <path d="M40 100 Q150 245 262 100" fill="none" stroke="${C.sandL}" stroke-width="6"/>
  <path d="M40 100 Q58 205 150 232 Q242 205 262 100" fill="${C.sandL}" opacity="0.35"/>
  <path d="M55 120 L120 212 M92 108 L150 228 M150 100 L185 220 M205 105 L185 220 M245 120 L180 214" fill="none" stroke-width="3.5" opacity="0.7"/>
  <g stroke-width="4"><circle cx="40" cy="100" r="8" fill="${C.banana}"/><circle cx="262" cy="100" r="8" fill="${C.banana}"/><circle cx="150" cy="232" r="7" fill="${C.pink}"/></g>
</g>
<path d="M300 108 Q600 132 900 106" fill="none" stroke-width="5"/>
<path d="M340 112 L372 112 L356 150 Z" fill="${C.banana}"/>
<path d="M430 118 L462 118 L446 158 Z" fill="${C.warm}"/>
<path d="M520 122 L552 122 L536 160 Z" fill="${C.leaf}"/>
<path d="M610 122 L642 122 L626 158 Z" fill="${C.blue}"/>
<path d="M700 118 L732 118 L716 154 Z" fill="${C.pink}"/>
<path d="M790 112 L822 112 L806 148 Z" fill="${C.banana}"/>
<g class="skinSway">
  <circle cx="1100" cy="168" r="58" fill="${C.cream}"/>
  <circle cx="1100" cy="168" r="30" fill="${C.woodDark}"/>
  <circle cx="1100" cy="168" r="44" fill="none" stroke="${C.warm}" stroke-width="14" stroke-dasharray="26 26"/>
  <circle cx="1100" cy="168" r="58" fill="none" stroke-width="8"/>
</g>
<path d="M30 658 Q160 700 288 652 Q278 716 160 730 Q58 722 30 658 Z" fill="${C.cream}"/>
<path d="M30 658 Q160 700 288 652" fill="none" stroke-width="6"/>
<path d="M288 652 Q302 620 294 598" fill="none" stroke-width="7"/>
<path d="M118 606 L202 604 L212 654 L110 656 Z" fill="${C.sandL}"/>
<path d="M132 584 L194 582 L200 604 L128 606 Z" fill="${C.metalD}"/>
<path d="M138 592 L188 591" fill="none" stroke="${C.lime}" stroke-width="5"/>
<g stroke-width="3"><circle cx="135" cy="632" r="6" fill="${C.warm}"/><circle cx="160" cy="630" r="6" fill="${C.banana}"/><circle cx="185" cy="630" r="6" fill="${C.lime}"/></g>
<g class="skinSpin">
  <circle cx="1060" cy="660" r="78" fill="none" stroke="${C.wood}" stroke-width="16"/>
  <circle cx="1060" cy="660" r="78" fill="none" stroke-width="8"/>
  <path d="M1060 660 L1060 574 M1060 660 L1121 599 M1060 660 L1138 660 M1060 660 L1121 721 M1060 660 L1060 746 M1060 660 L999 721 M1060 660 L982 660 M1060 660 L999 599" fill="none" stroke-width="7"/>
  <g stroke-width="4">
    <circle cx="1060" cy="574" r="9" fill="${C.wood}"/><circle cx="1121" cy="599" r="9" fill="${C.wood}"/>
    <circle cx="1138" cy="660" r="9" fill="${C.wood}"/><circle cx="1121" cy="721" r="9" fill="${C.wood}"/>
    <circle cx="1060" cy="746" r="9" fill="${C.wood}"/><circle cx="999" cy="721" r="9" fill="${C.wood}"/>
    <circle cx="982" cy="660" r="9" fill="${C.wood}"/><circle cx="999" cy="599" r="9" fill="${C.wood}"/>
  </g>
  <circle cx="1060" cy="660" r="20" fill="${C.banana}"/>
  <circle cx="1060" cy="660" r="8" fill="${C.inkSoft}" stroke-width="4"/>
</g>
<path d="M902 654 Q894 706 908 752 L978 752 Q992 706 984 654 Z" fill="${C.wood}"/>
<path d="M902 654 Q943 644 984 654" fill="none" stroke-width="6"/>
<path d="M899 686 Q943 696 987 686 M904 718 Q943 728 982 718" fill="none" stroke-width="5"/>
<ellipse cx="943" cy="654" rx="41" ry="12" fill="${C.woodDark}"/>
<path d="M0 706 Q600 698 1200 708 M0 728 Q600 720 1200 730 M0 750 Q600 742 1200 752" fill="none" stroke="${C.leaf}" stroke-width="6" opacity="0.22"/>
`),

    /* 2. 黄绿有机果屋：渔网顶棚 + 双圆舷窗 / 锚 / 雾角闹钟 / 冰箱，左下菠萝纹床，右下贝壳桌与贝壳电话 */
    pineapple: frame(`
<g class="skinSway">
  <path d="M-20 55 Q300 118 600 52 Q900 -8 1220 62" fill="none" stroke-width="5" opacity="0.55"/>
  <path d="M-20 108 Q300 168 600 104 Q900 44 1220 112" fill="none" stroke-width="5" opacity="0.55"/>
  <path d="M120 0 L260 160 M360 -10 L420 150 M620 -10 L660 130 M860 0 L820 150 M1080 0 L980 160" fill="none" stroke-width="4" opacity="0.45"/>
  <g stroke-width="4"><circle cx="230" cy="120" r="9" fill="${C.banana}"/><circle cx="640" cy="90" r="8" fill="${C.lime}"/><circle cx="900" cy="100" r="9" fill="${C.pink}"/></g>
</g>
<circle cx="140" cy="132" r="70" fill="${C.frame}"/>
<circle cx="140" cy="132" r="52" fill="${C.glass}"/>
<circle cx="140" cy="132" r="52" fill="none" stroke-width="6"/>
<path d="M140 80 L140 184 M88 132 L192 132" fill="none" stroke="${C.frame}" stroke-width="6"/>
${beads([[140, 71], [183, 89], [201, 132], [183, 175], [140, 193], [97, 175], [79, 132], [97, 89]], 5, C.inkSoft)}
<circle cx="1062" cy="120" r="56" fill="${C.frame}"/>
<circle cx="1062" cy="120" r="41" fill="${C.glass}"/>
<circle cx="1062" cy="120" r="41" fill="none" stroke-width="6"/>
<path d="M1062 79 L1062 161 M1021 120 L1103 120" fill="none" stroke="${C.frame}" stroke-width="5"/>
${beads([[1062, 71], [1097, 85], [1111, 120], [1097, 155], [1062, 169], [1027, 155], [1013, 120], [1027, 85]], 4, C.inkSoft)}
<path d="M1120 186 L1120 244" fill="none" stroke-width="9"/>
<circle cx="1120" cy="182" r="9" fill="none" stroke-width="6"/>
<path d="M1094 202 Q1120 216 1146 202" fill="none" stroke-width="7"/>
<path d="M1088 224 L1088 236 Q1120 256 1152 236 L1152 224" fill="none" stroke-width="8"/>
<path d="M1088 224 L1074 228 M1152 224 L1166 228" fill="none" stroke-width="7"/>
<path d="M878 196 L922 188 L926 226 L880 232 Z" fill="${C.banana}"/>
<circle cx="900" cy="210" r="12" fill="${C.cream}"/>
<path d="M888 190 L880 176 M914 188 L922 174" fill="none" stroke-width="6"/>
<g stroke-width="4"><circle cx="879" cy="174" r="7" fill="${C.warm}"/><circle cx="923" cy="172" r="7" fill="${C.warm}"/></g>
<path d="M926 200 L950 188 L950 224 L926 214 Z" fill="${C.pineappleSh}"/>
<path d="M1004 300 Q998 435 1006 568 L1172 562 Q1164 430 1172 298 Z" fill="${C.cream}"/>
<path d="M1005 432 L1171 428" fill="none" stroke-width="6"/>
<path d="M1140 340 L1140 398 M1140 458 L1140 520" fill="none" stroke-width="8"/>
<path d="M1030 300 Q1060 288 1090 298" fill="none" stroke="${C.leaf}" stroke-width="6"/>
<path d="M34 658 Q160 636 286 660 L284 732 L36 732 Z" fill="${C.wood}"/>
<path d="M46 652 Q160 632 274 654 Q268 700 160 706 Q56 700 46 652 Z" fill="${C.pineapple}"/>
<path d="M70 656 L108 700 M118 650 L158 704 M168 650 L208 703 M218 654 L254 697 M108 648 L70 692 M158 644 L118 698 M208 644 L168 700 M254 652 L218 696" fill="none" stroke="${C.pineappleSh}" stroke-width="4.5" opacity="0.85"/>
<path d="M30 626 Q28 592 60 594 L62 664" fill="none" stroke-width="10"/>
<path d="M56 646 Q92 632 124 648 Q92 664 56 646 Z" fill="${C.cream}"/>
<path d="M950 700 Q1060 680 1170 700 L1160 740 L960 740 Z" fill="${C.sandL}"/>
<path d="M1000 700 L1010 748 M1140 700 L1130 748" fill="none" stroke-width="8"/>
<path d="M1000 616 Q1060 574 1120 616 Q1060 648 1000 616 Z" fill="${C.pink}"/>
<path d="M1060 588 L1060 624 M1032 594 L1054 624 M1088 594 L1066 624" fill="none" stroke-width="4.5"/>
<path d="M1026 620 Q1060 636 1094 620 L1098 640 L1022 640 Z" fill="${C.banana}"/>
<path d="M40 760 L140 680 M180 760 L280 680 M320 760 L420 680 M460 760 L560 680 M600 760 L700 680 M740 760 L840 680 M880 760 L980 680 M1020 760 L1120 680 M140 760 L40 680 M280 760 L180 680 M420 760 L320 680 M560 760 L460 680 M700 760 L600 680 M840 760 L740 680 M980 760 L880 680 M1120 760 L1020 680" fill="none" stroke="${C.lime}" stroke-width="5" opacity="0.16"/>
`),

    /* 3. 冷灰石像屋：石墙板 + 画廊画框 / 蛤壳吊灯 / 竖笛 / 雕像鼻轮廓，右侧电梯门，底部粉瓷砖 */
    moai: frame(`
<path d="M-20 0 L1220 0 L1220 118 Q900 128 600 116 Q300 106 -20 126 Z" fill="${C.moai}" opacity="0.5" stroke="none"/>
<path d="M-20 122 Q300 102 600 114 Q900 126 1220 116" fill="none" stroke-width="6" opacity="0.7"/>
<path d="M180 0 L186 118 M430 0 L424 112 M700 0 L706 116 M960 0 L954 120" fill="none" stroke-width="5" opacity="0.55"/>
<path d="M108 66 L236 62 L240 188 L106 192 Z" fill="${C.woodDark}"/>
<path d="M122 80 L222 77 L225 174 L120 177 Z" fill="${C.cream}"/>
<circle cx="172" cy="118" r="24" fill="${C.moai}"/>
<path d="M138 168 L172 132 L208 168 Z" fill="${C.lilac}"/>
<path d="M468 58 L598 62 L596 186 L470 182 Z" fill="${C.woodDark}"/>
<path d="M482 72 L584 75 L582 172 L480 169 Z" fill="${C.cream}"/>
<path d="M498 160 L520 108 L542 140 L562 96 L572 160 Z" fill="${C.blue}"/>
<circle cx="556" cy="92" r="12" fill="${C.banana}" stroke-width="4"/>
<path d="M840 64 L968 60 L972 186 L838 190 Z" fill="${C.woodDark}"/>
<path d="M854 78 L954 75 L957 172 L852 175 Z" fill="${C.cream}"/>
<ellipse cx="905" cy="128" rx="30" ry="38" fill="${C.pink}"/>
<path d="M884 112 Q905 100 926 112" fill="none" stroke-width="5"/>
<path d="M600 0 L600 48" fill="none" stroke-width="5"/>
<path d="M540 92 Q600 42 660 92 Q600 116 540 92 Z" fill="${C.pink}"/>
<path d="M600 52 L600 104 M570 60 L592 106 M630 60 L608 106" fill="none" stroke-width="4.5"/>
<circle cx="600" cy="116" r="7" fill="${C.banana}" stroke-width="4"/>
<path d="M964 250 L1186 248 L1188 706 L962 708 Z" fill="${C.moaiSh}"/>
<path d="M978 264 L1070 262 L1072 694 L976 696 Z" fill="${C.metal}"/>
<path d="M1078 262 L1172 264 L1170 694 L1076 696 Z" fill="${C.metal}"/>
<path d="M1074 262 L1074 694" fill="none" stroke-width="4"/>
<path d="M996 316 L1018 316 L1018 432 L996 432 Z" fill="${C.glass}"/>
<path d="M1130 316 L1152 316 L1152 432 L1130 432 Z" fill="${C.glass}"/>
<path d="M1042 214 L1074 234 L1106 214" fill="none" stroke="${C.banana}" stroke-width="7"/>
${beads([[972, 280], [1180, 280], [972, 380], [1180, 380], [972, 480], [1180, 480], [972, 580], [1180, 580], [972, 680], [1180, 680]], 5, C.inkSoft)}
<path d="M84 288 Q74 410 88 532 L112 532 Q98 410 108 288 Z" fill="${C.cream}"/>
<path d="M86 284 Q98 272 110 288" fill="none" stroke-width="6"/>
${beads([[96, 340], [94, 382], [95, 424], [98, 466], [101, 508]], 4, C.ink)}
<path d="M18 150 Q120 146 132 246 L132 342 Q66 342 58 298" fill="none" stroke="${C.moaiSh}" stroke-width="12" opacity="0.2"/>
<path d="M10 128 Q90 112 150 140" fill="none" stroke="${C.moaiSh}" stroke-width="14" opacity="0.16"/>
<path d="M0 690 Q600 682 1200 692 M0 726 Q600 718 1200 728 M200 660 L206 760 M460 658 L464 760 M720 658 L726 760 M980 660 L984 760" fill="none" stroke="${C.pink}" stroke-width="5" opacity="0.2"/>
`),

    /* 4. 棕沙石屋：顶部可掀开的半球岩石 + 天线风向标，左下沙制家具，右下 CRT 电视，沙地颗粒 */
    rock: frame(`
<path d="M-20 205 Q300 5 600 26 Q900 44 1220 196 L1220 0 L-20 0 Z" fill="${C.rock}" opacity="0.5" stroke="none"/>
<path d="M-20 205 Q300 5 600 26 Q900 44 1220 196" fill="none" stroke-width="10"/>
<path d="M810 0 Q1010 56 1220 196 L1220 0 Z" fill="${C.woodDark}" opacity="0.28" stroke="none"/>
<path d="M-20 230 Q300 30 600 50 Q900 68 1220 220" fill="none" stroke-width="6" opacity="0.4"/>
<circle cx="42" cy="208" r="15" fill="${C.metal}"/>
<circle cx="42" cy="208" r="5" fill="${C.inkSoft}" stroke="none"/>
<circle cx="1158" cy="200" r="15" fill="${C.metal}"/>
<circle cx="1158" cy="200" r="5" fill="${C.inkSoft}" stroke="none"/>
<path d="M300 86 L310 128 M600 44 L594 86 M900 108 L890 150 M180 140 L192 172 M1040 150 L1030 184" fill="none" stroke-width="5" opacity="0.5"/>
<path d="M1086 168 L1086 46" fill="none" stroke-width="9"/>
<path d="M1042 62 L1108 62" fill="none" stroke-width="7"/>
<path d="M1108 62 L1090 46 M1108 62 L1090 78" fill="none" stroke-width="7"/>
<path d="M1056 100 L1116 100" fill="none" stroke-width="6"/>
<circle cx="1086" cy="42" r="10" fill="${C.banana}"/>
<path d="M956 600 Q950 588 972 590 L1150 586 Q1172 588 1168 604 L1172 720 Q1170 738 1150 734 L968 738 Q950 736 954 720 Z" fill="${C.sandL}"/>
<path d="M974 612 L1120 610 L1122 696 L972 698 Z" fill="${C.metalD}"/>
<path d="M984 628 Q1046 622 1110 628 M984 652 Q1046 646 1110 652 M984 676 Q1046 670 1110 676" fill="none" stroke="${C.glass}" stroke-width="4" opacity="0.55"/>
<circle cx="1146" cy="636" r="10" fill="${C.banana}"/>
<circle cx="1146" cy="670" r="10" fill="${C.banana}"/>
<path d="M1018 590 L988 544 M1100 588 L1134 544" fill="none" stroke-width="7"/>
<g stroke-width="4"><circle cx="988" cy="542" r="7" fill="${C.warm}"/><circle cx="1134" cy="542" r="7" fill="${C.warm}"/></g>
<path d="M980 738 L974 756 M1142 734 L1148 754" fill="none" stroke-width="9"/>
<path d="M30 706 Q38 646 92 642 L198 644 Q250 648 252 706 L252 732 L30 732 Z" fill="${C.sand}"/>
<path d="M30 706 Q140 692 252 706 L252 732 L30 732 Z" fill="${C.sandSh}" opacity="0.7" stroke="none"/>
<path d="M60 660 Q140 650 220 662" fill="none" stroke-width="5" opacity="0.7"/>
<path d="M206 682 Q240 674 276 684 L272 730 L210 730 Z" fill="${C.sandL}"/>
<path d="M212 700 Q242 694 270 702" fill="none" stroke-width="4" opacity="0.7"/>
<path d="M20 300 Q40 380 28 470 M60 520 Q80 580 66 640" fill="none" stroke="${C.woodDark}" stroke-width="6" opacity="0.25"/>
${beads([[60, 716], [150, 742], [260, 730], [380, 752], [500, 720], [640, 744], [760, 726], [880, 750], [1010, 714], [1140, 738]], 4, C.sandSh, ' opacity="0.7"')}
`),

    /* 5. 玻璃青树屋：左侧双金属气闸门 + 顶部玻璃穹顶肋，右侧橡树剪影 / 注水头盔，底部中间格纹野餐桌 + 橡果电视 */
    treedome: frame(`
<path d="M-20 172 Q600 -38 1220 172 L1220 0 L-20 0 Z" fill="${C.glass}" opacity="0.26" stroke="none"/>
<path d="M-20 172 Q600 -38 1220 172" fill="none" stroke="${C.frame}" stroke-width="10" opacity="0.85"/>
<path d="M180 44 Q190 96 196 148 M420 8 Q424 56 426 92 M780 8 Q776 56 774 92 M1020 44 Q1010 96 1004 148" fill="none" stroke="${C.frame}" stroke-width="6" opacity="0.6"/>
${beads([[120, 158], [300, 96], [600, 4], [900, 96], [1080, 158]], 5, C.inkSoft, ' opacity="0.6"')}
<path d="M18 190 Q12 460 20 742 L250 742 Q258 460 250 190 Z" fill="${C.frame}"/>
<path d="M36 206 Q30 464 38 726 L232 726 Q240 464 232 206 Z" fill="${C.metal}"/>
<path d="M135 206 L135 726" fill="none" stroke-width="4" opacity="0.7"/>
<circle cx="135" cy="330" r="48" fill="${C.glass}"/>
<circle cx="135" cy="330" r="48" fill="none" stroke-width="8"/>
<path d="M135 282 L135 378 M87 330 L183 330" fill="none" stroke="${C.frame}" stroke-width="6"/>
<g class="skinSpin">
  <circle cx="135" cy="474" r="36" fill="none" stroke="${C.banana}" stroke-width="11"/>
  <path d="M135 474 L135 442 M135 474 L167 474 M135 474 L135 506 M135 474 L103 474" fill="none" stroke="${C.banana}" stroke-width="7"/>
  <circle cx="135" cy="474" r="9" fill="${C.metalD}" stroke-width="4"/>
</g>
<path d="M40 616 L230 616" fill="none" stroke-width="6"/>
${beads([[28, 240], [242, 240], [28, 340], [242, 340], [28, 440], [242, 440], [28, 540], [242, 540], [28, 640], [242, 640]], 5, C.inkSoft)}
<path d="M1078 760 Q1058 500 1090 300 L1180 300 Q1202 520 1200 760 Z" fill="${C.leaf}" opacity="0.85" stroke="none"/>
<path d="M1078 760 Q1058 500 1090 300" fill="none" stroke-width="7" opacity="0.6"/>
<circle cx="1120" cy="210" r="104" fill="${C.leaf}" opacity="0.8" stroke="none"/>
<circle cx="1020" cy="262" r="72" fill="${C.leaf}" opacity="0.8" stroke="none"/>
<circle cx="1200" cy="270" r="78" fill="${C.leaf}" opacity="0.8" stroke="none"/>
<circle cx="1120" cy="150" r="66" fill="${C.lime}" opacity="0.55" stroke="none"/>
<path d="M1092 300 Q1060 240 1040 200 M1150 300 Q1180 250 1196 214" fill="none" stroke="${C.woodDark}" stroke-width="8" opacity="0.5"/>
<path d="M1000 250 Q988 268 1000 288 Q1014 288 1016 268 Q1014 252 1000 250 Z" fill="${C.rock}"/>
<path d="M986 252 Q1000 242 1018 252 Q1000 260 986 252 Z" fill="${C.woodDark}"/>
<path d="M1170 236 Q1158 254 1170 274 Q1184 274 1186 254 Q1184 238 1170 236 Z" fill="${C.rock}"/>
<path d="M1156 238 Q1170 228 1188 238 Q1170 246 1156 238 Z" fill="${C.woodDark}"/>
<path d="M1000 176 L1000 198" fill="none" stroke-width="6"/>
<circle cx="1000" cy="252" r="52" fill="${C.glass}" opacity="0.65"/>
<circle cx="1000" cy="252" r="52" fill="none" stroke="${C.frame}" stroke-width="10"/>
<path d="M952 266 Q1000 256 1048 266 L1048 280 Q1000 292 952 280 Z" fill="${C.blue}" opacity="0.55" stroke="none"/>
<path d="M962 302 Q1000 316 1038 302 L1036 322 Q1000 334 964 322 Z" fill="${C.metal}"/>
<circle cx="954" cy="252" r="6" fill="${C.inkSoft}" stroke="none"/>
<circle cx="1046" cy="252" r="6" fill="${C.inkSoft}" stroke="none"/>
<circle cx="984" cy="236" r="7" fill="${C.cream}" stroke-width="3" class="skinBub"/>
<circle cx="1016" cy="226" r="5" fill="${C.cream}" stroke-width="3" class="skinBub"/>
<path d="M380 654 Q600 638 820 654 L814 686 Q600 674 386 686 Z" fill="${C.wood}"/>
<path d="M386 682 Q600 670 814 682 L810 746 L390 746 Z" fill="${C.cream}"/>
<path d="M440 680 L440 746 M520 676 L520 746 M600 674 L600 746 M680 676 L680 746 M760 680 L760 746" fill="none" stroke="${C.warm}" stroke-width="6" opacity="0.75"/>
<path d="M386 706 Q600 696 814 706 M388 730 Q600 720 812 730" fill="none" stroke="${C.warm}" stroke-width="6" opacity="0.75"/>
<path d="M420 746 L414 758 M780 746 L786 758" fill="none" stroke-width="10"/>
<path d="M590 640 Q600 620 610 640 Z" fill="${C.pink}"/>
<circle cx="600" cy="636" r="7" fill="${C.banana}" stroke-width="3"/>
<path d="M918 640 Q912 610 976 604 Q1042 610 1036 642 Q1042 700 976 720 Q912 700 918 640 Z" fill="${C.rock}"/>
<path d="M912 630 Q976 598 1042 630 Q1012 648 976 644 Q942 648 912 630 Z" fill="${C.woodDark}"/>
<path d="M938 646 L1016 644 L1018 690 L936 692 Z" fill="${C.metalD}"/>
<path d="M948 660 Q977 654 1006 660" fill="none" stroke="${C.glass}" stroke-width="4"/>
<path d="M976 604 L976 586" fill="none" stroke-width="7"/>
<path d="M976 588 Q996 576 1008 588 Q994 598 976 588 Z" fill="${C.leaf}"/>
<path d="M0 724 Q300 716 600 726 Q900 736 1200 724" fill="none" stroke="${C.lime}" stroke-width="7" opacity="0.3"/>
${beads([[70, 740], [180, 752], [300, 738], [500, 750], [700, 740], [900, 752], [1100, 738]], 4, C.leaf, ' opacity="0.4"')}
`),

    /* 6. 冷灰蓝金属桶实验室：左侧铆钉桶壁 + 顶部通风管 / 齿轮，右上电脑屏，两侧实验台与试管架，底部格栅 */
    chum: frame(`
<path d="M0 0 L216 0 Q226 380 214 760 L0 760 Z" fill="${C.metal}" opacity="0.6" stroke="none"/>
<path d="M216 0 Q226 380 214 760" fill="none" stroke-width="8"/>
<path d="M72 0 Q80 380 70 760 M144 0 Q152 380 144 760" fill="none" stroke-width="5" opacity="0.6"/>
${beads([[30, 60], [110, 60], [190, 60], [30, 180], [110, 180], [190, 180], [30, 300], [110, 300], [190, 300], [30, 420], [110, 420], [190, 420], [30, 540], [110, 540], [190, 540], [30, 660], [110, 660], [190, 660]], 5, C.inkSoft)}
<path d="M-20 0 L1220 0 L1220 108 Q900 118 600 106 Q300 96 -20 116 Z" fill="${C.metalD}" opacity="0.9" stroke="none"/>
<path d="M-20 112 Q300 92 600 104 Q900 116 1220 106" fill="none" stroke-width="7"/>
<path d="M120 14 L120 100 M142 14 L142 100 M164 14 L164 100 M186 14 L186 100 M980 14 L980 100 M1002 14 L1002 100 M1024 14 L1024 100" fill="none" stroke="${C.metal}" stroke-width="8" opacity="0.8"/>
${beads([[280, 52], [420, 52], [560, 52], [700, 52], [840, 52]], 9, C.banana)}
${gear(350, 62, 30, 'skinSpin')}
${gear(850, 62, 24, 'skinSpin')}
<path d="M962 150 L1182 148 L1184 322 L960 324 Z" fill="${C.metalD}"/>
<path d="M978 164 L1166 162 L1168 302 L976 304 Z" fill="${C.metal}"/>
<path d="M990 236 Q1018 198 1044 236 T1098 236 T1152 232" fill="none" stroke="${C.lime}" stroke-width="6"/>
<path d="M990 266 L1154 264" fill="none" stroke="${C.banana}" stroke-width="5" opacity="0.75"/>
<path d="M1070 324 L1070 346 M1028 350 L1112 350" fill="none" stroke-width="9"/>
<circle cx="1160" cy="312" r="6" fill="${C.banana}" stroke="none"/>
<path d="M928 654 L1182 648 L1188 676 L924 682 Z" fill="${C.metal}"/>
<path d="M934 678 L1180 672 L1178 742 L936 744 Z" fill="${C.metalD}"/>
<path d="M1028 606 L1160 600" fill="none" stroke-width="9"/>
<path d="M1042 608 L1042 648 Q1047 660 1054 648 L1054 608" fill="${C.glass}"/>
<path d="M1043 636 L1053 636 L1053 648 Q1048 658 1043 648 Z" fill="${C.lime}" stroke="none"/>
<path d="M1076 606 L1076 646 Q1081 658 1088 646 L1088 606" fill="${C.glass}"/>
<path d="M1077 634 L1087 634 L1087 646 Q1082 656 1077 646 Z" fill="${C.blue}" stroke="none"/>
<path d="M1110 604 L1110 644 Q1115 656 1122 644 L1122 604" fill="${C.glass}"/>
<path d="M1111 632 L1121 632 L1121 644 Q1116 654 1111 644 Z" fill="${C.pink}" stroke="none"/>
<path d="M1144 602 L1144 642 Q1149 654 1156 642 L1156 602" fill="${C.glass}"/>
<path d="M1145 630 L1155 630 L1155 642 Q1150 652 1145 642 Z" fill="${C.banana}" stroke="none"/>
<path d="M944 616 L944 636 Q926 652 932 676 Q938 692 964 688 Q990 690 992 672 Q994 652 976 636 L976 616 Z" fill="${C.glass}"/>
<path d="M934 662 Q962 654 990 662 Q992 688 964 686 Q936 688 934 662 Z" fill="${C.lilac}" stroke="none"/>
<path d="M944 612 L976 612" fill="none" stroke-width="6"/>
<path d="M34 640 Q160 628 282 642 L276 732 L40 732 Z" fill="${C.metalD}"/>
<path d="M54 654 L262 650 L260 702 L52 706 Z" fill="${C.metal}"/>
<path d="M68 664 L152 661 L152 682 L68 685 Z" fill="${C.glass}"/>
<circle cx="182" cy="674" r="10" fill="${C.banana}"/>
<circle cx="212" cy="672" r="10" fill="${C.lime}"/>
<circle cx="242" cy="670" r="10" fill="${C.pink}"/>
<path d="M230 706 L238 672" fill="none" stroke-width="8"/>
<circle cx="238" cy="668" r="9" fill="${C.warm}"/>
<path d="M300 706 L900 702 M300 722 L900 718 M300 738 L900 734 M340 700 L336 748 M420 700 L416 748 M500 700 L496 748 M580 700 L576 748 M660 700 L656 748 M740 700 L736 748 M820 700 L816 748 M880 700 L876 748" fill="none" stroke="${C.metal}" stroke-width="5" opacity="0.3"/>
`)
  };
})();
