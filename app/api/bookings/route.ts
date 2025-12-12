import { db } from "@/db";
import { bookings, cars, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/user";

// GET - Get user's bookings
export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's bookings with car details
    const userBookings = await db
      .select({
        booking: bookings,
        car: cars,
      })
      .from(bookings)
      .leftJoin(cars, eq(bookings.carId, cars.id))
      .where(eq(bookings.userId, session.id));

    return NextResponse.json({ bookings: userBookings }, { status: 200 });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// POST - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { carId, startDate, endDate, pickupLocation, dropoffLocation } = body;

    if (!carId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get car details and check availability
    const car = await db
      .select()
      .from(cars)
      .where(and(eq(cars.id, carId), eq(cars.available, true)))
      .limit(1);

    if (car.length === 0) {
      return NextResponse.json({ error: "Car not available" }, { status: 400 });
    }

    // Calculate total price
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = (parseFloat(car[0].pricePerDay) * days).toFixed(2);

    // Create booking
    const newBooking = await db
      .insert(bookings)
      .values({
        userId: session.id,
        carId,
        startDate,
        endDate,
        totalPrice,
        pickupLocation,
        dropoffLocation,
        status: "pending",
      })
      .returning();

    return NextResponse.json({ booking: newBooking[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
