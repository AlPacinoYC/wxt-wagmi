import React, { ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'
import { config } from './wagmiConfig'

interface Web3ProviderProps {
  children: ReactNode
}

/**
 * Web3 Provider组件，用于在整个应用中提供wagmi配置
 * 包裹应用的根组件，使所有子组件都能访问web3功能
 */
export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      {children}
    </WagmiProvider>
  )
}