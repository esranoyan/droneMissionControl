# 02 - Veri Modeli Tanımı

## 🛩️ Drone

```ts
interface Drone {
  id: string;
  position: { lat: number; lng: number };
  speed: number;
  heading: number;
  state: "idle" | "moving" | "waiting";
}
```

## 🎯 Task

```ts
interface Task {
  id: string;
  type: "goto" | "scan";
  target: { lat: number; lng: number };
  assignedDroneId?: string;
}
```

## 🧱 Obstacle

```ts
interface Obstacle {
  id: string;
  shape: "circle" | "rectangle";
  center: { lat: number; lng: number };
  radius?: number; // for circle
  width?: number;
  height?: number; // for rectangle
}
```

## 🔁 JSON Örnekleri

### Drone JSON

```json
{
  "id": "drone-1",
  "position": { "lat": 40.0, "lng": 29.0 },
  "speed": 10,
  "heading": 90,
  "state": "moving"
}
```

### Task JSON

```json
{
  "id": "task-42",
  "type": "goto",
  "target": { "lat": 40.001, "lng": 29.002 },
  "assignedDroneId": "drone-1"
}
```
