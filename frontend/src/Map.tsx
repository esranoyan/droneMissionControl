import { useState } from "react";
import { MapContainer, TileLayer, useMapEvents, Polyline, CircleMarker, Tooltip } from "react-leaflet";
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

const Map = () => {
  const ankara: [number, number, number] = [39.92077, 32.85411, 850];

  const [drones, setDrones] = useState<Drone[]>([
    {
      id: 1,
      name: "İHA-001",
      position: [39.92077, 32.85411, 850],
      isMoving: false,
    },
  ]);

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

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: "active" as const } : t
      )
    );

    const drone = drones.find((d) => d.id === task.droneId);
    if (!drone) return;

    setDrones((prev) =>
      prev.map((d) =>
        d.id === task.droneId ? { ...d, isMoving: true } : d
      )
    );

    const startTime = Date.now();
    const startPos = task.startPosition;
    const targetPos = task.targetPosition;
    const duration = task.duration * 1000;

    const taskProgress: TaskProgress = {
      taskId: taskId,
      startTime: startTime,
      path: [[startPos[0], startPos[1]]],
      currentPosition: [startPos[0], startPos[1]],
      elapsedMs: 0
    };

    setTaskProgresses(prev => [...prev, taskProgress]);

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // 🔵 Elapsed log her saniye başında
      if (elapsed % 1000 < 16) {
        console.log(`Görev #${taskId} - Elapsed: ${elapsed}ms (${(elapsed / 1000).toFixed(2)}s)`);
      }

      const currentLat =
        startPos[0] + (targetPos[0] - startPos[0]) * progress;
      const currentLng =
        startPos[1] + (targetPos[1] - startPos[1]) * progress;
      const currentAlt =
        startPos[2] + (targetPos[2] - startPos[2]) * progress;

      setDrones((prev) =>
        prev.map((d) =>
          d.id === task.droneId
            ? { ...d, position: [currentLat, currentLng, currentAlt] }
            : d
        )
      );

      setTaskProgresses(prev =>
        prev.map(tp =>
          tp.taskId === taskId
            ? {
                ...tp,
                currentPosition: [currentLat, currentLng],
                elapsedMs: elapsed,
                path: elapsed % 1000 < 16 ? [...tp.path, [currentLat, currentLng]] : tp.path
              }
            : tp
        )
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDrones((prev) =>
          prev.map((d) =>
            d.id === task.droneId ? { ...d, isMoving: false } : d
          )
        );
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId ? { ...t, status: "completed" as const, actualDuration: Math.round(elapsed / 1000) } : t
          )
        );

        setTaskProgresses(prev =>
          prev.map(tp =>
            tp.taskId === taskId
              ? {
                  ...tp,
                  currentPosition: [targetPos[0], targetPos[1]],
                  elapsedMs: elapsed,
                  path: [...tp.path, [targetPos[0], targetPos[1]]]
                }
              : tp
          )
        );

        // 🔵 Tamamlandığında logla
        console.log(`Görev #${taskId} tamamlandı. Toplam süre: ${elapsed}ms (${(elapsed / 1000).toFixed(2)}s)`);
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

  const selectedDrone = selectedDroneId
    ? drones.find((d) => d.id === selectedDroneId) || null
    : null;

  const getTaskRoutes = () => {
    return tasks
      .filter(task => task.status === 'active' || task.status === 'completed')
      .map(task => {
        const progress = taskProgresses.find(tp => tp.taskId === task.id);
        return { task, progress };
      })
      .filter(({ progress }) => progress !== undefined);
  };

  return (
    <div className="flex h-screen w-full">
      <ControlPanel
        drones={drones}
        tasks={tasks}
        selectedDroneId={selectedDroneId}
        onSelectDrone={handleSelectDrone}
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
                  [task.targetPosition[0], task.targetPosition[1]]
                ]}
                color={task.status === 'completed' ? 'green' : 'blue'}
                weight={3}
                opacity={task.status === 'completed' ? 0.6 : 0.7}
                dashArray={task.status === 'completed' ? "5, 5" : "10, 5"}
              />

              {progress && (
                <CircleMarker
                  center={progress.currentPosition}
                  radius={task.status === 'completed' ? 6 : 8}
                  color={task.status === 'completed' ? 'green' : 'red'}
                  fillColor={task.status === 'completed' ? 'green' : 'red'}
                  fillOpacity={task.status === 'completed' ? 0.6 : 0.8}
                  weight={task.status === 'completed' ? 2 : 3}
                >
                  <Tooltip permanent direction="top" offset={[0, -10]}>
                    <div className="text-xs font-semibold">
                      <div>{Math.round(progress.elapsedMs)}ms</div>
                      {task.status === 'completed' && (
                        <div className="text-green-600">✅ Tamamlandı</div>
                      )}
                      {task.status === 'active' && (
                        <div className="text-blue-600">🔄 Devam ediyor</div>
                      )}
                    </div>
                  </Tooltip>
                </CircleMarker>
              )}

              {progress && progress.path.length > 1 && progress.path.slice(1).map((point, index) => (
                <CircleMarker
                  key={`path-${task.id}-${index}`}
                  center={point}
                  radius={task.status === 'completed' ? 2 : 3}
                  color={task.status === 'completed' ? 'darkgreen' : 'orange'}
                  fillColor={task.status === 'completed' ? 'darkgreen' : 'orange'}
                  fillOpacity={task.status === 'completed' ? 0.4 : 0.6}
                  weight={1}
                >
                  <Tooltip direction="top" offset={[0, -5]}>
                    <div className="text-xs">
                      Saniye: {index + 1}
                    </div>
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
