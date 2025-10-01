import React, { useState, useEffect } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { Card, Typography, Spin, Alert, Empty, Row, Col, Button } from 'antd'
import { WalletOutlined, CopyOutlined, LockOutlined } from '@ant-design/icons'
import { message } from 'antd'

const { Text, Title } = Typography

/**
 * 余额显示组件
 * 显示当前连接钱包的余额信息
 */
export const BalanceDisplay: React.FC = () => {
  const { address } = useAccount()
  const { data: balance, isLoading, error } = useBalance({
    address,
  })
  const [showFullAddress, setShowFullAddress] = useState(false)
  const [copied, setCopied] = useState(false)
  const [animatedBalance, setAnimatedBalance] = useState('0')

  // 复制钱包地址到剪贴板
  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      message.success('钱包地址已复制')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // 余额数字动画效果
  useEffect(() => {
    if (balance?.formatted) {
      const targetValue = parseFloat(balance.formatted)
      const duration = 1500 // 动画持续时间（毫秒）
      const frameDuration = 1000 / 60 // 每帧时间（假设60fps）
      const totalFrames = Math.round(duration / frameDuration)
      let frame = 0
      
      const timer = setInterval(() => {
        frame++
        const progress = frame / totalFrames
        // 使用easeOutQuart缓动函数让动画更自然
        const easeProgress = 1 - Math.pow(1 - progress, 4)
        const currentValue = targetValue * easeProgress
        setAnimatedBalance(currentValue.toFixed(4))
        
        if (frame === totalFrames) {
          clearInterval(timer)
          setAnimatedBalance(balance.formatted)
        }
      }, frameDuration)
      
      return () => clearInterval(timer)
    }
  }, [balance?.formatted])

  if (!address) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="请先连接钱包"
        icon={<WalletOutlined style={{ fontSize: 64, color: '#999' }} />}
        className="py-12"
      />
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-16">
        <Spin size="large" tip="加载余额信息中..." />
        <Typography.Text type="secondary" className="mt-4">
          请稍候，正在从区块链获取数据
        </Typography.Text>
      </div>
    )
  }

  if (error) {
    return (
      <Alert
        message="获取余额失败"
        description={error.message}
        type="error"
        showIcon
        className="mb-4 animate-fadeIn"
        action={
          <Button type="link" size="small" onClick={() => window.location.reload()}>
            刷新重试
          </Button>
        }
      />
    )
  }

  return (
    <Card className="border-0 shadow-lg overflow-hidden transition-all duration-500 hover:shadow-xl">
      {/* 头部信息 */}
      <div className="relative h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {/* 背景装饰 */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative h-full flex flex-col justify-center px-6">
          <Typography.Title level={4} className="text-white m-0 font-bold">
            账户信息
          </Typography.Title>
          <Typography.Text className="text-white/90">
            查看您的钱包余额和交易历史
          </Typography.Text>
        </div>
      </div>

      <div className="p-6">
        {/* 钱包地址 */}
        <div className="mb-6 p-5 bg-white rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <LockOutlined className="text-indigo-500" />
              <Typography.Text type="secondary">钱包地址</Typography.Text>
            </div>
            <Button
              type="primary"
              icon={copied ? '✓' : <CopyOutlined />}
              onClick={handleCopyAddress}
              size="small"
              className={`transition-all duration-300 ${copied ? 'bg-green-500' : 'bg-indigo-500'} hover:shadow-md`}
            >
              {copied ? '已复制' : '复制'}
            </Button>
          </div>
          <div className="flex items-center">
            <Typography.Text 
              className="font-mono break-all font-medium transition-all duration-300 cursor-pointer"
              onClick={() => setShowFullAddress(!showFullAddress)}
            >
              {showFullAddress ? address : `${address.substring(0, 6)}...${address.substring(address.length - 4)}`}
            </Typography.Text>
            <Button
              type="text"
              size="small"
              className="ml-2 text-gray-400 hover:text-gray-600 p-0 h-auto"
              onClick={() => setShowFullAddress(!showFullAddress)}
            >
              {showFullAddress ? '隐藏' : '显示全部'}
            </Button>
          </div>
        </div>

        {/* 余额显示 */}
        <div className="mb-6 p-5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg text-white transition-all duration-500 hover:shadow-xl hover:scale-[1.02]">
          <Typography.Text className="opacity-80 block mb-2">可用余额</Typography.Text>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <Typography.Title level={2} className="text-white m-0 font-bold">
                {animatedBalance}
              </Typography.Title>
              <Typography.Text className="text-white/90 font-medium text-lg">
                {balance?.symbol || 'ETH'}
              </Typography.Text>
            </div>
            <Typography.Text className="text-white/70 mt-1">
              {balance?.value && (
                `≈ ${(parseFloat(balance.formatted) * 3000).toLocaleString('en-US', { maximumFractionDigits: 2 })} USD`
              )}
            </Typography.Text>
          </div>
        </div>

        {/* 网络信息 */}
        {balance && (
          <div className="p-5 bg-gray-50 rounded-xl shadow-sm">
            <Typography.Text type="secondary" className="block mb-3">技术详情</Typography.Text>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <Typography.Text type="secondary" className="text-xs block mb-1">原始值</Typography.Text>
                <Typography.Text className="font-mono text-gray-800 text-sm break-all">
                  {balance.value.toString()}
                </Typography.Text>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <Typography.Text type="secondary" className="text-xs block mb-1">网络</Typography.Text>
                <Typography.Text className="text-gray-800">
                  {balance.chain.name} ({balance.chain.id})
                </Typography.Text>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}