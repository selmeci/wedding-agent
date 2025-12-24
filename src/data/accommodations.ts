import type { NewAccommodation } from "@/db";

/**
 * Accommodation seed data
 * Recommended hotels and accommodations in Modra area
 *
 * Replace/update this with actual accommodation recommendations
 */
export const accommodationSeedData: Omit<
  NewAccommodation,
  "id" | "createdAt"
>[] = [
  {
    address: "Hlavná 123, 900 01 Modra",
    description:
      "Moderný hotel v centre Modry s pohodlnými izbami a raňajkami. Ideálna poloha blízko sobášnej siene.",
    distanceKm: 1,
    email: "info@hotelmodra.sk",
    name: "Hotel Modra",
    phone: "+421 33 123 4567",
    priceRange: "€€",
    website: "https://www.hotelmodra.sk"
  },
  {
    address: "Vinohradnícka 45, 900 01 Modra",
    description:
      "Rodinný penzión s vinárskou tematikou. Útulné prostredie a výborné víno z vlastnej produkcie.",
    distanceKm: 2,
    email: "penzion@uhrozna.sk",
    name: "Penzión U Hrozna",
    phone: "+421 33 234 5678",
    priceRange: "€",
    website: "https://www.penzionuhrozna.sk"
  },
  {
    address: "Kúpeľná 78, 900 01 Modra",
    description:
      "Wellness hotel s bazénom a saunou. Perfektné miesto na relaxáciu pred svadbou.",
    distanceKm: 3,
    email: "reception@harmonia.sk",
    name: "Hotel Harmónia",
    phone: "+421 33 345 6789",
    priceRange: "€€€",
    website: "https://www.hotelharmonia.sk"
  },
  {
    address: "Ranč 12, 900 01 Modra",
    description:
      "Priestranné apartmány vhodné pre rodiny s deťmi. Parkové prostredie a detské ihrisko.",
    distanceKm: 4,
    email: null,
    name: "Apartmány Modranský Ranč",
    phone: "+421 33 456 7890",
    priceRange: "€€",
    website: null
  },
  {
    address: "Modra - centrum",
    description:
      "V Modre je dostupných viacero súkromných ubytovaní cez Airbnb. Odporúčame vyhľadať v okolí centra.",
    distanceKm: 0,
    email: null,
    name: "Airbnb možnosti",
    phone: "-",
    priceRange: "€-€€",
    website: "https://www.airbnb.com"
  }
];
