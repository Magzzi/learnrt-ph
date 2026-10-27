import { router } from "expo-router";

/** Opens a Station's detail page. */
export const openStation = (id: string) => router.push({ pathname: "/station/[id]", params: { id } });
