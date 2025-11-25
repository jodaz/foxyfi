import { ethers } from "ethers";
import { NETWORKS, NetworkConfig } from "./config";
import {
    POOL_ABI,
    AAVE_PROTOCOL_DATA_PROVIDER_ABI,
    AAVE_ORACLE_ABI,
    ERC20_ABI,
} from "./abis";
import { AppError, handleError } from "./utils";

export interface UserAccountData {
    totalCollateralBase: string;
    totalDebtBase: string;
    availableBorrowsBase: string;
    currentLiquidationThreshold: string;
    ltv: string;
    healthFactor: string;
}

export interface ReserveData {
    symbol: string;
    tokenAddress: string;
    aTokenAddress: string;
    stableDebtTokenAddress: string;
    variableDebtTokenAddress: string;
    currentATokenBalance: string;
    currentStableDebt: string;
    currentVariableDebt: string;
    usageAsCollateralEnabled: boolean;
    priceInUSD: string;
    decimals: number;
}

export interface AaveUserData {
    accountData: UserAccountData;
    // reserves: ReserveData[];
    network: string;
    userAddress: string;
}

export class AaveV3Service {
    private provider: ethers.JsonRpcProvider;
    private poolContract: ethers.Contract;
    private dataProviderContract: ethers.Contract;
    private oracleContract: ethers.Contract;
    private networkConfig: NetworkConfig;

    constructor(network: string) {
        if (!NETWORKS[network]) {
            throw new AppError(
                `Unsupported network: ${network}`,
                "UNSUPPORTED_NETWORK"
            );
        }

        this.networkConfig = NETWORKS[network];

        try {
            this.provider = new ethers.JsonRpcProvider(
                this.networkConfig.rpcUrl
            );

            this.poolContract = new ethers.Contract(
                this.networkConfig.pool,
                POOL_ABI,
                this.provider
            );

            this.dataProviderContract = new ethers.Contract(
                this.networkConfig.aaveProtocolDataProvider,
                AAVE_PROTOCOL_DATA_PROVIDER_ABI,
                this.provider
            );

            this.oracleContract = new ethers.Contract(
                this.networkConfig.aaveOracle,
                AAVE_ORACLE_ABI,
                this.provider
            );
        } catch (error) {
            throw handleError(error);
        }
    }

    async getUserAccountData(userAddress: string): Promise<UserAccountData> {
        try {
            const accountData = await this.poolContract.getUserAccountData(
                userAddress
            );

            return {
                totalCollateralBase: ethers.formatUnits(
                    accountData.totalCollateralBase,
                    8
                ),
                totalDebtBase: ethers.formatUnits(accountData.totalDebtBase, 8),
                availableBorrowsBase: ethers.formatUnits(
                    accountData.availableBorrowsBase,
                    8
                ),
                currentLiquidationThreshold: ethers.formatUnits(
                    accountData.currentLiquidationThreshold,
                    2
                ),
                ltv: ethers.formatUnits(accountData.ltv, 2),
                healthFactor:
                    accountData.healthFactor.toString() ===
                    ethers.MaxUint256.toString()
                        ? "∞"
                        : ethers.formatUnits(accountData.healthFactor, 18),
            };
        } catch (error) {
            throw handleError(error);
        }
    }

    async getAllReservesTokens() {
        try {
            return await this.dataProviderContract.getAllReservesTokens();
        } catch (error) {
            console.error("Error fetching reserves tokens:", error);
            throw new Error("Failed to fetch reserves tokens");
        }
    }

    async getUserReserveData(asset: string, userAddress: string) {
        try {
            return await this.dataProviderContract.getUserReserveData(
                asset,
                userAddress
            );
        } catch (error) {
            console.error("Error fetching user reserve data:", error);
            throw new Error("Failed to fetch user reserve data");
        }
    }

    async getReserveTokensAddresses(asset: string) {
        try {
            return await this.dataProviderContract.getReserveTokensAddresses(
                asset
            );
        } catch (error) {
            console.error("Error fetching reserve token addresses:", error);
            throw new Error("Failed to fetch reserve token addresses");
        }
    }

