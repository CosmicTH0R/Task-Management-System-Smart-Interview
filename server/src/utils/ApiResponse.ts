export interface PaginationMeta {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export class ApiResponse<T> {
  public readonly success: boolean;
  public readonly message: string;
  public readonly data: T | null;
  public readonly pagination?: PaginationMeta;

  constructor(
    success: boolean,
    message: string,
    data: T | null = null,
    pagination?: PaginationMeta,
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    if (pagination) {
      this.pagination = pagination;
    }
  }

  static success<T>(message: string, data: T | null = null, pagination?: PaginationMeta): ApiResponse<T> {
    return new ApiResponse<T>(true, message, data, pagination);
  }

  static error(message: string): ApiResponse<null> {
    return new ApiResponse<null>(false, message, null);
  }
}
