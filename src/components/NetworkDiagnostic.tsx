import React, { useState, useEffect } from 'react';
import { useAccount, useChainId, useBalance } from 'wagmi';
import { Card, Typography, Button, Alert, Spin, Row, Col, Statistic } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, ReloadOutlined, WifiOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

/**
 * 网络诊断组件
 * 用于检查hardhat本地网络连接状态和合约部署情况
 */
export const NetworkDiagnostic: React.FC = () => {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const { data: balance, isLoading: balanceLoading } = useBalance({ address });
  const [isChecking, setIsChecking] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<{
    hardhatRunning: boolean;
    correctNetwork: boolean;
    contractDeployed: boolean;
    error?: string;
  } | null>(null);

  // 检查网络状态
  const checkNetworkStatus = async () => {
    setIsChecking(true);
    try {
      // 检查是否连接到正确的网络
      const correctNetwork = chainId === 31337;
      
      // 检查hardhat是否运行
      let hardhatRunning = false;
      try {
        const response = await fetch('http://localhost:8545', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_blockNumber',
            params: [],
            id: 1
          })
        });
        hardhatRunning = response.ok;
      } catch (error) {
        console.error('Hardhat连接检查失败:', error);
      }

      // 检查合约是否部署
      let contractDeployed = false;
      try {
        const response = await fetch('http://127.0.0.1:8545', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_getCode',
            params: ['0x5FbDB2315678afecb367f032d93F642f64180aa3', 'latest'],
            id: 1
          })
        });
        const result = await response.json();
        contractDeployed = result.result && result.result !== '0x';
      } catch (error) {
        console.error('合约检查失败:', error);
      }

      setNetworkStatus({
        hardhatRunning,
        correctNetwork,
        contractDeployed,
        error: !hardhatRunning ? 'Hardhat本地网络未运行' : 
               !correctNetwork ? '未连接到Hardhat网络' :
               !contractDeployed ? '合约未正确部署' : undefined
      });

    } catch (error) {
      setNetworkStatus({
        hardhatRunning: false,
        correctNetwork: false,
        contractDeployed: false,
        error: '网络检查失败: ' + (error as Error).message
      });
    } finally {
      setIsChecking(false);
    }
  };

  // 组件挂载时自动检查
  useEffect(() => {
    if (isConnected) {
      checkNetworkStatus();
    }
  }, [isConnected, chainId]);

  if (!isConnected) {
    return (
      <Card className="mb-6">
        <Alert
          message="请先连接钱包"
          description="连接钱包后才能进行网络诊断"
          type="info"
          showIcon
        />
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <Title level={4} className="mb-0 flex items-center gap-2">
          <WifiOutlined className="text-blue-500" />
          网络诊断
        </Title>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={checkNetworkStatus}
          loading={isChecking}
        >
          刷新检查
        </Button>
      </div>

      {networkStatus && (
        <div className="space-y-4">
          {/* 网络状态概览 */}
          <Row gutter={16}>
            <Col span={8}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Hardhat运行状态"
                  value={networkStatus.hardhatRunning ? '运行中' : '未运行'}
                  valueStyle={{ 
                    color: networkStatus.hardhatRunning ? '#52c41a' : '#ff4d4f' 
                  }}
                  prefix={networkStatus.hardhatRunning ? 
                    <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small" className="text-center">
                <Statistic
                  title="网络连接"
                  value={networkStatus.correctNetwork ? '正确' : '错误'}
                  valueStyle={{ 
                    color: networkStatus.correctNetwork ? '#52c41a' : '#ff4d4f' 
                  }}
                  prefix={networkStatus.correctNetwork ? 
                    <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small" className="text-center">
                <Statistic
                  title="合约部署"
                  value={networkStatus.contractDeployed ? '已部署' : '未部署'}
                  valueStyle={{ 
                    color: networkStatus.contractDeployed ? '#52c41a' : '#ff4d4f' 
                  }}
                  prefix={networkStatus.contractDeployed ? 
                    <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
                />
              </Card>
            </Col>
          </Row>

          {/* 详细信息 */}
          <div className="space-y-3">
            <div>
              <Text strong>当前网络ID: </Text>
              <Text code>{chainId}</Text>
              {chainId === 31337 ? (
                <Text type="success" className="ml-2">✅ 正确</Text>
              ) : (
                <Text type="danger" className="ml-2">❌ 应该是31337</Text>
              )}
            </div>

            <div>
              <Text strong>钱包地址: </Text>
              <Text code>{address}</Text>
            </div>

            <div>
              <Text strong>钱包余额: </Text>
              {balanceLoading ? (
                <Spin size="small" />
              ) : (
                <Text>{balance ? `${balance.formatted} ${balance.symbol}` : '未知'}</Text>
              )}
            </div>

            <div>
              <Text strong>Hardhat状态: </Text>
              {networkStatus.hardhatRunning ? (
                <Text type="success">✅ 本地节点运行正常</Text>
              ) : (
                <Text type="danger">❌ 本地节点未运行</Text>
              )}
            </div>
          </div>

          {/* 错误提示 */}
          {networkStatus.error && (
            <Alert
              message="发现问题"
              description={networkStatus.error}
              type="error"
              showIcon
              action={
                <Button size="small" danger>
                  查看解决方案
                </Button>
              }
            />
          )}

          {/* 解决方案提示 */}
          {networkStatus.error && (
            <Alert
              message="解决方案"
              description={
                <div className="space-y-2">
                  {!networkStatus.hardhatRunning && (
                    <div>
                      <Text strong>1. 启动Hardhat本地网络:</Text>
                      <br />
                      <Text code>npx hardhat node</Text>
                    </div>
                  )}
                  {!networkStatus.contractDeployed && (
                    <div>
                      <Text strong>2. 部署合约:</Text>
                      <br />
                      <Text code>npm run deploy</Text>
                    </div>
                  )}
                  {!networkStatus.correctNetwork && (
                    <div>
                      <Text strong>3. 切换到Hardhat网络:</Text>
                      <br />
                      <Text>在钱包中选择Hardhat网络 (Chain ID: 31337)</Text>
                    </div>
                  )}
                </div>
              }
              type="info"
              showIcon
            />
          )}
        </div>
      )}
    </Card>
  );
};


