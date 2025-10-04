import React from 'react'
import { useConnect } from 'wagmi'
import { metaMask } from '@wagmi/connectors'
import { Button, message } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

/**
 * 钱包连接按钮组件
 * 为本地Hardhat开发环境简化版
 */
export const WalletConnectButton: React.FC = () => {
  const { connect, isPending, error, reset } = useConnect()

  // MetaMask图标 SVG
  const MetaMaskIcon = () => (
    <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  )

  return (
    <div>
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
        className="min-w-[240px] h-14 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
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
        {isPending ? '连接中...' : '连接 MetaMask'}
      </Button>
      
      {error && (
        <div className="mt-4 p-4 bg-red-500/10 text-red-500 border border-red-500/30 rounded-lg text-sm transition-all duration-300 animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-red-500">⚠️</div>
            <div>
              <div className="font-medium mb-1">连接失败</div>
              <div className="text-gray-700">{error.message}</div>
              <div className="text-gray-600 mt-2 text-xs">请确保MetaMask已安装并切换到本地Hardhat网络 (http://localhost:8545)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}