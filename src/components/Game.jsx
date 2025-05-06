import { useState, useEffect } from 'react';
import ResourceDisplay from './ResourceDisplay';
import Generator from './Generator';
import Upgrade from './Upgrade';
import { initialState, saveGame, loadGame } from '../lib/gameState';

export default function Game() {
  // Initialize game state
  const [gameState, setGameState] = useState(initialState);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  
  // Game tick effect - updates resources based on generators
  useEffect(() => {
    const gameLoop = setInterval(() => {
      const now = Date.now();
      const deltaTime = (now - lastUpdate) / 1000; // convert to seconds
      
      setGameState(prevState => {
        // Calculate new resources based on generators
        const newCoins = prevState.coins + (prevState.generators.clickRate * prevState.generators.clickMultiplier * deltaTime);
        
        return {
          ...prevState,
          coins: newCoins
        };
      });
      
      setLastUpdate(now);
    }, 100); // Update 10 times per second for smoother numbers
    
    return () => clearInterval(gameLoop);
  }, [lastUpdate]);
  
  // Auto-save effect
  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveGame(gameState);
      console.log('Game saved');
    }, 30000); // Save every 30 seconds
    
    return () => clearInterval(saveInterval);
  }, [gameState]);
  
  // Load saved game on component mount
  useEffect(() => {
    const savedGame = loadGame();
    if (savedGame) {
      setGameState(savedGame);
      // Calculate offline progress
      const offlineTime = (Date.now() - savedGame.lastSaved) / 1000; // in seconds
      if (offlineTime > 0) {
        const offlineEarnings = savedGame.generators.clickRate * savedGame.generators.clickMultiplier * offlineTime;
        setGameState(prevState => ({
          ...prevState,
          coins: prevState.coins + offlineEarnings
        }));
        alert(`Welcome back! You earned ${offlineEarnings.toFixed(2)} coins while away.`);
      }
    }
  }, []);
  
  // Click handler for manual resource generation
  const handleClick = () => {
    setGameState(prevState => ({
      ...prevState,
      coins: prevState.coins + prevState.clickPower
    }));
  };
  
  // Buy generator handler
  const buyGenerator = (generatorId) => {
    const generator = gameState.availableGenerators[generatorId];
    if (gameState.coins >= generator.cost) {
      setGameState(prevState => {
        const newGeneratorLevel = (prevState.generators.levels[generatorId] || 0) + 1;
        const newLevels = {...prevState.generators.levels, [generatorId]: newGeneratorLevel};
        
        // Calculate new click rate based on all generators
        let newClickRate = 0;
        Object.keys(newLevels).forEach(id => {
          const genDef = prevState.availableGenerators[id];
          newClickRate += genDef.baseProduction * newLevels[id];
        });
        
        return {
          ...prevState,
          coins: prevState.coins - generator.cost,
          generators: {
            ...prevState.generators,
            levels: newLevels,
            clickRate: newClickRate
          },
          availableGenerators: {
            ...prevState.availableGenerators,
            [generatorId]: {
              ...generator,
              cost: Math.floor(generator.cost * 1.15) // Increase cost for next purchase
            }
          }
        };
      });
    }
  };
  
  // Buy upgrade handler
  const buyUpgrade = (upgradeId) => {
    const upgrade = gameState.availableUpgrades[upgradeId];
    if (gameState.coins >= upgrade.cost && !gameState.purchasedUpgrades.includes(upgradeId)) {
      setGameState(prevState => {
        // Apply upgrade effect
        let newState = {...prevState};
        
        if (upgrade.type === 'clickMultiplier') {
          newState.generators.clickMultiplier *= upgrade.effect;
        } else if (upgrade.type === 'clickPower') {
          newState.clickPower *= upgrade.effect;
        }
        
        return {
          ...newState,
          coins: newState.coins - upgrade.cost,
          purchasedUpgrades: [...newState.purchasedUpgrades, upgradeId]
        };
      });
    }
  };
  
  return (
    <div className="bg-white shadow-xl rounded-lg p-6">
      <ResourceDisplay coins={gameState.coins} coinsPerSecond={gameState.generators.clickRate * gameState.generators.clickMultiplier} />
      
      {/* Main clicker button */}
      <div className="my-8 text-center">
        <button 
          onClick={handleClick}
          className="bg-yellow-500 hover:bg-yellow-600 text-white text-xl font-bold py-4 px-8 rounded-full transition transform hover:scale-105 active:scale-95"
        >
          Click For Coins (+{gameState.clickPower.toFixed(1)})
        </button>
      </div>
      
      {/* Generators section */}
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-4">Generators</h2>
        <div className="space-y-4">
          {Object.keys(gameState.availableGenerators).map(generatorId => (
            <Generator 
              key={generatorId}
              generator={gameState.availableGenerators[generatorId]}
              level={gameState.generators.levels[generatorId] || 0}
              canAfford={gameState.coins >= gameState.availableGenerators[generatorId].cost}
              onBuy={() => buyGenerator(generatorId)}
            />
          ))}
        </div>
      </div>
      
      {/* Upgrades section */}
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-4">Upgrades</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(gameState.availableUpgrades)
            .filter(id => !gameState.purchasedUpgrades.includes(id))
            .map(upgradeId => (
              <Upgrade
                key={upgradeId}
                upgrade={gameState.availableUpgrades[upgradeId]}
                canAfford={gameState.coins >= gameState.availableUpgrades[upgradeId].cost}
                onBuy={() => buyUpgrade(upgradeId)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}