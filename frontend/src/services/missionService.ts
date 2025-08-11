import apiClient from '../config/database';
import type { MissionSession } from '../types/drone';

export class MissionService {
  // Yeni mission session oluştur
  static async createMissionSession(
    sessionName: string,
    description?: string
  ): Promise<MissionSession> {
    return apiClient.post('/mission-sessions', {
      session_name: sessionName,
      description
    });
  }

  // Mission session'a görev ekle
  static async addTaskToSession(
    sessionId: number,
    taskId: number,
    executionOrder: number
  ): Promise<boolean> {
    await apiClient.post(`/mission-sessions/${sessionId}/tasks`, {
      task_id: taskId,
      execution_order: executionOrder
    });
    return true;
  }

  // Mission session durumunu güncelle
  static async updateSessionStatus(
    sessionId: number,
    status: 'created' | 'running' | 'paused' | 'completed' | 'failed'
  ): Promise<boolean> {
    await apiClient.patch(`/mission-sessions/${sessionId}/status`, { status });
    return true;
  }

  // Tüm mission session'ları getir
  static async getAllSessions(): Promise<MissionSession[]> {
    return apiClient.get('/mission-sessions');
  }
}
