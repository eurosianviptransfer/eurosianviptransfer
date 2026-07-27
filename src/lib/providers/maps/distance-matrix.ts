import { airports, type AirportCode } from "@/lib/airports";

/**
 * Google Distance Matrix API sarmalayıcısı — sunucu tarafında, GOOGLE_MAPS_SERVER_API_KEY
 * ile çağrılır (istemci anahtarından farklı, domain kısıtlaması yerine IP/sunucu kısıtı önerilir).
 */
export interface DistanceResult {
  km: number;
  durationMinutes: number;
}

export async function getDistanceFromAirport(destinationLat: number, destinationLng: number, airportCode: AirportCode = "AYT"): Promise<DistanceResult> {
  const apiKey = process.env.GOOGLE_MAPS_SERVER_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_MAPS_SERVER_API_KEY eksik.");
  const airport = airports.find((item) => item.code === airportCode) ?? airports[0];

  const url =
    `https://maps.googleapis.com/maps/api/distancematrix/json` +
    `?origins=${airport.coordinates}` +
    `&destinations=${destinationLat},${destinationLng}` +
    `&units=metric&key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  const element = data.rows?.[0]?.elements?.[0];
  if (!element || element.status !== "OK") {
    throw new Error(`Distance Matrix hatası: ${element?.status ?? "bilinmiyor"}`);
  }

  return {
    km: round1(element.distance.value / 1000),
    durationMinutes: Math.round(element.duration.value / 60),
  };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
