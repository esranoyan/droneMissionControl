import { type TaskListProps } from "../types/drone";

const TaskList: React.FC<TaskListProps> = ({ tasks, onStartTask }) => {
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const activeTasks = tasks.filter(task => task.status === 'active');
  const completedTasks = tasks.filter(task => task.status === 'completed');

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
                      Süre: {task.duration}s
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
                {activeTasks.map((task) => (
                  <li key={task.id} className="bg-blue-50 p-3 rounded shadow-sm border-l-4 border-blue-400">
                    <div className="font-medium text-sm">{task.droneName}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {task.description}
                    </div>
                    <div className="text-xs text-blue-600 mt-1 font-semibold">
                      🔄 Görev devam ediyor...
                    </div>
                  </li>
                ))}
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