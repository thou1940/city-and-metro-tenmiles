'use strict';
// 线路制式、车站规模与站台标准（社区扩展 v2.0）：
// 制式决定车长、编组档位、可选速度与土建标准；车站总体规模决定站厅能力、可达站台长度与可选站台类型；
// 每条线路在每个车站可以分别设置站台长度与站台类型（岛式、侧式、一岛两侧、双岛式）。
// 本模块只做数据与换算，不依赖 metro / sim / ui。
(function (CM) {
  const U = CM.U, CFG = CM.CFG;
  const mc = CFG.metro;
  const S = CM.Std = {};
  S.SYSTEMS = mc.systems;
  S.SYS_ORDER = Object.keys(mc.systems || {});

  S.sys = function (id) { return id && typeof id === 'object' ? id : (mc.systems[id] || mc.systems.metro); };
  S.sysOf = function (line) { return S.sys(line && line.sys); };
  S.sysName = function (id) { return S.sys(id).name; };
  S.lineSysList = function () { return S.SYS_ORDER.map(function (k) { return mc.systems[k]; }).filter(Boolean); };

  // ---------------- 车站规模（只影响站厅容量、造价与运营费，不限制站台长度） ----------------
  S.sizeName = function (size) { return mc.sizeName[size] || size; };
  S.sizeOrder = Object.keys(mc.sizeName);
  S.sizeIndex = function (size) { const o = S.sizeOrder.indexOf(size); return o < 0 ? 1 : o; };
  S.sizeNext = function (size) { const o = S.sizeOrder, i = o.indexOf(size); return i >= 0 && i + 1 < o.length ? o[i + 1] : null; };
  S.sizeAtLeast = function (size, min) { return S.sizeIndex(size) >= S.sizeIndex(min); };

  // ---------------- 站台长度 / 编组 ----------------
  // 站台长度候选：该制式的全部标准长度（不受车站规模限制）
  S.platLensFor = function (size, sys) { return S.sys(sys).platLens.slice(); };
  // 某段站台长度可用的最大编组（只取制式允许的编组档位）
  S.carsFor = function (len, sys) {
    const s = S.sys(sys); let best = 0;
    for (const c of s.consists) if (c * s.carLenM <= (len || 0) + 1e-6 && c > best) best = c;
    return best || s.consists[0];
  };
  S.carsValid = function (len, sys) { return S.sys(sys).consists.indexOf(S.carsFor(len, sys)) >= 0 && S.carsFor(len, sys) * S.sys(sys).carLenM <= (len || 0) + 1e-6; };
  S.lenForCars = function (cars, sys) {
    const s = S.sys(sys), i = s.consists.indexOf(cars);
    return i >= 0 ? s.platLens[i] : s.platLens[0];
  };
  // 站台长度直接按编组节数记录：车站覆盖 > 线路默认 > 旧存档米数换算
  S.pf = function (net, sid, lid) {
    const st = net && net.stations && net.stations[sid], line = net && net.lines && net.lines[lid];
    const sys = S.sysOf(line);
    const o = st && st.pf && st.pf[lid];
    let cars = null;
    if (o && S.sys(sys).consists.indexOf(o.cars) >= 0) cars = o.cars;
    else if (line && S.sys(sys).consists.indexOf(line.platCars) >= 0) cars = line.platCars;
    else {
      // 旧存档：把米数换算成不超过它的最大编组档位
      const legacyLen = o && isFinite(o.len) && o.len > 0 ? o.len : (line && isFinite(line.plat) && line.plat > 0 ? line.plat : 0);
      if (legacyLen > 0) cars = S.carsFor(legacyLen, sys);
      else if (sys.id === 'metro') cars = ({ S: 4, M: 6, L: 8 })[st ? st.size : 'M'] || 8;
      else cars = sys.consists[0];
    }
    return { cars: cars, len: cars * sys.carLenM, sys: sys };
  };
  S.platOf = function (net, sid, lid) { return S.pf(net, sid, lid).len; };
  S.carsOf = function (net, sid, lid) { return S.pf(net, sid, lid).cars; };
  // 线路默认编组节数（站台长度直接按节数记录）
  S.lineCars = function (line) {
    const sys = S.sysOf(line);
    if (line && S.sys(sys).consists.indexOf(line.platCars) >= 0) return line.platCars;
    if (line && isFinite(line.plat) && line.plat > 0) return S.carsFor(line.plat, sys);
    return S.carsFor(sys.defaultPlat, sys);
  };
  // 兼容旧接口：返回默认站台对应的米数，仅供造价/展示换算
  S.linePlat = function (line) { return S.lineCars(line) * S.sysOf(line).carLenM; };
  // 站台长度候选改为编组档位
  S.carsOptions = function (sys) { return S.sys(sys).consists.slice(); };
  // 站厅类型门槛：高铁要求巨大及以上，市域铁路要求大及以上，普通地铁不限
  S.hallReq = function (sys) { return S.sys(sys).minHall || 'S'; };
  S.hallOk = function (size, sys) { return S.sizeIndex(size) >= S.sizeIndex(S.hallReq(sys)); };
  // 车站示意图用：本站各线路站台能停下的最大编组
  S.stationCars = function (st, lines) {
    let n = 0;
    for (const L of lines || []) {
      const sys = S.sysOf(L);
      const o = st && st.pf && st.pf[L.id];
      let cars = o && S.sys(sys).consists.indexOf(o.cars) >= 0 ? o.cars : null;
      if (cars == null) cars = S.lineCars(L);
      n = Math.max(n, cars);
    }
    return n || 4;
  };
  // 一条交路的站台限制：取沿线最小站台编组
  S.routeLimit = function (net, lid, stIds) {
    const line = net && net.lines && net.lines[lid], sys = S.sysOf(line);
    let cars = 99, limitSid = null;
    for (const sid of stIds || []) {
      const p = S.pf(net, sid, lid);
      if (p.cars < cars) { cars = p.cars; limitSid = sid; }
    }
    if (!isFinite(cars) || cars === 99) cars = S.lineCars(line);
    return { sys: sys, sysId: sys.id, cars: cars, platM: cars * sys.carLenM, carCap: sys.carCap, limitSid: limitSid };
  };
  // ---------------- 造价 ----------------
  let ciKey = null, ciVal = 0;
  S.costIndex = function (year) {
    const key = (CM.mapId || '') + ':' + year;
    if (key === ciKey) return ciVal;
    ciVal = (CM.Metro && CM.Metro.costIndex) ? CM.Metro.costIndex(year) : U.priceIndex(year, CFG.cost.inflation, CFG.econBase || 1990) * (CM.Eras ? CM.Eras.finance(year).cost : 1);
    ciKey = key;
    return ciVal;
  };
  // 站台造价：长度 × 每米单价 × 制式倍率（不再区分站台类型）
  S.platformCost = function (type, len, sys, year) {
    const perM = (CFG.cost.platPerM[type] || 0) * (S.sys(sys).platCostMul || 1);
    return Math.max(0, len || 0) * perM * S.costIndex(year || CFG.START.y);
  };
  S.stationCost = function (type, size, year, sysId) {
    const mul = sysId ? S.sys(sysId).stationMul : 1;
    return (CFG.cost.station[type][size] || 0) * S.costIndex(year) * mul;
  };

  // ---------------- 制式解锁与设定 ----------------
  S.sysOpen = function (g, id) {
    const sys = S.sys(id), y = g && g.clock ? g.clock.y : CFG.START.y;
    return { ok: y >= sys.unlockYear, sys: sys, y: y, year: sys.unlockYear };
  };
  S.sysOpenText = function (open) { return open.ok ? '' : open.year + ' 年开放'; };
  S.speedOk = function (sys, kmh) { return (S.sys(sys).speeds || []).indexOf(kmh) >= 0; };
  S.speeds = function (sys) { return S.sys(sys).speeds.slice(); };
  S.buildTypes = function (sys) { return S.sys(sys).buildTypes.slice(); };
  // 换制式：修正不合法的速度与编组档位；车站已有的站台覆盖不静默删除，由评估给出冲突
  S.setLineSystem = function (net, lid, id) {
    const line = net.lines && net.lines[lid];
    if (!line) return { error: '线路不存在' };
    if (!mc.systems[id]) return { error: '未知制式' };
    const sys = S.sys(id), notes = [];
    line.sys = id;
    if (sys.consists.indexOf(line.platCars) < 0) {
      const cars = S.lineCars(Object.assign({}, line, { sys: id }));
      line.platCars = cars; delete line.plat;
      notes.push('站台按' + sys.name + '标准取 ' + cars + ' 节');
    }
    if (line.speed == null || !S.speedOk(sys, line.speed)) {
      line.speed = sys.defaultSpeed; notes.push('运行速度按' + sys.name + '标准取 ' + sys.defaultSpeed + ' km/h');
    }
    let cleared = 0;
    for (const sid in net.segments) {
      const sg = net.segments[sid];
      if (sg.line === lid && sg.speed && !S.speedOk(sys, sg.speed)) { delete sg.speed; cleared++; }
    }
    if (cleared) notes.push('已清除 ' + cleared + ' 个区段的不适用提速设置');
    return { ok: true, sys: sys, notes: notes };
  };
  S.setLinePf = function (net, lid, cars) {
    const line = net.lines && net.lines[lid];
    if (!line) return { error: '线路不存在' };
    const sys = S.sysOf(line);
    if (cars != null && S.sys(sys).consists.indexOf(cars) < 0) return { error: '编组不是该制式的标准档位' };
    if (cars == null) delete line.platCars; else line.platCars = cars;
    delete line.plat;
    return { ok: true };
  };
  // 车站按线路覆盖站台：cars 为 null 时删除覆盖
  S.setStationPf = function (net, sid, lid, cars) {
    const st = net.stations && net.stations[sid];
    if (!st) return { error: '车站不存在' };
    if (!st.pf) st.pf = {};
    const cur = Object.assign({}, st.pf[lid] || {});
    if (cars == null) delete cur.cars; else cur.cars = cars;
    delete cur.len; delete cur.type;
    if (Object.keys(cur).length) st.pf[lid] = cur; else delete st.pf[lid];
    if (!Object.keys(st.pf).length) delete st.pf;
    return { ok: true };
  };
  // 把线路标准应用到本线全部车站（清除车站覆盖）
  S.applyLinePf = function (net, lid) {
    for (const sid in net.stations) {
      const st = net.stations[sid];
      if (st.pf && st.pf[lid]) { delete st.pf[lid]; if (!Object.keys(st.pf).length) delete st.pf; }
    }
    return { ok: true };
  };
  // 站台检查：返回 null 表示合格，否则给出原因
  // 站台检查：站台直接按编组节数记录，必须是该制式的标准档位
  S.checkPf = function (net, sid, lid) {
    const st = net.stations && net.stations[sid], line = net.lines && net.lines[lid];
    if (!st || !line) return null;
    const sys = S.sysOf(line), o = st.pf && st.pf[lid];
    if (o && o.cars != null && S.sys(sys).consists.indexOf(o.cars) < 0) return o.cars + ' 节不是' + sys.name + '的标准编组档位（' + sys.consists.join('/') + ' 节）';
    if (line.platCars != null && S.sys(sys).consists.indexOf(line.platCars) < 0) return '本线默认编组 ' + line.platCars + ' 节不是' + sys.name + '的标准档位';
    return null;
  };
})(window.CM);