    async getAssetPrice(asset: string): Promise<string> {
        try {
            const price = await this.oracleContract.getAssetPrice(asset);
            return ethers.formatUnits(price, 8);
        } catch (error) {
            console.error("Error fetching asset price:", error);
            throw new Error("Failed to fetch asset price");
        }
    }

    async getTokenInfo(
        tokenAddress: string
    ): Promise<{ symbol: string; decimals: number }> {
        try {
            const tokenContract = new ethers.Contract(
                tokenAddress,
                ERC20_ABI,
                this.provider
            );
            const [symbol, decimals] = await Promise.all([
                tokenContract.symbol(),
                tokenContract.decimals(),
            ]);
            return { symbol, decimals };
        } catch (error) {
            console.error("Error fetching token info:", error);
            return { symbol: "Unknown", decimals: 18 };
        }
    }

    async getUserAaveData(userAddress: string): Promise<AaveUserData> {
        try {
            // Validate Ethereum address
            if (!ethers.isAddress(userAddress)) {
                throw new AppError(
                    "Invalid Ethereum address format",
                    "INVALID_ADDRESS"
                );
            }

            // Get account data and all reserves in parallel
            // const [accountData, reservesTokens] = await Promise.all([
            //     this.getUserAccountData(userAddress),
            //     this.getAllReservesTokens(),
            // ]);

            // // Process each reserve
            // const reservePromises = reservesTokens.map(async (reserve: any) => {
            //     const { symbol, tokenAddress } = reserve;

            //     try {
            //         // Get user reserve data, token addresses, and price in parallel
            //         const [
            //             userReserveData,
            //             tokenAddresses,
            //             tokenInfo,
            //             priceInUSD,
            //         ] = await Promise.all([
            //             this.getUserReserveData(tokenAddress, userAddress),
            //             this.getReserveTokensAddresses(tokenAddress),
            //             this.getTokenInfo(tokenAddress),
            //             this.getAssetPrice(tokenAddress),
            //         ]);

            //         const {
            //             currentATokenBalance,
            //             currentStableDebt,
            //             currentVariableDebt,
            //             usageAsCollateralEnabled,
            //         } = userReserveData;

            //         const {
            //             aTokenAddress,
            //             stableDebtTokenAddress,
            //             variableDebtTokenAddress,
            //         } = tokenAddresses;

            //         return {
            //             symbol: symbol || tokenInfo.symbol,
            //             tokenAddress,
            //             aTokenAddress,
            //             stableDebtTokenAddress,
            //             variableDebtTokenAddress,
            //             currentATokenBalance: ethers.formatUnits(
            //                 currentATokenBalance,
            //                 tokenInfo.decimals
            //             ),
            //             currentStableDebt: ethers.formatUnits(
            //                 currentStableDebt,
            //                 tokenInfo.decimals
            //             ),
            //             currentVariableDebt: ethers.formatUnits(
            //                 currentVariableDebt,
            //                 tokenInfo.decimals
            //             ),
            //             usageAsCollateralEnabled,
            //             priceInUSD,
            //             decimals: tokenInfo.decimals,
            //         } as ReserveData;
            //     } catch (error) {
            //         console.error(`Error processing reserve ${symbol}:`, error);
            //         return null;
            //     }
            // });

            // const reserves = (await Promise.all(reservePromises))
            //     .filter((reserve): reserve is ReserveData => reserve !== null)
            //     .filter(
            //         (reserve) =>
            //             parseFloat(reserve.currentATokenBalance ?? "0") > 0 ||
            //             parseFloat(reserve.currentStableDebt ?? "0") > 0 ||
            //             parseFloat(reserve.currentVariableDebt ?? "0") > 0
            //     );

            const [accountData] = await Promise.all([
                this.getUserAccountData(userAddress),
            ]);
            
            return {
                accountData,
                // reserves,
                network: this.networkConfig.name,
                userAddress,
            };
        } catch (error) {
            throw handleError(error);
        }
    }
}
