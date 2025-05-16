import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { DataType } from "../types";

const Content = ({ activeData }: { activeData: DataType }) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subHeadingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (headingRef.current) {
      gsap.fromTo(
        headingRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          color: activeData.headingColor,
          ease: "power3.inOut",
          duration: 0.8,
        },
      );
    }
    if (subHeadingRef.current) {
      gsap.fromTo(
        subHeadingRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          color: activeData.subHeadingColor,
          ease: "power3.inOut",
          duration: 0.8,
          delay: 0.1,
        },
      );
    }
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          color: activeData.textColor,
          ease: "power3.inOut",
          duration: 0.8,
          delay: 0.2,
        },
      );
    }
    if (buttonRef.current) {
      gsap.fromTo(
        buttonRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          color: activeData.buttonColor.text,
          backgroundColor: activeData.buttonColor.background,
          ease: "power4.inOut",
          duration: 1,
          delay: 0.3,
        },
      );
    }
  }, [activeData]);

  return (
    <div className="select-none w-full h-2/5 flex justify-center items-center lg:w-1/2 lg:h-full lg:justify-end ">
      <div className=" flex justify-start flex-col items-start w-2/3 ">
        <h1
          ref={headingRef}
          className="text-left text-5xl font-bold mb-1 w-full relative p-1 overflow-hidden md:text-[7vw] md:mb-2 ">
          {activeData.heading}
        </h1>
        <h6
          ref={subHeadingRef}
          className="text-left text-2xl font-regular mb-6 w-full p-1 overflow-hidden md:text-4xl">
          {activeData.subheading}
        </h6>
        <p
          ref={textRef}
          className="w-full text-xs font-medium text-left mb-8 p-1 overflow-hidden  md:text-base md:mb-12 ">
          {activeData.text}
        </p>
        <div className="relative overflow-hidden ">
          <button
            ref={buttonRef}
            className=" text cursor-pointer button rounded-2xl outline-none px-6 py-3 font-semibold tracking-tight hover:transition-colors bg-[#4A6E6A] ">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Content;
