import {
  IsInt,
  IsOptional,
  IsPositive,
  IsIn,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  Validate,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Subject, SUBJECTS } from 'src/scores/dtos/get-score-report.dto';

export const BLOCKS: Record<string, Subject[]> = {
  A: ['toan', 'vat_li', 'hoa_hoc'],
  B: ['toan', 'hoa_hoc', 'sinh_hoc'],
  C: ['ngu_van', 'lich_su', 'dia_li'],
  D: ['toan', 'ngu_van', 'ngoai_ngu'],
};

export type TopRow = {
  sbd: string;
  total: number | bigint | null;
} & Record<string, number | bigint | null>;

@ValidatorConstraint({ name: 'SubjectsArrayValidator', async: false })
export class SubjectsArrayValidator implements ValidatorConstraintInterface {
  validate(subjects: string[]) {
    if (!Array.isArray(subjects)) return false;
    if (subjects.length !== 3) return false;

    const validSubjects = new Set(SUBJECTS as unknown as string[]);
    const unique = new Set(subjects);

    // đủ 3 môn, không trùng, đều nằm trong danh sách hợp lệ
    return unique.size === 3 && subjects.every((s) => validSubjects.has(s));
  }

  defaultMessage() {
    return 'subjects phải gồm chính xác 3 môn hợp lệ và không trùng nhau';
  }
}
export class GetTopDto {
  @IsOptional()
  @IsIn(Object.keys(BLOCKS))
  block?: keyof typeof BLOCKS;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : undefined,
  )
  @Validate(SubjectsArrayValidator)
  subjects?: Subject[];

  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : 10))
  @IsInt()
  @IsPositive()
  limit = 10;
}
