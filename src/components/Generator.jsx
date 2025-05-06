export default function Generator({ generator, level, canAfford, onBuy }) {
    const production = generator.baseProduction * level;
    
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
        <div>
          <h3 className="font-bold">{generator.name}</h3>
          <p className="text-sm text-gray-600">Produces {generator.baseProduction} coins/sec</p>
          <p className="text-xs text-gray-500">You own: {level} (producing {production.toFixed(1)}/sec)</p>
        </div>
        <button
          onClick={onBuy}
          disabled={!canAfford}
          className={canAfford ? "generator-btn" : "generator-btn disabled"}
        >
          Buy: {generator.cost.toLocaleString()} coins
        </button>
      </div>
    );
  }