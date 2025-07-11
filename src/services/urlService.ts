const baseUrl = "http://localhost:8080/api";

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
  const res = await fetch(`${baseUrl}/urls`);
  if (!res.ok) {
    throw new Error("Failed to fetch URLs");
  }
  const data = await res.json();
  return data.urls;
}
