import { useState, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import YogaPoseDetector from '../../../Yoga/YogaPoseDetector';
import { calculateBodyAngles } from '../../../../utils/poseUtils';
import { useSpeech } from '../../../../utils/useSpeech';

/**
 * Vista de rutina de Remo Sentado (Seated Row Machine)
 * * Lógica de Detección:
 * 1. Brazos: Detectar extensión completa y flexión (jalón) completa.
 * 2. Torso (Trampa): Verificar que el usuario no se incline excesivamente hacia atrás (>115°) 
 * para usar impulso. El torso debe permanecer relativamente vertical.
 */
export default function RemoSentadoMaquina() {
  // --- ESTADO UI ---
  const [started, setStarted] = useState(false);
  const location = useLocation();
  const passedImage = location?.state?.imageUrl || null;
  const passedNombre = location?.state?.nombre || null;

  // --- ESTADO LÓGICA IA ---
  const [repCount, setRepCount] = useState(0);
  const [stage, setStage] = useState('extended'); // 'extended', 'pulling', 'squeezing', 'returning'
  const [feedback, setFeedback] = useState('Siéntate con espalda recta');
  const [currentAngles, setCurrentAngles] = useState({
    elbow: 180,     // Ángulo del codo (promedio)
    torso: 90,      // Ángulo del torso (Hombro-Cadera-Rodilla)
    symmetryDiff: 0
  });

  const { speak } = useSpeech({ lang: 'es-ES' });

  // Refs para control
  const lastRepTimeRef = useRef(0);
  const elbowHistoryRef = useRef([]);
  const torsoHistoryRef = useRef([]);
  const holdStartRef = useRef(null);
  const cheatFlagRef = useRef(false);

  // --- UMBRALES BIOMECÁNICOS (Remo Sentado) ---
  
  // 1. Movimiento de Brazos (Codos)
  const EXTENDED_ENTER = 150;   // Inicio del movimiento (brazos estirados)
  const PULLED_CONFIRM = 85;    // Final del movimiento (codos atrás/flexionados)
  
  // 2. Control de Torso (Evitar inercia)
  // 90° es vertical perfecto. >115° implica que se está echando muy atrás.
  const TORSO_MAX_LEAN = 115;   
  const TORSO_MIN_FWD = 70;     // No inclinarse demasiado adelante tampoco

  const HOLD_MS = 300;          // Tiempo de "Squeeze" atrás
  const MIN_INTERVAL_MS = 1200;
  const SMOOTH_WINDOW = 5;

  const handlePoseDetected = (landmarks) => {
    const angles = calculateBodyAngles(landmarks);
    const { rightElbow, leftElbow, rightHip, leftHip } = angles; // rightHip aquí asume ángulo Hombro-Cadera-Rodilla

    // 1. Suavizado (Moving Average)
    const updateHistory = (ref, val) => {
        ref.current.push(val);
        if (ref.current.length > SMOOTH_WINDOW) ref.current.shift();
        return ref.current.reduce((a, b) => a + b, 0) / ref.current.length;
    };

    const smoothElbow = Math.round(updateHistory(elbowHistoryRef, (rightElbow + leftElbow) / 2));
    const smoothTorso = Math.round(updateHistory(torsoHistoryRef, (rightHip + leftHip) / 2));
    const symmetryDiff = Math.abs(rightElbow - leftElbow);

    setCurrentAngles({
        elbow: smoothElbow,
        torso: smoothTorso,
        symmetryDiff
    });

    // 2. Detector de Trampa (Torso Swing)
    if (smoothTorso > TORSO_MAX_LEAN) {
        if (!cheatFlagRef.current) {
            setFeedback('⚠️ ¡No te inclines atrás! Usa la espalda.');
            speak('Mantén el torso quieto');
            cheatFlagRef.current = true;
        }
        return; // Pausar lógica si está haciendo trampa
    } 
    else if (smoothTorso < TORSO_MIN_FWD) {
        setFeedback('⚠️ Endereza la espalda');
        return;
    }
    
    if (cheatFlagRef.current && smoothTorso <= TORSO_MAX_LEAN) {
        cheatFlagRef.current = false;
        setFeedback('✅ Buena postura, continúa');
    }

    // 3. Máquina de Estados
    const now = Date.now();

    if (stage === 'extended' || stage === 'return_hold') {
        // Iniciar el Jalón (Pull)
        if (smoothElbow < EXTENDED_ENTER - 10) {
            setStage('pulling');
            setFeedback('Jala con los codos...');
            holdStartRef.current = null;
        }
    }
    else if (stage === 'pulling') {
        // Detectar el final del jalón (Squeeze)
        if (smoothElbow < PULLED_CONFIRM) {
             if (!holdStartRef.current) {
                holdStartRef.current = now;
            } else if (now - holdStartRef.current >= HOLD_MS) {
                setStage('squeezing');
                setFeedback('🔒 ¡Aprieta la espalda!');
                holdStartRef.current = null;
            }
        }
    }
    else if (stage === 'squeezing') {
        // Iniciar el retorno
        if (smoothElbow > PULLED_CONFIRM + 10) {
            setStage('returning');
            setFeedback('Regresa lento...');
        }
    }
    else if (stage === 'returning') {
        // Confirmar extensión completa
        if (smoothElbow > EXTENDED_ENTER) {
            if (!holdStartRef.current) {
                holdStartRef.current = now;
            } else if (now - holdStartRef.current >= HOLD_MS/2) { // Retorno puede ser más fluido
                 if (now - lastRepTimeRef.current >= MIN_INTERVAL_MS) {
                    const newCount = repCount + 1;
                    setRepCount(newCount);
                    setFeedback(`✅ Repetición ${newCount}`);
                    speak(newCount.toString());
                    lastRepTimeRef.current = now;
                }
                setStage('extended');
                holdStartRef.current = null;
            }
        }
    }
  };

  const getStatusColor = () => {
      if (cheatFlagRef.current) return 'text-red-600';
      if (stage === 'squeezing') return 'text-green-600';
      return 'text-indigo-600';
  };

  // Highlight Visual
  const highlightedAngles = useMemo(() => {
    const torsoValid = currentAngles.torso <= TORSO_MAX_LEAN && currentAngles.torso >= TORSO_MIN_FWD;
    return [
      // Brazos
      { indices: [12, 14, 16], angle: currentAngles.elbow, isValid: true }, 
      { indices: [11, 13, 15], angle: currentAngles.elbow, isValid: true },
      // Torso (Hombro-Cadera-Rodilla) - Indices aproximados
      { indices: [12, 24, 26], angle: currentAngles.torso, isValid: torsoValid } 
    ];
  }, [currentAngles]);

  // --- VISTA DESCRIPCIÓN ---
  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Remo sentado en máquina</h1>
          <p className="text-gray-600 mb-6 text-lg">La IA verificará que jales completo y que **no** te ayudes con el peso del cuerpo.</p>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-64 flex items-center justify-center overflow-hidden bg-gray-100 relative">
              {passedImage ? (
                <img src={passedImage} alt={passedNombre || 'Remo sentado'} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-6xl">🚣‍♂️</span>
                </div>
              )}
              <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-1 rounded-lg text-xs font-bold shadow">
                  Vista recomendada: PERFIL 📸
              </div>
            </div>
            <div className="p-6 space-y-4">
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                <li>Coloca la cámara de lado (perfil).</li>
                <li>Espalda recta, pecho fuera.</li>
                <li>Evita balancearte hacia atrás al jalar.</li>
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

  // --- VISTA RUTINA ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-indigo-900">🚣‍♂️ Remo Sentado IA</h1>
          <button onClick={() => setStarted(false)} className="text-sm text-indigo-600 hover:text-indigo-800 underline">Finalizar</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLUMNA CÁMARA */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden relative">
              <YogaPoseDetector onPoseDetected={handlePoseDetected} highlightedAngles={highlightedAngles} />
              
              {/* Feedback Overlay sobre video */}
              <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full font-bold backdrop-blur-md shadow-lg transition-all
                 ${feedback.includes('⚠️') ? 'bg-red-500/90 text-white animate-bounce' : 'bg-white/90 text-indigo-900'}`}>
                 {feedback}
              </div>
            </div>

            {/* Dashboard Métricas */}
            <div className="bg-white rounded-lg shadow-xl p-4 mt-4">
               <div className="flex justify-between items-center mb-2">
                   <h3 className="text-lg font-semibold text-gray-700">Análisis Biomecánico</h3>
                   <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">Vista Lateral</span>
               </div>
               <div className="grid grid-cols-2 gap-4">
                   {/* Medidor de Torso (Estabilidad) */}
                   <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                       <div className="flex justify-between text-xs text-gray-500 mb-1">
                           <span>Inclinación Torso</span>
                           <span>{currentAngles.torso}°</span>
                       </div>
                       <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden relative">
                           {/* Zona segura marcada en verde/gris */}
                           <div className="absolute left-0 h-full w-full bg-gradient-to-r from-transparent via-green-200 to-red-200" style={{background: 'linear-gradient(90deg, transparent 0%, transparent 70%, rgba(255,0,0,0.3) 100%)'}}></div>
                           {/* Indicador */}
                           <div className={`h-full transition-all duration-300 ${currentAngles.torso > TORSO_MAX_LEAN ? 'bg-red-500' : 'bg-indigo-500'}`}
                                style={{ width: `${Math.min((currentAngles.torso / 130) * 100, 100)}%` }}>
                           </div>
                       </div>
                       <div className="text-xs text-right mt-1 text-gray-400">Máx permitido: 115°</div>
                   </div>

                   {/* Medidor de Codos (ROM) */}
                   <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                       <div className="flex justify-between text-xs text-gray-500 mb-1">
                           <span>Flexión Codos</span>
                           <span>{currentAngles.elbow}°</span>
                       </div>
                       <div className="text-xl font-bold text-indigo-600">
                           {stage === 'squeezing' ? '🔒 BLOQUEADO' : stage === 'extended' ? '📏 EXTENDIDO' : '🔄 EN MOVIMIENTO'}
                       </div>
                   </div>
               </div>
            </div>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-xl p-8 text-center">
                <h2 className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-2">Reps Completadas</h2>
                <div className={`text-8xl font-black transition-colors duration-300 ${getStatusColor()}`}>
                    {repCount}
                </div>
                <div className="mt-4 inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {stage === 'squeezing' ? '¡Sostén!' : 'Ritmo constante'}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-xl p-6">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span>🧠</span> Enfoque Muscular
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                    Para activar los dorsales, imagina que tus manos son ganchos y jala 
                    llevando los <strong>codos hacia la cadera</strong>, no solo hacia atrás.
                </p>
                <div className="border-t pt-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Errores comunes detectados:</h4>
                    <ul className="text-sm space-y-2">
                        <li className={`flex items-center gap-2 ${cheatFlagRef.current ? 'text-red-600 font-bold' : 'text-gray-400'}`}>
                            <span>{cheatFlagRef.current ? '❌' : '⚪'}</span> Balanceo de torso (Inercia)
                        </li>
                        <li className={`flex items-center gap-2 ${currentAngles.symmetryDiff > 20 ? 'text-yellow-600 font-bold' : 'text-gray-400'}`}>
                            <span>{currentAngles.symmetryDiff > 20 ? '⚠️' : '⚪'}</span> Asimetría en brazos
                        </li>
                    </ul>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}