// Local-time layer for the 2026 offshore wind benchmarking itinerary.
// Keeps the official itinerary data intact and makes every displayed time explicit
// about which local clock it uses. International flight legs show both endpoint zones.

const DAY_TIMEZONES = {
  1: "ICN 출발 KST UTC+9 → 대만 UTC+8 (한국보다 1시간 느림)",
  2: "대만 UTC+8 · 한국보다 1시간 느림",
  3: "대만 UTC+8 → 암스테르담 CEST UTC+2 · 도착시간은 암스테르담 현지시간",
  4: "네덜란드 CEST UTC+2 · 한국보다 7시간 느림",
  5: "네덜란드 CEST UTC+2 · 한국보다 7시간 느림",
  6: "네덜란드·독일 CEST UTC+2 · 한국보다 7시간 느림",
  7: "독일 CEST UTC+2 · 한국보다 7시간 느림",
  8: "독일·덴마크 CEST UTC+2 · 한국보다 7시간 느림",
  9: "덴마크 CEST UTC+2 · 한국보다 7시간 느림",
  10: "덴마크 CEST UTC+2 → 애버딘 BST UTC+1 → 암스테르담 CEST UTC+2 → 인천 KST UTC+9",
  11: "한국 KST UTC+9",
};

const DAY_EVENT_ZONES = {
  1: "대만 현지시간 · UTC+8",
  2: "대만 현지시간 · UTC+8",
  3: "대만 현지시간 · UTC+8",
  4: "네덜란드 현지시간 · CEST UTC+2",
  5: "네덜란드 현지시간 · CEST UTC+2",
  6: "CEST UTC+2",
  7: "독일 현지시간 · CEST UTC+2",
  8: "독일·덴마크 현지시간 · CEST UTC+2",
  9: "덴마크 현지시간 · CEST UTC+2",
  10: "덴마크 현지시간 · CEST UTC+2",
  11: "한국 현지시간 · KST UTC+9",
};

const EVENT_TIMEZONES = {
  "f1-01": "출발 KST UTC+9 → 도착 대만 UTC+8",
  "f3-03": "출발 대만 UTC+8 → 도착 암스테르담 CEST UTC+2",
  "f6-04": "암스테르담·함부르크 모두 CEST UTC+2",
  "f10-03": "출발 덴마크 CEST UTC+2 → 도착 애버딘 BST UTC+1",
  "f10-04": "애버딘 현지시간 · BST UTC+1",
  "f10-05": "출발 애버딘 BST UTC+1 → 도착 암스테르담 CEST UTC+2",
  "f10-06": "암스테르담 현지시간 · CEST UTC+2",
  "f10-07": "출발 암스테르담 CEST UTC+2 → 도착 인천 KST UTC+9",
  "f11-01": "한국 현지시간 · KST UTC+9",
};

const FLIGHT_TIMEZONES = {
  LJ0735: "출발 KST UTC+9 / 도착 대만 UTC+8",
  CI0073: "출발 대만 UTC+8 / 도착 CEST UTC+2",
  KL1759: "출발·도착 CEST UTC+2",
  LM058: "출발 CEST UTC+2 / 도착 BST UTC+1",
  KL0918: "출발 BST UTC+1 / 도착 CEST UTC+2",
  KL0855: "출발 CEST UTC+2 / 도착 KST UTC+9",
};

const LIVE_CLOCKS = [
  { key: "taiwan", label: "대만", zone: "Asia/Taipei", suffix: "UTC+8 · KST-1h" },
  { key: "northsea", label: "네덜란드·독일·덴마크", zone: "Europe/Amsterdam", suffix: "CEST UTC+2 · KST-7h" },
  { key: "aberdeen", label: "애버딘", zone: "Europe/London", suffix: "BST UTC+1 · KST-8h" },
  { key: "korea", label: "한국", zone: "Asia/Seoul", suffix: "KST UTC+9" },
];

function setTextIfChanged(element, text) {
  if (element && element.textContent !== text) element.textContent = text;
}

function injectStyles() {
  if (document.getElementById("local-time-runtime-style")) return;
  const style = document.createElement("style");
  style.id = "local-time-runtime-style";
  style.textContent = `
    .local-time-strip{margin-top:10px;padding:10px;border:1px solid #cbd5e1;border-radius:12px;background:#f8fafc;display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:8px}
    .local-time-clock{background:#fff;border:1px solid #e2e8f0;border-radius:9px;padding:8px 10px;min-width:0}
    .local-time-clock b{display:block;font-size:12px;color:#0f172a}
    .local-time-clock strong{display:block;font-size:16px;line-height:1.3;margin-top:2px;font-variant-numeric:tabular-nums;color:#111827}
    .local-time-clock small{display:block;margin-top:2px;font-size:10px;color:#64748b}
    .local-time-strip-title{grid-column:1/-1;font-size:11px;font-weight:700;color:#334155;display:flex;gap:6px;align-items:center}
    .local-time-day{display:block;margin-top:3px;font-style:normal;font-size:9px;line-height:1.25;color:#0369a1;font-weight:600}
    .local-time-summary{margin:7px 0 0;padding:7px 9px;border-radius:8px;background:#eff6ff;border:1px solid #bfdbfe;color:#1e3a8a;font-size:11px;font-weight:600}
    .event-time .local-time-tag{display:block;margin-top:5px;padding-top:5px;border-top:1px dashed #cbd5e1;font-family:inherit;font-size:9px;line-height:1.25;white-space:normal;color:#0369a1;font-weight:700}
    .flight-local-time{display:block;margin-top:3px;font-size:9px;line-height:1.25;color:#0369a1;font-weight:600;white-space:normal}
    @media(max-width:600px){.local-time-strip{grid-template-columns:repeat(2,minmax(0,1fr));padding:8px;gap:6px}.local-time-clock{padding:7px}.local-time-clock strong{font-size:14px}.local-time-summary{font-size:10px}}
    @media print{.local-time-strip{display:none}.local-time-day,.local-time-summary,.event-time .local-time-tag,.flight-local-time{color:#111!important;background:transparent!important;border-color:#aaa!important}}
  `;
  document.head.appendChild(style);
}

