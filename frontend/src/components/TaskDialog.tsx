import { useState } from "react";
import { type TaskDialogProps, type Task } from "../types/drone";

const TaskDialog: React.FC<TaskDialogProps & { 
  onSelectTarget: (callback: (position: [number, number]) => void) => void 
}> = ({
  isOpen,
  drone,
  onClose,
  onAddTask,
  onSelectTarget,
}) => {
  const [targetPosition, setTargetPosition] = useState<[number, number, number] | null>(null);
  const [duration, setDuration] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleSelectTarget = () => {
    onSelectTarget((position: [number, number]) => {
      setTargetPosition([position[0], position[1], 850]); // Varsayılan yükseklik
    });
  };

  const handleAddTask = () => {
    if (!drone || !targetPosition || !duration || !description) {
      alert("Lütfen tüm alanları doldurun");
      return;
    }

    const taskData: Omit<Task, 'id'> = {
      droneId: drone.id,
      droneName: drone.name,
      startPosition: [...drone.position],
      targetPosition: targetPosition,
      duration: parseInt(duration),
      description,
      status: 'pending'
    };

    onAddTask(taskData);

    // Form'u temizle
    setTargetPosition(null);
    setDuration("");
    setDescription("");
  };

  const handleAltitudeChange = (altitude: string) => {
    if (targetPosition) {
      setTargetPosition([targetPosition[0], targetPosition[1], parseFloat(altitude) || 0]);
    }
  };

  if (!isOpen || !drone) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">
          Görev Ekle - {drone.name}
        </h2>
        
        <div className="space-y-4">
          {/* Hedef Pozisyon Seçimi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hedef Pozisyon
            </label>
            <button
              onClick={handleSelectTarget}
              className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {targetPosition 
                ? `X: ${targetPosition[0].toFixed(1)}, Y: ${targetPosition[1].toFixed(1)}, Z: ${targetPosition[2].toFixed(1)}`
                : "Haritadan Hedef Seç"
              }
            </button>
          </div>

          {/* Yükseklik Ayarı */}
          {targetPosition && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yükseklik (m)
              </label>
              <input
                type="number"
                value={targetPosition[2]}
                onChange={(e) => handleAltitudeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="2000"
                step="10"
              />
            </div>
          )}

          {/* Süre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Süre (saniye)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              placeholder="Görev süresi"
            />
          </div>

          {/* Açıklama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Görev açıklaması"
            />
          </div>
        </div>

        {/* Butonlar */}
        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            İptal
          </button>
          <button
            onClick={handleAddTask}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!targetPosition || !duration || !description}
          >
            Görev Ekle
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDialog;