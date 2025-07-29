"use client";

import { AaveUserData } from "../lib/aave";
import {
    formatCurrency,
    formatNumber,
    getHealthFactorColor,
    getHealthFactorStatus,
    calculateUSDValue,
    formatAddress,
} from "../lib/utils";

interface Props {
    data: AaveUserData;
}

export default function UserDataDisplay({ data }: Props) {
    const totalCollateralUSD = parseFloat(data.accountData.totalCollateralBase);
    const totalDebtUSD = parseFloat(data.accountData.totalDebtBase);

    return (
        <div className="space-y-6">
            {/* Account Summary */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Account Summary - {data.network}
                </h2>
                <div className="text-sm text-gray-600 mb-4">
                    Address:{" "}
                    <span className="font-mono">
                        {formatAddress(data.userAddress)}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                        ({data.userAddress})
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-green-800 mb-1">
                            Total Collateral
                        </h3>
                        <p className="text-2xl font-bold text-green-600">
                            {formatCurrency(
                                data.accountData.totalCollateralBase
                            )}
                        </p>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-red-800 mb-1">
                            Total Debt
                        </h3>
                        <p className="text-2xl font-bold text-red-600">
                            {formatCurrency(data.accountData.totalDebtBase)}
                        </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-blue-800 mb-1">
                            Health Factor
                        </h3>
                        <p
                            className={`text-2xl font-bold ${getHealthFactorColor(
                                data.accountData.healthFactor
                            )}`}
                        >
                            {data.accountData.healthFactor === "∞"
                                ? "∞"
                                : parseFloat(
                                      data.accountData.healthFactor
                                  ).toFixed(2)}
                        </p>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="font-medium">
                            Available to Borrow:
                        </span>{" "}
                        {formatCurrency(data.accountData.availableBorrowsBase)}
                    </div>
                    <div>
                        <span className="font-medium">Loan to Value:</span>{" "}
                        {parseFloat(data.accountData.ltv).toFixed(2)}%
                    </div>
                </div>
            </div>

            {/* Assets Table */}
            {data.reserves.some(
                (r) => parseFloat(r.currentATokenBalance) > 0
            ) && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
                        Assets (aTokens)
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                                        Asset
                                    </th>
                                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                                        Balance
                                    </th>
                                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                                        Price (USD)
                                    </th>
                                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                                        Value (USD)
                                    </th>
                                    <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">
                                        Collateral
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.reserves
                                    .filter(
                                        (reserve) =>
                                            parseFloat(
                                                reserve.currentATokenBalance
                                            ) > 0
                                    )
                                    .map((reserve, index) => (
                                        <tr
                                            key={index}
                                            className="border-t border-gray-200"
                                        >
                                            <td className="px-4 py-2 text-sm font-medium text-gray-900">
                                                {reserve.symbol}
                                            </td>
                                            <td className="px-4 py-2 text-sm text-gray-900 text-right">
                                                {formatNumber(
                                                    reserve.currentATokenBalance
                                                )}
                                            </td>
                                            <td className="px-4 py-2 text-sm text-gray-900 text-right">
                                                {formatCurrency(
                                                    reserve.priceInUSD
                                                )}
                                            </td>
                                            <td className="px-4 py-2 text-sm text-gray-900 text-right font-medium">
                                                {formatCurrency(
                                                    calculateUSDValue(
                                                        reserve.currentATokenBalance,
                                                        reserve.priceInUSD
                                                    ).toString()
                                                )}
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${
                                                        reserve.usageAsCollateralEnabled
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-gray-100 text-gray-800"
                                                    }`}
                                                >
                                                    {reserve.usageAsCollateralEnabled
                                                        ? "Yes"
                                                        : "No"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Debts Table */}
            {data.reserves.some(
                (r) =>
                    parseFloat(r.currentVariableDebt) > 0 ||
                    parseFloat(r.currentStableDebt) > 0
            ) && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
                        Debts
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                                        Asset
                                    </th>
                                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                                        Variable Debt
                                    </th>
                                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                                        Stable Debt
                                    </th>
                                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                                        Price (USD)
                                    </th>
                                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                                        Total Value (USD)
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.reserves
                                    .filter(
                                        (reserve) =>
                                            parseFloat(
                                                reserve.currentVariableDebt
                                            ) > 0 ||
                                            parseFloat(
                                                reserve.currentStableDebt
                                            ) > 0
                                    )
                                    .map((reserve, index) => {
                                        const totalDebt =
                                            parseFloat(
                                                reserve.currentVariableDebt
                                            ) +
                                            parseFloat(
                                                reserve.currentStableDebt
                                            );
                                        const totalDebtUSD =
                                            totalDebt *
                                            parseFloat(reserve.priceInUSD);

                                        return (
                                            <tr
                                                key={index}
                                                className="border-t border-gray-200"
                                            >
                                                <td className="px-4 py-2 text-sm font-medium text-gray-900">
                                                    {reserve.symbol}
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-900 text-right">
                                                    {formatNumber(
                                                        reserve.currentVariableDebt
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-900 text-right">
                                                    {formatNumber(
                                                        reserve.currentStableDebt
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-900 text-right">
                                                    {formatCurrency(
                                                        reserve.priceInUSD
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-900 text-right font-medium">
                                                    {formatCurrency(
                                                        totalDebtUSD.toString()
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* No positions message */}
            {data.reserves.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <p className="text-yellow-800">
                        No active positions found for this address on{" "}
                        {data.network}.
                    </p>
                </div>
            )}
        </div>
    );
}
