/**
 * ============================================================
 * KEC 출력 문서 엔진 (print_engine.js)
 * ------------------------------------------------------------
 * A4 용지 기준 인쇄 전용 동적 조판 엔진.
 *  - 화면 UI와 출력 레이아웃을 논리적으로 분리
 *  - 출력 직전 JavaScript로 각 블록의 실제 렌더 높이를 측정
 *  - A4 본문 가용 높이에 맞춰 자동 페이지 분할(pagination)
 *  - 표(table) 잘림 방지: 행 단위 분할 + thead 페이지마다 반복
 *  - 제목 고아(orphan heading) 방지: 제목 단독으로 페이지 끝에 남지 않게
 *  - 머리말(문서 제목)·꼬리말(페이지 번호) 자동 삽입
 *
 * 사용법:
 *   <script src="print_engine.js"></script>
 *   KECPrint.print('basis', {
 *     title:    'KEC G1 산출근거',
 *     subtitle: '비전동기 단상 분기회로 (HFIX·A1)',
 *     docNo:    '',          // 선택: 도면/문서 번호
 *     author:   ''           // 선택: 작성자
 *   });
 * ============================================================
 */
(function (global) {
  'use strict';

  // ===== A4 치수 (96dpi 기준 mm→px 환산) =====================
  var MM = 96 / 25.4;                       // 1mm ≈ 3.7795px
  var A4 = { w: 210, h: 297, margin: 13 };   // mm (portrait 기준)
  var CONTENT_W, CONTENT_H, BODY_H;          // _initDims() 에서 설정
  var HEADER_H = 56;   // 페이지 머리말 영역 높이(px)
  var FOOTER_H = 30;   // 페이지 꼬리말 영역 높이(px)
  var ORPHAN_GUARD = 90;  // 제목 뒤 최소 확보 높이(고아 방지)
  var _orientation = 'portrait';  // 현재 적용된 방향

  /** 방향에 따라 CONTENT_W / CONTENT_H / BODY_H 재계산 */
  function _initDims(orientation) {
    _orientation = (orientation === 'landscape') ? 'landscape' : 'portrait';
    var pw = (_orientation === 'landscape') ? A4.h : A4.w;  // 가로 mm
    var ph = (_orientation === 'landscape') ? A4.w : A4.h;  // 세로 mm
    CONTENT_W = Math.floor((pw - A4.margin * 2) * MM);
    CONTENT_H = Math.floor((ph - A4.margin * 2) * MM);
    BODY_H    = CONTENT_H - HEADER_H - FOOTER_H;
  }
  _initDims('portrait');  // 초기값 설정

  // ===== print 전용 CSS 동적 주입 ============================
  function injectStyle() {
    // 방향이 바뀌었으면 기존 스타일 제거 후 재생성
    var existing = document.getElementById('kec-print-style');
    if (existing) {
      if (existing.dataset.orientation === _orientation) return;  // 동일 방향 — 재사용
      existing.remove();
    }
    var pageSize = (_orientation === 'landscape') ? 'A4 landscape' : 'A4';
    var css = [
      /* 화면에서는 인쇄 루트 숨김 */
      '#kec-print-root{display:none;}',
      /* ---- 인쇄 시점 ---- */
      '@media print{',
      '  @page{size:' + pageSize + ';margin:' + A4.margin + 'mm;}',
      '  html,body{margin:0!important;padding:0!important;background:#fff!important;}',
      /* 화면용 DOM은 모두 숨기고 인쇄 루트만 노출 */
      '  body>*:not(#kec-print-root){display:none!important;}',
      '  #kec-print-root{display:block!important;}',
      /* A4 페이지 */
      '  .kec-page{width:' + CONTENT_W + 'px;height:' + CONTENT_H + 'px;',
      '    position:relative;overflow:hidden;page-break-after:always;break-after:page;}',
      '  .kec-page:last-child{page-break-after:auto;break-after:auto;}',
      '  .kec-ph{height:' + HEADER_H + 'px;border-bottom:2px solid #000;',
      '    display:flex;justify-content:space-between;align-items:flex-end;padding-bottom:5px;}',
      '  .kec-ph .t{font-size:12px;font-weight:bold;color:#000;}',
      '  .kec-ph .s{font-size:10px;color:#000;}',
      '  .kec-pb{height:' + BODY_H + 'px;overflow:hidden;padding-top:8px;}',
      '  .kec-pf{height:' + FOOTER_H + 'px;border-top:1px solid #000;',
      '    display:flex;justify-content:space-between;align-items:center;',
      '    font-size:10px;color:#000;}',
      '  .kec-page table{width:100%;border-collapse:collapse;}',
      '  .kec-page table.ctr th,.kec-page table.ctr td,.kec-page table.ctr td:last-child{text-align:center!important;}',
      '  .kec-page th.edge-l,.kec-page td.edge-l{border-left-color:transparent!important;}',
      '  .kec-page th.edge-r,.kec-page td.edge-r{border-right-color:transparent!important;}',
      '  .kec-page th,.kec-page td{border:1px solid #000;padding:3px 6px;color:#000;',
      '    -webkit-print-color-adjust:exact;print-color-adjust:exact;}',
      '  .kec-page th{background:#e8e8e8;}',
      '  .kec-page h3{color:#000;-webkit-print-color-adjust:exact;print-color-adjust:exact;}',
      '}',
      /* 간선 입력·결과 표 No. 열 폭 동일 */
      '.kec-page table.ctr th:first-child,.kec-page table.ctr td:first-child{width:28px;}',
      '.kec-page table.ctr tr.grp-hdr td,.kec-page table.ctr tr.dp-grp-hdr td{text-align:left!important;}',
      /* ---- 블록 공통 스타일 (인쇄·미리보기·측정 공통, 페이지 엔진이 복제한 DOM 대상) ---- */
      /* 표 셀 기본 여백·테두리: 인쇄 전용이던 규칙을 측정/미리보기에도 동일 적용(측정 높이 ≠ 인쇄 높이 → 하단 행 잘림 방지) */
      '.kec-page table{width:100%;border-collapse:collapse;}',
      '.kec-page th,.kec-page td{border:1px solid #000;padding:3px 6px;color:#000;}',
      '.kec-page th{background:#e8e8e8;}',
      '.kec-page .card,#kec-measurer .card{margin-bottom:10px;}',
      '.kec-page .card-header,#kec-measurer .card-header{padding:3px 8px;border-bottom:2px solid #000;margin-bottom:4px;}',
      '.kec-page h3,#kec-measurer h3{font-size:11px;font-weight:700;margin:0;}',
      '.kec-page span.pv,#kec-measurer span.pv{font-size:9px;}',
      '.kec-page .cfg-tbl th,.kec-page .cfg-tbl td,#kec-measurer .cfg-tbl th,#kec-measurer .cfg-tbl td{text-align:center;font-size:9px;}',
      '.kec-page .cfg-tbl td.cfg-lbl,.kec-page .cfg-tbl td.cfg-rem,#kec-measurer .cfg-tbl td.cfg-lbl,#kec-measurer .cfg-tbl td.cfg-rem{text-align:left;}',
      '.kec-page .cfg-tbl td.cfg-lbl,#kec-measurer .cfg-tbl td.cfg-lbl{font-weight:700;}',
      '.kec-page #ds-start-tbl th,.kec-page #ds-start-tbl td,#kec-measurer #ds-start-tbl th,#kec-measurer #ds-start-tbl td{text-align:center;}',
      '.kec-page .imp-row,#kec-measurer .imp-row{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border:1px solid #000;border-bottom:none;margin-bottom:6px;}',
      '.kec-page .imp-card2,#kec-measurer .imp-card2{padding:3px 5px;border-right:1px solid #000;border-bottom:1px solid #000;min-width:0;break-inside:avoid;}',
      '.kec-page .imp-card2:nth-child(4n),#kec-measurer .imp-card2:nth-child(4n){border-right:none;}',
      '.kec-page .imp-card2 .i-label,#kec-measurer .imp-card2 .i-label{font-size:8px;}',
      '.kec-page .imp-card2 .i-val,#kec-measurer .imp-card2 .i-val{font-size:10.5px;font-weight:700;}',
      '.kec-page .imp-card2 .i-unit,#kec-measurer .imp-card2 .i-unit{font-size:8px;margin-left:2px;}',
      '.kec-page .imp-card2 .i-sub,#kec-measurer .imp-card2 .i-sub{font-size:7.5px;overflow-wrap:anywhere;}',
      '.kec-page table.tc td,.kec-page table.tc th,#kec-measurer table.tc td{text-align:center;}',
      '.kec-page table.tc tr.grp-hdr td,#kec-measurer table.tc tr.grp-hdr td{text-align:left;}',
      /* ft: 간선 입력 DATA 표 — 계산결과 표(rt)와 행 높이를 동일하게 */
      '.kec-page table.ft{font-size:8px;}',
      '.kec-page table.ft th{font-size:8.5px!important;font-weight:700!important;padding:3px 2px;white-space:nowrap;line-height:1.25;}',
      '.kec-page table.ft td{font-size:8px!important;font-weight:400!important;padding:2px 2px;white-space:nowrap;line-height:1.3;}',
      '.kec-page table.ft td *{font-size:8px!important;font-weight:400!important;line-height:1.3!important;padding:0!important;margin:0!important;height:auto!important;min-height:0!important;border:none!important;}',
      '.kec-page table.rt,#kec-measurer table.rt{font-size:8px;}',
      '.kec-page table.rt th,#kec-measurer table.rt th{font-size:8.5px!important;font-weight:700!important;padding:3px 2px;white-space:nowrap;line-height:1.25;}',
      '.kec-page table.rt td,#kec-measurer table.rt td{font-size:8px!important;font-weight:400!important;padding:2px 2px;white-space:nowrap;line-height:1.3;}',
      '.kec-page table.rt td *,#kec-measurer table.rt td *{font-size:8px!important;font-weight:400!important;}',
      '.kec-page table.rt td.sum,#kec-measurer table.rt td.sum,.kec-page table.rt td [style*="700"],#kec-measurer table.rt td [style*="700"]{font-weight:700!important;}',
      '.kec-page table.rt td:last-child,#kec-measurer table.rt td:last-child{white-space:normal;text-align:left;font-size:7.5px!important;padding:2px 3px;}',
      '.kec-page table.rt tr.grp-hdr td,.kec-page table.rt tr.dp-grp-hdr td,#kec-measurer table.rt tr.grp-hdr td,#kec-measurer table.rt tr.dp-grp-hdr td{white-space:nowrap;text-align:left;font-size:9px!important;font-weight:400!important;padding:3px 6px;}',
      '.kec-page table.rt tr.grp-hdr td strong,#kec-measurer table.rt tr.grp-hdr td strong{font-weight:700!important;}',
      '.kec-page .print-section-label,#kec-measurer .print-section-label,.kec-page .sec-label,#kec-measurer .sec-label{font-size:10px;font-weight:700;margin:4px 0 3px;padding:0 0 2px;border-bottom:1px solid #000;}',
      '.kec-page table.rr th,#kec-measurer table.rr th{font-size:6.5px!important;padding:2px 1px;}',
      '.kec-page table.rr td,#kec-measurer table.rr td,.kec-page table.rr td *,#kec-measurer table.rr td *{font-size:6.5px!important;padding:2px 1px;}',
      '.kec-page table.rr td:last-child,#kec-measurer table.rr td:last-child{font-size:6px!important;}',
      '.kec-page table.rr tr.grp-hdr td,.kec-page table.rr tr.dp-grp-hdr td,#kec-measurer table.rr tr.grp-hdr td,#kec-measurer table.rr tr.dp-grp-hdr td{font-size:8px!important;}',
      '.kec-page .imp-seg,#kec-measurer .imp-seg{display:flex;align-items:center;justify-content:center;text-align:center;padding:3px 5px;border-right:1px solid #000;border-bottom:1px solid #000;font-size:8.5px;font-weight:700;line-height:1.4;min-width:0;}',
      '.kec-page .imp-seg:nth-child(4n),#kec-measurer .imp-seg:nth-child(4n){border-right:none;}',
      '.kec-page .sec-title,#kec-measurer .sec-title{font-size:10.5px;font-weight:700;margin:4px 0 3px;padding:0 0 0 6px;border-left:3px solid #000;line-height:1.2;}',
      '.kec-page .imp-sec-title,#kec-measurer .imp-sec-title{font-size:9.5px;font-weight:700;margin:6px 0 2px;padding:0;border:none;border-bottom:1px solid #000;}',
      /* 화면 미리보기 모드(인쇄 안 하고 레이아웃 확인용) */
      '#kec-print-root.kec-preview{display:block;background:#525659;padding:24px 0;}',
      '#kec-print-root.kec-preview .kec-page{width:' + CONTENT_W + 'px;height:' + CONTENT_H + 'px;',
      '  background:#fff;margin:0 auto 20px;box-shadow:0 2px 12px rgba(0,0,0,.4);',
      '  position:relative;overflow:hidden;}',
      '#kec-print-root.kec-preview .kec-ph{height:' + HEADER_H + 'px;border-bottom:2px solid #000;',
      '  display:flex;justify-content:space-between;align-items:flex-end;padding-bottom:5px;margin:0 14px;}',
      '#kec-print-root.kec-preview .kec-pb{height:' + BODY_H + 'px;overflow:hidden;padding:8px 14px 0;}',
      '#kec-print-root.kec-preview .kec-pf{height:' + FOOTER_H + 'px;border-top:1px solid #000;',
      '  display:flex;justify-content:space-between;align-items:center;font-size:10px;color:#000;margin:0 14px;}'
    ].join('\n');
    var st = document.createElement('style');
    st.id = 'kec-print-style';
    st.dataset.orientation = _orientation;
    st.textContent = css;
    document.head.appendChild(st);
  }

  // ===== 측정용 임시 컨테이너 ================================
  function makeMeasurer() {
    var m = document.createElement('div');
    m.id = 'kec-measurer';
    m.className = 'kec-page';  // 인쇄 DOM과 동일한 .kec-page 규칙 적용
    m.style.cssText = 'position:absolute;left:-99999px;top:0;width:' +
      (CONTENT_W - 28) + 'px;visibility:hidden;';
    document.body.appendChild(m);
    return m;
  }
  function measureHeight(measurer, node) {
    var clone = node.cloneNode(true);
    measurer.appendChild(clone);
    var h = clone.getBoundingClientRect().height;
    measurer.removeChild(clone);
    return Math.ceil(h);
  }

  // ===== 페이지 골격 생성 ====================================
  function buildPageShell(meta, pageNo) {
    var page = document.createElement('div');
    page.className = 'kec-page';

    var ph = document.createElement('div');
    ph.className = 'kec-ph';
    ph.innerHTML =
      '<div class="t">' + esc(meta.title || '') + '</div>' +
      '<div class="s">' + esc(meta.subtitle || '') + '</div>';

    var pb = document.createElement('div');
    pb.className = 'kec-pb';

    var pf = document.createElement('div');
    pf.className = 'kec-pf';
    pf.innerHTML =
      '<span>' + esc(meta.docNo ? '문서번호: ' + meta.docNo : (meta.footerLeft || '')) + '</span>' +
      '<span class="kec-pageno"></span>' +
      '<span>' + esc(meta.author ? '작성: ' + meta.author : (meta.date || todayStr())) + '</span>';

    page.appendChild(ph);
    page.appendChild(pb);
    page.appendChild(pf);
    // 방향 혼합 인쇄 대응: 페이지별 치수·이름있는 @page 지정
    page.style.width = CONTENT_W + 'px';
    page.style.height = CONTENT_H + 'px';
    pb.style.height = BODY_H + 'px';
    page.style.setProperty('page', _orientation === 'landscape' ? 'kl' : 'kp');
    return page;
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  // ===== 표 분할 =============================================
  // 표를 thead + tbody-rows 단위로 쪼개 여러 조각으로 반환.
  // 각 조각은 thead를 반복 포함하여 페이지마다 머리행이 보이게 함.
  function splitTable(tableEl, measurer, firstAvail) {
    var pieces = [];
    var thead = tableEl.querySelector('thead');
    // thead 있으면 tbody의 tr만, 없으면 모든 tr을 본문 행으로
    var rows = thead
      ? Array.prototype.slice.call(tableEl.querySelectorAll('tbody > tr'))
      : Array.prototype.slice.call(tableEl.querySelectorAll('tr'));

    // 빈 표 골격 생성 (thead 있으면 매 조각마다 반복 포함)
    function freshTable() {
      var t = tableEl.cloneNode(false);          // <table> 속성만
      if (thead) t.appendChild(thead.cloneNode(true));
      t.appendChild(document.createElement('tbody'));
      return t;
    }
    var hH = thead ? measureHeight(measurer, freshTable()) : 0;
    var avail = firstAvail;
    var cur = freshTable();
    var curTb = cur.querySelector('tbody');
    var curH = hH;

    for (var i = 0; i < rows.length; i++) {
      var probe = freshTable();
      probe.querySelector('tbody').appendChild(rows[i].cloneNode(true));
      var rowH = measureHeight(measurer, probe) - hH;

      // 현재 조각이 가용 높이를 넘고, 이미 행이 하나 이상이면 새 조각으로
      if (curH + rowH > avail && curTb.children.length > 0) {
        pieces.push(cur);
        cur = freshTable();
        curTb = cur.querySelector('tbody');
        curH = hH;
        avail = BODY_H - 10;     // 두 번째 조각부터: 하단 잘림 방지 안전 마진 10px
      }
      curTb.appendChild(rows[i].cloneNode(true));
      curH += rowH;
    }
    if (curTb.children.length > 0) pieces.push(cur);
    return pieces;
  }

  // ===== 핵심: 소스 콘텐츠를 A4 페이지들로 조판 ===============
  function paginate(sourceEl, meta) {
    var measurer = makeMeasurer();
    var root = document.createElement('div');
    root.id = 'kec-print-root';

    var pages = [];
    var pageNo = 0;
    var curBody = null;
    var curH = 0;

    function newPage() {
      pageNo++;
      var pg = buildPageShell(meta, pageNo);
      pages.push(pg);
      root.appendChild(pg);
      curBody = pg.querySelector('.kec-pb');
      curH = 8;  // .kec-pb 의 padding-top:8px 보정 (box-sizing:border-box 기준)
    }
    newPage();

    // 소스의 직계 자식을 "블록"으로 수집
    var blocks = Array.prototype.slice.call(sourceEl.children);

    for (var i = 0; i < blocks.length; i++) {
      var src = blocks[i];
      if (src.classList && src.classList.contains('kec-skip-print')) continue;
      if (src.classList && src.classList.contains('kec-pagebreak')) { if (curH > 8) newPage(); continue; }   // 강제 쪽나눔

      var node = src.cloneNode(true);
      var isHeading = /^H[1-6]$/.test(node.tagName);
      var hasTable = node.tagName === 'TABLE' || !!node.querySelector('table');
      // 블록 내 table 개수: 1개면 분할 가능, 2개 이상이면 통째로 처리
      var tableCount = hasTable
        ? (node.tagName === 'TABLE' ? 1 : node.querySelectorAll('table').length)
        : 0;
      var isSplittable = hasTable && tableCount <= 1;
      var h = measureHeight(measurer, node);

      // (1) 제목 고아 방지: 제목인데 남은 공간이 부족하면 새 페이지
      if (isHeading) {
        var nextH = (i + 1 < blocks.length)
          ? measureHeight(measurer, blocks[i + 1]) : 0;
        if (curH > 0 && (BODY_H - curH) < Math.min(h + ORPHAN_GUARD, h + nextH)) {
          newPage();
        }
      }

      // (2) 블록이 통째로 현재 페이지에 안 들어가는 경우
      if (curH + h > BODY_H) {
        if (isSplittable) {
          // 단일 table 포함 블록: 행 단위 분할 (thead 반복)
          placeTableBlock(node, measurer);
          continue;
        }
        // 다중 table 블록(ref-grid 등) 또는 일반 블록 → 새 페이지로 이동
        if (curH > 0) newPage();
        // 그래도 한 페이지보다 크면(드묾) 축소 처리
        if (h > BODY_H) {
          node = shrinkToFit(node, h);
        }
      }

      curBody.appendChild(node);
      curH += h;
    }

    // 표 포함 블록 배치 헬퍼 (클로저로 페이지 상태 접근)
    // blockNode는 이미 복제본 — 표를 떼어내고 나머지(설명·수식)를 먼저 배치한 뒤,
    // 표는 splitTable로 행 단위 분할하여 배치한다.
    function placeTableBlock(blockNode, mz) {
      var table = blockNode.tagName === 'TABLE'
        ? blockNode : blockNode.querySelector('table');
      if (!table) {  // 안전장치: 표가 없으면 일반 블록 배치
        var hh = measureHeight(mz, blockNode);
        if (curH + hh > BODY_H && curH > 0) newPage();
        curBody.appendChild(blockNode);
        curH += hh;
        return;
      }
      // blockNode 자체가 표가 아니면 표를 분리하고 나머지를 먼저 배치
      if (blockNode !== table) {
        table.parentNode.removeChild(table);
        var preH = measureHeight(mz, blockNode);
        if (preH > 8) {  // 표 외 설명/수식이 남아 있으면
          if (curH + preH > BODY_H && curH > 0) newPage();
          curBody.appendChild(blockNode);
          curH += preH;
        }
      }
      // 표 분할 배치
      var firstAvail = BODY_H - curH - 10;      // 하단 안전 마진 10px
      if (firstAvail < 140) { newPage(); firstAvail = BODY_H - 10; }
      var pieces = splitTable(table, mz, firstAvail);
      for (var k = 0; k < pieces.length; k++) {
        if (k > 0) newPage();
        var ph2 = measureHeight(mz, pieces[k]);
        if (curH + ph2 > BODY_H && curH > 0) newPage();
        curBody.appendChild(pieces[k]);
        curH += ph2;
      }
    }

    document.body.removeChild(measurer);

    // 페이지 번호 기입
    var pns = root.querySelectorAll('.kec-pageno');
    for (var p = 0; p < pns.length; p++) {
      pns[p].textContent = (p + 1) + ' / ' + pns.length;
    }
    return root;
  }

  // 한 페이지보다 큰 단일 블록을 축소(scale)해 맞춤
  function shrinkToFit(node, h) {
    var wrap = document.createElement('div');
    var scale = Math.max(0.55, (BODY_H - 8) / h);
    wrap.style.cssText = 'transform:scale(' + scale.toFixed(3) +
      ');transform-origin:top left;width:' + (100 / scale) + '%;';
    wrap.appendChild(node);
    return wrap;
  }

  // ===== MathJax 재조판 대기 ================================
  function waitForMath() {
    return new Promise(function (resolve) {
      if (global.MathJax && global.MathJax.typesetPromise) {
        global.MathJax.typesetPromise()
          .then(function () { setTimeout(resolve, 120); })
          .catch(function () { resolve(); });
      } else {
        resolve();
      }
    });
  }

  // ===== 실측 기반 넘침 보정 ================================
  // 사전 측정(measurer)과 실제 렌더 높이가 어긋나 페이지 하단 행이 잘리는(overflow:hidden) 경우,
  // 실제 배치된 뒤 넘치는 마지막 행을 다음 쪽(같은 표 머리글)으로 옮긴다.
  function repairOverflow(root) {
    if (!root) return;
    var prev = root.style.cssText;
    root.classList.add('kec-preview');
    root.style.cssText = 'position:absolute;left:-99999px;top:0;visibility:hidden;';
    var guard = 0;
    function headSig(t) { return t && t.tHead ? t.tHead.innerHTML : ''; }
    try {
      for (var pi = 0; pi < root.querySelectorAll('.kec-page').length && guard < 5000; pi++) {
        var pages = root.querySelectorAll('.kec-page');
        var pg = pages[pi], pb = pg.querySelector('.kec-pb');
        if (!pb) continue;
        while (pb.scrollHeight > pb.clientHeight + 1 && guard++ < 5000) {
          var tbs = pb.querySelectorAll('table tbody');
          var tb = tbs[tbs.length - 1];
          if (!tb || tb.rows.length < 2) break;            // 한 행만 남으면 더 못 옮김
          var table = tb.parentNode;
          var tr = tb.rows[tb.rows.length - 1];
          var next = pages[pi + 1], dest = null;
          if (next) {
            var nb = next.querySelector('.kec-pb');
            var first = nb && nb.firstElementChild;
            if (first && first.tagName === 'TABLE' && headSig(first) === headSig(table) && first.tBodies[0]) dest = first.tBodies[0];
          }
          if (!dest) {
            var np = pg.cloneNode(false);
            var ph = pg.querySelector('.kec-ph'), pf = pg.querySelector('.kec-pf');
            if (ph) np.appendChild(ph.cloneNode(true));
            var nbd = pb.cloneNode(false);
            var nt = table.cloneNode(false);
            if (table.tHead) nt.appendChild(table.tHead.cloneNode(true));
            var ntb = document.createElement('tbody'); nt.appendChild(ntb);
            nbd.appendChild(nt); np.appendChild(nbd);
            if (pf) np.appendChild(pf.cloneNode(true));
            pg.parentNode.insertBefore(np, pg.nextSibling);
            pages = root.querySelectorAll('.kec-page');
            dest = ntb;
          }
          dest.insertBefore(tr, dest.firstChild);
        }
      }
    } finally {
      root.style.cssText = prev;
      root.classList.remove('kec-preview');
    }
    var pns = root.querySelectorAll('.kec-pageno');
    for (var p = 0; p < pns.length; p++) pns[p].textContent = (p + 1) + ' / ' + pns.length;
  }

  // ===== 공개 API ===========================================
  var KECPrint = {
    /** A4 페이지 단위로 조판된 인쇄 루트를 만들어 반환(미인쇄) */
    build: function (sourceId, meta) {
      var m = meta || {};
      _initDims(m.orientation);   // portrait / landscape 치수 재초기화
      injectStyle();
      var src = document.getElementById(sourceId);
      if (!src) { console.warn('[KECPrint] source not found:', sourceId); return null; }
      var old = document.getElementById('kec-print-root');
      if (old) old.remove();
      var root = paginate(src, m);
      document.body.appendChild(root);
      try { repairOverflow(root); } catch (e) { console.warn('[KECPrint] repairOverflow', e); }
      return root;
    },

    /** 여러 구간(방향 혼합 가능)을 하나의 인쇄 루트로 조판. items=[{el, orientation, title, subtitle, date}] */
    buildMulti: function (items) {
      var pst = document.getElementById('kec-print-pages');
      if (pst) pst.remove();
      pst = document.createElement('style'); pst.id = 'kec-print-pages';
      pst.textContent = '@media print{@page kp{size:A4 portrait;margin:' + A4.margin + 'mm;}@page kl{size:A4 landscape;margin:' + A4.margin + 'mm;}}';
      document.head.appendChild(pst);
      var old = document.getElementById('kec-print-root');
      if (old) old.remove();
      var all = document.createElement('div');
      all.id = 'kec-print-root';
      items.forEach(function (it) {
        _initDims(it.orientation);
        injectStyle();
        var r = paginate(it.el, it);
        while (r.firstChild) all.appendChild(r.firstChild);
      });
      var pns = all.querySelectorAll('.kec-pageno');
      for (var p = 0; p < pns.length; p++) pns[p].textContent = (p + 1) + ' / ' + pns.length;
      document.body.appendChild(all);
      try { repairOverflow(all); } catch (e) { console.warn('[KECPrint] repairOverflow', e); }
      return all;
    },

    /** 조판 후 인쇄 다이얼로그 호출 */
    print: function (sourceId, meta) {
      var self = this;
      waitForMath().then(function () {
        var root = self.build(sourceId, meta);
        if (!root) { return; }
        setTimeout(function () {
          global.print();
          // 인쇄 종료 후 정리
          var cleanup = function () {
            var r = document.getElementById('kec-print-root');
            if (r) r.remove();
            global.removeEventListener('afterprint', cleanup);
          };
          global.addEventListener('afterprint', cleanup);
          setTimeout(cleanup, 60000);  // 보호용 타임아웃
        }, 150);
      });
    },

    /** 화면에서 조판 결과를 미리보기(인쇄 안 함). 다시 호출하면 닫힘 */
    preview: function (sourceId, meta) {
      var existing = document.getElementById('kec-print-root');
      if (existing && existing.classList.contains('kec-preview')) {
        existing.remove();
        return;
      }
      var self = this;
      waitForMath().then(function () {
        var root = self.build(sourceId, meta);
        if (!root) return;
        root.classList.add('kec-preview');
        root.scrollIntoView({ behavior: 'smooth' });
      });
    }
  };

  global.KECPrint = KECPrint;
})(window);
