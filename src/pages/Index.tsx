import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

interface CookieCharacter {
  id: number;
  name: string;
  image: string;
  hp: number;
  attack: number;
  rarity: string;
  type: string;
}

const Index = () => {
  const [selectedCookie, setSelectedCookie] = useState<number | null>(null);

  const cookies: CookieCharacter[] = [
    {
      id: 1,
      name: "Рыцарь Печенька",
      image: "https://cdn.poehali.dev/projects/9105be04-580e-41b4-b0b0-8af956d7d258/files/9d55a23b-25e2-42dc-82c8-c5bd6e156443.jpg",
      hp: 85,
      attack: 72,
      rarity: "Эпик",
      type: "Защита"
    },
    {
      id: 2,
      name: "Клубничка",
      image: "https://cdn.poehali.dev/projects/9105be04-580e-41b4-b0b0-8af956d7d258/files/4870c7b6-5f41-4b1d-8bbc-2f4e9a304c87.jpg",
      hp: 65,
      attack: 88,
      rarity: "Редкий",
      type: "Атака"
    },
    {
      id: 3,
      name: "Волшебник",
      image: "https://cdn.poehali.dev/projects/9105be04-580e-41b4-b0b0-8af956d7d258/files/85c05fd4-4d2d-46f1-a9b2-dbf48267410d.jpg",
      hp: 60,
      attack: 95,
      rarity: "Легенда",
      type: "Магия"
    }
  ];

  const stats = [
    { icon: "Users", label: "Игроки", value: "1,234,567" },
    { icon: "Trophy", label: "Побед", value: "45,890" },
    { icon: "Star", label: "Рейтинг", value: "4.9" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE5EC] via-[#FFF9E5] to-[#E5F5FF] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          >
            ✨
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="text-center mb-12 animate-bounce-in">
          <div className="inline-block mb-4">
            <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B9D] via-[#FB59B6] to-[#FFD93D] drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)] tracking-tight">
              COOKIE RUN
            </h1>
            <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8B4513] to-[#A0522D] drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
              KINGDOM
            </h2>
          </div>
          <p className="text-xl text-gray-700 mb-6 font-medium">
            🍪 Сладкое приключение ждёт! 🍪
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-[#FF6B9D] to-[#FB59B6] hover:from-[#FB59B6] hover:to-[#FF6B9D] text-white font-bold text-lg px-8 py-6 rounded-full shadow-[0_8px_20px_rgba(255,107,157,0.4)] hover:shadow-[0_12px_30px_rgba(255,107,157,0.6)] transition-all duration-300 hover:scale-105 border-4 border-white"
            >
              <Icon name="Play" className="mr-2" size={24} />
              Играть сейчас
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-gradient-to-r from-[#FFD93D] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD93D] text-[#2C1810] font-bold text-lg px-8 py-6 rounded-full shadow-[0_8px_20px_rgba(255,217,61,0.4)] hover:shadow-[0_12px_30px_rgba(255,217,61,0.6)] transition-all duration-300 hover:scale-105 border-4 border-white"
            >
              <Icon name="Gift" className="mr-2" size={24} />
              Награды
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="bg-white/90 backdrop-blur-sm border-4 border-[#FFB6C1] shadow-[0_8px_20px_rgba(251,89,182,0.2)] hover:shadow-[0_12px_30px_rgba(251,89,182,0.3)] transition-all duration-300 hover:scale-105 animate-bounce-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="flex items-center justify-center gap-4 p-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B9D] to-[#FB59B6] flex items-center justify-center shadow-lg">
                  <Icon name={stat.icon} size={32} className="text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#2C1810]">{stat.value}</p>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-8">
          <h3 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#8B4513] to-[#A0522D] drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
            🍪 Твои персонажи 🍪
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cookies.map((cookie, index) => (
              <Card
                key={cookie.id}
                className={`bg-gradient-to-br from-white to-purple-50 border-4 ${
                  selectedCookie === cookie.id 
                    ? 'border-[#FB59B6] shadow-[0_12px_40px_rgba(251,89,182,0.5)] scale-105' 
                    : 'border-purple-200 shadow-[0_8px_25px_rgba(147,51,234,0.2)]'
                } transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_40px_rgba(251,89,182,0.4)] cursor-pointer animate-bounce-in overflow-hidden`}
                style={{ animationDelay: `${index * 0.15}s` }}
                onClick={() => setSelectedCookie(cookie.id)}
              >
                <div className="relative bg-gradient-to-br from-[#9B87F5] to-[#7E69AB] p-8 animate-float">
                  <div className="absolute top-2 right-2 text-3xl animate-sparkle">✨</div>
                  <div className="absolute top-2 left-2 text-3xl animate-sparkle" style={{ animationDelay: '0.5s' }}>✨</div>
                  <img
                    src={cookie.image}
                    alt={cookie.name}
                    className="w-full h-48 object-contain drop-shadow-[0_8px_15px_rgba(0,0,0,0.2)]"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-2xl font-bold text-[#2C1810]">{cookie.name}</h4>
                    <Badge className="bg-gradient-to-r from-[#FFD93D] to-[#FFA500] text-[#2C1810] font-bold border-2 border-white shadow-md">
                      {cookie.rarity}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <Icon name="Heart" size={16} className="text-red-500" />
                        HP
                      </span>
                      <div className="flex items-center gap-2 flex-1 ml-3">
                        <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-300">
                          <div 
                            className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full transition-all duration-500"
                            style={{ width: `${cookie.hp}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-[#2C1810] min-w-[40px]">{cookie.hp}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <Icon name="Sword" size={16} className="text-orange-500" />
                        ATK
                      </span>
                      <div className="flex items-center gap-2 flex-1 ml-3">
                        <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-300">
                          <div 
                            className="h-full bg-gradient-to-r from-yellow-400 to-orange-600 rounded-full transition-all duration-500"
                            style={{ width: `${cookie.attack}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-[#2C1810] min-w-[40px]">{cookie.attack}</span>
                      </div>
                    </div>
                  </div>

                  <Badge className="w-full justify-center py-1 bg-gradient-to-r from-[#4ECDC4] to-[#2C9E96] text-white font-bold border-2 border-white shadow-md mb-4">
                    {cookie.type}
                  </Badge>

                  <Button 
                    className="w-full bg-gradient-to-r from-[#FFD93D] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD93D] text-[#2C1810] font-bold py-6 text-lg rounded-full shadow-[0_6px_15px_rgba(255,217,61,0.4)] hover:shadow-[0_8px_20px_rgba(255,217,61,0.6)] transition-all duration-300 border-4 border-white"
                  >
                    <Icon name="Gamepad2" className="mr-2" size={20} />
                    Играть
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="bg-gradient-to-br from-white to-pink-50 border-4 border-[#FFB6C1] shadow-[0_12px_40px_rgba(251,89,182,0.3)] animate-bounce-in">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4 animate-float">🏆</div>
            <h4 className="text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B9D] to-[#FB59B6]">
              Собери всех персонажей!
            </h4>
            <p className="text-gray-700 text-lg mb-6">
              Открывай новых печенек, улучшай их способности и стань лучшим пекарем королевства!
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-[#9B87F5] to-[#7E69AB] hover:from-[#7E69AB] hover:to-[#9B87F5] text-white font-bold text-lg px-10 py-6 rounded-full shadow-[0_8px_20px_rgba(155,135,245,0.4)] hover:shadow-[0_12px_30px_rgba(155,135,245,0.6)] transition-all duration-300 hover:scale-105 border-4 border-white"
            >
              <Icon name="Package" className="mr-2" size={24} />
              Открыть сундук
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
