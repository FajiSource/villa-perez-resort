const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

interface RequestOptions extends RequestInit {
  headers?: HeadersInit;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const token = localStorage.getItem("token");
    
    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }

    const headers = new Headers();
    Object.entries(defaultHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });
    
    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headers.set(key, value);
        });
      } else if (Array.isArray(options.headers)) {
        options.headers.forEach(([key, value]) => {
          headers.set(key, value);
        });
      } else {
        Object.entries(options.headers).forEach(([key, value]) => {
          headers.set(key, String(value));
        });
      }
    }

    const config: RequestInit = {
      ...options,
      headers,
      credentials: options.credentials || "include",
    };

    let response: Response;
    try {
      response = await fetch(url, config);
    } catch (error: any) {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        throw new Error(
          `Unable to connect to the server. Please check if the API server is running at ${this.baseURL}`
        );
      }
      throw new Error(`Network error: ${error.message || "Failed to fetch"}`);
    }
    
    if (!response.ok) {
      let errorMessage = `API request failed: ${response.statusText}`;
      let errorData: any = {};
      
      try {
        errorData = await response.json();
      } catch {
      }
      
      if (response.status === 422 && errorData.errors) {
        const errorMessages: string[] = [];
        Object.keys(errorData.errors).forEach((field) => {
          const fieldErrors = errorData.errors[field];
          if (Array.isArray(fieldErrors)) {
            errorMessages.push(...fieldErrors);
          } else if (typeof fieldErrors === 'string') {
            errorMessages.push(fieldErrors);
          }
        });
        
        if (errorMessages.length > 0) {
          errorMessage = errorMessages.join(", ");
        } else {
          errorMessage = errorData.message || "Validation failed. Please check your input.";
        }
      } else {
        errorMessage = 
          errorData.message || 
          errorData.detail || 
          errorData.error || 
          errorData.msg ||
          (Array.isArray(errorData.detail) ? errorData.detail.join(", ") : errorData.detail) ||
          errorMessage;
      }
      
      const error = new Error(errorMessage);
      (error as any).status = response.status;
      (error as any).statusText = response.statusText;
      (error as any).errors = errorData.errors || null;
      throw error;
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const text = await response.text();
      return text ? (JSON.parse(text) as T) : ({} as T);
    }
    return {} as T;
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const apiService = new ApiService(API_BASE_URL);
