import { useState, useEffect } from "react";
import { type TaskListProps } from "../types/drone";

const TaskList: React.FC<TaskListProps> = ({ tasks, onStartTask }) => {
  const [elapsedTimes, setElapsedTimes] = useState<Record<number, number>>({});

  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const activeTasks = tasks.filter(task => task.status === 'active');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  // Aktif görevler için süre sayacı
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTimes(prevTimes => {
        const newTimes = { ...prevTimes };
        
        activeTasks.forEach(task => {
          if (!newTimes[task.id]) {
            newTimes[task.id] = 0;
          }
          newTimes[task.id] += 1;
        });

        // Tamamlanan veya artık aktif olmayan görevlerin süresini temizle
        Object.keys(newTimes).forEach(taskIdStr => {
          const taskId = parseInt(taskIdStr);
          const task = tasks.find(t => t.id === taskId);
          if (!task || task.status !== 'active') {
            delete newTimes[taskId];
          }
        });

        return newTimes;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTasks.length, tasks]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <h3 className="font-semibold mb-2">Görevler</h3>
      
      {tasks.length === 0 ? (
        <p className="text-gray-500 text-sm">Henüz görev atanmamış</p>
      ) : (
        <div className="space-y-4">
          {/* Bekleyen Görevler */}
          {pendingTasks.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Bekleyen Görevler</h4>
              <ul className="space-y-2">
                {pendingTasks.map((task) => (
                  <li key={task.id} className="bg-yellow-50 p-3 rounded shadow-sm border-l-4 border-yellow-400">
                    <div className="font-medium text-sm">{task.droneName}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {task.description}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Planlanan süre: {task.duration}s
                    </div>
                    <div className="text-xs text-gray-500">
                      Hedef: [{task.targetPosition[0].toFixed(6)}, {task.targetPosition[1].toFixed(6)}, {task.targetPosition[2].toFixed(1)}m]
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Aktif Görevler */}
          {activeTasks.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Aktif Görevler</h4>
              <ul className="space-y-2">
                {activeTasks.map((task) => {
                  const elapsed = elapsedTimes[task.id] || 0;
                  const remaining = Math.max(0, task.duration - elapsed);
                  
                  return (
                    <li key={task.id} className="bg-blue-50 p-3 rounded shadow-sm border-l-4 border-blue-400">
                      <div className="font-medium text-sm">{task.droneName}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {task.description}
                      </div>
                      <div className="text-xs text-blue-600 mt-1 font-semibold">
                        🔄 Görev devam ediyor...
                      </div>
                      <div className="text-xs mt-1 flex justify-between">
                        <span className="text-blue-600">
                          ⏱️ Geçen süre: {formatTime(elapsed)}
                        </span>
                        <span className={`${remaining <= 10 ? 'text-red-600' : 'text-gray-500'}`}>
                          Kalan: {formatTime(remaining)}
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-1000 ${
                              elapsed > task.duration ? 'bg-red-400' : 'bg-blue-400'
                            }`}
                            style={{ 
                              width: `${Math.min(100, (elapsed / task.duration) * 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Tamamlanan Görevler */}
          {completedTasks.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Tamamlanan Görevler</h4>
              <ul className="space-y-2">
                {completedTasks.map((task) => (
                  <li key={task.id} className="bg-green-50 p-3 rounded shadow-sm border-l-4 border-green-400">
                    <div className="font-medium text-sm">{task.droneName}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {task.description}
                    </div>
                    <div className="text-xs text-green-600 mt-1 font-semibold">
                      ✅ Görev tamamlandı
                    </div>
                    {task.actualDuration !== undefined && (
                      <div className="text-xs mt-1">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">
                            ⏱️ Gerçek süre: {formatTime(task.actualDuration)}
                          </span>
                          <span className="text-gray-500">
                            Planlanan: {formatTime(task.duration)}
                          </span>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Görev Başlat Düğmesi */}
          {pendingTasks.length > 0 && (
            <button
              className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
              onClick={() => {
                const nextTask = pendingTasks[0];
                if (nextTask) {
                  onStartTask(nextTask.id);
                }
              }}
            >
              Görev Başlat
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskList;
