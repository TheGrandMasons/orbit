import { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { AchievementPopup } from './AchievementPopup';
import { AchievementNotification } from './AchievmentNotification';
import { achievementManager } from './AchievementManager';

export const AchievementButton = ({ unlockedAchievements, achievements }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const handleNewAchievement = (achievement) => {
      setNotification(achievement);
    };

    const unsubscribe = achievementManager.addListener(handleNewAchievement);
    return () => unsubscribe();
  }, []);

  return (
    <>
      <button
        onClick={() => setShowPopup(true)}
        className="fixed top-10 right-10 bg-black/70 p-3 rounded-full hover:bg-black/90 transition-colors"
      >
        <Trophy className="h-6 w-6 text-white" />
      </button>

      {showPopup && (
        <AchievementPopup
          achievements={achievements}
          unlockedAchievements={unlockedAchievements}
          onClose={() => setShowPopup(false)}
        />
      )}

      {notification && (
        <AchievementNotification
          achievement={notification}
          onClose={() => setNotification(null)}
        />
      )}
    </>
  );
};