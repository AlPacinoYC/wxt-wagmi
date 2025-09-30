import React from 'react'
import { useConnect } from 'wagmi'
import { metaMask } from '@wagmi/connectors'
import { coinbaseWallet } from '@wagmi/connectors'
import { walletConnect } from '@wagmi/connectors'

/**
 * 钱包连接按钮组件
 * 提供连接MetaMask、Coinbase Wallet和WalletConnect的功能
 */
export const WalletConnectButton: React.FC = () => {
  const { connect, isPending, error, reset } = useConnect()

  return (
    <div className="wallet-connect-container">
      <h3>连接你的钱包</h3>
      <div className="wallet-buttons">
        <button
          onClick={() => {
            reset()
            connect({ connector: metaMask() })
          }}
          disabled={isPending}
          className="wallet-button metamask"
        >
          {isPending ? '连接中...' : '连接 MetaMask'}
        </button>
        <button
          onClick={() => {
            reset()
            connect({ connector: coinbaseWallet({ appName: 'Web3 钱包示例' }) })
          }}
          disabled={isPending}
          className="wallet-button coinbase"
        >
          {isPending ? '连接中...' : '连接 Coinbase Wallet'}
        </button>
        <button
          onClick={() => {
            reset()
            connect({ connector: walletConnect({ projectId: 'YOUR_PROJECT_ID' }) })
          }}
          disabled={isPending}
          className="wallet-button walletconnect"
        >
          {isPending ? '连接中...' : '连接 WalletConnect'}
        </button>
      </div>
      {error && (
        <div className="error-message">
          连接失败: {error.message}
        </div>
      )}
    </div>
  )
}