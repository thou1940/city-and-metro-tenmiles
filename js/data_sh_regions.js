'use strict';
// 上海全部区划的唯一来源（方案 A）。
// 坐标：先按 WGS-84 填入扩展地图投影，再由 outer-maps.js 统一解析行政边界。
(function (CM) {
  const G = CM.GEO_OUTER && CM.GEO_OUTER.sh;
  if (!G) return;
  const P = G.proj;
  const pt = (lon, lat) => [(lon - P.lon0) * P.kx, (P.lat0 - lat) * P.ky];
  const gcjPt = (lat, lon) => {
    const w = CM.U.gcj2wgs(lat, lon);
    return pt(w[1], w[0]);
  };
  const gcjPoly = rows => rows.map(([lat, lon]) => gcjPt(lat, lon));
  const wgsPoly = rows => rows.map(([lon, lat]) => pt(lon, lat));

  const townGrowth = { initial: 0.22, early: 0.28, mature: 0.72 };

  CM.SH_REGIONS = [
    // ===== 江苏 / 浙江 =====
    { id: 'sh-kunshan', name: '昆山市', open: 2006, plan: 'newtown', pop: 18e6, adminName: '昆山市', bounds: [120.94, 31.30, 121.16, 31.45], demography: { initial: 0.15, early: 0.23, mature: 0.65 } },
    { id: 'sh-taicang', name: '太仓市', open: 2000, plan: 'newtown', pop: 8e6, adminName: '太仓市', bounds: [121.05, 31.35, 121.25, 31.52], demography: { initial: 0.15, early: 0.25, mature: 0.68 } },

    // ===== 上海外围 =====
    { id: 'sh-qingpu', name: '青浦区', open: 2000, plan: 'newtown', pop: 15e6, adminName: '青浦区', bounds: [120.95, 31.05, 121.30, 31.23], demography: { initial: 0.10, early: 0.20, mature: 0.60 } },
    { id: 'sh-songjiang', name: '松江区', open: 1997, plan: 'newtown', pop: 13.5e6, adminName: '松江区', bounds: [121.15, 30.99, 121.32, 31.16], demography: townGrowth },
    { id: 'sh-jinshan', name: '金山区', open: 2000, plan: 'ind', pop: 17e6, adminName: '金山区', bounds: [121.21, 30.706, 121.44, 30.83], demography: townGrowth },
    { id: 'sh-fengxian', name: '奉贤区', open: 2000, plan: 'newtown', pop: 15.5e6, adminName: '奉贤区', bounds: [121.40, 30.88, 121.59, 31.02], demography: townGrowth },
    { id: 'sh-jiaxing', name: '嘉兴', open: 2000, plan: 'newtown', pop: 14e6, poly: wgsPoly([[120.93,30.696],[121.28,30.696],[121.28,30.82],[121.20,30.95],[121.10,31.05],[120.93,31.05]]), bounds: [120.93, 30.68, 121.28, 30.90], demography: townGrowth },
    { id: 'baoshan', name: '宝山区', open: 1995, plan: 'resind', pop: 20e6, adminName: '宝山区', bounds: [121.32, 31.28, 121.55, 31.45], demography: townGrowth },


    // ===== 功能区 / 特殊用地 =====
    { id: 'airport', name: '虹桥机场（长宁/闵行）', open: 1990, plan: 'res', poly: gcjPoly([[31.2160, 121.3285], [31.2160, 121.3500], [31.1790, 121.3500], [31.1790, 121.3285]]), note: '民用机场照常运营，用地不开发；范围内可以地下设站与地下穿越' },
    { id: 'lujiazui', name: '浦东新区·陆家嘴金融贸易区', open: 1993, plan: 'cbd', poly: gcjPoly([[31.2455, 121.4960], [31.2455, 121.5130], [31.2330, 121.5200], [31.2275, 121.5110], [31.2300, 121.4990]]), note: '1990 年浦东开发开放，1993 年起陆家嘴金融贸易区大规模建设（史实）' },
    { id: 'hqcbd', name: '虹桥商务区（长宁/闵行）', open: 2009, plan: 'cbd', poly: gcjPoly([[31.2100, 121.3100], [31.2100, 121.3280], [31.1830, 121.3280], [31.1830, 121.3100]]), note: '2010 年虹桥综合交通枢纽启用，周边建设虹桥商务区（史实）' },
    { id: 'disney', name: '浦东新区·上海迪士尼度假区', park: true, open: 2016, plan: 'res', poly: gcjPoly([[31.1506, 121.6497], [31.1506, 121.6626], [31.1455, 121.6697], [31.1375, 121.6697], [31.1375, 121.6557], [31.1411, 121.6497]]), note: '2016 年 6 月上海迪士尼乐园开园（史实）；同年 4 月地铁 11 号线迪士尼站启用（史实）' },

    // ===== 中心城区 =====
    { id: 'huangpu', name: '黄浦区', district: ['黄浦区'], open: 1990, plan: 'oldmix' },
    { id: 'jingan', name: '静安区', district: ['静安区'], open: 1990, plan: 'mix' },
    { id: 'xuhui', name: '徐汇区', district: ['徐汇区'], open: 1990, plan: 'mix' },
    { id: 'changning', name: '长宁区', district: ['长宁区'], open: 1990, plan: 'res' },
    { id: 'putuo', name: '普陀区', district: ['普陀区'], open: 1992, plan: 'resind' },
    { id: 'hongkou', name: '虹口区', district: ['虹口区'], open: 1990, plan: 'oldmix' },
    { id: 'yangpu', name: '杨浦区', district: ['杨浦区'], open: 1992, plan: 'resind' },

    // ===== 浦东新区 =====
    { id: 'pdriver', name: '浦东新区·沿江', streets: ['潍坊新村街道', '陆家嘴街道', '塘桥街道', '洋泾街道', '南码头路街道', '周家渡街道', '上钢新村街道', '东明路街道', '浦兴路街道', '沪东新村街道', '金杨新村街道', '北蔡镇', '三林镇', '花木街道'], open: 1992, plan: 'resind' },
    { id: 'waigaoqiao', name: '浦东新区·金桥外高桥曹路', streets: ['金桥镇', '高桥镇', '高行镇', '高东镇', '曹路镇'], open: 1994, plan: 'ind', pop: 15e6, poly: wgsPoly([[121.58,31.31],[121.94,31.31],[121.94,31.40],[121.58,31.40]]), note: '金桥出口加工区、外高桥保税区与曹路（史实）' },
    { id: 'zhangjiang', name: '浦东新区·张江', streets: ['张江镇', '唐镇'], open: 1994, plan: 'ind', pop: 7.5e6, note: '张江高科技园区（史实）' },
    { id: 'kangqiao', name: '浦东新区·周康', streets: ['康桥镇', '周浦镇'], open: 2000, plan: 'res', pop: 8e6 },
    { id: 'chuansha', name: '浦东新区·川沙', streets: ['川沙新镇', '合庆镇'], open: 2000, plan: 'res', pop: 10.3e6, note: '1993 年川沙县并入浦东新区；1999 年浦东国际机场在其东侧建成（史实）' },
    { id: 'pudong', name: '浦东新区·其他', open: 2005, plan: 'res', pop: 12.35e6 },

    // ===== 闵行 / 嘉定 =====
    { id: 'minhang', name: '闵行区', open: 1996, plan: 'res', pop: 20.5e6, adminName: '闵行区', bounds: [121.29, 30.95, 121.55, 31.28], demography: townGrowth },
    { id: 'jiading', name: '嘉定区', open: 1997, plan: 'newtown', pop: 13.1e6, adminName: '嘉定区', bounds: [121.15, 31.24, 121.35, 31.46], demography: { initial: 0.17, early: 0.25, mature: 0.70 } },
    { id: 'pd-huinan', name: '浦东新区·惠南祝桥（含浦东机场）', open: 2000, plan: 'newtown', pop: 16e6, adminNames: ['惠南镇', '新场镇', '航头镇', '大团镇', '祝桥镇', '宣桥镇'], poly: [wgsPoly([[121.77,31.10],[121.87,31.10],[121.87,31.19],[121.77,31.19]]), wgsPoly([[121.75,31.00],[121.94,31.00],[121.94,31.30],[121.75,31.30]])], bounds: [121.55, 30.95, 121.94, 31.20], demography: townGrowth },
    { id: 'pd-lingang', name: '浦东新区·临港', open: 2003, plan: 'newtown', pop: 14e6, adminNames: ['南汇新城镇', '书院镇', '泥城镇', '万祥镇', '老港镇'], bounds: [121.75, 30.86, 121.95, 31.05], demography: townGrowth },

    // ===== 崇明区（地图北缘，主体在底图外） =====
    { id: 'sh-chongming', name: '崇明区', open: 2000, plan: 'newtown', pop: 5e6, poly: wgsPoly([[121.15,31.35],[121.30,31.39],[121.45,31.41],[121.60,31.40],[121.75,31.37],[121.90,31.34],[121.94,31.38],[121.94,31.528],[121.15,31.528]]), bounds: [121.15, 31.40, 121.94, 31.528], demography: townGrowth }
  ];
})(window.CM);
