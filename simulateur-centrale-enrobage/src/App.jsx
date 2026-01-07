import { useEffect } from 'react';
import useSimulationStore from './store/useSimulationStore';

import GranulatHopper from './components/GranulatHopper';
import Tambour from './components/Tambour';
import Burner from './components/Burner';
import Skip from './components/Skip';
import AlarmsPanel from './components/AlarmsPanel';
import ProductionControl from './components/ProductionControl';
import { Stage, Layer, Line } from 'react-konva'; // Pour convoyeurs de fond

function App() {
  const { startSimulation, stopSimulation, productionActive, granulats } = useSimulationStore();

  useEffect(() => {
    startSimulation();
    return () => stopSimulation();
  }, []);

  return (
    <div className="min-h-screen bg-gray-700 text-gray-100 p-4 font-mono relative overflow-hidden">
      {/* Fond schématique global (convoyeurs horizontaux comme dans screens) */}
      <Stage width={window.innerWidth} height={window.innerHeight} className="absolute inset-0 pointer-events-none opacity-50">
        <Layer>
          <Line points={[100, 300, 1200, 300]} stroke="lime" strokeWidth={8} dash={[10, 5]} /> {/* Convoyeur principal */}
          <Line points={[800, 350, 1100, 350]} stroke="orange" strokeWidth={6} /> {/* Sortie tambour */}
        </Layer>
      </Stage>

      <header className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-orange-500">Centrale Enrobage - Supervision</h1>
        <div className="text-sm text-gray-400">Date: 11/07/2018 | Production: {productionActive ? 'En cours' : 'Arrêt'}</div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
        {/* Granulats (gauche, comme dans screens) */}
        <section className="col-span-2 bg-gray-800/80 p-4 rounded-lg border border-gray-600">
          <h2 className="text-lg font-semibold mb-3 text-yellow-400">Pesée Granulats</h2>
          <div className="flex space-x-4">
            {granulats.map((granulat) => (
              <GranulatHopper key={granulat.id} {...granulat} />
            ))}
          </div>
        </section>

        {/* Tambour & Brûleur (centre) */}
        <section className="col-span-1 bg-gray-800/80 p-4 rounded-lg border border-gray-600">
          <Tambour />
          <Burner className="mt-4" />
        </section>

        {/* Skip & Stockage (droite) */}
        <section className="col-span-1 bg-gray-800/80 p-4 rounded-lg border border-gray-600">
          <Skip />
        </section>
      </main>

      {/* Panneau bas (alarmes & contrôles) */}
      <footer className="mt-6 bg-gray-900 p-4 rounded-lg border border-gray-600 flex justify-between relative z-10">
        <AlarmsPanel className="w-1/2" />
        <ProductionControl className="w-1/2" />
      </footer>
    </div>
  );
}

export default App;