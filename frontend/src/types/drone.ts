export interface Drone {
  id: number;
  name: string;
  position: [number, number];
  task?: string;
}

export interface DroneListProps {
  drones: Drone[];
  onAssignTask: (id: number) => void;
  onRemoveDrone: (id: number) => void;
}

export interface TaskListProps {
  drones: Drone[];
}

export interface DroneMarkerProps {
  drone: Drone;
}

export interface ControlPanelProps {
  drones: Drone[];
  onAddDrone: () => void;
  onAssignTask: (id: number) => void;
  onRemoveDrone: (id: number) => void;
}