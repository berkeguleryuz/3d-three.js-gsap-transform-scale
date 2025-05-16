"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Content from "./Content";
import { data } from "@/constants/data";
import Canvas from "./Canvas";
import { DataType } from "../types";

const Banner = () => {
  const bannerRef = useRef<HTMLDivElement>(null);

  const [activeData, setActiveData] = useState<DataType>(data[2]);

  useEffect(() => {
    if (bannerRef.current && activeData) {
      gsap.to(bannerRef.current, {
        background: activeData.background,
        ease: "power3.inOut",
        duration: 0.8,
      });
    }
    if (activeData && activeData.headingColor) {
      gsap.to("#logo", {
        color: activeData.headingColor,
        ease: "power3.inOut",
        duration: 0.8,
      });
    }
  }, [activeData]);

  return (
    <div ref={bannerRef} className="w-screen h-screen relative">
      <div
        id="logo"
        className="absolute my-2 ml-6 text-left text-2xl font-bold tracking-widest md:ml-28 lg:ml-[12vw] lg:my-8 uppercase">
        Clodron
      </div>
      <div className="w-full h-full flex justify-between items-center flex-col lg:flex-row-reverse">
        <Canvas
          activeData={activeData}
          swatchData={data}
          onSwatchSelect={setActiveData}
        />
        <Content activeData={activeData} />
      </div>
    </div>
  );
};

export default Banner;
