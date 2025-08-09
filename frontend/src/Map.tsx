import { useState, useRef, useEffect } from "react";
import {MapContainer, TileLayer, useMapEvents, Polyline, CircleMarker, Tooltip, useMap,} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import ControlPanel from "./components/ControlPanel";
import DroneMarker from "./components/DroneMarker";
import TaskDialog from "./components/TaskDialog";
import { type DroneTaskQueue, type Task, type TaskProgress } from "./types/drone";
import { useDroneData } from "./hooks/useDroneData";
import { DroneService } from "./services/droneService";
import { TaskService } from "./services/taskService";
import { MissionService } from "./services/missionService";

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
  useEffect(() => {
    onInit(map);
  }, [map, onInit]);
  return null;
};


const MapEventsHandler = ({
  setCenter,
  setZoom,
}: {
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
}) => {
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      setCenter([center.lat, center.lng]);
    },
    zoomend: () => {
      setZoom(map.getZoom());
    },
  });
  return null;
};

const Map = () => {
  const ankara: [number, number, number] = [39.92077, 32.85411, 850];
  const mapRef = useRef<L.Map | null>(null);

  // Veritabanı hook'u kullan
  const { 
    drones, 
    tasks, 
    loading, 
    error, 
    loadData, 
    addDrone, 
    addTask, 
    updateTaskStatus 
  } = useDroneData();

  //Harita konumu ve zoom seviyesi için state'ler
  const [mapCenter, setMapCenter] = useState<[number, number]>([ankara[0], ankara[1]]);
  const [mapZoom, setMapZoom] = useState<number>(13);

  // Local state'ler
  const [selectedDroneId, setSelectedDroneId] = useState<number | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isTaskDialogTemporarilyHidden, setIsTaskDialogTemporarilyHidden] = useState(false);
  const [isSelectingTarget, setIsSelectingTarget] = useState(false);
  const [targetSelectCallback, setTargetSelectCallback] =
    useState<((position: [number, number]) => void) | null>(null);

  // Simülasyon ile ilgili state'ler
  const [taskProgresses, setTaskProgresses] = useState<TaskProgress[]>([]);
  const [droneTaskQueues, setDroneTaskQueues] = useState<DroneTaskQueue[]>([]);
  const [currentMissionSession, setCurrentMissionSession] = useState<number | null>(null);

  // Hata gösterimi
  useEffect(() => {
    if (error) {
      console.error('Veritabanı hatası:', error);
    }
  }, [error]);

  const handleSelectDrone = (id: number) => {
    setSelectedDroneId(id);
  };

  const handleAddDrone = async () => {
    try {
      const map = mapRef.current;
      if (!map) return;
      const name = `İHA-${String(drones.length + 1).padStart(3, "0")}`;
      const position: [number, number, number] = [ankara[0], ankara[1], ankara[2]];
      await addDrone(name, position);
      console.log('Yeni drone eklendi:', name);
    } catch (error) {
      console.error('Drone eklenirken hata:', error);
    }
  };

  const handleAddTask = async (taskData: Omit<Task, "id">) => {
    try {
      const droneExistingTasks = tasks.filter(t => 
        t.droneId === taskData.droneId && t.status !== 'completed'
      );
      const drone = drones.find(d => d.id === taskData.droneId);
      
      let startPosition = taskData.startPosition;
      
      if (droneExistingTasks.length > 0) {
        const lastTask = droneExistingTasks
          .sort((a, b) => b.id - a.id)[0];
        if (lastTask) {
          startPosition = lastTask.targetPosition;
        }
      } else if (drone) {
        startPosition = drone.position;
      }

      const newTaskData: Omit<Task, 'id'> = {
        ...taskData,
        startPosition,
      };

      await addTask(newTaskData);
      setIsTaskDialogOpen(false);
      console.log('Yeni görev eklendi:', newTaskData.description);
    } catch (error) {
      console.error('Görev eklenirken hata:', error);
    }
  };

  const [pendingTaskStart, setPendingTaskStart] = useState<{droneId: number, taskId: number} | null>(null);

  useEffect(() => {
    if (pendingTaskStart) {
      const { droneId, taskId } = pendingTaskStart;
      const drone = drones.find(d => d.id === droneId);
      const task = tasks.find(t => t.id === taskId);
      
      if (drone && task) {
        updateTaskStatus(taskId, 'active').then(() => {
          DroneService.updateDronePosition(droneId, drone.position, true);
          executeTask(task, droneId);
        }).catch(error => {
          console.error('Görev başlatılırken hata:', error);
        });
      }
      setPendingTaskStart(null);
    }
  }, [pendingTaskStart, drones, tasks, updateTaskStatus]);

  const startNextTaskForDroneSimple = (droneId: number) => {
    const queue = droneTaskQueues.find(q => q.droneId === droneId);
    if (!queue || queue.taskIds.length === 0) {
      setDroneTaskQueues(prev => 
        prev.map(q => 
          q.droneId === droneId 
            ? { ...q, isProcessing: false }
            : q
        )
      );
      return;
    }
    const nextTaskId = queue.taskIds[0];
    setDroneTaskQueues(prev =>
      prev.map(q =>
        q.droneId === droneId
          ? { ...q, taskIds: q.taskIds.slice(1) }
          : q
      )
    );
    setPendingTaskStart({ droneId, taskId: nextTaskId });
  };

  const executeTask = async (task: Task, droneId: number) => {
    console.log('executeTask başladı:', { taskId: task.id, droneId, startPos: task.startPosition, targetPos: task.targetPosition });
    
    const duration = task.duration * 1000;
    const interval = 1000 / 30;
    const startTime = Date.now();
    const initialProgress: TaskProgress = {
      taskId: task.id,
      startTime,
      path: [[task.startPosition[0], task.startPosition[1]]],
      currentPosition: [task.startPosition[0], task.startPosition[1]],
      elapsedMs: 0,
    };
    
    setTaskProgresses((prev) => {
      const filtered = prev.filter(tp => tp.taskId !== task.id);
      return [...filtered, initialProgress];
    });

    const worker = new Worker(new URL('./workers/taskWorker.js', import.meta.url), { type: 'module' });

    worker.postMessage({
      task: { start: task.startPosition, end: task.targetPosition },
      duration,
      interval,
    });

    worker.onmessage = async (e) => {
      const { currentPosition, elapsed, isDone } = e.data;
      try {
        const newPosition: [number, number, number] = [currentPosition[0], currentPosition[1], task.startPosition[2]];
        await DroneService.updateDronePosition(droneId, newPosition, !isDone);
        if (elapsed % 1000 < 50) { 
          const progressPercentage = (elapsed / duration) * 100;
          await TaskService.recordTaskProgress(task.id, [currentPosition[0], currentPosition[1], task.startPosition[2]], elapsed, progressPercentage);
        }
        setTaskProgresses((prev) =>
          prev.map((tp) =>
            tp.taskId === task.id
              ? { ...tp, currentPosition, elapsedMs: elapsed, path: elapsed % 1000 < 16 ? [...tp.path, currentPosition] : tp.path }
              : tp
          )
        );
        if (isDone) {
          console.log('Görev tamamlandı:', task.id);
          worker.terminate();
          await updateTaskStatus(task.id, 'completed');
          await DroneService.updateDronePosition(droneId, task.targetPosition, false);
          setTaskProgresses((prev) =>
            prev.map((tp) =>
              tp.taskId === task.id
                ? { ...tp, currentPosition: [task.targetPosition[0], task.targetPosition[1]] }
                : tp
            )
          );
          setTimeout(() => {
            loadData();
            startNextTaskForDroneSimple(droneId);
          }, 100);
        }
      } catch (error) {
        console.error('Görev simülasyonu sırasında hata:', error);
      }
    };
    worker.onerror = (error) => {
      console.error('Worker hatası:', error);
      worker.terminate();
    };
  };

  const handleStartTask = async (taskId: number) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;
      const drone = drones.find((d) => d.id === task.droneId);
      if (!drone) return;
      await updateTaskStatus(taskId, 'active');
      executeTask(task, task.droneId);
    } catch (error) {
      console.error('Görev başlatılırken hata:', error);
    }
  };

  const handleStartAllTasks = async () => {
    try {
      if (!currentMissionSession) {
        const session = await MissionService.createMissionSession(`Mission ${new Date().toLocaleString()}`, 'Toplu görev başlatma');
        setCurrentMissionSession(session.id);
        await MissionService.updateSessionStatus(session.id, 'running');
      }
      const pendingTasks = tasks.filter(t => t.status === 'pending');
      for (const task of pendingTasks) {
        setTimeout(() => {
          handleStartTask(task.id);
        }, task.id % 1000);
      }
      console.log(`${pendingTasks.length} görev başlatıldı`);
    } catch (error) {
      console.error('Toplu görev başlatma hatası:', error);
    }
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

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-lg">Veriler yükleniyor...</div>
      </div>
    );
  }

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
        onStartAllTasks={handleStartAllTasks}
      />
      <div className="w-3/4 relative">
        {error && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded z-[1000]">
            Hata: {error}
          </div>
        )}
        {isSelectingTarget && (
          <div className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded z-[1000]">
            Hedef nokta seçmek için haritaya tıklayın
          </div>
        )}
        {currentMissionSession && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded z-[1000]">
            Mission Session: {currentMissionSession}
          </div>
        )}

        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          className="h-full w-full z-0"
        >
          <MapInitializer onInit={(map) => { mapRef.current = map; }} />
          
          {/*Harita olaylarını dinleyici bileşen */}
          <MapEventsHandler setCenter={setMapCenter} setZoom={setMapZoom} />
          
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
        tasks={tasks}
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