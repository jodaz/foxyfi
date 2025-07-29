# Aave V3 Position Tracker

A lightweight web application to track Aave V3 positions across multiple networks (Arbitrum and Avalanche).

## Features

-   **Multi-Network Support**: Track positions on Arbitrum One and Avalanche C-Chain
-   **Real-time Data**: Fetches live data from Aave V3 contracts
-   **USD Pricing**: All values displayed in USD using Aave Oracle prices
-   **Comprehensive View**: Shows assets (aTokens), debts (variable/stable), and account health
-   **User-Friendly Interface**: Clean, responsive design built with Next.js and Tailwind CSS

## What it Shows

### Account Summary

-   Total Collateral (USD)
-   Total Debt (USD)
-   Health Factor
-   Available to Borrow
-   Loan to Value ratio

### Assets (aTokens)

-   Asset balances
-   USD values
-   Collateral status
-   Current prices

### Debts

-   Variable debt positions
-   Stable debt positions
-   USD values per asset

## Technology Stack

-   **Frontend**: Next.js 15, React 19, TypeScript
-   **Blockchain Interaction**: Ethers.js v6
-   **Styling**: Tailwind CSS
-   **Data Source**: Aave V3 Protocol contracts

## Quick Start

1. **Install Dependencies**:

    ```bash
    pnpm install
    ```

2. **Configure RPC URLs** (Optional):
   Edit `.env.local` to add your Infura/Alchemy URLs for better performance:

    ```env
    NEXT_PUBLIC_ARBITRUM_RPC_URL=https://arbitrum-mainnet.infura.io/v3/YOUR_PROJECT_ID
    NEXT_PUBLIC_AVALANCHE_RPC_URL=https://avalanche-mainnet.infura.io/v3/YOUR_PROJECT_ID
    ```

3. **Run Development Server**:

    ```bash
    pnpm dev
    ```

4. **Open your browser** and navigate to `http://localhost:3000`

## Usage

1. Select a network (Arbitrum or Avalanche)
2. Enter an Ethereum address
3. Click "Get Aave Position" to fetch data
4. View the detailed breakdown of assets and debts

## Contract Addresses

### Arbitrum One

-   **Pool**: `0x794a61358D6845594F94dc1DB02A252b5b4814aD`
-   **Data Provider**: `0x69FA688f1Dc47d4B5d8029D5a35FB7a548310654`
-   **Oracle**: `0xb56c2F0B653B2e0b10C9b928C8580Ac5Df02C7C7`

### Avalanche C-Chain

-   **Pool**: `0x794a61358D6845594F94dc1DB02A252b5b4814aD`
-   **Data Provider**: `0x69FA688f1Dc47d4B5d8029D5a35FB7a548310654`
-   **Oracle**: `0xEBd36016B3eD09D4693Ed4251c67Bd858c3c7C9C`

## Security Features

-   ✅ Input validation for Ethereum addresses
-   ✅ Error handling for network issues
-   ✅ Read-only contract interactions
-   ✅ No private key requirements
-   ✅ Secure RPC connections

## Disclaimer

This tool is for informational purposes only. Always verify important financial data through official Aave interfaces.
