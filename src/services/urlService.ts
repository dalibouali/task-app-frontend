import { api } from "./axios";

export type UrlData = {
  id: number;
  url: string;
  htmlVersion: string;
  title: string;
  h1Count: number;
  h2Count: number;
  internalLinks: number;
  externalLinks: number;
  brokenLinks: number;
  hasLoginForm: boolean;
  status: "queued" | "running" | "done" | "error";
};

export async function getAllUrls(): Promise<UrlData[]> {
  try {
    const res = await api.get("/urls");
    return res.data.urls;
  } catch (error) {
    console.error("Failed to fetch URLs:", error);
    throw error;
  }
}

export async function createUrl(url: string) {
  const res = await api.post("/urls", { url });
  return res.data;
}
