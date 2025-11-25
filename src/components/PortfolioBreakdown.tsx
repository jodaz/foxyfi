import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface AssetData {
  name: string;
  value: number;
  color: string;
}

interface PortfolioBreakdownProps {
  assets: AssetData[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="font-semibold text-foreground">{data.name}</p>
        <p className="text-sm text-muted-foreground">
          {formatCurrency(data.value)}
        </p>
        <p className="text-sm text-primary font-medium">
          {data.payload.percentage}%
        </p>
      </div>
    );
  }
  return null;
};

const renderLegend = (props: any) => {
  const { payload } = props;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
      {payload.map((entry: any, index: number) => (
        <div
          key={`legend-${index}`}
          className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="font-medium text-foreground text-sm">
              {entry.value}
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-foreground">
              {formatCurrency(entry.payload.value)}
            </p>
            <p className="text-xs text-muted-foreground">
              {entry.payload.percentage}%
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

/* For fixing
this component should reserve the reserves
*/
export const PortfolioBreakdown = ({ assets }: PortfolioBreakdownProps) => {
  const total = assets.reduce((sum, asset) => sum + asset.value, 0);
  
  const dataWithPercentages = assets.map(asset => ({
    ...asset,
    percentage: ((asset.value / total) * 100).toFixed(2),
  }));

  // 
  // const retrievePositionAssets = () =>
  //   // @ts-ignore
  //   positionData?.reserves.map((reserve) => ({
  //     name: reserve.symbol,
  //     value:
  //       parseFloat(reserve.currentATokenBalance) *
  //       parseFloat(reserve.priceInUSD),
  //     color: `hsl(${Math.random() * 360}, 70%, 50%)`, // Generate random color for now
  //   })) || [];

  return (
    <Card className="p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-[box-shadow] duration-300 bg-gradient-to-b from-card to-background border-border/50">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">
            Portfolio Breakdown
          </h2>
          <p className="text-sm text-muted-foreground">
            Total Value: <span className="font-semibold text-foreground font-mono">{formatCurrency(total)}</span>
          </p>
        </div>

        <div className="w-full">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dataWithPercentages}
                cx="50%"
                cy="50%"
                labelLine={false}
                // @ts-ignore
                label={({ percentage }) => `${percentage}%`}
                outerRadius={100}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {dataWithPercentages.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={renderLegend} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
