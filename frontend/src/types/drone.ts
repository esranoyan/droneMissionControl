export interface Drone {
  id: number;
  name: string;
  position: [number, number, number]; // lat, lng, altitude
  task?: string;
  isMoving?: boolean;
}

export interface Task {
  id: number;
  droneId: number;
  droneName: string;
  startPosition: [number, number, number];
  targetPosition: [number, number, number];
  duration: number; // saniye
  description: string;
  status: 'pending' | 'active' | 'completed';
}

export interface DroneListProps {
  drones: Drone[];
  selectedDroneId: number | null;
  onSelectDrone: (id: number) => void;
  // onRemoveDrone: (id: number) => void;
}

export interface TaskListProps {
  tasks: Task[];
  onStartTask: (taskId: number) => void;
}

export interface DroneMarkerProps {
  drone: Drone;
  isSelected?: boolean;
}

export interface ControlPanelProps {
  drones: Drone[];
  tasks: Task[];
  selectedDroneId: number | null;
  onSelectDrone: (id: number) => void;
  onAddTask: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onStartTask: (taskId: number) => void;
  // onRemoveDrone: (id: number) => void;
}

export interface TaskDialogProps {
  isOpen: boolean;
  drone: Drone | null;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
}