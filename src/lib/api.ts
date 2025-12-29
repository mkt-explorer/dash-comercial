import { OpportunitiesQueryParams } from '@/types/opportunities';
import { headers } from 'next/headers';

export async function getOpportunities(params: OpportunitiesQueryParams) {
  const query = new URLSearchParams(params as any).toString();
  const host = (await headers()).get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

  const res = await fetch(
    `${protocol}://${host}/api/opportunities?${query}`,
    { cache: 'no-store' }
  );

  const json = await res.json();
  return json.data;
}
