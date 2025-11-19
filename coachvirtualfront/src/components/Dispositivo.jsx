import React, { useEffect, useState } from 'react';
import { getGoogleFitStats, startStatsPolling } from '../services/Dispositivo';

function Dispositivo() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Primer fetch inmediato y luego polling cada 10s
    let stop = startStatsPolling(setStats, setError, 10000);
    return () => stop && stop();
  }, []);

  return (
    <div className="fixed top-24 right-4 w-80 bg-white/90 backdrop-blur rounded-xl shadow-lg border border-gray-200 p-4 z-50">
      <h2 className="text-lg font-semibold mb-2">Google Fit (Tiempo real)</h2>
      {error && <div className="text-red-600 text-sm mb-2">No se pudo cargar datos</div>}
      {stats ? (
        <div className="space-y-1 text-sm">
          <div className="flex justify-between"><span className="text-gray-600">Pasos:</span><span className="font-medium">{stats.steps}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Calorías:</span><span className="font-medium">{stats.calories}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Frecuencia:</span><span className="font-medium">{stats.heartRate} bpm</span></div>
          <div className="flex justify-between text-xs text-gray-500 pt-1"><span>Cuenta:</span><span>{stats.owner}</span></div>
          <div className="text-xs text-gray-400">{stats.fecha}</div>
        </div>
      ) : (
        <div className="text-gray-500 text-sm">Cargando datos...</div>
      )}
    </div>
  );
}

export default Dispositivo;
