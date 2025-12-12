"use client";
import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(headlineRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
      });

      tl.from(
        subheadlineRef.current,
        {
          y: 40,
          opacity: 0,
          duration: 0.8,
        },
        "-=0.6"
      );

      tl.from(
        ctaRef.current?.children || [],
        {
          y: 30,
          opacity: 0,
          stagger: 0.15,
          duration: 0.6,
        },
        "-=0.4"
      );

      tl.from(
        carRef.current,
        {
          x: 100,
          opacity: 0,
          duration: 1,
        },
        "-=0.8"
      );

      tl.from(
        statsRef.current?.children || [],
        {
          y: 30,
          opacity: 0,
          stagger: 0.1,
          duration: 0.5,
        },
        "-=0.4"
      );

      gsap.to(carRef.current, {
        y: -15,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen overflow-hidden pt-20 bg-gradient-to-br from-orange-50 via-white to-rose-50"
      data-scroll-section
    >
      {/* Simple Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-orange-100/50 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-200px)]">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-full px-4 py-2 mb-6 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span
                className="text-sm font-medium text-gray-600"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Premium Car Rental Experience
              </span>
            </div>

            {/* Headline */}
            <h1
              ref={headlineRef}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.05] mb-6 tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Luxury Meets
              <br />
              <span className="text-primary">the Open Road</span>
            </h1>

            {/* Subheadline */}
            <p
              ref={subheadlineRef}
              className="text-lg text-gray-600 mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Experience the thrill of premium vehicles. From exotic sports cars
              to elegant luxury sedans — your perfect ride awaits.
            </p>

            {/* CTA Buttons */}
            <div
              ref={ctaRef}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
            >
              <a
                href="#cars"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-medium rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
              >
                Explore Cars
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-medium rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
              >
                Our Services
              </a>
            </div>

            {/* Stats */}
            <div
              ref={statsRef}
              className="flex flex-wrap gap-8 justify-center lg:justify-start"
            >
              <div className="text-center lg:text-left">
                <p className="text-3xl font-bold text-gray-900">1K+</p>
                <p className="text-sm text-gray-500">Happy Customers</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-3xl font-bold text-gray-900">10+</p>
                <p className="text-sm text-gray-500">Premium Cars</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-3xl font-bold text-gray-900">4.9★</p>
                <p className="text-sm text-gray-500">Rating</p>
              </div>
            </div>
          </div>

          {/* Right Content - Car */}
          <div
            ref={carRef}
            className="relative flex items-center justify-center lg:justify-end"
          >
            {/* Car Container */}
            <div className="relative w-full max-w-lg">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-orange-300/10 blur-3xl rounded-full scale-90" />

              {/* Car Image */}
              <div className="relative aspect-[4/3]">
                <Image
                  src="/cars/hero-car.png"
                  alt="Premium Car"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>

              {/* Price Badge */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500">Starting from</p>
                <p className="text-xl font-bold text-gray-900">
                  $49<span className="text-sm font-normal">/day</span>
                </p>
              </div>

              {/* Rating Badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-1">2,000+ Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs text-gray-400 uppercase tracking-wider">
          Scroll
        </span>
        <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-gray-400 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