function formatClock(zone) {
  try {
    return new Intl.DateTimeFormat("ko-KR", {
      timeZone: zone,
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date());
  } catch {
    return "시간 확인 불가";
  }
}

function ensureClockStrip() {
  const banner = document.getElementById("status-banner");
  if (!banner) return;
  let strip = document.getElementById("local-time-strip");
  const needsBuild = !strip || !strip.querySelector("[data-clock]");
  if (!strip) {
    strip = document.createElement("section");
    strip.id = "local-time-strip";
    strip.className = "local-time-strip no-print";
    strip.setAttribute("aria-label", "출장지 현재 현지시간");
    banner.insertAdjacentElement("afterend", strip);
  }
  if (needsBuild) {
    strip.innerHTML = `
      <div class="local-time-strip-title">🕒 현재 현지시각 <span>· 일정표의 시각은 각 지역 현지시간 기준</span></div>
      ${LIVE_CLOCKS.map((clock) => `
        <div class="local-time-clock" data-clock="${clock.key}">
          <b>${clock.label}</b>
          <strong>${formatClock(clock.zone)}</strong>
          <small>${clock.suffix}</small>
        </div>`).join("")}
    `;
  }
}

function updateClockValues() {
  const strip = document.getElementById("local-time-strip");
  if (!strip) return;
  LIVE_CLOCKS.forEach((clock) => {
    const strong = strip.querySelector(`[data-clock="${clock.key}"] strong`);
    setTextIfChanged(strong, formatClock(clock.zone));
  });
}

function dayFromEventId(id) {
  const match = String(id || "").match(/^f(\d+)-/);
  return match ? Number(match[1]) : null;
}

function annotateDayTabs() {
  document.querySelectorAll(".day-tab[data-day]").forEach((button) => {
    const day = Number(button.dataset.day);
    const text = DAY_TIMEZONES[day];
    if (!text) return;
    let note = button.querySelector(".local-time-day");
    if (!note) {
      note = document.createElement("em");
      note.className = "local-time-day";
      button.appendChild(note);
    }
    setTextIfChanged(note, text);
  });
}

function annotateDaySummary() {
  const active = document.querySelector(".day-tab.active[data-day]");
  const summary = document.querySelector(".day-summary");
  if (!active || !summary) return;
  const day = Number(active.dataset.day);
  const text = DAY_TIMEZONES[day];
  if (!text) return;
  let note = summary.querySelector(".local-time-summary");
  if (!note) {
    note = document.createElement("div");
    note.className = "local-time-summary";
    const titleRow = summary.querySelector(".day-summary-title");
    if (titleRow) titleRow.insertAdjacentElement("afterend", note);
    else summary.prepend(note);
  }
  setTextIfChanged(note, `🕒 이 Day의 시간 기준: ${text}`);
}

function annotateEventTimes() {
  document.querySelectorAll(".event-card[data-event-id]").forEach((card) => {
    const id = card.dataset.eventId || "";
    const day = dayFromEventId(id);
    const text = EVENT_TIMEZONES[id] || DAY_EVENT_ZONES[day];
    if (!text) return;
    const time = card.querySelector(".event-time");
    if (!time) return;
    let tag = time.querySelector(".local-time-tag");
    if (!tag) {
      tag = document.createElement("small");
      tag.className = "local-time-tag";
      time.appendChild(tag);
    }
    setTextIfChanged(tag, `현지시간 · ${text}`);
  });
}

function annotateFlightTable() {
  document.querySelectorAll("table tr").forEach((row) => {
    const text = row.textContent || "";
    const flight = Object.keys(FLIGHT_TIMEZONES).find((code) => text.includes(code));
    if (!flight) return;
    const cells = row.querySelectorAll("td");
    if (!cells.length) return;
    const target = cells[Math.min(3, cells.length - 1)];
    let tag = target.querySelector(".flight-local-time");
    if (!tag) {
      tag = document.createElement("small");
      tag.className = "flight-local-time";
      target.appendChild(tag);
    }
    setTextIfChanged(tag, FLIGHT_TIMEZONES[flight]);
  });
}

let scheduled = false;
function applyLocalTimeLayer() {
  scheduled = false;
  injectStyles();
  ensureClockStrip();
  updateClockValues();
  annotateDayTabs();
  annotateDaySummary();
  annotateEventTimes();
  annotateFlightTable();
}

function scheduleApply() {
  if (scheduled) return;
  scheduled = true;
  queueMicrotask(applyLocalTimeLayer);
}

window.addEventListener("trip-data-changed", scheduleApply);
document.addEventListener("DOMContentLoaded", scheduleApply);

const observer = new MutationObserver(scheduleApply);
observer.observe(document.documentElement, { childList: true, subtree: true });

scheduleApply();
window.setInterval(updateClockValues, 30_000);
