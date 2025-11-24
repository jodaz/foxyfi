"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AccountSummary } from "@/components/AccountSummary";
import { EmptyState } from "@/components/EmptyState";
import { PortfolioBreakdown } from "@/components/PortfolioBreakdown";
import { Wallet } from "lucide-react";
import { toast } from "sonner";

const HomeView = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [hasPosition, setHasPosition] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  const mockPositionData = {
    address: "0xBeb18cbbAD4Bb3586018D45c02047a2DD5777EaF",
    network: "Arbitrum One",
    totalCollateral: 420.27,
    totalDebt: 262.84,
    healthFactor: 1.31,
    availableToBorrow: 63.83,
    loanToValue: 77.73,
  };

  const mockPortfolioAssets = [
    { name: "ETH", value: 185.50, color: "hsl(217, 91%, 60%)" },
    { name: "USDC", value: 125.30, color: "hsl(189, 94%, 43%)" },
    { name: "WBTC", value: 68.75, color: "hsl(38, 92%, 50%)" },
    { name: "ARB", value: 28.42, color: "hsl(142, 71%, 45%)" },
    { name: "LINK", value: 12.30, color: "hsl(271, 76%, 53%)" },
  ];

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

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // For demo purposes, show position if address matches mock data
      if (walletAddress.toLowerCase() === mockPositionData.address.toLowerCase()) {
        setHasPosition(true);
        toast.success("Position data retrieved successfully");
      } else {
        setHasPosition(false);
        toast.info("No positions found for this address");
      }
      setIsLoading(false);
    }, 1000);
  };

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
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-primary-foreground font-semibold"
            >
              {isLoading ? "Fetching Position..." : "Get Position"}
            </Button>
          </div>
        </div>

        {/* Results Section */}
        {hasPosition !== null && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            {hasPosition ? (
              <>
                <AccountSummary
                  address={walletAddress}
                  network={mockPositionData.network}
                  totalCollateral={mockPositionData.totalCollateral}
                  totalDebt={mockPositionData.totalDebt}
                  healthFactor={mockPositionData.healthFactor}
                  availableToBorrow={mockPositionData.availableToBorrow}
                  loanToValue={mockPositionData.loanToValue}
                />
                <PortfolioBreakdown assets={mockPortfolioAssets} />
              </>
            ) : (
              <EmptyState
                address={walletAddress}
                network={mockPositionData.network}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeView;
