import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";

const Index = () => {
  const [playerHp, setPlayerHp] = useState(20);
  const [enemyHp, setEnemyHp] = useState(20);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerX, setPlayerX] = useState(50);
  const [playerZ, setPlayerZ] = useState(80);
  const [enemyZ, setEnemyZ] = useState(10);
  const [showDarkMagic, setShowDarkMagic] = useState(false);
  const [showLightMagic, setShowLightMagic] = useState(false);
  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [trees, setTrees] = useState<{ x: number; z: number; id: number; scale: number }[]>([]);
  const [cameraShake, setCameraShake] = useState(0);
  const [glitchEffect, setGlitchEffect] = useState(false);
  
  const horrorAudioRef = useRef<HTMLAudioElement | null>(null);
  const breathingRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (gameStarted) {
      const newTrees = Array.from({ length: 25 }, (_, i) => ({
        x: Math.random() * 100,
        z: Math.random() * 200,
        id: i,
        scale: 0.8 + Math.random() * 0.6
      }));
      setTrees(newTrees);

      if (!horrorAudioRef.current) {
        horrorAudioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        horrorAudioRef.current.loop = true;
        horrorAudioRef.current.volume = 0.4;
      }
      horrorAudioRef.current.play();

      if (!breathingRef.current) {
        breathingRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2487/2487-preview.mp3');
        breathingRef.current.loop = true;
        breathingRef.current.volume = 0.3;
      }
      breathingRef.current.play();
    } else {
      if (horrorAudioRef.current) {
        horrorAudioRef.current.pause();
        horrorAudioRef.current.currentTime = 0;
      }
      if (breathingRef.current) {
        breathingRef.current.pause();
        breathingRef.current.currentTime = 0;
      }
    }

    return () => {
      if (horrorAudioRef.current) horrorAudioRef.current.pause();
      if (breathingRef.current) breathingRef.current.pause();
    };
  }, [gameStarted]);

  useEffect(() => {
    if (!gameStarted) return;
    
    const interval = setInterval(() => {
      setEnemyZ(prev => {
        const newZ = prev + 0.8;
        if (newZ >= playerZ - 5) {
          setPlayerHp(h => Math.max(0, h - 1));
          setShowDarkMagic(true);
          setCameraShake(15);
          setGlitchEffect(true);
          setTimeout(() => {
            setShowDarkMagic(false);
            setCameraShake(0);
            setGlitchEffect(false);
          }, 600);
          return 10;
        }
        return newZ;
      });

      setTrees(prev => prev.map(tree => {
        const newZ = tree.z + 1.2;
        return {
          ...tree,
          z: newZ > 200 ? Math.random() * 20 : newZ
        };
      }));
    }, 50);

    return () => clearInterval(interval);
  }, [gameStarted, playerZ]);

  const startGame = () => {
    setGameStarted(true);
    setPlayerHp(20);
    setEnemyHp(20);
    setPlayerX(50);
    setPlayerZ(80);
    setEnemyZ(10);
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
    
    setPlayerX(prev => Math.max(10, Math.min(90, prev + (joyX / 15))));
    setPlayerZ(prev => Math.max(50, Math.min(100, prev + (joyY / 15))));
  };

  const handleAttack = () => {
    if (playerHp <= 0 || enemyHp <= 0) return;
    
    setShowLightMagic(true);
    setEnemyHp(prev => Math.max(0, prev - 10));
    setEnemyZ(10);
    setTimeout(() => setShowLightMagic(false), 500);
  };

  const handleJoystickEnd = () => {
    setJoystickActive(false);
    setJoystickPos({ x: 0, y: 0 });
  };

  const getTreeSize = (z: number) => {
    const perspective = 100 - z;
    return Math.max(20, perspective * 0.8);
  };

  const getTreeOpacity = (z: number) => {
    return Math.max(0.3, Math.min(1, (200 - z) / 200));
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black opacity-90" />
        <div className="absolute inset-0">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gray-600 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
        <div className="relative z-10 text-center px-4">
          <div className="mb-8 text-red-600 text-8xl animate-pulse drop-shadow-[0_0_30px_rgba(220,38,38,0.8)]">
            ⚠️
          </div>
          <h1 className="text-7xl font-bold text-red-600 mb-6 drop-shadow-[0_0_30px_rgba(220,38,38,1)] animate-pulse tracking-wider">
            HORROR ESCAPE
          </h1>
          <p className="text-2xl text-gray-400 mb-12 font-mono tracking-wide">
            Shadow Milk преследует тебя...
          </p>
          <p className="text-lg text-red-500 mb-8 animate-pulse">
            ⚠️ Наушники рекомендуются ⚠️
          </p>
          <Button
            onClick={startGame}
            className="bg-gradient-to-r from-red-900 to-black hover:from-black hover:to-red-900 text-red-400 font-bold text-2xl px-16 py-10 rounded-lg shadow-[0_0_40px_rgba(220,38,38,0.6)] hover:shadow-[0_0_60px_rgba(220,38,38,0.9)] transition-all duration-300 hover:scale-105 border-2 border-red-600"
          >
            <Icon name="Skull" className="mr-3 animate-pulse" size={32} />
            ВОЙТИ В КОШМАР
          </Button>
        </div>
      </div>
    );
  }

  if (playerHp <= 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-black to-red-950 animate-pulse" />
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-6xl animate-bounce opacity-70"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                filter: 'blur(2px)'
              }}
            >
              💀
            </div>
          ))}
        </div>
        <div className="relative z-10 text-center px-4 animate-pulse">
          <h1 className="text-8xl font-bold text-red-600 mb-8 drop-shadow-[0_0_50px_rgba(220,38,38,1)] tracking-wider glitch">
            ПРОИГРАЛ ЛОХ,<br />ТЕПЕРЬ ТЫ ПРИКОЛИСТ
          </h1>
          <img 
            src="https://cdn.poehali.dev/files/93b59b95-c7b0-4e1c-8e90-6302b769c0ec.jpeg"
            alt="Game Over"
            className="w-96 mx-auto mb-8 rounded-2xl shadow-[0_0_80px_rgba(220,38,38,0.8)] border-4 border-red-600 animate-pulse"
            style={{ filter: 'contrast(1.3) saturate(0.8)' }}
          />
          <Button
            onClick={startGame}
            className="bg-gradient-to-r from-red-800 to-black hover:from-black hover:to-red-800 text-red-400 font-bold text-xl px-12 py-8 rounded-lg shadow-[0_0_40px_rgba(220,38,38,0.6)] hover:scale-105 transition-all border-2 border-red-600"
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
      <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-amber-800 to-yellow-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              ✨
            </div>
          ))}
        </div>
        <div className="relative z-10 text-center px-4">
          <div className="text-9xl mb-8 animate-bounce">🏆</div>
          <h1 className="text-7xl font-bold text-yellow-300 drop-shadow-[0_0_30px_rgba(253,224,71,1)] mb-8">
            ТЫ ВЫЖИЛ!
          </h1>
          <p className="text-3xl text-yellow-200 font-bold mb-8">
            Shadow Milk побеждён! 🎊
          </p>
          <Button
            onClick={startGame}
            className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-amber-600 hover:to-yellow-600 text-yellow-900 font-bold text-xl px-12 py-8 rounded-lg shadow-[0_8px_20px_rgba(251,191,36,0.5)] hover:scale-105 transition-all border-4 border-yellow-300"
          >
            <Icon name="RotateCcw" className="mr-2" size={24} />
            Играть ещё раз
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-black relative overflow-hidden perspective-1000"
      style={{
        transform: `translate(${Math.random() * cameraShake - cameraShake/2}px, ${Math.random() * cameraShake - cameraShake/2}px)`,
        transition: 'transform 0.05s'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900" />
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(20,20,20,0)_0%,_rgba(0,0,0,1)_100%)]" />

      {glitchEffect && (
        <div className="fixed inset-0 z-50 pointer-events-none mix-blend-difference animate-pulse">
          <div className="absolute inset-0 bg-red-600 opacity-30" />
        </div>
      )}

      {showDarkMagic && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute inset-0 bg-black opacity-80 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-9xl animate-spin text-red-600 drop-shadow-[0_0_50px_rgba(220,38,38,1)]">💀</div>
          </div>
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-6 h-6 bg-red-600 rounded-full opacity-70 animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.3}s`,
                boxShadow: '0 0 20px rgba(220,38,38,1)'
              }}
            />
          ))}
        </div>
      )}

      {showLightMagic && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute inset-0 bg-yellow-400/20 animate-pulse" />
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-6xl animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: '0.5s'
              }}
            >
              ✨
            </div>
          ))}
        </div>
      )}

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4">
        <div className="bg-black/90 backdrop-blur-md rounded-lg p-4 border-2 border-red-900 shadow-[0_0_30px_rgba(220,38,38,0.6)]">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Heart" size={20} className="text-red-500 animate-pulse" />
                <span className="text-red-400 font-bold font-mono">Pure Vanilla: {playerHp}/20</span>
              </div>
              <Progress value={(playerHp / 20) * 100} className="h-3 bg-gray-800" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Skull" size={20} className="text-purple-400 animate-pulse" />
                <span className="text-purple-300 font-bold font-mono">Shadow Milk: {enemyHp}/20</span>
              </div>
              <Progress value={(enemyHp / 20) * 100} className="h-3 bg-gray-800" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 z-10 perspective-3d">
        {trees.map(tree => {
          const size = getTreeSize(tree.z);
          const opacity = getTreeOpacity(tree.z);
          const perspective = (200 - tree.z) / 200;
          
          return (
            <div
              key={tree.id}
              className="absolute transition-all duration-75"
              style={{
                left: `${tree.x}%`,
                bottom: `${perspective * 50}%`,
                transform: `scale(${perspective * tree.scale})`,
                opacity: opacity,
                filter: `blur(${(1 - perspective) * 3}px) brightness(${0.3 + perspective * 0.3})`,
                fontSize: `${size}px`
              }}
            >
              🌲
            </div>
          );
        })}
      </div>

      <div
        className="absolute z-30 bottom-[20%] transition-all duration-100"
        style={{
          left: `${playerX}%`,
          transform: `translateX(-50%) scale(1.2)`,
          filter: 'drop-shadow(0 10px 30px rgba(251,191,36,0.4))'
        }}
      >
        <img
          src="https://cdn.poehali.dev/files/fa659242-67d9-437e-9f84-22a30cf96914.jpeg"
          alt="Pure Vanilla"
          className="w-20 h-20 object-contain animate-pulse"
        />
      </div>

      <div
        className="absolute z-20 transition-all duration-300"
        style={{
          left: '50%',
          bottom: `${((enemyZ - 10) / 90) * 60}%`,
          transform: `translateX(-50%) scale(${1 + (enemyZ / 100) * 1.5})`,
          filter: `brightness(0.4) blur(${Math.max(0, (80 - enemyZ) / 40)}px) drop-shadow(0 0 40px rgba(139,92,246,1))`,
          opacity: Math.min(1, enemyZ / 50)
        }}
      >
        <img
          src="https://cdn.poehali.dev/files/26d7468a-0bc8-400f-80f5-4398242213ac.jpeg"
          alt="Shadow Milk"
          className="w-32 h-32 object-contain animate-pulse"
          style={{
            animation: 'pulse 1s ease-in-out infinite, float 2s ease-in-out infinite'
          }}
        />
      </div>

      <div className="absolute bottom-8 left-8 z-40">
        <div
          className="relative w-32 h-32 bg-black/90 rounded-full border-4 border-red-900 shadow-[0_0_30px_rgba(220,38,38,0.8)]"
          onMouseDown={() => setJoystickActive(true)}
          onMouseUp={handleJoystickEnd}
          onMouseLeave={handleJoystickEnd}
          onMouseMove={handleJoystickMove}
          onTouchStart={() => setJoystickActive(true)}
          onTouchEnd={handleJoystickEnd}
          onTouchMove={handleJoystickMove}
        >
          <div
            className="absolute top-1/2 left-1/2 w-14 h-14 bg-gradient-to-br from-red-600 to-red-900 rounded-full shadow-lg transition-all duration-100 border-2 border-red-400"
            style={{
              transform: `translate(calc(-50% + ${joystickPos.x}px), calc(-50% + ${joystickPos.y}px))`
            }}
          />
        </div>
      </div>

      <div className="absolute bottom-8 right-8 z-40">
        <Button
          onClick={handleAttack}
          className="w-28 h-28 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 hover:from-amber-600 hover:to-yellow-500 border-4 border-yellow-400 shadow-[0_0_40px_rgba(251,191,36,0.9)] hover:shadow-[0_0_60px_rgba(251,191,36,1)] transition-all hover:scale-110 active:scale-95"
        >
          <Icon name="Zap" size={48} className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,1)]" />
        </Button>
      </div>
    </div>
  );
};

export default Index;
