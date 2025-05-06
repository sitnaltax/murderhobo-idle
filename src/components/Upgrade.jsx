export default function Upgrade({ upgrade, canAfford, onBuy }) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold">{upgrade.name}</h3>
          <span className="text-sm text-gray-600">{upgrade.cost.toLocaleString()} coins</span>
        </div>
        <p className="text-sm text-gray-600 mb-3">{upgrade.description}</p>
        <button
          onClick={onBuy}
          disabled={!canAfford}
          className={canAfford ? "upgrade-btn w-full" : "upgrade-btn w-full disabled"}
        >
          Purchase
        </button>
      </div>
    );
  }