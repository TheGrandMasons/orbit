import { Trophy, X } from 'lucide-react';
import { useEffect } from 'react';
import { ACHIEVEMENT_TIERS } from "./Achievements";

export const AchievementPopup = ({ achievements, unlockedAchievements, onClose,isLeftOpen }) => {
  const getTierInfo = () => {
    const count = unlockedAchievements.length;
    if (count >= ACHIEVEMENT_TIERS.GOLD.threshold) return { name: 'Gold', color: ACHIEVEMENT_TIERS.GOLD.color };
    if (count >= ACHIEVEMENT_TIERS.SILVER.threshold) return { name: 'Silver', color: ACHIEVEMENT_TIERS.SILVER.color };
    return { name: 'Bronze', color: ACHIEVEMENT_TIERS.BRONZE.color };
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const tier = getTierInfo();
  const progressPercentage = Math.min(
    (unlockedAchievements.length / ACHIEVEMENT_TIERS.GOLD.threshold) * 100,
    100
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center w-[30%] z-50">
      <button 
        onClick={onClose}
        className="fixed top-10 right-100 w-8 h-8 flex items-center justify-center rounded-full bg-red-900/75 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
      >
        <X size={20} />
      </button>
      
      <div className="bg-black/50 p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Trophy className="h-6 w-6" style={{ color: tier.color }} />
            Achievements ({unlockedAchievements.length}/{Object.keys(achievements).length})
          </h2>
        </div>
        
        <div className="mb-4">
          <p className="text-white">Current Tier: <span style={{ color: tier.color }}>{tier.name}</span></p>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPercentage}%`,
                backgroundColor: tier.color
              }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {Object.values(achievements).map(achievement => {
            const isUnlocked = unlockedAchievements.includes(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`p-3 rounded-lg ${isUnlocked ? 'bg-green-500/65' : 'bg-gray-800/65'}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div>
                    <h3 className={`font-medium ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-gray-400">{achievement.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};