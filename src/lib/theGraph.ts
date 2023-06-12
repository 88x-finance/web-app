import { NETWORK, Network } from './network';

const NETWORK_NAME: Partial<Record<Network, string>> = {
  [NETWORK.ethereum]: 'ethereum',
  [NETWORK.polygon]: 'matic',
  [NETWORK.bnb]: 'bsc',
  [NETWORK.avalanche]: 'avalanche',
  [NETWORK.moonbeam]: 'moonbeam',
  [NETWORK.arbitrum]: 'arbitrum-one',
};

async function fetchGraphQL(url: string, query: string): Promise<any> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch GraphQL');
  }

  const { data } = await response.json();

  return data;
}

export async function fetchMainVaultGraph(network: Network, query: string) {
  const name = NETWORK_NAME[network];
  if (!name) {
    throw new Error('Network not supported');
  }

  return fetchGraphQL(`https://api.thegraph.com/subgraphs/name/mxck/main-vault-${name}`, query);
}

export async function fetchLocalVaultGraph(network: Network, query: string) {
  const name = NETWORK_NAME[network];
  if (!name) {
    throw new Error('Network not supported');
  }

  return fetchGraphQL(`https://api.thegraph.com/subgraphs/name/mxck/local-vault-${name}`, query);
}
