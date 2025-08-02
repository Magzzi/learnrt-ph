// utils/readFareMatrix.ts
import * as XLSX from "xlsx";

export const getFareFromMatrix = async (
  railway: string,  
  origin: string,
  destination: string,
  type: string,           // "sjt" or "svf"
  discounted: boolean,    // true only if discount is selected
): Promise<number | null> => {

  try {
    const res = (railway === "MRT3") ? ((discounted == true && type=="sjt") ? await fetch(`/${railway}-discounted-matrix.xlsx`) : await fetch(`/${railway}-matrix.xlsx`))
    : await fetch(`/${railway}-${type}-matrix.xlsx`);
    const arrayBuffer = await res.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 });

    if (!json || json.length < 2) return null;

    const headers = json[0]; // First row = origin stations
    const toIndex = json.findIndex((row) => row[0] === destination); // Row with destination

    if (toIndex === -1) return null;

    const fromIndex = headers.indexOf(origin); // Column for origin
    if (fromIndex === -1) return null;

    const fareCell = json[toIndex][fromIndex];
    const baseFare = parseFloat(fareCell);
    if (isNaN(baseFare)) return null;

    // Apply 50% discount ONLY for SJT
    const finalFare = type === "sjt" && discounted && railway != "MRT3"
      ? baseFare * 0.5
      : baseFare;

    return Math.ceil(finalFare);
  } catch (error) {
    console.error("Error reading fare matrix:", error);
    return null;
  }
};
