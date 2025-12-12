"use client";
import { createContext, useContext, useRef, useEffect, ReactNode } from "react";
import LocomotiveScroll from "locomotive-scroll";

interface LocomotiveScrollContextType {
  scroll: LocomotiveScroll | null;
}

const LocomotiveScrollContext = createContext<LocomotiveScrollContextType>({
  scroll: null,
});

export const useLocomotiveScroll = () => useContext(LocomotiveScrollContext);

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export default function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<LocomotiveScroll | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Locomotive Scroll
    scrollRef.current = new LocomotiveScroll({
      el: containerRef.current,
      smooth: true,
      multiplier: 1,
      lerp: 0.1,
    });

    // Update scroll on resize
    const handleResize = () => {
      scrollRef.current?.update();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      scrollRef.current?.destroy();
    };
  }, []);

  return (
    <LocomotiveScrollContext.Provider value={{ scroll: scrollRef.current }}>
      <div ref={containerRef} data-scroll-container>
        {children}
      </div>
    </LocomotiveScrollContext.Provider>
  );
}
