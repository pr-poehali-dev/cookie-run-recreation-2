import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";

interface Character {
  id: number;
  name: string;
  image: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  rarity: string;
  type: string;
  isPlayer: boolean;
}

const Index = () => {
  const { toast } = useToast();
  const [playerHp, setPlayerHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [gameStarted, setGameStarted] = useState(false);

  const player: Character = {
    id: 1,
    name: "Pure Vanilla",
    image: "https://cdn.poehali.dev/projects/9105be04-580e-41b4-b0b0-8af956d7d258/files/3e4268bb-5f2e-4298-93cd-cfd8e8c4b72f.jpg",
    hp: 100,
    maxHp: 100,
    attack: 35,
    defense: 25,
    rarity: "Древний",
    type: "Целитель",
    isPlayer: true
  };

  const enemy: Character = {
    id: 2,
    name: "Shadow Milk",
    image: "https://cdn.poehali.dev/projects/9105be04-580e-41b4-b0b0-8af956d7d258/files/e5be825f-1f69-4894-bc3b-8bb066a07aa7.jpg",
    hp: 100,
    maxHp: 100,
    attack: 40,
    defense: 20,
    rarity: "Зверь",
    type: "Тёмная магия",
    isPlayer: false
  };

  const startBattle = () => {
    setGameStarted(true);
    setPlayerHp(100);
    setEnemyHp(100);
    setIsPlayerTurn(true);
    setBattleLog(["⚔️ Битва началась!"]);
    toast({
      title: "🍪 Битва началась!",
      description: `${player.name} против ${enemy.name}`,
    });
  };

  const handleAttack = () => {
    if (!isPlayerTurn || playerHp <= 0 || enemyHp <= 0) return;

    const damage = Math.floor(Math.random() * 15) + player.attack - 20;
    const actualDamage = Math.max(damage, 10);
    const newEnemyHp = Math.max(0, enemyHp - actualDamage);
    
    setEnemyHp(newEnemyHp);
    setBattleLog(prev => [...prev, `⚔️ ${player.name} атакует! Урон: ${actualDamage}`]);

    if (newEnemyHp <= 0) {
      setTimeout(() => {
        toast({
          title: "🎉 Победа!",
          description: `${player.name} победил ${enemy.name}!`,
        });
        setBattleLog(prev => [...prev, `🎉 ${player.name} одержал победу!`]);
      }, 500);
      return;
    }

    setIsPlayerTurn(false);
    setTimeout(() => enemyTurn(newEnemyHp), 1500);
  };

  const handleHeal = () => {
    if (!isPlayerTurn || playerHp <= 0 || enemyHp <= 0) return;

    const healAmount = Math.floor(Math.random() * 15) + 20;
    const newPlayerHp = Math.min(100, playerHp + healAmount);
    
    setPlayerHp(newPlayerHp);
    setBattleLog(prev => [...prev, `✨ ${player.name} исцеляет себя! +${healAmount} HP`]);

    setIsPlayerTurn(false);
    setTimeout(() => enemyTurn(enemyHp), 1500);
  };

  const enemyTurn = (currentEnemyHp: number) => {
    if (currentEnemyHp <= 0) return;

    const damage = Math.floor(Math.random() * 15) + enemy.attack - 20;
    const actualDamage = Math.max(damage, 10);
    const newPlayerHp = Math.max(0, playerHp - actualDamage);
    
    setPlayerHp(newPlayerHp);
    setBattleLog(prev => [...prev, `💀 ${enemy.name} атакует! Урон: ${actualDamage}`]);

    if (newPlayerHp <= 0) {
      setTimeout(() => {
        toast({
          title: "💔 Поражение",
          description: `${enemy.name} победил...`,
          variant: "destructive"
        });
        setBattleLog(prev => [...prev, `💔 ${enemy.name} одержал победу...`]);
      }, 500);
      return;
    }

    setTimeout(() => setIsPlayerTurn(true), 1000);
  };

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
        <header className="text-center mb-8 animate-bounce-in">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B9D] via-[#FB59B6] to-[#FFD93D] drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)] tracking-tight mb-2">
            COOKIE RUN: KINGDOM
          </h1>
          <p className="text-2xl text-gray-700 font-medium">
            ⚔️ Битва: {player.name} vs {enemy.name} ⚔️
          </p>
        </header>

        {!gameStarted ? (
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/95 backdrop-blur-sm border-4 border-[#FFB6C1] shadow-[0_12px_40px_rgba(251,89,182,0.3)] mb-8">
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">🍪⚔️🍪</div>
                <h3 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B9D] to-[#FB59B6]">
                  Готов к битве?
                </h3>
                <p className="text-lg text-gray-700 mb-8">
                  Битва добра против зла! Используй атаки и исцеление, чтобы победить Shadow Milk!
                </p>
                <Button 
                  onClick={startBattle}
                  size="lg"
                  className="bg-gradient-to-r from-[#FF6B9D] to-[#FB59B6] hover:from-[#FB59B6] hover:to-[#FF6B9D] text-white font-bold text-xl px-12 py-8 rounded-full shadow-[0_8px_20px_rgba(255,107,157,0.4)] hover:shadow-[0_12px_30px_rgba(255,107,157,0.6)] transition-all duration-300 hover:scale-105 border-4 border-white"
                >
                  <Icon name="Swords" className="mr-3" size={28} />
                  Начать битву!
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-br from-white to-yellow-50 border-4 border-yellow-300 shadow-[0_8px_25px_rgba(255,217,61,0.3)]">
                <div className="relative bg-gradient-to-br from-[#FFD93D] to-[#FFA500] p-8">
                  <div className="absolute top-2 right-2 text-3xl animate-sparkle">✨</div>
                  <img
                    src={player.image}
                    alt={player.name}
                    className="w-full h-64 object-contain drop-shadow-[0_8px_15px_rgba(0,0,0,0.3)]"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <h4 className="text-3xl font-bold text-[#2C1810] mb-2">{player.name}</h4>
                    <Badge className="bg-gradient-to-r from-[#FFD93D] to-[#FFA500] text-[#2C1810] font-bold text-lg px-4 py-1">
                      {player.rarity}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-center">
                    <p className="text-lg"><span className="font-bold">⚔️ Атака:</span> {player.attack}</p>
                    <p className="text-lg"><span className="font-bold">🛡️ Защита:</span> {player.defense}</p>
                    <Badge className="w-full justify-center py-2 bg-gradient-to-r from-[#4ECDC4] to-[#2C9E96] text-white font-bold text-lg">
                      {player.type}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-purple-50 border-4 border-purple-400 shadow-[0_8px_25px_rgba(123,31,162,0.3)]">
                <div className="relative bg-gradient-to-br from-[#7B1FA2] to-[#4A148C] p-8">
                  <div className="absolute top-2 left-2 text-3xl animate-sparkle">💀</div>
                  <img
                    src={enemy.image}
                    alt={enemy.name}
                    className="w-full h-64 object-contain drop-shadow-[0_8px_15px_rgba(0,0,0,0.3)]"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <h4 className="text-3xl font-bold text-[#2C1810] mb-2">{enemy.name}</h4>
                    <Badge className="bg-gradient-to-r from-[#7B1FA2] to-[#4A148C] text-white font-bold text-lg px-4 py-1">
                      {enemy.rarity}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-center">
                    <p className="text-lg"><span className="font-bold">⚔️ Атака:</span> {enemy.attack}</p>
                    <p className="text-lg"><span className="font-bold">🛡️ Защита:</span> {enemy.defense}</p>
                    <Badge className="w-full justify-center py-2 bg-gradient-to-r from-[#E91E63] to-[#9C27B0] text-white font-bold text-lg">
                      {enemy.type}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className={`bg-gradient-to-br from-white to-yellow-50 border-4 ${isPlayerTurn ? 'border-yellow-400 shadow-[0_0_30px_rgba(255,217,61,0.6)] scale-105' : 'border-yellow-200'} transition-all duration-300`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={player.image}
                      alt={player.name}
                      className="w-24 h-24 object-contain rounded-full bg-gradient-to-br from-[#FFD93D] to-[#FFA500] p-2 border-4 border-white shadow-lg"
                    />
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-[#2C1810] mb-1">{player.name}</h4>
                      <Badge className="bg-gradient-to-r from-[#4ECDC4] to-[#2C9E96] text-white">
                        {player.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold flex items-center gap-1">
                        <Icon name="Heart" size={18} className="text-red-500" />
                        HP: {playerHp}/100
                      </span>
                      <span className={playerHp > 50 ? "text-green-600" : playerHp > 20 ? "text-yellow-600" : "text-red-600"}>
                        {playerHp}%
                      </span>
                    </div>
                    <Progress value={playerHp} className="h-4" />
                  </div>
                </CardContent>
              </Card>

              <Card className={`bg-gradient-to-br from-white to-purple-50 border-4 ${!isPlayerTurn && playerHp > 0 && enemyHp > 0 ? 'border-purple-500 shadow-[0_0_30px_rgba(123,31,162,0.6)] scale-105' : 'border-purple-200'} transition-all duration-300`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={enemy.image}
                      alt={enemy.name}
                      className="w-24 h-24 object-contain rounded-full bg-gradient-to-br from-[#7B1FA2] to-[#4A148C] p-2 border-4 border-white shadow-lg"
                    />
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-[#2C1810] mb-1">{enemy.name}</h4>
                      <Badge className="bg-gradient-to-r from-[#E91E63] to-[#9C27B0] text-white">
                        {enemy.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold flex items-center gap-1">
                        <Icon name="Skull" size={18} className="text-purple-700" />
                        HP: {enemyHp}/100
                      </span>
                      <span className={enemyHp > 50 ? "text-green-600" : enemyHp > 20 ? "text-yellow-600" : "text-red-600"}>
                        {enemyHp}%
                      </span>
                    </div>
                    <Progress value={enemyHp} className="h-4" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/95 backdrop-blur-sm border-4 border-[#FFB6C1]">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-4 text-center">
                  {isPlayerTurn ? "🎮 Твой ход!" : "⏳ Ход противника..."}
                </h3>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Button 
                    onClick={handleAttack}
                    disabled={!isPlayerTurn || playerHp <= 0 || enemyHp <= 0}
                    size="lg"
                    className="bg-gradient-to-r from-[#FF6B9D] to-[#FB59B6] hover:from-[#FB59B6] hover:to-[#FF6B9D] text-white font-bold text-lg px-8 py-6 rounded-full shadow-[0_8px_20px_rgba(255,107,157,0.4)] hover:shadow-[0_12px_30px_rgba(255,107,157,0.6)] transition-all duration-300 hover:scale-105 border-4 border-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon name="Sword" className="mr-2" size={24} />
                    Атаковать
                  </Button>
                  <Button 
                    onClick={handleHeal}
                    disabled={!isPlayerTurn || playerHp <= 0 || enemyHp <= 0}
                    size="lg"
                    className="bg-gradient-to-r from-[#4ECDC4] to-[#2C9E96] hover:from-[#2C9E96] hover:to-[#4ECDC4] text-white font-bold text-lg px-8 py-6 rounded-full shadow-[0_8px_20px_rgba(78,205,196,0.4)] hover:shadow-[0_12px_30px_rgba(78,205,196,0.6)] transition-all duration-300 hover:scale-105 border-4 border-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon name="Sparkles" className="mr-2" size={24} />
                    Исцелить
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-gray-50 border-4 border-gray-300 max-h-64 overflow-hidden">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <Icon name="ScrollText" size={20} />
                  Лог битвы
                </h3>
                <div className="space-y-1 overflow-y-auto max-h-40">
                  {battleLog.slice().reverse().map((log, index) => (
                    <p key={index} className="text-sm text-gray-700 p-2 bg-white/50 rounded">
                      {log}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {(playerHp <= 0 || enemyHp <= 0) && (
              <Card className="bg-gradient-to-br from-white to-pink-50 border-4 border-[#FFB6C1] shadow-[0_12px_40px_rgba(251,89,182,0.3)]">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4">{playerHp > 0 ? '🎉' : '💔'}</div>
                  <h3 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B9D] to-[#FB59B6]">
                    {playerHp > 0 ? 'Победа!' : 'Поражение...'}
                  </h3>
                  <Button 
                    onClick={startBattle}
                    size="lg"
                    className="bg-gradient-to-r from-[#FFD93D] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD93D] text-[#2C1810] font-bold text-lg px-10 py-6 rounded-full shadow-[0_8px_20px_rgba(255,217,61,0.4)] hover:shadow-[0_12px_30px_rgba(255,217,61,0.6)] transition-all duration-300 hover:scale-105 border-4 border-white"
                  >
                    <Icon name="RotateCcw" className="mr-2" size={24} />
                    Сыграть ещё раз
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
