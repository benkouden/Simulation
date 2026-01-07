import useSimulationStore from '../store/useSimulationStore';
import { AlertTriangle } from 'lucide-react';

const AlarmsPanel = () => {
  const alarmes = useSimulationStore(state => state.alarmes);

  return (
    <div className="p-4 rounded-lg border border-red-600 bg-red-900/30">
      <h3 className="text-md font-semibold mb-2 text-red-400 flex items-center">
        Alarmes <AlertTriangle className="ml-2" size={16} />
      </h3>
      <ul className="space-y-1 text-sm">
        {alarmes.length === 0 ? (
          <li className="text-green-400">Aucune alarme</li>
        ) : (
          alarmes.map((alarme, idx) => (
            <li key={idx} className="flex items-center text-red-300">
              <AlertTriangle size={12} className="mr-2" /> {alarme}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default AlarmsPanel;