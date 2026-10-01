export type Stat = {
  value: number;
  label: string;
  accent: string;
};

export const STATS: Stat[] = [
  {
    value: 58,
    label: "Increase in pickup point usage",
    accent: "#def54f",
  },
  {
    value: 23,
    label: "Decrease in customer phone calls",
    accent: "#6ac9ff",
  },
  {
    value: 27,
    label: "Growth in repeat orders",
    accent: "#fa7328",
  },
  {
    value: 40,
    label: "Drop in missed deliveries",
    accent: "#45db7d",
  },
];
