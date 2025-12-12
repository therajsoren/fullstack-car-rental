export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  type: string;
  transmission: string;
  fuelType: string;
  seats: number;
  pricePerDay: string;
  imageUrl: string | null;
  description: string | null;
  available: boolean;
  featured: boolean;
}

export interface NavLink {
  name: string;
  href: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface PriceRange {
  label: string;
  min: number;
  max: number;
}

export interface ClientUser {
  id: string;
  email: string;
  name: string | null;
}
