'use client';

import { createContext, useContext, ReactNode, useState } from 'react';
import { SuiClientProvider, WalletProvider as SuiWalletProvider } from '@mysten/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getFullnodeUrl } from '@mysten/sui/client';

interface WalletContextType {
  // 这里可以添加自定义的钱包状态和方法
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 3,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={{
        testnet: { url: getFullnodeUrl('testnet') },
        mainnet: { url: getFullnodeUrl('mainnet') },
      }} defaultNetwork="testnet">
        <SuiWalletProvider
          autoConnect
          storageKey="murmur-wallet"
        >
          <WalletContext.Provider value={{}}>
            {children}
          </WalletContext.Provider>
        </SuiWalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
