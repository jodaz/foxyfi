"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AccountSummary } from "@/components/AccountSummary";
import { EmptyState } from "@/components/EmptyState";
import { Wallet } from "lucide-react";
import { toast } from "sonner";
import { useAaveDataMutation } from "@/queries/useAaveData";
import { AaveUserData } from "@/lib/aave";

const HomeView = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [hasPosition, setHasPosition] = useState<boolean | null>(null);

  const {
    mutate: fetchData,
    isPending,
    data
  } = useAaveDataMutation({
    onSuccess: (data: AaveUserData & { totalCollateral: number }) => {
      if (data?.totalCollateral > 0) {
        setHasPosition(true);
        toast.success("Position data retrieved successfully");
      } else {
        setHasPosition(false);
        toast.info("No positions found for this address");
      }
    },
    onError: (error: Error) => {
      setHasPosition(null);
      toast.error(error.message || "An unexpected error occurred");
    },
  });

  const handleGetPosition = () => {
    if (!walletAddress.trim()) {
      toast.error("Please enter a wallet address");
      return;
    }

    // Basic validation for Ethereum address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress.trim())) {
      toast.error("Please enter a valid Ethereum address");
      return;
    }

    // @ts-ignore
    fetchData({ address: walletAddress.trim(), network: "arbitrum" });
  };

  // @ts-ignore
  const positionData = data?.userData ?? null;

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Wallet className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Wallet Token Analyzer
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Analyze your DeFi positions across multiple networks
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-card p-6 rounded-xl shadow-[var(--shadow-card)] border border-border/50">
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="wallet-address"
                className="text-sm font-medium text-foreground"
              >
                Wallet Address
              </label>
              <Input
                id="wallet-address"
                type="text"
                placeholder="0x..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="font-mono h-12 bg-background border-border"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleGetPosition();
                  }
                }}
              />
            </div>
            <Button
              onClick={handleGetPosition}
              disabled={isPending}
              className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-primary-foreground font-semibold"
            >
              {isPending ? "Fetching Position..." : "Get Position"}
            </Button>
          </div>
        </div>

        {/* Results Section */}
        {hasPosition !== null && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            {hasPosition === true && positionData ? (
              <>
                <AccountSummary
                  address={positionData.userAddress}
                  network={positionData.network}
                  // @ts-ignore
                  totalCollateral={data.totalCollateral}
                  totalDebt={parseFloat(
                    positionData.accountData.totalDebtBase
                  )}
                  healthFactor={
                    positionData.accountData.healthFactor === "∞"
                      ? Infinity
                      : parseFloat(positionData.accountData.healthFactor)
                  }
                  availableToBorrow={parseFloat(
                    positionData.accountData.availableBorrowsBase
                  )}
                  loanToValue={parseFloat(positionData.accountData.ltv)}
                />
                {/* <PortfolioBreakdown assets={retrievePositionAssets()} /> */}
              </>
            ) : hasPosition === false ? (
              <EmptyState
                address={walletAddress}
                network={positionData?.network || "arbitrum"}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeView;
