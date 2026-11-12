/**
 * KEC 설계 참조 데이터 (window.KEC_DATA)
 * 근거: 「감전 및 과전류보호 설계방법에 관한 기술지침(KECG 1702-2019)」 부록
 * 마지막 갱신: 2026-05-18
 *
 * 사용법: <script src="kec_data.js"></script> 후 window.KEC_DATA로 접근
 */
window.KEC_DATA = {

  //============================================================
  // 1. 14개 PDF 예시 타입 프리셋 (5.1.2 ~ 5.1.13)
  //============================================================
  PRESETS: [
    { id:'G1', section:'5.1.2', label:'비전동기 단상 소용량 (절연전선)',
      load:'비전동기', phase:1, voltage:220, capacity:3, unit:'kVA', cosTheta:0.88,
      cable:'HFIX', cores:1, wiring:'A1', arrangement:'-', layoutGroup:'A1-1',
      ambientTemp:40, circuits:1, parallels:1,
      starting:null, startMultiplier:null, startTime:null, startCos:null,
      protection:'주택용 MCB Type-B', protectionType:'MCB-house',
      peType:'HFIX', peMethod:'table',
      branchLength:30, dropLimit:2,
      sourceMVA:300, sourceXR:10, txKVA:500, txPZ:6, txXR:4.69,
      feederV:380, feederCable:'F-CV', feederSize:95, feederCores:1, feederArr:'평면', feederLen:90
    },
    { id:'G2', section:'5.1.3', label:'비전동기 3상 중소용량 (다심)',
      load:'비전동기', phase:3, voltage:380, capacity:20, unit:'kVA', cosTheta:0.85,
      cable:'F-CV', cores:4, wiring:'B2', arrangement:'-', layoutGroup:'B2-1',
      ambientTemp:40, circuits:1, parallels:1,
      starting:null, startMultiplier:null,
      protection:'주택용 MCB Type-B', protectionType:'MCB-house',
      peType:'F-GV', peMethod:'calc',
      branchLength:40, dropLimit:2,
      sourceMVA:300, sourceXR:10, txKVA:1000, txPZ:6, txXR:5.71,
      feederV:380, feederCable:'F-CV', feederSize:150, feederCores:1, feederArr:'평면', feederLen:90
    },
    { id:'G3', section:'5.1.4', label:'비전동기 3상 중용량 (저독성)',
      load:'비전동기', phase:3, voltage:380, capacity:50, unit:'kVA', cosTheta:0.85,
      cable:'HFCO', cores:4, wiring:'B2', arrangement:'-', layoutGroup:'B2-1',
      ambientTemp:40, circuits:1, parallels:1,
      starting:null, startMultiplier:null,
      protection:'산업용 MCCB', protectionType:'MCCB',
      peType:'F-GV', peMethod:'calc',
      branchLength:80, dropLimit:2,
      sourceMVA:300, sourceXR:10
    },
    { id:'G4', section:'5.1.5', label:'비전동기 3상 대용량 (단심 삼각)',
      load:'비전동기', phase:3, voltage:380, capacity:200, unit:'kVA', cosTheta:0.85,
      cable:'F-CV', cores:1, wiring:'B1', arrangement:'삼각', layoutGroup:'B1-1',
      ambientTemp:40, circuits:1, parallels:1,
      starting:null,
      protection:'산업용 MCCB', protectionType:'MCCB',
      peType:'GV', peMethod:'calc',
      branchLength:50, dropLimit:2,
      sourceMVA:300, sourceXR:10
    },
    { id:'G5', section:'5.1.6', label:'비전동기 3상 초대용량 (병렬, 트레이)',
      load:'비전동기', phase:3, voltage:380, capacity:480, unit:'kVA', cosTheta:0.88,
      cable:'HFCO', cores:1, wiring:'F2', arrangement:'평면', layoutGroup:'F2-4',
      ambientTemp:40, circuits:3, parallels:2,
      starting:null,
      protection:'산업용 2× MCCB', protectionType:'MCCB-multi',
      peType:'F-GV', peMethod:'calc',
      branchLength:70, dropLimit:2,
      sourceMVA:300, sourceXR:10
    },
    { id:'M1', section:'5.1.7', label:'전동기 단상 소형 (전전압)',
      load:'전동기', phase:1, voltage:220, capacity:1.5, unit:'kW', efficiency:0.90, cosTheta:0.80,
      cable:'F-CV', cores:2, wiring:'B2', arrangement:'-', layoutGroup:'B2-1',
      ambientTemp:40, circuits:1, parallels:1,
      starting:'전전압', startMultiplier:8.2, startTime:5.0, startCos:0.15,
      inrushFactor:1.5, convTripMult:2.15, instTripMult:5,
      protection:'주택용 MCB Type-C', protectionType:'MCB-house',
      peType:'HFIX', peMethod:'table',
      branchLength:60, dropLimit:2, startDropLimit:7,
      sourceMVA:300, sourceXR:10, txKVA:500, txPZ:6.0, txXR:4.69,
      feederV:380, feederCable:'F-CV', feederSize:95, feederCores:1, feederArr:'삼각', feederLen:120
    },
    { id:'M2', section:'5.1.8', label:'전동기 3상 중형 (전전압)',
      load:'전동기', phase:3, voltage:380, capacity:22, unit:'kW', efficiency:0.88, cosTheta:0.80,
      cable:'F-CV', cores:3, wiring:'B2', arrangement:'-', layoutGroup:'B2-1',
      ambientTemp:40, circuits:1, parallels:1,
      starting:'전전압', startMultiplier:7.2, startTime:6, startCos:0.2,
      protection:'산업용 MCCB', protectionType:'MCCB',
      peType:'F-GV', peMethod:'calc',
      branchLength:40, dropLimit:2, startDropLimit:7,
      sourceMVA:300, sourceXR:10
    },
    { id:'M3', section:'5.1.9', label:'전동기 3상 중대형 (Y-Δ)',
      load:'전동기', phase:3, voltage:380, capacity:45, unit:'kW', efficiency:0.92, cosTheta:0.84,
      cable:'F-FR-8', cores:1, wiring:'B1', arrangement:'삼각', layoutGroup:'B1-1',
      ambientTemp:40, circuits:1, parallels:1,
      starting:'Y-Δ', startMultiplier:7.2, startTime:6, startCos:0.2, transferCos:0.5,
      protection:'산업용 MCCB', protectionType:'MCCB',
      peType:'F-GV', peMethod:'calc',
      branchLength:50, dropLimit:2, startDropLimit:7,
      sourceMVA:300, sourceXR:10
    },
    { id:'M4', section:'5.1.10', label:'전동기 3상 대형 (리액터 50%)',
      load:'전동기', phase:3, voltage:380, capacity:75, unit:'kW', efficiency:0.90, cosTheta:0.85,
      cable:'HFCO', cores:1, wiring:'F2', arrangement:'평면', layoutGroup:'F2-4',
      ambientTemp:40, circuits:3, parallels:1,
      starting:'리액터 50%', startMultiplier:6.5, startTime:6, startCos:0.2,
      protection:'산업용 MCCB', protectionType:'MCCB',
      peType:'F-GV', peMethod:'calc',
      branchLength:60, dropLimit:3, startDropLimit:7,
      sourceMVA:300, sourceXR:10
    },
    { id:'M5', section:'5.1.11', label:'전동기 3상 대형 (기동보상 65%)',
      load:'전동기', phase:3, voltage:380, capacity:160, unit:'kW', efficiency:0.92, cosTheta:0.82,
      cable:'TFR-CV', cores:1, wiring:'F1', arrangement:'삼각', layoutGroup:'F1-4',
      ambientTemp:40, circuits:4, parallels:1,
      starting:'기동보상 65%', startMultiplier:6.0, startTime:8, startCos:0.1,
      protection:'산업용 MCCB', protectionType:'MCCB',
      peType:'F-GV', peMethod:'calc',
      branchLength:70, dropLimit:3, startDropLimit:7,
      sourceMVA:300, sourceXR:10
    },
    { id:'M6', section:'5.1.12', label:'전동기 3상 초대형 (Soft Start, 병렬, ACB)',
      load:'전동기', phase:3, voltage:380, capacity:440, unit:'kW', efficiency:0.95, cosTheta:0.86,
      cable:'HFCO', cores:1, wiring:'F2', arrangement:'평면', layoutGroup:'F2-4',
      ambientTemp:40, circuits:1, parallels:2,
      starting:'Soft Start 3.0', startMultiplier:3.0, startTime:3.0, startCos:0.3,
      protection:'산업용 2× ACB', protectionType:'ACB-multi',
      peType:'F-GV', peMethod:'calc',
      branchLength:80, dropLimit:3, startDropLimit:13,
      sourceMVA:300, sourceXR:10
    },
    { id:'M7', section:'5.1.13', label:'전동기 3상 초대형 (Inverter, 병렬, ACB)',
      load:'전동기', phase:3, voltage:380, capacity:440, unit:'kW', efficiency:0.95, cosTheta:0.86,
      cable:'HFCO', cores:1, wiring:'F2', arrangement:'평면', layoutGroup:'F2-4',
      ambientTemp:40, circuits:1, parallels:2,
      starting:'Inverter 1.2', startMultiplier:1.2, startTime:3.0, startCos:0.3,
      protection:'산업용 2× ACB', protectionType:'ACB-multi',
      peType:'F-GV', peMethod:'calc',
      branchLength:80, dropLimit:3, startDropLimit:13,
      sourceMVA:300, sourceXR:10
    }
  ],

  //============================================================
  // 2. 케이블 임피던스 표 (90°C 교류저항, Ω/km)
  //    [R, X] 형태. 단상=2선 부하 / 3상=평형부하 기준
  //============================================================
  CABLE_RX: {
    // 표 5-13: HFIX 단도체 (450/750V 절연전선)
    'HFIX_1ph': {
      1.5:[15.4287,0.1284], 2.5:[9.4485,0.1249], 4:[5.8783,0.1172], 6:[3.9274,0.1125],
      10:[2.3336,0.1124], 16:[1.4666,0.1112], 25:[0.9274,0.1116], 35:[0.6687,0.1083],
      50:[0.4942,0.1079], 70:[0.3429,0.1037], 95:[0.2477,0.1039], 120:[0.1972,0.1019],
      150:[0.1607,0.1017], 185:[0.1295,0.1025], 240:[0.1003,0.1018], 300:[0.0819,0.1013]
    },
    // 표 5-13: HFIX 3상 삼각배치
    'HFIX_3ph_삼각': {
      1.5:[15.4287,0.1284], 2.5:[9.4485,0.1249], 4:[5.8783,0.1172], 6:[3.9274,0.1125],
      10:[2.3336,0.1124], 16:[1.4666,0.1112], 25:[0.9274,0.1116], 35:[0.6687,0.1083],
      50:[0.4942,0.1079], 70:[0.3429,0.1037], 95:[0.2477,0.1039], 120:[0.1972,0.1019],
      150:[0.1607,0.1017], 185:[0.1296,0.1025], 240:[0.1003,0.1018], 300:[0.0818,0.1013]
    },
    // 표 5-1: F-CV/CV/CE/TFR-CV 단심 단상 (S=D 평면배치)
    'F-CV_1ph': {
      1.5:[15.4287,0.1923], 2.5:[9.4485,0.1793], 4:[5.8782,0.1668], 6:[3.9274,0.1576],
      10:[2.3335,0.1520], 16:[1.4665,0.1455], 25:[0.9272,0.1421], 35:[0.6685,0.1363],
      50:[0.4939,0.1324], 70:[0.3424,0.1255], 95:[0.2471,0.1250], 120:[0.1964,0.1216],
      150:[0.1597,0.1205], 185:[0.1284,0.1196], 240:[0.0989,0.1179], 300:[0.0800,0.1172],
      400:[0.0641,0.1173], 500:[0.0520,0.1140], 630:[0.0426,0.1134]
    },
    // 표 5-1: F-CV 단심 3상 삼각배치
    'F-CV_3ph_삼각': {
      1.5:[15.4287,0.1749], 2.5:[9.4485,0.1619], 4:[5.8782,0.1494], 6:[3.9274,0.1402],
      10:[2.3335,0.1346], 16:[1.4665,0.1280], 25:[0.9273,0.1246], 35:[0.6686,0.1189],
      50:[0.4940,0.1150], 70:[0.3427,0.1081], 95:[0.2474,0.1076], 120:[0.1968,0.1042],
      150:[0.1603,0.1031], 185:[0.1291,0.1022], 240:[0.0998,0.1004], 300:[0.0811,0.0998],
      400:[0.0655,0.0999], 500:[0.0538,0.0966], 630:[0.0447,0.0960]
    },
    // 표 5-1: F-CV 단심 3상 평면배치 S=D
    'F-CV_3ph_평면': {
      1.5:[15.4287,0.1923], 2.5:[9.4485,0.1793], 4:[5.8782,0.1668], 6:[3.9274,0.1576],
      10:[2.3335,0.1520], 16:[1.4665,0.1455], 25:[0.9272,0.1421], 35:[0.6685,0.1363],
      50:[0.4939,0.1324], 70:[0.3424,0.1255], 95:[0.2471,0.1250], 120:[0.1964,0.1216],
      150:[0.1597,0.1205], 185:[0.1284,0.1196], 240:[0.0989,0.1179], 300:[0.0800,0.1172],
      400:[0.0641,0.1173], 500:[0.0520,0.1140], 630:[0.0426,0.1134]
    },
    // F-CV 다심 4심 3상 (B2 공사방법용)
    'F-CV_3ph_4C': {
      1.5:[15.4287,0.1309], 2.5:[9.4485,0.1227], 4:[5.8783,0.1154], 6:[3.9274,0.1101],
      10:[2.3336,0.1041], 16:[1.4666,0.1012], 25:[0.9274,0.1016], 35:[0.6687,0.0988],
      50:[0.4942,0.0979], 70:[0.3429,0.0965], 95:[0.2477,0.0943], 120:[0.1972,0.0939],
      150:[0.1607,0.0944], 185:[0.1295,0.0949], 240:[0.1003,0.0938], 300:[0.0818,0.0931]
    },
    // F-CV 다심 3심 3상
    'F-CV_3ph_3C': {
      1.5:[15.4287,0.1222], 2.5:[9.4485,0.1140], 4:[5.8783,0.1067], 6:[3.9274,0.1014],
      10:[2.3336,0.0954], 16:[1.4666,0.0925], 25:[0.9274,0.0929], 35:[0.6687,0.0901],
      50:[0.4942,0.0892], 70:[0.3429,0.0878], 95:[0.2477,0.0856], 120:[0.1972,0.0851],
      150:[0.1607,0.0857], 185:[0.1295,0.0862], 240:[0.1003,0.0851], 300:[0.0818,0.0844]
    },
    // F-CV 다심 2심 단상
    'F-CV_1ph_2C': {
      1.5:[15.4287,0.1222], 2.5:[9.4485,0.1140], 4:[5.8783,0.1067], 6:[3.9274,0.1014],
      10:[2.3336,0.0954], 16:[1.4666,0.0925], 25:[0.9274,0.0929], 35:[0.6687,0.0901],
      50:[0.4942,0.0892]
    },
    // 표 5-4: HFCO 단심 — 시스가 두꺼워 단심 평면/삼각 X가 F-CV와 다름.
    //         HFCO 다심(2·3·4심)은 F-CV 다심과 R/X 완전 동일 → F-CV_3ph_3C/4C 재사용.
    'HFCO_3ph_삼각': {
      1.5:[15.4287,0.1929], 2.5:[9.4485,0.1753], 4:[5.8782,0.1662], 6:[3.9274,0.1510],
      10:[2.3335,0.1393], 16:[1.4665,0.1478], 25:[0.9272,0.1363], 35:[0.6685,0.1297],
      50:[0.4940,0.1270], 70:[0.3426,0.1210], 95:[0.2473,0.1172], 120:[0.1967,0.1210],
      150:[0.1602,0.1212], 185:[0.1289,0.1190], 240:[0.0996,0.1178], 300:[0.0811,0.1156],
      400:[0.0655,0.1159], 500:[0.0538,0.0966], 630:[0.0447,0.0960]
    },
    'HFCO_3ph_평면': {
      1.5:[15.4287,0.2104], 2.5:[9.4485,0.1927], 4:[5.8782,0.1836], 6:[3.9273,0.1684],
      10:[2.3335,0.1567], 16:[1.4665,0.1652], 25:[0.9272,0.1537], 35:[0.6684,0.1471],
      50:[0.4939,0.1444], 70:[0.3424,0.1384], 95:[0.2471,0.1346], 120:[0.1963,0.1384],
      150:[0.1597,0.1387], 185:[0.1283,0.1364], 240:[0.0988,0.1352], 300:[0.0800,0.1331],
      400:[0.0641,0.1333], 500:[0.0520,0.1140], 630:[0.0426,0.1134]
    },
    'HFCO_1ph': {
      1.5:[15.4287,0.1929], 2.5:[9.4485,0.1753], 4:[5.8782,0.1662], 6:[3.9274,0.1510],
      10:[2.3335,0.1393], 16:[1.4665,0.1478], 25:[0.9272,0.1363], 35:[0.6685,0.1297],
      50:[0.4940,0.1270], 70:[0.3426,0.1210], 95:[0.2473,0.1172], 120:[0.1967,0.1210],
      150:[0.1601,0.1212], 185:[0.1289,0.1190], 240:[0.0996,0.1178], 300:[0.0812,0.1156]
    },
    // 표 5-7: FR-8/F-FR-8/TFR-8/NFR-8 단심 — 내화 시스로 X가 F-CV와 다름 (M3 검증).
    //         다심(2·3·4심)은 F-CV 다심과 R/X 동일 → F-CV_3ph_3C/4C·F-CV_1ph_2C 재사용.
    'F-FR-8_3ph_삼각': {
      1.5:[15.4287,0.1975], 2.5:[9.4485,0.1841], 4:[5.8782,0.1703], 6:[3.9274,0.1589],
      10:[2.3335,0.1464], 16:[1.4665,0.1418], 25:[0.9272,0.1335], 35:[0.6685,0.1297],
      50:[0.4940,0.1248], 70:[0.3425,0.1190], 95:[0.2472,0.1154], 120:[0.1966,0.1131],
      150:[0.1599,0.1127], 185:[0.1287,0.1110], 240:[0.0993,0.1084], 300:[0.0807,0.1070],
      400:[0.0652,0.1053], 500:[0.0534,0.1043], 630:[0.0447,0.1028]
    },
    'F-FR-8_3ph_평면': {
      1.5:[15.4287,0.2149], 2.5:[9.4485,0.2016], 4:[5.8782,0.1877], 6:[3.9273,0.1764],
      10:[2.3335,0.1639], 16:[1.4665,0.1592], 25:[0.9272,0.1509], 35:[0.6684,0.1471],
      50:[0.4939,0.1422], 70:[0.3423,0.1364], 95:[0.2470,0.1328], 120:[0.1962,0.1305],
      150:[0.1595,0.1301], 185:[0.1282,0.1285], 240:[0.0986,0.1258], 300:[0.0797,0.1244],
      400:[0.0638,0.1227], 500:[0.0515,0.1217], 630:[0.0420,0.1203]
    },
    'F-FR-8_1ph': {
      1.5:[15.4287,0.1975], 2.5:[9.4485,0.1841], 4:[5.8782,0.1703], 6:[3.9274,0.1589],
      10:[2.3335,0.1464], 16:[1.4665,0.1418], 25:[0.9272,0.1335], 35:[0.6685,0.1297],
      50:[0.4940,0.1248], 70:[0.3425,0.1190], 95:[0.2472,0.1154], 120:[0.1966,0.1131],
      150:[0.1599,0.1127], 185:[0.1287,0.1110], 240:[0.0993,0.1084], 300:[0.0807,0.1070],
      400:[0.0652,0.1053], 500:[0.0534,0.1043], 630:[0.0447,0.1028]
    },
    // 표 5-8: F-FR-8 단심 2병렬 도체 (3상 1Core) — Y-Δ 2차 배선 단락계산 등가
    'F-FR-8_3ph_2P': {
      1.5:[7.7144,0.1684], 2.5:[4.7243,0.1618], 4:[2.9391,0.1548], 6:[1.9637,0.1491],
      10:[1.1668,0.1429], 16:[0.7332,0.1406], 25:[0.4636,0.1364], 35:[0.3342,0.1345],
      50:[0.2469,0.1321], 70:[0.1712,0.1292], 95:[0.1235,0.1274], 120:[0.0981,0.1262],
      150:[0.0797,0.1260], 185:[0.0640,0.1252], 240:[0.0492,0.1239], 300:[0.0397,0.1232],
      400:[0.0317,0.1223], 500:[0.0255,0.1218], 630:[0.0206,0.1211]
    }
    // F-FR-8 다심은 F-CV 다심과 동일 (코드에서 alias)
  },

  //============================================================
  // 3. 허용전류표 (표 5-33: XLPE, 표 5-34: PVC)
  //    공사방법별, 30°C 1회선 기준 (A)
  //============================================================
  // 표 5-33 (XLPE 절연 Cu) — pdfplumber 정밀 추출 (PDF p274)
  // 공칭단면적 키 순서: 1.5~300 (F/G는 25 이상만)
  ALLOWABLE_CURRENT: {
    XLPE: {
      // 3상 1Core (3개 부하도체) — 단심 케이블/전선
      '3ph_1C': {
        A1:{1.5:17,2.5:23,4:31,6:40,10:54,16:73,25:95,35:117,50:141,70:179,95:216,120:249,150:285,185:324,240:380,300:435},
        B1:{1.5:20,2.5:28,4:37,6:48,10:66,16:88,25:117,35:144,50:175,70:222,95:269,120:312,150:342,185:384,240:450,300:514},
        C: {1.5:22,2.5:30,4:40,6:52,10:71,16:96,25:119,35:147,50:179,70:229,95:278,120:322,150:371,185:424,240:500,300:576},
        D2:{1.5:21,2.5:28,4:36,6:44,10:58,16:75,25:96,35:115,50:135,70:167,95:197,120:223,150:251,185:281,240:324,300:365},
        F삼각:{25:135,35:169,50:207,70:268,95:328,120:383,150:444,185:510,240:607,300:703,400:823,500:946,630:1088},
        F평면:{25:141,35:176,50:216,70:279,95:342,120:400,150:464,185:533,240:634,300:736,400:868,500:998,630:1151},
        G삼각:{25:182,35:226,50:275,70:353,95:430,120:500,150:577,185:661,240:781,300:902,400:1085,500:1253,630:1454},
        G평면:{25:161,35:201,50:246,70:318,95:389,120:454,150:527,185:605,240:719,300:833,400:1008,500:1169,630:1362}
      },
      // 3상 3Core/4Core (3개 부하도체) — 다심 케이블
      '3ph_3C': {
        A2:{1.5:16.5,2.5:22,4:30,6:38,10:51,16:68,25:89,35:109,50:130,70:164,95:197,120:227,150:259,185:295,240:346,300:396},
        B2:{1.5:19.5,2.5:26,4:35,6:44,10:60,16:80,25:105,35:128,50:154,70:194,95:233,120:268,150:300,185:340,240:398,300:455},
        C: {1.5:22,2.5:30,4:40,6:52,10:71,16:96,25:119,35:147,50:179,70:229,95:278,120:322,150:371,185:424,240:500,300:576},
        D1:{1.5:21,2.5:28,4:36,6:44,10:58,16:75,25:96,35:115,50:135,70:167,95:197,120:223,150:251,185:281,240:324,300:365},
        D2:{1.5:23,2.5:30,4:39,6:49,10:65,16:84,25:107,35:129,50:153,70:188,95:226,120:257,150:287,185:324,240:375,300:419},
        E: {1.5:23,2.5:32,4:42,6:54,10:75,16:100,25:127,35:158,50:192,70:246,95:298,120:346,150:399,185:456,240:538,300:621}
      },
      // 단상 1Core (2개 부하도체) — 단심 케이블/전선
      '1ph_1C': {
        A1:{1.5:19,2.5:26,4:35,6:45,10:61,16:81,25:106,35:131,50:158,70:200,95:241,120:278,150:318,185:362,240:424,300:486},
        B1:{1.5:23,2.5:31,4:42,6:54,10:75,16:100,25:133,35:164,50:198,70:253,95:306,120:354,150:393,185:449,240:528,300:603},
        C: {1.5:24,2.5:33,4:45,6:58,10:80,16:107,25:138,35:171,50:209,70:269,95:328,120:382,150:441,185:506,240:599,300:693},
        D2:{1.5:25,2.5:33,4:43,6:53,10:71,16:91,25:116,35:139,50:164,70:203,95:239,120:271,150:306,185:343,240:395,300:446},
        F: {25:161,35:200,50:242,70:310,95:377,120:437,150:504,185:575,240:679,300:783,400:940,500:1083,630:1254}
      },
      // 단상 2Core (2개 부하도체) — 다심 케이블
      '1ph_2C': {
        A2:{1.5:18.5,2.5:25,4:33,6:42,10:57,16:76,25:99,35:121,50:145,70:183,95:220,120:253,150:290,185:329,240:386,300:442},
        B2:{1.5:22,2.5:30,4:40,6:51,10:69,16:91,25:119,35:146,50:175,70:221,95:265,120:305,150:334,185:384,240:459,300:532},
        C: {1.5:24,2.5:33,4:45,6:58,10:80,16:107,25:138,35:171,50:209,70:269,95:328,120:382,150:441,185:506,240:599,300:693},
        D1:{1.5:25,2.5:33,4:43,6:53,10:71,16:91,25:116,35:139,50:164,70:203,95:239,120:271,150:306,185:343,240:395,300:446},
        D2:{1.5:27,2.5:35,4:46,6:58,10:77,16:100,25:129,35:155,50:183,70:225,95:270,120:306,150:343,185:387,240:448,300:502}
      }
    }
  },

  //============================================================
  // 4. 보정계수 (표 5-35, 5-36)
  //============================================================
  // 주위온도 보정 — XLPE 기중
  AMBIENT_TEMP: {
    XLPE: {10:1.15,15:1.12,20:1.08,25:1.04,30:1.00,35:0.96,40:0.91,45:0.87,50:0.82,55:0.76,60:0.71,65:0.65,70:0.58,75:0.50,80:0.41},
    PVC:  {10:1.22,15:1.17,20:1.12,25:1.06,30:1.00,35:0.94,40:0.87,45:0.79,50:0.71,55:0.61,60:0.50}
  },
  // 복수회로 저감계수 (배치방법별 회선수)
  GROUP_REDUCTION: {
    'A1-1':[1.00,0.80,0.70,0.65,0.60,0.57,0.54,0.52,0.50,0.50,0.50,0.45,0.45,0.45,0.45,0.45,0.41,0.41,0.41,0.41],
    'A2-1':[1.00,0.80,0.70,0.65,0.60,0.57,0.54,0.52,0.50,0.50,0.50,0.45,0.45,0.45,0.45,0.45,0.41,0.41,0.41,0.41],
    'B1-1':[1.00,0.80,0.70,0.65,0.60,0.57,0.54,0.52,0.50,0.50,0.50,0.45,0.45,0.45,0.45,0.45,0.41,0.41,0.41,0.41],
    'B2-1':[1.00,0.80,0.70,0.65,0.60,0.57,0.54,0.52,0.50,0.50,0.50,0.45,0.45,0.45,0.45,0.45,0.41,0.41,0.41,0.41],
    'C-2': [1.00,0.85,0.79,0.75,0.73,0.72,0.72,0.71,0.70,0.70,0.70,0.70,0.70,0.70,0.70,0.70,0.70,0.70,0.70,0.70],
    'C-3': [0.95,0.81,0.72,0.68,0.66,0.64,0.63,0.62,0.61,0.61,0.61,0.61,0.61,0.61,0.61,0.61,0.61,0.61,0.61,0.61],
    'E-4': [1.00,0.88,0.82,0.77,0.75,0.73,0.73,0.72,0.72,0.72,0.72,0.72,0.72,0.72,0.72,0.72,0.72,0.72,0.72,0.72],
    'E-5': [1.00,0.87,0.82,0.80,0.80,0.79,0.79,0.78,0.78,0.78,0.78,0.78,0.78,0.78,0.78,0.78,0.78,0.78,0.78,0.78],
    'F-4': [1.00,0.88,0.82,0.77,0.75,0.73,0.73,0.72,0.72,0.72,0.72,0.72,0.72,0.72,0.72,0.72,0.72,0.72,0.72,0.72],
    'F-5': [1.00,0.87,0.82,0.80,0.80,0.79,0.79,0.78,0.78,0.78,0.78,0.78,0.78,0.78,0.78,0.78,0.78,0.78,0.78,0.78],
    'F1-4':[1.00,0.88,0.82,0.77,0.75,0.73,0.73,0.72,0.72,0.72,0.72,0.72,0.72,0.72,0.72,0.72,0.72,0.72,0.72,0.72],
    'F2-4':[1.00,0.88,0.82,0.77,0.75,0.73,0.73,0.72,0.72,0.72,0.72,0.72,0.72,0.72,0.72,0.72,0.72,0.72,0.72,0.72],
    'D1-A':[1.00,0.85,0.75,0.70,0.65,0.60,0.57,0.54,0.52,0.50,0.50,0.45,0.45,0.45,0.45,0.45,0.39,0.39,0.39,0.39],
    'D1-B':[1.00,0.80,0.70,0.65,0.60,0.60,0.53,0.50,0.47,0.47,0.47,0.41,0.41,0.41,0.41,0.41,0.34,0.34,0.34,0.34],
    'D2-1':[1.00,0.75,0.65,0.60,0.55,0.50,0.45,0.43,0.41,0.41,0.41,0.36,0.36,0.36,0.36,0.36,0.32,0.32,0.32,0.32]
  },

  //============================================================
  // 5. 보호장치 정격 (표 5-37)
  //============================================================
  PROTECTION: {
    'MCB-house': {
      In: [6,8,10,13,16,20,25,32,40,50,63,80,100,125],
      Icu_kA: [1,1.25,1.5,1.6,2,2.5,3,3.15,4,4.5,5,6,6.3,8,10,12.5,16,20,25]
    },
    MCCB: {
      In: [6,8,10,13,16,20,25,32,40,50,63,80,100,125,160,200,250,320,400,500,630,800,1000,1250,1600,2000,2500,3200],
      Icu_kA: [1,1.25,1.6,2,2.5,3.15,4,5,6.3,8,10,12.5,16,20,25,31.5,40,50,63,80,100,125,160,200]
    },
    ACB: {
      In: [200,400,630,800,1000,1250,1600,2000,2500,3200,4000,5000,6300],
      Icu_kA: [31.5,40,50,63,80,100,125,160,200,250]
    },
    FUSE: {
      In: [2,4,6,8,10,12,16,20,25,32,40,50,63,80,100,125,160,200,250,315,400,500,630,800,1000,1250]
    }
  },

  //============================================================
  // 6. 단락 K값 (표 3-13)
  //============================================================
  K_SHORT: {
    line: { XLPE:143, PVC_le300:115, PVC_gt300:103, HFIX:143, HFCO:143, 'F-FR-8':143, 'TFR-CV':143, 'F-CV':143 },
    pe:   { XLPE:176, PVC_le300:143, PVC_gt300:133 }
  },

  //============================================================
  // 7. 전압계수 (표 3-10)
  //============================================================
  VOLTAGE_FACTOR: { Cmax:1.1, Cmin:0.95 },

  //============================================================
  // 8. 도체 물성
  //============================================================
  CONDUCTOR: { alpha:0.00393, T_op:90, T_ref:20, T_sc:250 },

  //============================================================
  // 9. 표준 공칭단면적
  //============================================================
  STANDARD_SIZES: [1.5,2.5,4,6,10,16,25,35,50,70,95,120,150,185,240,300,400,500,630],

  //============================================================
  // 10. 전동기 기동방식별 전압강하 계수 / 전류배율 가이드
  //============================================================
  // startTime: 기동방식별 기동시간(차단기가 기동전류를 트립 없이 견뎌야 하는 시간) 기본값[s]
  //   직입 2 / Y-Δ 5 / Soft Start 10 / Inverter 10 (사용자 지정),
  //   리액터·기동보상 10 (모터 기동용 리액터 단시간정격 10s~ / 기동보상기 통상 8~10s)
  STARTING: {
    '전전압':       { currentRatio:1.0,  startCosDefault:0.15, startTime:2 },
    'Y-Δ':          { currentRatio:0.33, startCosDefault:0.2,  startTime:5 },
    '리액터 50%':   { currentRatio:0.5,  startCosDefault:0.2,  startTime:10 },
    '리액터 65%':   { currentRatio:0.65, startCosDefault:0.2,  startTime:10 },
    '리액터 80%':   { currentRatio:0.8,  startCosDefault:0.2,  startTime:10 },
    '기동보상 50%': { currentRatio:0.25, startCosDefault:0.2,  startTime:10 },
    '기동보상 65%': { currentRatio:0.42, startCosDefault:0.2,  startTime:10 },
    '기동보상 80%': { currentRatio:0.64, startCosDefault:0.2,  startTime:10 },
    'Soft Start 3.0':{ currentRatio:3.0/6.0, startCosDefault:0.3, startTime:10 },
    'Soft Start 3.5':{ currentRatio:3.5/6.0, startCosDefault:0.3, startTime:10 },
    'Soft Start 4.0':{ currentRatio:4.0/6.0, startCosDefault:0.3, startTime:10 },
    'Soft Start 5.0':{ currentRatio:5.0/6.0, startCosDefault:0.3, startTime:10 },
    'Inverter 1.0': { currentRatio:1.0/6.0, startCosDefault:0.3, startTime:10 },
    'Inverter 1.1': { currentRatio:1.1/6.0, startCosDefault:0.3, startTime:10 },
    'Inverter 1.2': { currentRatio:1.2/6.0, startCosDefault:0.3, startTime:10 },
    'Inverter 1.5': { currentRatio:1.5/6.0, startCosDefault:0.3, startTime:10 },
    'Inverter 2.0': { currentRatio:2.0/6.0, startCosDefault:0.3, startTime:10 }
  },

  //============================================================
  // 11. 케이블 종류 메타데이터 (분류용)
  //============================================================
  CABLE_INFO: {
    'HFIX':   { insulation:'XLPE', voltage:'450/750V', type:'절연전선',  desc:'저독성 난연 가교 폴리올레핀 절연전선 (KS C 3341)', wiring:['A1','A2'] },
    'HFIO':   { insulation:'PE',   voltage:'450/750V', type:'절연전선',  desc:'저독성 난연 폴리올레핀 절연전선', wiring:['A1','A2'] },
    'IV':     { insulation:'PVC',  voltage:'450/750V', type:'절연전선',  desc:'비닐절연전선 (KS C IEC 60227-3)', wiring:['A1','A2'] },
    'CV':     { insulation:'XLPE', voltage:'0.6/1kV',  type:'케이블',    desc:'가교 폴리에틸렌 절연 비닐시스 케이블', wiring:['B1','B2','C','D1','D2'] },
    'F-CV':   { insulation:'XLPE', voltage:'0.6/1kV',  type:'트레이용',  desc:'가교 폴리에틸렌 절연 난연 비닐시스 트레이용', wiring:['B1','B2','C','D1','D2','E','F1','F2'] },
    'TFR-CV': { insulation:'XLPE', voltage:'0.6/1kV',  type:'트레이용',  desc:'가교 폴리에틸렌 절연 난연 비닐시스 트레이용', wiring:['B1','B2','C','D1','D2','E','F1','F2'] },
    'HFCO':   { insulation:'XLPE', voltage:'0.6/1kV',  type:'트레이용 저독성', desc:'가교폴리에틸렌절연 저독성 난연 폴리올레핀 시스 트레이용', wiring:['B1','B2','C','D1','D2','E','F1','F2'] },
    'F-FR-8': { insulation:'XLPE', voltage:'0.6/1kV',  type:'내화',      desc:'가교 폴리에틸렌 절연 난연 비닐 시스 트레이용 내화케이블', wiring:['B1','B2','C','D1','D2','E','F1','F2'] },
    'TFR-8':  { insulation:'XLPE', voltage:'0.6/1kV',  type:'내화',      desc:'가교 폴리에틸렌 절연 난연 비닐 시스 트레이용 내화케이블', wiring:['B1','B2','C','D1','D2','E','F1','F2'] },
    'NFR-8':  { insulation:'XLPE', voltage:'0.6/1kV',  type:'내화 저독성', desc:'가교폴리에틸렌 절연 저독성 난연 폴리올레핀 시스 트레이용 난연 내화', wiring:['B1','B2','C','D1','D2','E','F1','F2'] },
    'VV':     { insulation:'PVC',  voltage:'0.6/1kV',  type:'케이블',    desc:'비닐절연 비닐시스 케이블', wiring:['B1','B2','C','D1','D2'] },
    'BD-CU':  { insulation:'기타', voltage:'0.6/1kV',  type:'BUS DUCT',  desc:'도체 Cu 버스덕트', wiring:[] },
    'BD-AL':  { insulation:'기타', voltage:'0.6/1kV',  type:'BUS DUCT',  desc:'도체 Al 버스덕트', wiring:[] }
  },

  //============================================================
  // 12. 공사방법 메타데이터
  //============================================================
  WIRING_METHOD: {
    A1: { desc:'단열벽 속 전선관 - 절연전선 또는 단심케이블', cores:'단심',   typicalCable:['HFIX','HFIO','IV'] },
    A2: { desc:'단열벽 속 전선관 - 다심케이블',               cores:'다심',   typicalCable:['F-CV','HFCO','VV'] },
    B1: { desc:'벽면 고정 전선관 - 단심케이블',               cores:'단심',   typicalCable:['F-CV','HFCO','F-FR-8','TFR-CV'] },
    B2: { desc:'벽면 고정 전선관 - 다심케이블',               cores:'다심',   typicalCable:['F-CV','HFCO','VV'] },
    C:  { desc:'벽/천장면 직접 고정 - 단심 또는 다심',         cores:'양쪽',   typicalCable:['F-CV','HFCO'] },
    D1: { desc:'지중매설 전선관 또는 덕트 - 다심',             cores:'다심',   typicalCable:['F-CV','HFCO','VV'] },
    D2: { desc:'지중 직접 매설 - 단심 또는 다심',              cores:'양쪽',   typicalCable:['F-CV','HFCO'] },
    E:  { desc:'천공형 트레이/래더 - 다심케이블',              cores:'다심',   typicalCable:['F-CV','HFCO','F-FR-8','NFR-8'] },
    F1: { desc:'천공형 트레이 단심 - 삼각배치',                cores:'단심',   typicalCable:['F-CV','TFR-CV','HFCO','F-FR-8'] },
    F2: { desc:'천공형 트레이 단심 - 평면배치(S=d 또는 S=2d)', cores:'단심',   typicalCable:['F-CV','TFR-CV','HFCO','F-FR-8'] },
    G:  { desc:'자유공기 중 단심 이격',                       cores:'단심',   typicalCable:['F-CV','HFCO'] }
  }
};

