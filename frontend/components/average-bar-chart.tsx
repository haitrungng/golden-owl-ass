'use client';

import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { formatSubjectName } from '@/lib/utils';
import type { Subject } from '@/types/search-score';

// ---- Types ----
export type AverageStats = {
  averages: Array<{
    subject: Subject | string;
    average: number;
    totalStudents: number;
  }>;
};

type AverageBarChartProps = {
  stats: AverageStats;
  title?: string;
  description?: string;
  /** sort theo average giảm dần (mặc định: true) */
  sortDesc?: boolean;
  /** className thêm cho ChartContainer (vd: đổi chiều cao) */
  containerClassName?: string;
};

const chartConfig = {
  average: {
    label: 'Điểm trung bình',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export function AverageBarChart({
  stats,
  title = 'Điểm trung bình theo môn',
  description = 'Dữ liệu tổng hợp điểm trung bình toàn quốc',
  sortDesc = false,
  containerClassName = 'min-h-[260px] w-full',
}: AverageBarChartProps) {
  const chartData = useMemo(() => {
    const rows =
      stats?.averages?.map(({ subject, average, totalStudents }) => ({
        label: formatSubjectName(subject as Subject) ?? String(subject),
        average: Math.round(average * 100) / 100,
        totalStudents,
      })) ?? [];

    if (sortDesc) rows.sort((a, b) => b.average - a.average);
    return rows;
  }, [stats, sortDesc]);

  const isEmpty = chartData.length === 0;

  return (
    <Card className='max-w-4xl'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className={containerClassName}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='label'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey='average'
              fill='var(--color-average)'
              radius={8}
              name='Điểm TB'
              isAnimationActive={!isEmpty}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='text-muted-foreground leading-none'>
          Hiển thị điểm trung bình theo từng môn
        </div>
      </CardFooter>
    </Card>
  );
}
