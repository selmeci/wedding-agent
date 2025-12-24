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
  }
];
