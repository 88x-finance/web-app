import { notFound } from 'next/navigation';

export async function fetchApi(href: string, searchParams?: Record<string, string>): Promise<any> {
  const url = new URL(href, 'https://api.dev.88x.finance');

  url.search = new URLSearchParams(searchParams).toString();

  const response = await fetch(url, { cache: 'no-store' });

  if (response.status === 404) {
    throw notFound();
  }

  const json = await response.json();

  if (!response.ok) {
    throw new Error(`${json.error} - ${json.message}`);
  }

  return json;
}
