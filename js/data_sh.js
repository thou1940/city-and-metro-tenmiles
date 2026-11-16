'use strict';
// 上海 · 1990 场景。地理来自 OpenStreetMap（geo_sh_outer.js，现代数据），本文件补充 1990 年起的区域开放（按街道与区划分）、越江桥隧与高架道路通车年份、
// 人口就业中心、地标、重要设施、历史事件、本地任务与人民币经营参数。坐标单位为格（250 m），用 ll(纬度, 经度) 换算。
// 真实性：浦东开发开放、陆家嘴开发、越江桥隧与高架通车年份、地标落成年份、世博会与虹桥枢纽为史实参考；1990 年人口与就业分布、增长曲线、造价、票价与拨款为估算；2020 年之后为模拟。
(function (CM) {
  const G = CM.GEO_OUTER && CM.GEO_OUTER.sh; if (!G) return;
  // 单一 384×368 上海底图：旧数据的 152×152 坐标在这里一次性平移到外圈坐标。
  const P = { lon0: 121.31, lat0: 31.42, kx: 380.6, ky: 442.3 };
  const DX = 144, DY = 48;
  // 本文件的经纬度按国内地图常用的 GCJ-02 坐标填写，换算为 OSM 使用的 WGS-84 后再投影
  const ll = function (lat, lon) { const w = CM.U.gcj2wgs(lat, lon); return [+((w[1] - P.lon0) * P.kx + DX).toFixed(2), +((P.lat0 - w[0]) * P.ky + DY).toFixed(2)]; };
  // 取自 OpenStreetMap 的地标位置（WGS-84，不再换算）
  const llW = function (lat, lon) { return [+((lon - P.lon0) * P.kx + DX).toFixed(2), +((P.lat0 - lat) * P.ky + DY).toFixed(2)]; };
  const atW = function (lat, lon, o) { const p = llW(lat, lon); return Object.assign({ x: p[0], y: p[1] }, o); };
  const poly = function (pts) { return pts.map(function (p) { return ll(p[0], p[1]); }); };
  const at = function (lat, lon, o) { const p = ll(lat, lon); return Object.assign({ x: p[0], y: p[1] }, o); };
  const anchor = function (name, lat, lon, r) { const p = ll(lat, lon); return { name: name, x: p[0], y: p[1], r: r }; };
  const anchorW = function (name, lat, lon, r) { const p = llW(lat, lon); return { name: name, x: p[0], y: p[1], r: r }; };   // OSM 坐标（WGS-84）

  // 虹桥机场飞行区（近似）、陆家嘴金融贸易区核心（近似）、虹桥商务区（近似，机场以西）
  const hongqiao = poly([[31.2160, 121.3285], [31.2160, 121.3500], [31.1790, 121.3500], [31.1790, 121.3285]]);
  const lujiazui = poly([[31.2455, 121.4960], [31.2455, 121.5130], [31.2330, 121.5200], [31.2275, 121.5110], [31.2300, 121.4990]]);
  const hqcbd = poly([[31.2100, 121.3100], [31.2100, 121.3280], [31.1830, 121.3280], [31.1830, 121.3100]]);

  const data = {
    // 城市特色（v2.7 社区补录）：逐条校验后移入，不删改社区版原有字段；
    // 依赖口岸连接/硬编码格坐标的条目已跳过，避免社区版外扩地图错位。
    traits: [
      {
        "use": "finance",
        "flavor": "cn"
      },
      {
        "use": "crossing",
        "star": true,
        "icon": "bridge",
        "label": "黄浦江与浦东",
        "text": "1990 年江上还没有桥，越江线路造价最高，却连着全城发展最快的地方",
        "why": "1990 年 4 月浦东开发开放，南浦大桥 1991 年底才通车。"
      },
      {
        "use": "megaEvent",
        "level": "mid",
        "star": true,
        "icon": "flag",
        "label": "2010 世博会",
        "text": "获得主办权后拨款增加，园区一带可以提前布局",
        "bid": {
          "y": 2002,
          "m": 12
        },
        "open": [
          2010,
          5
        ],
        "foresight": {
          "id": "sh-expo",
          "level": "mid",
          "at": "sh_cnpav",
          "ym": [
            2002,
            12
          ],
          "before": 2000,
          "r": 7,
          "region": "pdriver",
          "title": "世博园区选址浦江两岸",
          "hit": "世博园区选在黄浦江两岸的老工业带，早已通车的{st}站让这里抢先有了依托。",
          "miss": "世博园区选在黄浦江两岸的老工业带，这里的地铁还不够，几年内要补上。"
        },
        "why": "2002 年 12 月上海获得 2010 年世博会主办权，世博前上海地铁进入大规模建设期。"
      },
      {
        "use": "carLimit",
        "level": "mid",
        "star": true,
        "icon": "car",
        "label": "车牌拍卖",
        "text": "1994 年起私车牌照要靠拍卖取得，开车更贵，地铁更有吸引力",
        "on": {
          "y": 1994,
          "m": 1,
          "title": "私车牌照开始拍卖",
          "desc": "上海从 1994 年起对新增私车牌照实行拍卖，控制中心城区的汽车增长。"
        },
        "why": "上海 1994 年起实行新增机动车额度拍卖。"
      },
      {
        "use": "guard",
        "level": "mid",
        "label": "外滩与老城古建",
        "guards": [
          "sh_bund",
          "sh_yuyuan",
          "sh_xjh",
          "sh_longhua",
          "sh_jingan"
        ],
        "why": "外滩建筑群、豫园、徐家汇天主堂、龙华寺和静安寺都是上海的历史名胜，地铁要小心避让。"
      },
      {
        "use": "transition",
        "level": "light",
        "label": "世博园区工厂搬迁",
        "region": "pdriver",
        "close": {
          "y": 2004,
          "m": 1,
          "title": "世博园区工厂开始搬迁",
          "desc": "为建设世博园区，上钢三厂、江南造船厂等沿江工厂陆续搬迁。"
        },
        "replan": [
          {
            "year": 2005,
            "region": "pdriver",
            "plan": "mix"
          }
        ],
        "why": "世博园区选址在浦江两岸的老工业带，沿江工厂在 2000 年代中期陆续搬迁。"
      },
      {
        "use": "transition",
        "level": "light",
        "label": "杨浦转型",
        "region": "yangpu",
        "close": {
          "y": 1995,
          "m": 1,
          "title": "杨浦老工厂陆续关停",
          "desc": "1990 年代起，杨浦的纺织、机械和钢铁企业陆续转移、关停，大批工人下岗。"
        },
        "renew": {
          "y": 2003,
          "m": 1,
          "title": "杨浦知识创新区",
          "desc": "上海决定建设杨浦知识创新区，推动大学校区、科技园区和公共社区融合发展。"
        },
        "replan": [
          {
            "year": 2004,
            "region": "yangpu",
            "plan": "mix"
          }
        ],
        "why": "杨浦 1990 年代起转移、关停传统工业，2003 年上海决定建设杨浦知识创新区。"
      },
      {
        "use": "accident",
        "level": "light",
        "label": "2003 年 4 号线事故",
        "on": {
          "y": 2003,
          "m": 7,
          "title": "轨道交通 4 号线董家渡事故",
          "desc": "7 月 1 日，在建的 4 号线联络通道发生涌水塌陷，地面沉降，黄浦江防汛墙受损，软土中施工的风险引起全国关注。"
        },
        "why": "2003 年 7 月 1 日，上海轨道交通 4 号线隧道事故。"
      }
    ],
    city: '上海', riverName: '黄浦江', seaName: '长江口', hsrYear: 2010,
    stages: [[1993, '无地铁时代'], [2000, '浦东开发初期'], [2010, '迎世博建设期']], stageLast: '超大城市网络化时期',
    // 历史发展阶段（v2.2，eras.js）：summary 中「史实」可查证，「估算」为模型设定的发展倾向；grow 只改变人口与岗位增长的去向（总量仍按人口曲线），
    // relocate 为每月疏解比例，corridors 为片区间通勤与购物去向倍数，demand 为出行强度与距离倍数，goals 为阶段目标（本城任务）
    eras: [
      { id: 'sh-e1', from: 1990, name: '无地铁时代', tag: '史实',
        summary: '史实：1990 年 4 月宣布开发开放浦东；浦西老城区十分拥挤，过黄浦江主要依靠轮渡与打浦路隧道，1991 年南浦大桥通车。估算：旧区改造把居民迁往普陀、徐汇、长宁的新村，就业仍集中在黄浦与静安。',
        grow: { pop: { huangpu: 0.5, jingan: 0.6, hongkou: 0.8, putuo: 1.2, xuhui: 1.2, changning: 1.2, pdriver: 1.3 }, jobs: { huangpu: 1.3, jingan: 1.2, xuhui: 1.1, pdriver: 1.2 } },
        relocate: { pop: { huangpu: 0.0006, jingan: 0.0004 } },
        demand: { decayHW: 0.85 }, corridors: [{ a: 'pdriver', b: 'huangpu', f: 1.15 }] },
      { id: 'sh-e2', from: 1993, name: '浦东开发初期', tag: '史实',
        summary: '史实：1993 年陆家嘴、金桥与张江开始建设，杨浦大桥通车，地铁 1 号线南段试运营（史实背景，不会自动建成）；1999 年浦东国际机场启用。估算：陆家嘴与浦东沿江的岗位快速增长，浦西旧区居民大量迁往外围新村，跨江通勤成为主要的新增出行。',
        grow: { pop: { huangpu: 0.5, jingan: 0.6, pdriver: 1.5, waigaoqiao: 1.4, putuo: 1.3, minhang: 1.4, baoshan: 1.1, changning: 1.2 }, jobs: { lujiazui: 2.4, waigaoqiao: 1.8, xuhui: 1.3, changning: 1.3 } },
        relocate: { pop: { huangpu: 0.0008, jingan: 0.0005 } },
        demand: { decayHW: 1.05 },
        corridors: [{ a: 'pdriver', b: 'huangpu', f: 1.2 }, { a: 'lujiazui', b: 'huangpu', f: 1.2 }, { a: 'waigaoqiao', b: 'yangpu', f: 1.1 }, { a: 'minhang', b: 'xuhui', f: 1.15 }],
        goals: [{ id: 'sh-g1', from: 1996, type: 'connect', months: 48, reward: 45000, title: '张江高科技园区', desc: '张江高科技园区招商引资，科研人员需要往返陆家嘴与浦西。用地铁连接张江与陆家嘴。', anchors: [anchor('张江', 31.2030, 121.5870, 4), anchor('陆家嘴', 31.2380, 121.5000, 3)] }] },
      { id: 'sh-e3', from: 2000, name: '迎世博建设期', tag: '史实',
        summary: '史实：2002 年上海获得 2010 年世博会主办权，卢浦大桥（2003 年）、上海南站（2006 年）建成，2008 年上海环球金融中心落成。估算：陆家嘴成为金融中心，宝山、闵行、嘉定与浦东外围出现大型居住区，平均通勤距离明显变长。',
        grow: { pop: { baoshan: 1.5, minhang: 1.5, pdriver: 1.5, jiading: 1.3, chuansha: 1.2, pudong: 1.3, huangpu: 0.5, jingan: 0.6 }, jobs: { lujiazui: 2.0, waigaoqiao: 1.5, xuhui: 1.3, jingan: 1.2, huangpu: 0.9 } },
        relocate: { pop: { huangpu: 0.0006 } },
        demand: { sh: 1.05, decayHW: 1.15 },
        corridors: [{ a: 'lujiazui', b: 'jingan', f: 1.15 }, { a: 'baoshan', b: 'jingan', f: 1.15 }, { a: 'minhang', b: 'xuhui', f: 1.15 }, { a: 'pdriver', b: 'lujiazui', f: 1.15 }],
        goals: [{ id: 'sh-g2', from: 2005, type: 'connect', months: 48, reward: 45000, title: '莘庄与上海南站', desc: '上海南站启用后，莘庄、梅陇的居民经南站换乘进城。用地铁连接莘庄与上海南站。', anchors: [anchor('莘庄', 31.1110, 121.3850, 3), anchor('上海南站', 31.1540, 121.4300, 3)] }] },
      { id: 'sh-e4', from: 2010, name: '超大城市网络化时期', tag: '史实',
        summary: '史实：2010 年 3 月虹桥综合交通枢纽启用、5 月世博会开幕；2015 年上海中心大厦落成，2018 年起每年举办进口博览会。估算：虹桥商务区成长为西部中心，就业向陆家嘴、虹桥、张江等多个中心扩散，郊区与中心城之间的长距离通勤增加。',
        grow: { pop: { pudong: 1.4, jiading: 1.3, minhang: 1.3, baoshan: 1.2, chuansha: 1.2, huangpu: 0.5, jingan: 0.6 }, jobs: { hqcbd: 2.2, lujiazui: 1.5, waigaoqiao: 1.5, xuhui: 1.3, huangpu: 0.85 } },
        relocate: { jobs: { huangpu: 0.0004 } },
        demand: { sh: 1.08, lz: 1.1, decayHW: 1.2, hub: 1.15 },
        corridors: [{ a: 'hqcbd', b: 'jingan', f: 1.15 }, { a: 'waigaoqiao', b: 'lujiazui', f: 1.15 }, { a: 'pudong', b: 'lujiazui', f: 1.15 }, { a: 'jiading', b: 'putuo', f: 1.15 }],
        goals: [{ id: 'sh-g3', from: 2013, type: 'connect', months: 48, reward: 45000, title: '前滩商务区', desc: '世博会后，黄浦江南段的前滩发展为新的商务区。用地铁连接前滩与陆家嘴。', anchors: [anchor('前滩', 31.1500, 121.4700, 4), anchor('陆家嘴', 31.2380, 121.5000, 3)] },
          { id: 'sh-g4', type: 'connect', months: 48, reward: 45000, title: '张江与金桥', desc: '张江与金桥的产业园区之间缺少直达交通。用地铁连接张江与金桥。', anchors: [anchor('张江', 31.2030, 121.5870, 4), anchor('金桥', 31.2650, 121.5900, 4)] }] },
      { id: 'sh-e5', from: 2021, name: '模拟未来', tag: '模拟',
        summary: '模拟：此后的发展按模型推演，不代表真实历史。估算：浦东外围、嘉定与虹桥继续成长，中心城人口保持稳定。',
        grow: { pop: { pudong: 1.3, jiading: 1.3, chuansha: 1.2, huangpu: 0.6 }, jobs: { hqcbd: 1.4, waigaoqiao: 1.3, pudong: 1.3, huangpu: 0.9 } },
        demand: { lz: 1.1, decayHW: 1.2 }, corridors: [{ a: 'pudong', b: 'waigaoqiao', f: 1.1 }] },
    ],
    briefing: {
      lead: '1990 年的上海还没有地铁。七百多万人挤在黄浦江西岸的老城区，公交车厢塞得满满当当；对岸的浦东还是农田与码头，黄浦江上一座大桥也没有。4 月，浦东开发开放的消息就要宣布。',
      modes: [['metro', '地铁', '尚无地铁。真实的地铁 1 号线 1993 年开始试运营，本局由你规划，真实线路不会自动出现。'], ['bus', '公交与自行车', '公交线路严重超载，自行车是通勤主力，高峰时市中心道路拥堵。'], ['bridge', '越江', '黄浦江上没有桥，过江只能走打浦路隧道、延安东路隧道或乘轮渡；南浦大桥 1991 年底才通车。'], ['rail', '铁路', '1987 年启用的上海站是主要铁路枢纽。列车本身不参与模拟，车站与虹桥机场会产生市内接驳出行，地面铁路会阻隔步行。']],
    },
    // 虹桥机场照常运营：用地不开发，范围内只能地下设站与地下穿越（同台北松山机场的规则）
    airport: { name: '虹桥机场', closeYear: 9999, buildable: 'underground', runway: [llW(31.2131, 121.3355), llW(31.1826, 121.3371)] },   // v2.2：跑道按 OSM 坐标（原数据走向偏斜）
    // 虹桥机场第二跑道（v2.2，OSM 坐标）：在原跑道以西约 365 m，2010 年 3 月启用（史实）
    runways: [{ a: llW(31.1834, 121.3332), b: llW(31.2130, 121.3316), from: 2010.2 }],
    regions: [],
    defaultRegion: { id: 'outer', name: '上海市', open: 1990, plan: 'res', pop: 13.95e6 },
    // 崇明等与主城区隔江的片区，开放后也允许作为独立可建设片区。
    multipleStartAreas: true,
    // 上海不再生成任何商业中心设施（含片区自动生成的“商业中心”）。
    noCommercialCenters: true,
    // 上海不再生成任何片区自动设施（区域医院、文体公园、商业中心）。
    noAutoFacilities: true,
    snapFacilities: true,
    plans: CM.DATA.plans,
    // 1990 年人口与就业中心（估算，人/km²；r 约为影响半径 km）
    centers: [
      at(31.2360, 121.4800, { pop: 45000, jobs: 90000, r: 1.2 }),   // 外滩、南京东路、人民广场
      at(31.2260, 121.4900, { pop: 70000, jobs: 30000, r: 0.9 }),   // 老城厢、豫园
      at(31.2250, 121.4500, { pop: 40000, jobs: 40000, r: 1.0 }),   // 静安寺、南京西路
      at(31.2180, 121.4700, { pop: 55000, jobs: 35000, r: 1.1 }),   // 淮海路、卢湾
      at(31.1950, 121.4370, { pop: 30000, jobs: 25000, r: 1.2 }),   // 徐家汇
      at(31.2220, 121.4200, { pop: 35000, jobs: 15000, r: 1.1 }),   // 曹家渡、中山公园
      at(31.2500, 121.4600, { pop: 45000, jobs: 25000, r: 1.2 }),   // 闸北、上海站
      at(31.2600, 121.4850, { pop: 50000, jobs: 20000, r: 1.2 }),   // 四川北路、虹口
      at(31.2650, 121.5200, { pop: 30000, jobs: 30000, r: 1.5 }),   // 杨浦工业区
      at(31.3000, 121.5100, { pop: 12000, jobs: 12000, r: 1.2 }),   // 五角场
      at(31.2400, 121.4200, { pop: 30000, jobs: 15000, r: 1.4 }),   // 长寿路、曹杨
      at(31.2100, 121.4000, { pop: 20000, jobs: 10000, r: 1.4 }),   // 长宁、古北
      at(31.2350, 121.5100, { pop: 25000, jobs: 15000, r: 1.4 }),   // 浦东沿江
      at(31.1800, 121.5000, { pop: 15000, jobs: 20000, r: 1.3 }),   // 上钢、周家渡
      at(31.3800, 121.4900, { pop: 8000, jobs: 15000, r: 1.8 }),    // 吴淞、宝钢
      at(31.1700, 121.4300, { pop: 15000, jobs: 10000, r: 1.3 }),   // 漕河泾、田林
      // v2.1 扩大范围（1990 年估算）
      at(31.1900, 121.7000, { pop: 8000, jobs: 5000, r: 0.9 }),     // 川沙镇
    ],
    rural: { pop: 800, jobs: 150 },
    // 越江桥隧与高架道路通车年份（名称前缀匹配；1990 年已有的道路按所在区域开放年份出现）。1990 年黄浦江上还没有桥；
    // OSM 中杨浦、徐浦大桥分别并入「内环高架路」「外环高速」。越江桥隧、内环与南北高架为史实，部分高架与快速路为近似年份
    roadYears: {
      '南浦大桥': 1991, '杨浦大桥': 1993, '徐浦大桥': 1997, '卢浦大桥': 2003, '打浦路隧道': 1971, '延安东路隧道': 1988, '外环隧道': 2003, '复兴东路隧道': 2004,
      '大连路隧道': 2003, '翔殷路隧道': 2005, '新建路隧道': 2009, '人民路隧道': 2009, '西藏南路隧道': 2010, '龙耀路隧道': 2010, '上中路隧道': 2009, '军工路隧道': 2011,
      '长江路隧道': 2016, '周家嘴路隧道': 2019, '江浦路隧道': 2021, '北横通道': 2021, '外滩隧道': 2010, '郊环隧道': 2009,
      '内环高架路': 1994, '南北高架': 1995, '延安高架路': 1999, '逸仙高架路': 1999, '中环路': 2006, '外环高速': 2003, '上海绕城高速': 2009,
      '沪嘉高速': 1988, '京沪高速': 1996, '沪昆高速': 1998, '沪渝高速': 2002, '沪金高速': 2000, '沪崇高速': 2009, '沪翔高速': 2011,
      '杨高路': 1992, '世纪大道': 2000, '罗山路': 1997, '龙东大道': 1998, '龙东高架路': 2008, '罗山高架路': 2005, '华夏高架路': 2009, '军工高架路': 2007,
      '北翟高架路': 2015, '嘉闵高架路': 2014, '虹梅高架路': 2014, '崧泽高架路': 2015, '度假区高架路': 2016, '五洲大道': 2011, '世博大道': 2010,
    },
    bridgeYears: {}, bridgeDefaultYear: 1990,
    // 旧镇街路和校区接驳独立于大片住宅区的开发年份。范围为模拟近似。
    localRoadStarts: [
      at(31.1110, 121.3850, { year: 1990, radius: 6 }),
      at(31.3160, 121.3920, { year: 1999, radius: 4 }),
    ],
    simRoads: [],
    landmarks: [
      Object.assign(atW(31.2395, 121.4850), { id: 'sh_bund', name: '外滩建筑群', w: 1200, d: 50, rot: -96, year: 1937, kind: 'bund' }),
      Object.assign(atW(31.2356, 121.4670), { id: 'sh_park', name: '国际饭店', w: 40, d: 40, year: 1934, kind: 'skyscraper', h: 83 }),
      Object.assign(atW(31.2261, 121.4485), { id: 'sh_expoctr', name: '上海展览中心', w: 200, d: 150, year: 1955, kind: 'palace', style: 'spire', h: 110 }),
      Object.assign(atW(31.2289, 121.4878), { id: 'sh_yuyuan', name: '豫园·城隍庙', w: 300, d: 250, year: 1577, kind: 'traditional' }),
      Object.assign(atW(31.2254, 121.4407), { id: 'sh_jingan', name: '静安寺', w: 150, d: 120, year: 1900, kind: 'temple' }),
      Object.assign(atW(31.2436, 121.4399), { id: 'sh_jade', name: '玉佛寺', w: 150, d: 180, year: 1918, kind: 'temple' }),
      Object.assign(atW(31.1771, 121.4471), { id: 'sh_longhua', name: '龙华寺', w: 160, d: 220, year: 977, kind: 'pagoda', h: 41 }),
      Object.assign(at(31.1932, 121.4370), { id: 'sh_xjh', name: '徐家汇天主堂', w: 90, d: 40, year: 1910, kind: 'church' }),
      Object.assign(atW(31.2517, 121.4532), { id: 'sh_station', name: '上海站', w: 300, d: 120, year: 1987, kind: 'rail' }),
      Object.assign(atW(31.2981, 121.4979), { id: 'sh_fudan', name: '复旦大学', w: 900, d: 700, year: 1905, kind: 'campus' }),
      Object.assign(atW(31.2847, 121.4974), { id: 'sh_tongji', name: '同济大学', w: 900, d: 800, year: 1952, kind: 'campus' }),
      Object.assign(at(31.2005, 121.4370), { id: 'sh_sjtu', name: '上海交通大学（徐汇）', w: 600, d: 500, year: 1896, kind: 'campus', style: 'palace' }),
      Object.assign(atW(31.2286, 121.4018), { id: 'sh_ecnu', name: '华东师范大学', w: 800, d: 600, year: 1951, kind: 'campus' }),
      Object.assign(atW(31.2415, 121.4968), { id: 'sh_pearl', name: '东方明珠广播电视塔', w: 100, d: 100, year: 1994, kind: 'tvtower', style: 'pearl', h: 468 }),
      Object.assign(atW(31.2302, 121.4710), { id: 'sh_museum', name: '上海博物馆', w: 120, d: 120, year: 1996, kind: 'museum', style: 'ding' }),
      Object.assign(atW(31.2315, 121.4673), { id: 'sh_gt', name: '上海大剧院', w: 120, d: 100, year: 1998, kind: 'concert' }),
      Object.assign(atW(31.2373, 121.5014), { id: 'sh_jinmao', name: '金茂大厦', w: 70, d: 70, year: 1999, kind: 'skyscraper', style: 'jinmao', h: 420.5 }),
      Object.assign(atW(31.2733, 121.4763), { id: 'sh_hongkou', name: '虹口足球场', w: 220, d: 180, year: 1999, kind: 'stadium' }),
      Object.assign(atW(31.2119, 121.5634), { id: 'sh_sniec', name: '上海新国际博览中心', w: 600, d: 500, year: 2001, kind: 'expo' }),
      Object.assign(atW(31.1553, 121.4266), { id: 'sh_south', name: '上海南站', w: 300, d: 300, year: 2006, kind: 'rail', style: 'round' }),
      Object.assign(atW(31.2366, 121.5030), { id: 'sh_swfc', name: '上海环球金融中心', w: 60, d: 60, year: 2008, kind: 'skyscraper', style: 'swfc', h: 492 }),
      Object.assign(atW(31.1960, 121.3162), { id: 'sh_hqstation', name: '虹桥站', w: 600, d: 400, rot: 90, year: 2010, kind: 'rail' }),
      Object.assign(atW(31.1865, 121.4899), { id: 'sh_cnpav', name: '中国馆', w: 140, d: 140, year: 2010, kind: 'museum', style: 'crown' }),
      Object.assign(atW(31.2356, 121.5013), { id: 'sh_tower', name: '上海中心大厦', w: 80, d: 80, year: 2015, kind: 'skyscraper', style: 'shtower', h: 632 }),
      Object.assign(atW(31.1463, 121.6560), { id: 'sh_disney', name: '上海迪士尼乐园', w: 1150, d: 900, h: 60, year: 2016, kind: 'themepark', style: 'castle' }),   // 约 91 公顷，奇幻童话城堡约 60 m
    ],
    // 重要设施（见 facility.js）：位置与启用 / 停用年份为史实参考（位置近似）；规模均为估算。
    // 枢纽 pax：市内接驳出行（汽车 + 地铁，万人次/日）；浦东国际机场在地图东缘以东约 9 km，于川沙一带设出图接驳点。
    facilities: [
      { id: 'sh_station', n: '上海站', t: 'rail', lm: 'sh_station', pax: [[1990, 5], [2000, 8], [2010, 10], [2019, 9]] },
      { id: 'sh_south', n: '上海南站', t: 'rail', lm: 'sh_south', y0: [2006, 7], pax: [[2006.5, 2], [2010, 4], [2019, 4]] },
      { id: 'sh_west', n: '上海西站', t: 'rail', at: ll(31.2625, 121.4040), pax: [[1990, 0.5], [2010, 1], [2019, 1.5]] },
      { id: 'sh_hqstation', n: '虹桥站', t: 'rail', lm: 'sh_hqstation', y0: [2010, 7], pax: [[2010.5, 4], [2015, 10], [2019, 14], [2030, 16]], note: '2010 年 7 月虹桥综合交通枢纽启用，京沪高铁 2011 年通车。' },
      { id: 'sh_disney', n: '上海迪士尼乐园', t: 'scenic', lm: 'sh_disney', y0: [2016, 6], w: [[2016.5, 0.045], [2019, 0.05], [2020, 0.025], [2021, 0.04], [2023, 0.05]], we: 1.9, note: '主题乐园：周末与假日客流明显高于工作日（估算）；位于浦东川沙，2016 年 6 月开园。' },
      { id: 'sh_pvgair', n: '浦东机场（川沙接驳）', t: 'air', ext: ['E', 9],at: ll(31.1900, 121.7000), y0: [1999, 9], pax: [[1999.7, 0.4], [2005, 2], [2010, 3.8], [2019, 7], [2030, 8]], note: '浦东国际机场 1999 年 9 月建成通航，在地图东缘以东约 9 km。此处为迎宾高速、磁浮与机场方向轨道交通出图的接驳点。' },
      { id: 'sh_hqair', n: '虹桥机场', t: 'air', at: llW(31.1965, 121.3425), rw: [llW(31.2131, 121.3355), llW(31.1826, 121.3371)], pax: [[1990, 1.4], [1999.8, 3.5], [2000, 2.5], [2005, 4.9], [2010, 8.5], [2019, 12.5], [2030, 13]], note: '1999 年浦东国际机场（地图东缘以外）启用后国际航线逐步迁出；2010 年 T2 航站楼启用。' },
      { id: 'sh_fudan', n: '复旦大学', t: 'uni', lm: 'sh_fudan', w: 0.035 },
      { id: 'sh_tongji', n: '同济大学', t: 'uni', lm: 'sh_tongji', w: 0.03 },
      { id: 'sh_sjtu', n: '上海交通大学（徐汇）', t: 'uni', lm: 'sh_sjtu', w: 0.02 },
      { id: 'sh_ecnu', n: '华东师范大学', t: 'uni', lm: 'sh_ecnu', w: 0.025 },
      { id: 'sh_sufe', n: '上海财经大学', t: 'uni', at: ll(31.3075, 121.4985), w: 0.012 },
      { id: 'sh_shu', n: '上海大学（宝山）', t: 'uni', at: ll(31.3160, 121.3920), y0: 1999, w: 0.02 },
      { id: 'sh_ecust', n: '华东理工大学', t: 'uni', at: ll(31.1440, 121.4235), w: 0.015 },
      { id: 'sh_dhu', n: '东华大学（延安路）', t: 'uni', at: llW(31.20622, 121.41055), w: 0.01 },
      { id: 'sh_ruijin', n: '瑞金医院', t: 'hosp', at: ll(31.2115, 121.4680), w: 0.06 },
      { id: 'sh_huashan', n: '华山医院', t: 'hosp', at: ll(31.2155, 121.4425), w: 0.05 },
      { id: 'sh_zhongshan', n: '中山医院', t: 'hosp', at: ll(31.1990, 121.4535), w: 0.06 },
      { id: 'sh_renji', n: '仁济医院', t: 'hosp', at: llW(31.23559, 121.47956), w: 0.04 },
      { id: 'sh_changhai', n: '长海医院', t: 'hosp', at: ll(31.3070, 121.5260), w: 0.04 },
      { id: 'sh_xinhua', n: '新华医院', t: 'hosp', at: ll(31.2720, 121.5205), w: 0.04 },
      { id: 'sh_six', n: '第六人民医院', t: 'hosp', at: llW(31.18040, 121.41788), w: 0.04 },
      { id: 'sh_dongfang', n: '东方医院', t: 'hosp', at: llW(31.23954, 121.50792), w: 0.03 },
      { id: 'sh_necc', n: '国家博览中心', t: 'venue', at: [138.9, 149.2], y0: 2014, w: 0.018 },
      { id: 'sh_xicen', n: '西岑科创中心', t: 'cbd', at: [10.75, 201.65], y0: 2020, w: [[2020, 0.006], [2030, 0.018]], note: '青浦金泽西岑，长三角一体化示范区科创节点' },
      { id: 'sh_huawei', n: '华为练秋湖研发中心', t: 'cbd', at: [18, 205], y0: 2024, w: [[2024, 0.008], [2032, 0.022]], note: '青浦金泽练秋湖，华为研发基地' },
      { id: 'sh_qiantan', n: '前滩', t: 'cbd', at: [205.019, 165.806], y0: 2010, w: [[2010, 0.004], [2020, 0.02]] },
      { id: 'sh_dfc', n: '东方体育中心', t: 'stadium', at: [207.115, 165.006], y0: 2010, w: 0.016 },
      { id: 'sh_dishuihu', n: '滴水湖', t: 'scenic', at: [377.941, 272.467], y0: 2007, w: 0.014 },
      { id: 'sh_bund_poi', n: '外滩', t: 'scenic', at: [207.533, 126.981], w: 0.05, note: '外滩历史建筑群与滨江步道' },
      { id: 'sh_qpnewcity', n: '青浦新城', t: 'cbd', at: [72.105, 162.651], y0: 2000, w: 0.014 },
      { id: 'sh_huaqiao', n: '花桥', t: 'cbd', at: [63.982, 100.81], y0: 2006, w: 0.012 },
      { id: 'sh_kunshan', n: '昆山', t: 'cbd', at: [17.058, 62.626], y0: 2006, w: 0.018 },
      { id: 'sh_taicang_city', n: '太仓', t: 'cbd', at: [74.151, 30.734], y0: 2000, w: 0.014 },
      { id: 'sh_jdnewcity', n: '嘉定新城', t: 'cbd', at: llW(31.330, 121.255), y0: 2000, w: 0.016 },
      { id: 'sh_sjnewcity', n: '松江新城', t: 'cbd', at: [112.128, 219.519], y0: 2000, w: 0.016 },
      { id: 'sh_fxnewcity', n: '奉贤新城', t: 'cbd', at: llW(30.925, 121.482), y0: 2000, w: 0.014 },
      { id: 'sh_nhnewcity', n: '南汇新城', t: 'cbd', at: [376.866, 278.055], y0: 2003, w: 0.014 },
      { id: 'sh_caolu_comm', n: '曹路社区', t: 'cbd', at: [278.189, 109.717], y0: 2000, w: 0.010 },
      { id: 'sh_jinqiao_ind', n: '金桥工业区', t: 'cbd', at: [257.067, 115.138], y0: 1994, w: 0.018 },
      { id: 'sh_wgq_bond', n: '外高桥保税区', t: 'cbd', at: [248.606, 77.882], y0: 1996, w: 0.020 },
      { id: 'sh_bund', n: '外滩金融区', t: 'cbd', at: ll(31.2385, 121.4870), w: 0.02 },
      { id: 'sh_ljz', n: '陆家嘴金融贸易区', t: 'cbd', at: ll(31.2380, 121.5050), y0: 1993, w: [[1993, 0.003], [2000, 0.02], [2010, 0.045], [2020, 0.055]] },
      { id: 'sh_njxc', n: '南京西路商务区', t: 'cbd', at: ll(31.2295, 121.4560), w: [[1990, 0.005], [2000, 0.02]] },
      { id: 'sh_gubei', n: '虹桥开发区（古北）', t: 'cbd', at: ll(31.2050, 121.3990), w: 0.01 },
      { id: 'sh_chj', n: '漕河泾开发区', t: 'cbd', at: ll(31.1700, 121.4000), w: 0.012 },
      { id: 'sh_zj', n: '张江高科技园区', t: 'cbd', at: ll(31.2030, 121.5900), y0: 1992, w: [[1992, 0.002], [2010, 0.025]] },
      { id: 'sh_hqcbd', n: '虹桥商务区', t: 'cbd', at: llW(31.19319, 121.31114), y0: 2010, w: [[2010, 0.003], [2020, 0.02]] },
      { id: 'sh_bundv', n: '外滩', t: 'scenic', lm: 'sh_bund', w: 0.06 },
      { id: 'sh_pearl', n: '东方明珠', t: 'scenic', lm: 'sh_pearl', w: 0.03 },
      { id: 'sh_yy', n: '豫园', t: 'scenic', lm: 'sh_yuyuan', w: 0.03 },
      { id: 'sh_museum', n: '人民广场与上海博物馆', t: 'scenic', lm: 'sh_museum', w: 0.02 },
      { id: 'sh_jingan', n: '静安寺', t: 'scenic', lm: 'sh_jingan', w: 0.01 },
      { id: 'sh_jade', n: '玉佛寺', t: 'scenic', lm: 'sh_jade', w: 0.01 },
      { id: 'sh_longhua', n: '龙华寺', t: 'scenic', lm: 'sh_longhua', w: 0.008 },
      { id: 'sh_tzf', n: '田子坊', t: 'scenic', at: ll(31.2090, 121.4680), y0: 2006, w: 0.008 },
      { id: 'sh_zoo', n: '上海动物园', t: 'scenic', at: ll(31.1920, 121.3600), w: 0.012 },
      { id: 'sh_cnpav', n: '中国馆（中华艺术宫）', t: 'scenic', lm: 'sh_cnpav', y0: [2010, 11], w: 0.008 },
      { id: 'sh_rmgy', n: '人民公园', t: 'park', at: ll(31.2320, 121.4725), w: 0.012 },
      { id: 'sh_zsp', n: '中山公园', t: 'park', at: llW(31.22332, 121.41562), w: 0.01 },
      { id: 'sh_century', n: '世纪公园', t: 'park', at: llW(31.21880, 121.54863), y0: 2000, w: 0.012 },
      { id: 'sh_luxun', n: '鲁迅公园', t: 'park', at: ll(31.2710, 121.4815), w: 0.01 },
      { id: 'sh_gq', n: '共青森林公园', t: 'park', at: llW(31.32082, 121.54799), w: 0.008 },
      { id: 'sh_cf', n: '长风公园', t: 'park', at: ll(31.2280, 121.3920), w: 0.008 },
      { id: 'sh_gym', n: '上海体育馆', t: 'stadium', at: llW(31.18328, 121.43371), w: 0.008 },
      { id: 'sh_hongkou', n: '虹口足球场', t: 'stadium', lm: 'sh_hongkou', w: 0.01 },
      { id: 'sh_yuanshen', n: '源深体育中心', t: 'stadium', at: ll(31.2290, 121.5260), w: 0.005 },
      { id: 'sh_expo2010', n: '2010 年上海世博会', t: 'venue', at: ll(31.1860, 121.4900), r: 2.4, y0: [2010, 5], y1: [2010, 11], w: 0.12, note: '2010 年 5 月 1 日至 10 月 31 日，参观人次约 7300 万。' },
      { id: 'sh_expoctr', n: '上海展览中心', t: 'venue', lm: 'sh_expoctr', w: 0.008 },
      { id: 'sh_sniec', n: '上海新国际博览中心', t: 'venue', lm: 'sh_sniec', w: 0.02 },
      { id: 'sh_icc', n: '上海国际会议中心', t: 'venue', at: llW(31.24145, 121.49245), y0: 1999, w: 0.005 },
      { id: 'sh_gt', n: '上海大剧院', t: 'venue', lm: 'sh_gt', w: 0.006 },
      { id: 'sh_mbcc', n: '世博文化中心', t: 'venue', at: ll(31.1890, 121.4970), y0: [2010, 5], w: 0.008 },
    ],
    districtLabels: [['黄浦', ['黄浦区']], ['静安', ['静安区']], ['徐汇', ['徐汇区']], ['长宁', ['长宁区']], ['普陀', ['普陀区']], ['虹口', ['虹口区']], ['杨浦', ['杨浦区']], ['浦东', ['浦东新区']], ['宝山', ['宝山区']], ['闵行', ['闵行区']], ['嘉定', ['嘉定区']]],
    // 纪事（只能在末尾追加：已发生记录按序号保存）
    events: [
      { y: 1990, m: 1, tag: '史实', title: '1990 年的上海', desc: '市区人口约 740 万，城市集中在黄浦江西岸；浦东大多是农田、工厂与码头，黄浦江上没有一座大桥；没有地铁，公交车厢严重超载。' },
      { y: 1990, m: 4, tag: '史实', title: '浦东开发开放', desc: '中央宣布开发开放浦东，陆家嘴、金桥、外高桥与张江陆续设立开发区。', fx: { grow: { region: ['pdriver', 'lujiazui'], jobs: 1.4, years: 6 } } },
      { y: 1991, m: 12, tag: '史实', title: '南浦大桥通车', desc: '黄浦江上的第一座大桥，浦西与浦东之间不再只靠隧道与轮渡。' },
      { y: 1993, m: 5, tag: '史实', title: '史实背景：地铁 1 号线南段试运营', desc: '锦江乐园至徐家汇段试运营，1995 年全线通车。本局的地铁由你规划，真实线路不会自动出现。' },
      { y: 1993, m: 10, tag: '史实', title: '杨浦大桥通车', desc: '当时世界跨度最大的斜拉桥，连接杨浦与浦东。' },
      { y: 1994, m: 10, tag: '史实', title: '东方明珠落成', desc: '高 468 m 的广播电视塔成为浦东开发的标志。' },
      { y: 1994, m: 12, tag: '史实', title: '内环高架路贯通', desc: '城市快速路开始成网，1995 年南北高架通车。' },
      { y: 1996, m: 10, tag: '史实', title: '上海博物馆新馆开放', desc: '人民广场改造为市民广场，周边陆续建成大剧院与城市规划展示馆。' },
      { y: 1997, m: 10, tag: '史实', title: '上海体育场启用', desc: '为第八届全国运动会建成的 8 万座体育场。' },
      { y: 1999, m: 8, tag: '史实', title: '金茂大厦落成', desc: '高 420.5 m，当时中国最高的建筑。' },
      { y: 1999, m: 9, tag: '史实', title: '浦东国际机场启用', desc: '新机场在地图范围以外，国际航线逐步从虹桥机场迁出。' },
      { y: 2002, m: 12, tag: '史实', title: '获得 2010 年世博会主办权', desc: '黄浦江两岸的工厂与码头开始动迁，规划建设世博园区。' },
      { y: 2003, m: 6, tag: '史实', title: '卢浦大桥通车', desc: '连接卢湾与浦东的钢拱桥。' },
      { y: 2006, m: 7, tag: '史实', title: '上海南站启用', desc: '圆形屋顶的新站房成为城市南部的交通枢纽。' },
      { y: 2008, m: 8, tag: '史实', title: '上海环球金融中心落成', desc: '高 492 m，顶部的梯形开口成为陆家嘴天际线的标志。' },
      { y: 2010, m: 3, tag: '史实', title: '虹桥综合交通枢纽启用', desc: '机场、高铁、地铁与长途客运集于一处，城市西部出现新的交通中心。', fx: { grow: { region: 'hqcbd', jobs: 1.5, years: 6 } } },
      { y: 2010, m: 5, tag: '史实', title: '2010 年上海世博会开幕', desc: '184 天里参观人次约 7300 万，园区横跨黄浦江两岸。', fx: { demand: { hub: 1.1, months: 6 }, sat: { v: 2, months: 6 } } },
      { y: 2015, m: 12, tag: '史实', title: '上海中心大厦落成', desc: '高 632 m，中国最高的建筑。' },
      { y: 2016, m: 6, tag: '史实', title: '上海迪士尼乐园开园', desc: '浦东川沙的主题乐园与度假区开园，带来大量周末与假日的休闲出行；地铁 11 号线迪士尼站同年 4 月启用。' },
      { y: 2018, m: 11, tag: '史实', title: '首届中国国际进口博览会', desc: '在虹桥的国家会展中心（地图范围外附近）举行。', fx: { demand: { hub: 1.1, months: 1 } } },
      { y: 2020, m: 1, tag: '史实', title: '新冠肺炎疫情', desc: '春节后城市活动大幅减少，客流骤降，之后逐步恢复。', fx: { demand: { sc: 0.7, sh: 0.75, lz: 0.6, hub: 0.5, months: 3, fade: 1 } } },
      { y: 2021, m: 1, tag: '模拟', title: '进入模拟发展阶段', desc: '此后人口、道路和区域变化按模拟规则推演，不代表真实历史。' },
    ],
    // 本地历史主题任务：参考上海的发展需求，不要求复刻真实线路走向（奖励单位：万元，1990 年价格）
    histTasks: [
      { id: 'sh1', appear: [1990, 3], deadline: [1995, 12], type: 'connect', reward: 250000, title: '南北主轴', desc: '连接上海站、人民广场、徐家汇与锦江乐园，为最拥挤的南北走廊建设第一条地铁。', anchors: [anchor('上海站', 31.2495, 121.4560, 3), anchor('人民广场', 31.2330, 121.4750, 3), anchor('徐家汇', 31.1940, 121.4370, 3), anchor('锦江乐园', 31.1420, 121.4140, 3)] },
      { id: 'sh2', appear: [1993, 1], deadline: [2000, 12], type: 'connect', reward: 300000, title: '越过黄浦江：东西主轴', desc: '连接中山公园、静安寺、人民广场、陆家嘴与龙阳路。过黄浦江需要建设越江隧道。', anchors: [anchor('中山公园', 31.2190, 121.4180, 3), anchor('静安寺', 31.2230, 121.4460, 3), anchor('人民广场', 31.2330, 121.4750, 3), anchor('陆家嘴', 31.2380, 121.5020, 3), anchor('龙阳路', 31.2030, 121.5570, 3)] },
      { id: 'sh3', appear: [1995, 1], deadline: [2001, 12], type: 'connect', reward: 250000, title: '西部高架环线', desc: '沿铁路线建设一条高架线路，连接漕溪路、宜山路、中山公园、上海站与江湾镇。', anchors: [anchor('漕溪路', 31.1730, 121.4330, 3), anchor('宜山路', 31.1860, 121.4230, 3), anchor('中山公园', 31.2190, 121.4180, 3), anchor('上海站', 31.2495, 121.4560, 3), anchor('江湾镇', 31.2930, 121.4800, 3)] },
      { id: 'sh4', appear: [2000, 1], deadline: [2007, 12], type: 'coverage', target: 0.3, reward: 300000, title: '地铁覆盖三成人口', desc: '2007 年底前，步行 15 分钟可到达地铁站的人口不低于全市人口的 30%。' },
      { id: 'sh5', appear: [2003, 1], deadline: [2010, 4], type: 'connect', reward: 300000, title: '世博会', desc: '世博会开幕前，连接世博园区、陆家嘴与人民广场。', anchors: [anchor('世博园', 31.1865, 121.4925, 3), anchor('陆家嘴', 31.2380, 121.5020, 3), anchor('人民广场', 31.2330, 121.4750, 3)] },
      { id: 'sh6', appear: [2005, 1], deadline: [2010, 12], type: 'connect', reward: 250000, title: '五角场与江湾', desc: '连接五角场、同济大学、四川北路与人民广场。', anchors: [anchor('五角场', 31.3000, 121.5145, 3), anchor('同济大学', 31.2830, 121.5025, 3), anchor('四川北路', 31.2610, 121.4840, 3), anchor('人民广场', 31.2330, 121.4750, 3)] },
      { id: 'sh7', appear: [2007, 1], deadline: [2010, 3], type: 'connect', reward: 250000, title: '虹桥综合交通枢纽', desc: '枢纽启用前，连接虹桥站、中山公园与人民广场。', anchors: [anchor('虹桥站', 31.1945, 121.3215, 3), anchor('中山公园', 31.2190, 121.4180, 3), anchor('人民广场', 31.2330, 121.4750, 3)] },
      { id: 'sh8', appear: [2010, 1], deadline: [2016, 12], type: 'coverage', target: 0.6, reward: 300000, title: '地铁覆盖六成人口', desc: '2016 年底前，步行 15 分钟可到达地铁站的人口不低于全市人口的 60%。' },
      { id: 'sh9', appear: [2012, 1], deadline: [2020, 12], type: 'connect', reward: 200000, title: '浦东腹地', desc: '不经陆家嘴，连接金桥、张江与世纪公园。', anchors: [anchor('金桥', 31.2620, 121.5850, 3), anchor('张江', 31.2030, 121.5900, 3), anchor('世纪公园', 31.2170, 121.5485, 3)] },
      { id: 'sh10', appear: [2013, 1], deadline: [2016, 12], type: 'connect', reward: 200000, title: '迪士尼接驳', desc: '乐园开园前，连接上海迪士尼乐园、秀沿路与龙阳路，让游客从市区直达度假区。', anchors: [anchorW('上海迪士尼乐园', 31.1434, 121.6637, 3), anchorW('秀沿路', 31.1403, 121.5942, 3), anchor('龙阳路', 31.2030, 121.5570, 3)] },
    ],
    dynTasks: [
      { id: 'shd1', from: [1993, 1], to: [2003, 12], type: 'connect', months: 36, reward: 40000, title: '浦东沿江过江通勤', desc: '浦东沿江的居民每天过江上班。连接塘桥、东昌路与外滩。', anchors: [anchor('塘桥', 31.2190, 121.5190, 3), anchor('东昌路', 31.2330, 121.5100, 3), anchor('外滩', 31.2385, 121.4870, 3)] },
      { id: 'shd2', from: [1998, 1], to: [2010, 12], type: 'connect', months: 36, reward: 35000, title: '古北与虹桥开发区', desc: '连接古北、虹桥路与徐家汇。', anchors: [anchor('古北', 31.2010, 121.3980, 3), anchor('虹桥路', 31.1980, 121.4210, 3), anchor('徐家汇', 31.1940, 121.4370, 3)] },
      { id: 'shd3', from: [2005, 1], to: [2018, 12], type: 'connect', months: 36, reward: 40000, title: '宝山大型居住区', desc: '连接大场、上海大学与上海站。', anchors: [anchor('大场', 31.2950, 121.4100, 3), anchor('上海大学', 31.3160, 121.3920, 3), anchor('上海站', 31.2495, 121.4560, 3)] },
    ],
    taskNote: '历史主题任务参考上海 1990 年起的发展需求（南北与东西主轴、越江、浦东开发、世博会与虹桥枢纽），不要求按真实线路走向建设，只需满足目标描述。',
    // 城市策略难题（v2.3，可选挑战）
    scenarios: [
      { id: 'sh-sc1', theme: '上海：浦东开发与越江', title: '把浦西接进浦东腹地', type: 'budgetConnect', from: [1993, 1], to: [2004, 12], months: 60, rewardMonths: 3, budgetX: 1.2,
        anchors: [['静安寺', 3], ['陆家嘴', 3], ['龙阳路', 3]],
        desc: '黄浦江把上海分成浦西与浦东，越江隧道造价高；浦东腹地还是一片待开发的土地。用有限预算从浦西中心穿江，直达浦东的龙阳路。',
        tips: ['黄浦江只过一次，选江面较窄处', '浦东未开发的路段可以用地面或高架', '陆家嘴设大站，留好以后的换乘'] },
      { id: 'sh-sc2', theme: '上海：超大客流', title: '为「{line}」减压', type: 'lineCrowd', line: 'busiest', from: [2005, 1], to: [2035, 12], months: 24, rewardMonths: 3, minLF: 1.0, target: 1.0,
        desc: '线网越大，换乘越多，客流越往几条骨干线上挤。不靠新线也能做到：把这条线最拥挤区段的早高峰满载率降到 100% 以下并保持 3 个月。',
        tips: ['升级沿线车站，列车加长到 8 节', '在拥挤区段两端设换乘，引导乘客走平行线', '贯通或拆分线路，减少乘客在拥挤站换乘'] },
    ],
    dataNote: [
      ['真实地理', 'hist', '黄浦江、苏州河与长江口、道路与桥隧、铁路、公园、街道边界与地名来自 OpenStreetMap（© OpenStreetMap 贡献者，ODbL），为现代数据，按 250 m 网格投影。'],
      ['史实参考', 'hist', '浦东开发开放（1990 年）、陆家嘴与各开发区设立年份、越江桥隧与高架道路通车年份、地标落成年份、世博会与虹桥综合交通枢纽。'],
      ['估算', 'est', '1990 年人口与就业分布、人口增长曲线、出行率、时间价值、造价、票价、运营费用与拨款、地图范围 GDP。'],
      ['模拟', 'sim', '2020 年之后的发展、居民出行选择、道路拥堵、客流与财政结果。普通铁路、高速铁路与磁浮不参与乘客出行与运营模拟，车站与虹桥机场只模拟市内接驳出行；地面铁路按真实线位阻隔步行与小路；真实的上海地铁不会自动出现。'],
      ['', '', '模拟结果不得作为真实上海交通规划预测。'],
    ],
    // 线路配色参考上海地铁
    lineColorsNice: ['#e3002b', '#8cc220', '#fcd600', '#461d84', '#944d9a', '#d40068', '#ed6f00', '#0094d8', '#87caed', '#c6afd4', '#871c2b', '#007a60', '#e999c0', '#626020', '#bca886', '#98d1c0', '#bc796f', '#c4984f'],
    places: (G.places || []).map(function (p) { return [p[0], p[1], p[2], p[3]]; }),
  };
  // 位置校正：与 OSM 地铁站同名的设施与任务锚点，改用车站位置（相距 3 km 以内时；手填坐标的误差可达数百米）
  const ST = {}; for (const p of G.places || []) if (p[3] === 0 && !ST[p[0]]) ST[p[0]] = p;
  const nearSt = function (name, x, y) { const p = ST[name.replace(/（.*?）/g, '')]; return p && Math.hypot(p[1] - x, p[2] - y) < 12 ? p : null; };
  for (const f of data.facilities) if (f.at) { const p = nearSt(f.n, f.at[0], f.at[1]); if (p) f.at = [p[1], p[2]]; }
  for (const t of data.histTasks.concat(data.dynTasks)) for (const a of t.anchors || []) { const p = nearSt(a.name, a.x, a.y); if (p) { a.x = p[1]; a.y = p[2]; } }

  (CM.MAP_LIST = CM.MAP_LIST || []).push({
    id: 'sh', name: '上海', title: '上海 · 1990', sub: '真实地理 · 1990 年起 · 人民币',
    desc: '从 1990 年尚无地铁的上海开始：七百多万人挤在浦西，黄浦江上没有一座桥，浦东开发开放即将宣布。陆家嘴、虹桥枢纽与世博会将陆续到来，地铁要追上中国最大城市的扩张。',
    facts: [['范围', '96 km × 92 km'], ['起始', '1990 年'], ['人口', '约 830 万'], ['货币', '人民币（元）'], ['模式', '经营挑战 / 自由建造']],
    modes: ['challenge', 'free'], kind: 'real', mapVersion: 3, scenario: 'sh-1990',
    region: '中国内地', tagline: '浦江两岸，从零开始的超大网络', difficulty: 3, tags: ['无地铁开局', '越江', '超大城市'],
    intro: '1990 年的上海，七百多万人挤在黄浦江西岸，公交车厢里人贴着人；对岸的浦东还是农田与码头，江上一座桥也没有。4 月，浦东开发开放的消息传来。你要从第一条南北线开始，跨过黄浦江，跟上一座超大城市三十年的扩张。',
    features: [['bridge', '黄浦江越江', '越江段可以建设隧道或桥梁，1990 年江上还没有桥'], ['building', '陆家嘴天际线', '东方明珠、金茂、环球金融中心与上海中心按年份出现'], ['map', '浦东开发', '陆家嘴、金桥、外高桥与张江陆续开放'], ['flag', '世博会与虹桥枢纽', '历史任务跟随城市大事']],
    highlights: [[1990, '浦东开发开放'], [1991, '南浦大桥通车'], [1994, '东方明珠落成'], [2010, '虹桥枢纽启用、世博会开幕'], [2015, '上海中心大厦落成']],
    geo: G, data: data,
    econ: { devOffset: 2, money: 1 },   // 出行选择参数：上海 1990 年约对应广州样本 1992 年的发展阶段
    cfg: {
      W: 384, H: 368, START: { y: 1990, m: 1, d: 1, minute: 360 },
      growth: Object.assign({}, CM.CFG.growth, { popCurve: [[1990, 8.3e6], [1995, 9.5e6], [2000, 12.0e6], [2005, 18.0e6], [2010, 26.0e6], [2015, 28.0e6], [2020, 30.0e6], [2030, 32.0e6], [2050, 36.0e6], [2100, 37.5e6], [2200, 38.2e6], [2300, 38.5e6]], histEnd: 2020, jobsRatio: [[1990, 0.56], [2000, 0.55], [2010, 0.58], [2020, 0.6]] }),
      money: { code: 'CNY', unit: '元', wan: '万元', yi: '亿元', sym: '¥' },
      econBase: 1990,
      // 造价（万元，1990 年价格；估算，参考地铁 1 号线约 16 km、总投资约 54 亿元的量级）：软土地基，越江隧道附加较高
      cost: Object.assign({}, CM.CFG.cost, {
        trackPerKm: { underground: 25000, surface: 5000, elevated: 11000 },
        riverPerKm: { underground: 30000, surface: 20000, elevated: 20000 },
        station: { underground: { S: 12000, M: 20000, L: 32000 }, elevated: { S: 7000, M: 11000, L: 17000 }, surface: { S: 4000, M: 7000, L: 10000 } },
        demolishPerCell: 40000,
      }),
      economy: Object.assign({}, CM.CFG.economy, { startFunds: 450000, grantBase: [[1990, 22000], [1995, 40000], [2000, 60000], [2005, 120000], [2010, 180000], [2015, 220000], [2020, 250000], [2050, 350000]], debtLimit: -300000, rewardScale: 1.5 }),
      // 城市经济（macro.js）：1990 年地图范围 GDP 约 650 亿元（估算：上海全市约 780 亿元，地图覆盖中心城区与浦东主要开发区）；
      // 1994 年分税制改革前地方财政收入占比很高；浦东开发与金融、贸易中心建设带动 1990 年代起的高速增长
      macro: {
        area: '地图范围（中心城区、浦东主要开发区与近郊）', region: '中国内地',
        gdp0: 7290000, revRatio: [[1990, 0.25], [1994, 0.15], [2003, 0.18], [2010, 0.2], [2020, 0.2], [2040, 0.18]], revElastic: 1.5,
        prod: [[1990, 0.03], [1991, 0.08], [1993, 0.11], [1997, 0.09], [2000, 0.085], [2005, 0.085], [2008, 0.07], [2011, 0.06], [2015, 0.05], [2019, 0.045], [2025, 0.032], [2035, 0.02], [2050, 0.014], [2080, 0.012]],
        infl: 'cn', longRun: { infl: 0.02 }, histEnd: 2020, ref: 'cn',
        struct: { trade: 0.75, fin: 0.65, ind: 0.6, tour: 0.5, prop: 0.65 },
        events: [
          { id: 'pudong1990', y: 1990, m: 4, kind: 'open', scope: '本地', title: '浦东开发开放', desc: '浦东新区设立，外资、金融与贸易机构大量进入，上海重新成为全国的经济中心。', lv: [0.002, 0.006, 0.012, 0.018, 0.022, 0.024], keep: true },
          { id: 'nanxun1992', y: 1992, m: 1 },
          { id: 'tight1993', y: 1993, m: 6 },
          { id: 'asia1997', y: 1997, m: 7, scale: 0.6 },
          { id: 'wto2001', y: 2001, m: 12 },
          { id: 'sars2003', y: 2003, m: 4, scale: 0.4 },
          { id: 'tight2004', y: 2004, m: 4 },
          { id: 'gfc2008', y: 2008, m: 9, desc: '外贸与航运骤降，上海的出口制造业与港口受到明显冲击。' },
          { id: 'stim2008', y: 2008, m: 11 },
          { id: 'expo2010', y: 2010, m: 5, kind: 'boom', scope: '本地', title: '世博会', desc: '世博会带动旅游、会展与城市更新，园区周边加快开发。', lv: [0.004, 0.003, 0] },
          { id: 'cnstock2015', y: 2015, m: 6 },
          { id: 'trade2018', y: 2018, m: 7 },
          { id: 'covid2020', y: 2020, m: 1, scale: 0.8 },
        ],
      },
    },
    cam: { cx: 207, cy: 128, zoom: 16 },
  });

  // 补充热点地区（2026-11-12）：知名但此前未列入「重要设施」的地点。
  // 坐标取自 OSM 底图同名点，缺失时按经纬度投影；规模按同城同类设施的中低档取值。
  // 追加在数组末尾，不打乱既有设施顺序；引擎按 id 生成缓存键，旧存档不受影响。
  (function (data) {
    data.facilities.push(
      { id: 'sh_hot_1', n: '上海科技馆', t: 'scenic', at: [231, 135.6], y0: 2001, w: 0.018, note: '2001 年开放，浦东世纪大道' },
      { id: 'sh_hot_2', n: '武康路历史风貌区', t: 'scenic', at: llW(31.208, 121.437), w: 0.014, note: '衡复历史风貌区的代表街区' },
      { id: 'sh_hot_3', n: '朱家角古镇', t: 'scenic', at: [45.8, 184.7], y0: 2000, w: 0.014, note: '青浦江南水乡古镇' },
    );
  })(CM.MAP_LIST.find(function (m) { return m.id === 'sh'; }).data);

  // 热点地区调整（2026-11-12）：市中心合并 + 外围补充。
  // 代表设施保留原 id；被合并设施从数组移除，需求按 w/pax 叠加。
  // 市中心按传统老城中心半径 24 格聚类，3 格内相邻设施并入代表设施；
  // 接驳口 / 跑道 / 有停用年 / 铁路与机场枢纽不参与合并；外围补充见下方 push。
  (function (data) {
    var fs = data.facilities, drop = {'sh_gt':1,'sh_rmgy':1,'sh_renji':1,'sh_bund':1,'sh_bundv':1,'sh_icc':1,'sh_ljz':1,'sh_pearl':1,'sh_yy':1,'sh_njxc':1,'sh_mbcc':1,'sh_tzf':1,'sh_hongkou':1,'sh_expoctr':1};
    for (var i = fs.length - 1; i >= 0; i--) if (drop[fs[i].id]) fs.splice(i, 1);
    var upd = {
      'sh_museum': { w: 0.022, note: '上海博物馆与上海大剧院的参观和演出需求。' },
      'sh_njd': { w: 0.096, note: "市中心热点合并：含 仁济医院、外滩金融区、外滩（需求并入本设施，位置以本设施为准）" },
      'sh_zd': { w: 0.058, note: "市中心热点合并：含 上海国际会议中心、陆家嘴金融贸易区、东方明珠（需求并入本设施，位置以本设施为准）" },
      'sh_yuyuan': { w: 0.054, note: "市中心热点合并：含 豫园（需求并入本设施，位置以本设施为准）" },
      'sh_njx': { note: "市中心热点合并：含 南京西路商务区（需求并入本设施，位置以本设施为准）" },
      'sh_cnpav': { w: 0.014, note: "市中心热点合并：含 世博文化中心（需求并入本设施，位置以本设施为准）" },
      'sh_ruijin': { w: 0.066, note: "市中心热点合并：含 田子坊（需求并入本设施，位置以本设施为准）" },
      'sh_luxun': { w: 0.018, note: "市中心热点合并：含 虹口足球场（需求并入本设施，位置以本设施为准）" },
      'sh_jingan': { w: 0.016, note: "市中心热点合并：含 上海展览中心（需求并入本设施，位置以本设施为准）" },
    };
    for (var j = 0; j < fs.length; j++) { var u = upd[fs[j].id]; if (u) for (var k in u) fs[j][k] = u[k]; }
    data.facilities.push(
      { id: 'sh_outer_1', n: '上海国际赛车场', t: 'stadium', at: [109.7, 83.4], y0: 2004, w: 0.016, note: '2004 年启用，嘉定安亭 F1 赛道' },
      { id: 'sh_outer_2', n: '佘山·上海欢乐谷', t: 'scenic', at: [109.7, 189.5], y0: 2009, w: 0.016, note: '2009 年欢乐谷开园，松江佘山' },
      { id: 'sh_outer_3', n: '滴水湖·上海天文馆', t: 'scenic', at: [377.941, 272.467], y0: 2021, w: 0.014, note: '2021 年上海天文馆开放，临港' },
      { id: 'sh_outer_4', n: '枫泾古镇', t: 'scenic', at: [45, 286.8], y0: 2000, w: 0.012, note: '金山沪浙交界的水乡古镇' },
      { id: 'sh_outer_5', n: '古猗园·南翔', t: 'scenic', at: [148.7, 111], w: 0.012, note: '明代江南园林，南翔古镇' },
      { id: 'sh_outer_6', n: '金山城市沙滩', t: 'park', at: llW(30.718, 121.350), w: 0.01, note: '金山卫滨海休闲带' },
    );
    // 商业中心恢复：只保留市中心核心商圈，由手工配置，不参与片区自动生成。
    data.facilities.push(
      { id: 'sh_cc_njd', n: '南京东路商圈', t: 'shop', at: llW(31.2365, 121.4790), w: 0.08 },
      { id: 'sh_cc_njx', n: '南京西路商圈', t: 'shop', at: llW(31.2290, 121.4560), w: 0.05 },
      { id: 'sh_cc_hh', n: '淮海中路商圈', t: 'shop', at: llW(31.2185, 121.4630), w: 0.05 },
      { id: 'sh_cc_xjh', n: '徐家汇商圈', t: 'shop', at: llW(31.1950, 121.4365), w: 0.05 },
      { id: 'sh_cc_yuyuan', n: '豫园商圈', t: 'shop', at: llW(31.2275, 121.4920), w: 0.03 },
      { id: 'sh_cc_wjc', n: '五角场商圈', t: 'shop', at: llW(31.3000, 121.5145), w: 0.035 },
      { id: 'sh_cc_zd', n: '陆家嘴商圈', t: 'shop', at: llW(31.2365, 121.5020), w: 0.03 },
      { id: 'sh_cc_zsgy', n: '中山公园商圈', t: 'shop', at: llW(31.2210, 121.4170), w: 0.025 },
      { id: 'sh_cc_xtd', n: '新天地商圈', t: 'shop', at: llW(31.2190, 121.4750), w: 0.02 },
      { id: 'sh_cc_scb', n: '四川北路商圈', t: 'shop', at: llW(31.2620, 121.4830), w: 0.025 },
    );
    // 新增真实设施（不使用片区自动生成）。
    data.facilities.push(
      { id: 'sh_poi_qibao', n: '七宝老街', t: 'scenic', at: llW(31.156, 121.349), w: 0.014 },
      { id: 'sh_poi_zhaojia', n: '召稼楼古镇', t: 'scenic', at: llW(31.055, 121.560), w: 0.012 },
      { id: 'sh_poi_liantang', n: '练塘古镇', t: 'scenic', at: llW(30.990, 121.050), w: 0.010 },
      { id: 'sh_poi_guangfulin', n: '广富林文化遗址', t: 'scenic', at: llW(31.050, 121.220), w: 0.014, y0: 2018 },
      { id: 'sh_poi_shanghaiyu', n: '上海之鱼', t: 'park', at: llW(30.940, 121.480), w: 0.012, y0: 2018 },
      { id: 'sh_poi_jiukeshu', n: '九棵树未来艺术中心', t: 'venue', at: llW(30.940, 121.490), w: 0.010, y0: 2019 },
      { id: 'sh_poi_chenshan', n: '辰山植物园', t: 'park', at: llW(31.080, 121.180), w: 0.014, y0: 2010 },
      { id: 'sh_poi_bayforest', n: '海湾国家森林公园', t: 'park', at: llW(30.850, 121.550), w: 0.012, y0: 2004 },
      { id: 'sh_poi_wusong', n: '吴淞炮台湾湿地公园', t: 'park', at: llW(31.400, 121.500), w: 0.012 },
      { id: 'sh_poi_glass', n: '上海玻璃博物馆', t: 'scenic', at: llW(31.330, 121.490), w: 0.010, y0: 2011 },
      { id: 'sh_poi_navigation', n: '中国航海博物馆', t: 'scenic', at: llW(30.900, 121.900), w: 0.012, y0: 2010 },
      { id: 'sh_poi_nature', n: '上海自然博物馆', t: 'scenic', at: llW(31.240, 121.460), w: 0.014, y0: 2015 },
      { id: 'sh_poi_tianzifang', n: '田子坊', t: 'scenic', at: llW(31.210, 121.470), w: 0.012 },
      { id: 'sh_poi_sinan', n: '思南公馆', t: 'scenic', at: llW(31.220, 121.470), w: 0.010 },
      { id: 'sh_poi_1933', n: '1933老场坊', t: 'scenic', at: llW(31.250, 121.490), w: 0.010 },
      { id: 'sh_poi_m50', n: 'M50创意园', t: 'scenic', at: llW(31.250, 121.450), w: 0.010 },
      { id: 'sh_poi_film', n: '上海影视乐园', t: 'scenic', at: llW(31.030, 121.310), w: 0.010, y0: 1999 },
      { id: 'sh_poi_changxing', n: '长兴岛郊野公园', t: 'park', at: llW(31.450, 121.700), w: 0.010, y0: 2016 },
      { id: 'sh_jiading_auto', n: '嘉定汽车城', t: 'cbd', at: [90, 95], y0: 2001, w: 0.018 },
      { id: 'sh_expo_park', n: '世博公园', t: 'park', at: [209, 154], y0: 2010, w: 0.016 },
      { id: 'sh_xihongqiao', n: '西虹桥', t: 'cbd', at: [130, 150], y0: 2010, w: 0.014 },
      { id: 'sh_xujing', n: '徐泾', t: 'cbd', at: [128.1, 156.5], y0: 2000, w: 0.012 },
      { id: 'sh_anting', n: '安亭', t: 'cbd', at: [86.8, 102.6], y0: 1990, w: 0.014 },
      { id: 'sh_oriental_land', n: '东方绿舟', t: 'park', at: [31.7, 189.3], y0: 2002, w: 0.012 },
      { id: 'sh_nanxiang_old', n: '南翔老街', t: 'scenic', at: [148, 108], w: 0.010 },
      { id: 'sh_jiangqiao_comm', n: '江桥北虹桥', t: 'cbd', at: [155.7, 118.8], y0: 2000, w: 0.012 },
      { id: 'sh_jiuting_comm', n: '九亭社区', t: 'cbd', at: [149.7, 174.4], w: 0.010 },
      { id: 'sh_sijing_old', n: '泗泾古镇', t: 'scenic', at: [127.6, 180.5], w: 0.010 },
      { id: 'sh_nanqiao_comm', n: '南桥新城', t: 'cbd', at: [198.9, 275.5], y0: 2000, w: 0.014 },
      { id: 'sh_zhoupu_comm', n: '周浦社区', t: 'cbd', at: [243.2, 182.4], w: 0.010 },
      { id: 'sh_kangqiao_comm', n: '康桥社区', t: 'cbd', at: [266.3, 173.9], w: 0.010 },
      { id: 'sh_gaoqiao_old', n: '高桥古镇', t: 'scenic', at: [243.4, 81.7], w: 0.010 },
      { id: 'sh_chuansha_old', n: '川沙古镇', t: 'scenic', at: [290, 150], w: 0.012 },
      { id: 'sh_zhuqiao_comm', n: '祝桥社区', t: 'cbd', at: [312.5, 181.9], w: 0.010 },
      { id: 'sh_hangtou_comm', n: '航头社区', t: 'cbd', at: [247.9, 218.1], w: 0.010 },
      { id: 'sh_xinchang_old', n: '新场古镇', t: 'scenic', at: [273.1, 221.3], w: 0.010 },
      { id: 'sh_datuan_comm', n: '大团社区', t: 'cbd', at: [309.1, 245.7], w: 0.010 },
      { id: 'sh_nicheng_comm', n: '泥城社区', t: 'cbd', at: [340.5, 275.1], w: 0.010 },
      { id: 'sh_shuyuan_comm', n: '书院社区', t: 'cbd', at: [354.9, 240.2], w: 0.010 },
      { id: 'sh_wanxiang_comm', n: '万祥社区', t: 'cbd', at: [334.8, 244.7], w: 0.010 },
      { id: 'sh_laogang_comm', n: '老港社区', t: 'cbd', at: [344.1, 215.4], w: 0.010 },
      { id: 'sh_bulk_002', n: '唐镇', t: 'cbd', at: [274.1, 138.1], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_004', n: '三岔港', t: 'cbd', at: [217.9, 68.7], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_005', n: '枫泾镇', t: 'cbd', at: [29.9, 282.1], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_006', n: '莘庄镇', t: 'cbd', at: [168.1, 184.1], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_007', n: '合庆镇', t: 'cbd', at: [299.7, 127.9], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_008', n: '新寺镇', t: 'scenic', at: [199.6, 293.1], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_009', n: '芦潮港', t: 'cbd', at: [348.3, 283.5], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_010', n: '周浦镇', t: 'cbd', at: [243.2, 182.4], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_011', n: '罗泾镇', t: 'cbd', at: [148.9, 23.8], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_012', n: '徐行镇', t: 'cbd', at: [131, 48.8], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_013', n: '朱家角镇', t: 'cbd', at: [41.8, 187], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_014', n: '上海游泳馆', t: 'scenic', at: [192.2, 153.6], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_015', n: '大场镇', t: 'cbd', at: [182.9, 106.1], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_017', n: '罗店镇', t: 'cbd', at: [159.7, 58.2], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_018', n: '高境镇', t: 'cbd', at: [208, 90.9], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_019', n: '庙行镇', t: 'scenic', at: [187.2, 87.5], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_020', n: '淞南镇', t: 'cbd', at: [210.6, 79], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_021', n: '月浦镇', t: 'cbd', at: [184.8, 47.1], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_022', n: '杨行镇', t: 'cbd', at: [191.1, 71.7], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_023', n: '九亭镇', t: 'cbd', at: [149.7, 174.4], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_024', n: '陈家镇', t: 'cbd', at: [341.3, 0.1], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_025', n: '新浜镇', t: 'cbd', at: [50.2, 262.4], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_028', n: '浦航新城', t: 'cbd', at: [230.2, 211.3], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_029', n: '吴泾镇', t: 'cbd', at: [197.6, 215.8], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_030', n: '塘湾', t: 'cbd', at: [192.5, 208.3], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_031', n: '奉城镇', t: 'cbd', at: [270.4, 271.1], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_032', n: '四团镇', t: 'cbd', at: [299.6, 259.8], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_033', n: '金汇镇', t: 'cbd', at: [215.3, 237.6], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_034', n: '大团镇', t: 'cbd', at: [309.1, 245.7], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_035', n: '川沙新镇', t: 'cbd', at: [289.6, 147.4], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_036', n: '高东镇', t: 'cbd', at: [261.4, 88.3], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_037', n: '三林镇', t: 'cbd', at: [215.5, 168.6], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_038', n: '高行镇', t: 'cbd', at: [255.3, 103.4], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_039', n: '张江镇', t: 'cbd', at: [258.2, 142.1], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_040', n: '北蔡镇', t: 'cbd', at: [235.4, 152.4], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_041', n: '惠南镇', t: 'cbd', at: [309.6, 211.8], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_042', n: '新场镇', t: 'cbd', at: [273.1, 221.3], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_043', n: '航头镇', t: 'cbd', at: [247.9, 218.1], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_044', n: '泥城镇', t: 'cbd', at: [340.5, 275.1], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_045', n: '万祥镇', t: 'cbd', at: [334.8, 244.7], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_046', n: '老港镇', t: 'cbd', at: [344.1, 215.4], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_047', n: '海湾镇', t: 'cbd', at: [240.4, 294.4], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_048', n: '柘林镇', t: 'cbd', at: [204.5, 307.9], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_049', n: '梅陇镇', t: 'cbd', at: [186.7, 187.7], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_050', n: '朱泾镇', t: 'cbd', at: [87.7, 277.4], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_051', n: '廊下镇', t: 'cbd', at: [97.7, 325.4], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_052', n: '张堰镇', t: 'cbd', at: [137.8, 320.5], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_053', n: '庄行镇', t: 'cbd', at: [175.5, 276.4], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_054', n: '亭林镇', t: 'cbd', at: [143.6, 284.8], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_055', n: '叶榭镇', t: 'cbd', at: [146.2, 257.7], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_056', n: '佘山镇', t: 'cbd', at: [90.9, 190.7], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_057', n: '小昆山镇', t: 'cbd', at: [76.7, 216.5], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_058', n: '泖港镇', t: 'cbd', at: [105.6, 262.3], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_059', n: '泗泾镇', t: 'cbd', at: [127.6, 180.5], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_060', n: '洞泾镇', t: 'cbd', at: [126.8, 196.5], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_061', n: '石湖荡镇', t: 'scenic', at: [69.7, 239.7], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_062', n: '泰晤士小镇', t: 'cbd', at: [98.7, 218.3], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_063', n: '车墩镇', t: 'cbd', at: [144.2, 226.1], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_066', n: '海湾', t: 'cbd', at: [233.1, 293.8], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_068', n: '白鹤镇', t: 'cbd', at: [78.8, 118.3], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_074', n: '中兴镇', t: 'cbd', at: [312.8, 1.1], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_075', n: '向化镇', t: 'cbd', at: [299.8, 2.6], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_076', n: '长兴镇', t: 'cbd', at: [288.5, 60.4], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_077', n: '安亭镇', t: 'cbd', at: [86.8, 102.6], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_079', n: '徐泾镇', t: 'cbd', at: [128.1, 156.5], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_080', n: '华新镇', t: 'cbd', at: [110.8, 124.2], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_081', n: '重固镇', t: 'cbd', at: [92, 144.2], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_082', n: '练塘镇', t: 'cbd', at: [44.3, 232.9], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_087', n: '漕泾镇', t: 'cbd', at: [180.6, 323.9], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_088', n: '山阳镇', t: 'cbd', at: [159.9, 338.2], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_089', n: '金山卫镇', t: 'cbd', at: [145.2, 354.3], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_092', n: '海洋庙', t: 'scenic', at: [99, 120.8], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_095', n: '书院镇', t: 'cbd', at: [354.9, 240.2], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_096', n: '锦江乐园', t: 'scenic', at: [181.9, 170], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_100', n: '何家湾', t: 'cbd', at: [214, 82.3], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_101', n: '张庙', t: 'scenic', at: [204.2, 87.6], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_102', n: '江湾', t: 'cbd', at: [206.8, 100.4], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_103', n: '港口', t: 'cbd', at: [195.5, 169.6], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_105', n: '黄兴公园', t: 'park', at: [227.3, 102], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_106', n: '松江体育中心', t: 'venue', at: [112.1, 225.8], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_108', n: '上海图书馆', t: 'scenic', at: [193.3, 140.9], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_110', n: '江湾体育场', t: 'cbd', at: [220.1, 98.9], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_111', n: '新江湾城', t: 'cbd', at: [217.2, 87.5], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_112', n: '桂林公园', t: 'park', at: [184, 159], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_113', n: '国际客运中心', t: 'venue', at: [214, 122.2], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_114', n: '江浦公园', t: 'park', at: [223.7, 115.9], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_115', n: '复兴岛', t: 'scenic', at: [238, 108.6], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_116', n: '自然博物馆', t: 'scenic', at: [200.3, 128.6], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_119', n: '上海儿童医学中心', t: 'venue', at: [223.8, 142.6], w: 0.006, note: 'OSM 地点补充' },
      { id: 'sh_bulk_120', n: '淀山湖大道', t: 'scenic', at: [55.5, 173.5], w: 0.006, note: 'OSM 地点补充' },
    );
  })(CM.MAP_LIST.find(function (m) { return m.id === 'sh'; }).data);

  // 大学、公园、商场补充（不生成村相关设施）。
  (function (data) {
    data.facilities.push(
      { id: 'sh_uni_sjtu', n: '上海交通大学闵行校区', t: 'uni', at: [190, 225], w: 0.016 },
      { id: 'sh_uni_fudan', n: '复旦大学江湾校区', t: 'uni', at: [217, 84], w: 0.016 },
      { id: 'sh_uni_tongji', n: '同济大学嘉定校区', t: 'uni', at: [106, 110], w: 0.016 },
      { id: 'sh_uni_ecnu', n: '华东师范大学闵行校区', t: 'uni', at: [198, 221], w: 0.016 },
      { id: 'sh_uni_shu', n: '上海大学宝山校区', t: 'uni', at: [175, 92], w: 0.016 },
      { id: 'sh_uni_usst', n: '上海理工大学', t: 'uni', at: [220, 106], w: 0.014 },
      { id: 'sh_uni_smu', n: '上海海事大学临港校区', t: 'uni', at: [369, 287], w: 0.014 },
      { id: 'sh_uni_shou', n: '上海海洋大学临港校区', t: 'uni', at: [365, 287], w: 0.014 },
      { id: 'sh_uni_suep', n: '上海电力大学临港校区', t: 'uni', at: [376, 278], w: 0.012 },
      { id: 'sh_uni_sdju', n: '上海电机学院临港校区', t: 'uni', at: [372, 291], w: 0.012 },
      { id: 'sh_uni_suibe', n: '上海对外经贸大学松江校区', t: 'uni', at: [102, 212], w: 0.014 },
      { id: 'sh_uni_sues', n: '上海工程技术大学松江校区', t: 'uni', at: [110, 207], w: 0.014 },
      { id: 'sh_uni_ecupl', n: '华东政法大学松江校区', t: 'uni', at: [98, 211], w: 0.014 },
      { id: 'sh_uni_shnu', n: '上海师范大学奉贤校区', t: 'uni', at: [217, 269], w: 0.014 },
      { id: 'sh_uni_sit', n: '上海应用技术大学奉贤校区', t: 'uni', at: [217, 265], w: 0.014 },
      { id: 'sh_uni_sada', n: '上海视觉艺术学院', t: 'uni', at: [102, 207], w: 0.012 },
      { id: 'sh_uni_sta', n: '上海戏剧学院', t: 'uni', at: [198, 137], w: 0.012 },
      { id: 'sh_uni_shcm', n: '上海音乐学院', t: 'uni', at: [198, 135], w: 0.012 },
      { id: 'sh_park_renmin', n: '人民公园', t: 'park', at: [206, 132], w: 0.012 },
      { id: 'sh_park_fuxing', n: '复兴公园', t: 'park', at: [206, 136], w: 0.010 },
      { id: 'sh_park_jingansculpture', n: '静安雕塑公园', t: 'park', at: [202, 128], w: 0.010 },
      { id: 'sh_park_xujiahui', n: '徐家汇公园', t: 'park', at: [194, 150], w: 0.010 },
      { id: 'sh_park_yanzhong', n: '延中绿地', t: 'park', at: [206, 132], w: 0.010 },
      { id: 'sh_park_taipingqiao', n: '太平桥公园', t: 'park', at: [209, 136], w: 0.010 },
      { id: 'sh_park_houtan', n: '后滩公园', t: 'park', at: [209, 154], w: 0.012 },
      { id: 'sh_park_bailianjing', n: '白莲泾公园', t: 'park', at: [217, 150], w: 0.010 },
      { id: 'sh_park_jinqiao', n: '金桥公园', t: 'park', at: [255, 123], w: 0.010 },
      { id: 'sh_park_zhangjiang', n: '张江主题公园', t: 'park', at: [255, 145], w: 0.010 },
      { id: 'sh_park_gucun', n: '宝山郊野公园', t: 'park', at: [179, 79], w: 0.014 },
      { id: 'sh_park_daning', n: '大宁公园', t: 'park', at: [198, 110], w: 0.012 },
      { id: 'sh_park_minhang', n: '闵行体育公园', t: 'park', at: [171, 167], w: 0.012 },
      { id: 'sh_park_botanical', n: '上海植物园', t: 'park', at: [198, 167], w: 0.014 },
      { id: 'sh_park_qingxi', n: '青西郊野公园', t: 'park', at: [26, 199], w: 0.012 },
      { id: 'sh_res_lianyang', n: '联洋社区', t: 'res', at: [235, 132], w: 0.008 },
      { id: 'sh_res_biyun', n: '碧云社区', t: 'res', at: [247, 128], w: 0.008 },
      { id: 'sh_res_gubei', n: '古北社区', t: 'res', at: [179, 145], w: 0.008 },
      { id: 'sh_res_caoyang', n: '曹杨社区', t: 'res', at: [179, 128], w: 0.008 },
      { id: 'sh_res_quyang', n: '曲阳社区', t: 'res', at: [217, 110], w: 0.008 },
      { id: 'sh_res_daning', n: '大宁社区', t: 'res', at: [198, 110], w: 0.008 },
      { id: 'sh_res_liangcheng', n: '凉城社区', t: 'res', at: [206, 101], w: 0.008 },
      { id: 'sh_res_kongjiang', n: '控江社区', t: 'res', at: [223, 110], w: 0.008 },
      { id: 'sh_res_siping', n: '四平社区', t: 'res', at: [217, 110], w: 0.008 },
      { id: 'sh_res_hongqiao', n: '虹桥社区', t: 'res', at: [183, 145], w: 0.008 },
      { id: 'sh_res_xianxia', n: '仙霞社区', t: 'res', at: [179, 141], w: 0.008 },
      { id: 'sh_res_tianshan', n: '天山社区', t: 'res', at: [183, 137], w: 0.008 },
      { id: 'sh_res_changfeng', n: '长风社区', t: 'res', at: [179, 132], w: 0.008 },
      { id: 'sh_res_changshou', n: '长寿社区', t: 'res', at: [194, 128], w: 0.008 },
      { id: 'sh_res_ganquan', n: '甘泉社区', t: 'res', at: [190, 114], w: 0.008 },
      { id: 'sh_res_zhenru', n: '真如社区', t: 'res', at: [183, 123], w: 0.008 },
      { id: 'sh_res_taopu', n: '桃浦社区', t: 'res', at: [163, 110], w: 0.008 },
      { id: 'sh_res_jiangwan', n: '江湾社区', t: 'res', at: [209, 96], w: 0.008 },
      { id: 'sh_res_xinjiangwan', n: '新江湾社区', t: 'res', at: [220, 88], w: 0.008 },
      { id: 'sh_res_jinqiao', n: '金桥社区', t: 'res', at: [255, 123], w: 0.008 },
      { id: 'sh_res_zhangjiang', n: '张江社区', t: 'res', at: [255, 145], w: 0.008 },
      { id: 'sh_res_huamu', n: '花木社区', t: 'res', at: [235, 145], w: 0.008 },
      { id: 'sh_res_yangjing', n: '洋泾社区', t: 'res', at: [235, 128], w: 0.008 },
      { id: 'sh_res_tangqiao', n: '塘桥社区', t: 'res', at: [224, 141], w: 0.008 },
      { id: 'sh_res_nanmatou', n: '南码头社区', t: 'res', at: [217, 145], w: 0.008 },
      { id: 'sh_res_zhoujiadu', n: '周家渡社区', t: 'res', at: [217, 154], w: 0.008 },
      { id: 'sh_res_sanlin', n: '三林社区', t: 'res', at: [217, 167], w: 0.008 },
      { id: 'sh_res_beicai', n: '北蔡社区', t: 'res', at: [239, 154], w: 0.008 },
      { id: 'sh_res_pujiang', n: '浦江社区', t: 'res', at: [188, 230], w: 0.008 },
      { id: 'sh_res_wujing', n: '吴泾社区', t: 'res', at: [183, 225], w: 0.008 },
      { id: 'sh_res_maqiao', n: '马桥社区', t: 'res', at: [170, 230], w: 0.008 },
      { id: 'sh_res_jiangchuan', n: '江川社区', t: 'res', at: [178, 236], w: 0.008 },
      { id: 'sh_res_dachang', n: '大场社区', t: 'res', at: [176, 100], w: 0.008 },
      { id: 'sh_res_yanghang', n: '杨行社区', t: 'res', at: [184, 86], w: 0.008 },
      { id: 'sh_res_luodian', n: '罗店社区', t: 'res', at: [160, 74], w: 0.008 },
      { id: 'sh_res_yuepu', n: '月浦社区', t: 'res', at: [178, 75], w: 0.008 },
      { id: 'sh_res_wusong', n: '吴淞社区', t: 'res', at: [202, 92], w: 0.008 },
      { id: 'sh_res_xujing', n: '徐泾社区', t: 'res', at: [128, 156], w: 0.008 },
      { id: 'sh_res_xihongqiao', n: '西虹桥社区', t: 'res', at: [132, 150], w: 0.008 },
      { id: 'sh_res_huaxin', n: '华新社区', t: 'res', at: [122, 162], w: 0.008 },
    );
    // 现有社区类设施统一归类为居民区，而不是商务区。
    for (const f of data.facilities) {
      if ((f.id || '').endsWith('_comm') || (f.t === 'cbd' && /社区|家园|小区|苑|坊/.test(f.n || ''))) f.t = 'res';
    }
  })(CM.MAP_LIST.find(function (m) { return m.id === 'sh'; }).data);
})(window.CM);
