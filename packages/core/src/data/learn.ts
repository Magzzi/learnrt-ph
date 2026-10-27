// Moved unchanged from the website's explore page (apps/web/src/app/explore/page.tsx).
// Unverified: see docs/data-todo.md D17 (areas) and D18 (Lines not covered yet).
import type { LineId } from "../network";

export const LINE_AREAS: Record<Exclude<LineId, "MRT7">, readonly string[]> = {
  "LRT1": [
    "Manila",
    "Pasay",
    "Caloocan",
    "Cavite"
  ],
  "LRT2": [
    "Manila",
    "San Juan",
    "Quezon City"
  ],
  "MRT3": [
    "North Avenue",
    "Quezon City",
    "Makati",
    "Pasay"
  ]
};

export const NSCR_STATIONS: readonly string[] = ["New Clark City","Clark International Airport","Clark","Angeles","San Fernando","Apalit","Calumpit","Malolos","Guiguinto","Balagtas","Bocaue","Marilao","Meycauayan","West Valenzuela","Caloocan","Solis","Tutuban","Blumentritt","España","Santa Mesa","Paco","Buendia","EDSA","Senate-DepED","FTI","Bicutan","Sucat","Alabang","Muntinlupa","San Pedro","Pacita","Biñan","Santa Rosa","Cabuyao","Banlic","Calamba"];

export const PNR_STATIONS: readonly string[] = ["Tutuban","Blumentritt","España","Sta. Mesa","Paco","Buendia","FTI","Sucat","Alabang","Muntinlupa","San Pedro","Calamba"];
