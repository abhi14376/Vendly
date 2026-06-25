export interface ApiErrorField {
  field: string;
  message: string;
}

export interface ApiSuccessResponse<TData> {
  success: true;
  message?: string;
  data: TData;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: ApiErrorField[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponse<TData> extends ApiSuccessResponse<TData[]> {
  pagination: PaginationMeta;
}

export type ApiResponse<TData> = ApiSuccessResponse<TData> | ApiErrorResponse;
