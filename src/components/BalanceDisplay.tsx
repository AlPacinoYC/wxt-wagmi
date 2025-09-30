import React from 'react'
import { useAccount, useBalance } from 'wagmi'

/**
 * 余额显示组件
 * 显示当前连接钱包的余额信息
 */
export const BalanceDisplay: React.FC = () => {
  const { address } = useAccount()
  const { data: balance, isLoading, error } = useBalance({
    address,
  })

  if (!address) {
    return (
      <div className="balance-display">
        <p>请先连接钱包</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="balance-display">
        <p>加载余额中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="balance-display error">
        <p>获取余额失败: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="balance-display">
      <div className="balance-item">
        <span className="balance-label">钱包地址:</span>
        <span className="balance-value address">
          {address.substring(0, 6)}...{address.substring(address.length - 4)}
        </span>
      </div>
      <div className="balance-item">
        <span className="balance-label">余额:</span>
        <span className="balance-value">
          {balance?.formatted || '0'} {balance?.symbol || 'ETH'}
        </span>
      </div>
      {balance?.value && (
        <div className="balance-item">
          <span className="balance-label">原始值:</span>
          <span className="balance-value">{balance.value.toString()}</span>
        </div>
      )}
    </div>
  )
}