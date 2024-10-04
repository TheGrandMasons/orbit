
  // AchievementPanel.js
  import React, { useState, useEffect } from 'react';
  import { ACHIEVEMENT_TIERS, ACHIEVEMENTS } from '../model/Achievements';
  
  const AchievementPanel = ({ unlockedAchievements }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [currentTier, setCurrentTier] = useState(null);
    const [showTierAnimation, setShowTierAnimation] = useState(false);
  
    useEffect(() => {
      const achievementCount = unlockedAchievements.length;
      let newTier = null;
  
      if (achievementCount >= ACHIEVEMENT_TIERS.GOLD.threshold) {
        newTier = 'GOLD';
      } else if (achievementCount >= ACHIEVEMENT_TIERS.SILVER.threshold) {
        newTier = 'SILVER';
      } else if (achievementCount >= ACHIEVEMENT_TIERS.BRONZE.threshold) {
        newTier = 'BRONZE';
      }
  
      if (newTier !== currentTier) {
        setCurrentTier(newTier);
        setShowTierAnimation(true);
        setTimeout(() => setShowTierAnimation(false), 3000);
      }
    }, [unlockedAchievements, currentTier]);
  
    return (
      <div className={`fixed left-0 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-sm text-white transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-80'}`}>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute right-2 top-2 text-white/80 hover:text-white"
        >
          {isCollapsed ? '▶' : '◀'}
        </button>
  
        <div className="p-4">
          {!isCollapsed && (
            <>
              <h2 className="text-xl font-bold mb-4">
                Achievements 
                <span className="ml-2 text-sm">
                  ({unlockedAchievements.length}/{Object.keys(ACHIEVEMENTS).length})
                </span>
              </h2>
              
              {currentTier && (
                <div className={`mb-4 flex items-center gap-2 ${showTierAnimation ? 'animate-bounce' : ''}`}>
                  <span className={`inline-block w-6 h-6 rounded-full`} 
                        style={{ backgroundColor: ACHIEVEMENT_TIERS[currentTier].color }} />
                  <span>{currentTier} Tier</span>
                </div>
              )}
  
              <div className="space-y-2">
                {Object.values(ACHIEVEMENTS).map(achievement => {
                  const isUnlocked = unlockedAchievements.includes(achievement.id);
                  return (
                    <div 
                      key={achievement.id}
                      className={`p-2 rounded ${isUnlocked ? 'bg-white/20' : 'bg-white/5'}`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{achievement.icon}</span>
                        <div>
                          <h3 className={`font-bold ${isUnlocked ? 'text-white' : 'text-white/50'}`}>
                            {achievement.title}
                          </h3>
                          <p className="text-sm text-white/70">{achievement.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {isCollapsed && (
            <div className="w-12 h-full flex flex-col items-center">
              <span className="rotate-90 whitespace-nowrap mt-4">Achievements</span>
              {currentTier && (
                <div 
                  className={`w-6 h-6 rounded-full mt-4 ${showTierAnimation ? 'animate-bounce' : ''}`}
                  style={{ backgroundColor: ACHIEVEMENT_TIERS[currentTier].color }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    );
  };
