import { useState, useRef } from "react";
import {MapContainer, TileLayer, useMapEvents, Polyline, CircleMarker, Tooltip, useMap,} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import ControlPanel from "./components/ControlPanel";
import DroneMarker from "./components/DroneMarker";
import TaskDialog from "./components/TaskDialog";
import { type Drone, type Task, type TaskProgress } from "./types/drone";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "",
  iconUrl: "",
  shadowUrl: "",
});

const MapClickHandler = ({
  isSelectingTarget,
  onTargetSelect,
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

const MapInitializer = ({ onInit }: { onInit: (map: L.Map) => void }) => {
  const map = useMap();
  onInit(map);
  return null;
};


const Map = () => {
  const ankara: [number, number, number] = [39.92077, 32.85411, 850];

  const mapRef = useRef<L.Map | null>(null);

  const [drones, setDrones] = useState<Drone[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDroneId, setSelectedDroneId] = useState<number | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isTaskDialogTemporarilyHidden, setIsTaskDialogTemporarilyHidden] = useState(false);
  const [isSelectingTarget, setIsSelectingTarget] = useState(false);
  const [targetSelectCallback, setTargetSelectCallback] =
    useState<((position: [number, number]) => void) | null>(null);

  const [taskProgresses, setTaskProgresses] = useState<TaskProgress[]>([]);

  const handleSelectDrone = (id: number) => {
    setSelectedDroneId(id);
  };

  const handleAddDrone = () => {
    const map = mapRef.current;
    if (!map) return;

    const center = map.getCenter();
    const newDrone: Drone = {
      id: Date.now(),
      name: `İHA-${String(drones.length + 1).padStart(3, "0")}`,
      position: [center.lat, center.lng, ankara[2]],
      isMoving: false,
    };
    setDrones((prev) => [...prev, newDrone]);
  };

  const handleAddTask = (taskData: Omit<Task, "id">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now(),
    };
    setTasks([...tasks, newTask]);
    setIsTaskDialogOpen(false);
  };

  const handleStartTask = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const drone = drones.find((d) => d.id === task.droneId);
    if (!drone) return;

    const duration = task.duration * 1000;
    const interval = 1000 / 30;

    // Görevi aktif yap
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: "active" } : t
      )
    );

    setDrones((prev) =>
      prev.map((d) =>
        d.id === task.droneId ? { ...d, isMoving: true } : d
      )
    );

    const startTime = Date.now();
    const initialProgress: TaskProgress = {
      taskId,
      startTime,
      path: [[task.startPosition[0], task.startPosition[1]]],
      currentPosition: [task.startPosition[0], task.startPosition[1]],
      elapsedMs: 0,
    };
    setTaskProgresses((prev) => [...prev, initialProgress]);

    const worker = new Worker(new URL('./workers/taskWorker.js', import.meta.url), { type: 'module' });

    worker.postMessage({
      task: {
        start: task.startPosition,
        end: task.targetPosition,
      },
      duration,
      interval,
    });

    worker.onmessage = (e) => {
      const { currentPosition, elapsed, isDone } = e.data;

      setDrones((prev) =>
        prev.map((d) =>
          d.id === task.droneId
            ? { ...d, position: [currentPosition[0], currentPosition[1], task.startPosition[2]] }
            : d
        )
      );

      setTaskProgresses((prev) =>
        prev.map((tp) =>
          tp.taskId === taskId
            ? {
                ...tp,
                currentPosition,
                elapsedMs: elapsed,
                path: elapsed % 1000 < 16 ? [...tp.path, currentPosition] : tp.path,
              }
            : tp
        )
      );

      if (isDone) {
        setDrones((prev) =>
          prev.map((d) =>
            d.id === task.droneId
              ? {
                  ...d,
                  isMoving: false,
                  position: [
                    task.targetPosition[0],
                    task.targetPosition[1],
                    task.targetPosition[2],
                  ],
                }
              : d
          )
        );

        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status: "completed",
                  actualDuration: Math.round(elapsed / 1000),
                }
              : t
          )
        );

        worker.terminate();
      }

    };
  };

  const handleTargetSelect = (position: [number, number]) => {
    if (targetSelectCallback) {
      targetSelectCallback(position);
      setTargetSelectCallback(null);
    }
    setIsSelectingTarget(false);
  };

  const selectedDrone = selectedDroneId
    ? drones.find((d) => d.id === selectedDroneId) || null
    : null;

  const getTaskRoutes = () => {
  return tasks.map((task) => {
    const progress = taskProgresses.find((tp) => tp.taskId === task.id);
    return { task, progress };
  });
};

  return (
    <div className="flex h-screen w-full">
      <ControlPanel
        drones={drones}
        tasks={tasks}
        selectedDroneId={selectedDroneId}
        onSelectDrone={handleSelectDrone}
        onAddDrone={handleAddDrone}
        onAddTask={() => setIsTaskDialogOpen(true)}
        onStartTask={handleStartTask}
      />

      <div className="w-3/4 relative">
        {isSelectingTarget && (
          <div className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded z-[1000]">
            Hedef nokta seçmek için haritaya tıklayın
          </div>
        )}

        <MapContainer
          center={[ankara[0], ankara[1]]}
          zoom={13}
          className="h-full w-full z-0"
        >
          <MapInitializer onInit={(map) => { mapRef.current = map; }} />
      
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

          {getTaskRoutes().map(({ task, progress }) => (
            <div key={`task-${task.id}`}>
              <Polyline
                positions={[
                  [task.startPosition[0], task.startPosition[1]],
                  [task.targetPosition[0], task.targetPosition[1]],
                ]}
                color={task.color}
                weight={3}
                opacity={task.status === "completed" ? 0.6 :
                  task.status === "active" ? 0.8 : 0.5
                }
                dashArray={task.status === "completed" ? "5, 5" : 
                  task.status === "pending" ? "1,5" : "10, 5"}
              />

              {progress && (
                <CircleMarker
                  center={progress.currentPosition}
                  radius={task.status === "completed" ? 6 : 8}
                  color={task.status === "completed" ? "green" : "red"}
                  fillColor={task.status === "completed" ? "green" : "red"}
                  fillOpacity={task.status === "completed" ? 0.6 : 0.8}
                  weight={task.status === "completed" ? 2 : 3}
                >
                  <Tooltip permanent direction="top" offset={[0, -10]}>
                    <div className="text-xs font-semibold">
                      <div>{Math.round(progress.elapsedMs)}ms</div>
                      {task.status === "completed" && (
                        <div className="text-green-600">✅ Tamamlandı</div>
                      )}
                      {task.status === "active" && (
                        <div className="text-blue-600">🔄 Devam ediyor</div>
                      )}
                    </div>
                  </Tooltip>
                </CircleMarker>
              )}

              {progress &&
                progress.path.length > 1 &&
                progress.path.slice(1).map((point, index) => (
                  <CircleMarker
                    key={`path-${task.id}-${index}`}
                    center={point}
                    radius={task.status === "completed" ? 2 : 3}
                    color={
                      task.status === "completed" ? "darkgreen" : "orange"
                    }
                    fillColor={
                      task.status === "completed" ? "darkgreen" : "orange"
                    }
                    fillOpacity={task.status === "completed" ? 0.4 : 0.6}
                    weight={1}
                  >
                    <Tooltip direction="top" offset={[0, -5]}>
                      <div className="text-xs">Saniye: {index + 1}</div>
                    </Tooltip>
                  </CircleMarker>
                ))}
            </div>
          ))}
        </MapContainer>
      </div>

      <TaskDialog
        isOpen={isTaskDialogOpen && !isTaskDialogTemporarilyHidden}
        drone={selectedDrone}
        onClose={() => setIsTaskDialogOpen(false)}
        onAddTask={handleAddTask}
        onSelectTarget={(callback) => {
          setTargetSelectCallback(() => (position: [number, number]) => {
            callback(position);
            setIsTaskDialogTemporarilyHidden(false);
          });
          setIsSelectingTarget(true);
          setIsTaskDialogTemporarilyHidden(true);
        }}
      />
    </div>
  );
};

export default Map;
