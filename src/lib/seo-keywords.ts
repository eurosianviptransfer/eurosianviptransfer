export const keywordMatrix = {
  airport: ["istanbul airport vip transfer", "sabiha gokcen vip transfer", "antalya airport vip transfer", "bodrum milas airport vip transfer", "dalaman airport vip transfer", "izmir adnan menderes airport transfer", "cappadocia nevsehir airport vip transfer"],
  intercity: ["istanbul to bursa vip transfer", "istanbul to cappadocia private transfer", "antalya to fethiye vip transfer", "bodrum to marmaris luxury transfer", "izmir to cesme vip transfer"],
  fleet: ["mercedes maybach transfer turkey", "v class vip transfer istanbul", "sprinter vip rental with driver turkey"],
  niche: ["hair transplant vip transfer istanbul", "dental clinic vip transfer antalya"],
} as const;

export const allSeoKeywords = Object.values(keywordMatrix).flat();
