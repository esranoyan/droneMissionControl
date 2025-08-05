import pool from '../config/database';
import type { Task } from '../types/drone';

export class TaskService {
  // Tüm görevleri getir
  static async getAllTasks(): Promise<Task[]> {
    try {
      const result = await pool.query(`
        SELECT 
          id, drone_id, drone_name,
          start_position_lat, start_position_lng, start_position_alt,
          target_position_lat, target_position_lng, target_position_alt,
          duration, description, status, actual_duration, color,
          created_at, started_at, completed_at
        FROM tasks 
        ORDER BY created_at DESC
      `);
      
      return result.rows.map(row => ({
        id: row.id,
        droneId: row.drone_id,
        droneName: row.drone_name,
        startPosition: [row.start_position_lat, row.start_position_lng, row.start_position_alt],
        targetPosition: [row.target_position_lat, row.target_position_lng, row.target_position_alt],
        duration: row.duration,
        description: row.description,
        status: row.status,
        actualDuration: row.actual_duration,
        color: row.color
      }));
    } catch (error) {
      console.error('Görevler getirilirken hata:', error);
      throw error;
    }
  }

  // Yeni görev ekle
  static async addTask(taskData: Omit<Task, 'id'>): Promise<Task> {
    try {
      const result = await pool.query(`
        INSERT INTO tasks (
          drone_id, drone_name,
          start_position_lat, start_position_lng, start_position_alt,
          target_position_lat, target_position_lng, target_position_alt,
          duration, description, color
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `, [
        taskData.droneId,
        taskData.droneName,
        taskData.startPosition[0],
        taskData.startPosition[1], 
        taskData.startPosition[2],
        taskData.targetPosition[0],
        taskData.targetPosition[1],
        taskData.targetPosition[2],
        taskData.duration,
        taskData.description,
        taskData.color
      ]);
      
      const row = result.rows[0];
      return {
        id: row.id,
        droneId: row.drone_id,
        droneName: row.drone_name,
        startPosition: [row.start_position_lat, row.start_position_lng, row.start_position_alt],
        targetPosition: [row.target_position_lat, row.target_position_lng, row.target_position_alt],
        duration: row.duration,
        description: row.description,
        status: row.status,
        actualDuration: row.actual_duration,
        color: row.color
      };
    } catch (error) {
      console.error('Görev eklenirken hata:', error);
      throw error;
    }
  }

  // Görev durumunu güncelle
  static async updateTaskStatus(taskId: number, status: 'pending' | 'active' | 'completed'): Promise<boolean> {
    try {
      const result = await pool.query(`
        UPDATE tasks 
        SET status = $1 
        WHERE id = $2
      `, [status, taskId]);
      
      return (result.rowCount ?? 0) > 0;
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
      const result = await pool.query(`
        SELECT record_task_progress($1, $2, $3, $4, $5, $6)
      `, [taskId, currentPosition[0], currentPosition[1], currentPosition[2], elapsedMs, progressPercentage]);
      
      return result.rows[0].record_task_progress;
    } catch (error) {
      console.error('Görev ilerlemesi kaydedilirken hata:', error);
      throw error;
    }
  }
}