import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

/**
 * 钱包连接按钮组件
 * 使用RainbowKit提供的ConnectButton
 */
export const WalletConnectButton: React.FC = () => {
  return (
    <div className="min-w-[240px]">
      <ConnectButton
        showBalance
        accountStatus="address"
        chainStatus="icon"
      />
    </div>
  )
}