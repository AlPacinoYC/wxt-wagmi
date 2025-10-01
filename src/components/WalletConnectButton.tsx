import React from 'react'
import { useConnect } from 'wagmi'
import { metaMask } from '@wagmi/connectors'
import { coinbaseWallet } from '@wagmi/connectors'
import { walletConnect } from '@wagmi/connectors'
import { Button, Card, Typography, message } from 'antd'
import { LoadingOutlined, WalletOutlined } from '@ant-design/icons'

/**
 * 钱包连接按钮组件
 * 提供连接MetaMask、Coinbase Wallet和WalletConnect的功能
 */
export const WalletConnectButton: React.FC = () => {
  const { connect, isPending, error, reset } = useConnect()

  // 品牌图标 SVG
  const MetaMaskIcon = () => (
    <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  )

  const CoinbaseIcon = () => (
    <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  )

  const WalletConnectIcon = () => (
    <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  )

  return (
    <div className="space-y-8">
      <Card
        title={
          <div className="flex items-center gap-2">
            <WalletOutlined className="text-indigo-500" />
            <Typography.Title level={3} className="m-0 text-gray-800 font-bold">
              选择你的钱包
            </Typography.Title>
          </div>
        }
        className="shadow-xl border-0 overflow-hidden transition-all duration-300 hover:shadow-2xl"
        extra={
          <div className="text-xs text-gray-500">
            安全连接 • 无手续费
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <Button
            type="primary"
            size="large"
            icon={isPending ? <LoadingOutlined /> : <MetaMaskIcon />}
            onClick={() => {
              reset()
              connect({ connector: metaMask() })
              message.loading('正在连接 MetaMask...', 0)
            }}
            loading={isPending}
            className="min-w-[180px] h-14 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            style={{
              background: isPending ? '#1677ff' : 'linear-gradient(135deg, #f6851b 0%, #e67607 100%)',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '16px',
              boxShadow: '0 4px 15px rgba(246, 133, 27, 0.2)',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
            }}
          >
            {isPending ? '连接中...' : 'MetaMask'}
          </Button>
        <Button
            type="primary"
            size="large"
            icon={isPending ? <LoadingOutlined /> : <CoinbaseIcon />}
            onClick={() => {
              reset()
              connect({ connector: coinbaseWallet({ appName: 'Web3 钱包示例' }) })
              message.loading('正在连接 Coinbase Wallet...', 0)
            }}
            loading={isPending}
            className="min-w-[180px] h-14 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            style={{
              background: isPending ? '#1677ff' : 'linear-gradient(135deg, #1a56db 0%, #0f44b3 100%)',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '16px',
              boxShadow: '0 4px 15px rgba(26, 86, 219, 0.2)',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
            }}
          >
            {isPending ? '连接中...' : 'Coinbase Wallet'}
          </Button>
        <Button
            type="primary"
            size="large"
            icon={isPending ? <LoadingOutlined /> : <WalletConnectIcon />}
            onClick={() => {
              reset()
              connect({ connector: walletConnect({ projectId: 'YOUR_PROJECT_ID' }) })
              message.loading('正在连接 WalletConnect...', 0)
            }}
            loading={isPending}
            className="min-w-[180px] h-14 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            style={{
              background: isPending ? '#1677ff' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '16px',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.2)',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
            }}
          >
            {isPending ? '连接中...' : 'WalletConnect'}
          </Button>
        </div>
        {error && (
          <div className="mt-6 p-4 bg-red-500/10 text-red-500 border border-red-500/30 rounded-lg text-sm transition-all duration-300 animate-fadeIn">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-red-500">⚠️</div>
              <div>
                <div className="font-medium mb-1">连接失败</div>
                <div className="text-gray-700">{error.message}</div>
              </div>
            </div>
          </div>
        )}
        <div className="mt-6 text-center text-xs text-gray-500">
          通过连接钱包，您同意我们的服务条款和隐私政策
        </div>
      </Card>
    </div>
  )
}