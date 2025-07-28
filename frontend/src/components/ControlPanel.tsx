import DroneList from "./DroneList";
import TaskList from "./TaskList";
import { type ControlPanelProps } from "../types/drone";

const ControlPanel: React.FC<ControlPanelProps> = ({
  drones,
  tasks,
  selectedDroneId,
  onSelectDrone,
  onAddDrone,
  onAddTask,
  onStartTask,
  // onRemoveDrone,
}) => {
  return (
    <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Kontrol Paneli</h2>
      
      {/* Unsur Ekle düğmesi*/}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 w-full"
        onClick={onAddDrone}
      >
        Unsur Ekle
      </button>

      {/* Görev Ata düğmesi */}
      <button
        className={`px-4 py-2 rounded mb-4 w-full transition-colors ${
          selectedDroneId 
            ? 'bg-green-500 hover:bg-green-600 text-white' 
            : 'bg-gray-400 text-white cursor-not-allowed'
        }`}
        disabled={!selectedDroneId}
        onClick={onAddTask}
      >
        Görev Ata
      </button>

      <DroneList 
        drones={drones}
        selectedDroneId={selectedDroneId}
        onSelectDrone={onSelectDrone}
        // onRemoveDrone={onRemoveDrone}
      />

      <TaskList 
        tasks={tasks}
        onStartTask={onStartTask}
      />
    </div>
  );
};

export default ControlPanel;

