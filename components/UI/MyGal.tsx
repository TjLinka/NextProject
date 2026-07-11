/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";

export default function MyGal({ imgs }: { imgs: any }) {
  return (
    <Swiper
      pagination={true}
      modules={[Pagination]}
      spaceBetween={30}
      className="h-130"
      slidesPerView={'auto'}
    >
      {imgs.map((i) => {
        return (
          <SwiperSlide className="" key={i}>
            <Image
              alt="image"
              src={i}
              width={500}
              height={500}
              className="w-100 h-130 shrink-0 cursor-pointer"
            />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
