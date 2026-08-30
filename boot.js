const BUILD = "FINAL_0830_V1";
document.documentElement.dataset.dashboardBuild = BUILD;
window.__DASHBOARD_BUILD__ = BUILD;

const preloadModules = [
  ["travel-live", `./travel-live.js?v=${BUILD}`],
  ["google-map-link-bridge", `./google-map-link-bridge.js?v=${BUILD}`],
  ["unified-experience", `./unified-experience.js?v=${BUILD}`],
  ["unified-nav", `./unified-nav.js?v=${BUILD}`],
];

const failures = [];
for (const [name, url] of preloadModules) {
  try {
    await import(url);
  } catch (error) {
    failures.push({ name, error });
    console.error(`[${BUILD}] ${name} load failed`, error);
  }
}

try {
  await import(`./app.js?v=${BUILD}`);
} catch (error) {
  failures.push({ name: "app", error });
  console.error(error);
  const main = document.querySelector("#main-content");
  if (main) main.innerHTML = `<div class="security-note"><b>대시보드 실행 오류</b><br>${String(error.message || error)}</div>`;
}

try {
  await import(`./stable-tools.js?v=${BUILD}`);
} catch (error) {
  failures.push({ name: "stable-tools", error });
  console.error(`[${BUILD}] stable-tools load failed`, error);
}

try {
  await import(`./timeline-runtime-v17.js?v=${BUILD}`);
} catch (error) {
  failures.push({ name: "timeline-runtime-v17", error });
  console.error(`[${BUILD}] timeline runtime load failed`, error);
}

function showBuildStatus() {
  let badge = document.querySelector("#dashboard-build-badge");
  if (!badge) {
    badge = document.createElement("div");
    badge.id = "dashboard-build-badge";
    badge.style.cssText = "position:fixed;right:8px;bottom:8px;z-index:5000;padding:5px 8px;border-radius:999px;background:rgba(17,36,48,.88);color:#fff;font:700 11px/1.2 system-ui,sans-serif;box-shadow:0 2px 10px rgba(0,0,0,.16);pointer-events:none";
    document.body.append(badge);
  }
  badge.textContent = failures.length ? `${BUILD} · 모듈 ${failures.length}개 오류` : `${BUILD} · 최신`;
  badge.title = failures.length ? failures.map(x => x.name).join(", ") : "현재 브라우저에 로드된 대시보드 버전";
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", showBuildStatus, { once: true });
else showBuildStatus();
