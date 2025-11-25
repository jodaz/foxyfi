"use client";

import { useMutation } from "@tanstack/react-query";
import { AaveUserData } from "@/lib/aave";

interface FetchAaveDataParams {
    address: string;
    network: string;
}

const fetchAaveData = async ({
    address,
    network,
}: FetchAaveDataParams): Promise<AaveUserData & { totalCollateral: number }> => {
    const response = await fetch("/api/position", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ address, network }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch Aave data");
    }

    return response.json();
};

export const useAaveDataMutation = (options: any) => {
    return useMutation({
        mutationFn: fetchAaveData,
        ...options,
    });
};
