"use client";

import { Pie, PieChart } from "recharts";
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

interface PieChartLabeledProps {
  title: string;
  description: string;
  data: { name: string; value: number; color?: string }[]; // Color is optional
  footer1: React.ReactNode; // Footer line 1
  footer2: React.ReactNode; // Footer line 2
  className?: string;
}

export function PieChartLabeled({
  title,
  description,
  data,
  footer1,
  footer2,
  className,
}: PieChartLabeledProps) {
  // Limit the data to the first 5 entries and assign default black color if not provided
  const chartData = data.slice(0, 5).map((item) => ({
    ...item,
    fill: item.color || "var(--color-black)", // Default to black if color is not provided
  }));

  // Generate chartConfig
  const chartConfig: ChartConfig = chartData.reduce((config, item) => {
    config[item.name] = {
      label: item.name,
      color: item.color || "hsl(var(--color-black))",
    };
    return config;
  }, {} as ChartConfig);

  return (
    <Card className={cn("flex flex-col p-3", className)}>
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="value"
              label
              nameKey="name"
              outerRadius={100}
              fill="#000000" // Default black fill for slices
            />
          </PieChart>
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
