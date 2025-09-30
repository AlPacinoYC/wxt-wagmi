import React from 'react'
import { Web3Provider } from './Web3Provider'
import { WalletConnectButton } from './components/WalletConnectButton'
import { BalanceDisplay } from './components/BalanceDisplay'
import { ContractInteraction } from './components/ContractInteraction'
import './App.css'

function App() {
  return (
    <Web3Provider>
      <div className="app-container">
        <header className="app-header">
          <h1>Web3 钱包应用</h1>
          <p>支持连接钱包、查看余额和智能合约交互</p>
        </header>
        
        <main className="app-main">
          <section className="wallet-section">
            <WalletConnectButton />
          </section>
          
          <section className="balance-section">
            <h2>余额信息</h2>
            <BalanceDisplay />
          </section>
          
          <section className="contract-section">
            <h2>智能合约交互</h2>
            <ContractInteraction />
          </section>
        </main>
        
        <footer className="app-footer">
          <p>Web3 前端应用示例 - 使用 Vite + React + Wagmi</p>
        </footer>
      </div>
    </Web3Provider>
  )
}

export default App
