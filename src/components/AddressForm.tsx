"use client";

import { useState } from "react";
import { AaveV3Service, AaveUserData } from "../lib/aave";
import { SUPPORTED_NETWORKS } from "../lib/config";

interface Props {
    onData: (data: AaveUserData | null) => void;
    onLoading: (loading: boolean) => void;
    onError: (error: string | null) => void;
}

export default function AddressForm({ onData, onLoading, onError }: Props) {
    const [address, setAddress] = useState("");
    const [selectedNetwork, setSelectedNetwork] = useState("arbitrum");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!address.trim()) {
            onError("Please enter an Ethereum address");
            return;
        }

        onLoading(true);
        onError(null);
        onData(null);

        try {
            const aaveService = new AaveV3Service(selectedNetwork);
            const userData = await aaveService.getUserAaveData(address.trim());
            onData(userData);
        } catch (error) {
            console.error("Error fetching data:", error);
            onError(
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred"
            );
        } finally {
            onLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Aave V3 Position Tracker
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="network"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Select Network
                    </label>
                    <select
                        id="network"
                        value={selectedNetwork}
                        onChange={(e) => setSelectedNetwork(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        {SUPPORTED_NETWORKS.map((network) => (
                            <option key={network} value={network}>
                                {network.charAt(0).toUpperCase() +
                                    network.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Ethereum Address
                    </label>
                    <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="0x..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    Get Aave Position
                </button>
            </form>
        </div>
    );
}
