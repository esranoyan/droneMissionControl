import { type DroneListProps } from "../types/drone";

const DroneList: React.FC<DroneListProps> = ({
  drones,
  selectedDroneId,
  onSelectDrone,
}) => {
  const formatPosition = (position: any): [number, number, number] => {
    if (!position || !Array.isArray(position)) {
      return [0, 0, 0];
    }
    
    return [
      typeof position[0] === 'number' ? position[0] : parseFloat(position[0]) || 0,
      typeof position[1] === 'number' ? position[1] : parseFloat(position[1]) || 0,
      typeof position[2] === 'number' ? position[2] : parseFloat(position[2]) || 0,
    ];
  };

  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Unsur Listesi</h3>
      {drones.length === 0 ? (
        <p className="text-gray-500 text-sm">Henüz unsur eklenmemiş</p>
      ) : (
        <ul className="space-y-2">
          {drones.map((drone) => {
            const [lat, lng, alt] = formatPosition(drone.position);
            
            return (
              <li 
                key={drone.id} 
                className={`p-3 rounded shadow-sm cursor-pointer transition-colors ${
                  selectedDroneId === drone.id 
                    ? 'bg-blue-100 border-2 border-blue-500' 
                    : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => onSelectDrone(drone.id)}
              >
                <div className="font-medium text-sm">
                  {drone.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Konum: [{lat.toFixed(6)}, {lng.toFixed(6)}]
                </div>
                <div className="text-xs text-gray-500">
                  Yükseklik: {alt.toFixed(1)}m
                </div>
                {drone.isMoving && (
                  <div className="text-xs text-orange-600 mt-1 font-semibold">
                    🔄 Hareket halinde
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default DroneList;