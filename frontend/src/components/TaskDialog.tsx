import { useState, useEffect } from "react";
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
  const [descriptionError, setDescriptionError] = useState<boolean>(false);
  const [color, setColor] = useState<string>("#0088ff");

  // Varsayılan açıklama oluşturma fonksiyonu
  const generateDefaultDescription = () => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} zamanlı oluşturulan görev`;
  };

  // Dialog açıldığında varsayılan açıklamayı ayarla
  useEffect(() => {
    if (isOpen && drone) {
      setDescription(generateDefaultDescription());
      setDescriptionError(false);
    }
  }, [isOpen, drone]);

  const handleSelectTarget = () => {
    onSelectTarget((position: [number, number]) => {
      setTargetPosition([position[0], position[1], 850]); // Varsayılan yükseklik
    });
  };

  const handleAddTask = () => {
    // Açıklama validasyonu
    if (!description.trim()) {
      setDescriptionError(true);
      return;
    }

    if (!drone || !targetPosition || !duration) {
      alert("Lütfen tüm alanları doldurun");
      return;
    }

    const taskData: Omit<Task, 'id'> = {
      droneId: drone.id,
      droneName: drone.name,
      startPosition: [...drone.position],
      targetPosition: targetPosition,
      duration: parseInt(duration),
      description: description.trim(),
      status: 'pending',
      color: color
    };

    onAddTask(taskData);

    // Form'u temizle
    setTargetPosition(null);
    setDuration("");
    setDescription("");
    setDescriptionError(false);
  };

  const handleAltitudeChange = (altitude: string) => {
    if (targetPosition) {
      setTargetPosition([targetPosition[0], targetPosition[1], parseFloat(altitude) || 0]);
    }
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    // Kullanıcı yazmaya başladığında hatayı temizle
    if (descriptionError && value.trim()) {
      setDescriptionError(false);
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
              onChange={(e) => handleDescriptionChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                descriptionError 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              rows={3}
              placeholder="Görev açıklaması"
            />
            {descriptionError && (
              <p className="text-red-500 text-xs mt-1">
                Görev detayı boş olamaz
              </p>
            )}
          </div>
        </div>

        {/*Renk Seçimi*/}
       <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rota Rengi
        </label>
       <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
       className="w-full h-10 p-1 border border-gray-300 rounded-md cursor-pointer"
       /> 
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
            disabled={!targetPosition || !duration}
          >
            Görev Ekle
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDialog;