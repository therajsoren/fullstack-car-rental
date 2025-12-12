import { db } from "@/db";
import { cars } from "@/db/schema";
import { NextResponse } from "next/server";

const seedCars = [
  {
    make: "Audi",
    model: "A4",
    year: 2024,
    type: "Sedan",
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 5,
    pricePerDay: "89.00",
    imageUrl: "/cars/hero-car.png",
    description: "Luxury sedan with premium features",
    available: true,
    featured: true,
  },
  {
    make: "BMW",
    model: "X5",
    year: 2024,
    type: "SUV",
    transmission: "Automatic",
    fuelType: "Diesel",
    seats: 7,
    pricePerDay: "129.00",
    imageUrl: "/cars/hero-car.png",
    description: "Spacious luxury SUV",
    available: true,
    featured: true,
  },
  {
    make: "Mercedes",
    model: "C-Class",
    year: 2024,
    type: "Sedan",
    transmission: "Automatic",
    fuelType: "Hybrid",
    seats: 5,
    pricePerDay: "99.00",
    imageUrl: "/cars/hero-car.png",
    description: "Elegant and fuel-efficient",
    available: true,
    featured: false,
  },
  {
    make: "Porsche",
    model: "911",
    year: 2024,
    type: "Sports",
    transmission: "Manual",
    fuelType: "Petrol",
    seats: 2,
    pricePerDay: "249.00",
    imageUrl: "/cars/hero-car.png",
    description: "Ultimate driving experience",
    available: true,
    featured: true,
  },
  {
    make: "Tesla",
    model: "Model 3",
    year: 2024,
    type: "Sedan",
    transmission: "Automatic",
    fuelType: "Electric",
    seats: 5,
    pricePerDay: "109.00",
    imageUrl: "/cars/hero-car.png",
    description: "Zero emissions, maximum performance",
    available: true,
    featured: false,
  },
  {
    make: "Range Rover",
    model: "Sport",
    year: 2024,
    type: "SUV",
    transmission: "Automatic",
    fuelType: "Diesel",
    seats: 5,
    pricePerDay: "179.00",
    imageUrl: "/cars/hero-car.png",
    description: "Luxury meets adventure",
    available: true,
    featured: true,
  },
];

export async function POST() {
  try {
    // Check if cars already exist
    const existingCars = await db.select().from(cars).limit(1);

    if (existingCars.length > 0) {
      return NextResponse.json(
        {
          message: "Cars already exist in database",
          count: existingCars.length,
        },
        { status: 200 }
      );
    }

    // Insert cars
    const inserted = await db.insert(cars).values(seedCars).returning();

    return NextResponse.json(
      {
        message: "Successfully seeded database",
        count: inserted.length,
        cars: inserted,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error seeding cars:", error);
    return NextResponse.json({ error: "Failed to seed cars" }, { status: 500 });
  }
}
