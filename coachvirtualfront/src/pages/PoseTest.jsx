import { useState, useRef, useEffect } from 'react';
import PoseDetector from '../components/PoseDetector';
import { fetchGroqCompletion } from '../services/groqClient';
import { useSpeech } from '../utils/useSpeech';

export default function PoseTest() {
  const [poseData, setPoseData] = useState(null);
  const [aiResponse, setAiResponse] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [autoAnalyze, setAutoAnalyze] = useState(false);
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
    if (poseData) {
      const landmarks = [
        poseData.nose,
        null, null, null, null, null, null, null, null, null, null,
        poseData.leftShoulder,
        poseData.rightShoulder,
        poseData.leftElbow,
        poseData.rightElbow,
        poseData.leftWrist,
        poseData.rightWrist,
      ];
      analyzePoseWithAI(landmarks);
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
                )}
              </button>

              {/* Botón detener voz */}
              {speaking && (
                <button 
                  onClick={stop}
                  className="w-full mt-3 bg-red-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
                >
                  <span className="mr-2">⏹️</span>
                  Detener voz
                </button>
              )}

              {/* Respuesta de la IA */}
              {aiResponse && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <span className="text-blue-500 mr-2 text-xl">🤖</span>
                    <div className="flex-1">
                      <p className="text-sm text-blue-900 font-medium">Asistente:</p>
                      <p className="text-sm text-blue-800 mt-1">{aiResponse}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pose data display */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">📊 Datos de Pose</h2>
              {poseData ? (
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Nariz:</strong>
                    <div className="ml-2 text-gray-600">
                      x: {poseData.nose.x.toFixed(3)}<br />
                      y: {poseData.nose.y.toFixed(3)}<br />
                      z: {poseData.nose.z.toFixed(3)}
                    </div>
                  </div>
                  <div>
                    <strong>Muñeca Izq:</strong>
                    <div className="ml-2 text-gray-600">
                      y: {poseData.leftWrist.y.toFixed(3)}
                    </div>
                  </div>
                  <div>
                    <strong>Muñeca Der:</strong>
                    <div className="ml-2 text-gray-600">
                      y: {poseData.rightWrist.y.toFixed(3)}
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
          <h3 className="font-semibold text-blue-900 mb-2">💡 Instrucciones:</h3>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>Permita el acceso a la cámara cuando se solicite</li>
            <li>Colóquese frente a la cámara con buena iluminación</li>
            <li>Activa el análisis automático o presiona "Analizar ahora" manualmente</li>
            <li>El asistente describirá tu postura y te dará retroalimentación por voz</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
