try {
  await import("./app.js?v=TWO_PLAN_DIRECT_RETURN_V1");
} catch (error) {
  console.error(error);
  const main = document.querySelector("#main-content");
  if (main) main.innerHTML = `<div class="security-note"><b>대시보드 실행 오류</b><br>${String(error.message || error)}</div>`;
}
