# Web3 前端应用 - 使用 Vite + React + Wagmi

一个支持钱包连接、余额查看和智能合约交互的现代化web3前端应用。

## 功能特性

- 支持多种钱包连接：MetaMask、Coinbase Wallet、WalletConnect
- 实时查看钱包余额和地址信息
- 智能合约交互：支持自定义ABI和函数调用
- 响应式设计，适配各种设备尺寸
- 现代化UI界面，采用暗色主题设计

## 技术栈

- React 19
- TypeScript
- Vite
- Wagmi - Web3钱包连接库
- Viem - 以太坊交互库

## 安装和运行

### 前提条件

- Node.js >= 20.19.0 或 >= 22.12.0
- npm >= 8.0.0
- 浏览器安装MetaMask等钱包插件

### 安装依赖

```bash
npm install
```

### 开发模式运行

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
├── src/
│   ├── components/         # React组件
│   │   ├── WalletConnectButton.tsx  # 钱包连接按钮
│   │   ├── BalanceDisplay.tsx       # 余额显示组件
│   │   └── ContractInteraction.tsx  # 合约交互组件
│   ├── App.tsx             # 应用主组件
│   ├── App.css             # 应用样式
│   ├── main.tsx            # 应用入口
│   ├── wagmiConfig.ts      # Wagmi配置文件
│   └── Web3Provider.tsx    # Web3 Provider组件
├── package.json            # 项目依赖和脚本
├── vite.config.ts          # Vite配置
└── README.md               # 项目说明文档
```

## 配置说明

### WalletConnect配置

在 `src/wagmiConfig.ts` 文件中，你需要配置WalletConnect的项目ID：

```typescript
new WalletConnectConnector({
  chains: [mainnet, sepolia],
  options: {
    projectId: 'YOUR_PROJECT_ID', // 从WalletConnect官网获取
  },
})
```

### 智能合约交互

默认使用DAI代币合约作为示例，你可以在ContractInteraction组件中修改合约地址和ABI：

```typescript
interface ContractInteractionProps {
  contractAddress?: string
  abi?: any
}
```

## 使用指南

1. 运行应用后，点击钱包连接按钮选择你喜欢的钱包
2. 连接成功后，你可以看到钱包地址和余额信息
3. 在合约交互部分，输入合约地址、函数名和参数，然后点击调用按钮
4. 确认钱包弹出的交易确认窗口

## 注意事项

- 开发环境中默认连接到以太坊主网和Sepolia测试网
- 请确保你的钱包中有足够的ETH支付Gas费用
- 进行合约交互前，请仔细核对合约地址和函数参数

## License

MIT
