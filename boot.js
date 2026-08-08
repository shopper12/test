try {
  await import("./travel-live.js?v=LIVE_TRAVEL_V6");
  await import("./google-maps-inline.js?v=LIVE_TRAVEL_V6");
  await import("./unified-nav.js?v=LIVE_TRAVEL_V6");
  await import("./app.js?v=PDF_ROUTE_COST_OPTIMIZED_V2");
} catch (error) {
  console.error(error);
  const main = document.querySelector("#main-content");
  if (main) main.innerHTML = `<div class="security-note"><b>대시보드 실행 오류</b><br>${String(error.message || error)}</div>`;
}
