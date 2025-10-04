import { mainnet, sepolia, localhost } from 'wagmi/chains'
import { QueryClient } from '@tanstack/react-query'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http } from 'viem'

// 自定义hardhat网络配置
export const hardhat = {
  ...localhost,
  id: 31337, // hardhat默认网络ID
  name: 'Hardhat',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://localhost:8545'],
    },
  },
  testnet: true,
}

// 导出链配置，供其他组件使用
export const supportedChains = [mainnet, sepolia]

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
  chains: [hardhat, mainnet, sepolia],
  transports: {
    [hardhat.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  ssr: true,
})