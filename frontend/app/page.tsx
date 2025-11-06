'use client';
import { AverageBarChart, AverageStats } from '@/components/average-bar-chart';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { API_ENDPOINTS } from '@/lib/http-path';
import { formatSubjectName } from '@/lib/utils';
import { TopScores } from '@/types/top-scores';
import { useEffect, useState } from 'react';

export default function Home() {
  const [averageStats, setAverageStats] = useState<AverageStats | null>(null);
  const [totalCandidates, setTotalCandidates] = useState<number | null>(null);
  const [errorFetchAve, setErrorFetchAve] = useState<string | null>(null);
  const [khoi, setKhoi] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [topScores, setTopScores] = useState<TopScores | null>(null);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(API_ENDPOINTS.SEARCH_SUMMARY);
        if (!response.ok) {
          throw new Error('Failed to fetch summary stats');
        }
        const data: {
          average: AverageStats;
          totalCandidates: { totalWithAnyScore: number };
        } = await response.json();
        setAverageStats(data.average);
        setTotalCandidates(data.totalCandidates.totalWithAnyScore);
      } catch (error) {
        console.error('Error fetching summary stats:', error);
        setErrorFetchAve(
          error instanceof Error ? error.message : String(error)
        );
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(API_ENDPOINTS.SEARCH_TOP_SCORES(khoi));
        if (!response.ok) {
          throw new Error('Failed to fetch summary stats');
        }
        const data: TopScores = await response.json();
        setTopScores(data);
        console.log('Top scores for block', khoi, data);
      } catch (error) {
        console.error('Error fetching top scores:', error);
      }
    }
    fetchData();
  }, [khoi]);

  return (
    <div className='w-full '>
      <div>
        <Card>
          <CardHeader>
            <h3 className='text-lg font-semibold'>Giới thiệu</h3>
            <p>
              Ứng dụng này cho phép bạn tra cứu điểm số kỳ thi tuyển sinh đại
              học tại Việt Nam. Bạn có thể nhập số báo danh của mình để xem điểm
              số từng môn, cũng như thống kê điểm trung bình theo môn và tổng số
              thí sinh đã tham gia kỳ thi.
            </p>
          </CardHeader>
        </Card>
      </div>

      {/* SUMMARY */}
      <div className='flex flex-col md:flex-row justify-center gap-6 pt-10'>
        <div className='flex-1'>
          {averageStats ? (
            <AverageBarChart stats={averageStats} />
          ) : (
            <p>Loading summary statistics...</p>
          )}
          {errorFetchAve && <p>Error: {errorFetchAve}</p>}
        </div>

        <Card className='flex items-center justify-center'>
          <div>
            <h3 className='text-lg font-semibold text-center'>
              Top 10{' '}
              {topScores?.subjects
                .map((subject) => formatSubjectName(subject))
                .join(' - ')}
            </h3>
          </div>
          {topScores ? (
            <table className='w-full table-auto border-collapse px-auto'>
              <thead>
                <tr>
                  <th className='sticky top-0 z-10 bg-background border md:px-4 px-2 py-2 text-xs md:text-sm'>
                    SBD
                  </th>
                  {topScores.subjects.map((subject) => (
                    <th
                      key={subject}
                      className='sticky top-0 z-10 bg-background border  md:px-4 px-2 py-2 whitespace-nowrap text-xs md:text-sm'
                    >
                      {formatSubjectName(subject)}
                    </th>
                  ))}
                  <th className='sticky top-0 z-10 bg-background border md:px-4 px-2 py-2 text-xs md:text-sm'>
                    Tổng
                  </th>
                </tr>
              </thead>
              {/* <div className='max-h-80 overflow-y-scroll'> */}
              <tbody>
                {topScores.top.map((candidate) => (
                  <tr key={candidate.sbd}>
                    <td className='border md:px-4 px-2 py-2 text-xs md:text-sm'>
                      {candidate.sbd}
                    </td>
                    {topScores.subjects.map((subject) => (
                      <td
                        key={subject}
                        className='border md:px-4 px-2 py-2 text-center text-xs md:text-sm'
                      >
                        {candidate.scores[subject]}
                      </td>
                    ))}
                    <td className='border md:px-4 px-2 py-2 text-center text-xs md:text-sm'>
                      {candidate.total}
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* </div> */}
            </table>
          ) : (
            <p>Loading top scores...</p>
          )}
          <CardFooter>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className='ml-auto'>
                <Button variant='outline'>Khối {khoi}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-fit px-4 py-2 bg-white '>
                <DropdownMenuRadioGroup
                  value={khoi}
                  onValueChange={(value) => setKhoi(value as 'A' | 'B' | 'C')}
                >
                  <DropdownMenuRadioItem value='A'>
                    Khối A
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='B'>
                    Khối B
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='C'>
                    Khối C
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='D'>
                    Khối D
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </Card>

        <div className='flex flex-row items-center justify-between gap-5 md:flex-col'>
          <Card className='w-fit p-6'>
            <p className='text-center'>Tổng thí sinh có điểm</p>
            <p className='text-center text-chart-3 font-bold text-5xl'>
              {totalCandidates}
            </p>
            <p className='text-center text-muted-foreground text-sm'>
              Dữ liệu năm 2024
            </p>
          </Card>
          <Card className='w-full p-6'>
            <p className='text-center'>Kiểm tra điểm ngay</p>
            <Button
              className='mt-2'
              onClick={() => {
                window.location.href = '/search-scores';
              }}
            >
              Tra cứu điểm
            </Button>
          </Card>
          <Card className='w-fit p-6'>
            <p className='text-center'>Xem thêm thông tin chi tiết</p>
            <Button
              className='mt-2'
              onClick={() => {
                window.location.href = '/reports';
              }}
            >
              Tin tức điểm chuẩn 2024
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
