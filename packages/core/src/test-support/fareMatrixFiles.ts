// Test-only: reads the original fare matrices that the core data was converted from.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import * as XLSX from "xlsx";

const PUBLIC_DIR = fileURLToPath(new URL("../../../../apps/web/public/", import.meta.url));

export const FARE_MATRIX_FILES = [
  "LRT1-sjt-matrix.xlsx",
  "LRT1-svf-matrix.xlsx",
  "LRT2-sjt-matrix.xlsx",
  "LRT2-svf-matrix.xlsx",
  "MRT3-matrix.xlsx",
  "MRT3-discounted-matrix.xlsx",
] as const;

export type FareMatrixFile = (typeof FARE_MATRIX_FILES)[number];

/** Rows of the first sheet, as written in the file (row 0 is the header). */
export function readFareMatrix(file: FareMatrixFile): unknown[][] {
  const workbook = XLSX.read(readFileSync(PUBLIC_DIR + file));
  const sheet = workbook.Sheets[workbook.SheetNames[0]!]!;
  return XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1 });
}

/** Station names in the header row, in file order. */
export function readMatrixStationNames(file: FareMatrixFile): string[] {
  return readFareMatrix(file)[0]!.slice(1) as string[];
}
