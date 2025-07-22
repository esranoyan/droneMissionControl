import { type TaskListProps } from "../types/drone";

const TaskList: React.FC<TaskListProps> = ({ drones }) => {
  const dronesWithTasks = drones.filter(d => d.task);

  return (
    <div>
      <h3 className="font-semibold mb-2">Atanmış Görevler</h3>
      {dronesWithTasks.length === 0 ? (
        <p className="text-gray-500 text-sm">Henüz görev atanmamış</p>
      ) : (
        <ul className="space-y-2">
          {dronesWithTasks.map((drone) => (
            <li key={drone.id} className="bg-white p-3 rounded shadow-sm">
              <div className="font-medium text-sm">{drone.name}</div>
              <div className="text-xs text-gray-600 italic mt-1">
                {drone.task}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;