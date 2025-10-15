import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface DialogLine {
  type: 'narration' | 'vanilla' | 'shadow';
  text: string;
  showJumpscare?: boolean;
  choices?: { text: string; nextScene: string }[];
}

interface Scene {
  id: string;
  background: string;
  dialogs: DialogLine[];
  isEnding?: boolean;
}

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentScene, setCurrentScene] = useState<string>('start');
  const [dialogIndex, setDialogIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [textComplete, setTextComplete] = useState(false);
  const [showJumpscare, setShowJumpscare] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scareAudioRef = useRef<HTMLAudioElement | null>(null);
  const failAudioRef = useRef<HTMLAudioElement | null>(null);

  const scenes: Record<string, Scene> = {
    start: {
      id: 'start',
      background: 'https://cdn.poehali.dev/projects/9105be04-580e-41b4-b0b0-8af956d7d258/files/fb652899-56ad-4098-8afb-0c608098044b.jpg',
      dialogs: [
        { 
          type: 'narration', 
          text: 'Ванилла проснулся в каком-то странном подвале, он ничего не помнит' 
        },
        { 
          type: 'vanilla', 
          text: 'Что происходит, где я?!?!' 
        },
        { 
          type: 'narration', 
          text: 'Вдруг заходит странный полумрак полухз и хихикает',
          showJumpscare: true
        },
        { 
          type: 'shadow', 
          text: 'Привет Детлеф петух! Ну как те тут?! Круто?!',
          choices: [
            { text: 'да имбуля', nextScene: 'path1' },
            { text: 'ОТПУСТИ МЕНЯ ШУТ', nextScene: 'bad_ending' }
          ]
        }
      ]
    },
    path1: {
      id: 'path1',
      background: 'https://cdn.poehali.dev/projects/9105be04-580e-41b4-b0b0-8af956d7d258/files/fb652899-56ad-4098-8afb-0c608098044b.jpg',
      dialogs: [
        {
          type: 'shadow',
          text: 'Ха-ха! Молодец, что согласился! Тогда поиграем в игру...'
        },
        {
          type: 'vanilla',
          text: 'В какую игру? Что происходит?!'
        },
        {
          type: 'shadow',
          text: 'Всё просто! Найди выход из подвала за 5 минут, или останешься здесь... НАВСЕГДА!',
          choices: [
            { text: 'Искать выход', nextScene: 'good_ending' },
            { text: 'Отказаться играть', nextScene: 'bad_ending' }
          ]
        }
      ]
    },
    good_ending: {
      id: 'good_ending',
      background: 'linear-gradient(to bottom, #4a5568, #2d3748)',
      dialogs: [
        {
          type: 'narration',
          text: 'Ванилла нашёл скрытую дверь за старыми ящиками...'
        },
        {
          type: 'vanilla',
          text: 'Я... я нашёл выход! Я свободен!'
        },
        {
          type: 'shadow',
          text: 'Молодец, малыш! Ты прошёл мой тест! Удачи в следующий раз... Ха-ха-ха!'
        }
      ],
      isEnding: true
    },
    bad_ending: {
      id: 'bad_ending',
      background: 'linear-gradient(to bottom, #1e3a8a, #1e1b4b)',
      dialogs: [
        {
          type: 'shadow',
          text: 'Офигел'
        }
      ],
      isEnding: true
    }
  };

  useEffect(() => {
    if (gameStarted && !audioRef.current) {
      audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2462/2462-preview.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
      audioRef.current.play();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (scareAudioRef.current) {
        scareAudioRef.current.pause();
      }
      if (failAudioRef.current) {
        failAudioRef.current.pause();
      }
    };
  }, [gameStarted]);

  useEffect(() => {
    if (!gameStarted) return;
    
    const scene = scenes[currentScene];
    const dialog = scene.dialogs[dialogIndex];
    
    if (!dialog) return;

    setDisplayedText("");
    setTextComplete(false);
    
    let index = 0;
    const interval = setInterval(() => {
      if (index < dialog.text.length) {
        setDisplayedText(dialog.text.slice(0, index + 1));
        index++;
      } else {
        setTextComplete(true);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentScene, dialogIndex, gameStarted]);

  const handleNext = () => {
    const scene = scenes[currentScene];
    const dialog = scene.dialogs[dialogIndex];

    if (dialog.showJumpscare && textComplete) {
      setShowJumpscare(true);
      if (!scareAudioRef.current) {
        scareAudioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2803/2803-preview.mp3');
        scareAudioRef.current.volume = 0.6;
      }
      scareAudioRef.current.play().catch(() => {});
      
      setTimeout(() => {
        setShowJumpscare(false);
        setDialogIndex(dialogIndex + 1);
      }, 1500);
      return;
    }

    if (dialogIndex < scene.dialogs.length - 1) {
      setDialogIndex(dialogIndex + 1);
    }
  };

  const handleChoice = (nextScene: string) => {
    if (nextScene === 'bad_ending') {
      if (!failAudioRef.current) {
        failAudioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
        failAudioRef.current.volume = 0.5;
      }
      failAudioRef.current.play().catch(() => {});
    }
    
    setCurrentScene(nextScene);
    setDialogIndex(0);
  };

  const startGame = () => {
    setGameStarted(true);
    setCurrentScene('start');
    setDialogIndex(0);
  };

  const restartGame = () => {
    setGameStarted(false);
    setCurrentScene('start');
    setDialogIndex(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url('https://cdn.poehali.dev/files/5cc9fbcb-1daa-426d-b3b1-f90dbbed70f9.jpeg')`,
            filter: 'brightness(0.4) blur(2px)'
          }}
        />
        
        <div className="rain-container absolute inset-0 pointer-events-none z-10">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="rain-drop"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4">
          <h1 className="text-8xl font-bold mb-4 text-center blood-drip-text">
            ПОБЕГ ОТ<br />ШАДОУ МИЛКА
          </h1>
          
          <p className="text-gray-400 text-sm mb-12 font-mono">
            автор: Британи лох
          </p>

          <Button
            onClick={startGame}
            className="bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white font-bold text-2xl px-16 py-8 rounded-lg shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:shadow-[0_0_50px_rgba(59,130,246,0.7)] transition-all duration-300 hover:scale-105 border-2 border-blue-500"
          >
            НАЧАТЬ
          </Button>
        </div>
      </div>
    );
  }

  const scene = scenes[currentScene];
  const currentDialog = scene.dialogs[dialogIndex];

  if (showJumpscare) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center animate-pulse">
        <img
          src="https://cdn.poehali.dev/files/2c498c4c-8c52-47bd-ad8d-78cd59c72e99.jpeg"
          alt="Jumpscare"
          className="w-full h-full object-cover animate-ping"
          style={{ animation: 'ping 0.3s ease-in-out infinite' }}
        />
      </div>
    );
  }

  if (scene.isEnding) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ background: scene.id === 'bad_ending' ? 'linear-gradient(to bottom, #1e3a8a, #1e1b4b)' : 'linear-gradient(to bottom, #4a5568, #2d3748)' }}
      >
        {scene.id === 'bad_ending' && (
          <div className="absolute inset-0">
            <img
              src="https://cdn.poehali.dev/files/c52c4168-102e-4b57-9adb-5f47812a1584.jpeg"
              alt="Game Over"
              className="w-full h-full object-cover opacity-40"
            />
          </div>
        )}
        
        <div className="relative z-10 text-center px-4">
          {scene.id === 'bad_ending' ? (
            <>
              <div className="text-8xl mb-8 animate-bounce">💀</div>
              <h2 className="text-6xl font-bold text-red-500 mb-4 drop-shadow-[0_0_30px_rgba(239,68,68,1)]">
                GAME OVER
              </h2>
              <p className="text-3xl text-red-400 mb-8 font-bold">
                {currentDialog.text}
              </p>
            </>
          ) : (
            <>
              <div className="text-8xl mb-8 animate-bounce">🎉</div>
              <h2 className="text-6xl font-bold text-green-400 mb-4 drop-shadow-[0_0_30px_rgba(74,222,128,1)]">
                ПОБЕДА!
              </h2>
              <p className="text-2xl text-green-300 mb-8">
                Ты смог сбежать от Шадоу Милка!
              </p>
            </>
          )}
          
          <Button
            onClick={restartGame}
            className="bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800 text-white font-bold text-xl px-12 py-6 rounded-lg"
          >
            Начать заново
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
    >
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url('${scene.background}')`,
          filter: 'brightness(0.6)'
        }}
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="rain-container absolute inset-0 pointer-events-none z-10">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="rain-drop"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${0.5 + Math.random() * 0.5}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-20 min-h-screen flex flex-col justify-end pb-4 px-4">
        {currentDialog.type !== 'narration' && (
          <div className="mb-4 flex justify-center">
            <div className="bg-black/80 rounded-2xl p-4 border-2 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
              <img
                src={currentDialog.type === 'vanilla' 
                  ? 'https://cdn.poehali.dev/files/8a55b115-da1f-4d2c-8611-d93c420ba153.jpeg'
                  : 'https://cdn.poehali.dev/files/808e85c0-7f2a-4e3d-a314-73ffa0755a6a.jpeg'
                }
                alt={currentDialog.type === 'vanilla' ? 'Pure Vanilla' : 'Shadow Milk'}
                className="w-32 h-32 object-contain animate-float"
              />
            </div>
          </div>
        )}

        <Card className="bg-black/90 backdrop-blur-md border-2 border-blue-900 shadow-[0_0_30px_rgba(59,130,246,0.4)]">
          <CardContent className="p-6">
            {currentDialog.type === 'narration' ? (
              <p className="text-gray-400 text-lg leading-relaxed mb-4 min-h-[80px] italic">
                {displayedText}
                {!textComplete && <span className="animate-pulse">▌</span>}
              </p>
            ) : (
              <>
                <h3 className="text-2xl font-bold mb-3" style={{
                  color: currentDialog.type === 'vanilla' ? '#fbbf24' : '#8b5cf6',
                  fontFamily: currentDialog.type === 'vanilla' ? 'Fredoka, sans-serif' : 'inherit'
                }}>
                  {currentDialog.type === 'vanilla' ? 'Pure Vanilla' : 'Shadow Milk'}
                </h3>
                <p className="text-white text-lg leading-relaxed mb-4 min-h-[80px]">
                  {displayedText}
                  {!textComplete && <span className="animate-pulse">▌</span>}
                </p>
              </>
            )}

            {textComplete && currentDialog.choices ? (
              <div className="space-y-3">
                {currentDialog.choices.map((choice, index) => (
                  <Button
                    key={index}
                    onClick={() => handleChoice(choice.nextScene)}
                    className="w-full bg-gradient-to-r from-blue-800/80 to-blue-900/80 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-lg py-6 border border-blue-600 hover:border-blue-400 transition-all"
                  >
                    {choice.text}
                  </Button>
                ))}
              </div>
            ) : textComplete && dialogIndex < scene.dialogs.length - 1 ? (
              <Button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800 text-white font-bold text-lg py-4"
              >
                Продолжить ▶
              </Button>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;