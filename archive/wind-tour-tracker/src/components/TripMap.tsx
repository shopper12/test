import { useEffect, useRef } from "react";
import { MAP_POINTS, MAP_LEGS } from "@/lib/trip-data";

export function TripMap({ activeDay }: { activeDay: number | "all" }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: any;
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !ref.current) return;
      // Fix marker icon URLs
      // @ts-expect-error internal
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      map = L.map(ref.current, { worldCopyJump: true }).setView([45, 60], 2);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 18,
      }).addTo(map);

      const byName = new Map(MAP_POINTS.map((p) => [p.name, p]));

      MAP_POINTS.forEach((p) => {
        const active = activeDay === "all" || p.day === activeDay;
        L.circleMarker([p.lat, p.lng], {
          radius: active ? 8 : 5,
          color: active ? "#dc2626" : "#475569",
          fillColor: active ? "#f97316" : "#94a3b8",
          fillOpacity: 0.85,
          weight: 2,
        })
          .addTo(map)
          .bindTooltip(`Day ${p.day} · ${p.name}`, { direction: "top" });
      });

      MAP_LEGS.forEach((leg) => {
        const from = byName.get(leg.from);
        const to = byName.get(leg.to);
        if (!from || !to) return;
        const active = activeDay === "all" || leg.day === activeDay;
        const color =
          leg.kind === "air" ? "#2563eb" : leg.kind === "rail" ? "#059669" : "#7c3aed";
        const opts: any = {
          color,
          weight: active ? 4 : 2,
          opacity: active ? 0.95 : 0.45,
        };
        if (leg.kind === "air") opts.dashArray = "8 8";
        if (leg.kind === "rail") opts.dashArray = "2 6";
        L.polyline([[from.lat, from.lng], [to.lat, to.lng]], opts).addTo(map);
      });

      const bounds = L.latLngBounds(MAP_POINTS.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [30, 30] });
    })();
    return () => {
      cancelled = true;
      if (map) map.remove();
    };
  }, [activeDay]);

  return (
    <div className="space-y-2">
      <div ref={ref} className="h-[520px] w-full rounded-lg border shadow-sm" />
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-0.5 w-6 bg-blue-600" style={{ borderTop: "2px dashed #2563eb", background: "transparent" }} />
          항공 (점선)
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-0.5 w-6 bg-violet-600" />
          자동차 (실선)
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-0.5 w-6" style={{ borderTop: "2px dotted #059669", background: "transparent" }} />
          THSR·철도 (점선 별도)
        </span>
      </div>
    </div>
  );
}