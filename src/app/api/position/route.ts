import { NextResponse } from "next/server";
import { AaveV3Service } from "@/lib/aave";
import { AppError } from "@/lib/utils";

export async function POST(request: Request) {
    try {
        const { address, network } = await request.json();

        if (!address || !network) {
            return NextResponse.json(
                { error: "Address and network are required" },
                { status: 400 }
            );
        }

        const aaveService = new AaveV3Service(network);
        const userData = await aaveService.getUserAaveData(address);
        console.log(userData)
        const totalCollateral = parseFloat(userData.accountData.totalCollateralBase);

        return NextResponse.json({ userData, totalCollateral });
    } catch (error) {
        if (error instanceof AppError) {
            return NextResponse.json(
                { error: error.message, code: error.code },
                { status: 400 }
            );
        }

        console.error("API Error:", error);
        const errorMessage =
            error instanceof Error ? error.message : "An unexpected error occurred";
        return NextResponse.json(
            { error: "Failed to fetch Aave data", details: errorMessage },
            { status: 500 }
        );
    }
}
