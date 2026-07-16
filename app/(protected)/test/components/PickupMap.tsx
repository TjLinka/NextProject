"use client";
import Script from "next/script";
import React, { useEffect, useRef } from "react";
import $ from 'jquery'

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

const PickupMap = React.memo(function PickupMap({
  points,
  onSelect,
  userLocation,
}: {
  points: PickupPoint[];
  onSelect: (p: PickupPoint) => void;
  userLocation: [];
}) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(userLocation);
    
    function init() {
      const ymaps = (window as any).ymaps;
      ymaps.ready(() => {
        const map = new ymaps.Map(mapRef.current, {
          center: [userLocation[0], userLocation[1]],
          zoom: 12,
          controls: ["zoomControl", "searchControl"],
        });

        let objects = ymaps.geoQuery(
          points.map((pvz) => {
            const counter = 0,
              BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
                `<div class="ballon_class"><strong style="font-size: 20px;">${pvz.typ_name}</strong> <br>` +
                  `<span style='font-size: 16px;'>Адрес: ${pvz.address || "Не указано"} <br>` +
                  `Время работы: ${pvz.work_time} </span> <br><br>` +
                  `<span style='font-size: 16px;'>Ориентировочные сроки доставки: от 3 до 7 дней <br>
                            Точные сроки доставки можете узнать по трек номеру на сайте службы доставки</span> <br>` +
                  `<button id="counter-button" style="background: green; font-size: 18px; height:40px; width: 100%;
                            cursor: pointer; border:0; color: white; border-radius: 4px; outline: none; padding: 0px 10px; margin-top: 10px;" data-address="${pvz.address || "Не указано"}"
                            data-id="${pvz.id}" data-code="${pvz.code}" data-lat="${pvz.lat}" data-lng="${pvz.lng}"> Выбрать </button></div>`,
                {
                  // Переопределяем функцию build, чтобы при создании макета начинать
                  // слушать событие click на кнопке-счетчике.
                  build: function () {
                    // Сначала вызываем метод build родительского класса.
                    BalloonContentLayout.superclass.build.call(this);
                    // А затем выполняем дополнительные действия.
                    $("#counter-button").on("click", this.onCounterClick);
                    $("#count").html(counter);
                  },

                  // Аналогично переопределяем функцию clear, чтобы снять
                  // прослушивание клика при удалении макета с карты.

                  onCounterClick: function (e) {
                    onSelect(pvz);
                    // console.log(e.target.dataset);
                    // const pvzId = e.target.dataset.code;
                    // delivery_type.value = "pvz";
                    // getNearestStock(e.target.dataset.lat, e.target.dataset.lng);
                    // selectedPVZInfo.value = pvz;
                    // selectedPVZId.value = pvzId;
                  },
                },
              );
            const newMark = new ymaps.Placemark(
              [pvz.lat, pvz.lng],
              {},
              {
                preset:
                  pvz.delivery_system_id === 1
                    ? "islands#darkGreenDotIcon"
                    : "islands#darkBlueDotIcon",
                balloonContentLayout: BalloonContentLayout,
                balloonPanelMaxMapArea: 0,
              },
            );
            newMark.events.add("click", () => {});
            return newMark;
          }),
        );
        map.geoObjects.add(
          objects.clusterize({
            preset: "islands#invertedDarkGreenClusterIcons",
          }),
        );

        // points.forEach((point) => {
        //   const placemark = new ymaps.Placemark(
        //     [point.lat, point.lng],
        //     {
        //       balloonContentHeader: `${point.typ_name} ${point.code}`,
        //       balloonContentBody: `${point.address}<br>${point.work_time}`,
        //       hintContent: point.address,
        //     },
        //     { preset: "islands#redDeliveryIcon" },
        //   );

        //   placemark.events.add("click", () => onSelect(point));
        //   map.geoObjects.add(placemark);
        // });
      });
    }

    if ((window as any).ymaps) init();
    else document.addEventListener("ymaps-loaded", init);

    return () => document.removeEventListener("ymaps-loaded", init);
  }, [points, onSelect]);

  return (
    <>
      <Script
        src="https://api-maps.yandex.ru/2.1/?apikey=dfd9a635-2cb4-4e73-b502-37fb1289aa02&lang=ru_RU"
        strategy="afterInteractive"
        onLoad={() => document.dispatchEvent(new Event("ymaps-loaded"))}
      />
      <div ref={mapRef} style={{ width: "100%", height: 620 }} />
    </>
  );
});

export default PickupMap;