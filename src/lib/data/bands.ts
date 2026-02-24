export interface BandProfile {
  id: string;
  name: string;
  color: string;
  colorHex: string;
  minResistanceLbs: number;
  maxResistanceLbs: number;
}

export const X3_BANDS: BandProfile[] = [
  {
    id: "light",
    name: "Light",
    color: "White",
    colorHex: "#e4e4e7",
    minResistanceLbs: 25,
    maxResistanceLbs: 80,
  },
  {
    id: "medium",
    name: "Medium",
    color: "Green",
    colorHex: "#22c55e",
    minResistanceLbs: 40,
    maxResistanceLbs: 120,
  },
  {
    id: "heavy",
    name: "Heavy",
    color: "Orange",
    colorHex: "#f97316",
    minResistanceLbs: 60,
    maxResistanceLbs: 150,
  },
  {
    id: "elite",
    name: "Elite",
    color: "Black",
    colorHex: "#18181b",
    minResistanceLbs: 100,
    maxResistanceLbs: 300,
  },
  {
    id: "elite-plus",
    name: "Elite+",
    color: "Gray",
    colorHex: "#71717a",
    minResistanceLbs: 150,
    maxResistanceLbs: 500,
  },
];

export function getBandById(id: string): BandProfile | undefined {
  return X3_BANDS.find((b) => b.id === id);
}
