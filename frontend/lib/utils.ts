import { Subject } from '@/types/search-score';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// "toan" | "ngu_van" | "ngoai_ngu" | "vat_li" | "hoa_hoc" | "sinh_hoc" | "lich_su" | "dia_li" | "gdcd"

export function formatSubjectName(subject: Subject) {
  switch (subject) {
    case 'toan':
      return 'Toán';
    case 'vat_li':
      return 'Vật Lý';
    case 'hoa_hoc':
      return 'Hóa Học';
    case 'sinh_hoc':
      return 'Sinh Học';
    case 'ngu_van':
      return 'Ngữ Văn';
    case 'ngoai_ngu':
      return 'Ngoại Ngữ';
    case 'lich_su':
      return 'Lịch Sử';
    case 'dia_li':
      return 'Địa Lý';
    case 'gdcd':
      return 'Giáo Dục Công Dân';
    default:
      return subject;
  }
}
