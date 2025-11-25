import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AccountSummaryProps {
  address: string;
  network: string;
  totalCollateral: number;
  totalDebt: number;
  healthFactor: number;
  availableToBorrow: number;
  loanToValue: number;
}

const formatAddress = (address: string) => {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const getHealthFactorColor = (healthFactor: number) => {
  if (healthFactor >= 2) return "success";
  if (healthFactor >= 1.5) return "warning";
  return "destructive";
};

const getHealthFactorLabel = (healthFactor: number) => {
  if (healthFactor >= 2) return "Healthy";
  if (healthFactor >= 1.5) return "Moderate";
  return "At Risk";
};

export const AccountSummary = ({
  address,
  network,
  totalCollateral,
  totalDebt,
  healthFactor,
  availableToBorrow,
  loanToValue,
}: AccountSummaryProps) => {
  const healthColor = getHealthFactorColor(healthFactor);
  const healthLabel = getHealthFactorLabel(healthFactor);

  return (
    <Card className="p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-[box-shadow] duration-300 bg-gradient-to-b from-card to-background border-border/50">
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">
              Account Summary - {network}
            </h2>
            <p className="text-sm text-muted-foreground font-mono">
              Address: {formatAddress(address)}
              <span className="text-xs ml-1">({address})</span>
            </p>
          </div>
          <Badge
            variant={healthColor === "success" ? "default" : "destructive"}
            className={
              healthColor === "success"
                ? "bg-success text-success-foreground"
                : healthColor === "warning"
                ? "bg-warning text-warning-foreground"
                : ""
            }
          >
            {healthLabel}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Collateral</p>
            <p className="text-3xl font-bold text-foreground font-mono">
              {formatCurrency(totalCollateral)}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Debt</p>
            <p className="text-3xl font-bold text-foreground font-mono">
              {formatCurrency(totalDebt)}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Health Factor</p>
            <p
              className={`text-3xl font-bold font-mono ${
                healthColor === "success"
                  ? "text-success"
                  : healthColor === "warning"
                  ? "text-warning"
                  : "text-destructive"
              }`}
            >
              {healthFactor.toFixed(2)}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Available to Borrow</p>
            <p className="text-3xl font-bold text-foreground font-mono">
              {formatCurrency(availableToBorrow)}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Loan to Value</span>
            <span className="text-lg font-semibold text-foreground font-mono">
              {loanToValue.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
