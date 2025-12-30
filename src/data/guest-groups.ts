/**
 * Guest group seed data
 * Groups of guests who share one QR code (families, couples with +1)
 *
 * Each group will receive ONE QR code for all members
 * The QR code should link to: https://yourdomain.com/?token={qrToken}
 */
import type { NewGuest, NewGuestGroup } from "@/db";

export interface GuestGroupSeed {
  group: Omit<NewGuestGroup, "id" | "createdAt">;
  guests: Omit<NewGuest, "id" | "createdAt" | "groupId">[];
}

export const guestGroupSeedData: GuestGroupSeed[] = [
  {
    group: {
      name: "Rodina Novákovcov",
      qrToken: "group-novak-family-001"
    },
    guests: [
      {
        about: "Otec rodiny. Rád cestuje a fotografuje.",
        email: "marek.novak@example.com",
        firstName: "Marek",
        lastName: "Novák",
        phone: "+421901111111",
        relationship: "rodina nevesty"
      },
      {
        about: "Mama rodiny. Učiteľka, vegetariánka.",
        email: "katka.novakova@example.com",
        firstName: "Katka",
        lastName: "Nováková",
        phone: "+421901111112",
        relationship: "rodina nevesty"
      },
      {
        about: "Syn, 5 rokov. Má rád dinosaury.",
        email: "marek.novak@example.com", // Same as parent
        firstName: "Marko",
        lastName: "Novák",
        phone: "+421901111111", // Same as parent
        relationship: "rodina nevesty"
      }
    ]
  },
  {
    group: {
      name: "Peter Kováč a hosť",
      qrToken: "group-kovac-plus1-002"
    },
    guests: [
      {
        about: "Kamarát zo strednej školy. Pracuje v IT.",
        email: "peter.kovac@example.com",
        firstName: "Peter",
        lastName: "Kováč",
        phone: "+421902222222",
        relationship: "priatelia ženicha"
      },
      {
        about: "Partnerka Petra.",
        email: "lucia.kovacova@example.com",
        firstName: "Lucia",
        lastName: "Kováčová",
        phone: "+421902222223",
        relationship: "priatelia ženicha"
      }
    ]
  },
  {
    group: {
      name: "Rodina Horvátovcov",
      qrToken: "group-horvat-family-003"
    },
    guests: [
      {
        about: "Strýko ženicha. Volá sa Tomi. Má rád hudbu.",
        email: "tomas.horvath@example.com",
        firstName: "Tomáš",
        lastName: "Horváth",
        phone: "+421903333333",
        relationship: "rodina ženicha"
      },
      {
        about: "Teta ženicha. Prezývka Andrejka. Lekárka.",
        email: "andrea.horvathova@example.com",
        firstName: "Andrea",
        lastName: "Horváthová",
        phone: "+421903333334",
        relationship: "rodina ženicha"
      },
      {
        about: "Dcéra, 8 rokov. Hrá na klavír.",
        email: "tomas.horvath@example.com", // Same as parent
        firstName: "Sofia",
        lastName: "Horváthová",
        phone: "+421903333333", // Same as parent
        relationship: "rodina ženicha"
      },
      {
        about: "Syn, 3 roky. Má rád autíčka.",
        email: "tomas.horvath@example.com", // Same as parent
        firstName: "Filip",
        lastName: "Horváth",
        phone: "+421903333333", // Same as parent
        relationship: "rodina ženicha"
      }
    ]
  },

  // Single-member groups (individual guests)
  {
    group: {
      name: "Mária Nováková",
      qrToken: "group-maria-novakova-004"
    },
    guests: [
      {
        about:
          "Teta nevesty. Prezývka Majka. Vegetariánka. Učiteľka matematiky.",
        email: "maria.novakova@example.com",
        firstName: "Mária",
        lastName: "Nováková",
        phone: "+421904444444",
        relationship: "rodina nevesty"
      }
    ]
  },
  {
    group: {
      name: "Ján Kovács",
      qrToken: "group-jan-kovacs-005"
    },
    guests: [
      {
        about: "Strýko ženicha. Volá sa Janko. Má rád futbal.",
        email: "jan.kovacs@example.com",
        firstName: "Ján",
        lastName: "Kovács",
        phone: "+421905555555",
        relationship: "rodina ženicha"
      }
    ]
  },
  {
    group: {
      isFromModra: true,
      name: "Mama, otec, Ľubka",
      qrToken: "group-mama-otec-lubka-006"
    },
    guests: [
      {
        about: "Mama. Je z mesta Modra.",
        email: "",
        firstName: "Mama",
        lastName: "",
        phone: "",
        relationship: "rodina nevesty"
      },
      {
        about: "Otec – bezmliečne. Je z mesta Modra.",
        email: "",
        firstName: "Otec",
        lastName: "",
        phone: "",
        relationship: "rodina nevesty"
      },
      {
        about:
          "Ľubka – bezpleková, bezmliečna, špeciálne menu (kuracie na prírodno, ryža/zemiaky, šalát). Je z mesta Modra.",
        email: "",
        firstName: "Ľubka",
        lastName: "",
        phone: "",
        relationship: "rodina nevesty"
      }
    ]
  },
  {
    group: {
      name: "Ujo Peťo a teta Miladka",
      qrToken: "group-peto-miladka-007"
    },
    guests: [
      {
        about: "Ujo Peťo. Z Častej, treba sa pýtať na dopravu.",
        email: "",
        firstName: "Peťo",
        lastName: "",
        phone: "",
        relationship: "rodina nevesty"
      },
      {
        about: "Teta Miladka. Z Častej, treba sa pýtať na dopravu.",
        email: "",
        firstName: "Miladka",
        lastName: "",
        phone: "",
        relationship: "rodina nevesty"
      }
    ]
  },
  {
    group: {
      name: "Teta Anka a ujo Pišta",
      qrToken: "group-anka-pista-008"
    },
    guests: [
      {
        about: "Teta Anka. Z Pezinka, treba sa spýtať na dopravu.",
        email: "",
        firstName: "Teta Anka",
        lastName: "",
        phone: "",
        relationship: "rodina nevesty"
      },
      {
        about: "Ujo Pišta. Z Pezinka, treba sa spýtať na dopravu.",
        email: "",
        firstName: "Ujo Pišta",
        lastName: "",
        phone: "",
        relationship: "rodina nevesty"
      }
    ]
  },
  {
    group: {
      isFromModra: true,
      name: "Zuzka a Baška",
      qrToken: "group-zuzka-baska-009"
    },
    guests: [
      {
        about:
          "Zuzka – vegetarián. Z Modry, doprava ani ubytovanie nie je potrebná.",
        email: "",
        firstName: "Zuzka",
        lastName: "",
        phone: "",
        relationship: "priatelia nevesty"
      },
      {
        about: "Baška. Z Modry, doprava ani ubytovanie nie je potrebná.",
        email: "",
        firstName: "Baška",
        lastName: "",
        phone: "",
        relationship: "priatelia nevesty"
      }
    ]
  },
  {
    group: {
      isFromModra: true,
      name: "Zuzka a Miško",
      qrToken: "group-zuzka-misko-010"
    },
    guests: [
      {
        about: "Zuzka. Z Modry, doprava ani ubytovanie nie je potrebná.",
        email: "",
        firstName: "Zuzka",
        lastName: "",
        phone: "",
        relationship: "priatelia nevesty"
      },
      {
        about: "Miško. Z Modry, doprava ani ubytovanie nie je potrebná.",
        email: "",
        firstName: "Miško",
        lastName: "",
        phone: "",
        relationship: "priatelia nevesty"
      }
    ]
  },
  {
    group: {
      name: "Bea a Matúš",
      qrToken: "group-bea-matus-011"
    },
    guests: [
      {
        about: "Bea. Z Bratislavy, spýtať sa na dopravu/ubytovanie v Modre.",
        email: "",
        firstName: "Bea",
        lastName: "",
        phone: "",
        relationship: "priatelia nevesty"
      },
      {
        about: "Matúš. Z Bratislavy, spýtať sa na dopravu/ubytovanie v Modre.",
        email: "",
        firstName: "Matúš",
        lastName: "",
        phone: "",
        relationship: "priatelia nevesty"
      }
    ]
  },
  {
    group: {
      name: "Peťka a Vladko",
      qrToken: "group-petka-vladko-012"
    },
    guests: [
      {
        about: "Peťka. Z Preselian, odporučiť ubytovanie v Modre.",
        email: "",
        firstName: "Peťka",
        lastName: "",
        phone: "",
        relationship: "priatelia nevesty"
      },
      {
        about: "Vladko. Z Preselian, odporučiť ubytovanie v Modre.",
        email: "",
        firstName: "Vladko",
        lastName: "",
        phone: "",
        relationship: "priatelia nevesty"
      }
    ]
  }
];
