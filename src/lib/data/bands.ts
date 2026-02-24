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
    id: "extra-light",
    name: "Extra Light",
    color: "White",
    colorHex: "#e4e4e7",
    minResistanceLbs: 10,
    maxResistanceLbs: 50,
  },
  {
    id: "light",
    name: "Light",
    color: "Light Grey",
    colorHex: "#a1a1aa",
    minResistanceLbs: 25,
    maxResistanceLbs: 80,
  },
  {
    id: "medium",
    name: "Medium",
    color: "Dark Grey",
    colorHex: "#52525b",
    minResistanceLbs: 50,
    maxResistanceLbs: 120,
  },
  {
    id: "heavy",
    name: "Heavy",
    color: "Black",
    colorHex: "#18181b",
    minResistanceLbs: 60,
    maxResistanceLbs: 150,
  },
];

export function getBandById(id: string): BandProfile | undefined {
  return X3_BANDS.find((b) => b.id === id);
}
