import { Inter, Manrope, Nunito, Roboto } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

type RegisteredFont = {
  label: string;
  variable: string;
};

export const fontRegistry = {
  inter: {
    label: "Inter",
    variable: inter.variable,
  },
  roboto: {
    label: "Roboto",
    variable: roboto.variable,
  },
  nunito: {
    label: "Nunito",
    variable: nunito.variable,
  },
  manrope: {
    label: "Manrope",
    variable: manrope.variable,
  },
  openDyslexic: {
    label: "OpenDyslexic",
    variable: "",
  },
} as const satisfies Record<string, RegisteredFont>;

export type FontKey = keyof typeof fontRegistry;

export const fontVars = (Object.values(fontRegistry) as Array<(typeof fontRegistry)[FontKey]>)
  .map((f) => f.variable)
  .filter(Boolean)
  .join(" ");

export const fontOptions = (Object.entries(fontRegistry) as Array<[FontKey, (typeof fontRegistry)[FontKey]]>).map(
  ([key, f]) => ({
    key,
    label: f.label,
    variable: f.variable,
  }),
);
