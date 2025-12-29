import { tool } from "ai";
import {
  type GetAccommodationInfoInput,
  GetAccommodationInfoInputSchema,
  type GetAccommodationInfoOutput,
  GetAccommodationInfoOutputSchema
} from "@/tools/types";

/**
 * Get Accommodation Info Tool
 *
 * Provides information about recommended accommodations in Modra.
 * AI can use this when guests ask about hotels, lodging, or where to stay.
 */
export const getAccommodationInfoTool = tool<
  GetAccommodationInfoInput,
  GetAccommodationInfoOutput
>({
  description: `Get information about recommended accommodations in Modra. Use this when guest asks about:
  - Hotels or accommodations
  - Where to stay in Modra
  - Lodging options
  - Wellness hotels
  - Places near the wedding venue`,

  execute: async () => {
    console.log("Getting accommodation info...");
    return {
      accommodations: [
        {
          address: "Dukelská 4, 900 01 Modra",
          contact: {
            phone: "+421 33 647 2470",
            website: "www.hotelsebastian.sk"
          },
          distance: "20 metrov od hlavného námestia Modry",
          features: [
            "Najbližšie k miestu konania svadobnej hostiny",
            "V centre Modry",
            "20 izieb a 2 apartmány (kapacita 65 lôžok)",
            "Bezplatné Wi-Fi",
            "Klimatizácia vo všetkých izbách",
            "Reštaurácia s letnou terasou"
          ],
          name: "Hotel Sebastián u Hoffera",
          notes:
            "Najvýhodnejšia poloha - pešo k sobášnej sieni aj k reštaurácii Starý Dom.",
          priceRange: "Od 84€ za noc"
        },
        {
          address: "Štúrova 25, 900 01 Modra",
          contact: {
            email: "clubmkmmodra@gmail.com",
            phone: "+421 33 647 2009",
            website: "www.clubmkm.sk"
          },
          distance: "V pešej vzdialenosti od miesta konania hostiny",
          features: [
            "V centre Modry",
            "Penzión s možnosťou stravovania",
            "Reštaurácia, bar, bistro",
            "Billiard, bowling",
            "Sauna, krytý bazén",
            "Fitness, tenis",
            "Garáže"
          ],
          name: "Club M.K.M. Modra",
          notes:
            "Vhodné pre hostí, ktorí uprednostňujú cenovú dostupnosť s dobrou polohou.",
          priceRange: "Od 30€ za osobu za noc"
        },
        {
          address: "Harmónia 3018, 900 01 Modra",
          contact: {
            phone: "+421 2 3225 2328",
            website: "www.hotelpodlipou.sk"
          },
          distance: "1,9 km od centra Modry (rekreačná oblasť Harmónia)",
          features: [
            "Vyšší štandard s wellness",
            "3 bazény (krytý, vonkajší, detský)",
            "Spa s vírivkou, saunami a masážami",
            "Fitness centrum",
            "Až 10 športových plôch",
            "Obklopené Malými Karpatmi",
            "Oáza pokoja v prírode"
          ],
          name: "Hotel pod Lipou RESORT",
          notes:
            "Potrebný transfer z miesta konania svadobnej hostiny. Ideálne pre hostí, ktorí chcú wellness a relax.",
          priceRange: "Od 171€ za noc"
        },
        {
          address: "Piesok 4015/B7, 900 01 Modra",
          contact: {
            email: "recepcia@hzch.sk",
            phone: "+421 33 2633 300",
            website: "www.hotelzochovachata.sk"
          },
          distance: "34 km od Bratislavy, v lesnom prostredí Malých Karpát",
          features: [
            "Vyšší štandard s wellness",
            "Spa centrum s 4 druhmi sauny",
            "Vírivka, Kneippov kúpeľ",
            "Bazén 15 x 4 m",
            "Wellness záhrada s výhľadom na jazero",
            "Fitness centrum",
            "Uprostred bukového lesa"
          ],
          name: "Hotel Zochova chata",
          notes:
            "Potrebný transfer z miesta konania svadobnej hostiny. Pre náročných hostí hľadajúcich luxus a wellness.",
          priceRange: "Kontaktujte hotel pre aktuálne ceny"
        }
      ],
      generalInfo:
        "Prvé dva hotely (Sebastián a Club M.K.M.) sú v pešej vzdialenosti od sobášnej siene aj reštaurácie. Hotely pod Lipou a Zochova chata ponúkajú vyšší štandard a wellness, ale sú mimo centra a je potrebný transfer. Pre rezerváciu odporúčame kontaktovať hotely priamo alebo využiť booking portály.",
      type: "get-accommodation-info"
    };
  },

  inputSchema: GetAccommodationInfoInputSchema,
  outputSchema: GetAccommodationInfoOutputSchema
});
