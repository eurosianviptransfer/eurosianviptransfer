/**
 * FlightTrackingProvider — Bölüm 15.1. AviationStack free tier ile başla,
 * hacim büyüyünce ücretli katman/FlightAware'e adapter değişimiyle geçilebilsin.
 */
export interface FlightStatus {
  flightNumber: string;
  estimatedLandingAt: Date | null;
  status: "scheduled" | "landed" | "delayed" | "unknown";
}

export interface FlightTrackingProvider {
  readonly name: string;
  getStatus(flightNumber: string): Promise<FlightStatus>;
}

class AviationStackProvider implements FlightTrackingProvider {
  readonly name = "aviationstack";

  async getStatus(flightNumber: string): Promise<FlightStatus> {
    const apiKey = process.env.AVIATIONSTACK_API_KEY;
    if (!apiKey) throw new Error("AVIATIONSTACK_API_KEY eksik.");

    const res = await fetch(
      `https://api.aviationstack.com/v1/flights?access_key=${apiKey}&flight_iata=${flightNumber}`
    );
    const data = await res.json();
    const flight = data.data?.[0];
    if (!flight) return { flightNumber, estimatedLandingAt: null, status: "unknown" };

    return {
      flightNumber,
      estimatedLandingAt: flight.arrival?.estimated ? new Date(flight.arrival.estimated) : null,
      status: flight.flight_status === "landed" ? "landed" : flight.flight_status === "active" ? "delayed" : "scheduled",
    };
  }
}

/**
 * Free tier'ın aylık sorgu limiti düşük olduğundan (Bölüm 15.1), sorgu SADECE
 * tahmini inişten belirli saat önce ve sınırlı sayıda tetiklenmeli. Bu yardımcı
 * fonksiyon "şimdi sorgulamalı mıyız" kararını verir — gerçek çağrıyı yapmaz.
 */
export function shouldPollFlight(params: {
  scheduledLandingAt: Date;
  now: Date;
  pollWindowHours?: number;
  monthlyQueriesRemaining: number;
}): boolean {
  const { scheduledLandingAt, now, pollWindowHours = 3, monthlyQueriesRemaining } = params;
  if (monthlyQueriesRemaining <= 0) return false; // limit dolduysa sessizce eski davranışa düş
  const hoursUntilLanding = (scheduledLandingAt.getTime() - now.getTime()) / 3_600_000;
  return hoursUntilLanding <= pollWindowHours && hoursUntilLanding >= -1;
}

export function getFlightTrackingProvider(): FlightTrackingProvider {
  return new AviationStackProvider();
}
