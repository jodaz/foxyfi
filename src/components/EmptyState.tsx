import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface EmptyStateProps {
  address: string;
  network: string;
}

export const EmptyState = ({ address, network }: EmptyStateProps) => {
  return (
    <Card className="p-12 shadow-[var(--shadow-card)] border-border/50 bg-gradient-to-b from-card to-background">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            No Active Positions
          </h3>
          <p className="text-muted-foreground max-w-md">
            No active positions found for this address on {network}.
          </p>
          <p className="text-sm text-muted-foreground font-mono pt-2">
            {address}
          </p>
        </div>
      </div>
    </Card>
  );
};
