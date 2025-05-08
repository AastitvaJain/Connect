import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import axiosInstance from './axios';
import { toast } from 'react-toastify';
/**
 * Wrapper for Axios requests with unified error & status handling.
 */
export const request = async <T = any>(
  config: AxiosRequestConfig & { withAuth?: boolean }
): Promise<T> => {
  try {
    const response = await axiosInstance.request<T>({
      ...config,
      // Pass through `auth` flag to interceptor
      auth: config.auth
    });

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }

    console.error(`Request failed with status ${response.status} and error ${response.data}`);
    toast.error(`Request failed with status ${response.status}`);
    // throw new Error(`Request failed with status ${response.status}`);

    return null as unknown as T;
    
  } catch (error: any) {
    // Optionally log, rethrow, or transform error here
    console.error('API Error:', error);
    toast.error(`API Error: ${error.message}`);

    // Optional: Check for 401 and force logout
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Example: localStorage.clear(); or redirect
    }

    //throw error;

    return null as unknown as T;
  }
};
