// Aave V3 Contract Addresses
export interface NetworkConfig {
    name: string;
    chainId: number;
    rpcUrl: string;
    pool: string;
    aaveProtocolDataProvider: string;
    aaveOracle: string;
}

export const NETWORKS: Record<string, NetworkConfig> = {
    arbitrum: {
        name: "Arbitrum One",
        chainId: 42161,
        rpcUrl:
            process.env.ARBITRUM_RPC_URL ||
            "https://arb1.arbitrum.io/rpc",
        pool: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
        aaveProtocolDataProvider: "0x69FA688f1Dc47d4B5d8029D5a35FB7a548310654",
        aaveOracle: "0xb56c2F0B653B2e0b10C9b928C8580Ac5Df02C7C7",
    },
    avalanche: {
        name: "Avalanche C-Chain",
        chainId: 43114,
        rpcUrl:
            process.env.AVALANCHE_RPC_URL ||
            "https://api.avax.network/ext/bc/C/rpc",
        pool: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
        aaveProtocolDataProvider: "0x69FA688f1Dc47d4B5d8029D5a35FB7a548310654",
        aaveOracle: "0xEBd36016B3eD09D4693Ed4251c67Bd858c3c7C9C",
    },
};

export const SUPPORTED_NETWORKS = Object.keys(NETWORKS);
