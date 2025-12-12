import { redirect } from "next/navigation";
import { db } from "@/db";
import { bookings, cars } from "@/db/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { getSession } from "@/lib/user";
import DashboardCars from "./DashboardCars";
import { fallbackCars, getBookingStatusColor } from "@/lib/constants";

async function getAvailableCars() {
  try {
    const availableCars = await db
      .select()
      .from(cars)
      .where(eq(cars.available, true));

    if (availableCars.length > 0) {
      return availableCars;
    }
    return fallbackCars;
  } catch {
    return fallbackCars;
  }
}

async function getUserBookings(userId: string) {
  const userBookings = await db
    .select({
      booking: bookings,
      car: cars,
    })
    .from(bookings)
    .leftJoin(cars, eq(bookings.carId, cars.id))
    .where(eq(bookings.userId, userId))
    .orderBy(bookings.createdAt);

  return userBookings;
}

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  const [availableCars, userBookings] = await Promise.all([
    getAvailableCars(),
    getUserBookings(session.id),
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-gray-900"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            My Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {session.name || session.email}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {userBookings.length}
                </p>
                <p className="text-gray-600 text-sm">Total Bookings</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    userBookings.filter((b) => b.booking.status === "confirmed")
                      .length
                  }
                </p>
                <p className="text-gray-600 text-sm">Active Bookings</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  $
                  {userBookings
                    .reduce(
                      (sum, b) => sum + parseFloat(b.booking.totalPrice),
                      0
                    )
                    .toFixed(0)}
                </p>
                <p className="text-gray-600 text-sm">Total Spent</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {availableCars.length}
                </p>
                <p className="text-gray-600 text-sm">Cars Available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Available Cars Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Book a Car
            </h2>
          </div>
          <DashboardCars cars={availableCars} />
        </div>

        {/* My Bookings Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2
              className="text-xl font-semibold text-gray-900"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              My Bookings
            </h2>
          </div>

          {userBookings.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No bookings yet
              </h3>
              <p className="text-gray-600">
                Book a car from the selection above to get started!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {userBookings.map(({ booking, car }) => (
                <div
                  key={booking.id}
                  className="p-6 flex flex-col md:flex-row gap-6 hover:bg-gray-50 transition-colors"
                >
                  {/* Car Image */}
                  <div className="relative w-full md:w-40 h-28 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={car?.imageUrl || "/cars/hero-car.png"}
                      alt={car ? `${car.make} ${car.model}` : "Car"}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  {/* Booking Details */}
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {car ? `${car.make} ${car.model}` : "Car"}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {car?.year} • {car?.type}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Pickup</p>
                        <p className="font-medium text-gray-900">
                          {booking.startDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Return</p>
                        <p className="font-medium text-gray-900">
                          {booking.endDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Location</p>
                        <p className="font-medium text-gray-900 capitalize">
                          {booking.pickupLocation || "Downtown"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Total</p>
                        <p className="font-bold text-primary">
                          ${booking.totalPrice}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {booking.status === "pending" && (
                    <div className="flex md:flex-col gap-2 flex-shrink-0">
                      <button className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
