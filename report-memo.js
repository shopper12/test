const clean = (v) => String(v ?? "").replace(/\s+/g, " ").trim();
const norm = (v) => clean(v).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9가-힣]+/g, " ").trim();

const WEEKDAY_KO = ["일", "월", "화", "수", "목", "금", "토"];
const MEETING_HINTS = Object.freeze({
  "d1-06": "TIPC",
  "d2-02": "VESTAS",
  "d2-03": "VESTAS",
  "d6-03": "Port of Rotterdam",
  "d6-05": "Rotterdam Offshore Group",
  "d6-07": "TNO",
  "d7-03": "OWC",
  "d7-05": "Skyborn",
  "d8-012": "DNV",
  "d9-03": "Blue Water",
  "d9-055": "OWC",
});

function dateLabel(day) {
  const raw = clean(day?.date);
  const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return raw;
  const d = new Date(`${raw}T12:00:00`);
  const weekday = day?.weekday ? String(day.weekday).replace("요일", "") : WEEKDAY_KO[d.getDay()];
  return `${Number(m[1])}. ${Number(m[2])}. ${Number(m[3])}.(${weekday})`;
}

function timeLabel(event) {
  const a = clean(event?.time_start), b = clean(event?.time_end);
  return a && b ? `${a}~${b}` : a || b || "시간 협의 중";
}

function meetingFor(event, meetings = []) {
  const hint = MEETING_HINTS[String(event?.id || "")];
  const hay = norm(`${event?.title || ""} ${event?.location || ""}`);
  const all = meetings || [], sameDay = all.filter((m) => Number(m?.day_id) === Number(event?.day_id));
  const match = (rows) => rows.find((m) => {
    const org = norm(m?.organization);
    return org && (hay.includes(org) || org.split(" ").some((token) => token.length >= 4 && hay.includes(token)));
  });
  if (hint) {
    const n = norm(hint);
    const hit = sameDay.find((m) => norm(`${m?.organization || ""} ${m?.agenda || ""}`).includes(n)) || all.find((m) => norm(`${m?.organization || ""} ${m?.agenda || ""}`).includes(n));
    if (hit) return hit;
  }
  return match(sameDay) || match(all) || null;
}

function agendaText(meeting, event) {
  const agenda = clean(meeting?.agenda || event?.notes || "");
  return agenda.replace(/\.$/, "");
}

function scheduleText(event) {
  const legs = event?.schedule_legs || [];
  if (!legs.length) return "";
  return legs.map((leg) => {
    const service = clean(leg?.service || event?.transport);
    const from = clean(leg?.from), to = clean(leg?.to);
    const depart = clean(leg?.depart), arrive = clean(leg?.arrive);
    return `${service}: ${depart} ${from} → ${arrive} ${to}`;
  }).join(" / ");
}

function isBusiness(event) {
  return /업무|회의|미팅|현장견학|기관방문/.test(`${event?.category || ""} ${event?.title || ""}`);
}

function isTransport(event) {
  return /교통|항공|출국|귀국|입국|환승/.test(`${event?.category || ""} ${event?.title || ""}`) || (event?.schedule_legs || []).length > 0;
}

export function buildReportMemo(event, day = {}, meetings = []) {
  if (!event) return "";
  const date = dateLabel(day) || `Day ${event.day_id || ""}`;
  const time = timeLabel(event);
  const location = clean(event.location || day.cities || "장소 협의 중");
  const title = clean(event.title || "일정").replace(/\s*\(요청 중\)\s*/g, "");
  const transport = clean(event.transport);
  const meeting = meetingFor(event, meetings);

  const head = `○ 일시·장소: ${date} ${time} / ${location}`;
  if (isBusiness(event)) {
    const org = clean(meeting?.organization || title);
    const agenda = agendaText(meeting, event) || "현지 해상풍력 사업·기술 수행사례 및 주요 리스크 관리방안";
    const status = clean(event?.meeting_status || meeting?.status || "일정 협의 중");
    const counterpart = clean(meeting?.contact || (event?.attendees || []).join(" / "));
    return [
      head,
      `○ 방문·일정: ${org} 방문 및 ${title}`,
      counterpart ? `○ 현지 참석자: ${counterpart}` : "",
      `○ 주요 확인사항: ${agenda}`,
      `○ 추진상태: ${status}`,
      `○ 보고서 문안: ${org}를 방문하여 ${agenda}를 중심으로 현지 수행사례와 기술적 고려사항을 청취·논의하는 일정으로 구성하였다. 협의 내용은 국내 해상풍력 사업의 개발·설계·건설·운영 및 리스크 관리 검토에 활용할 예정이다.`,
    ].filter(Boolean).join("\n");
  }

  if (isTransport(event)) {
    const schedule = scheduleText(event);
    return [
      head,
      `○ 일정: ${title}`,
      transport ? `○ 이동수단: ${transport}` : "",
      schedule ? `○ 확정·게시 시간표: ${schedule}` : "",
      `○ 보고서 문안: ${location} 구간의 이동은 ${transport || "현지 교통수단"}을 이용하는 일정으로 구성하였다.${schedule ? ` 주요 운항·운행시간은 ${schedule}이다.` : ""} 일정 변경 시 출발·도착시각과 연계 동선을 재확인한다.`,
    ].filter(Boolean).join("\n");
  }

  const note = clean(event.notes || "");
  return [
    head,
    `○ 일정: ${title}`,
    transport ? `○ 이동수단: ${transport}` : "",
    note ? `○ 참고: ${note}` : "",
    `○ 보고서 문안: ${date} ${time}에 ${location}에서 ${title} 일정을 진행하도록 구성하였다. 전체 출장 동선 및 기관 방문 일정과 연계하여 현지 해상풍력 산업·항만·도시 환경을 확인하는 보조 일정으로 활용한다.`,
  ].filter(Boolean).join("\n");
}
