// components/BarChartHor.tsx

"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

interface ChartDataItem {
  name: string;
  value: number;
  color?: string; // Optional color for each bar
}

interface BarChartHorProps {
  title: string;
  description: string;
  data: ChartDataItem[];
  footer1: string; // First line of footer
  footer2: string; // Second line of footer
  className?: string;
}

const COLOR_VARIABLES = [
  "--color-a",
  "--color-b",
  "--color-c",
  "--color-d",
  "--color-e",
] as const;

export function BarChartHor({
  title,
  description,
  data,
  footer1,
  footer2,
  className,
}: BarChartHorProps) {
  // Sort the data entries by value in descending order
  const sortedDataEntries = React.useMemo(
    () => [...data].sort((a, b) => b.value - a.value),
    [data]
  );

  // Take the top 4 entries
  const topEntries = sortedDataEntries.slice(0, 4);

  // Aggregate the rest into 'Other' if more than 5 entries
  const otherValue = sortedDataEntries
    .slice(4)
    .reduce((acc, curr) => acc + curr.value, 0);

  const finalDataEntries =
    sortedDataEntries.length > 5
      ? topEntries.concat([{ name: "Other", value: otherValue }])
      : sortedDataEntries.slice(0, 5);

  // Assign colors using COLOR_VARIABLES or use provided color
  const chartData = finalDataEntries.map((item, index) => ({
    name: item.name,
    value: item.value,
    fill:
      item.color || `var(${COLOR_VARIABLES[index % COLOR_VARIABLES.length]})`,
  }));

  // Generate chartConfig based on bars data
  const chartConfig: ChartConfig = React.useMemo(() => {
    return chartData.reduce((config, item, index) => {
      config[item.name] = {
        label: item.name,
        color: `hsl(var(--chart-${index + 1}))`,
      };
      return config;
    }, {} as ChartConfig);
  }, [chartData]);

  return (
    <Card className={cn("flex flex-col p-3", className)}>
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto max-h-[300px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <XAxis
                type="number"
                dataKey="value"
                hide
                domain={[0, "dataMax + 50"]}
              />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tickFormatter={(value) =>
                  chartConfig[value as keyof typeof chartConfig]?.label
                }
              />
              <Tooltip
                content={<ChartTooltipContent hideLabel />}
                cursor={false}
              />
              <Bar
                dataKey="value"
                radius={[5, 5, 5, 5]}
                fill="#8884d8" // Default fill; individual bars use their own fill
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none text-muted-foreground">
          {footer1}
        </div>
        <div className="flex items-center gap-2 font-medium leading-none text-muted-foreground">
          {footer2}
        </div>
      </CardFooter>
    </Card>
  );
}
