import apiClient from '../config/database';
import type { Drone } from '../types/drone';

export class DroneService {
  // Tüm drone'ları getir
  static async getAllDrones(): Promise<Drone[]> {
    try {
      const result = await apiClient.get('/drones');
      return result.data || result; // Backend response format'ına göre ayarlanabilir
    } catch (error) {
      console.error('Dronelar getirilirken hata:', error);
      throw error;
    }
  }

  // Yeni drone ekle
  static async addDrone(name: string, position: [number, number, number]): Promise<Drone> {
    try {
      const result = await apiClient.post('/drones', {
        name,
        position: {
          lat: position[0],
          lng: position[1],
          alt: position[2]
        }
      });
      
      return result.data || result;
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
      const result = await apiClient.patch(`/drones/${droneId}/position`, {
        position: {
          lat: position[0],
          lng: position[1],
          alt: position[2]
        },
        isMoving
      });
      
      return result.success !== false;
    } catch (error) {
      console.error('Drone pozisyonu güncellenirken hata:', error);
      throw error;
    }
  }

  // Drone sil
  static async deleteDrone(droneId: number): Promise<boolean> {
    try {
      await apiClient.delete(`/drones/${droneId}`);
      return true;
    } catch (error) {
      console.error('Drone silinirken hata:', error);
      throw error;
    }
  }
}