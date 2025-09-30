import React from 'react'
import { useConnect } from 'wagmi'
import { MetaMaskConnector } from '@wagmi/connectors/metaMask'
import { CoinbaseWalletConnector } from '@wagmi/connectors/coinbaseWallet'
import { WalletConnectConnector } from '@wagmi/connectors/walletConnect'

/**
 * 钱包连接按钮组件
 * 提供连接MetaMask、Coinbase Wallet和WalletConnect的功能
 */
export const WalletConnectButton: React.FC = () => {
  const { connect, isConnecting, error, reset } = useConnect()

  const handleConnect = (connector: any) => {
    reset()
    connect({ connector })
  }

  return (
    <div className="wallet-connect-container">
      <h3>连接你的钱包</h3>
      <div className="wallet-buttons">
        <button
          onClick={() => handleConnect(MetaMaskConnector)}
          disabled={isConnecting}
          className="wallet-button metamask"
        >
          {isConnecting ? '连接中...' : '连接 MetaMask'}
        </button>
        <button
          onClick={() => handleConnect(CoinbaseWalletConnector)}
          disabled={isConnecting}
          className="wallet-button coinbase"
        >
          {isConnecting ? '连接中...' : '连接 Coinbase Wallet'}
        </button>
        <button
          onClick={() => handleConnect(WalletConnectConnector)}
          disabled={isConnecting}
          className="wallet-button walletconnect"
        >
          {isConnecting ? '连接中...' : '连接 WalletConnect'}
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