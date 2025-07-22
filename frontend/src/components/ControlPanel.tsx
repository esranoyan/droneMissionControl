import DroneList from "./DroneList";
import TaskList from "./TaskList";
import { type ControlPanelProps } from "../types/drone";

const ControlPanel: React.FC<ControlPanelProps> = ({
  drones,
  onAddDrone,
  onAssignTask,
  onRemoveDrone,
}) => {
  return (
    <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Kontrol Paneli</h2>
      
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 w-full hover:bg-blue-600 transition-colors"
        onClick={onAddDrone}
      >
        Unsur Ekle
      </button>

      <DroneList 
        drones={drones}
        onAssignTask={onAssignTask}
        onRemoveDrone={onRemoveDrone}
      />

      <TaskList drones={drones} />
    </div>
  );
};

export default ControlPanel;