// Temporary bootstrap: corrects one generated template-literal typo before loading app.js.
// The source remains visible in the public repository; no secret is handled here.
const appUrl = new URL("./app.js", window.location.href);
const dataUrl = new URL("./itinerary-data.js", window.location.href).href;
let source = await fetch(appUrl, { cache: "no-store" }).then((r) => {
  if (!r.ok) throw new Error(`app.js 로드 실패: ${r.status}`);
  return r.text();
});
source = source.replace(
  'state.activeDay?`Day ${state.activeDay} 경로":"전체 경로"',
  'state.activeDay ? `Day ${state.activeDay} 경로` : "전체 경로"',
);
source = source.replace('"./itinerary-data.js"', JSON.stringify(dataUrl));
const blobUrl = URL.createObjectURL(new Blob([source], { type: "text/javascript" }));
try {
  await import(blobUrl);
} catch (error) {
  console.error(error);
  const main = document.querySelector("#main-content");
  if (main) main.innerHTML = `<div class="security-note"><b>대시보드 실행 오류</b><br>${String(error.message || error)}</div>`;
} finally {
  URL.revokeObjectURL(blobUrl);
}
