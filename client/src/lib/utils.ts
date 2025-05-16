import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const carMakes = [
  { value: "", label: "Select Make", disabled: true },
  { value: "audi", label: "Audi" },
  { value: "bmw", label: "BMW" },
  { value: "mercedes", label: "Mercedes-Benz" },
  { value: "volkswagen", label: "Volkswagen" },
  { value: "toyota", label: "Toyota" },
  { value: "other", label: "Other" }
];

export const carModels: Record<string, Array<{ value: string, label: string }>> = {
  audi: [
    { value: "a3", label: "A3" },
    { value: "a4", label: "A4" },
    { value: "a6", label: "A6" },
    { value: "q5", label: "Q5" },
    { value: "q7", label: "Q7" }
  ],
  bmw: [
    { value: "1-series", label: "1 Series" },
    { value: "3-series", label: "3 Series" },
    { value: "5-series", label: "5 Series" },
    { value: "x3", label: "X3" },
    { value: "x5", label: "X5" }
  ],
  mercedes: [
    { value: "a-class", label: "A-Class" },
    { value: "c-class", label: "C-Class" },
    { value: "e-class", label: "E-Class" },
    { value: "glc", label: "GLC" },
    { value: "gle", label: "GLE" }
  ],
  volkswagen: [
    { value: "golf", label: "Golf" },
    { value: "passat", label: "Passat" },
    { value: "tiguan", label: "Tiguan" },
    { value: "polo", label: "Polo" },
    { value: "touareg", label: "Touareg" }
  ],
  toyota: [
    { value: "corolla", label: "Corolla" },
    { value: "camry", label: "Camry" },
    { value: "rav4", label: "RAV4" },
    { value: "yaris", label: "Yaris" },
    { value: "land-cruiser", label: "Land Cruiser" }
  ]
};

export const carYears = Array.from({ length: 30 }, (_, i) => {
  const year = new Date().getFullYear() - i;
  return { value: year.toString(), label: year.toString() };
});

export const carConditions = [
  { value: "excellent", label: "Excellent" },
  { value: "very-good", label: "Very Good" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" }
];
