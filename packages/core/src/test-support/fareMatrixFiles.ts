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

// The fare matrices still use older spellings for Stations renamed in docs/station-names-proposal.md.
const RENAMED_IN_MATRICES: Record<string, string> = {
  "LRT1:UN Avenue": "lrt1-un-avenue",
  "LRT1:Monumento": "lrt1-monumento",
  "LRT2:Cubao": "lrt2-cubao",
  "LRT2:Marikina": "lrt2-marikina",
  "MRT3:North Ave": "mrt3-north-ave",
  "MRT3:Quezon Ave": "mrt3-quezon-ave",
  "MRT3:GMA-Kamuning": "mrt3-gma-kamuning",
  "MRT3:Santolan": "mrt3-santolan",
  "MRT3:Shaw Blvd": "mrt3-shaw-blvd",
  "MRT3:Taft Ave": "mrt3-taft-ave",
};

/** The Station id a fare matrix means by `name`, or undefined if it names no Station on that Line. */
export function matrixStationId(
  lineId: string,
  name: string,
  stations: readonly { id: string; name: string; lineId: string }[],
): string | undefined {
  return RENAMED_IN_MATRICES[`${lineId}:${name}`] ?? stations.find((s) => s.lineId === lineId && s.name === name)?.id;
}
