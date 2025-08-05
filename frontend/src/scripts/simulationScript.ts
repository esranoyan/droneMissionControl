import { DroneService } from '../services/droneService';
import { TaskService } from '../services/taskService';
import { MissionService } from '../services/missionService';
import type { Task } from '../types/drone';

export class DroneSimulation {
  private sessionId: number | null = null;
  private isRunning = false;

  async startSimulation(sessionName: string) {
    try {
      // Mission session oluştur
      const session = await MissionService.createMissionSession(
        sessionName,
        'Otomatik drone simülasyonu'
      );
      this.sessionId = session.id;

      // Session'ı başlat
      await MissionService.updateSessionStatus(session.id, 'running');
      this.isRunning = true;

      console.log(`Simülasyon başlatıldı: ${sessionName} (ID: ${session.id})`);

      // Bekleyen görevleri al
      const tasks = await TaskService.getAllTasks();
      const pendingTasks = tasks.filter(t => t.status === 'pending');

      // Her görev için simülasyon çalıştır
      for (const task of pendingTasks) {
        if (!this.isRunning) break;
        
        await this.simulateTask(task);
      }

      // Session'ı tamamla
      await MissionService.updateSessionStatus(session.id, 'completed');
      console.log('Simülasyon tamamlandı');

    } catch (error) {
      console.error('Simülasyon hatası:', error);
      if (this.sessionId) {
        await MissionService.updateSessionStatus(this.sessionId, 'failed');
      }
    }
  }

  private async simulateTask(task: Task) {
    try {
      // Görevi aktif yap
      await TaskService.updateTaskStatus(task.id, 'active');
      
      const startTime = Date.now();
      const totalDuration = task.duration * 1000; // ms'ye çevir
      const updateInterval = 100; // 100ms'de bir güncelle
      
      console.log(`Görev başlatıldı: ${task.description}`);

      // Simülasyon döngüsü
      while (Date.now() - startTime < totalDuration && this.isRunning) {
        const elapsed = Date.now() - startTime;
        const progress = (elapsed / totalDuration) * 100;
        
        // Mevcut pozisyonu hesapla (linear interpolation)
        const t = elapsed / totalDuration;
        const currentPosition: [number, number, number] = [
          task.startPosition[0] + (task.targetPosition[0] - task.startPosition[0]) * t,
          task.startPosition[1] + (task.targetPosition[1] - task.startPosition[1]) * t,
          task.startPosition[2] + (task.targetPosition[2] - task.startPosition[2]) * t
        ];
        
        // Drone pozisyonunu güncelle
        await DroneService.updateDronePosition(task.droneId, currentPosition, true);
        
        // İlerleme kaydet
        await TaskService.recordTaskProgress(task.id, currentPosition, elapsed, progress);
        
        await new Promise(resolve => setTimeout(resolve, updateInterval));
      }

      // Görev tamamlandı
      await TaskService.updateTaskStatus(task.id, 'completed');
      await DroneService.updateDronePosition(task.droneId, task.targetPosition, false);
      
      console.log(`Görev tamamlandı: ${task.description}`);
      
    } catch (error) {
      console.error('Görev simülasyonu hatası:', error);
    }
  }

  stopSimulation() {
    this.isRunning = false;
    console.log('Simülasyon durduruldu');
  }
}