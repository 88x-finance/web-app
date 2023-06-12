import { fetchApi } from '~/lib/fetchApi';
import type { Vault } from '~/lib/vault';

export function getVaults(): Promise<Vault[]> {
  return fetchApi(`/vaults`);
}
