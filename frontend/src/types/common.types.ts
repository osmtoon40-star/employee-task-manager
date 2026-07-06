export interface BaseResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
}

export interface PaginatedResponse<T> extends BaseResponse<T[]> {
  pagination: PaginationParams;
}

export type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';
