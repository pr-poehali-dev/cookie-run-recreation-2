import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface Choice {
  text: string;
  nextScene: number;
}

interface Scene {
  id: number;
  background: string;
  character?: string;
  text: string;
  speaker?: string;
  choices?: Choice[];
  isEnding?: boolean;
  endingType?: 'good' | 'bad';
}

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [textComplete, setTextComplete] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const scenes: Scene[] = [
    {
      id: 0,
      background: "https://cdn.poehali.dev/files/5cc9fbcb-1daa-426d-b3b1-f90dbbed70f9.jpeg",
      character: "https://cdn.poehali.dev/files/2097b897-7ece-44da-a38b-122df7e3913f.jpeg",
      speaker: "Pure Vanilla",
      text: "Я проснулся в тёмном лесу... Дождь не прекращается. Что-то пошло не так...",
      choices: [
        { text: "Осмотреться вокруг", nextScene: 1 },
        { text: "Позвать на помощь", nextScene: 2 }
      ]
    },
    {
      id: 1,
      background: "https://cdn.poehali.dev/files/5cc9fbcb-1daa-426d-b3b1-f90dbbed70f9.jpeg",
      character: "https://cdn.poehali.dev/files/2097b897-7ece-44da-a38b-122df7e3913f.jpeg",
      speaker: "Pure Vanilla",
      text: "Вокруг только деревья и тьма. Внезапно я услышал жуткий смех за спиной...",
      choices: [
        { text: "Обернуться", nextScene: 3 },
        { text: "Бежать прочь", nextScene: 4 }
      ]
    },
    {
      id: 2,
      background: "https://cdn.poehali.dev/files/5cc9fbcb-1daa-426d-b3b1-f90dbbed70f9.jpeg",
      character: "https://cdn.poehali.dev/files/2097b897-7ece-44da-a38b-122df7e3913f.jpeg",
      speaker: "Pure Vanilla",
      text: "Эхо моего голоса отразилось от деревьев. В ответ раздался зловещий хохот...",
      choices: [
        { text: "Искать укрытие", nextScene: 4 },
        { text: "Стоять на месте", nextScene: 5 }
      ]
    },
    {
      id: 3,
      background: "https://cdn.poehali.dev/files/5cc9fbcb-1daa-426d-b3b1-f90dbbed70f9.jpeg",
      character: "https://cdn.poehali.dev/files/5e4e492f-e871-4161-b636-a5f2415f1e5e.jpeg",
      speaker: "Shadow Milk",
      text: "Ну привет, маленький волшебник... Думал, что сможешь от меня убежать?",
      choices: [
        { text: "Использовать магию света", nextScene: 6 },
        { text: "Попытаться убежать", nextScene: 7 }
      ]
    },
    {
      id: 4,
      background: "https://cdn.poehali.dev/files/5cc9fbcb-1daa-426d-b3b1-f90dbbed70f9.jpeg",
      character: "https://cdn.poehali.dev/files/2097b897-7ece-44da-a38b-122df7e3913f.jpeg",
      speaker: "Pure Vanilla",
      text: "Я бежал сквозь лес, ветки царапали лицо. Но шаги за спиной становились всё ближе...",
      choices: [
        { text: "Спрятаться за деревом", nextScene: 8 },
        { text: "Продолжать бежать", nextScene: 9 }
      ]
    },
    {
      id: 5,
      background: "https://cdn.poehali.dev/files/5cc9fbcb-1daa-426d-b3b1-f90dbbed70f9.jpeg",
      character: "https://cdn.poehali.dev/files/5e4e492f-e871-4161-b636-a5f2415f1e5e.jpeg",
      speaker: "Shadow Milk",
      text: "Храбрый... или глупый? Теперь ты моя марионетка!",
      isEnding: true,
      endingType: 'bad'
    },
    {
      id: 6,
      background: "https://cdn.poehali.dev/files/5cc9fbcb-1daa-426d-b3b1-f90dbbed70f9.jpeg",
      character: "https://cdn.poehali.dev/files/2097b897-7ece-44da-a38b-122df7e3913f.jpeg",
      speaker: "Pure Vanilla",
      text: "Моя магия света отбросила Shadow Milk назад! Я нашёл путь к выходу из леса!",
      isEnding: true,
      endingType: 'good'
    },
    {
      id: 7,
      background: "https://cdn.poehali.dev/files/5cc9fbcb-1daa-426d-b3b1-f90dbbed70f9.jpeg",
      character: "https://cdn.poehali.dev/files/5e4e492f-e871-4161-b636-a5f2415f1e5e.jpeg",
      speaker: "Shadow Milk",
      text: "Убежать? От меня?! Тьма настигает всех! Ха-ха-ха!",
      isEnding: true,
      endingType: 'bad'
    },
    {
      id: 8,
      background: "https://cdn.poehali.dev/files/5cc9fbcb-1daa-426d-b3b1-f90dbbed70f9.jpeg",
      character: "https://cdn.poehali.dev/files/2097b897-7ece-44da-a38b-122df7e3913f.jpeg",
      speaker: "Pure Vanilla",
      text: "Затаив дыхание, я ждал. Shadow Milk прошёл мимо... Я увидел просвет между деревьями!",
      choices: [
        { text: "Тихо пройти к выходу", nextScene: 10 },
        { text: "Подождать ещё", nextScene: 5 }
      ]
    },
    {
      id: 9,
      background: "https://cdn.poehali.dev/files/5cc9fbcb-1daa-426d-b3b1-f90dbbed70f9.jpeg",
      character: "https://cdn.poehali.dev/files/2097b897-7ece-44da-a38b-122df7e3913f.jpeg",
      speaker: "Pure Vanilla",
      text: "Мои ноги уже не держали... Я споткнулся о корень дерева...",
      choices: [
        { text: "Встать и защищаться", nextScene: 6 },
        { text: "Сдаться судьбе", nextScene: 5 }
      ]
    },
    {
      id: 10,
      background: "https://cdn.poehali.dev/files/5cc9fbcb-1daa-426d-b3b1-f90dbbed70f9.jpeg",
      character: "https://cdn.poehali.dev/files/2097b897-7ece-44da-a38b-122df7e3913f.jpeg",
      speaker: "Pure Vanilla",
      text: "Я выбрался из проклятого леса... Свет рассвета встретил меня. Я... свободен!",
      isEnding: true,
      endingType: 'good'
    }
  ];

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
        audioRef.current.currentTime = 0;
      }
    };
  }, [gameStarted]);

  useEffect(() => {
    if (!gameStarted) return;
    
    const scene = scenes[currentScene];
    setDisplayedText("");
    setTextComplete(false);
    
    let index = 0;
    const interval = setInterval(() => {
      if (index < scene.text.length) {
        setDisplayedText(scene.text.slice(0, index + 1));
        index++;
      } else {
        setTextComplete(true);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentScene, gameStarted]);

  const handleChoice = (nextScene: number) => {
    setCurrentScene(nextScene);
  };

  const startGame = () => {
    setGameStarted(true);
    setCurrentScene(0);
  };

  const restartGame = () => {
    setGameStarted(false);
    setCurrentScene(0);
  };

  const scene = scenes[currentScene];

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
            <Icon name="BookOpen" className="mr-3" size={32} />
            НАЧАТЬ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ 
          backgroundImage: `url('${scene.background}')`,
          filter: 'brightness(0.5)'
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

      <div className="relative z-20 min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center p-8">
          {scene.character && (
            <div className="max-w-md">
              <img
                src={scene.character}
                alt={scene.speaker}
                className="w-full h-auto drop-shadow-[0_0_30px_rgba(59,130,246,0.6)] animate-float"
              />
            </div>
          )}
        </div>

        <Card className="mx-4 mb-4 bg-black/90 backdrop-blur-md border-2 border-blue-900 shadow-[0_0_30px_rgba(59,130,246,0.4)]">
          <CardContent className="p-6">
            {scene.speaker && (
              <h3 className="text-2xl font-bold text-blue-400 mb-3">
                {scene.speaker}
              </h3>
            )}
            
            <p className="text-white text-lg leading-relaxed mb-6 min-h-[100px]">
              {displayedText}
              {!textComplete && <span className="animate-pulse">▌</span>}
            </p>

            {scene.isEnding ? (
              <div className="space-y-4">
                <div className="text-center py-4">
                  {scene.endingType === 'good' ? (
                    <div>
                      <div className="text-6xl mb-4">🌟</div>
                      <h2 className="text-4xl font-bold text-yellow-400 mb-2">
                        ХОРОШАЯ КОНЦОВКА
                      </h2>
                      <p className="text-green-400 text-xl">Ты спасён!</p>
                    </div>
                  ) : (
                    <div>
                      <div className="text-6xl mb-4">💀</div>
                      <h2 className="text-4xl font-bold text-red-500 mb-2">
                        ПЛОХАЯ КОНЦОВКА
                      </h2>
                      <p className="text-red-400 text-xl">Тьма поглотила тебя...</p>
                    </div>
                  )}
                </div>
                <Button
                  onClick={restartGame}
                  className="w-full bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800 text-white font-bold text-lg py-6"
                >
                  <Icon name="RotateCcw" className="mr-2" size={20} />
                  Начать заново
                </Button>
              </div>
            ) : (
              textComplete && scene.choices && (
                <div className="space-y-3">
                  {scene.choices.map((choice, index) => (
                    <Button
                      key={index}
                      onClick={() => handleChoice(choice.nextScene)}
                      className="w-full bg-gradient-to-r from-blue-800/80 to-blue-900/80 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-lg py-6 border border-blue-600 hover:border-blue-400 transition-all"
                    >
                      {choice.text}
                    </Button>
                  ))}
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
