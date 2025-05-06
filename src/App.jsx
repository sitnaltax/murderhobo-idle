import Game from './components/Game';
import './index.css';

function App() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-4 md:p-12 lg:p-24 bg-gray-100">
      <div className="w-full max-w-3xl">
        <h1 className="text-4xl font-bold mb-8 text-center">My Idle Game</h1>
        <Game />
      </div>
    </main>
  );
}

export default App;