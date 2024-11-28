// components/DonutChartCenter.tsx

"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

interface ChartDataItem {
  name: string;
  value: number;
  color?: string; // Optional color for each slice
}

interface DonutChartCenterProps {
  title: string;
  description: string;
  data: ChartDataItem[];
  centerValue: number;
  centerLabel: string;
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

export function DonutChartCenter({
  title,
  description,
  data,
  centerValue,
  centerLabel,
  footer1,
  footer2,
  className,
}: DonutChartCenterProps) {
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

  // Generate chartConfig based on slices data
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
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={100}
              strokeWidth={0}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {centerValue.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {centerLabel}
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="fflex items-center gap-2 font-medium leading-none text-muted-foreground">
          {footer1}
        </div>
        <div className="flex items-center gap-2 font-medium leading-none text-muted-foreground">
          {footer2}
        </div>
      </CardFooter>
    </Card>
  );
}
