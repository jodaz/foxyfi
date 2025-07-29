"use client";

import { useState } from "react";
import { AaveUserData } from "../lib/aave";
import AddressForm from "../components/AddressForm";
import UserDataDisplay from "../components/UserDataDisplay";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorDisplay from "../components/ErrorDisplay";

export default function Home() {
    const [userData, setUserData] = useState<AaveUserData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRetry = () => {
        setError(null);
        setUserData(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Aave V3 Position Tracker
                    </h1>
                    <p className="text-gray-600">
                        Track your Aave V3 positions across Arbitrum and
                        Avalanche networks
                    </p>
                </div>

                <div className="space-y-6">
                    <AddressForm
                        onData={setUserData}
                        onLoading={setLoading}
                        onError={setError}
                    />

                    {loading && <LoadingSpinner />}

                    {error && (
                        <ErrorDisplay error={error} onRetry={handleRetry} />
                    )}

                    {userData && !loading && !error && (
                        <UserDataDisplay data={userData} />
                    )}
                </div>

                <footer className="mt-12 text-center text-sm text-gray-500">
                    <p>
                        Built with Next.js and Ethers.js • Data from Aave V3
                        Protocol
                    </p>
                    <p className="mt-1">
                        Supports Arbitrum and Avalanche networks
                    </p>
                </footer>
            </div>
        </div>
    );
}
