import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import YogaPoseDetector from '../../../Yoga/YogaPoseDetector';

export default function FlexionEspaldaPiernaAbdomen() {
  const [started, setStarted] = useState(false);
  const location = useLocation();
  const passedImage = location?.state?.imageUrl || null;
  const passedNombre = location?.state?.nombre || 'Flexión de espalda, pierna y abdomen';

  const handlePoseDetected = () => {};

  if (!started) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">{passedNombre}</h1>
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="h-56 bg-gray-100 flex items-center justify-center">
              {passedImage ? (
                <img src={passedImage} alt={passedNombre} className="w-full h-full object-cover" />
              ) : (
                <div className="text-5xl">🤸‍♀️</div>
              )}
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">Secuencia para movilizar la columna, piernas y activar abdominales con control respiratorio.</p>
              <button onClick={() => setStarted(true)} className="w-full bg-blue-600 text-white py-3 rounded">Iniciar rutina</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{passedNombre} — Rutina (Fisioterapia)</h2>
          <button onClick={() => setStarted(false)} className="text-sm text-blue-600 underline">Volver</button>
        </div>
        <div className="bg-white rounded shadow overflow-hidden">
          <YogaPoseDetector onPoseDetected={handlePoseDetected} />
        </div>
      </div>
    </div>
  );
}