// 헬퍼 함수
window.KEC_DATA.helpers = {
  /** 표준 공칭단면적 중 req 이상의 가장 작은 값 */
  nextSize(req){
    for (const s of window.KEC_DATA.STANDARD_SIZES) if (s >= req) return s;
    return window.KEC_DATA.STANDARD_SIZES.at(-1);
  },
  /** 보호장치 In 표에서 IB 이상의 가장 작은 값 */
  nextIn(type, IB){
    const arr = window.KEC_DATA.PROTECTION[type]?.In || [];
    for (const v of arr) if (v >= IB) return v;
    return arr.at(-1);
  },
  /** 차단전류 Icu 표에서 req(kA) 이상의 가장 작은 값 */
  nextIcu(type, req_kA){
    const arr = window.KEC_DATA.PROTECTION[type]?.Icu_kA || [];
    for (const v of arr) if (v >= req_kA) return v;
    return arr.at(-1);
  },
  /** 케이블 + 전기방식 + 심선수 → R/X 키 결정 */
  cableKey(cable, phase, cores, arrangement){
    if (cable === 'HFIX' || cable === 'HFIO' || cable === 'IV'){
      if (phase === 1) return 'HFIX_1ph';
      return 'HFIX_3ph_삼각';
    }
    if (cable === 'F-FR-8' || cable === 'TFR-8' || cable === 'NFR-8'){
      if (cores === 1){
        if (phase === 1) return 'F-FR-8_1ph';
        return arrangement === '삼각' ? 'F-FR-8_3ph_삼각' : 'F-FR-8_3ph_평면';
      }
    }
    if (phase === 1) {
      return cores >= 2 ? 'F-CV_1ph_2C' : 'F-CV_1ph';
    }
    if (cores === 1) return arrangement === '삼각' ? 'F-CV_3ph_삼각' : 'F-CV_3ph_평면';
    if (cores === 3) return 'F-CV_3ph_3C';
    return 'F-CV_3ph_4C';
  },
  /** 단심 2병렬 도체 R/X 키 (Y-Δ 2차 배선 단락 등가). 표 미보유 시 null */
  cableKey2P(cable){
    if (cable === 'F-FR-8' || cable === 'TFR-8' || cable === 'NFR-8') return 'F-FR-8_3ph_2P';
    return null;
  }
};

