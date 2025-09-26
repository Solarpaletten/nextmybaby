export interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface HealthResponse {
  ok: boolean;
  service: string;
  ts: string;
}
