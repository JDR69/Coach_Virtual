import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import YogaPoseDetector from '../../../Yoga/YogaPoseDetector';

export default function RemoConMancuernas() {
  const [started, setStarted] = useState(false);
  const location = useLocation();
  const passedImage = location?.state?.imageUrl || null;
  const passedNombre = location?.state?.nombre || null;

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Remo con mancuernas</h1>
          <p className="text-gray-600 mb-6 text-lg">Rutina de remo con mancuernas para espalda media y alta. La IA comprobará rango y simetría.</p>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-56 flex items-center justify-center overflow-hidden bg-gray-100">
              {passedImage ? (
                <img src={passedImage} alt={passedNombre || 'Remo con mancuernas'} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-6xl">🏋️‍♂️</span>
                </div>
              )}
            </div>
            <div className="p-6 space-y-4">
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                <li>Inclina el torso manteniendo espalda neutral.</li>
                <li>Tira con la zona dorsal, no con los brazos.</li>
                <li>Evita rotaciones bruscas del tronco.</li>
              </ul>
              <button onClick={() => setStarted(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
                Iniciar rutina
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-indigo-900">🏋️‍♂️ Remo con mancuernas (Rutina)</h1>
          <button onClick={() => setStarted(false)} className="text-sm text-indigo-600 hover:text-indigo-800 underline">Volver a descripción</button>
        </div>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <YogaPoseDetector onPoseDetected={() => {}} />
        </div>
      </div>
    </div>
  );
}
