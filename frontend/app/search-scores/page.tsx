'use client';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { API_ENDPOINTS } from '@/lib/http-path';
import {
  SearchScoreErrorResponse,
  SearchScoreResponse,
  Subject,
} from '@/types/search-score';
import { formatSubjectName } from '@/lib/utils';
const registrationSchema = z.object({
  regNum: z.string().length(8, 'Registration number must be 8 characters long'),
});

const SearchPage = () => {
  const [score, setScore] = useState<SearchScoreResponse | null>(null);

  const form = useForm<z.infer<typeof registrationSchema>>({
    defaultValues: {
      regNum: '',
    },
    resolver: zodResolver(registrationSchema),
  });

  async function onSubmit(data: z.infer<typeof registrationSchema>) {
    console.log(
      'Searching scores for:',
      API_ENDPOINTS.SEARCH_SCORES(data.regNum)
    );
    try {
      const response = await fetch(API_ENDPOINTS.SEARCH_SCORES(data.regNum), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const responseData: SearchScoreResponse | SearchScoreErrorResponse =
        await response.json();
      if (!response.ok) {
        form.setError('regNum', {
          type: 'server',
          message:
            (responseData as SearchScoreErrorResponse).message ||
            'Failed to fetch scores',
        });
        setScore(null);
        throw new Error(
          (responseData as SearchScoreErrorResponse).message ||
            'Failed to fetch scores'
        );
      }
      setScore(responseData as SearchScoreResponse);
    } catch (error) {
      setScore(null);
      console.error('Error searching scores:', error);
    }
  }

  return (
    <div>
      <div className='px-5 bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm'>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldLegend>Tra điểm số của bạn</FieldLegend>
            <FieldDescription>
              Nhập số báo danh của bạn để tra cứu điểm số.
            </FieldDescription>
            <FieldGroup>
              <Controller
                control={form.control}
                name='regNum'
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Số Báo Danh</FieldLabel>
                    <Input
                      id={field.name}
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete='off'
                      placeholder='XXXXXXXX'
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Button className='mt-4 mx-auto w-1/2' type='submit'>
                Tìm Kiếm
              </Button>
            </FieldGroup>
          </FieldSet>
        </form>
      </div>

      {score && (
        <div className='px-5 bg-card text-card-foreground flex flex-col rounded-xl border py-6 shadow-sm mt-8'>
          <div className='flex flex-col gap-2'>
            <h3 className='text-lg font-semibold text-center pb-4'>
              Kết quả tìm kiếm
            </h3>
            <p>
              Số báo danh: <strong>{score.sbd}</strong>
            </p>
            <p>
              Mã ngoại ngữ: <strong>{score.ma_ngoai_ngu}</strong>
            </p>
          </div>
          <div className='flex justify-between gap-4 pt-4 flex-wrap w-full items-center'>
            {Object.entries(score).map(
              ([subject, mark]) =>
                subject !== 'sbd' &&
                subject !== 'ma_ngoai_ngu' && (
                  <div key={subject} className='flex flex-col  items-center'>
                    <span className='text-xl font-bold'>
                      {formatSubjectName(subject as Subject)}
                    </span>
                    <span>{mark !== null ? mark : '____'}</span>
                  </div>
                )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
