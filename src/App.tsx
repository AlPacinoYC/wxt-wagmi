import { BalanceDisplay } from './components/BalanceDisplay'
import { ContractInteraction } from './components/ContractInteraction'
import { GreeterContract } from './components/GreeterContract'
import { TransferContract } from './components/TransferContract'
import { WalletConnectButton } from './components/WalletConnectButton'
import { NetworkDiagnostic } from './components/NetworkDiagnostic'
import { Layout, Typography, Card, Row, Col, ConfigProvider } from 'antd'
import { WalletOutlined, TransactionOutlined, SplitCellsOutlined } from '@ant-design/icons'
import 'antd/dist/reset.css'

const { Header, Content, Footer } = Layout
const { Title, Paragraph, Text } = Typography

// 自定义 antd 主题配置
// const customTheme = {
//   token: {
//     colorPrimary: '#6366f1',
//     colorPrimaryHover: '#4f46e5',
//     colorPrimaryActive: '#4338ca',
//     colorDanger: '#ef4444',
//     colorDangerHover: '#dc2626',
//     colorDangerActive: '#b91c1c',
//     borderRadius: 8,
//     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
//   },
//   components: {
//     Button: {
//       fontSize: 16,
//       paddingXS: '4px 12px',
//       paddingSM: '6px 16px',
//       paddingMD: '8px 24px',
//       paddingLG: '12px 32px',
//       shadowHover: '0 6px 16px 0 rgba(99, 102, 241, 0.4)',
//       shadowActive: '0 4px 12px 0 rgba(99, 102, 241, 0.4)',
//     },
//     Card: {
//       borderRadius: 12,
//       boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
//     },
//   },
// };

function App() {

  return (
    <ConfigProvider>
      <Layout className="min-h-screen">
        {/* 头部 */}
        <Header className="bg-gradient-to-r from-indigo-600 via-violet-500 to-purple-600 text-white p-6 shadow-lg relative overflow-hidden">
          {/* 背景装饰效果 */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          <div className="max-w-6xl mx-auto relative z-10">
            <Row gutter={16} align="middle">
              <Col flex={1}>
                <Title level={1} className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent tracking-tight">
                  Web3 钱包应用
                </Title>
                <Paragraph className="text-xl text-white/90 font-light">
                  支持连接钱包、查看余额和智能合约交互
                </Paragraph>
              </Col>
              
              <Col>
                <Text className="text-white/80">
                  安全 • 高效 • 便捷
                </Text>
              </Col>
            </Row>
          </div>
        </Header>
      
      {/* 主要内容 */}
      <Content className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* 钱包连接部分 */}
          <Card className="mb-8 shadow-lg border-0">
            <Title level={3} className="mb-4 flex items-center gap-2">
              <WalletOutlined className="text-indigo-500" />
              连接你的钱包
            </Title>
            <Row gutter={16} align="middle">
              <Col>
                <WalletConnectButton />
              </Col>
            </Row>
          </Card>
          
          {/* 余额信息部分 */}
          <Card className="mb-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
            <Title level={3} className="mb-4 flex items-center gap-2">
              <TransactionOutlined className="text-indigo-500" />
              余额信息
            </Title>
            <BalanceDisplay />
          </Card>
          
          {/* 网络诊断部分 */}
          <NetworkDiagnostic />
          
          {/* 智能合约交互部分 */}
          <Card className="mb-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
            <Title level={3} className="mb-4 flex items-center gap-2">
              <SplitCellsOutlined className="text-indigo-500" />
              智能合约交互
            </Title>
            <ContractInteraction />
            <div className="mt-8">
              <GreeterContract />
            </div>
            <div className="mt-8">
              <TransferContract />
            </div>
          </Card>
        </div>
      </Content>
      
      {/* 页脚 */}
      <Footer className="bg-gradient-to-r from-dark-900 to-dark-800 py-6 px-4 text-center text-gray-400">
        <Paragraph>
          © {new Date().getFullYear()} Web3 钱包应用 - 安全、便捷的区块链交互平台
        </Paragraph>
      </Footer>
    </Layout>
  </ConfigProvider>
  )
}

export default App
