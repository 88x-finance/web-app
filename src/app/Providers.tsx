'use client';

import { getDefaultWallets, lightTheme, RainbowKitProvider, Theme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as WrapBalancerProvider } from 'react-wrap-balancer';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { ACTIVE_CHAINS } from '~/lib/network';

interface Props {
  children?: React.ReactNode;
}

const { chains, provider } = configureChains(ACTIVE_CHAINS, [publicProvider()]);

const { connectors } = getDefaultWallets({ appName: '88x', chains });

const LIGHT_THEME: Theme = {
  ...lightTheme(),
  fonts: {
    body: 'inherit',
  },
};

const wagmiClient = createClient({
  connectors,
  provider,
  autoConnect: process.env.NODE_ENV === 'production', // autoConnect only in production
});

const queryClient = new QueryClient();

export function Providers({ children }: Props) {
  return (
    <WrapBalancerProvider>
      <QueryClientProvider client={queryClient}>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider id="root" chains={chains} theme={LIGHT_THEME}>
            {children}
          </RainbowKitProvider>
        </WagmiConfig>
      </QueryClientProvider>
    </WrapBalancerProvider>
  );
}
