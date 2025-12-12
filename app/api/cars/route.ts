import { db } from "@/db";
import { cars } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET - List all cars (with optional filtering)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");
    const available = searchParams.get("available");

    let query = db.select().from(cars);

    if (type) {
      query = query.where(eq(cars.type, type)) as typeof query;
    }

    if (available === "true") {
      query = query.where(eq(cars.available, true)) as typeof query;
    }

    const allCars = await query;

    return NextResponse.json({ cars: allCars }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cars:", error);
    return NextResponse.json(
      { error: "Failed to fetch cars" },
      { status: 500 }
    );
  }
}

// POST - Add a new car (admin only in production)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      make,
      model,
      year,
      type,
      transmission,
      fuelType,
      seats,
      pricePerDay,
      imageUrl,
      description,
      featured,
    } = body;

    if (
      !make ||
      !model ||
      !year ||
      !type ||
      !transmission ||
      !fuelType ||
      !seats ||
      !pricePerDay
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newCar = await db
      .insert(cars)
      .values({
        make,
        model,
        year,
        type,
        transmission,
        fuelType,
        seats,
        pricePerDay,
        imageUrl,
        description,
        featured: featured || false,
      })
      .returning();

    return NextResponse.json({ car: newCar[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating car:", error);
    return NextResponse.json(
      { error: "Failed to create car" },
      { status: 500 }
    );
  }
}
