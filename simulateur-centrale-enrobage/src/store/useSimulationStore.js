import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSimulationStore = create(
  persist(
    (set, get) => ({
      // Données de base
      productionActive: false,
      debitConsigne: 100,           // t/h
      debitReel: 102.96,
      temperatureTambour: 108,
      pressionTambour: 1.12,
      pourcentageBruleur: 48,
      temperatureBitume: 154,

      // Granulats (exemple avec 4 trémies)
      granulats: [
        { id: 1, nom: 'Grav 10/14', consigne: 0, reel: 0, pourcentage: 0 },
        { id: 2, nom: 'Grav 20/0',  consigne: 33.5, reel: 38.9, pourcentage: 0.7 },
        { id: 3, nom: 'Sable 0/5',  consigne: 43.1, reel: 50.3, pourcentage: 3.9 },
        { id: 4, nom: 'Grav 5/10',  consigne: 19.2, reel: 22.2, pourcentage: 1 },
      ],

      // Skip / stockage enrobés
      skipPoids: 960,
      skipCapaciteMax: 2000,

      // Alarmes
      alarmes: [],

      // Actions
      toggleProduction: () => set(state => ({ productionActive: !state.productionActive })),

      setPourcentageBruleur: (valeur) => 
        set({ pourcentageBruleur: Math.max(0, Math.min(100, valeur)) }),

      setDebitConsigne: (valeur) => set({ debitConsigne: Math.max(0, valeur) }),

      // Simulation temps réel
      startSimulation: () => {
        if (get().intervalId) return;
        
        const intervalId = setInterval(() => {
          set(state => {
            if (!state.productionActive) return state;

            // Variation réaliste du débit réel
            const variation = (Math.random() * 6 - 3); // ±3 t/h
            let nouveauDebit = state.debitReel + variation;
            nouveauDebit = Math.max(0, Math.min(state.debitConsigne * 1.3, nouveauDebit));

            // Température suit le brûleur avec inertie
            const deltaTemp = (state.pourcentageBruleur - 50) * 0.4;
            const nouvelleTemp = Math.max(70, Math.min(180, state.temperatureTambour + deltaTemp * 0.15));

            // Mise à jour granulats (simulation légère)
            const nouveauxGranulats = state.granulats.map(g => {
              if (g.consigne === 0) return g;
              const ecart = Math.random() * 4 - 2;
              return {
                ...g,
                reel: Math.max(0, g.reel + ecart)
              };
            });

            // Détection alarmes
            const nouvellesAlarmes = [];
            nouveauxGranulats.forEach(g => {
              if (g.consigne > 0) {
                const ecartPourcent = Math.abs((g.reel - g.consigne) / g.consigne * 100);
                if (ecartPourcent > 5) {
                  nouvellesAlarmes.push(`Écart important - ${g.nom} (${ecartPourcent.toFixed(1)}%)`);
                }
              }
            });

            if (nouveauDebit < state.debitConsigne * 0.9) {
              nouvellesAlarmes.push("Débit global trop faible !");
            }

            return {
              debitReel: nouveauDebit,
              temperatureTambour: nouvelleTemp,
              granulats: nouveauxGranulats,
              alarmes: nouvellesAlarmes,
            };
          });
        }, 2500);

        set({ intervalId });
      },

      stopSimulation: () => {
        const { intervalId } = get();
        if (intervalId) {
          clearInterval(intervalId);
          set({ intervalId: null });
        }
      }
    }),
    {
      name: 'enrobage-simulation-storage',
      partialize: (state) => ({
        productionActive: state.productionActive,
        debitConsigne: state.debitConsigne,
        pourcentageBruleur: state.pourcentageBruleur
      })
    }
  )
);

export default useSimulationStore;