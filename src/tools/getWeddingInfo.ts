import { tool } from "ai";
import {
  type GetWeddingInfoInput,
  GetWeddingInfoInputSchema,
  type GetWeddingInfoOutput,
  GetWeddingInfoOutputSchema
} from "@/tools/types";

/**
 * Get Wedding Info Tool
 *
 * Provides comprehensive wedding information.
 * AI can use this for any questions about date, time, location, etc.
 */
export const getWeddingInfoTool = tool<
  GetWeddingInfoInput,
  GetWeddingInfoOutput
>({
  description: `Get detailed information about the wedding. Use this when guest asks about:
  - Date and time
  - Location and venue
  - Ceremony vs reception times
  - Dress code
  - Gifts
  - General wedding details`,

  execute: async () => {
    console.log("Getting wedding info...");
    return {
      ceremony: {
        address: "Štúrova 59, 900 01 Modra",
        description:
          "Sobáš sa uskutoční v modernej sobášnej miestnosti v centre Modry",
        time: "15:30",
        venue: "Nová sobášna miestnosť mesta Modra"
      },

      contact: {
        bride: "Ivonka",
        groom: "Roman",
        message: "Pre akékoľvek otázky nás môžete kontaktovať priamo"
      },
      date: "27. marec 2026",

      dressCode:
        "Smart casual - pánske sako nie je povinné, ženy môžu ľubovoľné šaty",

      gifts: {
        details:
          "Ak chcete darovať kvety, preferujeme menšie, jednoduché kytice. Finančné príspevky na svadobnú cestu sú tiež vítané.",
        summary: "Nevesta nechce veľké kytice. Akékoľvek iné darčeky sú vítané."
      },
      location: "Modra, Slovensko",

      parking: {
        available: true,
        location:
          "Parkovanie je možné v centre Modry, cca 2-3 minúty chôdze od oboch venue"
      },

      reception: {
        address: "Dukelská 2, 900 01 Modra",
        description:
          "Hostina sa bude konať v útulnej reštaurácii v srdci Modry",
        distance: "5 minút chôdze od sobášnej miestnosti",
        time: "Po obrade až do polnoci",
        venue: "Reštaurácia Starý Dom"
      },

      schedule: {
        ceremony: "15:30 - 16:00",
        photos: "16:00 - 17:00",
        reception: "17:00 - polnoc"
      },

      type: "get-wedding-info"
    };
  },

  inputSchema: GetWeddingInfoInputSchema,
  outputSchema: GetWeddingInfoOutputSchema
});
