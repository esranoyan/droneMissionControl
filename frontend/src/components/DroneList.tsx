import { type DroneListProps } from "../types/drone";

const DroneList: React.FC<DroneListProps> = ({
  drones,
  onAssignTask,
  onRemoveDrone,
}) => {
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Ekli Unsurlar</h3>
      {drones.length === 0 ? (
        <p className="text-gray-500 text-sm">Henüz unsur eklenmemiş</p>
      ) : (
        <ul className="space-y-2">
          {drones.map((drone) => (
            <li key={drone.id} className="bg-white p-3 rounded shadow-sm">
              <div className="flex justify-between items-center">
                <div className="font-medium">{drone.name}</div>
                <div className="space-x-2">
                  <button
                    className="text-sm text-blue-600 hover:underline"
                    onClick={() => onAssignTask(drone.id)}
                  >
                    Görev Ata
                  </button>
                  <button
                    className="text-sm text-red-600 hover:underline"
                    onClick={() => onRemoveDrone(drone.id)}
                  >
                    Sil
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Konum: [{drone.position[0].toFixed(4)}, {drone.position[1].toFixed(4)}]
              </div>
              {drone.task && (
                <div className="text-xs text-green-600 mt-1">
                  Görev: {drone.task}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DroneList;