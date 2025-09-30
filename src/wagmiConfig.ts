import { createConfig, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { MetaMaskConnector } from '@wagmi/connectors/metaMask'
import { CoinbaseWalletConnector } from '@wagmi/connectors/coinbaseWallet'
import { WalletConnectConnector } from '@wagmi/connectors/walletConnect'

// 创建 wagmi 配置
export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    new MetaMaskConnector({ chains: [mainnet, sepolia] }),
    new CoinbaseWalletConnector({
      chains: [mainnet, sepolia],
      options: {
        appName: 'Web3 钱包示例',
      },
    }),
    new WalletConnectConnector({
      chains: [mainnet, sepolia],
      options: {
        projectId: 'YOUR_PROJECT_ID', // 可以从 WalletConnect 官网获取
      },
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

// 导出常用类型
export type { Address, Chain, Client } from 'wagmi'