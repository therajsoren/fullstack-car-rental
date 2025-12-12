"use client";
import { useState } from "react";
import Image from "next/image";
import BookingModal from "@/components/BookingModal";
import { Car } from "@/lib/types";

export default function DashboardCars({ cars }: { cars: Car[] }) {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("All");

  const handleBookNow = (car: Car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const carTypes = ["All", ...new Set(cars.map((car) => car.type))];

  const filteredCars =
    filter === "All" ? cars : cars.filter((car) => car.type === filter);

  return (
    <>
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {carTypes.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === type
                ? "bg-primary text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Cars Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCars.map((car) => (
          <div
            key={car.id}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100"
          >
            {/* Car Image */}
            <div className="relative h-40 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
              <Image
                src={car.imageUrl || "/cars/hero-car.png"}
                alt={`${car.make} ${car.model}`}
                fill
                className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
              />
              {car.featured && (
                <span className="absolute top-3 left-3 bg-primary text-white text-xs font-medium px-2 py-1 rounded-full">
                  Featured
                </span>
              )}
              <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                {car.type}
              </span>
            </div>

            {/* Car Info */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {car.make} {car.model}
                  </h3>
                  <p className="text-gray-500 text-sm">{car.year}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-primary">
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
}
