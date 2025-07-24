import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import ControlPanel from "./components/ControlPanel";
import DroneMarker from "./components/DroneMarker";
import TaskDialog from "./components/TaskDialog";  
import { type Drone, type Task } from "./types/drone";

// Varsayılan Leaflet ikonlarını devre dışı bırakıyoruz
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "",
  iconUrl: "",
  shadowUrl: "",
});

// Harita tıklama eventi için component
const MapClickHandler = ({ 
  isSelectingTarget, 
  onTargetSelect 
}: { 
  isSelectingTarget: boolean; 
  onTargetSelect: (position: [number, number]) => void; 
}) => {
  useMapEvents({
    click: (e) => {
      if (isSelectingTarget) {
        onTargetSelect([e.latlng.lat, e.latlng.lng]);
      }
    },
  });
  return null;
};

const Map = () => {
  const ankara: [number, number, number] = [39.92077, 32.85411, 850];
  
  // Varsayılan unsur ile başla
  const [drones, setDrones] = useState<Drone[]>([
    {
      id: 1,
      name: "İHA-001",
      position: [39.92077, 32.85411, 850],
      isMoving: false
    }
  ]);
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDroneId, setSelectedDroneId] = useState<number | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isSelectingTarget, setIsSelectingTarget] = useState(false);
  const [targetSelectCallback, setTargetSelectCallback] = useState<((position: [number, number]) => void) | null>(null);
  
  // Görev başlangıç zamanlarını tutmak için state
  const [taskStartTimes, setTaskStartTimes] = useState<Record<number, number>>({});

  const handleSelectDrone = (id: number) => {
    setSelectedDroneId(id);
  };

  const handleAddTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now(), // Basit ID üretimi
    };
    setTasks([...tasks, newTask]);
    setIsTaskDialogOpen(false);
  };

  const handleStartTask = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Başlangıç zamanını kaydet
    const startTime = Date.now();
    setTaskStartTimes(prev => ({
      ...prev,
      [taskId]: startTime
    }));

    // Görevi aktif yap
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, status: 'active' as const } : t
    ));

    // Drone'u hareket ettir
    const drone = drones.find(d => d.id === task.droneId);
    if (!drone) return;

    setDrones(drones.map(d => 
      d.id === task.droneId ? { ...d, isMoving: true } : d
    ));

    // Lineer hareket animasyonu
    const animationStartTime = Date.now();
    const startPos = task.startPosition;
    const targetPos = task.targetPosition;
    const duration = task.duration * 1000; // saniyeyi ms'ye çevir

    const animate = () => {
      const elapsed = Date.now() - animationStartTime;
      const progress = Math.min(elapsed / duration, 1);

      const currentLat = startPos[0] + (targetPos[0] - startPos[0]) * progress;
      const currentLng = startPos[1] + (targetPos[1] - startPos[1]) * progress;
      const currentAlt = startPos[2] + (targetPos[2] - startPos[2]) * progress;

      setDrones(prevDrones => 
        prevDrones.map(d => 
          d.id === task.droneId 
            ? { ...d, position: [currentLat, currentLng, currentAlt] }
            : d
        )
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Hareket tamamlandı - gerçek süreyi hesapla
        const endTime = Date.now();
        const taskStartTime = taskStartTimes[taskId];
        const actualDuration = taskStartTime ? Math.round((endTime - taskStartTime) / 1000) : undefined;

        // Drone'u durdur
        setDrones(prevDrones => 
          prevDrones.map(d => 
            d.id === task.droneId ? { ...d, isMoving: false } : d
          )
        );

        // Görevi tamamla ve gerçek süreyi kaydet
        setTasks(prevTasks => 
          prevTasks.map(t => 
            t.id === taskId 
              ? { ...t, status: 'completed' as const, actualDuration } 
              : t
          )
        );

        // Başlangıç zamanını temizle
        setTaskStartTimes(prev => {
          const newTimes = { ...prev };
          delete newTimes[taskId];
          return newTimes;
        });
      }
    };

    animate();
  };

  const handleTargetSelect = (position: [number, number]) => {
    if (targetSelectCallback) {
      targetSelectCallback(position);
      setTargetSelectCallback(null);
    }
    setIsSelectingTarget(false);
  };

  // const removeDrone = (id: number) => {
  //   setDrones(drones.filter(d => d.id !== id));
  //   if (selectedDroneId === id) {
  //     setSelectedDroneId(null);
  //   }
  // };

  const selectedDrone = selectedDroneId ? drones.find(d => d.id === selectedDroneId) || null : null;

  return (
    <div className="flex h-screen w-full">
      <ControlPanel 
        drones={drones}
        tasks={tasks}
        selectedDroneId={selectedDroneId}
        onSelectDrone={handleSelectDrone}
        onAddTask={() => setIsTaskDialogOpen(true)}
        onStartTask={handleStartTask}
        //onRemoveDrone={removeDrone}
      />

      <div className="w-3/4 relative">
        {isSelectingTarget && (
          <div className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded z-[1000]">
            Hedef nokta seçmek için haritaya tıklayın
          </div>
        )}
        
        <MapContainer center={[ankara[0], ankara[1]]} zoom={13} className="h-full w-full z-0">
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler 
            isSelectingTarget={isSelectingTarget}
            onTargetSelect={handleTargetSelect}
          />

          {drones.map((drone) => (
            <DroneMarker 
              key={drone.id} 
              drone={drone} 
              isSelected={drone.id === selectedDroneId}
            />
          ))}
        </MapContainer>
      </div>

      <TaskDialog
        isOpen={isTaskDialogOpen}
        drone={selectedDrone}
        onClose={() => setIsTaskDialogOpen(false)}
        onAddTask={handleAddTask}
        onSelectTarget={(callback) => {
          setTargetSelectCallback(() => callback);
          setIsSelectingTarget(true);
        }}
      />
    </div>
  );
};

export default Map;