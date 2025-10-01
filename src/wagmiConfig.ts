import { createConfig, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { metaMask } from '@wagmi/connectors'
import { coinbaseWallet } from '@wagmi/connectors'
import { walletConnect } from '@wagmi/connectors'
import { QueryClient } from '@tanstack/react-query'

// 创建QueryClient实例
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 60_000,
    },
  },
})

// 创建wagmi配置
export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    metaMask(),
    coinbaseWallet({
      appName: 'Web3 钱包示例',
    }),
    walletConnect({
      projectId: 'YOUR_PROJECT_ID', // 可以从 WalletConnect 官网获取
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  ssr: true,
})