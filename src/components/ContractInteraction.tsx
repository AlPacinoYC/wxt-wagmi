import React, { useState } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { Address } from 'viem'
import { parseEther } from 'viem'

// 示例ERC20代币合约ABI
const erc20Abi = [
  {
    inputs: [
      { internalType: 'address', name: 'recipient', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

interface ContractInteractionProps {
  contractAddress?: Address
  abi?: Array<any>
}

/**
 * 合约交互组件
 * 提供调用智能合约功能的界面
 */
export const ContractInteraction: React.FC<ContractInteractionProps> = ({
  contractAddress: defaultContractAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI合约地址作为示例
  abi: defaultAbi = erc20Abi,
}) => {
    const { isConnected } = useAccount()
    const [contractAddress, setContractAddress] = useState<Address>(defaultContractAddress)
    const [abi, setAbi] = useState(defaultAbi)
    const [functionName, setFunctionName] = useState('transfer')
    const [recipient, setRecipient] = useState<Address>('')
    const [amount, setAmount] = useState('')
    const [customAbi, setCustomAbi] = useState('')

  // 合约写操作
  const { writeContract, isPending, data: txHash, error } = useWriteContract()

  const handleSubmit = () => {
    if (contractAddress && abi && functionName && recipient && amount) {
      writeContract({
        address: contractAddress,
        abi: abi,
        functionName: functionName,
        args: [recipient, parseEther(amount)],
      })
    }
  }

  const handleCustomAbiChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomAbi(e.target.value)
  }

  const applyCustomAbi = () => {
    try {
      const parsedAbi = JSON.parse(customAbi)
      setAbi(parsedAbi)
    } catch (e) {
      alert('无效的ABI格式')
    }
  }



  if (!isConnected) {
    return (
      <div className="contract-interaction">
        <p>请先连接钱包</p>
      </div>
    )
  }

  return (
    <div className="contract-interaction">
      <h3>合约交互</h3>
      
      <div className="form-group">
        <label>合约地址:</label>
        <input
          type="text"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>自定义ABI (可选):</label>
        <textarea
          value={customAbi}
          onChange={handleCustomAbiChange}
          placeholder="输入ABI JSON..."
          className="form-textarea"
        />
        <button onClick={applyCustomAbi} className="apply-abi-btn">
          应用ABI
        </button>
      </div>

      <div className="form-group">
        <label>函数名:</label>
        <input
          type="text"
          value={functionName}
          onChange={(e) => setFunctionName(e.target.value)}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>接收地址 (示例transfer函数参数):</label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>金额 (示例transfer函数参数):</label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="form-input"
          placeholder="输入金额"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={isPending}
        className="submit-btn"
      >
        {isPending ? '处理中...' : '调用合约'}
      </button>

      {error && (
        <div className="error-message">
          错误: {error.message}
        </div>
      )}

      {txHash && (
        <div className="success-message">
          交易成功! Hash: {txHash.substring(0, 10)}...
        </div>
      )}
    </div>
  )
}