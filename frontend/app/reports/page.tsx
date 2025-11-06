'use client';
import { ScoreDistributionPie } from '@/components/score-pie-chart';
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
import { ScoreDistribution } from '@/types/score-distribution';
import { Subject, SUBJECTS } from '@/types/search-score';
import { TopScores } from '@/types/top-scores';
import React, { useEffect, useState } from 'react';

const DetailPage = () => {
  const [topScores, setTopScores] = useState<TopScores | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([
    'toan',
    'vat_li',
    'hoa_hoc',
  ]);
  const [fetchTopError, setFetchTopError] = useState<string | null>(null);
  const [subjectForPie, setSubjectForPie] = useState<Subject[]>(['toan']);
  const [scoreDistribution, setScoreDistribution] =
    useState<ScoreDistribution | null>(null);
  const [fetchPieError, setFetchPieError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setFetchTopError(null);
      setTopScores(null);

      try {
        const response = await fetch(
          API_ENDPOINTS.SEARCH_TOP_SCORES_SUBJECTS(subjects)
        );
        if (!response.ok) {
          throw new Error('Failed to fetch summary stats');
        }
        const data: TopScores = await response.json();
        setTopScores(data);
        console.log('Top scores for block', subjects, data);
      } catch (error) {
        console.error('Error fetching top scores:', error);
        setFetchTopError('Lấy danh sách điểm cao gặp lỗi. Vui lòng thử lại.');
      }
    }
    function isDuplicateSubjects(subjects: Subject[]) {
      const uniqueSubjects = Array.from(new Set(subjects));
      if (uniqueSubjects.length < 3) {
        setFetchTopError('Vui lòng chọn 3 môn khác nhau');
        setTopScores(null);
        return true;
      }
      return false;
    }
    if (!isDuplicateSubjects(subjects)) fetchData();
  }, [subjects]);

  useEffect(() => {
    async function fetchData() {
      setFetchPieError(null);
      try {
        const response = await fetch(
          API_ENDPOINTS.SEARCH_REPORT(subjectForPie[0])
        );
        if (!response.ok) {
          throw new Error('Failed to fetch summary stats');
        }
        const data: ScoreDistribution = await response.json();
        setScoreDistribution(data);
      } catch (error) {
        console.error('Error fetching top scores:', error);
        setFetchPieError('Lấy phổ điểm gặp lỗi. Vui lòng thử lại.');
      }
    }
    fetchData();
  }, [subjectForPie]);

  return (
    <div className='flex gap-10 w-full flex-col md:flex-row lg:items-start items-center  justify-center'>
      <Card>
        <CardHeader className='text-center text-xl font-bold'>
          Tìm kiếm top 10 theo từng khối
        </CardHeader>
        {topScores ? (
          <div className='px-0 md:px-6'>
            {topScores.top.length > 0 ? (
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
              <p className='text-center my-4'>Không có dữ liệu cho khối này</p>
            )}
          </div>
        ) : fetchTopError ? (
          <p className='text-red-500 mt-2 text-center'>{fetchTopError}</p>
        ) : (
          <p className='text-center'>Loading top scores...</p>
        )}

        <CardFooter className='flex justify-center gap-4'>
          <DropdownMenuSubjects
            subjects={subjects}
            setSubjects={setSubjects}
            idx={0}
          />
          <DropdownMenuSubjects
            subjects={subjects}
            setSubjects={setSubjects}
            idx={1}
          />
          <DropdownMenuSubjects
            subjects={subjects}
            setSubjects={setSubjects}
            idx={2}
          />
        </CardFooter>
      </Card>

      <ScoreDistributionPie
        error={fetchPieError}
        stats={scoreDistribution}
        subjectsForPie={subjectForPie}
        setSubjectForPie={setSubjectForPie}
      />
    </div>
  );
};

export function DropdownMenuSubjects({
  subjects,
  setSubjects,
  idx,
}: {
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
  idx: number;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className=''>
        <Button variant='outline'>{formatSubjectName(subjects[idx])}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-fit px-4 py-2 bg-white '>
        <DropdownMenuRadioGroup
          value={subjects[idx]}
          onValueChange={(value) => {
            setSubjects((prev) => {
              const newSubjects = [...prev];
              newSubjects[idx] = value as Subject;
              return newSubjects;
            });
          }}
        >
          {SUBJECTS.map((subject) => (
            <DropdownMenuRadioItem key={subject} value={subject}>
              {formatSubjectName(subject)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DetailPage;
