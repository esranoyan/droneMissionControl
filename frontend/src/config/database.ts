// // Geçici mock database - backend hazır olmadan test için

// // Mock data types
// interface MockDrone {
//   id: number;
//   name: string;
//   position: [number, number, number];
//   isMoving: boolean;
//   batteryLevel: number;
//   status: 'idle' | 'flying' | 'charging' | 'maintenance';
// }

// interface MockTask {
//   id: number;
//   droneId: number;
//   description: string;
//   startPosition: [number, number, number];
//   targetPosition: [number, number, number];
//   duration: number;
//   color: string;
//   status: 'pending' | 'active' | 'completed' | 'failed';
// }

// // Mock data
// let mockDrones: MockDrone[] = [
//   {
//     id: 1,
//     name: 'İHA-001',
//     position: [39.92077, 32.85411, 850],
//     isMoving: false,
//     batteryLevel: 85,
//     status: 'idle',
//   },
//   {
//     id: 2,
//     name: 'İHA-002', 
//     position: [39.91077, 32.86411, 850],
//     isMoving: false,
//     batteryLevel: 92,
//     status: 'idle',
//   }
// ];

// let mockTasks: MockTask[] = [
//   {
//     id: 1,
//     droneId: 1,
//     description: 'Test görevi 1',
//     startPosition: [39.92077, 32.85411, 850],
//     targetPosition: [39.93077, 32.86411, 850],
//     duration: 30,
//     color: '#ff0000',
//     status: 'pending',
//   }
// ];

// let nextDroneId = 3;
// let nextTaskId = 2;

// // Mock database operations
// const mockDb = {
//   // Drones
//   async getDrones(): Promise<MockDrone[]> {
//     return new Promise(resolve => {
//       setTimeout(() => resolve([...mockDrones]), 100);
//     });
//   },

//   async addDrone(name: string, position: [number, number, number]): Promise<MockDrone> {
//     return new Promise(resolve => {
//       const newDrone: MockDrone = {
//         id: nextDroneId++,
//         name,
//         position,
//         isMoving: false,
//         batteryLevel: Math.floor(Math.random() * 40) + 60,
//         status: 'idle',
//       };
//       mockDrones.push(newDrone);
//       setTimeout(() => resolve(newDrone), 100);
//     });
//   },

//   async updateDrone(id: number, updates: Partial<MockDrone>): Promise<MockDrone | null> {
//     return new Promise(resolve => {
//       const index = mockDrones.findIndex(d => d.id === id);
//       if (index !== -1) {
//         mockDrones[index] = { ...mockDrones[index], ...updates };
//         setTimeout(() => resolve(mockDrones[index]), 100);
//       } else {
//         setTimeout(() => resolve(null), 100);
//       }
//     });
//   },

//   // Tasks
//   async getTasks(): Promise<MockTask[]> {
//     return new Promise(resolve => {
//       setTimeout(() => resolve([...mockTasks]), 100);
//     });
//   },

//   async addTask(task: Omit<MockTask, 'id'>): Promise<MockTask> {
//     return new Promise(resolve => {
//       const newTask: MockTask = {
//         id: nextTaskId++,
//         ...task,
//       };
//       mockTasks.push(newTask);
//       setTimeout(() => resolve(newTask), 100);
//     });
//   },

//   async updateTask(id: number, updates: Partial<MockTask>): Promise<MockTask | null> {
//     return new Promise(resolve => {
//       const index = mockTasks.findIndex(t => t.id === id);
//       if (index !== -1) {
//         mockTasks[index] = { ...mockTasks[index], ...updates };
//         setTimeout(() => resolve(mockTasks[index]), 100);
//       } else {
//         setTimeout(() => resolve(null), 100);
//       }
//     });
//   },

//   // Utility
//   async query(sql: string, params?: any[]): Promise<any> {
//     console.log('Mock DB Query:', sql, params);
//     return { rows: [] };
//   }
// };

// export default mockDb;

////////////////////////////////////////////////////////2////////////////////////////////////////////////////

// const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000/api';

// class ApiClient {
//   private async request(endpoint: string, options?: RequestInit) {
//     const url = `${API_BASE_URL}${endpoint}`;
    
//     const config: RequestInit = {
//       headers: {
//         'Content-Type': 'application/json',
//         ...options?.headers,
//       },
//       ...options,
//     };

//     try {
//       const response = await fetch(url, config);
      
//       if (!response.ok) {
//         throw new Error(`API Error: ${response.status} ${response.statusText}`);
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('API request failed:', error);
//       throw error;
//     }
//   }

//   // GET request
//   async get(endpoint: string) {
//     return this.request(endpoint, { method: 'GET' });
//   }

//   // POST request
//   async post(endpoint: string, data: any) {
//     return this.request(endpoint, {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//   }

//   // PUT request
//   async put(endpoint: string, data: any) {
//     return this.request(endpoint, {
//       method: 'PUT',
//       body: JSON.stringify(data),
//     });
//   }

//   // DELETE request
//   async delete(endpoint: string) {
//     return this.request(endpoint, { method: 'DELETE' });
//   }

//   // PATCH request
//   async patch(endpoint: string, data: any) {
//     return this.request(endpoint, {
//       method: 'PATCH',
//       body: JSON.stringify(data),
//     });
//   }
// }

// // Instance oluştur ve export et
// const apiClient = new ApiClient();

// // Debug için
// console.log('ApiClient initialized:', apiClient);

// export default apiClient;

///////////////////////////////////////////////////3////////////////////////////////////////////////////
// Alternative API Client Export

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

// Export individual functions
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

// Default export object
const apiClient = {
  get,
  post,
  put,
  patch,
  delete: del,
};

export default apiClient;