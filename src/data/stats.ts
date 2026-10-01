export type Stat = {
  value: number;
  label: string;
  accent: string;
  ink: string;
  /** Desktop placement, as percentages of the viewport. */
  desktop: { top: string; left: string; width: string };
  /** Mobile placement — a 2 x 2 grid that clears the road band. */
  mobile: { top: string; left: string; width: string };
};

export const STATS: Stat[] = [
  {
    value: 58,
    label: "Increase in pickup point use",
    accent: "#def54f",
    ink: "#111111",
    desktop: { top: "7%", left: "48%", width: "20%" },
    mobile: { top: "5%", left: "4%", width: "44%" },
  },
  {
    value: 23,
    label: "Decrease in customer phone calls",
    accent: "#6ac9ff",
    ink: "#111111",
    desktop: { top: "71%", left: "41%", width: "21%" },
    mobile: { top: "73%", left: "4%", width: "44%" },
  },
  {
    value: 27,
    label: "Growth in repeat orders",
    accent: "#333333",
    ink: "#ffffff",
    desktop: { top: "7%", left: "71%", width: "19%" },
    mobile: { top: "5%", left: "52%", width: "44%" },
  },
  {
    value: 40,
    label: "Drop in missed deliveries",
    accent: "#fa7328",
    ink: "#111111",
    desktop: { top: "71%", left: "65%", width: "21%" },
    mobile: { top: "73%", left: "52%", width: "44%" },
  },
];
