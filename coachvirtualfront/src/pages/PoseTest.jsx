import { useState, useRef } from 'react';
import PoseDetector from '../components/PoseDetector';
import { fetchGroqCompletion } from '../services/groqClient';
import { useSpeech } from '../utils/useSpeech';
import { calculateBodyAngles } from '../utils/poseUtils';
import { savePoseTrainingData } from '../services/poseTrainingApi';

export default function PoseTest() {
  const [poseData, setPoseData] = useState(null);
  const [currentLandmarks, setCurrentLandmarks] = useState(null);
  const [aiResponse, setAiResponse] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [autoAnalyze, setAutoAnalyze] = useState(false);
  
  // Estados para modo entrenamiento
  const [trainingMode, setTrainingMode] = useState(false);
  const [ejercicioActual, setEjercicioActual] = useState('flexion');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  // Secuencia de poses grabadas
  const [grabando, setGrabando] = useState(false);
  const [secuenciaDePoses, setSecuenciaDePoses] = useState([]);
  const [etiquetaSecuencia, setEtiquetaSecuencia] = useState('correcto');
  
  const lastAnalysisTime = useRef(0);
  const analysisInterval = 10000; 
  
  const { supported, speaking, speak, stop } = useSpeech({ lang: 'es-ES', rate: 1 });

  // Función para describir la pose actual
  const describePose = (landmarks) => {
    const nose = landmarks[0];
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    
    let description = 'Posición actual: ';
    
    // Detectar si las manos están levantadas
    if (leftWrist.y < leftShoulder.y && rightWrist.y < rightShoulder.y) {
      description += 'Ambas manos levantadas por encima de los hombros. ';
    } else if (leftWrist.y < leftShoulder.y) {
      description += 'Mano izquierda levantada. ';
    } else if (rightWrist.y < rightShoulder.y) {
      description += 'Mano derecha levantada. ';
    } else {
      description += 'Manos abajo. ';
    }
    
    return description;
  };

  const handlePoseDetected = (landmarks) => {
    // Guardar landmarks completos para el modo entrenamiento
    setCurrentLandmarks(landmarks);

    // Si está grabando, agregar el frame a la secuencia
    if (trainingMode && grabando) {
      setSecuenciaDePoses(prev => [
        ...prev,
        {
          landmarks: landmarks.map(l => ({ x: l.x, y: l.y, z: l.z, visibility: l.visibility })),
          angulos: calculateBodyAngles(landmarks),
          timestamp: Date.now()
        }
      ]);
    }

    // Update pose data (only show first few landmarks to avoid clutter)
    setPoseData({
      nose: landmarks[0],
      leftShoulder: landmarks[11],
      rightShoulder: landmarks[12],
      leftElbow: landmarks[13],
      rightElbow: landmarks[14],
      leftWrist: landmarks[15],
      rightWrist: landmarks[16],
    });

    // Auto-análisis con IA cada X segundos
    if (autoAnalyze) {
      const now = Date.now();
      if (now - lastAnalysisTime.current > analysisInterval) {
        lastAnalysisTime.current = now;
        analyzePoseWithAI(landmarks);
      }
    }
  };

  const analyzePoseWithAI = async (landmarks) => {
    if (isAnalyzing) return;
    
    setIsAnalyzing(true);
    try {
      const description = describePose(landmarks);
      const prompt = `Eres un entrenador personal. Describe brevemente y de manera motivadora lo que está haciendo la persona según estos datos: ${description}. Responde en máximo 2 oraciones cortas y con tono amigable.`;
      
      const response = await fetchGroqCompletion({ 
        prompt, 
        model: 'llama-3.1-8b-instant' 
      });
      
      setAiResponse(response);
      if (supported) {
        speak(response);
      }
    } catch (error) {
      console.error('Error al analizar pose:', error);
      setAiResponse('Error al analizar la pose');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleManualAnalysis = () => {
    if (currentLandmarks) {
      analyzePoseWithAI(currentLandmarks);
    }
  };

  // Función para guardar datos de entrenamiento
  // Guardar secuencia de poses
  const handleSaveSecuencia = async () => {
    if (secuenciaDePoses.length === 0) {
      setSaveMessage('❌ No hay secuencia grabada para guardar');
      return;
    }
    setIsSaving(true);
    setSaveMessage('');
    try {
      const trainingData = {
        ejercicio: ejercicioActual,
        secuencia: secuenciaDePoses,
        etiqueta: etiquetaSecuencia
      };
      await savePoseTrainingData(trainingData);
      setSaveMessage(`✅ Secuencia guardada como "${etiquetaSecuencia}" (${secuenciaDePoses.length} frames)`);
      setSecuenciaDePoses([]);
      setGrabando(false);
      if (supported) {
        speak(`Secuencia guardada como ${etiquetaSecuencia}`);
      }
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error al guardar secuencia:', error);
      setSaveMessage('❌ Error al guardar: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🤖 Detección de Poses con IA</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camera view */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <PoseDetector onPoseDetected={handlePoseDetected} />
            </div>
          </div>

          {/* Control and data panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Modo Entrenamiento */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">🎯 Modo Entrenamiento</h2>
              
              {/* Toggle modo entrenamiento */}
              <div className="flex items-center mb-4">
                <input 
                  type="checkbox" 
                  id="trainingMode"
                  checked={trainingMode} 
                  onChange={e => setTrainingMode(e.target.checked)} 
                  className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="trainingMode" className="ml-3 text-sm font-medium text-gray-700">
                  Activar modo entrenamiento
                </label>
              </div>

              {trainingMode && (
                <>
                  {/* Selector de ejercicio */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ejercicio:</label>
                    <select 
                      value={ejercicioActual} 
                      onChange={e => setEjercicioActual(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="flexion">Flexión</option>
                      <option value="sentadilla">Sentadilla</option>
                      <option value="plancha">Plancha</option>
                    </select>
                  </div>

                  {/* Controles de grabación */}
                  <div className="mb-4 flex gap-2">
                    {!grabando ? (
                      <button
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={() => { setGrabando(true); setSecuenciaDePoses([]); }}
                        disabled={grabando}
                      >
                        Iniciar grabación
                      </button>
                    <div>
                      {/* Selector de ejercicio */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ejercicio:</label>
                        <select 
                          value={ejercicioActual} 
                          onChange={e => setEjercicioActual(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                          <option value="flexion">Flexión</option>
                          <option value="sentadilla">Sentadilla</option>
                          <option value="plancha">Plancha</option>
                          <option value="curl_biceps">Curl de Bíceps</option>
                          <option value="press_hombros">Press de Hombros</option>
                        </select>
                      </div>

                      {/* Controles de grabación */}
                      <div className="mb-4 flex gap-2">
                        {!grabando ? (
                          <button
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            onClick={() => { setGrabando(true); setSecuenciaDePoses([]); }}
                            disabled={grabando}
                          >
                            Iniciar grabación
                          </button>
                        ) : (
                          <button
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            onClick={() => setGrabando(false)}
                          >
                            Detener grabación
                          </button>
                        )}
                      </div>

                      {/* Guardar secuencia */}
                      {!grabando && secuenciaDePoses.length > 0 && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Etiqueta de la secuencia:</label>
                          <select
                            value={etiquetaSecuencia}
                            onChange={e => setEtiquetaSecuencia(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 mb-2"
                          >
                            <option value="correcto">Correcto</option>
                            <option value="incorrecto">Incorrecto</option>
                          </select>
                          <button
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
                            onClick={handleSaveSecuencia}
                            disabled={isSaving}
                          >
                            Guardar secuencia ({secuenciaDePoses.length} frames)
                          </button>
                        </div>
                      )}

                      {/* Mensaje de guardado */}
                      {saveMessage && (
                        <div className="text-sm mt-2 font-semibold text-green-700">{saveMessage}</div>
                      )}
                    </div>
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 mb-2"
                      >
                        <option value="correcto">Correcto</option>
                        <option value="incorrecto">Incorrecto</option>
                      </select>
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
                        onClick={handleSaveSecuencia}
                        disabled={isSaving}
                      >
                        Guardar secuencia ({secuenciaDePoses.length} frames)
                      </button>
                    </div>
                  )}

                  {/* Mensaje de guardado */}
                  {saveMessage && (
                    <div className="text-sm mt-2 font-semibold text-green-700">{saveMessage}</div>
                  )}
                </>
              )}
                      <option value="curl_biceps">Curl de Bíceps</option>
                      <option value="press_hombros">Press de Hombros</option>
                    </select>
                  {/* ...existing code... (ya corregido arriba) */}
                </>
              )}
            </div>

            {/* Controles de IA */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">🎙️ Asistente IA</h2>
              
              {/* Toggle auto-análisis */}
              <div className="flex items-center mb-4">
                <input 
                  type="checkbox" 
                  id="autoAnalyze"
                  checked={autoAnalyze} 
                  onChange={e => setAutoAnalyze(e.target.checked)} 
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="autoAnalyze" className="ml-3 text-sm font-medium text-gray-700">
                  Análisis automático (cada 5s)
                </label>
              </div>

              {/* Botón de análisis manual */}
              <button 
                onClick={handleManualAnalysis}
                disabled={isAnalyzing || !poseData}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analizando...
                  </>
                ) : (
                  <>
                    <span className="mr-2">✨</span>
                    Analizar ahora
                  </>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Camera view */}
                          <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                              <PoseDetector onPoseDetected={handlePoseDetected} />
                            </div>
                          </div>
                          {/* Control and data panel */}
                          <div className="lg:col-span-1 space-y-6">
                            {/* Modo Entrenamiento */}
                            <div className="bg-white rounded-lg shadow-lg p-6">
                              <h2 className="text-xl font-semibold mb-4">🎯 Modo Entrenamiento</h2>
                              {trainingMode && (
                                <div>
                                  {/* Selector de ejercicio */}
                                  <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Ejercicio:</label>
                                    <select 
                                      value={ejercicioActual} 
                                      onChange={e => setEjercicioActual(e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    >
                                      <option value="flexion">Flexión</option>
                                      <option value="sentadilla">Sentadilla</option>
                                      <option value="plancha">Plancha</option>
                                      <option value="curl_biceps">Curl de Bíceps</option>
                                      <option value="press_hombros">Press de Hombros</option>
                                    </select>
                                  </div>
                                  {/* Controles de grabación */}
                                  <div className="mb-4 flex gap-2">
                                    {!grabando ? (
                                      <button
                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                        onClick={() => { setGrabando(true); setSecuenciaDePoses([]); }}
                                        disabled={grabando}
                                      >
                                        Iniciar grabación
                                      </button>
                                    ) : (
                                      <button
                                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                        onClick={() => setGrabando(false)}
                                      >
                                        Detener grabación
                                      </button>
                                    )}
                                  </div>
                                  {/* Guardar secuencia */}
                                  {!grabando && secuenciaDePoses.length > 0 && (
                                    <div className="mb-4">
                                      <label className="block text-sm font-medium text-gray-700 mb-2">Etiqueta de la secuencia:</label>
                                      <select
                                        value={etiquetaSecuencia}
                                        onChange={e => setEtiquetaSecuencia(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 mb-2"
                                      >
                                        <option value="correcto">Correcto</option>
                                        <option value="incorrecto">Incorrecto</option>
                                      </select>
                                      <button
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
                                        onClick={handleSaveSecuencia}
                                        disabled={isSaving}
                                      >
                                        Guardar secuencia ({secuenciaDePoses.length} frames)
                                      </button>
                                    </div>
                                  )}
                                  {/* Mensaje de guardado */}
                                  {saveMessage && (
                                    <div className="text-sm mt-2 font-semibold text-green-700">{saveMessage}</div>
                                  )}
                                </div>
                              )}
                            </div>
                            {/* ...otros paneles... */}
                          </div>
                        </div>
