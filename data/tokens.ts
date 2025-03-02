export interface Token {
  name: string;
  price: string;
  percentage: string;
  isPositive: boolean;
}

export const tokens: Token[] = [
  { name: "500000", price: "43.67%", percentage: "+177.41%", isPositive: true },
  { name: "Y2Y", price: "177.41%", percentage: "+22.23%", isPositive: true },
  { name: "EKKO", price: "22.23%", percentage: "-2.44%", isPositive: false },
  { name: "JUP", price: "-2.44%", percentage: "-5.11%", isPositive: false },
  { name: "arc", price: "-5.11%", percentage: "+39.46%", isPositive: true },
  { name: "MWM", price: "39.46%", percentage: "+11.0%", isPositive: true },
]; 