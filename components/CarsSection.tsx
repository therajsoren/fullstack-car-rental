"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BookingModal from "./BookingModal";
import { Car } from "@/lib/types";
import { fallbackCars, carTypes } from "@/lib/constants";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CarsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [cars, setCars] = useState<Car[]>(fallbackCars);
  const [selectedType, setSelectedType] = useState("All");
  const [loading, setLoading] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/cars");
        if (res.ok) {
          const data = await res.json();
          if (data.cars && data.cars.length > 0) {
            setCars(data.cars);
          }
        }
      } catch (error) {
        console.log("Using fallback car data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const filteredCars =
    selectedType === "All"
      ? cars
      : cars.filter(
          (car) =>
            car.type === selectedType ||
            (selectedType === "Electric" && car.fuelType === "Electric")
        );

  const handleBookNow = (car: Car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  useGSAP(
    () => {
      gsap.from(headingRef.current?.children || [], {
        y: 60,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(filtersRef.current?.children || [], {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: filtersRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: sectionRef }
  );

  useGSAP(
    () => {
      if (gridRef.current) {
        gsap.from(gridRef.current.children, {
          y: 40,
          opacity: 0,
          stagger: 0.1,
          duration: 0.5,
          ease: "power2.out",
        });
      }
    },
    { scope: sectionRef, dependencies: [selectedType] }
  );

  return (
    <>
      <section
        ref={sectionRef}
        id="cars"
        className="py-24 lg:py-40 bg-gradient-to-b from-white to-gray-50"
        data-scroll-section
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div ref={headingRef} className="text-center mb-12">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Our Fleet
            </span>
            <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-medium mt-4 text-gray-900">
              Explore Our Cars
            </h2>
            <p className="text-gray-600 text-lg mt-4 max-w-2xl mx-auto">
              Choose from our premium selection of vehicles. Each car is
              maintained to the highest standards for your comfort and safety.
            </p>
          </div>

          {/* Filter Tabs */}
          <div
            ref={filtersRef}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {carTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedType === type
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Cars Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div
              ref={gridRef}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredCars.map((car) => (
                <div
                  key={car.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100"
                >
                  {/* Car Image */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    <Image
                      src={car.imageUrl || "/cars/hero-car.png"}
                      alt={`${car.make} ${car.model}`}
                      fill
                      className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                    />
                    {car.featured && (
                      <span className="absolute top-4 left-4 bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                    <span className="absolute top-4 right-4 bg-white/90 backdrop-blur text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                      {car.type}
                    </span>
                  </div>

                  {/* Car Info */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {car.make} {car.model}
                        </h3>
                        <p className="text-gray-500 text-sm">{car.year}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-primary">
                          ${car.pricePerDay}
                        </span>
                        <p className="text-gray-400 text-xs">/day</p>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {car.transmission}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {car.seats} Seats
                      </span>
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        {car.fuelType}
                      </span>
                    </div>

                    {/* Book Button */}
                    <button
                      onClick={() => handleBookNow(car)}
                      className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-primary transition-colors duration-300"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View All Button */}
          <div className="text-center mt-12">
            <a
              href="/cars"
              className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all duration-300"
            >
              View All Vehicles
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
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {selectedCar && (
        <BookingModal
          car={selectedCar}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCar(null);
          }}
        />
      )}
    </>
  );
};

export default CarsSection;
