"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import BookingModal from "@/components/BookingModal";
import { Car } from "@/lib/types";
import {
  extendedFallbackCars,
  carTypes,
  fuelTypes,
  transmissions,
  priceRanges,
} from "@/lib/constants";

gsap.registerPlugin(useGSAP);

export default function CarsPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [cars, setCars] = useState<Car[]>(extendedFallbackCars);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedFuel, setSelectedFuel] = useState("All");
  const [selectedTransmission, setSelectedTransmission] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch cars
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

  // Filter cars
  const filteredCars = cars.filter((car) => {
    const matchesType = selectedType === "All" || car.type === selectedType;
    const matchesFuel =
      selectedFuel === "All" ||
      car.fuelType === selectedFuel ||
      (selectedFuel === "Electric" && car.fuelType === "Electric");
    const matchesTransmission =
      selectedTransmission === "All" ||
      car.transmission === selectedTransmission;
    const price = parseFloat(car.pricePerDay);
    const matchesPrice =
      price >= selectedPriceRange.min && price < selectedPriceRange.max;
    const matchesSearch =
      searchQuery === "" ||
      `${car.make} ${car.model}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    return (
      matchesType &&
      matchesFuel &&
      matchesTransmission &&
      matchesPrice &&
      matchesSearch
    );
  });

  const handleBookNow = (car: Car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  useGSAP(
    () => {
      gsap.from(headerRef.current, {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    },
    { scope: pageRef }
  );

  useGSAP(
    () => {
      if (gridRef.current && !loading) {
        gsap.from(gridRef.current.children, {
          y: 60,
          opacity: 0,
          scale: 0.95,
          stagger: 0.05,
          duration: 0.6,
          ease: "power3.out",
        });
      }
    },
    { scope: pageRef, dependencies: [filteredCars, loading] }
  );

  return (
    <div ref={pageRef} className="min-h-screen bg-gray-50 pt-24">
      {/* Header */}
      <div ref={headerRef} className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Our Cars
              </h1>
              <p className="text-gray-600 mt-2">
                {filteredCars.length} vehicles available for rent
              </p>
            </div>

            {/* Search */}
            <div className="relative max-w-md w-full">
              <input
                type="text"
                placeholder="Search cars..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Filter Toggle (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden mt-4 flex items-center gap-2 text-gray-600"
          >
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
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>

          {/* Filters */}
          <div
            className={`mt-6 flex flex-wrap gap-4 ${
              showFilters ? "block" : "hidden md:flex"
            }`}
          >
            {/* Type Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-500 self-center mr-2">
                Type:
              </span>
              {carTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedType === type
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Fuel Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-500 self-center mr-2">
                Fuel:
              </span>
              {fuelTypes.map((fuel) => (
                <button
                  key={fuel}
                  onClick={() => setSelectedFuel(fuel)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedFuel === fuel
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {fuel}
                </button>
              ))}
            </div>

            {/* Transmission Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-500 self-center mr-2">
                Transmission:
              </span>
              {transmissions.map((trans) => (
                <button
                  key={trans}
                  onClick={() => setSelectedTransmission(trans)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedTransmission === trans
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {trans}
                </button>
              ))}
            </div>

            {/* Price Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-500 self-center mr-2">
                Price:
              </span>
              {priceRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => setSelectedPriceRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedPriceRange.label === range.label
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cars Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No cars found
            </h3>
            <p className="text-gray-600">Try adjusting your filters</p>
          </div>
        ) : (
          <div
            ref={gridRef}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredCars.map((car) => (
              <div
                key={car.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100"
              >
                {/* Car Image */}
                <div className="relative h-44 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                  <Image
                    src={car.imageUrl || "/cars/hero-car.png"}
                    alt={`${car.make} ${car.model}`}
                    fill
                    className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                  />
                  {car.featured && (
                    <span className="absolute top-3 left-3 bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                    {car.type}
                  </span>
                </div>

                {/* Car Info */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {car.make} {car.model}
                      </h3>
                      <p className="text-gray-500 text-sm">{car.year}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold text-primary">
                        ${car.pricePerDay}
                      </span>
                      <p className="text-gray-400 text-xs">/day</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-3.5 h-3.5"
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
                        className="w-3.5 h-3.5"
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
                      {car.seats}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-3.5 h-3.5"
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
                    className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-primary transition-colors duration-300"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
    </div>
  );
}