if (typeof module !== 'undefined') module.exports = window.KEC_DATA;

//============================================================
// 7. 단락보호용 보호장치 동작시간 t_n (특성곡선 수치화, 2026-10-28)
//   - MCCB(ABN/EBN, 3~800A): 제조사 카탈로그 곡선(그림)의 '최대값' 곡선을 픽셀 판독해 수치화한 근사값 (판독 오차 있음)
//   - thermal: [배수 δ=I/In, 최대 동작시간 s] (log-log 보간) / xM: 순시 상한 배수 / tail: δ≥xM 구간 최대전차단시간
//============================================================
window.KEC_DATA.MCCB_CURVE = {
  ranges: {
    '3-32A': { label:'3~32A', xM:14.4, thermal:[[1.2, 13794.336], [1.3, 7516.243], [1.5, 1671.264], [2, 248.217], [3, 88.501], [4, 47.463], [5, 30.387], [6, 22.032], [7, 17.241], [8, 14.101], [9, 11.051], [10, 9.784], [11, 8.151], [12, 7.165], [13, 6.436], [14, 5.766], [15, 5.189], [17, 4.132], [20, 3.002], [22.5, 2.309], [26, 1.323]], tail:[[14.4, 0.03], [28.8, 0.0217], [43.2, 0.0147], [72.0, 0.0132], [100.0, 0.0124]] },
    '40-100A': { label:'40~100A', xM:14.4, thermal:[[1.2, 9319.337], [1.3, 4233.513], [1.5, 726.849], [2, 240.351], [3, 88.434], [4, 46.659], [5, 29.456], [6, 21.658], [7, 16.617], [8, 12.63], [9, 9.949], [10, 7.607], [11, 6.148], [12, 4.743], [13, 3.444], [14, 2.204], [14.39, 1.893]], tail:[[14.4, 0.03], [16.56, 0.0266], [20.16, 0.0173], [28.8, 0.0159], [43.2, 0.0146], [72.0, 0.0129], [100.0, 0.012]] },
    '100-225A': { label:'100~225A', xM:14.2, thermal:[[1.2, 10434.562], [1.3, 3158.45], [1.5, 943.004], [2, 314.958], [3, 112.81], [4, 56.333], [5, 32.834], [6, 22.235], [7, 16.281], [8, 11.887], [9, 8.97], [10, 6.64], [11, 4.616], [12, 3.04], [13, 1.828], [14.19, 0.904]], tail:[[14.2, 0.03], [16.33, 0.0171], [19.88, 0.015], [28.4, 0.0147], [42.6, 0.0144], [71.0, 0.0137], [100.0, 0.0134]] },
    '250-400A': { label:'250~400A', xM:12.0, thermal:[[1.2, 9295.575], [1.3, 4194.175], [1.5, 1855.498], [2, 640.287], [3, 204.369], [4, 102.756], [5, 60.596], [6, 41.884], [7, 30.381], [8, 23.571], [9, 18.915], [10, 14.581], [11, 10.366], [11.99, 6.84]], tail:[[12.0, 0.03], [13.8, 0.0136], [16.8, 0.0136], [24.0, 0.0127], [36.0, 0.0122], [60.0, 0.0118], [100.0, 0.0112]] },
    '500-800A': { label:'500~800A', xM:12.0, thermal:[[1.2, 11827.485], [1.3, 4567.753], [1.5, 1971.878], [2, 684.038], [3, 244.424], [4, 139.218], [5, 91.162], [6, 62.031], [7, 46.57], [8, 35.535], [9, 26.632], [10, 20.81], [11, 17.151], [11.99, 13.397]], tail:[[12.0, 0.03], [13.8, 0.0202], [16.8, 0.016], [24.0, 0.013], [36.0, 0.0125], [60.0, 0.0119], [100.0, 0.0114]] }
  },
  // 3~32A 15A 이상은 순시 400A±20% → 상한 배수 = 480/In (3~10A는 14.4배)
  rangeOf(In){
    if (In <= 32) return '3-32A';
    if (In <= 100) return '40-100A';
    if (In <= 225) return '100-225A';
    if (In <= 400) return '250-400A';
    if (In <= 800) return '500-800A';
    return null;
  }
};

