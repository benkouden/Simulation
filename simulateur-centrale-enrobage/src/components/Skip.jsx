import useSimulationStore from '../store/useSimulationStore';
import { Stage, Layer, Rect, Line } from 'react-konva';

const Skip = () => {
  const { skipPoids, skipCapaciteMax } = useSimulationStore();
  const pourcentage = (skipPoids / skipCapaciteMax) * 100;
  const levelHeight = (pourcentage / 100) * 100; // Hauteur visuelle

  return (
    <div className="p-4 rounded-lg border border-gray-600 bg-gray-800/80">
      <h3 className="text-md font-semibold mb-2 text-orange-400">Stockage Enrobés (Skip)</h3>
      
      {/* Dessin vectoriel du skip (silo rectangulaire avec sortie) */}
      <Stage width={100} height={120}>
        <Layer>
          <Rect x={20} y={10} width={60} height={100} fill="gray" />
          <Line points={[20, 110, 80, 110, 50, 120]} closed fill="gray" /> {/* Sortie conique */}
          {/* Niveau remplissage */}
          <Rect x={25} y={110 - levelHeight} width={50} height={levelHeight} fill="green" />
        </Layer>
      </Stage>

      <div className="text-center mt-2 text-sm">
        {skipPoids.toFixed(0)} kg / {pourcentage.toFixed(0)}%
      </div>
    </div>
  );
};

export default Skip;