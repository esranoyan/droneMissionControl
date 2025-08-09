import { useState, useEffect, useCallback } from 'react';
import type { Drone, Task } from '../types/drone';
import { DroneService } from '../services/droneService';
import { TaskService } from '../services/taskService';

export const useDroneData = () => {
  const [drones, setDrones] = useState<Drone[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verileri yükle
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dronesData, tasksData] = await Promise.all([
        DroneService.getAllDrones(),
        TaskService.getAllTasks()
      ]);
      setDrones(dronesData);
      setTasks(tasksData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Veri yüklenirken hata oluştu');
      console.error('Veri yükleme hatası:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Drone ekle
  const addDrone = useCallback(async (name: string, position: [number, number, number]) => {
    try {
      const newDrone = await DroneService.addDrone(name, position);
      setDrones(prev => [...prev, newDrone]);
      return newDrone;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Drone eklenirken hata oluştu');
      throw err;
    }
  }, []);

  // Görev ekle
  const addTask = useCallback(async (taskData: Omit<Task, 'id'>) => {
    try {
      const newTask = await TaskService.addTask(taskData);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Görev eklenirken hata oluştu');
      throw err;
    }
  }, []);

  // Görev durumunu güncelle
  const updateTaskStatus = useCallback(async (taskId: number, status: 'pending' | 'active' | 'completed') => {
    try {
      await TaskService.updateTaskStatus(taskId, status);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status } : task
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Görev durumu güncellenirken hata oluştu');
      throw err;
    }
  }, []);


  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    drones,
    tasks,
    loading,
    error,
    loadData,
    addDrone,
    addTask,
    updateTaskStatus
  };
};