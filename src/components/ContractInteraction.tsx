import React, { useState, useEffect } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { ethers } from 'ethers'
import { Card, Form, Input, Button, Typography, message, Empty, Tooltip, Switch } from 'antd'
import { CodeOutlined, CopyOutlined, CheckOutlined, UpSquareOutlined , ArrowUpOutlined , BorderVerticleOutlined , LockOutlined } from '@ant-design/icons'

const { TextArea } = Input

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
]

interface ContractInput {
  name: string
  type: string
  internalType: string
}

interface ContractOutput {
  name?: string
  type: string
  internalType?: string
}

// ABI项类型定义
export interface ContractAbiItem {
  name: string
  inputs: ContractInput[]
  outputs?: ContractOutput[]
  stateMutability: string
  type: string
}

interface ContractInteractionProps {
  contractAddress?: string
  abi?: ContractAbiItem[]
}

// 合约函数类型
interface ContractFunction {
  name: string
  inputs: ContractInput[]
  outputs?: ContractOutput[]
  stateMutability: string
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
  const [contractAddress, setContractAddress] = useState<string>(defaultContractAddress)
  const [abi, setAbi] = useState(defaultAbi)
  const [functionName, setFunctionName] = useState('transfer')
  const [recipient, setRecipient] = useState<string>('')
  const [amount, setAmount] = useState('')
  const [customAbi, setCustomAbi] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [txStatus, setTxStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [copied, setCopied] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)

  // 合约写操作
  const { writeContract, isPending, data: txHash, error } = useWriteContract()

  // 检查表单有效性
  useEffect(() => {
    setIsFormValid(!!(contractAddress && abi && functionName && recipient && amount))
  }, [contractAddress, abi, functionName, recipient, amount])

  // 跟踪交易状态
  useEffect(() => {
    if (isPending) {
      setTxStatus('sending')
    } else if (txHash && !error) {
      setTxStatus('success')
    } else if (error) {
      setTxStatus('error')
    } else {
      setTxStatus('idle')
    }
  }, [isPending, txHash, error])

  // 复制合约地址
  const handleCopyContractAddress = () => {
    navigator.clipboard.writeText(contractAddress)
    message.success('合约地址已复制')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 复制交易哈希
  const handleCopyTxHash = () => {
    if (txHash) {
      navigator.clipboard.writeText(txHash)
      message.success('交易哈希已复制')
    }
  }

  const handleSubmit = async () => {
    if (contractAddress && abi && functionName && recipient && amount) {
      try {
        writeContract({
          address: contractAddress as `0x${string}`,
          abi: abi,
          functionName: functionName,
          args: [recipient as `0x${string}`, ethers.parseEther(amount)],
        })
      } catch (e) {
        console.error('合约调用失败:', e)
      }
    }
  }

  const handleCustomAbiChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomAbi(e.target.value)
  }

  const applyCustomAbi = () => {
    try {
      const parsedAbi = JSON.parse(customAbi)
      setAbi(parsedAbi)
      message.success('ABI 应用成功')
    } catch (e) {
      message.error(`无效的ABI格式，请检查JSON语法: ${e}`)
    }
  }

