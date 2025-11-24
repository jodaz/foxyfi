"use client";

import { useMutation } from "@tanstack/react-query";
import { AaveV3Service, AaveUserData } from "@/lib/aave";

interface FetchAaveDataParams {
    address: string;
    network: string;
}

const fetchAaveData = async ({
    address,
    network,
}: FetchAaveDataParams): Promise<AaveUserData> => {
    const aaveService = new AaveV3Service(network);
    const userData = await aaveService.getUserAaveData(address);
    return userData;
};

export const useAaveDataMutation = ({ onSuccess }: { onSuccess?: (data: AaveUserData) => void }) => {
    return useMutation<AaveUserData, Error, FetchAaveDataParams>({
        mutationFn: fetchAaveData,
        onSuccess,
    });
};
