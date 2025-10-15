import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface DialogLine {
  type: 'narration' | 'vanilla' | 'shadow' | 'darkcacao';
  text: string;
  showJumpscare?: boolean;
  showSprite?: { image: string; text: string; effect?: 'blink' };
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
  const [showSprite, setShowSprite] = useState<{ image: string; text: string; effect?: 'blink' } | null>(null);
  const [textSpeed, setTextSpeed] = useState(50);
  const [completedEndings, setCompletedEndings] = useState<Set<string>>(new Set());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);
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
          text: 'Привет Детлеф! Ну как тебе тут?! Нравится?!'
        },
        { 
          type: 'vanilla', 
          text: 'Кто ты?! Что тебе от меня нужно?!' 
        },
        { 
          type: 'shadow', 
          text: 'Я твой самый страшный кошмар... или самая сладкая мечта? Хе-хе-хе...',
          choices: [
            { text: 'Попытаться поговорить с ним', nextScene: 'path1' },
            { text: 'Попытаться убежать', nextScene: 'escape_attempt' }
          ]
        }
      ]
    },
    escape_attempt: {
      id: 'escape_attempt',
      background: 'https://cdn.poehali.dev/projects/9105be04-580e-41b4-b0b0-8af956d7d258/files/fb652899-56ad-4098-8afb-0c608098044b.jpg',
      dialogs: [
        {
          type: 'narration',
          text: 'Ванилла попытался убежать, но дверь оказалась заперта...'
        },
        {
          type: 'shadow',
          text: 'Думаешь так просто сбежать? Как грубо... Мне это не нравится.',
          showSprite: { 
            image: 'https://cdn.poehali.dev/files/7707ceb6-ae1c-4f17-be66-02021d6fa83f.jpeg', 
            text: 'У ТЕБЯ ПЛОХОЕ ПОВЕДЕНИЕ' 
          }
        }
      ],
      isEnding: true
    },
    path1: {
      id: 'path1',
      background: 'https://cdn.poehali.dev/projects/9105be04-580e-41b4-b0b0-8af956d7d258/files/fb652899-56ad-4098-8afb-0c608098044b.jpg',
      dialogs: [
        {
          type: 'vanilla',
          text: 'Хорошо... давай поговорим. Что ты хочешь?'
        },
        {
          type: 'shadow',
          text: 'О, как мило! Ты согласился! Знаешь... мне здесь так одиноко...'
        },
        {
          type: 'vanilla',
          text: 'Одиноко? Но ты же похитил меня!'
        },
        {
          type: 'shadow',
          text: 'Я просто хотел... чтобы кто-то был рядом. Знаешь, в темноте так страшно быть одному...'
        },
        {
          type: 'narration',
          text: 'В голосе Шадоу послышались странные нотки... печали?'
        },
        {
          type: 'vanilla',
          text: 'Я... я понимаю. Одиночество это тяжело.'
        },
        {
          type: 'shadow',
          text: 'Правда? Ты не боишься меня?',
          choices: [
            { text: 'Немного боюсь, но хочу понять тебя', nextScene: 'romance_path' },
            { text: 'Конечно боюсь! Ты монстр!', nextScene: 'bad_ending' }
          ]
        }
      ]
    },
    romance_path: {
      id: 'romance_path',
      background: 'https://cdn.poehali.dev/projects/9105be04-580e-41b4-b0b0-8af956d7d258/files/fb652899-56ad-4098-8afb-0c608098044b.jpg',
      dialogs: [
        {
          type: 'shadow',
          text: 'Ты... хочешь понять меня? Никто никогда не говорил мне таких слов...'
        },
        {
          type: 'vanilla',
          text: 'У всех есть своя история. Расскажи мне свою?'
        },
        {
          type: 'shadow',
          text: 'Я... я был таким же, как ты. Но меня оставили здесь, в темноте... навсегда.'
        },
        {
          type: 'narration',
          text: 'Ванилла почувствовал странное тепло в груди. Сострадание? Или что-то большее?'
        },
        {
          type: 'vanilla',
          text: 'Мне жаль... никто не заслуживает такого.'
        },
        {
          type: 'shadow',
          text: 'Ты... особенный. Может быть... мы могли бы...',
          showSprite: { 
            image: 'https://cdn.poehali.dev/files/dbdb96f3-6bdd-4972-b8a3-05b109bbc262.jpeg', 
            text: 'ЛЮБЛЮ ЕГО СИСИ' 
          }
        },
        {
          type: 'vanilla',
          text: '...что? что мы могли бы?'
        },
        {
          type: 'shadow',
          text: 'Остаться... вместе?',
          showSprite: { 
            image: 'https://cdn.poehali.dev/files/7cde0ad6-5da8-48eb-bedb-c81f9eb0746e.jpeg', 
            text: 'ЕГО ТОЖЕ' 
          }
        },
        {
          type: 'vanilla',
          text: 'Я...',
          choices: [
            { text: 'Согласиться остаться с ним', nextScene: 'secret_moment' },
            { text: 'Попросить отпустить тебя', nextScene: 'rejection_ending' },
            { text: 'Предложить ему вместе искать выход', nextScene: 'true_ending' }
          ]
        }
      ]
    },
    true_ending: {
      id: 'true_ending',
      background: 'https://cdn.poehali.dev/projects/9105be04-580e-41b4-b0b0-8af956d7d258/files/fb652899-56ad-4098-8afb-0c608098044b.jpg',
      dialogs: [
        {
          type: 'vanilla',
          text: 'Я не хочу тебя бросать... но и не хочу навсегда остаться здесь. Пойдём искать выход вместе?'
        },
        {
          type: 'shadow',
          text: '...вместе? Ты хочешь, чтобы я пошёл с тобой?'
        },
        {
          type: 'vanilla',
          text: 'Да. Никто не должен быть один в темноте.'
        },
        {
          type: 'narration',
          text: 'Шадоу Милк замер. Впервые за долгое время кто-то предложил ему... надежду.'
        },
        {
          type: 'shadow',
          text: '...хорошо. Давай попробуем.'
        },
        {
          type: 'narration',
          text: 'Они пошли по тёмным коридорам вместе. И впереди забрезжил свет...'
        },
        {
          type: 'vanilla',
          text: 'Смотри! Выход!'
        },
        {
          type: 'shadow',
          text: 'Спасибо тебе... Ванилла. Ты спас не только себя, но и меня.'
        },
        {
          type: 'narration',
          text: 'Вместе они вышли на свободу. Началась новая история...'
        }
      ],
      isEnding: true
    },
    secret_moment: {
      id: 'secret_moment',
      background: 'https://cdn.poehali.dev/projects/9105be04-580e-41b4-b0b0-8af956d7d258/files/fb652899-56ad-4098-8afb-0c608098044b.jpg',
      dialogs: [
        {
          type: 'vanilla',
          text: 'Я... я останусь с тобой.'
        },
        {
          type: 'shadow',
          text: 'ПРАВДА?! Ты останешься?! Я так счастлив!!!'
        },
        {
          type: 'narration',
          text: 'Внезапно вся атмосфера изменилась...'
        },
        {
          type: 'narration',
          text: 'Что-то идёт не так...',
          showSprite: { 
            image: 'https://cdn.poehali.dev/files/b39517c2-a924-4ef7-b997-368c88e45bb5.jpeg', 
            text: 'СЕКРЕТНЫЙ МОМЕНТ',
            effect: 'blink'
          }
        },
        {
          type: 'shadow',
          text: 'АХАХАХАХА!!! ТЫ ПРАВДА ДУМАЛ, ЧТО Я БЫЛ СЕРЬЁЗЕН?!'
        },
        {
          type: 'vanilla',
          text: 'Что?! Но ты сказал...'
        },
        {
          type: 'shadow',
          text: 'А вы не обнаглели... Нет, его сиси я тоже люблю! ТОЛЬКО Я!'
        },
        {
          type: 'narration',
          text: 'Тьма начала сгущаться...',
          showSprite: { 
            image: 'https://cdn.poehali.dev/files/7707ceb6-ae1c-4f17-be66-02021d6fa83f.jpeg', 
            text: 'У ТЕБЯ ПЛОХОЕ ПОВЕДЕНИЕ' 
          }
        }
      ],
      isEnding: true
    },
    rejection_ending: {
      id: 'rejection_ending',
      background: 'https://cdn.poehali.dev/projects/9105be04-580e-41b4-b0b0-8af956d7d258/files/fb652899-56ad-4098-8afb-0c608098044b.jpg',
      dialogs: [
        {
          type: 'vanilla',
          text: 'Прости... но я не могу остаться. У меня есть своя жизнь.'
        },
        {
          type: 'shadow',
          text: '...понятно.'
        },
        {
          type: 'narration',
          text: 'Наступила тяжёлая тишина...'
        },
        {
          type: 'shadow',
          text: 'Знаешь что? Уходи. Дверь открыта.'
        },
        {
          type: 'vanilla',
          text: 'Правда? Спасибо... и прости.'
        },
        {
          type: 'narration',
          text: 'Ванилла вышел на свободу. Но почему-то на душе было так тяжело...'
        }
      ],
      isEnding: true
    },
    bad_ending: {
      id: 'bad_ending',
      background: 'https://cdn.poehali.dev/projects/9105be04-580e-41b4-b0b0-8af956d7d258/files/fb652899-56ad-4098-8afb-0c608098044b.jpg',
      dialogs: [
        {
          type: 'shadow',
          text: 'МОНСТР?! Я МОНСТР?!'
        },
        {
          type: 'vanilla',
          text: 'Н-нет, я не то хотел...'
        },
        {
          type: 'shadow',
          text: 'НЕТ, ТЫ ВСЁ ПРАВИЛЬНО СКАЗАЛ. И ТЕПЕРЬ... ПОПЛАТИШЬСЯ!',
          showSprite: { 
            image: 'https://cdn.poehali.dev/files/7707ceb6-ae1c-4f17-be66-02021d6fa83f.jpeg', 
            text: 'У ТЕБЯ ПЛОХОЕ ПОВЕДЕНИЕ' 
          }
        }
      ],
      isEnding: true
    },
    ultimate_secret_ending: {
      id: 'ultimate_secret_ending',
      background: 'https://cdn.poehali.dev/projects/9105be04-580e-41b4-b0b0-8af956d7d258/files/fb652899-56ad-4098-8afb-0c608098044b.jpg',
      dialogs: [
        {
          type: 'narration',
          text: 'Ты прошёл все концовки этой истории... Но что-то изменилось...'
        },
        {
          type: 'narration',
          text: 'Атмосфера стала другой... Кто-то наблюдает за тобой...'
        },
        {
          type: 'narration',
          text: 'Вдруг Шадоу Милк исчез, а на его месте появилась новая тень...',
          showJumpscare: true
        },
        {
          type: 'darkcacao',
          text: 'Приветствую, путник... Ты прошёл долгий путь.',
          showSprite: {
            image: 'https://cdn.poehali.dev/files/d9fbb67a-76a3-4359-b5cc-7c1a14fcffa0.jpeg',
            text: 'СЕКРЕТНЫЙ МОМЕНТ',
            effect: 'blink'
          }
        },
        {
          type: 'vanilla',
          text: 'Кто... кто ты? Где Шадоу Милк?!'
        },
        {
          type: 'darkcacao',
          text: 'А вы не обнаглели... Нет, его сиси я тоже люблю!'
        },
        {
          type: 'narration',
          text: 'Реальность начала рушиться...',
          showSprite: {
            image: 'https://cdn.poehali.dev/files/05837585-74a7-4c4e-8d1b-7d66e4e550c6.jpeg',
            text: 'У ТЕБЯ ПЛОХОЕ ПОВЕДЕНИЕ'
          }
        },
        {
          type: 'narration',
          text: 'Конец... или только начало?'
        }
      ],
      isEnding: true
    }
  };

  useEffect(() => {
    if (gameStarted && !ambientAudioRef.current) {
      ambientAudioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2466/2466-preview.mp3');
      ambientAudioRef.current.loop = true;
      ambientAudioRef.current.volume = 0.15;
      ambientAudioRef.current.play().catch(() => {});
    }
    
    return () => {
      if (scareAudioRef.current) {
        scareAudioRef.current.pause();
      }
      if (failAudioRef.current) {
        failAudioRef.current.pause();
      }
      if (ambientAudioRef.current) {
        ambientAudioRef.current.pause();
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
    }, textSpeed);

    return () => clearInterval(interval);
  }, [currentScene, dialogIndex, gameStarted, textSpeed]);

  const handleNext = () => {
    const scene = scenes[currentScene];
    const dialog = scene.dialogs[dialogIndex];

    if (dialog.showJumpscare && textComplete) {
      setShowJumpscare(true);
      if (!scareAudioRef.current) {
        scareAudioRef.current = new Audio('https://www.myinstants.com/media/sounds/metal-pipe-falling-sound-effect.mp3');
        scareAudioRef.current.volume = 0.7;
      }
      scareAudioRef.current.currentTime = 0;
      scareAudioRef.current.play().catch(() => {});
      
      setTimeout(() => {
        setShowJumpscare(false);
        setDialogIndex(dialogIndex + 1);
      }, 1500);
      return;
    }

    if (dialog.showSprite && textComplete) {
      setShowSprite(dialog.showSprite);
      if (dialog.showSprite.effect === 'blink') {
        if (!scareAudioRef.current) {
          scareAudioRef.current = new Audio('https://www.myinstants.com/media/sounds/metal-pipe-falling-sound-effect.mp3');
          scareAudioRef.current.volume = 0.7;
        }
        scareAudioRef.current.currentTime = 0;
        scareAudioRef.current.play().catch(() => {});
      }
      
      setTimeout(() => {
        setShowSprite(null);
        setDialogIndex(dialogIndex + 1);
      }, 2500);
      return;
    }

    if (dialogIndex < scene.dialogs.length - 1) {
      setDialogIndex(dialogIndex + 1);
    }
  };

  const handleChoice = (nextScene: string) => {
    if (nextScene === 'bad_ending' || nextScene === 'escape_attempt' || nextScene === 'secret_moment') {
      if (!failAudioRef.current) {
        failAudioRef.current = new Audio('https://www.myinstants.com/media/sounds/sad-violin.mp3');
        failAudioRef.current.volume = 0.6;
      }
      failAudioRef.current.currentTime = 0;
      failAudioRef.current.play().catch(() => {});
    }
    
    setCurrentScene(nextScene);
    setDialogIndex(0);
  };
  
  const speedUpText = () => {
    if (textSpeed > 10) {
      setTextSpeed(10);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setCurrentScene('start');
    setDialogIndex(0);
  };

  const restartGame = () => {
    const scene = scenes[currentScene];
    if (scene.isEnding && scene.id !== 'ultimate_secret_ending') {
      const newEndings = new Set(completedEndings);
      newEndings.add(scene.id);
      setCompletedEndings(newEndings);
      
      if (newEndings.size >= 4) {
        setCurrentScene('ultimate_secret_ending');
        setDialogIndex(0);
        setGameStarted(true);
        setTextSpeed(50);
        return;
      }
    }
    
    setGameStarted(false);
    setCurrentScene('start');
    setDialogIndex(0);
    setTextSpeed(50);
    if (scareAudioRef.current) {
      scareAudioRef.current.pause();
      scareAudioRef.current.currentTime = 0;
    }
    if (failAudioRef.current) {
      failAudioRef.current.pause();
      failAudioRef.current.currentTime = 0;
    }
    if (ambientAudioRef.current) {
      ambientAudioRef.current.pause();
      ambientAudioRef.current.currentTime = 0;
      ambientAudioRef.current = null;
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

  if (showSprite) {
    return (
      <div className={`min-h-screen bg-black flex flex-col items-center justify-center ${showSprite.effect === 'blink' ? 'animate-pulse' : ''}`}>
        <img
          src={showSprite.image}
          alt="Sprite"
          className={`max-w-2xl max-h-96 object-contain mb-8 ${showSprite.effect === 'blink' ? 'animate-ping' : ''}`}
          style={showSprite.effect === 'blink' ? { animation: 'ping 0.5s ease-in-out infinite' } : {}}
        />
        <h2 className={`text-5xl font-bold text-white text-center px-4 ${showSprite.effect === 'blink' ? 'animate-bounce text-red-500' : ''}`}>
          {showSprite.text}
        </h2>
      </div>
    );
  }

  if (scene.isEnding) {
    const isGoodEnding = scene.id === 'rejection_ending' || scene.id === 'true_ending';
    const isBadEnding = scene.id === 'bad_ending' || scene.id === 'escape_attempt' || scene.id === 'secret_moment';
    const isSecretEnding = scene.id === 'ultimate_secret_ending';
    
    return (
      <div 
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ background: isBadEnding || isSecretEnding ? 'linear-gradient(to bottom, #1e3a8a, #1e1b4b)' : 'linear-gradient(to bottom, #4a5568, #2d3748)' }}
      >
        {(isBadEnding || isSecretEnding) && (
          <div className="absolute inset-0">
            <img
              src="https://cdn.poehali.dev/files/c52c4168-102e-4b57-9adb-5f47812a1584.jpeg"
              alt="Game Over"
              className="w-full h-full object-cover opacity-40"
            />
          </div>
        )}
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          {isSecretEnding ? (
            <>
              <div className="text-8xl mb-8 animate-bounce">👁️</div>
              <h2 className="text-6xl font-bold text-purple-500 mb-4 drop-shadow-[0_0_30px_rgba(168,85,247,1)] animate-pulse">
                СЕКРЕТНАЯ КОНЦОВКА
              </h2>
              <p className="text-xl text-purple-300 mb-6">Ты открыл все концовки...</p>
              <div className="space-y-4 mb-8">
                {scene.dialogs.map((dialog, idx) => (
                  <p key={idx} className="text-2xl text-white">
                    {dialog.text}
                  </p>
                ))}
              </div>
            </>
          ) : isBadEnding ? (
            <>
              <div className="text-8xl mb-8 animate-bounce">💀</div>
              <h2 className="text-6xl font-bold text-red-500 mb-4 drop-shadow-[0_0_30px_rgba(239,68,68,1)]">
                ПЛОХАЯ КОНЦОВКА
              </h2>
              <div className="space-y-4 mb-8">
                {scene.dialogs.slice(0, -1).map((dialog, idx) => (
                  <p key={idx} className="text-2xl text-white">
                    {dialog.text}
                  </p>
                ))}
              </div>
            </>
          ) : scene.id === 'true_ending' ? (
            <>
              <div className="text-8xl mb-8 animate-bounce">✨</div>
              <h2 className="text-6xl font-bold text-green-400 mb-4 drop-shadow-[0_0_30px_rgba(74,222,128,1)]">
                ИСТИННАЯ КОНЦОВКА
              </h2>
              <div className="space-y-4 mb-8">
                {scene.dialogs.map((dialog, idx) => (
                  <p key={idx} className="text-2xl text-green-200">
                    {dialog.text}
                  </p>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="text-8xl mb-8 animate-bounce">💔</div>
              <h2 className="text-6xl font-bold text-yellow-400 mb-4 drop-shadow-[0_0_30px_rgba(250,204,21,1)]">
                ГОРЬКАЯ СВОБОДА
              </h2>
              <div className="space-y-4 mb-8">
                {scene.dialogs.map((dialog, idx) => (
                  <p key={idx} className="text-2xl text-gray-300">
                    {dialog.text}
                  </p>
                ))}
              </div>
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
                  : currentDialog.type === 'darkcacao'
                  ? 'https://cdn.poehali.dev/files/d9fbb67a-76a3-4359-b5cc-7c1a14fcffa0.jpeg'
                  : 'https://cdn.poehali.dev/files/808e85c0-7f2a-4e3d-a314-73ffa0755a6a.jpeg'
                }
                alt={currentDialog.type === 'vanilla' ? 'Pure Vanilla' : currentDialog.type === 'darkcacao' ? 'Dark Cacao' : 'Shadow Milk'}
                className="w-32 h-32 object-contain animate-float"
              />
            </div>
          </div>
        )}

        <Card className="bg-black/90 backdrop-blur-md border-2 border-blue-900 shadow-[0_0_30px_rgba(59,130,246,0.4)]" onClick={speedUpText}>
          <CardContent className="p-6">
            {currentDialog.type === 'narration' ? (
              <p className="text-gray-400 text-lg leading-relaxed mb-4 min-h-[80px] italic">
                {displayedText}
                {!textComplete && <span className="animate-pulse">▌</span>}
              </p>
            ) : (
              <>
                <h3 className="text-2xl font-bold mb-3" style={{
                  color: currentDialog.type === 'vanilla' ? '#fbbf24' : currentDialog.type === 'darkcacao' ? '#7c3aed' : '#8b5cf6',
                  fontFamily: currentDialog.type === 'vanilla' ? 'Fredoka, sans-serif' : 'inherit'
                }}>
                  {currentDialog.type === 'vanilla' ? 'Pure Vanilla' : currentDialog.type === 'darkcacao' ? 'Dark Cacao' : 'Shadow Milk'}
                </h3>
                <p className="text-white text-lg leading-relaxed mb-4 min-h-[80px]">
                  {displayedText}
                  {!textComplete && <span className="animate-pulse">▌</span>}
                </p>
              </>
            )}
            {!textComplete && (
              <p className="text-xs text-gray-500 text-center animate-pulse">Нажимай для ускорения текста</p>
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