// Colour maths for the theme tests: WCAG 2.x contrast, and colour difference under simulated
// colour-vision deficiency.

type RGB = [number, number, number];

const channels = (hex: string): RGB => {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as RGB;
};
const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toSrgb = (c: number) => {
  const x = Math.min(Math.max(c, 0), 1);
  return x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;
};

const luminance = (hex: string) => {
  const [r, g, b] = channels(hex).map(toLinear) as RGB;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** WCAG 2.x contrast ratio, from 1 to 21. */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

// Machado, Oliveira and Fernandes (2009), severity 1.0, applied to linear RGB.
const SIMULATIONS: Record<string, number[][]> = {
  normal: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
  protanopia: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deuteranopia: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.01182, 0.04294, 0.968881]],
  tritanopia: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.3039]],
};

const simulate = (hex: string, m: number[][]): RGB => {
  const lin = channels(hex).map(toLinear);
  return m.map((row) => toSrgb(row[0]! * lin[0]! + row[1]! * lin[1]! + row[2]! * lin[2]!)) as RGB;
};

const lab = (rgb: RGB): RGB => {
  const [r, g, b] = rgb.map(toLinear) as RGB;
  const x = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047;
  const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883;
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
};

/** The smallest CIE76 difference between two colours across normal vision and three simulated deficiencies. */
export function cvdDistance(a: string, b: string): number {
  return Math.min(
    ...Object.values(SIMULATIONS).map((m) => {
      const [p, q] = [lab(simulate(a, m)), lab(simulate(b, m))];
      return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
    }),
  );
}
