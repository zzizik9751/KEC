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
  var A4 = { w: 210, h: 297, margin: 13 };   // mm
  var CONTENT_W = Math.floor((A4.w - A4.margin * 2) * MM);  // 본문 폭 px
  var CONTENT_H = Math.floor((A4.h - A4.margin * 2) * MM);  // 본문 높이 px
  var HEADER_H = 56;   // 페이지 머리말 영역 높이(px)
  var FOOTER_H = 30;   // 페이지 꼬리말 영역 높이(px)
  var BODY_H = CONTENT_H - HEADER_H - FOOTER_H;  // 본문 콘텐츠 가용 높이
  var ORPHAN_GUARD = 90;  // 제목 뒤 최소 확보 높이(고아 방지)

  // ===== print 전용 CSS 동적 주입 ============================
  function injectStyle() {
    if (document.getElementById('kec-print-style')) return;
    var css = [
      /* 화면에서는 인쇄 루트 숨김 */
      '#kec-print-root{display:none;}',
      /* ---- 인쇄 시점 ---- */
      '@media print{',
      '  @page{size:A4;margin:' + A4.margin + 'mm;}',
      '  html,body{margin:0!important;padding:0!important;background:#fff!important;}',
      /* 화면용 DOM은 모두 숨기고 인쇄 루트만 노출 */
      '  body>*:not(#kec-print-root){display:none!important;}',
      '  #kec-print-root{display:block!important;}',
      /* A4 페이지 */
      '  .kec-page{width:' + CONTENT_W + 'px;height:' + CONTENT_H + 'px;',
      '    position:relative;overflow:hidden;page-break-after:always;break-after:page;}',
      '  .kec-page:last-child{page-break-after:auto;break-after:auto;}',
      '  .kec-ph{height:' + HEADER_H + 'px;border-bottom:1.5px solid #1f2937;',
      '    display:flex;justify-content:space-between;align-items:flex-end;padding-bottom:5px;}',
      '  .kec-ph .t{font-size:13px;font-weight:bold;color:#1f2937;}',
      '  .kec-ph .s{font-size:10px;color:#6b7280;}',
      '  .kec-pb{height:' + BODY_H + 'px;overflow:hidden;padding-top:8px;}',
      '  .kec-pf{height:' + FOOTER_H + 'px;border-top:1px solid #d9dde3;',
      '    display:flex;justify-content:space-between;align-items:center;',
      '    font-size:10px;color:#6b7280;}',
      '  .kec-page table{width:100%;border-collapse:collapse;}',
      '  .kec-page th,.kec-page td{border:1px solid #999;padding:3px 6px;',
      '    -webkit-print-color-adjust:exact;print-color-adjust:exact;}',
      '  .kec-page th{background:#eef2f7;}',
      '  .kec-page h3{-webkit-print-color-adjust:exact;print-color-adjust:exact;}',
      '}',
      /* 화면 미리보기 모드(인쇄 안 하고 레이아웃 확인용) */
      '#kec-print-root.kec-preview{display:block;background:#525659;padding:24px 0;}',
      '#kec-print-root.kec-preview .kec-page{width:' + CONTENT_W + 'px;height:' + CONTENT_H + 'px;',
      '  background:#fff;margin:0 auto 20px;box-shadow:0 2px 12px rgba(0,0,0,.4);',
      '  position:relative;overflow:hidden;}',
      '#kec-print-root.kec-preview .kec-ph{height:' + HEADER_H + 'px;border-bottom:1.5px solid #1f2937;',
      '  display:flex;justify-content:space-between;align-items:flex-end;padding-bottom:5px;margin:0 14px;}',
      '#kec-print-root.kec-preview .kec-pb{height:' + BODY_H + 'px;overflow:hidden;padding:8px 14px 0;}',
      '#kec-print-root.kec-preview .kec-pf{height:' + FOOTER_H + 'px;border-top:1px solid #d9dde3;',
      '  display:flex;justify-content:space-between;align-items:center;font-size:10px;color:#6b7280;margin:0 14px;}'
    ].join('\n');
    var st = document.createElement('style');
    st.id = 'kec-print-style';
    st.textContent = css;
    document.head.appendChild(st);
  }

  // ===== 측정용 임시 컨테이너 ================================
  function makeMeasurer() {
    var m = document.createElement('div');
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
        avail = BODY_H;          // 두 번째 조각부터는 전체 본문 높이 사용
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
      curH = 0;
    }
    newPage();

    // 소스의 직계 자식을 "블록"으로 수집
    var blocks = Array.prototype.slice.call(sourceEl.children);

    for (var i = 0; i < blocks.length; i++) {
      var src = blocks[i];
      if (src.classList && src.classList.contains('kec-skip-print')) continue;

      var node = src.cloneNode(true);
      var isHeading = /^H[1-6]$/.test(node.tagName);
      var hasTable = node.tagName === 'TABLE' || !!node.querySelector('table');
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
        if (hasTable && h > BODY_H * 0.5) {
          // 표 포함 큰 블록 → 표를 분할
          placeTableBlock(node, measurer);
          continue;
        }
        // 일반 블록 → 새 페이지로 이동
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
      var firstAvail = BODY_H - curH;
      if (firstAvail < 140) { newPage(); firstAvail = BODY_H; }
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

  // ===== 공개 API ===========================================
  var KECPrint = {
    /** A4 페이지 단위로 조판된 인쇄 루트를 만들어 반환(미인쇄) */
    build: function (sourceId, meta) {
      injectStyle();
      var src = document.getElementById(sourceId);
      if (!src) { console.warn('[KECPrint] source not found:', sourceId); return null; }
      var old = document.getElementById('kec-print-root');
      if (old) old.remove();
      var root = paginate(src, meta || {});
      document.body.appendChild(root);
      return root;
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
        if (root) root.classList.add('kec-preview');
        root.scrollIntoView({ behavior: 'smooth' });
      });
    }
  };

  global.KECPrint = KECPrint;
})(window);
