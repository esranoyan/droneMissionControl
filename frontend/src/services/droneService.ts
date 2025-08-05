import pool from '../config/database';
import type { Drone} from '../types/drone';

export class DroneService {
  // Tüm drone'ları getir
  static async getAllDrones(): Promise<Drone[]> {
    try {
      const result = await pool.query(`
        SELECT id, name, position_lat, position_lng, position_alt, is_moving
        FROM drones 
        ORDER BY id
      `);
      
      return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        position: [row.position_lat, row.position_lng, row.position_alt],
        isMoving: row.is_moving
      }));
    } catch (error) {
      console.error('Dronelar getirilirken hata:', error);
      throw error;
    }
  }

  // Yeni drone ekle
  static async addDrone(name: string, position: [number, number, number]): Promise<Drone> {
    try {
      const result = await pool.query(`
        INSERT INTO drones (name, position_lat, position_lng, position_alt)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `, [name, position[0], position[1], position[2]]);
      
      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
        position: [row.position_lat, row.position_lng, row.position_alt],
        isMoving: row.is_moving
      };
    } catch (error) {
      console.error('Drone eklenirken hata:', error);
      throw error;
    }
  }

  // Drone pozisyonunu güncelle
  static async updateDronePosition(
    droneId: number, 
    position: [number, number, number], 
    isMoving: boolean = false
  ): Promise<boolean> {
    try {
      const result = await pool.query(`
        SELECT update_drone_position($1, $2, $3, $4, $5)
      `, [droneId, position[0], position[1], position[2], isMoving]);
      
      return result.rows[0].update_drone_position;
    } catch (error) {
      console.error('Drone pozisyonu güncellenirken hata:', error);
      throw error;
    }
  }

  // Drone sil
  static async deleteDrone(droneId: number): Promise<boolean> {
    try {
      const result = await pool.query('DELETE FROM drones WHERE id = $1', [droneId]);
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error('Drone silinirken hata:', error);
      throw error;
    }
  }
}