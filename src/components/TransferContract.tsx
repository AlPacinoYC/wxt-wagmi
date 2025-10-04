import React, { useState, useCallback } from 'react';
import { useAccount, useReadContract, useWriteContract, useBalance, useWatchContractEvent } from 'wagmi';
import { Card, Typography, Button, message, Empty, Spin, Input, Form } from 'antd';
import { WalletOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { transferContract } from '../contracts/LocalContracts';
import { formatEther, parseEther } from 'viem';

const { Title, Text } = Typography;
const { Item } = Form;

/**
 * Transfer合约交互组件
 * 用于查看和与本地部署的Transfer合约交互
 */
export const TransferContract: React.FC = () => {
  const { isConnected, address } = useAccount();
  const [amount, setAmount] = useState('');
  const [form] = Form.useForm();
  const [txStatus, setTxStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  // 读取用户在合约中的余额
  const {
    data: userContractBalance,
    isLoading: isReadingUserContractBalance,
    error: userBalanceError,
    refetch: refetchUserBalance
  } = useReadContract({
    abi: transferContract.abi,
    // 覆盖地址属性以修复类型错误
    address: transferContract.address as `0x${string}`,
    functionName: 'getBalance',
    args: [address as `0x${string}`], // 提供用户地址作为参数
  });

  // 读取合约总余额
  const {
    data: totalContractBalance,
    isLoading: isReadingTotalContractBalance,
    error: totalBalanceError,
    refetch: refetchTotalBalance
  } = useReadContract({
    abi: transferContract.abi,
    address: transferContract.address as `0x${string}`,
    functionName: 'getContractBalance',
    args: [],
  });

  // 写合约操作（提取资金）
  const {
    writeContract: withdraw,
    isPending: isWithdrawing,
    data: withdrawTxHash,
    error: withdrawError
  } = useWriteContract();

  // 写合约操作（向合约转账）
  const {
    writeContract: sendEther,
    isPending: isSending,
    data: sendTxHash,
    error: sendError
  } = useWriteContract();

  // 用户钱包余额
  const { 
    data: userBalance,
    isLoading: isReadingUserBalance
  } = useBalance({
    address,
  });

  // 定义事件处理回调函数
  const handleContractEvent = useCallback(() => {
    // 只有在refetch函数存在时才调用它
    console.log('合约事件触发:');
    if (refetchUserBalance) {
      refetchUserBalance();
    }
    if (refetchTotalBalance) {
      refetchTotalBalance();
    }

  }, [refetchUserBalance, refetchTotalBalance]);

  // 监听合约转账事件，实现实时余额更新
  useWatchContractEvent({
    abi: transferContract.abi,
    address: transferContract.address as `0x${string}`,
    eventName: 'TransferEvent',
    // 当检测到转账事件时自动刷新余额
    onLogs: handleContractEvent,
  });

  // 处理向合约转账（使用transfer方法）
  const handleTransfer = async () => {
    try {
      if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        message.error('请输入有效的转账金额');
        return;
      }

      setTxStatus('sending');
      message.loading('正在发送交易...', 0);
      
      // 类型断言，确保地址格式正确
      await sendEther({
        address: transferContract.address as `0x${string}`,
        value: parseEther(amount),
        abi: transferContract.abi,
        functionName: 'transfer', // 调用transfer函数
        args: [
          address as `0x${string}`, // _to参数：用户地址作为收款方
          parseEther(amount) // _amount参数：转账金额，以wei为单位
        ]
      });
      
      // 交易发送后刷新余额
      await refetchUserBalance();
      form.resetFields();
      setAmount('');
      setTxStatus('success');
      message.success('转账成功！');
    } catch (error) {
      setTxStatus('error');
      message.error('转账失败，请重试');
      console.error('Transfer error:', error);
    }
  };

  // 处理向合约存款（使用deposit方法）
  const handleDeposit = async () => {
    try {
      if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        message.error('请输入有效的存款金额');
        return;
      }

      setTxStatus('sending');
      message.loading('正在发送交易...', 0);
      
      // 类型断言，确保地址格式正确
      await sendEther({
        address: transferContract.address as `0x${string}`,
        value: parseEther(amount),
        abi: transferContract.abi,
        functionName: 'deposit', // 调用deposit函数
        args: []
      });
      
      // 交易发送后刷新余额
      await refetchUserBalance();
      form.resetFields();
      setAmount('');
      setTxStatus('success');
      message.success('存款成功！');
    } catch (error) {
      setTxStatus('error');
      message.error('存款失败，请重试');
      console.error('Deposit error:', error);
    }
  };

  // 处理从合约提取资金
  const handleWithdraw = async () => {
    try {
      setTxStatus('sending');
      message.loading('正在发送交易...', 0);
      
      // 类型断言，确保地址格式正确
      await withdraw({
        address: transferContract.address as `0x${string}`,
        abi: transferContract.abi,
        functionName: 'withdraw', 
        args: [userContractBalance as bigint], // 提取用户在合约中的全部余额
        gasPrice: BigInt(1e9), // 1 Gwei（单位：wei，1 Gwei = 1e9 wei
      });
      
      // 交易发送后刷新余额
      await refetchUserBalance();
      setTxStatus('success');
      message.success('提取成功！');
    } catch (error) {
      setTxStatus('error');
      message.error('提取失败，请重试');
      console.error('Withdraw error:', error);
    }
  };

  // 如果钱包未连接，显示提示
  if (!isConnected) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="请先连接钱包"
        className="py-12"
      />
    );
  }

  return (
    <Card className="border-0 shadow-lg overflow-hidden transition-all duration-500 hover:shadow-xl">
      {/* 头部信息 */}
      <div className="relative h-32 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {/* 背景装饰 */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative h-full flex flex-col justify-center px-6">
          <Title level={4} className="text-white m-0 font-bold">
            <WalletOutlined className="mr-2" /> Transfer 合约
          </Title>
          <Text className="text-white/90">
            向合约转账和从合约提取资金
          </Text>
        </div>
      </div>

      <div className="p-6">
        {/* 合约总余额展示 */}
        <div className="mb-8">
          <Text strong className="text-gray-700">
            合约总余额<Button onClick={() => refetchTotalBalance()} className="ml-2">更新数据</Button>
          </Text>
          <div className="mt-4 p-6 bg-gray-50 rounded-xl border border-gray-200">
            {isReadingTotalContractBalance ? (
              <div className="flex justify-center items-center py-4">
                <Spin tip="读取中..." />
              </div>
            ) : totalBalanceError ? (
              <div className="flex items-center text-red-500">
                <ExclamationCircleOutlined className="mr-2" />
                <Text type="danger">读取失败：{totalBalanceError.message}</Text>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-3xl font-semibold text-gray-800">
                  {/* 类型断言，确保totalContractBalance是bigint类型 */}
                  {totalContractBalance ? formatEther(totalContractBalance as unknown as bigint) : '0'}
                </div>
                <div className="text-gray-500 mt-1">ETH</div>
              </div>
            )}
          </div>
        </div>

        {/* 用户在合约中的余额展示 */}
        <div className="mb-8">
          <Text strong className="text-gray-700">
            您在合约中的余额<Button onClick={() => refetchUserBalance()} className="ml-2">更新数据</Button>
          </Text>
          <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            {isReadingUserContractBalance ? (
              <Text type="secondary">读取中...</Text>
            ) : userBalanceError ? (
              <Text type="danger">读取失败：{userBalanceError.message}</Text>
            ) : (
              <div className="flex items-center">
                <Text className="text-lg font-medium text-gray-800">
                  {userContractBalance ? formatEther(userContractBalance as unknown as bigint) : '0'}
                </Text>
                <Text className="text-gray-500 ml-2">ETH</Text>
              </div>
            )}
          </div>
        </div>

        {/* 用户钱包余额展示 */}
        <div className="mb-8">
          <Text strong className="text-gray-700">
            您的钱包余额
          </Text>
          <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            {isReadingUserBalance ? (
              <Text type="secondary">读取中...</Text>
            ) : (
              <div className="flex items-center">
                <Text className="text-lg font-medium text-gray-800">
                  {userBalance ? formatEther(userBalance.value) : '0'}
                </Text>
                <Text className="text-gray-500 ml-2">ETH</Text>
              </div>
            )}
          </div>
        </div>

        {/* 合约地址 */}
        <div className="mb-8">
          <Text strong className="text-gray-700">
            合约地址
          </Text>
          <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 font-mono text-sm overflow-x-auto">
            {transferContract.address}
          </div>
        </div>

        {/* 合约操作表单 */}
        <Form
          form={form}
          layout="vertical"
          className="mb-6"
        >
          <Item
            label="金额 (ETH)"
            name="amount"
            rules={[
              { required: true, message: '请输入金额' },
            ]}
          >
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="请输入要操作的ETH数量"
              disabled={isSending || isWithdrawing}
              type="number"
              step="0.000000001"
              className="py-5 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300"
            />
          </Item>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Item>
              <Button
                type="primary"
                size="large"
                loading={isSending}
                onClick={handleDeposit}
                disabled={isSending || isWithdrawing}
                className={`w-full h-14 text-lg font-medium rounded-xl transition-all duration-300 ${isSending ? 
                  'bg-gray-400 cursor-not-allowed' : 
                  'bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 shadow-lg hover:shadow-xl hover:-translate-y-1'}`}
              >
                {isSending ? '存款处理中...' : '向合约存款'}
              </Button>
            </Item>

            <Item>
              <Button
                type="default"
                size="large"
                loading={isSending}
                onClick={handleTransfer}
                disabled={isSending || isWithdrawing}
                className={`w-full h-14 text-lg font-medium rounded-xl transition-all duration-300 ${isSending ? 
                  'bg-gray-400 cursor-not-allowed' : 
                  'bg-gradient-to-r from-green-600 to-teal-500 hover:from-green-700 hover:to-teal-600 shadow-lg hover:shadow-xl hover:-translate-y-1 text-white'}`}
              >
                {isSending ? '转账处理中...' : '合约内转账'}
              </Button>
            </Item>

            <Item>
              <Button
                type="default"
                size="large"
                loading={isWithdrawing}
                onClick={handleWithdraw}
                disabled={isSending || isWithdrawing || (!userContractBalance || userContractBalance === BigInt(0))}
                className={`w-full h-14 text-lg font-medium rounded-xl transition-all duration-300 ${isWithdrawing || (!userContractBalance || userContractBalance === BigInt(0)) ? 
                  'bg-gray-200 text-gray-500 cursor-not-allowed' : 
                  'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 shadow-lg hover:shadow-xl hover:-translate-y-1 text-white'}`}
              >
                {isWithdrawing ? '提取处理中...' : '提取全部资金'}
              </Button>
            </Item>
          </div>
        </Form>

        {/* 交易状态提示 */}
        {txStatus === 'success' && (withdrawTxHash || sendTxHash) && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <CheckCircleOutlined className="text-green-500 mr-3 mt-0.5" />
              <div>
                <Text strong className="text-green-700">交易成功！</Text>
                <div className="mt-1 text-sm text-gray-600">
                  交易哈希: {withdrawTxHash ? withdrawTxHash.substring(0, 10) + '...' + withdrawTxHash.substring(withdrawTxHash.length - 10) : sendTxHash?.substring(0, 10) + '...' + sendTxHash?.substring(sendTxHash.length - 10)}
                </div>
              </div>
            </div>
          </div>
        )}

        {txStatus === 'error' && (withdrawError || sendError) && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <ExclamationCircleOutlined className="text-red-500 mr-3 mt-0.5" />
              <div>
                <Text strong className="text-red-700">交易失败</Text>
                <div className="mt-1 text-sm text-gray-600">
                  {(withdrawError || sendError)?.message}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};