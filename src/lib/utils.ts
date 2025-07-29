import { ethers } from "ethers";

export function formatAddress(address: string): string {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatNumber(
    value: string | number,
    decimals: number = 4
): string {
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return "0";
    if (num === 0) return "0";
    if (num < 0.0001 && num > 0) return "< 0.0001";
    return num.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
    });
}

export function formatCurrency(value: string | number): string {
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return "$0.00";
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num);
}

export function formatPercentage(value: string | number): string {
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return "0%";
    return `${num.toFixed(2)}%`;
}

export function validateEthereumAddress(address: string): boolean {
    return ethers.isAddress(address);
}

export function getHealthFactorColor(healthFactor: string): string {
    if (healthFactor === "∞") return "text-green-600";
    const hf = parseFloat(healthFactor);
    if (isNaN(hf)) return "text-gray-600";
    if (hf >= 2) return "text-green-600";
    if (hf >= 1.5) return "text-yellow-600";
    if (hf >= 1.1) return "text-orange-600";
    return "text-red-600";
}

export function getHealthFactorStatus(healthFactor: string): string {
    if (healthFactor === "∞") return "Excellent";
    const hf = parseFloat(healthFactor);
    if (isNaN(hf)) return "Unknown";
    if (hf >= 2) return "Excellent";
    if (hf >= 1.5) return "Good";
    if (hf >= 1.1) return "Caution";
    return "Liquidation Risk";
}

export function calculateUSDValue(amount: string, priceInUSD: string): number {
    const amountNum = parseFloat(amount);
    const priceNum = parseFloat(priceInUSD);
    if (isNaN(amountNum) || isNaN(priceNum)) return 0;
    return amountNum * priceNum;
}

export class AppError extends Error {
    constructor(message: string, public code?: string, public cause?: Error) {
        super(message);
        this.name = "AppError";
    }
}

export function handleError(error: unknown): AppError {
    if (error instanceof AppError) {
        return error;
    }

    if (error instanceof Error) {
        // Handle specific ethers errors
        if (error.message.includes("invalid address")) {
            return new AppError(
                "Invalid Ethereum address format",
                "INVALID_ADDRESS",
                error
            );
        }

        if (error.message.includes("network")) {
            return new AppError(
                "Network connection error. Please check your internet connection.",
                "NETWORK_ERROR",
                error
            );
        }

        if (error.message.includes("rate limit")) {
            return new AppError(
                "Rate limit exceeded. Please try again in a moment.",
                "RATE_LIMIT",
                error
            );
        }

        if (error.message.includes("timeout")) {
            return new AppError(
                "Request timeout. Please try again.",
                "TIMEOUT",
                error
            );
        }

        return new AppError(error.message, "UNKNOWN_ERROR", error);
    }

    return new AppError("An unexpected error occurred", "UNEXPECTED_ERROR");
}
