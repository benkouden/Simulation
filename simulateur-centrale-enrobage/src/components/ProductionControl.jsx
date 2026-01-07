import useSimulationStore from '../store/useSimulationStore';

const ProductionControl = () => {
  const { 
    productionActive, 
    toggleProduction, 
    debitConsigne, 
    setDebitConsigne,
    debitReel 
  } = useSimulationStore();

  return (
    <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
      <h3 className="text-lg font-semibold text-orange-300 mb-3">Contrôle Production</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Consigne (t/h)</label>
          <input
            type="number"
            value={debitConsigne}
            onChange={(e) => setDebitConsigne(Number(e.target.value))}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
            min="0"
            step="5"
          />
        </div>

        <div className="text-center text-xl font-bold">
          {debitReel.toFixed(1)} / {debitConsigne} t/h
        </div>

        <button
          onClick={toggleProduction}
          className={`w-full py-3 rounded font-bold text-lg transition-colors ${
            productionActive 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {productionActive ? 'ARRÊT URGENT' : 'DÉMARRER PRODUCTION'}
        </button>
      </div>
    </div>
  );
};

export default ProductionControl;