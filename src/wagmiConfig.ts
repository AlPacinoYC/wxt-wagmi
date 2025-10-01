import { mainnet, sepolia } from 'wagmi/chains'
import { QueryClient } from '@tanstack/react-query'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

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

// 创建RainbowKit配置并直接导出为config
export const config = getDefaultConfig({
  appName: 'Web3 钱包示例',
  projectId: 'YOUR_PROJECT_ID', // 可以从 WalletConnect 官网获取
  chains: [mainnet, sepolia],
  ssr: true,
})