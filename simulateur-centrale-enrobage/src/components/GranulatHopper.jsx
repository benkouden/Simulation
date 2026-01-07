import { motion } from 'framer-motion';
import { Stage, Layer, Rect, Line, Text } from 'react-konva';
import { AlertTriangle } from 'lucide-react';

const GranulatHopper = ({ nom, consigne, reel, pourcentage }) => {
  const ecart = Math.abs(reel - consigne);
  const alarme = ecart > consigne * 0.05;
  const levelHeight = (pourcentage / 5) * 80; // Adaptation niveau visuel (max 80px)

  return (
    <motion.div 
      className={`flex flex-col items-center p-2 rounded border ${alarme ? 'border-red-500' : 'border-gray-500'}`}
      animate={alarme ? { opacity: [1, 0.7, 1] } : {}}
      transition={{ duration: 0.8, repeat: Infinity }}
    >
      {/* Dessin vectoriel de la trémie (entonnoir inversé) */}
      <Stage width={80} height={100}>
        <Layer>
          {/* Forme entonnoir */}
          <Line points={[10, 10, 70, 10, 40, 100, 40, 100]} closed fill="gray" stroke="black" />
          {/* Niveau remplissage animé */}
          <Rect x={15} y={100 - levelHeight} width={50} height={levelHeight} fill="yellow" />
        </Layer>
        <Layer>
          <Text text={nom} x={5} y={105} fontSize={10} fill="white" />
        </Layer>
      </Stage>

      <div className="text-xs mt-2">
        Cons: {consigne.toFixed(1)} | Réel: <span className={alarme ? 'text-red-400' : ''}>{reel.toFixed(1)}</span> t/h
      </div>
      {alarme && <AlertTriangle className="text-red-500 mt-1" size={16} />}
    </motion.div>
  );
};

export default GranulatHopper;