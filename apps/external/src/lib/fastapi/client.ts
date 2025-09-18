// General FastAPI Client for all FastAPI services
export class FastApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'FastApiError';
  }
}

export class FastApiClient {
  private static baseUrl = process.env.NEXT_PUBLIC_FASTAPI_URL;

  static async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    if (!this.baseUrl) {
      throw new FastApiError('FastAPI URL not configured. Please set NEXT_PUBLIC_FASTAPI_URL environment variable.');
    }

    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        let errorDetails;

        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorMessage;
          errorDetails = errorData;
        } catch {
          // If error response is not JSON, use the status text
        }

        throw new FastApiError(errorMessage, response.status, errorDetails);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof FastApiError) {
        throw error;
      }

      // Network or other errors
      throw new FastApiError(
        `Failed to connect to FastAPI service: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  static async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  static async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}