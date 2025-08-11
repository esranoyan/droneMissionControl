import { type ControlPanelProps } from "../types/drone";
import DroneList from "./DroneList";
import TaskList from "./TaskList";

const ControlPanel: React.FC<ControlPanelProps> = ({
  drones,
  tasks,
  selectedDroneId,
  onSelectDrone,
  onAddDrone,
  onAddTask,
  onStartTask,
}) => {
  return (
    <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
      <div className="space-y-6">
        {/* Drone Yönetimi */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Drone Yönetimi</h2>
            <button
              onClick={onAddDrone}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              + Drone Ekle
            </button>
          </div>
          
          <DroneList
            drones={drones}
            selectedDroneId={selectedDroneId}
            onSelectDrone={onSelectDrone}
          />
        </div>

        {/* Görev Yönetimi */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Görev Yönetimi</h2>
            <button
              onClick={onAddTask}
              disabled={!selectedDroneId}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                selectedDroneId
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              + Görev Ekle
            </button>
          </div>
          
          <TaskList
            tasks={tasks}
            onStartTask={onStartTask}
          />
        </div>

        {/* İstatistikler */}
        <div className="bg-white p-3 rounded shadow">
          <h3 className="font-semibold mb-2">İstatistikler</h3>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Toplam Drone:</span>
              <span className="font-medium">{drones.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Toplam Görev:</span>
              <span className="font-medium">{tasks.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Bekleyen:</span>
              <span className="font-medium text-yellow-600">
                {tasks.filter(t => t.status === 'pending').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Aktif:</span>
              <span className="font-medium text-blue-600">
                {tasks.filter(t => t.status === 'active').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tamamlanan:</span>
              <span className="font-medium text-green-600">
                {tasks.filter(t => t.status === 'completed').length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;