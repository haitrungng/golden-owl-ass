'use client';

import * as React from 'react';
import { LabelList, Pie, PieChart } from 'recharts';

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
import { ScoreDistribution } from '@/types/score-distribution';
import { Subject } from '@/types/search-score';
import { DropdownMenuSubjects } from '@/app/reports/page';

type ScorePieProps = {
  stats: ScoreDistribution | null;
  error: string | null;
  subjectsForPie: Subject[];
  setSubjectForPie: React.Dispatch<React.SetStateAction<Subject[]>>;

  title?: string;
  description?: string;
};

// ---- Cấu hình màu cho từng nhóm (shadcn) ----
const chartConfig = {
  count: { label: '% thí sinh' },
  gte8: { label: '≥ 8.00', color: 'var(--chart-1)' },
  gte6lt8: { label: '6.00 - < 8', color: 'var(--chart-2)' },
  gte4lt6: { label: '4.00 - < 6', color: 'var(--chart-3)' },
  lt4: { label: '< 4.00', color: 'var(--chart-4)' },
} satisfies ChartConfig;

// ---- Component chính ----
export function ScoreDistributionPie({
  error,
  stats,
  subjectsForPie,
  setSubjectForPie,
  title = 'Phổ điểm',
  description = 'Phân bố thí sinh theo nhóm điểm',
}: ScorePieProps) {
  if (!stats) {
    return (
      <Card className='flex flex-col min-w-md'>
        <CardHeader className='items-center pb-0'>
          <CardTitle>
            <div className='flex items-center justify-between'>
              <p>{title}</p>
            </div>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className='flex-1 pb-0'>
          <p className='text-center'>Loading score distribution...</p>
        </CardContent>
      </Card>
    );
  }
  const { counts, totalWithScore } = stats;

  const chartData = [
    {
      key: 'gte8',
      band: '≥ 8.00',
      count: counts.gte8,
      fill: 'var(--color-gte8)',
      total: totalWithScore,
    },
    {
      key: 'gte6lt8',
      band: '6.00 < 8',
      count: counts.gte6lt8,
      fill: 'var(--color-gte6lt8)',
      total: totalWithScore,
    },
    {
      key: 'gte4lt6',
      band: '4.00 < 6',
      count: counts.gte4lt6,
      fill: 'var(--color-gte4lt6)',
      total: totalWithScore,
    },
    {
      key: 'lt4',
      band: '< 4.00',
      count: counts.lt4,
      fill: 'var(--color-lt4)',
      total: totalWithScore,
    },
  ];

  return (
    <Card className='flex flex-col min-w-md'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>
          <div className='flex items-center justify-between'>
            <p>{title}</p>
            <DropdownMenuSubjects
              subjects={subjectsForPie}
              setSubjects={setSubjectForPie}
              idx={0}
            />
          </div>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className='flex-1 pb-0'>
        {error ? (
          <p className='text-center text-red-500'>Error: {error}</p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className='[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[260px]'
          >
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    nameKey='count'
                    formatter={(value) => {
                      // value ở đây chính là "count" (ví dụ: 198392)
                      const percentage =
                        ((value as number) / totalWithScore) * 100;
                      // Trả về chuỗi đã định dạng
                      return `${percentage.toFixed(2)}%`;
                    }}
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey='count'
                nameKey='band'
                innerRadius={20}
                outerRadius={100}
                stroke='none'
                isAnimationActive
              >
                {/* nhãn lát bánh: chỉ hiện tên nhóm cho gọn, % hiển thị ở tooltip */}
                <LabelList
                  dataKey='band'
                  className='fill-background'
                  fontSize={12}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 leading-none font-medium'>
          Tổng thí sinh có điểm: {totalWithScore.toLocaleString()}
        </div>
      </CardFooter>
    </Card>
  );
}
