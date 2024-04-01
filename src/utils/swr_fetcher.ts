import Errors from "@/models/common/error/error-list";

export async function fetcher(...args: Parameters<typeof fetch>) {
  const res = await fetch(...args);
  if (res.status !== 200 && res.status !== 204) throw Errors.Fetcher;
  else if (res.status === 204) return null;
  else return await res.json();
}
