import useSimulationStore from '../store/useSimulationStore';
import { Flame } from 'lucide-react';

const Burner = () => {
  const { pourcentageBruleur, setPourcentageBruleur } = useSimulationStore();

  return (
    <div className="p-4 rounded-lg border border-gray-600 bg-gray-800/80">
      <h3 className="text-md font-semibold mb-2 text-orange-400 flex items-center">
        Brûleur <Flame className="ml-2 text-red-500" size={16} />
      </h3>
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold">{pourcentageBruleur}%</span>
        <input
          type="range"
          min="0"
          max="100"
          value={pourcentageBruleur}
          onChange={(e) => setPourcentageBruleur(Number(e.target.value))}
          className="w-full accent-orange-500"
        />
      </div>
    </div>
  );
};

export default Burner;