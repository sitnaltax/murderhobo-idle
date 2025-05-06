export default function ResourceDisplay({ coins, coinsPerSecond }) {
    return (
      <div className="text-center p-4 bg-gray-100 rounded-lg shadow-inner">
        <div className="text-4xl font-bold text-yellow-600">
          {Math.floor(coins).toLocaleString()} Coins
        </div>
        <div className="text-gray-600 mt-2">
          {coinsPerSecond.toFixed(1)} coins per second
        </div>
      </div>
    );
  }