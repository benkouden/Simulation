import useSimulationStore from '../store/useSimulationStore';
import { Stage, Layer, Rect, Circle, Line } from 'react-konva';
import { Flame } from 'lucide-react'; // Icône flamme similaire

const Tambour = () => {
  const { temperatureTambour, pressionTambour } = useSimulationStore();

  return (
    <div className="p-4 rounded-lg border border-gray-600 bg-gray-800/80">
      <h3 className="text-md font-semibold mb-2 text-orange-400">Tambour</h3>
      
      {/* Dessin vectoriel du tambour (cylindre horizontal avec flamme) */}
      <Stage width={200} height={80}>
        <Layer>
          {/* Cylindre */}
          <Rect x={20} y={20} width={160} height={40} fill="gray" cornerRadius={20} />
          {/* Flamme animée */}
          <Circle x={100} y={40} radius={15} fill="orange" />
          {/* Lignes internes (vis sans fin) */}
          <Line points={[30, 40, 170, 40]} stroke="black" strokeWidth={2} dash={[5, 5]} />
        </Layer>
      </Stage>

      <div className="flex justify-between mt-2 text-sm">
        <div>Temp: <span className={temperatureTambour > 120 ? 'text-red-400' : 'text-green-400'}>{temperatureTambour.toFixed(1)}°C</span></div>
        <div>Pression: {pressionTambour.toFixed(2)} kPa</div>
        <Flame className="text-orange-500" size={18} />
      </div>
    </div>
  );
};

export default Tambour;