export interface ApiResponse<T> {
  data: T;
  message: string;
  code: number;
  success: boolean;
}