// 주택용 MCB(IEC 60898-1, 30 ℃) 최대값 곡선 수치화: B(순시 3~5배) / C(5~10배) / D(10~20배)
// thermal: 최대값 곡선 [배수, 최대 동작시간 s], xv: 순시 상한 배수(곡선이 수직으로 떨어지는 지점), 순시 영역 최대전차단시간 0.02 s
window.KEC_DATA.MCB_CURVE = {
  thermal: [[1.5,1425],[1.6,728],[1.8,332],[2,186],[2.5,72],[3,37.7],[3.5,24.3],[4,16.8],[4.5,12.4],[5,9.86],[6,6.81],[7,5.28],[8,4.29],[9,3.65],[10,3.17],[12,2.46],[15,1.95],[18,1.62],[20,1.48]],
  xv: {B:5, C:10, D:20},
  tInst: 0.02
};
(function(){
  const D = window.KEC_DATA;
  function interp(pts, x){   // log-log 보간 (범위 밖은 끝점 연장)
    if (x <= pts[0][0]) return pts[0][1];
    for (let i = 1; i < pts.length; i++){
      if (x <= pts[i][0]){
        const [x0,y0] = pts[i-1], [x1,y1] = pts[i];
        const f = (Math.log(x)-Math.log(x0))/(Math.log(x1)-Math.log(x0));
        return Math.exp(Math.log(y0)+f*(Math.log(y1)-Math.log(y0)));
      }
    }
    const [xa,ya] = pts[pts.length-2], [xb,yb] = pts[pts.length-1];
    const s = (Math.log(yb)-Math.log(ya))/(Math.log(xb)-Math.log(xa));
    return Math.exp(Math.log(yb)+s*(Math.log(x)-Math.log(xb)));
  }
  const nf = (v,d) => Number(v).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d,useGrouping:false});
  const sig = v => v >= 1 ? nf(v,2) : (v >= 0.1 ? nf(v,2) : nf(v,3));


  // 곡선 이미지 보정값: file, 원본 크기, x(1배)·x(100배) 픽셀, y(240분)·y(0.01s) 픽셀
  const CIMG = {
    '3-32A':   {f:'curve/MCCB_3-32A.png',   w:720, h:960, x1:140,   x2:701,   yt:18,   yb:883},
    '40-100A': {f:'curve/MCCB_40-100A.png', w:720, h:960, x1:135,   x2:694,   yt:21,   yb:881},
    '100-225A':{f:'curve/MCCB_100-225A.png',w:720, h:960, x1:138,   x2:700,   yt:19,   yb:876},
    '250-400A':{f:'curve/MCCB_250-400A.png',w:720, h:960, x1:130,   x2:696.5, yt:13,   yb:886},
    '500-800A':{f:'curve/MCCB_500-800A.png',w:630, h:873, x1:112.5, x2:615,   yt:17.5, yb:790.5},
    'MCB':     {f:'curve/MCB_IEC60898.png', w:523, h:708, x1:109,   x2:507,   yt:35,   yb:648}
  };
  function curveImg(key, label, delta, tn, W0, cap){
    const c = CIMG[key], W = W0 || 300, k = W/c.w, H = Math.round(c.h*k);
    const dx = (c.x2-c.x1)/2, dy = (c.yb-c.yt)/Math.log10(14400/0.01);
    let ov = '';
    if (delta >= 1 && delta <= 100 && tn != null && tn >= 0.01){
      const px = (c.x1 + dx*Math.log10(delta))*k, py = (c.yb - dy*Math.log10(tn/0.01))*k;
      const top = c.yt*k, bot = c.yb*k, left = c.x1*k;
      ov = '<div style="position:absolute;left:'+px.toFixed(1)+'px;top:'+top.toFixed(1)+'px;height:'+(bot-top).toFixed(1)+'px;border-left:1.5px dashed #e00000"></div>' +
           '<div style="position:absolute;left:'+left.toFixed(1)+'px;top:'+py.toFixed(1)+'px;width:'+(px-left).toFixed(1)+'px;border-top:1.5px dashed #e00000"></div>' +
           '<div style="position:absolute;left:'+(px-4).toFixed(1)+'px;top:'+(py-4).toFixed(1)+'px;width:8px;height:8px;border-radius:50%;background:#e00000"></div>';
    }
    return '<div style="text-align:center;margin:6px 0"><div style="position:relative;display:inline-block;width:'+W+'px;height:'+H+'px;line-height:0">' +
           '<img src="'+c.f+'" width="'+W+'" height="'+H+'" alt="'+label+'" style="display:block">' + ov + '</div>' +
           '<div style="font-size:9px;color:#6b7280;line-height:1.4">그림. ' + label + (cap ? ' — ' + cap : ' — 붉은 점선: 차단배율 δ = ' + nf(delta,1) + ', t<sub>n</sub> ≈ ' + sig(tn) + ' s') +
           (key === 'MCB' ? '' : '<br>※ 그림의 색상 표시(소프트스타터·Y-Δ·직입)는 카탈로그 원본의 기동시간 참고 표기') + '</div></div>';
  }

  /** 규약동작배율 γ 확인용 곡선 그림 — 최소동작시간 t_min 과 γ 의 교점 표시 (과부하·기동전류 기준). ACB 등 곡선 이미지가 없으면 '' */
  D.helpers.gammaFig = function(type, In, gamma, tmin, W, curve){
    let key = null, label = '';
    if (type === 'MCCB' && D.MCCB_CURVE.rangeOf(In)) { key = D.MCCB_CURVE.rangeOf(In); label = 'MCCB 동작특성곡선 ' + D.MCCB_CURVE.ranges[key].label + ' (제조사 카탈로그)'; }
    else if (type === 'MCB-house') { key = 'MCB'; label = '주택용 MCB 동작특성곡선 (IEC 60898-1, Type-' + (curve||'C').toUpperCase() + ')'; }
    if (!key || !CIMG[key]) return '';
    return curveImg(key, label, gamma, tmin, W,
      '붉은 점선: 최소동작시간 t<sub>min</sub> = ' + nf(tmin,1) + ' s 와 곡선 교점 아래측(하한 곡선) 전류배율 γ = ' + nf(gamma,2) + ' 배 — 곡선에서 γ 확인');
  };

  /** 단락보호 동작시간 t_n 산정. 반환 {tn, region, src}  (tn=null 이면 산정 불가) */
  D.helpers.tnShort = function(type, In, delta, curve){
    if (type === 'MCCB'){
      const key = D.MCCB_CURVE.rangeOf(In);
      if (!key) return {tn:null, region:'-', src:'In 800A 초과: 제조사 곡선 확인 필요'};
      const R = D.MCCB_CURVE.ranges[key];
      let xM = R.xM;
      if (key === '3-32A' && In >= 15) xM = 480/In;       // 순시 400A ±20% 상한
      const name = '산업용 MCCB 특성곡선 ' + R.label + ' 최대값 곡선';
      if (delta >= xM){
        return {tn: interp(R.tail, Math.min(delta,100)), region:'순시 트립 영역 (δ ≥ ' + nf(xM,1) + ')', src:name + ' 순시·최대전차단시간'};
      }
      return {tn: interp(R.thermal, Math.max(delta,1.2)), region:'반한시(열동) 영역 (δ < ' + nf(xM,1) + ')', src:name + ' 판독', reading:true};
    }
    if (type === 'MCB-house'){
      const c = (curve||'C').toUpperCase(), M = D.MCB_CURVE;
      const up = M.xv[c] || 10;
      if (delta >= up) return {tn:M.tInst, region:'순시 영역 (δ ≥ ' + up + ', Type-' + c + ')', src:'MCB 동작특성곡선(IEC 60898-1, 30 ℃) 최대전차단시간 0.02 s'};
      return {tn: interp(M.thermal, Math.max(delta,1.5)), region:'반한시(열동) 영역 (δ < ' + up + ', Type-' + c + ')', src:'MCB 동작특성곡선(IEC 60898-1, 30 ℃) 최대값 곡선 판독', reading:true};
    }
    if (type === 'ACB') return {tn:0.1, region:'단시간/순시 설정 가정', src:'ACB 설정값 가정 0.1 s (제조사 곡선·협조 설정 확인)', assumed:true};
    return {tn:null, region:'-', src:'제조사 특성곡선 확인 필요'};
  };

  /** 단락보호 평가(서적 절차: 종류→In→I_F2min→차단배율→t_n→t_z→판정). o:{type,name,In,IF2,Seff,Np,K,curve}
   *  반환 {delta,tz,tn,ok,html} */
  D.helpers.shortProt = function(o){
    const delta = o.IF2/o.In;
    const tz = Math.pow(o.Seff*o.K/o.IF2, 2);
    let t = D.helpers.tnShort(o.type, o.In, delta, o.curve);
    // 서적 판독값(선택): 책이 순시 구간으로 보는 배율(dMin) 이상이면 책의 곡선 판독값을 적용 (o.tnBook = {dMin, tn, src})
    if (o.tnBook && t.reading && delta >= o.tnBook.dMin) t = {tn:o.tnBook.tn, region:'순시 영역 (δ ≥ ' + o.tnBook.dMin + ', 서적 판독)', src:o.tnBook.src};
    const ok = t.tn != null && t.tn < tz;
    const Sx = o.Np && o.Np > 1 ? (o.Seff/o.Np) + '\\times' + o.Np : String(o.Seff);
    const tnTxt = t.tn == null ? '(곡선 확인 필요)' : '$t_n \\approx ' + sig(t.tn) + '$ s';
    const judge = t.tn == null
      ? '<span class="judge-no">특성곡선 확인 필요</span>'
      : '$t_n(' + sig(t.tn) + ') ' + (ok ? '<' : '\\ge') + ' t_z(' + sig(tz) + ')$ — <span class="' + (ok ? 'judge-ok' : 'judge-no') + '">' + (ok ? '적정' : '부적정') + '</span>';
    const html =
      '<div class="sh2">' + (o.title || '단락 보호 평가') + '</div>' +
      '<div>가. 보호장치: ' + (o.name || o.type) + ', 정격전류 $I_n = ' + o.In + '$ A</div>' +
      '<div>나. 최소 단락전류(F2, 도체 250 ℃): $I_{F2,min} = ' + nf(o.IF2,0) + '$ A</div>' +
      '<div>다. 차단배율: $$\\delta = \\frac{I_{F2,min}}{I_n} = \\frac{' + nf(o.IF2,0) + '}{' + o.In + '} = ' + nf(delta,1) + '$$</div>' +
      '<div>라. 보호장치 동작시간 ' + tnTxt + ' — ' + t.region + '<br><span style="color:#6b7280">근거: ' + t.src + '</span></div>' +
      (!(t.reading || o.showImg) ? '' : o.type === 'MCCB' && D.MCCB_CURVE.rangeOf(o.In) ? curveImg(D.MCCB_CURVE.rangeOf(o.In), 'MCCB 동작특성곡선 ' + D.MCCB_CURVE.ranges[D.MCCB_CURVE.rangeOf(o.In)].label + ' (제조사 카탈로그)', delta, t.tn, o.imgW) : (o.type === 'MCB-house' ? curveImg('MCB', '주택용 MCB 동작특성곡선 (IEC 60898-1, Type-' + (o.curve||'C').toUpperCase() + ' 순시영역 표시)', delta, t.tn, o.imgW) : '')) +
      '<div>마. 케이블 단락 허용시간: $$t_z = \\left(\\frac{' + Sx + ' \\times ' + o.K + '}{' + nf(o.IF2,0) + '}\\right)^2 = ' + sig(tz) + '\\text{ s}$$</div>' +
      '<div>바. 판정: ' + judge + '</div>';
    return {delta:delta, tz:tz, tn:t.tn, ok:ok, region:t.region, src:t.src, html:html};
  };
})();

