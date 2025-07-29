"use client";

export default function LoadingSpinner() {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="text-gray-600">Fetching Aave data...</span>
            </div>
            <div className="mt-4 text-sm text-gray-500 text-center">
                This may take a few seconds as we query the blockchain...
            </div>
        </div>
    );
}
