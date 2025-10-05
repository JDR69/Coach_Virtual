import { useState } from 'react';
import PoseDetector from '../components/PoseDetector';

export default function PoseTest() {
  const [poseData, setPoseData] = useState(null);

  const handlePoseDetected = (landmarks) => {
    // Update pose data (only show first few landmarks to avoid clutter)
    setPoseData({
      nose: landmarks[0],
      leftShoulder: landmarks[11],
      rightShoulder: landmarks[12],
      leftElbow: landmarks[13],
      rightElbow: landmarks[14],
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Prueba de Detección de Poses</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camera view */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <PoseDetector onPoseDetected={handlePoseDetected} />
            </div>
          </div>

          {/* Pose data display */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Datos de Pose</h2>
              {poseData ? (
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Nariz:</strong>
                    <div className="ml-2">
                      x: {poseData.nose.x.toFixed(3)}<br />
                      y: {poseData.nose.y.toFixed(3)}<br />
                      z: {poseData.nose.z.toFixed(3)}
                    </div>
                  </div>
                  <div>
                    <strong>Hombro Izq:</strong>
                    <div className="ml-2">
                      x: {poseData.leftShoulder.x.toFixed(3)}<br />
                      y: {poseData.leftShoulder.y.toFixed(3)}<br />
                      z: {poseData.leftShoulder.z.toFixed(3)}
                    </div>
                  </div>
                  <div>
                    <strong>Hombro Der:</strong>
                    <div className="ml-2">
                      x: {poseData.rightShoulder.x.toFixed(3)}<br />
                      y: {poseData.rightShoulder.y.toFixed(3)}<br />
                      z: {poseData.rightShoulder.z.toFixed(3)}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Esperando detección...</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Instrucciones:</h3>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>Permita el acceso a la cámara cuando se solicite</li>
            <li>Colóquese frente a la cámara con buena iluminación</li>
            <li>Los puntos verdes y rojos muestran las articulaciones detectadas</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
