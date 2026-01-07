import React, { useState, useEffect } from 'react';
import { Flame, Droplets, Gauge, ThermometerSun, Wind, AlertTriangle, Power, Settings, PlayCircle, PauseCircle, TrendingUp, Save, Download, Upload, RotateCcw, BookOpen, Zap, Activity } from 'lucide-react';

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [temperature, setTemperature] = useState(108);
  const [targetTemperature, setTargetTemperature] = useState(150);
  const [burnerPower, setBurnerPower] = useState(48);
  const [production, setProduction] = useState(102.96);
  const [targetProduction, setTargetProduction] = useState(120);
  const [humidity, setHumidity] = useState(2.2);
  const [filterPressure, setFilterPressure] = useState(49);
  const [fuelConsumption, setFuelConsumption] = useState(0);
  const [totalProduction, setTotalProduction] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [alarms, setAlarms] = useState([]);
  const [showScenarios, setShowScenarios] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [history, setHistory] = useState([]);
  
  // États des trémies
  const [hoppers, setHoppers] = useState([
    { id: 1, name: 'Grav 10/14', level: 0, target: 0, actual: 0, refilling: false },
    { id: 2, name: 'Grav 10/20', level: 33.6, target: 38.9, actual: 38.9, refilling: false },
    { id: 3, name: 'Sable 0/5', level: 43.1, target: 50, actual: 50.3, refilling: false },
    { id: 4, name: 'Grav 5/10', level: 19.2, target: 22.2, actual: 22.2, refilling: false }
  ]);

  const [dryer, setDryer] = useState({
    temp: 154,
    pressure: 503,
    rotation: 0,
    speed: 100
  });

  const [storage, setStorage] = useState({
    weight: 106.2,
    temp: 180.3,
    capacity: 960
  });

  const [mixer, setMixer] = useState({
    bitumenTemp: 160,
    mixingTime: 45,
    quality: 95
  });

  // Scénarios de formation
  const scenarios = [
    {
      id: 1,
      name: "Démarrage à froid",
      description: "Apprendre la procédure de démarrage",
      difficulty: "Facile",
      steps: ["Préchauffage brûleur", "Montée en température", "Démarrage production"]
    },
    {
      id: 2,
      name: "Gestion alarme température",
      description: "Réagir à une surchauffe",
      difficulty: "Moyen",
      steps: ["Détecter l'alarme", "Réduire le brûleur", "Stabiliser"]
    },
    {
      id: 3,
      name: "Optimisation production",
      description: "Maximiser le rendement",
      difficulty: "Difficile",
      steps: ["Équilibrer les dosages", "Optimiser température", "Maintenir qualité"]
    },
    {
      id: 4,
      name: "Niveau trémie critique",
      description: "Gérer un niveau bas",
      difficulty: "Moyen",
      steps: ["Ralentir production", "Remplir trémie", "Reprendre"]
    }
  ];

  // Simulation en temps réel
  useEffect(() => {
    if (!isRunning || isPaused) return;

    const interval = setInterval(() => {
      // Timer de session
      setSessionTime(prev => prev + 0.1);

      // Régulation température vers la cible
      setTemperature(prev => {
        const diff = targetTemperature - prev;
        const adjustment = diff * 0.05 + (Math.random() - 0.5) * 2;
        return Math.max(80, Math.min(200, prev + adjustment));
      });

      // Puissance brûleur adapte automatiquement
      if (Math.abs(temperature - targetTemperature) > 10) {
        setBurnerPower(prev => {
          if (temperature < targetTemperature) {
            return Math.min(100, prev + 1);
          } else {
            return Math.max(0, prev - 1);
          }
        });
      }

      // Rotation du séchoir
      setDryer(prev => ({
        ...prev,
        rotation: (prev.rotation + (prev.speed / 50)) % 360,
        temp: temperature + Math.random() * 10,
        pressure: 450 + Math.random() * 100
      }));

      // Production régulée
      setProduction(prev => {
        if (temperature < 100) return prev * 0.95;
        const efficiency = temperature / targetTemperature;
        const hoppersFull = hoppers.every(h => h.level > 10);
        if (!hoppersFull) return prev * 0.5;
        
        const newProd = targetProduction * efficiency + (Math.random() - 0.5) * 5;
        return Math.max(0, Math.min(150, newProd));
      });

      // Consommation carburant
      setFuelConsumption(prev => prev + (burnerPower / 1000));

      // Production totale
      setTotalProduction(prev => prev + (production / 36000));

      // Mise à jour des niveaux de trémies
      setHoppers(prev => prev.map(hopper => {
        let newLevel = hopper.level - (isRunning ? 0.3 : 0);
        
        // Remplissage automatique si niveau < 20%
        if (newLevel < 20 && !hopper.refilling) {
          return { ...hopper, refilling: true };
        }
        
        if (hopper.refilling) {
          newLevel = Math.min(100, newLevel + 2);
          if (newLevel >= 95) {
            return { ...hopper, level: newLevel, refilling: false };
          }
        }
        
        return { ...hopper, level: Math.max(0, newLevel) };
      }));

      // Stockage
      setStorage(prev => ({
        ...prev,
        weight: Math.min(prev.capacity, prev.weight + (production / 120)),
        temp: 175 + Math.random() * 15
      }));

      // Qualité mélange
      setMixer(prev => ({
        ...prev,
        quality: Math.max(70, Math.min(100, 95 + (Math.random() - 0.5) * 10)),
        bitumenTemp: 155 + Math.random() * 10
      }));

      // Historique
      setHistory(prev => {
        const newEntry = {
          time: sessionTime,
          temp: temperature,
          prod: production,
          quality: mixer.quality
        };
        return [...prev.slice(-100), newEntry];
      });

      // Gestion des alarmes
      const newAlarms = [];
      if (temperature > 180) newAlarms.push({ type: "CRITIQUE", msg: "Température excessive!" });
      if (temperature < 90 && isRunning) newAlarms.push({ type: "ATTENTION", msg: "Température trop basse" });
      if (filterPressure > 70) newAlarms.push({ type: "ALERTE", msg: "Pression filtre élevée" });
      if (hoppers.some(h => h.level < 10)) newAlarms.push({ type: "ATTENTION", msg: "Niveau trémie critique" });
      if (mixer.quality < 80) newAlarms.push({ type: "ALERTE", msg: "Qualité enrobé faible" });
      if (storage.weight > storage.capacity * 0.95) newAlarms.push({ type: "ATTENTION", msg: "Silo presque plein" });
      setAlarms(newAlarms);

    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, isPaused, temperature, targetTemperature, filterPressure, hoppers, burnerPower, production, targetProduction, sessionTime, mixer.quality, storage.weight, storage.capacity]);

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTemperature(25);
    setProduction(0);
    setTotalProduction(0);
    setSessionTime(0);
    setFuelConsumption(0);
    setHoppers(prev => prev.map(h => ({ ...h, level: 50 })));
    setStorage({ weight: 0, temp: 25, capacity: 960 });
    setHistory([]);
    setAlarms([]);
  };

  const handleSaveSession = () => {
    const session = {
      timestamp: new Date().toISOString(),
      duration: sessionTime,
      production: totalProduction,
      fuel: fuelConsumption,
      scenario: currentScenario
    };
    localStorage.setItem('asphalt-session', JSON.stringify(session));
    alert('Session sauvegardée!');
  };

  const handleLoadScenario = (scenario) => {
    setCurrentScenario(scenario);
    handleReset();
    setShowScenarios(false);
    
    // Configuration selon scénario
    if (scenario.id === 1) {
      setTemperature(25);
      setTargetTemperature(150);
    } else if (scenario.id === 2) {
      setTemperature(190);
      setTargetTemperature(150);
      setBurnerPower(95);
    } else if (scenario.id === 3) {
      setTargetProduction(140);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white">
      {/* Header avec alarmes */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-3 border-b-2 border-gray-700 flex justify-between items-center">
        <div className="flex gap-3 items-center flex-wrap">
          <h1 className="text-xl font-bold text-blue-400">Centrale d'Enrobage - Simulateur</h1>
          {alarms.map((alarm, idx) => (
            <div 
              key={idx}
              className={`px-4 py-1 rounded-full flex items-center gap-2 text-sm font-semibold animate-pulse ${
                alarm.type === 'CRITIQUE' ? 'bg-red-600' : 
                alarm.type === 'ALERTE' ? 'bg-orange-600' : 
                'bg-yellow-600'
              }`}
            >
              <AlertTriangle size={16} />
              {alarm.msg}
            </div>
          ))}
        </div>
        <div className="text-right">
          <div className="text-sm font-mono">{new Date().toLocaleString('fr-FR')}</div>
          <div className="text-xs text-gray-400">Session: {sessionTime.toFixed(1)}s</div>
        </div>
      </div>

      <div className="flex">
        {/* Zone principale de simulation */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-12 gap-4">
            
            {/* Ligne 1: Trémies de granulats */}
            <div className="col-span-12 bg-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-bold mb-3 text-blue-300">TRÉMIES DE GRANULATS</h3>
              <div className="grid grid-cols-4 gap-4">
                {hoppers.map((hopper, idx) => (
                  <div key={hopper.id} className="bg-gray-700 rounded-lg p-3">
                    <div className="text-xs font-bold text-center mb-2">{hopper.name}</div>
                    <div className="relative h-32 bg-gray-900 rounded overflow-hidden mb-2">
                      {/* Niveau de remplissage */}
                      <div 
                        className={`absolute bottom-0 w-full transition-all duration-300 ${
                          hopper.refilling ? 'bg-gradient-to-t from-blue-500 to-blue-400' :
                          hopper.level < 20 ? 'bg-gradient-to-t from-red-500 to-red-400' :
                          'bg-gradient-to-t from-green-500 to-green-400'
                        }`}
                        style={{ height: `${hopper.level}%` }}
                      >
                        {hopper.refilling && (
                          <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
                        )}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white drop-shadow-lg">
                          {hopper.level.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="text-xs space-y-1 text-gray-300">
                      <div>Cible: {hopper.target.toFixed(1)} t/h</div>
                      <div>Actuel: {hopper.actual.toFixed(1)} t/h</div>
                      {hopper.refilling && (
                        <div className="text-blue-400 font-bold animate-pulse">⬆ REMPLISSAGE</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ligne 2: Séchoir + Malaxeur + Silo */}
            <div className="col-span-4 bg-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-bold mb-3 text-orange-300">SÉCHOIR ROTATIF</h3>
              <div className="relative bg-gray-900 rounded-lg p-4 h-64">
                <div className="absolute top-2 left-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs flex items-center gap-1">
                  <ThermometerSun size={14} className="text-red-400" />
                  {Math.round(temperature)}°C
                </div>
                
                <div className="absolute top-2 right-2 text-xs text-gray-400">
                  {(0.97 + Math.random() * 0.4).toFixed(2)} kPa
                </div>
                
                {/* Corps du séchoir */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-20 bg-gradient-to-r from-gray-600 to-gray-500 rounded-lg border-4 border-gray-700 overflow-hidden">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Flame 
                      className="text-orange-500" 
                      size={32} 
                      style={{ 
                        filter: `drop-shadow(0 0 ${burnerPower/2}px rgba(255, 100, 0, 0.8))`,
                        animation: isRunning ? 'pulse 0.5s infinite' : 'none'
                      }} 
                    />
                  </div>
                  
                  {/* Ailettes rotatives */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-0.5 h-12 bg-green-400"
                        style={{
                          transform: `rotate(${dryer.rotation + i * 45}deg)`,
                          transition: 'transform 0.1s linear'
                        }}
                      />
                    ))}
                  </div>
                  
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <Wind className={`text-cyan-400 ${isRunning ? 'animate-spin' : ''}`} size={24} />
                  </div>
                </div>

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full px-4">
                  <div className="text-xs text-gray-400 mb-1">Vitesse rotation</div>
                  <input 
                    type="range" 
                    min="0" 
                    max="150" 
                    value={dryer.speed}
                    onChange={(e) => setDryer({...dryer, speed: parseInt(e.target.value)})}
                    className="w-full"
                  />
                  <div className="text-center text-xs text-gray-300">{dryer.speed} rpm</div>
                </div>
              </div>
            </div>

            <div className="col-span-4 bg-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-bold mb-3 text-red-300">MALAXEUR</h3>
              <div className="relative bg-gray-900 rounded-lg p-4 h-64 flex flex-col justify-between">
                <div className="flex-1 flex items-center justify-center">
                  <div className="relative w-40 h-40 bg-gray-700 rounded-full border-4 border-gray-600 flex items-center justify-center overflow-hidden">
                    <Flame 
                      className="text-red-500 absolute" 
                      size={80} 
                      style={{ 
                        filter: 'drop-shadow(0 0 30px rgba(255, 0, 0, 0.8))',
                        animation: isRunning ? 'pulse 1s infinite' : 'none'
                      }} 
                    />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs">
                      {burnerPower.toFixed(0)}%
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Température bitume:</span>
                    <span className="font-bold text-yellow-400">{mixer.bitumenTemp.toFixed(1)}°C</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Temps malaxage:</span>
                    <span className="font-bold">{mixer.mixingTime}s</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Qualité:</span>
                    <span className={`font-bold ${mixer.quality > 90 ? 'text-green-400' : mixer.quality > 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {mixer.quality.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-4 bg-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-bold mb-3 text-yellow-300">SILO DE STOCKAGE</h3>
              <div className="relative bg-gray-900 rounded-lg p-4 h-64">
                <div className="flex justify-center items-end h-full pb-8">
                  <div className="relative w-32">
                    <div className="text-xs text-center mb-2 font-bold">
                      {storage.weight.toFixed(1)} kg
                    </div>
                    
                    {/* Corps du silo */}
                    <div className="relative w-full h-40 bg-gray-700 rounded-t-lg border-4 border-gray-600 overflow-hidden">
                      <div 
                        className="absolute bottom-0 w-full bg-gradient-to-t from-orange-600 via-yellow-500 to-yellow-400 transition-all duration-500"
                        style={{ height: `${(storage.weight / storage.capacity) * 100}%` }}
                      ></div>
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold text-white drop-shadow-lg">
                          {((storage.weight / storage.capacity) * 100).toFixed(0)}%
                        </span>
                      </div>

                      <div className="absolute top-2 right-2 bg-black bg-opacity-70 px-1 py-0.5 rounded text-xs">
                        <ThermometerSun size={10} className="inline text-red-400" />
                        <span className="ml-1">{Math.round(storage.temp)}°C</span>
                      </div>
                    </div>
                    
                    {/* Base conique */}
                    <div className="w-full h-12 bg-gray-700 border-4 border-gray-600 border-t-0"
                         style={{ clipPath: 'polygon(0 0, 100% 0, 75% 100%, 25% 100%)' }}></div>
                    
                    <div className="text-xs text-center mt-2 text-gray-400">
                      Capacité: {storage.capacity} kg
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ligne 3: Contrôles */}
            <div className="col-span-6 bg-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-bold mb-3 text-blue-300">CONTRÔLES TEMPÉRATURE</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span>Température actuelle: {temperature.toFixed(1)}°C</span>
                    <span>Cible: {targetTemperature}°C</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        temperature > 180 ? 'bg-red-500' :
                        temperature > 150 ? 'bg-green-500' :
                        temperature > 100 ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${(temperature / 200) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-2">
                    Température cible: {targetTemperature}°C
                  </label>
                  <input 
                    type="range" 
                    min="100" 
                    max="200" 
                    value={targetTemperature}
                    onChange={(e) => setTargetTemperature(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-2">
                    Puissance brûleur: {burnerPower.toFixed(0)}%
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={burnerPower}
                    onChange={(e) => setBurnerPower(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-6 bg-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-bold mb-3 text-green-300">CONTRÔLES PRODUCTION</h3>
              <div className="space-y-4">
                <div className="bg-gray-900 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-400">Production actuelle</span>
                    <span className="text-2xl font-bold text-green-400">{production.toFixed(1)} t/h</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-400 h-full transition-all"
                      style={{ width: `${Math.min(100, (production / 150) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-2">
                    Production cible: {targetProduction} t/h
                  </label>
                  <input 
                    type="range" 
                    min="50" 
                    max="150" 
                    value={targetProduction}
                    onChange={(e) => setTargetProduction(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-gray-900 rounded p-2">
                    <div className="text-gray-400">Production totale</div>
                    <div className="text-lg font-bold text-yellow-400">{totalProduction.toFixed(2)} t</div>
                  </div>
                  <div className="bg-gray-900 rounded p-2">
                    <div className="text-gray-400">Consommation fuel</div>
                    <div className="text-lg font-bold text-orange-400">{fuelConsumption.toFixed(2)} L</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ligne 4: Graphique historique */}
            <div className="col-span-12 bg-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-bold mb-3 text-purple-300 flex items-center gap-2">
                <Activity size={16} />
                HISTORIQUE EN TEMPS RÉEL
              </h3>
              <div className="bg-gray-900 rounded-lg p-4 h-40 relative overflow-hidden">
                <svg className="w-full h-full">
                  {/* Grille */}
                  {[...Array(5)].map((_, i) => (
                    <line 
                      key={i}
                      x1="0" 
                      y1={i * 32} 
                      x2="100%" 
                      y2={i * 32} 
                      stroke="#374151" 
                      strokeWidth="1"
                    />
                  ))}
                  
                  {/* Courbe température */}
                  {history.length > 1 && (
                    <polyline
                      points={history.map((h, i) => `${(i / history.length) * 100}%,${160 - (h.temp / 200) * 140}`).join(' ')}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                    />
                  )}
                  
                  {/* Courbe production */}
                  {history.length > 1 && (
                    <polyline
                      points={history.map((h, i) => `${(i / history.length) * 100}%,${160 - (h.prod / 150) * 140}`).join(' ')}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                    />
                  )}
                </svg>
                
                <div className="absolute bottom-2 left-2 flex gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>Température</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Production</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Panneau de contrôle latéral */}
        <div className="w-80 bg-gray-900 border-l-2 border-gray-700 p-4 overflow-y-auto">
          <div className="space-y-4">
            
            {/* Contrôles principaux */}
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-4">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Power size={20} />
                CONTRÔLES
              </h2>
              
              <div className="space-y-2">
                <button
                  onClick={handleStart}
                  disabled={isRunning && !isPaused}
                  className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                    isRunning && !isPaused
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  <PlayCircle size={20} />
                  DÉMARRER
                </button>

                <button
                  onClick={handlePause}
                  disabled={!isRunning}
                  className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                    !isRunning
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : isPaused
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-yellow-600 hover:bg-yellow-700'
                  }`}
                >
                  <PauseCircle size={20} />
                  {isPaused ? 'REPRENDRE' : 'PAUSE'}
                </button>

                <button
                  onClick={handleStop}
                  disabled={!isRunning}
                  className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                    !isRunning
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  <Power size={20} />
                  ARRÊTER
                </button>

                <button
                  onClick={handleReset}
                  className="w-full py-2 rounded-lg font-bold flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 transition-all text-sm"
                >
                  <RotateCcw size={16} />
                  RÉINITIALISER
                </button>
              </div>
            </div>

            {/* État du système */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-bold mb-3 text-blue-300">ÉTAT SYSTÈME</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">État:</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      isRunning && !isPaused ? 'bg-green-500 animate-pulse' : 
                      isPaused ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`}></div>
                    <span className="font-bold text-sm">
                      {isRunning && !isPaused ? 'EN MARCHE' : isPaused ? 'PAUSE' : 'ARRÊTÉ'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Durée session:</span>
                  <span className="font-bold text-sm">{Math.floor(sessionTime / 60)}m {Math.floor(sessionTime % 60)}s</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Qualité enrobé:</span>
                  <span className={`font-bold text-sm ${
                    mixer.quality > 90 ? 'text-green-400' : 
                    mixer.quality > 80 ? 'text-yellow-400' : 
                    'text-red-400'
                  }`}>
                    {mixer.quality.toFixed(1)}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Humidité:</span>
                  <span className="font-bold text-sm flex items-center gap-1">
                    <Droplets size={12} className="text-blue-400" />
                    {humidity.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Scénarios de formation */}
            <div className="bg-gray-800 rounded-lg p-4">
              <button
                onClick={() => setShowScenarios(!showScenarios)}
                className="w-full flex items-center justify-between text-sm font-bold mb-3 text-purple-300 hover:text-purple-200"
              >
                <span className="flex items-center gap-2">
                  <BookOpen size={16} />
                  SCÉNARIOS FORMATION
                </span>
                <span>{showScenarios ? '▼' : '▶'}</span>
              </button>
              
              {showScenarios && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {scenarios.map(scenario => (
                    <button
                      key={scenario.id}
                      onClick={() => handleLoadScenario(scenario)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        currentScenario?.id === scenario.id
                          ? 'bg-purple-900 border-2 border-purple-500'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      <div className="font-bold text-sm mb-1">{scenario.name}</div>
                      <div className="text-xs text-gray-400 mb-2">{scenario.description}</div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded ${
                          scenario.difficulty === 'Facile' ? 'bg-green-900 text-green-300' :
                          scenario.difficulty === 'Moyen' ? 'bg-yellow-900 text-yellow-300' :
                          'bg-red-900 text-red-300'
                        }`}>
                          {scenario.difficulty}
                        </span>
                        <Zap size={14} className="text-yellow-400" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-bold mb-3 text-green-300">ACTIONS</h3>
              <div className="space-y-2">
                <button
                  onClick={handleSaveSession}
                  className="w-full py-2 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 bg-green-700 hover:bg-green-600 transition-all"
                >
                  <Save size={16} />
                  Sauvegarder session
                </button>

                <button
                  onClick={() => {
                    const dataStr = JSON.stringify({
                      sessionTime,
                      totalProduction,
                      fuelConsumption,
                      history
                    }, null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `session-${Date.now()}.json`;
                    link.click();
                  }}
                  className="w-full py-2 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-600 transition-all"
                >
                  <Download size={16} />
                  Exporter données
                </button>
              </div>
            </div>

            {/* Alarmes actives */}
            {alarms.length > 0 && (
              <div className="bg-red-900 bg-opacity-50 rounded-lg p-4 border-2 border-red-600">
                <h3 className="text-sm font-bold mb-3 text-red-300 flex items-center gap-2">
                  <AlertTriangle size={16} className="animate-pulse" />
                  ALARMES ACTIVES
                </h3>
                <ul className="space-y-2">
                  {alarms.map((alarm, idx) => (
                    <li key={idx} className={`text-xs p-2 rounded ${
                      alarm.type === 'CRITIQUE' ? 'bg-red-800 text-red-200' :
                      alarm.type === 'ALERTE' ? 'bg-orange-800 text-orange-200' :
                      'bg-yellow-800 text-yellow-200'
                    }`}>
                      <span className="font-bold">[{alarm.type}]</span> {alarm.msg}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Statistiques */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-bold mb-3 text-cyan-300 flex items-center gap-2">
                <TrendingUp size={16} />
                STATISTIQUES
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Efficacité:</span>
                  <span className="font-bold text-lg">{((production / targetProduction) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-cyan-500 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (production / targetProduction) * 100)}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-900 rounded p-2">
                    <div className="text-gray-400">Rendement</div>
                    <div className="font-bold">{(totalProduction / Math.max(1, fuelConsumption) * 100).toFixed(1)} kg/L</div>
                  </div>
                  <div className="bg-gray-900 rounded p-2">
                    <div className="text-gray-400">Uptime</div>
                    <div className="font-bold">{isRunning ? '100' : '0'}%</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;