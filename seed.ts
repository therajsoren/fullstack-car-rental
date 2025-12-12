import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "./db";
import { cars } from "./db/schema";

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
  {
    make: "Ferrari",
    model: "F8 Tributo",
    year: 2024,
    type: "Sports",
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 2,
    pricePerDay: "599.00",
    imageUrl: "/cars/hero-car.png",
    description: "Italian supercar with breathtaking performance",
    available: true,
    featured: true,
  },
  {
    make: "Lamborghini",
    model: "Huracán",
    year: 2024,
    type: "Sports",
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 2,
    pricePerDay: "649.00",
    imageUrl: "/cars/hero-car.png",
    description: "Raging bull with V10 power",
    available: true,
    featured: true,
  },
];

async function seed() {
  console.log("🌱 Seeding database with cars...");

  try {
    // Insert cars
    const inserted = await db.insert(cars).values(seedCars).returning();

    console.log(`✅ Successfully inserted ${inserted.length} cars`);
    console.log("Car IDs:", inserted.map((c) => c.id).join(", "));
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
