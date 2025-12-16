"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, Cell } from "recharts";
import { DateRange } from "react-day-picker";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays } from "date-fns";
import { ar } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Generate dummy data based on start date
const generateChartData = (startDate: Date) => {
  return Array.from({ length: 7 }).map((_, i) => {
    const currentDate = addDays(startDate, i);
    // Deterministic pseudo-random amount for demo stability based on date
    const daySeed = currentDate.getDate() + currentDate.getMonth();
    const amounts = [50, 150, 100, 200, 120, 180, 50, 90, 160, 130];
    const amount = amounts[daySeed % amounts.length];

    let fill = "var(--color-primary-green-600)";
    let bgFill = "var(--color-primary-green-50)";

    if (amount < 100) {
      fill = "var(--color-danger-600)";
      bgFill = "var(--color-danger-50)";
    } else if (amount < 150) {
      fill = "var(--color-warning-600)";
      bgFill = "var(--color-warning-50)";
    }

    return {
      day: format(currentDate, "d MMMM", { locale: ar }), // Format: 1 ديسمبر
      originalDate: currentDate,
      amount,
      fill,
      bgFill,
    };
  });
};

export function WalletPageClient() {
  // Calendar State - restricted to 7 days visually for now
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(2025, 11, 1), // Dec 1, 2025
    to: new Date(2025, 11, 7), // Dec 7, 2025
  });

  const chartData = React.useMemo(() => {
    if (dateRange?.from) {
      return generateChartData(dateRange.from);
    }
    return [];
  }, [dateRange?.from]);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[264px]">
        {/* Info Cards Column */}
        <div className="flex flex-col gap-4 h-full justify-start">
          {/* Total Balance Card */}
          <Card className="flex flex-col flex-1 justify-center items-center p-6 bg-white shadow-sm border-none relative overflow-hidden">
            {/* Placeholder for Image/Design */}
            <div className="absolute top-0 right-0 w-full h-2 bg-primary"></div>
            <div className="text-center z-10">
              <h3 className="text-lg text-muted-foreground font-medium mb-2">
                الرصيد المستحق
              </h3>
              <div className="text-4xl font-bold text-primary flex items-center justify-center gap-1">
                <span>405</span>
                <span className="sar">$</span>
              </div>
              <p className="text-sm text-info mt-2 cursor-pointer">
                يمكنك طلب سحبه
              </p>
            </div>
          </Card>

          {/* Cumulative Balance Card */}
          <Card className="flex flex-col flex-1 justify-center items-center p-6 bg-primary text-primary-foreground shadow-sm border-none relative overflow-hidden">
            {/* Placeholder for Image/Gradient */}
            <div className="absolute inset-0 bg-blue-gradient opacity-90"></div>
            <div className="text-center z-10 relative">
              <h3 className="text-lg font-medium mb-2 opacity-90">
                الرصيد التراكمي
              </h3>
              <div className="text-4xl font-bold flex items-center justify-center gap-1">
                <span>40555</span>
                <span className="sar">$</span>
              </div>
            </div>
            {/* Place for image */}
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-white/10 rounded-tl-full"></div>
          </Card>
        </div>

        {/* Chart Section */}
        <div className="lg:col-span-2 h-full">
          <Card className="h-full border-none shadow-sm flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-lg font-medium">
                تغييرات رصيدك اليومي
              </CardTitle>
              <div className="relative">
                <WalletDateRangePicker
                  date={dateRange}
                  setDate={setDateRange}
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 ">
              <WalletChart data={chartData} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Table Placeholder */}
      <div className="mt-8">
        <div className="h-64 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400">
          Table Placeholder (سجل السحب / العمليات)
        </div>
      </div>
    </div>
  );
}

const chartConfig = {
  amount: {
    label: "الرصيد",
    color: "var(--color-primary-blue)",
  },
} satisfies ChartConfig;

function WalletChart({ data }: { data: any[] }) {
  return (
    <ChartContainer
      config={chartConfig}
      className="h-52 lg:h-full w-full aspect-auto!"
    >
      <BarChart accessibilityLayer data={data} margin={{ top: 20 }}>
        <CartesianGrid
          vertical={false}
          strokeDasharray="3 3"
          stroke="#e5e7eb"
        />
        <XAxis
          dataKey="day"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar
          dataKey="amount"
          radius={[8, 8, 0, 0]}
          barSize={36}
          background={(props: any) => {
            return (
              <rect
                x={props.x}
                y={props.y}
                width={props.width}
                vertOriginY={0}
                height={"76%"}
                fill={data[props.index]?.bgFill || "#f3f4f6"}
                rx={8}
                ry={8}
                // transform logic to align? If chart area height varies, alignment might shift.
                // Assuming ChartContainer height handles layout properly.
              />
            );
          }}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

export function WalletDateRangePicker({
  date,
  setDate,
}: {
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}) {
  const handleSelect = (range: DateRange | undefined) => {
    // Strictly enforce 7 days from the selected start date
    if (range?.from) {
      const from = range.from;
      const to = addDays(from, 6);
      setDate({ from, to });
    } else {
      setDate(range); // Allow undefined/clearing if implicit
    }
  };

  return (
    <div className={cn("grid gap-2")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className="font-normal text-light-gray border-light-gray! hover:bg-gray-50!"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