  if (!isConnected) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="请先连接钱包"
        className="py-12"
      />
    )
  }

  // 获取当前ABI中的所有函数
  const contractFunctions = abi.filter((item: ContractAbiItem) => item.type === 'function') as ContractFunction[]

  return (
    <Card className="border-0 shadow-lg overflow-hidden transition-all duration-500 hover:shadow-xl">
      {/* 头部信息 */}
      <div className="relative h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {/* 背景装饰 */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative h-full flex flex-col justify-center px-6">
          <Typography.Title level={4} className="text-white m-0 font-bold">
            <CodeOutlined className="mr-2" /> 合约交互
          </Typography.Title>
          <Typography.Text className="text-white/90">
            调用智能合约函数，执行区块链操作
          </Typography.Text>
        </div>
      </div>

      <div className="p-6">
        {/* 高级模式切换 */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <BorderVerticleOutlined  className="text-indigo-500" />
            <Typography.Text>高级模式</Typography.Text>
          </div>
          <Switch 
            checked={showAdvanced} 
            onChange={setShowAdvanced} 
            checkedChildren="开启" 
            unCheckedChildren="关闭" 
          />
        </div>

        {/* 交易状态指示器 */}
        {txStatus !== 'idle' && (
          <div className={`mb-6 p-4 rounded-lg transition-all duration-300 animate-fadeIn
            ${txStatus === 'sending' ? 'bg-blue-50 border border-blue-200' : 
              txStatus === 'success' ? 'bg-green-50 border border-green-200' : 
              'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center gap-3">
              {txStatus === 'sending' && (
                <>  
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center animate-pulse">
                    <UpSquareOutlined  className="text-blue-600" />
                  </div>
                  <div>
                    <Typography.Text strong>交易处理中</Typography.Text>
                    <Typography.Text type="secondary" className="block">正在等待区块链确认...</Typography.Text>
                  </div>
                </>
              )}
              {txStatus === 'success' && (
                <>  
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckOutlined className="text-green-600" />
                  </div>
                  <div>
                    <Typography.Text strong>交易成功</Typography.Text>
                    <div className="mt-1">
                      <Typography.Text type="secondary">交易哈希:</Typography.Text>
                      <Typography.Text 
                        className="ml-2 font-mono cursor-pointer hover:text-green-600 transition-colors"
                        onClick={handleCopyTxHash}
                      >
                        {txHash?.substring(0, 10)}...
                      </Typography.Text>
                      <Tooltip title="点击复制">
                        <CopyOutlined 
                          className="ml-1 text-green-500 cursor-pointer"
                          onClick={handleCopyTxHash}
                        />
                      </Tooltip>
                    </div>
                  </div>
                </>
              )}
              {txStatus === 'error' && (
                <>  
                  <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                    <ArrowUpOutlined  className="text-red-600" />
                  </div>
                  <div>
                    <Typography.Text strong>交易失败</Typography.Text>
                    <Typography.Text type="secondary" className="block">
                      {error?.message.substring(0, 100)}...
                    </Typography.Text>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

      <Form layout="vertical" className="space-y-6">
        {/* 合约地址输入 */}
        <Form.Item 
          label={<div className="flex items-center gap-2"><LockOutlined className="text-indigo-500" /> 合约地址</div>} 
          tooltip="智能合约的以太坊地址，示例使用DAI代币合约"
          className="mb-6"
        >
          <div className="relative">
            <Input
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              placeholder="请输入合约地址"
              className="pl-10 pr-36 py-6 text-base rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <CodeOutlined size={18} />
            </div>
            <Tooltip title={copied ? "已复制" : "复制合约地址"}>
              <Button 
                onClick={handleCopyContractAddress} 
                type="text" 
                size="small"
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 rounded-lg transition-all duration-300
                  ${copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                `}
              >
                {copied ? (
                  <span className="flex items-center gap-1">
                    <CheckOutlined size={14} />
                    <span>已复制</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <CopyOutlined size={14} />
                    <span>复制</span>
                  </span>
                )}
              </Button>
            </Tooltip>
          </div>
        </Form.Item>

        {/* 自定义ABI输入（高级模式可见） */}
        {showAdvanced && (
          <div className="mb-6 animate-fadeIn">
            <Form.Item 
              label={<div className="flex items-center gap-2"><BorderVerticleOutlined  className="text-indigo-500" /> 自定义ABI</div>} 
              tooltip="输入合约的ABI以调用不同的函数"
            >
              <TextArea
                value={customAbi}
                onChange={handleCustomAbiChange}
                placeholder="输入ABI JSON..."
                rows={4}
                className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300"
              />
              <Button 
                onClick={applyCustomAbi} 
                type="primary"
                size="small"
                className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-300 shadow-sm hover:shadow"
              >
                应用ABI
              </Button>
            </Form.Item>
          </div>
        )}

        {/* 合约函数选择（高级模式下显示可选函数） */}
        <Form.Item 
          label={<div className="flex items-center gap-2"><CodeOutlined className="text-indigo-500" /> 函数名</div>} 
          className="mb-6"
        >
          <div className="relative">
            <Input
              value={functionName}
              onChange={(e) => setFunctionName(e.target.value)}
              placeholder="请输入函数名（如transfer）"
              className="pl-10 py-6 text-base rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <BorderVerticleOutlined  size={18} />
            </div>
          </div>
          {/* 显示当前ABI中可用的函数 */}
          {contractFunctions.length > 0 && showAdvanced && (
            <div className="mt-2 flex flex-wrap gap-2">
              {contractFunctions.slice(0, 5).map((func, index) => (
                <Tooltip key={index} title={`函数参数: ${func.inputs.map(inp => `${inp.name}: ${inp.type}`).join(', ')}`}>
                  <Button
                    type="text"
                    size="small"
                    onClick={() => setFunctionName(func.name)}
                    className="text-xs border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                  >
                    {func.name}
                  </Button>
                </Tooltip>
              ))}
              {contractFunctions.length > 5 && (
                <Typography.Text type="secondary" className="text-xs">
                  还有 {contractFunctions.length - 5} 个函数...
                </Typography.Text>
              )}
            </div>
          )}
        </Form.Item>

        {/* 函数参数输入 */}
        <div className="mb-8">
          <Typography.Text strong className="mb-4 block text-gray-700">
            函数参数
          </Typography.Text>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 接收地址 */}
            <Form.Item label="接收地址" className="mb-0">
              <Input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="请输入接收方钱包地址"
                className="py-5 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300"
              />
            </Form.Item>

            {/* 金额 */}
            <Form.Item label="金额" className="mb-0">
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="请输入转账金额"
                className="py-5 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300"
              />
            </Form.Item>
          </div>
        </div>

        {/* 调用按钮 */}
        <Form.Item className="mb-4">
          <Button
            onClick={handleSubmit}
            disabled={isPending || !isFormValid}
            type="primary"
            size="large"
            className={`w-full h-14 text-lg font-medium rounded-xl transition-all duration-300 ${isFormValid ? 
              'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:-translate-y-1' : 
              'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            loading={isPending}
          >
            {isPending ? '处理中...' : '调用合约'}
          </Button>
          {!isFormValid && !isPending && (
            <Typography.Text type="secondary" className="block text-center mt-2 text-xs">
              请填写所有必填字段
            </Typography.Text>
          )}
        </Form.Item>

        {/* 安全提示 */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-start gap-3">
            <ArrowUpOutlined  className="text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <Typography.Text strong className="text-blue-700">安全提示</Typography.Text>
              <Typography.Text type="secondary" className="block text-sm mt-1">
                在确认交易前，请仔细检查合约地址、金额和接收方地址。区块链交易一旦确认，将无法撤销。
              </Typography.Text>
            </div>
          </div>
        </div>
      </Form>
    </div>
    </Card>
  )
}