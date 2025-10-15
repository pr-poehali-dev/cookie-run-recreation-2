import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";

const Index = () => {
  const [playerHp, setPlayerHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerX, setPlayerX] = useState(50);
  const [playerY, setPlayerY] = useState(50);
  const [enemyDistance, setEnemyDistance] = useState(100);
  const [showDarkMagic, setShowDarkMagic] = useState(false);
  const [showLightMagic, setShowLightMagic] = useState(false);
  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [trees, setTrees] = useState<{ x: number; y: number; id: number }[]>([]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const funnyAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (gameStarted) {
      const newTrees = Array.from({ length: 15 }, (_, i) => ({
        x: Math.random() * 90 + 5,
        y: Math.random() * 90 + 5,
        id: i
      }));
      setTrees(newTrees);
    }
  }, [gameStarted]);

  useEffect(() => {
    if (!gameStarted) return;
    
    const interval = setInterval(() => {
      setEnemyDistance(prev => {
        const newDistance = prev - 2;
        if (newDistance <= 0) {
          setPlayerHp(h => Math.max(0, h - 15));
          setShowDarkMagic(true);
          setTimeout(() => setShowDarkMagic(false), 800);
          return 100;
        }
        return newDistance;
      });

      setTrees(prev => prev.map(tree => ({
        ...tree,
        y: tree.y + 1.5 > 100 ? Math.random() * 20 : tree.y + 1.5
      })));
    }, 100);

    return () => clearInterval(interval);
  }, [gameStarted]);

  useEffect(() => {
    if (playerHp <= 30 && playerHp > 0 && gameStarted) {
      if (!audioRef.current) {
        audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audioRef.current.loop = true;
        audioRef.current.volume = 0.3;
      }
      audioRef.current.play();
    } else if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [playerHp, gameStarted]);

  useEffect(() => {
    if (enemyHp <= 30 && enemyHp > 0 && gameStarted) {
      if (!funnyAudioRef.current) {
        funnyAudioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
        funnyAudioRef.current.loop = true;
        funnyAudioRef.current.volume = 0.4;
      }
      funnyAudioRef.current.play();
    } else if (funnyAudioRef.current) {
      funnyAudioRef.current.pause();
      funnyAudioRef.current.currentTime = 0;
    }
  }, [enemyHp, gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setPlayerHp(100);
    setEnemyHp(100);
    setPlayerX(50);
    setPlayerY(50);
    setEnemyDistance(100);
  };

  const handleJoystickMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!joystickActive) return;
    
    const joystick = e.currentTarget as HTMLElement;
    const rect = joystick.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = clientX - rect.left - centerX;
    const y = clientY - rect.top - centerY;
    
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = 40;
    const ratio = Math.min(distance / maxDistance, 1);
    
    const angle = Math.atan2(y, x);
    const joyX = Math.cos(angle) * ratio * maxDistance;
    const joyY = Math.sin(angle) * ratio * maxDistance;
    
    setJoystickPos({ x: joyX, y: joyY });
    
    setPlayerX(prev => Math.max(5, Math.min(95, prev + (joyX / 10))));
    setPlayerY(prev => Math.max(5, Math.min(95, prev + (joyY / 10))));
  };

  const handleAttack = () => {
    if (playerHp <= 0 || enemyHp <= 0) return;
    
    setShowLightMagic(true);
    const damage = Math.floor(Math.random() * 10) + 15;
    setEnemyHp(prev => Math.max(0, prev - damage));
    setTimeout(() => setShowLightMagic(false), 600);
  };

  const handleJoystickEnd = () => {
    setJoystickActive(false);
    setJoystickPos({ x: 0, y: 0 });
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: `url('https://cdn.poehali.dev/files/137f0088-23c5-42dd-a457-d7e3e2360ace.jpeg')` }}
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] via-[#6366f1] to-[#3b82f6] drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] mb-8 animate-pulse">
            COOKIE RUN ESCAPE
          </h1>
          <p className="text-2xl text-purple-300 mb-12 drop-shadow-lg">
            🏃 Убегай от Shadow Milk! 💀
          </p>
          <Button
            onClick={startGame}
            className="bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] hover:from-[#6366f1] hover:to-[#8b5cf6] text-white font-bold text-2xl px-16 py-10 rounded-full shadow-[0_12px_30px_rgba(139,92,246,0.6)] hover:shadow-[0_16px_40px_rgba(139,92,246,0.8)] transition-all duration-300 hover:scale-110 border-4 border-purple-400"
          >
            <Icon name="Play" className="mr-3" size={32} />
            НАЧАТЬ ИГРУ
          </Button>
        </div>
      </div>
    );
  }

  if (playerHp <= 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950 to-black opacity-60" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-6xl font-bold text-red-500 mb-8 drop-shadow-[0_0_30px_rgba(239,68,68,1)] animate-pulse">
            ПРОИГРАЛ ЛОХ,<br />ТЕПЕРЬ ТЫ ПРИКОЛИСТ
          </h1>
          <img 
            src="https://cdn.poehali.dev/files/93b59b95-c7b0-4e1c-8e90-6302b769c0ec.jpeg"
            alt="Game Over"
            className="w-96 mx-auto mb-8 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.5)] border-4 border-red-500"
          />
          <Button
            onClick={startGame}
            className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold text-xl px-12 py-8 rounded-full shadow-[0_8px_20px_rgba(239,68,68,0.5)] hover:scale-105 transition-all border-4 border-red-400"
          >
            <Icon name="RotateCcw" className="mr-2" size={24} />
            Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

  if (enemyHp <= 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-amber-200 to-orange-200 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            >
              🎉
            </div>
          ))}
        </div>
        <div className="relative z-10 text-center px-4">
          <div className="text-9xl mb-8 animate-bounce">🏆</div>
          <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-600 drop-shadow-lg mb-8">
            ПОБЕДА!
          </h1>
          <p className="text-3xl text-amber-800 font-bold mb-8">
            Ты победил Shadow Milk! 🎊
          </p>
          <Button
            onClick={startGame}
            className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-amber-900 font-bold text-xl px-12 py-8 rounded-full shadow-[0_8px_20px_rgba(245,158,11,0.5)] hover:scale-105 transition-all border-4 border-yellow-300"
          >
            <Icon name="RotateCcw" className="mr-2" size={24} />
            Играть ещё раз
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a472a] via-[#2d5016] to-[#1a3a1a] relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-40 bg-cover bg-center animate-scroll-bg"
        style={{ backgroundImage: `url('https://cdn.poehali.dev/files/d0f97b68-e159-421f-b8f0-b08e0c8ae6f9.jpeg')` }}
      />

      {showDarkMagic && (
        <div className="fixed inset-0 z-50 pointer-events-none animate-pulse">
          <div className="absolute inset-0 bg-purple-900/60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-9xl animate-spin">💀</div>
          </div>
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 bg-purple-500 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`
              }}
            />
          ))}
        </div>
      )}

      {showLightMagic && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute inset-0 bg-yellow-400/30" />
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-6xl animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: '0.6s'
              }}
            >
              ✨
            </div>
          ))}
        </div>
      )}

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4">
        <div className="bg-black/80 backdrop-blur-md rounded-2xl p-4 border-4 border-purple-500 shadow-[0_0_30px_rgba(139,92,246,0.6)]">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Heart" size={20} className="text-red-500" />
                <span className="text-white font-bold">Pure Vanilla: {playerHp}</span>
              </div>
              <Progress value={playerHp} className="h-3" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Skull" size={20} className="text-purple-400" />
                <span className="text-purple-200 font-bold">Shadow Milk: {enemyHp}</span>
              </div>
              <Progress value={enemyHp} className="h-3" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 z-10">
        {trees.map(tree => (
          <div
            key={tree.id}
            className="absolute text-6xl transition-all duration-100"
            style={{
              left: `${tree.x}%`,
              top: `${tree.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            🌲
          </div>
        ))}
      </div>

      <div
        className="absolute z-30 transition-all duration-100"
        style={{
          left: `${playerX}%`,
          top: `${playerY}%`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <img
          src="https://cdn.poehali.dev/files/fa659242-67d9-437e-9f84-22a30cf96914.jpeg"
          alt="Pure Vanilla"
          className="w-24 h-24 object-contain drop-shadow-[0_0_20px_rgba(255,215,0,0.8)]"
        />
      </div>

      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 z-20 opacity-70 transition-all duration-300"
        style={{
          transform: `translate(-50%, ${enemyDistance}%)`,
          scale: `${1 + (100 - enemyDistance) / 100}`
        }}
      >
        <img
          src="https://cdn.poehali.dev/files/26d7468a-0bc8-400f-80f5-4398242213ac.jpeg"
          alt="Shadow Milk"
          className="w-32 h-32 object-contain drop-shadow-[0_0_30px_rgba(139,92,246,1)] animate-pulse"
        />
      </div>

      <div className="absolute bottom-8 left-8 z-40">
        <div
          className="relative w-32 h-32 bg-gray-900/80 rounded-full border-4 border-gray-700 shadow-[0_0_20px_rgba(0,0,0,0.8)]"
          onMouseDown={() => setJoystickActive(true)}
          onMouseUp={handleJoystickEnd}
          onMouseLeave={handleJoystickEnd}
          onMouseMove={handleJoystickMove}
          onTouchStart={() => setJoystickActive(true)}
          onTouchEnd={handleJoystickEnd}
          onTouchMove={handleJoystickMove}
        >
          <div
            className="absolute top-1/2 left-1/2 w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full shadow-lg transition-all duration-100 border-2 border-purple-300"
            style={{
              transform: `translate(calc(-50% + ${joystickPos.x}px), calc(-50% + ${joystickPos.y}px))`
            }}
          />
        </div>
      </div>

      <div className="absolute bottom-8 right-8 z-40">
        <Button
          onClick={handleAttack}
          className="w-28 h-28 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-400 border-4 border-yellow-300 shadow-[0_0_30px_rgba(251,191,36,0.8)] hover:shadow-[0_0_50px_rgba(251,191,36,1)] transition-all hover:scale-110 active:scale-95"
        >
          <Icon name="Zap" size={48} className="text-white drop-shadow-lg" />
        </Button>
      </div>
    </div>
  );
};

export default Index;
