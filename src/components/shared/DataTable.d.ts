
import { ReactNode } from 'react';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((data: T) => ReactNode);
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchable?: boolean;
  searchKeys?: (keyof T)[];
}
