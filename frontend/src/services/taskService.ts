import apiClient from '../config/database';
import type { Task } from '../types/drone';

export class TaskService {
  // Tüm görevleri getir
  static async getAllTasks(): Promise<Task[]> {
    try {
      const result = await apiClient.get('/tasks');
      return result.data || result;
    } catch (error) {
      console.error('Görevler getirilirken hata:', error);
      throw error;
    }
  }

  // Yeni görev ekle
  static async addTask(taskData: Omit<Task, 'id'>): Promise<Task> {
    try {
      const result = await apiClient.post('/tasks', {
        droneId: taskData.droneId,
        droneName: taskData.droneName,
        startPosition: {
          lat: taskData.startPosition[0],
          lng: taskData.startPosition[1],
          alt: taskData.startPosition[2]
        },
        targetPosition: {
          lat: taskData.targetPosition[0],
          lng: taskData.targetPosition[1],
          alt: taskData.targetPosition[2]
        },
        duration: taskData.duration,
        description: taskData.description,
        color: taskData.color
      });
      
      return result.data || result;
    } catch (error) {
      console.error('Görev eklenirken hata:', error);
      throw error;
    }
  }

  // Görev durumunu güncelle
static async updateTaskStatus(taskId: number, status: 'pending' | 'active' | 'completed'): Promise<boolean> {
  try {
    console.log('Updating task status:', { taskId, status });
    const result = await apiClient.patch(`/tasks/${taskId}/status`, { status });
    console.log('Status update successful:', result);
    return true;
  } catch (error) {
    console.error('Görev durumu güncellenirken hata:', error);
    throw error;
  }
}

  // Görev ilerlemesi kaydet
  static async recordTaskProgress(
    taskId: number,
    currentPosition: [number, number, number],
    elapsedMs: number,
    progressPercentage: number
  ): Promise<number> {
    try {
      const result = await apiClient.post(`/tasks/${taskId}/progress`, {
        currentPosition: {
          lat: currentPosition[0],
          lng: currentPosition[1],
          alt: currentPosition[2]
        },
        elapsedMs,
        progressPercentage
      });
      
      return result.progressId || result.id || 1;
    } catch (error) {
      console.error('Görev ilerlemesi kaydedilirken hata:', error);
      throw error;
    }
  }
}