//============================================================
// 8. 핵심 판정 박스 (과부하 보호 2대 조건) — 결과 화면/산출근거 최종 결과 상단 강조용
//   ① I_B ≤ I_n ≤ I_z   ② I_2 ≤ 1.45·I_z   (KEC 212.4.1)
//============================================================
(function(){
  const H = window.KEC_DATA.helpers;
  const nf = (v,d) => Number(v).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d,useGrouping:false});
  /** o:{IB,In,Iz,I2,Iz145}  반환 HTML 문자열 (MathJax 불필요) */
  H.keyJudge = function(o){
    const ok1 = o.IB <= o.In && o.In <= o.Iz;
    const ok2 = o.I2 <= o.Iz145;
    const k = o.In > 0 ? o.I2/o.In : 1.45;
    const col = ok => ok ? '#067647' : '#b42318';
    const bg  = ok => ok ? '#ecfdf3' : '#fef3f2';
    const badge = ok => '<span style="display:inline-block;padding:1px 10px;border-radius:12px;color:#fff;background:'+col(ok)+';font-weight:bold;font-size:12px;margin-left:8px;white-space:nowrap">'+(ok?'적정':'부적정')+'</span>';
    const sub = s => '<sub>'+s+'</sub>';
    const num = (s,c) => '<span style="color:'+c+'">'+s+'</span>';
    let why1 = '';
    if (!ok1){
      if (o.IB > o.In) why1 += '<div style="color:#b42318;font-size:12px;margin-top:3px">▶ I'+sub('n')+' 값이 I'+sub('B')+' 값 미만이므로 부적정합니다.</div>';
      if (o.In > o.Iz) why1 += '<div style="color:#b42318;font-size:12px;margin-top:3px">▶ I'+sub('z')+' 값이 I'+sub('n')+' 값 미만이므로 부적정합니다.</div>';
    }
    const why2 = ok2 ? '' : '<div style="color:#b42318;font-size:12px;margin-top:3px">▶ I'+sub('2')+' 값이 1.45I'+sub('z')+' 값을 초과하므로 부적정합니다.</div>';
    const row = (ok, title, line, why) =>
      '<div style="border:2px solid '+col(ok)+';background:'+bg(ok)+';border-radius:6px;padding:7px 12px;margin:6px 0">' +
      '<div style="font-size:11px;color:#475467;margin-bottom:2px">'+title+'</div>' +
      '<div style="font-size:15px;font-weight:bold;line-height:1.5;color:#1d4ed8">'+line+badge(ok)+'</div>'+why+'</div>';
    if (o.noI2){   // MCB 등 I2=1.45·In 인 경우: ①을 만족하면 ②는 자동 충족 → 별도 박스 생략, 안내 문구만
      return '<div class="keyj" style="margin:10px 0">' +
        row(ok1, '① 부하전류 I'+sub('B')+' ≤ 차단기 정격전류 I'+sub('n')+' ≤ 선도체 허용전류 I'+sub('z')+'  (KEC 212.4.1)',
          'I'+sub('B')+' '+nf(o.IB,2)+' A ≤ I'+sub('n')+' '+nf(o.In,0)+' A ≤ I'+sub('z')+' '+nf(o.Iz,2)+' A', why1) +
        '<div style="font-size:11px;color:#6b7280;margin:2px 2px 0">※ 차단기 규약 동작전류 I'+sub('2')+' = 1.45·I'+sub('n')+' 이므로, ①(I'+sub('n')+' ≤ I'+sub('z')+')을 만족하면 I'+sub('2')+' ≤ 1.45·I'+sub('z')+'는 자동으로 충족되어 별도 판정을 생략합니다.</div></div>';
    }
    return '<div class="keyj" style="margin:10px 0">' +
      row(ok1, '① 부하전류 I'+sub('B')+' ≤ 차단기 정격전류 I'+sub('n')+' ≤ 선도체 허용전류 I'+sub('z')+'  (KEC 212.4.1)',
        'I'+sub('B')+' '+nf(o.IB,2)+' A ≤ I'+sub('n')+' '+nf(o.In,0)+' A ≤ I'+sub('z')+' '+nf(o.Iz,2)+' A', why1) +
      row(ok2, '② 차단기 규약 동작전류 I'+sub('2')+' ≤ 1.45 × 허용전류 I'+sub('z')+'  (KEC 212.4.1)',
        'I'+sub('2')+' ('+nf(k,2).replace(/\.?0+$/,'')+'×'+nf(o.In,0)+') '+nf(o.I2,2)+' A ≤ 1.45I'+sub('z')+' '+nf(o.Iz145,2)+' A', why2) +
      '</div>';
  };
})();

//============================================================
// 9. 보호장치 규약동작전류 계수 (표 5-18)  I2 = k·In
//   주택용(MCB): 63A 이하 1.45 / 63A 초과 1.52
//   산업용(MCCB·ACB): 63A 이하 1.3 / 63A 초과 1.37
//============================================================
(function(){
  window.KEC_DATA.helpers.i2k = function(type, In){
    const house = /^MCB/.test(String(type||''));
    return house ? (In <= 63 ? 1.45 : 1.52) : (In <= 63 ? 1.3 : 1.37);
  };
})();
