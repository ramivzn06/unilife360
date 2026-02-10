import { NextResponse } from "next/server";

// MVP: Simulated economic data per country
const ECONOMIC_DATA: Record<
  string,
  {
    inflationRate: number;
    avgGroceryBasket: number;
    avgEnergyCost: number;
    avgTransportCost: number;
    currency: string;
  }
> = {
  FR: {
    inflationRate: 4.2,
    avgGroceryBasket: 65,
    avgEnergyCost: 85,
    avgTransportCost: 40,
    currency: "EUR",
  },
  DE: {
    inflationRate: 3.8,
    avgGroceryBasket: 55,
    avgEnergyCost: 95,
    avgTransportCost: 49,
    currency: "EUR",
  },
  ES: {
    inflationRate: 3.5,
    avgGroceryBasket: 50,
    avgEnergyCost: 70,
    avgTransportCost: 35,
    currency: "EUR",
  },
  IT: {
    inflationRate: 3.9,
    avgGroceryBasket: 60,
    avgEnergyCost: 80,
    avgTransportCost: 35,
    currency: "EUR",
  },
  GB: {
    inflationRate: 5.1,
    avgGroceryBasket: 70,
    avgEnergyCost: 100,
    avgTransportCost: 60,
    currency: "GBP",
  },
  US: {
    inflationRate: 3.2,
    avgGroceryBasket: 80,
    avgEnergyCost: 120,
    avgTransportCost: 70,
    currency: "USD",
  },
  CA: {
    inflationRate: 3.0,
    avgGroceryBasket: 90,
    avgEnergyCost: 100,
    avgTransportCost: 65,
    currency: "CAD",
  },
  BE: {
    inflationRate: 4.0,
    avgGroceryBasket: 62,
    avgEnergyCost: 90,
    avgTransportCost: 42,
    currency: "EUR",
  },
  CH: {
    inflationRate: 1.5,
    avgGroceryBasket: 120,
    avgEnergyCost: 110,
    avgTransportCost: 80,
    currency: "CHF",
  },
  MA: {
    inflationRate: 6.1,
    avgGroceryBasket: 35,
    avgEnergyCost: 40,
    avgTransportCost: 20,
    currency: "MAD",
  },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country")?.toUpperCase() || "FR";

  const data = ECONOMIC_DATA[country] || ECONOMIC_DATA["FR"];

  return NextResponse.json({
    country,
    ...data,
    source: "simulated",
    updatedAt: new Date().toISOString(),
  });
}
