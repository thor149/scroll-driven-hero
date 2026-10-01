export type Stat = {
  value: number;
  label: string;
  accent: string;
  ink: string;
};

export const STATS: Stat[] = [
  {
    value: 58,
    label: "Increase in pickup point use",
    accent: "#def54f",
    ink: "#111111",
  },
  {
    value: 23,
    label: "Decrease in customer phone calls",
    accent: "#6ac9ff",
    ink: "#111111",
  },
  {
    value: 27,
    label: "Growth in repeat orders",
    accent: "#333333",
    ink: "#ffffff",
  },
  {
    value: 40,
    label: "Drop in missed deliveries",
    accent: "#fa7328",
    ink: "#111111",
  },
];
