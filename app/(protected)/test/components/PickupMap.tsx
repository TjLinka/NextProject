"use client";
import Script from "next/script";
import { useEffect, useRef } from "react";

type PickupPoint = {
  address: string;
  city_code: number;
  code: string;
  country_code: string;
  delivery_system_id: number;
  email: string;
  id: number | null;
  lat: number;
  lng: number;
  phone: string;
  region_code: number;
  typ: number;
  typ_name: string;
  uuid: string;
  work_time: string;
};

declare global {
  interface Window {
    ymaps3: any;
  }
}

export default function PickupMap({
  points,
  onSelect,
}: {
  points: PickupPoint[];
  onSelect: (p: PickupPoint) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      await window.ymaps3.ready;
      if (cancelled || !mapRef.current) return;

      const {
        YMap,
        YMapDefaultSchemeLayer,
        YMapDefaultFeaturesLayer,
        YMapMarker,
        YMapControls,
      } = window.ymaps3;

      const map = new YMap(mapRef.current, {
        location: { center: [points[0].lng, points[0].lat], zoom: 13 },
      });
      mapInstance.current = map;

      map.addChild(new YMapDefaultSchemeLayer());
      map.addChild(new YMapDefaultFeaturesLayer());
      map.addChild(new YMapControls({ position: "right" }));

      points.forEach((point) => {
        const el = document.createElement("div");
        el.style.width = "28px";
        el.style.height = "28px";
        el.style.borderRadius = "50% 50% 50% 0";
        el.style.background = "#D85A30";
        el.style.transform = "rotate(-45deg)";
        el.style.cursor = "pointer";
        el.style.border = "2px solid white";
        el.addEventListener("click", () => onSelect(point));

        const marker = new YMapMarker(
          { coordinates: [point.lng, point.lat] },
          el,
        );
        map.addChild(marker);
      });
    }

    if (window.ymaps3) init();
    else document.addEventListener("ymaps3-loaded", init);

    return () => {
      cancelled = true;
      mapInstance.current?.destroy?.();
    };
  }, [points, onSelect]);

  return (
    <>
      <Script
        src="https://api-maps.yandex.ru/v3/?apikey=f04fd707-b63c-46bb-9e3b-d80307e9e3cd&lang=ru_RU"
        strategy="afterInteractive"
        type="module"
        onLoad={() => document.dispatchEvent(new Event("ymaps3-loaded"))}
      />
      <div ref={mapRef} style={{ width: "100%", height: 420 }} />
    </>
  );
}
