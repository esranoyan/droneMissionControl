import { type DroneListProps } from "../types/drone";

const DroneList: React.FC<DroneListProps> = ({
  drones,
  selectedDroneId,
  onSelectDrone,
  // onRemoveDrone,
}) => {
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Unsur Listesi</h3>
      {drones.length === 0 ? (
        <p className="text-gray-500 text-sm">Henüz unsur eklenmemiş</p>
      ) : (
        <ul className="space-y-2">
          {drones.map((drone) => (
            <li 
              key={drone.id} 
              className={`p-3 rounded shadow-sm cursor-pointer transition-colors ${
                selectedDroneId === drone.id 
                  ? 'bg-blue-100 border-2 border-blue-500' 
                  : 'bg-white hover:bg-gray-50'
              }`}
              onClick={() => onSelectDrone(drone.id)}
            >
              {/* <div className="flex justify-between items-center">
                <div className="font-medium">{drone.name}</div>
                <button
                  className="text-sm text-red-600 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveDrone(drone.id);
                  }}
                >
                  Sil
                </button>
              </div> */}
              <div className="text-xs text-gray-500 mt-1">
                Konum: [{drone.position[0].toFixed(6)}, {drone.position[1].toFixed(6)}]
              </div>
              <div className="text-xs text-gray-500">
                Yükseklik: {drone.position[2].toFixed(1)}m
              </div>
              {drone.isMoving && (
                <div className="text-xs text-orange-600 mt-1 font-semibold">
                  🔄 Hareket halinde
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