import pool from '../config/database';
import type { MissionSession } from '../types/drone';

export class MissionService {
  // Yeni mission session oluştur
  static async createMissionSession(
    sessionName: string, 
    description?: string
  ): Promise<MissionSession> {
    try {
      const result = await pool.query(`
        INSERT INTO mission_sessions (session_name, description)
        VALUES ($1, $2)
        RETURNING *
      `, [sessionName, description]);
      
      return result.rows[0];
    } catch (error) {
      console.error('Mission session oluşturulurken hata:', error);
      throw error;
    }
  }

  // Mission session'a görev ekle
  static async addTaskToSession(sessionId: number, taskId: number, executionOrder: number): Promise<boolean> {
    try {
      await pool.query(`
        INSERT INTO mission_session_tasks (session_id, task_id, execution_order)
        VALUES ($1, $2, $3)
      `, [sessionId, taskId, executionOrder]);
      
      return true;
    } catch (error) {
      console.error('Görev session\'a eklenirken hata:', error);
      throw error;
    }
  }

  // Mission session durumunu güncelle
  static async updateSessionStatus(
    sessionId: number, 
    status: 'created' | 'running' | 'paused' | 'completed' | 'failed'
  ): Promise<boolean> {
    try {
      const updateData: any = { status };
      
      if (status === 'running') {
        updateData.started_at = new Date();
      } else if (status === 'completed' || status === 'failed') {
        updateData.completed_at = new Date();
      }
      
      const setClause = Object.keys(updateData).map((key, index) => 
        `${key} = $${index + 2}`
      ).join(', ');
      
      const values = [sessionId, ...Object.values(updateData)];
      
      const result = await pool.query(`
        UPDATE mission_sessions 
        SET ${setClause}
        WHERE id = $1
      `, values);
      
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error('Mission session durumu güncellenirken hata:', error);
      throw error;
    }
  }

  // Tüm mission session'ları getir
  static async getAllSessions(): Promise<MissionSession[]> {
    try {
      const result = await pool.query(`
        SELECT * FROM mission_session_summary 
        ORDER BY created_at DESC
      `);
      
      return result.rows;
    } catch (error) {
      console.error('Mission session\'lar getirilirken hata:', error);
      throw error;
    }
  }
}