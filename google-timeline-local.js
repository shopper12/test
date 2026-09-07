const BUILD = "GOOGLE_TIMELINE_LOCAL_20260908_V1";

const state = {
  parsed: null,
  sourceName: "",
  activeDay: 1,
  map: null,
  backgroundLayer: null,
};

const esc = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
}[char]));

function finite(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function coordinate(value) {
  if (!value) return null;
  if (typeof value === "string") {
    const match = value.match(/(?:geo:)?\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/i);
    return match ? validCoordinate(Number(match[1]), Number(match[2])) : null;
  }
  if (value.latLng) return coordinate(value.latLng);
  if (value.point) return coordinate(value.point);

  let lat = finite(value.lat ?? value.latitude);
  let lng = finite(value.lng ?? value.lon ?? value.longitude);
  if (lat == null && value.latitudeE7 != null) lat = Number(value.latitudeE7) / 1e7;
  if (lng == null && value.longitudeE7 != null) lng = Number(value.longitudeE7) / 1e7;
  if (lat == null && value.latE7 != null) lat = Number(value.latE7) / 1e7;
  if (lng == null && value.lngE7 != null) lng = Number(value.lngE7) / 1e7;
  return validCoordinate(lat, lng);
}

function validCoordinate(lat, lng) {
  return Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180
    ? { lat, lng }
    : null;
}

function firstCoordinate(...values) {
  for (const value of values) {
    const found = coordinate(value);
    if (found) return found;
  }
  return null;
}

function timestamp(value) {
  if (value == null) return null;
  if (typeof value === "object") {
    return timestamp(value.timestamp ?? value.time ?? value.startTimestamp ?? value.endTimestamp);
  }
  if (typeof value === "number" || /^\d{10,16}$/.test(String(value))) {
    const number = Number(value);
    const date = new Date(number > 1e12 ? number : number * 1000);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : String(value);
}

function sourceDate(value) {
  if (!value) return null;
  const text = String(value);
  const direct = text.match(/^(\d{4}-\d{2}-\d{2})/);
  if (direct) return direct[1];
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function timeLabel(value) {
  if (!value) return "시각 없음";
  const direct = String(value).match(/T(\d{2}):(\d{2})/);
  if (direct) return `${direct[1]}:${direct[2]}`;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "시각 없음"
    : date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function normalizeMode(value) {
  const raw = String(value || "이동").replace(/^IN_/, "").replaceAll("_", " ").toLowerCase();
  const labels = {
    walking: "도보", running: "달리기", cycling: "자전거", bicycle: "자전거",
    passenger_vehicle: "차량", driving: "차량", car: "차량", bus: "버스",
    train: "열차", subway: "지하철", tram: "트램", ferry: "페리",
    flying: "항공", airplane: "항공", motorcycle: "오토바이",
  };
  return labels[raw] || raw || "이동";
}

function pushPoint(points, candidate, time, source = "path") {
  const coord = coordinate(candidate);
  if (coord) points.push({ ...coord, time: timestamp(time), source });
}

function parseSemanticSegments(json, result) {
  for (const segment of json.semanticSegments || []) {
    const start = timestamp(segment.startTime ?? segment.startTimestamp);
    const end = timestamp(segment.endTime ?? segment.endTimestamp);
    const visit = segment.visit;
    const activity = segment.activity;

    if (visit) {
      const top = visit.topCandidate || visit;
      const place = top.place || {};
      const coord = firstCoordinate(
        top.placeLocation, place.location, visit.placeLocation,
        visit.centerLatE7 != null ? visit : null,
      );
      result.items.push({
        kind: "visit",
        start,
        end,
        label: place.name || top.name || top.placeId || visit.placeId || "방문 장소",
        address: place.address || top.address || "",
        coord,
      });
      if (coord) result.points.push({ ...coord, time: start, source: "visit" });
    }

    if (activity) {
      const top = activity.topCandidate || activity;
      const startCoord = firstCoordinate(activity.start, activity.startLocation);
      const endCoord = firstCoordinate(activity.end, activity.endLocation);
      result.items.push({
        kind: "movement",
        start,
        end,
        label: normalizeMode(top.type || top.activityType || activity.activityType),
        startCoord,
        endCoord,
      });
      if (startCoord) result.points.push({ ...startCoord, time: start, source: "movement" });
      if (endCoord) result.points.push({ ...endCoord, time: end, source: "movement" });
    }

    for (const point of segment.timelinePath || []) {
      pushPoint(result.points, point, point.time ?? point.timestamp, "path");
    }
  }
}

function parseTimelineObjects(json, result) {
  for (const object of json.timelineObjects || []) {
    if (object.placeVisit) {
      const visit = object.placeVisit;
      const location = visit.location || {};
      const start = timestamp(visit.duration?.startTimestamp ?? visit.duration?.startTimestampMs);
      const end = timestamp(visit.duration?.endTimestamp ?? visit.duration?.endTimestampMs);
      const coord = coordinate(location);
      result.items.push({
        kind: "visit",
        start,
        end,
        label: location.name || location.placeId || "방문 장소",
        address: location.address || "",
        coord,
      });
      if (coord) result.points.push({ ...coord, time: start, source: "visit" });
    }

    if (object.activitySegment) {
      const activity = object.activitySegment;
      const start = timestamp(activity.duration?.startTimestamp ?? activity.duration?.startTimestampMs);
      const end = timestamp(activity.duration?.endTimestamp ?? activity.duration?.endTimestampMs);
      const startCoord = coordinate(activity.startLocation);
      const endCoord = coordinate(activity.endLocation);
      result.items.push({
        kind: "movement",
        start,
        end,
        label: normalizeMode(activity.activityType),
        startCoord,
        endCoord,
      });
      if (startCoord) result.points.push({ ...startCoord, time: start, source: "movement" });
      for (const point of activity.simplifiedRawPath?.points || activity.waypointPath?.waypoints || []) {
        pushPoint(result.points, point, point.timestamp ?? point.timestampMs, "path");
      }
      if (endCoord) result.points.push({ ...endCoord, time: end, source: "movement" });
    }
  }
}

function parseRawLocations(json, result) {
  for (const location of json.locations || []) {
    pushPoint(
      result.points,
      location,
      location.timestamp ?? location.timestampMs ?? location.serverTimestamp,
      "raw",
    );
  }
}

function parseGeoJson(json, result) {
  const features = json.type === "FeatureCollection" ? json.features || [] : [];
  for (const feature of features) {
    const geometry = feature.geometry || {};
    const times = feature.properties?.coordTimes || feature.properties?.times || [];
    if (geometry.type === "Point") {
      const [lng, lat] = geometry.coordinates || [];
      const coord = validCoordinate(Number(lat), Number(lng));
      const start = timestamp(feature.properties?.timestamp ?? feature.properties?.time);
      if (coord) {
        result.items.push({ kind: "visit", start, end: null, label: feature.properties?.name || "표시 지점", address: "", coord });
        result.points.push({ ...coord, time: start, source: "geojson" });
      }
    }
    if (geometry.type === "LineString") {
      (geometry.coordinates || []).forEach(([lng, lat], index) => {
        const coord = validCoordinate(Number(lat), Number(lng));
        if (coord) result.points.push({ ...coord, time: timestamp(times[index]), source: "geojson" });
      });
    }
  }
}

function parseTimeline(json) {
  const result = { items: [], points: [], format: "unknown" };
  if (Array.isArray(json.semanticSegments)) {
    result.format = "Google Timeline (기기 내보내기)";
    parseSemanticSegments(json, result);
  } else if (Array.isArray(json.timelineObjects)) {
    result.format = "Google Semantic Location History";
    parseTimelineObjects(json, result);
  } else if (Array.isArray(json.locations)) {
    result.format = "Google Location History";
    parseRawLocations(json, result);
  } else if (json.type === "FeatureCollection") {
    result.format = "GeoJSON";
    parseGeoJson(json, result);
  } else {
    throw new Error("지원되는 Google 타임라인 JSON 구조를 찾지 못했습니다.");
  }
  if (!result.items.length && !result.points.length) throw new Error("파일에 읽을 수 있는 위치 기록이 없습니다.");
  result.items.sort((a, b) => String(a.start || "").localeCompare(String(b.start || "")));
  result.points.sort((a, b) => String(a.time || "").localeCompare(String(b.time || "")));
  return result;
}

function activeData() {
  return typeof window.__tripDashboardLiveData === "function" ? window.__tripDashboardLiveData() : null;
}

function activeDate() {
  const data = activeData();
  return data?.days?.find((day) => Number(day.id) === Number(state.activeDay))?.date || null;
}

function itemOnDate(item, date) {
  const start = sourceDate(item.start);
  const end = sourceDate(item.end);
  return start === date || (!start && end === date) || (start && end && start < date && end > date);
}

function pointOnDate(point, date) {
  return sourceDate(point.time) === date;
}

function haversineMeters(a, b) {
  const radius = 6371000;
  const radians = (degrees) => degrees * Math.PI / 180;
  const dLat = radians(b.lat - a.lat);
  const dLng = radians(b.lng - a.lng);
  const lat1 = radians(a.lat);
  const lat2 = radians(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function plannedMatches(visits) {
  const planned = (activeData()?.map_points || [])
    .filter((point) => Number(point.day_id) === Number(state.activeDay))
    .map((point) => ({ ...point, lat: Number(point.lat), lng: Number(point.lng) }))
    .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng));
  return visits.flatMap((visit) => {
    if (!visit.coord || !planned.length) return [];
    const nearest = planned
      .map((point) => ({ point, meters: haversineMeters(visit.coord, point) }))
      .sort((a, b) => a.meters - b.meters)[0];
    return nearest && nearest.meters <= 250 ? [{ visit, ...nearest }] : [];
  });
}

function widgetTemplate() {
  return `<section class="timeline-local" id="timeline-local" data-build="${BUILD}">
    <div class="timeline-local__head">
      <div>
        <p class="timeline-local__eyebrow">개인정보 보호형 · 브라우저 로컬 처리</p>
        <h2>Google 지도 실제 이동경로</h2>
        <p>선택한 Day의 날짜와 타임라인 기록을 자동으로 맞춰 실제 경로·방문·이동 초안을 만듭니다.</p>
      </div>
      <div class="timeline-local__actions no-print">
        <label class="btn small primary timeline-local__file">타임라인 JSON 불러오기<input id="timeline-local-file" type="file" accept=".json,.geojson,application/json,application/geo+json" /></label>
        <button class="btn small" id="timeline-local-download" type="button" hidden>이 날짜 일정 초안 저장</button>
        <button class="btn small" id="timeline-local-clear" type="button" hidden>기록 지우기</button>
      </div>
    </div>
    <div class="timeline-local__privacy">원본 위치 파일과 전체 좌표는 GitHub·Supabase·홈페이지 서버로 전송하거나 저장하지 않습니다. 탭을 닫거나 ‘기록 지우기’를 누르면 브라우저 메모리에서 사라집니다.</div>
    <div id="timeline-local-status" class="timeline-local__status" aria-live="polite"></div>
    <div id="timeline-local-result"></div>
  </section>`;
}

function ensureWidget(detail = {}) {
  if (detail.activeDay != null) state.activeDay = Number(detail.activeDay);
  const mapTab = document.querySelector('[data-tab="map"].active');
  const main = document.querySelector("#main-content");
  if (!mapTab || !main) return;

  if (state.map && !document.querySelector("#timeline-local-map")) {
    state.map.remove();
    state.map = null;
    state.backgroundLayer = null;
  }
  if (!document.querySelector("#timeline-local")) {
    main.insertAdjacentHTML("beforeend", widgetTemplate());
    bindWidget();
  }
  renderResult();
}

function bindWidget() {
  const input = document.querySelector("#timeline-local-file");
  const clear = document.querySelector("#timeline-local-clear");
  const download = document.querySelector("#timeline-local-download");
  input?.addEventListener("change", importFile);
  clear?.addEventListener("click", clearData);
  download?.addEventListener("click", downloadDraft);
}

async function importFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const status = document.querySelector("#timeline-local-status");
  try {
    if (file.size > 250 * 1024 * 1024) throw new Error("250MB보다 큰 파일은 날짜별로 나눠서 내보낸 뒤 불러와 주세요.");
    status.textContent = "파일을 브라우저 안에서 분석하고 있습니다…";
    const json = JSON.parse(await file.text());
    state.parsed = parseTimeline(json);
    state.sourceName = file.name;
    renderResult();
  } catch (error) {
    state.parsed = null;
    state.sourceName = "";
    status.innerHTML = `<span class="timeline-local__error">${esc(error.message || error)}</span>`;
    const result = document.querySelector("#timeline-local-result");
    if (result) result.innerHTML = "";
  }
}

function clearData() {
  state.parsed = null;
  state.sourceName = "";
  state.map?.remove();
  state.map = null;
  state.backgroundLayer = null;
  const input = document.querySelector("#timeline-local-file");
  if (input) input.value = "";
  renderResult();
}

function renderResult() {
  const status = document.querySelector("#timeline-local-status");
  const result = document.querySelector("#timeline-local-result");
  const clear = document.querySelector("#timeline-local-clear");
  const download = document.querySelector("#timeline-local-download");
  if (!status || !result) return;

  const date = activeDate();
  if (!state.parsed) {
    status.innerHTML = `<b>Day ${esc(state.activeDay)}</b>의 날짜${date ? ` <b>${esc(date)}</b>` : ""}에 맞춰 표시할 타임라인 JSON을 선택하세요.`;
    result.innerHTML = `<div class="timeline-local__empty">Android: 설정 → 위치 → 위치 서비스 → 타임라인 → 타임라인 데이터 내보내기에서 JSON을 저장한 뒤 여기서 선택합니다.</div>`;
    if (clear) clear.hidden = true;
    if (download) download.hidden = true;
    return;
  }

  const items = date ? state.parsed.items.filter((item) => itemOnDate(item, date)) : [];
  const visits = items.filter((item) => item.kind === "visit");
  const movements = items.filter((item) => item.kind === "movement");
  const points = date ? state.parsed.points.filter((point) => pointOnDate(point, date)) : [];
  const matches = plannedMatches(visits);
  const drawable = points.length ? points : visits.filter((visit) => visit.coord).map((visit) => ({ ...visit.coord, time: visit.start, source: "visit" }));

  status.innerHTML = `<b>${esc(state.sourceName)}</b> · ${esc(state.parsed.format)} · Day ${esc(state.activeDay)} / <b>${esc(date || "날짜 미확인")}</b> · 방문 ${visits.length}건 · 이동 ${movements.length}건 · 경로점 ${points.length}개`;
  if (clear) clear.hidden = false;
  if (download) download.hidden = !(visits.length || movements.length);

  if (!date) {
    result.innerHTML = `<div class="timeline-local__empty">선택한 Day의 일정 날짜를 찾지 못했습니다.</div>`;
    return;
  }
  if (!items.length && !points.length) {
    state.map?.remove();
    state.map = null;
    state.backgroundLayer = null;
    result.innerHTML = `<div class="timeline-local__empty"><b>${esc(date)}</b> 기록이 이 파일에 없습니다. 해당 날짜가 포함된 내보내기 파일인지 확인하세요.</div>`;
    return;
  }

  result.innerHTML = `<div class="timeline-local__grid">
    <div>
      <div class="timeline-local__map" id="timeline-local-map" role="img" aria-label="${esc(date)} 실제 이동경로 지도"></div>
      <div class="timeline-local__map-actions no-print"><button class="btn small" id="timeline-local-background" type="button">배경지도 켜기</button><span>기본 경로는 외부 지도 요청 없이 표시됩니다.</span></div>
    </div>
    <div class="timeline-local__schedule">
      <h3>실제 일정 초안</h3>
      ${items.length ? items.map((item) => scheduleRow(item)).join("") : `<p class="timeline-local__empty">방문·이동 구간 정보는 없고 경로점만 있습니다.</p>`}
    </div>
  </div>
  ${matches.length ? `<div class="timeline-local__matches"><h3>기존 일정과 근접 확인</h3>${matches.map(({ visit, point, meters }) => `<div><b>${esc(visit.label)}</b><span>예정 지점 ‘${esc(point.name)}’에서 약 ${Math.round(meters)}m · 방문 기록 기반</span></div>`).join("")}</div>` : ""}`;

  drawLocalMap(drawable, visits);
  document.querySelector("#timeline-local-background")?.addEventListener("click", toggleBackground);
}

function scheduleRow(item) {
  const range = item.end ? `${timeLabel(item.start)}–${timeLabel(item.end)}` : timeLabel(item.start);
  const icon = item.kind === "visit" ? "📍" : "→";
  const label = item.kind === "visit" ? item.label : `${item.label} 이동`;
  return `<article class="timeline-local__row">
    <time>${esc(range)}</time>
    <div><b>${icon} ${esc(label)}</b>${item.address ? `<small>${esc(item.address)}</small>` : ""}</div>
  </article>`;
}

function drawLocalMap(points, visits) {
  state.map?.remove();
  state.map = null;
  state.backgroundLayer = null;
  if (!points.length || !window.L) {
    const host = document.querySelector("#timeline-local-map");
    if (host) host.innerHTML = `<div class="timeline-local__empty">표시 가능한 좌표가 없습니다.</div>`;
    return;
  }

  state.map = L.map("timeline-local-map", { scrollWheelZoom: false, zoomControl: true, attributionControl: true });
  const latLngs = points.map((point) => [point.lat, point.lng]);
  L.polyline(latLngs, { color: "#d24b3c", weight: 4, opacity: 0.88 }).addTo(state.map);
  const start = latLngs[0];
  const end = latLngs[latLngs.length - 1];
  L.circleMarker(start, { radius: 7, color: "#0c7a67", fillOpacity: 1 }).bindTooltip("경로 시작").addTo(state.map);
  L.circleMarker(end, { radius: 7, color: "#173f7a", fillOpacity: 1 }).bindTooltip("경로 끝").addTo(state.map);
  visits.filter((visit) => visit.coord).forEach((visit) => {
    L.circleMarker([visit.coord.lat, visit.coord.lng], { radius: 6, color: "#7a3e00", fillColor: "#ffb44d", fillOpacity: 0.95 })
      .bindPopup(`<b>${esc(visit.label)}</b><br>${esc(timeLabel(visit.start))}${visit.address ? `<br>${esc(visit.address)}` : ""}`)
      .addTo(state.map);
  });
  state.map.fitBounds(latLngs, { padding: [24, 24], maxZoom: 16 });
  setTimeout(() => state.map?.invalidateSize(), 0);
}

function toggleBackground(event) {
  if (!state.map) return;
  if (state.backgroundLayer) {
    state.map.removeLayer(state.backgroundLayer);
    state.backgroundLayer = null;
    event.currentTarget.textContent = "배경지도 켜기";
    return;
  }
  state.backgroundLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
    maxZoom: 19,
  }).addTo(state.map);
  state.backgroundLayer.bringToBack();
  event.currentTarget.textContent = "배경지도 끄기";
}

function downloadDraft() {
  const date = activeDate();
  if (!state.parsed || !date) return;
  const items = state.parsed.items.filter((item) => itemOnDate(item, date));
  const visits = items.filter((item) => item.kind === "visit");
  const draft = {
    schema: "nova-actual-itinerary-draft-v1",
    date,
    day_id: state.activeDay,
    source_format: state.parsed.format,
    source_file: state.sourceName,
    status: "사용자 확인 전 초안",
    visits: visits.map((visit) => ({
      start: visit.start,
      end: visit.end,
      name: visit.label,
      address: visit.address || null,
      coordinate: visit.coord,
    })),
    movements: items.filter((item) => item.kind === "movement").map((movement) => ({
      start: movement.start,
      end: movement.end,
      mode: movement.label,
    })),
    planned_matches: plannedMatches(visits).map(({ visit, point, meters }) => ({
      actual_visit: visit.label,
      planned_point: point.name,
      distance_m: Math.round(meters),
      evidence: "Google 타임라인 방문 기록과 예정 좌표가 250m 이내",
    })),
    privacy_note: "전체 원시 이동경로는 포함하지 않음",
  };
  const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `nova-actual-itinerary-${date}.json`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

window.addEventListener("trip-data-changed", (event) => ensureWidget(event.detail || {}));
document.addEventListener("DOMContentLoaded", () => ensureWidget(), { once: true });

