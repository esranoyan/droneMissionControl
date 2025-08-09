const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiRequest = async (endpoint: string, options?: RequestInit) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};


export const get = async (endpoint: string) => {
  return apiRequest(endpoint, { method: 'GET' });
};

export const post = async (endpoint: string, data: any) => {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const put = async (endpoint: string, data: any) => {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const patch = async (endpoint: string, data: any) => {
  return apiRequest(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const del = async (endpoint: string) => {
  return apiRequest(endpoint, { method: 'DELETE' });
};

const apiClient = {
  get,
  post,
  put,
  patch,
  delete: del,
};

export default apiClient;