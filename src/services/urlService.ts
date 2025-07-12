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

export async function getAllUrls(
  page: number,
  pageSize: number,
  search: string
): Promise<{ urls: UrlData[], total: number }> {
  const res = await api.get("/urls", {
    params: {
      page,
      pageSize,
      search
    }
  });
  return {
    urls: res.data.urls,
    total: res.data.total
  };
}


export async function createUrl(url: string) {
  const res = await api.post("/urls", { url });
  return res.data;
}
export async function rerunUrl(id: number) {
  await api.put(`/urls/${id}/rerun`);
}

export async function deleteUrl(id: number) {
  await api.delete(`/urls/${id}`);
}

export async function stopUrl(id: number) {
  await api.put(`/urls/${id}/stop`);
}