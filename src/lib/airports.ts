export const airports = [
  { code: "AYT", city: "Antalya", name: "Antalya Havalimanı", coordinates: "36.8987,30.8005" },
  { code: "IST", city: "İstanbul", name: "İstanbul Havalimanı", coordinates: "41.2753,28.7519" },
  { code: "SAW", city: "İstanbul", name: "Sabiha Gökçen Havalimanı", coordinates: "40.8986,29.3092" },
  { code: "ADB", city: "İzmir", name: "İzmir Adnan Menderes Havalimanı", coordinates: "38.2924,27.1570" },
  { code: "ESB", city: "Ankara", name: "Ankara Esenboğa Havalimanı", coordinates: "40.1281,32.9951" },
  { code: "BJV", city: "Bodrum", name: "Milas-Bodrum Havalimanı", coordinates: "37.2506,27.6643" },
  { code: "DLM", city: "Dalaman", name: "Dalaman Havalimanı", coordinates: "36.7131,28.7925" },
  { code: "GZP", city: "Alanya", name: "Gazipaşa-Alanya Havalimanı", coordinates: "36.2992,32.3006" },
  { code: "TZX", city: "Trabzon", name: "Trabzon Havalimanı", coordinates: "40.9951,39.7897" },
  { code: "ASR", city: "Kayseri", name: "Kayseri Erkilet Havalimanı", coordinates: "38.7704,35.4954" },
  { code: "NAV", city: "Nevşehir", name: "Nevşehir Kapadokya Havalimanı", coordinates: "38.7719,34.5345" },
  { code: "AJI", city: "Ağrı", name: "Ağrı Ahmed-i Hani Havalimanı", coordinates: "39.6546,43.0257" },
  { code: "VAN", city: "Van", name: "Van Ferit Melen Havalimanı", coordinates: "38.4682,43.3323" },
] as const;

export const airportCodes = airports.map((airport) => airport.code) as [string, ...string[]];
export type AirportCode = (typeof airports)[number]["code"];
