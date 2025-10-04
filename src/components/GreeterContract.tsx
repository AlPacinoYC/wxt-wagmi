import React, { useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { Card, Form, Input, Button, Typography, message, Empty, Spin } from 'antd';
import { MessageOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { greeterContract } from '../contracts/LocalContracts';

const { Title, Text } = Typography;
const { Item } = Form;

/**
 * Greeter合约交互组件
 * 用于查看和修改本地部署的Greeter合约的问候语
 */
export const GreeterContract: React.FC = () => {
  const { isConnected } = useAccount();
  const [newGreeting, setNewGreeting] = useState('');
  const [form] = Form.useForm();
  const [txStatus, setTxStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  // 读取合约的当前问候语 - 配置自动刷新
  const {
    data: currentGreeting,
    isLoading: isReading,
    error: readError,
    refetch
  } = useReadContract({
    address: greeterContract.address as `0x${string}`,
    abi: greeterContract.abi,
    functionName: 'greet',
    // 配置查询选项
  });

  // 写合约操作（设置新问候语）
  const {
    writeContract: setGreeting,
    isPending: isWriting,
    data: txHash,
    error: writeError
  } = useWriteContract();

  // 处理设置新问候语
  const handleSetGreeting = async () => {
    try {
      setTxStatus('sending');
      message.loading('正在发送交易...', 0);
      
      // 类型断言，确保地址格式正确
      await setGreeting({
        address: greeterContract.address as `0x${string}`,
        abi: greeterContract.abi,
        functionName: 'setGreeting',
        args: [newGreeting],
      });
      
      // 交易发送成功后，重置表单和状态
      form.resetFields();
      setNewGreeting('');
      setTxStatus('success');
      // 立即刷新数据，显示最新的问候语
      await refetch();
      // 注意：对于useReadContract钩子管理的readError状态，
      // 不需要我们手动重置，因为wagmi会在下一次成功读取数据时自动更新
      message.success('交易已成功上链！');
    } catch (error) {
      setTxStatus('error');
      message.error('交易失败，请重试');
      console.error('Set greeting error:', error);
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
      <div className="relative h-32 bg-gradient-to-r from-green-600 via-teal-500 to-cyan-600 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {/* 背景装饰 */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative h-full flex flex-col justify-center px-6">
          <Title level={4} className="text-white m-0 font-bold">
            <MessageOutlined className="mr-2" /> Greeter 合约
          </Title>
          <Text className="text-white/90">
            查看和修改合约的问候语
          </Text>
        </div>
      </div>

      <div className="p-6">
        {/* 当前问候语展示 */}
        <div className="mb-8">
          <Text strong className="text-gray-700">
            当前问候语
          </Text>
          <div className="mt-4 p-6 bg-gray-50 rounded-xl border border-gray-200">
            {isReading ? (
              <div className="flex justify-center items-center py-4">
                <Spin tip="读取中..." />
              </div>
            ) : readError ? (
              <div className="flex items-center text-red-500">
                <ExclamationCircleOutlined className="mr-2" />
                <Text type="danger">读取失败：{readError.message}</Text>
              </div>
            ) : (
              <div className="text-center text-2xl font-semibold text-gray-800">
                {/* 确保currentGreeting是字符串类型 */}
                {currentGreeting ? String(currentGreeting) : 'Hello, World!'}
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
            {greeterContract.address}
          </div>
        </div>

        {/* 设置新问候语表单 */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSetGreeting}
        >
          <Item
            label="新问候语"
            name="greeting"
            rules={[{ required: true, message: '请输入新的问候语' }]}
          >
            <Input
              value={newGreeting}
              onChange={(e) => setNewGreeting(e.target.value)}
              placeholder="请输入新的问候语"
              disabled={isWriting}
              className="py-5 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300"
            />
          </Item>

          <Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isWriting}
              className={`w-full h-14 text-lg font-medium rounded-xl transition-all duration-300 ${isWriting ? 
                'bg-gray-400 cursor-not-allowed' : 
                'bg-gradient-to-r from-green-600 to-teal-500 hover:from-green-700 hover:to-teal-600 shadow-lg hover:shadow-xl hover:-translate-y-1'}`}
            >
              {isWriting ? '交易处理中...' : '设置新问候语'}
            </Button>
          </Item>
        </Form>

        {/* 交易状态提示 */}
        {txStatus === 'success' && txHash && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <CheckCircleOutlined className="text-green-500 mr-3 mt-0.5" />
              <div>
                <Text strong className="text-green-700">交易成功！</Text>
                <div className="mt-1 text-sm text-gray-600">
                  交易哈希: {txHash.substring(0, 10)}...{txHash.substring(txHash.length - 10)}
                </div>
              </div>
            </div>
          </div>
        )}

        {txStatus === 'error' && writeError && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <ExclamationCircleOutlined className="text-red-500 mr-3 mt-0.5" />
              <div>
                <Text strong className="text-red-700">交易失败</Text>
                <div className="mt-1 text-sm text-gray-600">
                  {writeError.message}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};