export const initialState = {
    coins: 0,
    clickPower: 1,
    generators: {
      clickRate: 0,
      clickMultiplier: 1,
      levels: {}
    },
    availableGenerators: {
      cursor: {
        id: 'cursor',
        name: 'Cursor',
        description: 'Automatically clicks for you',
        baseProduction: 0.1,
        cost: 10
      },
      farm: {
        id: 'farm',
        name: 'Coin Farm',
        description: 'Grows coins from the ground',
        baseProduction: 0.5,
        cost: 50
      },
      mine: {
        id: 'mine',
        name: 'Coin Mine',
        description: 'Digs for precious coins',
        baseProduction: 2,
        cost: 250
      },
      factory: {
        id: 'factory',
        name: 'Coin Factory',
        description: 'Mass produces coins',
        baseProduction: 10,
        cost: 1000
      }
    },
    availableUpgrades: {
      betterClicks: {
        id: 'betterClicks',
        name: 'Better Clicks',
        description: 'Double the power of manual clicks',
        type: 'clickPower',
        effect: 2,
        cost: 100
      },
      improvedEfficiency: {
        id: 'improvedEfficiency',
        name: 'Improved Efficiency',
        description: 'All generators produce 50% more coins',
        type: 'clickMultiplier',
        effect: 1.5,
        cost: 500
      },
      goldFingers: {
        id: 'goldFingers',
        name: 'Gold Fingers',
        description: 'Triple the power of manual clicks',
        type: 'clickPower',
        effect: 3,
        cost: 2000
      },
      productionBoost: {
        id: 'productionBoost',
        name: 'Production Boost',
        description: 'All generators produce twice as many coins',
        type: 'clickMultiplier',
        effect: 2,
        cost: 5000
      }
    },
    purchasedUpgrades: [],
    lastSaved: Date.now()
  };
  
  // Save game to localStorage
  export function saveGame(gameState) {
    const saveData = {
      ...gameState,
      lastSaved: Date.now()
    };
    localStorage.setItem('idleGameSave', JSON.stringify(saveData));
  }
  
  // Load game from localStorage
  export function loadGame() {
    const savedGame = localStorage.getItem('idleGameSave');
    if (savedGame) {
      return JSON.parse(savedGame);
    }
    return null;
  }
  
  // Reset game (for debugging/testing)
  export function resetGame() {
    localStorage.removeItem('idleGameSave');
    return initialState;
  }
  