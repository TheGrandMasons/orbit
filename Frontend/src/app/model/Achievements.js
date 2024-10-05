import { Alert, AlertTitle, AlertDescription } from './Alert';
import { useEffect } from 'react';

export const ACHIEVEMENT_TIERS = {
  WOOD: { threshold: 0, color: '#FFC18C' },
  BRONZE: { threshold: 5, color: '#CD7F32' },
  SILVER: { threshold: 10, color: '#C0C0C0' },
  GOLD: { threshold: 15, color: '#FFD700' }
};

export const ACHIEVEMENTS = {
  HOME_SWEET_HOME: {
    id: 'HOME_SWEET_HOME',
    title: 'Home Sweet Home',
    description: 'Visited Earth for the first time',
    icon: '🌍',
    relatedBody: 'Earth'
  },
  SUN_EXPLORER: {
    id: 'SUN_EXPLORER',
    title: 'Sun Explorer',
    description: 'Visited the Sun',
    icon: '☀️',
    relatedBody: 'Sun'
  },
  MARS_COLONIST: {
    id: 'MARS_COLONIST',
    title: 'Mars Colonist',
    description: 'Visited Mars',
    icon: '🔴',
    relatedBody: 'Mars'
  },
  SPACE_CHATTER: {
    id: 'SPACE_CHATTER',
    title: 'Space Chatter',
    description: 'Had your first conversation with the AI',
    icon: '💬'
  },
  PLANETARY_EXPLORER: {
    id: 'PLANETARY_EXPLORER',
    title: 'Planetary Explorer',
    description: 'Visited all planets in the solar system',
    icon: '🚀'
  },
  MOON_WALKER: {
    id: 'MOON_WALKER',
    title: 'Moon Walker',
    description: "Visited Earth's Moon",
    icon: '🌙',
    relatedBody: 'Moon'
  },
  JUPITER_GIANT: {
    id: 'JUPITER_GIANT',
    title: 'Jupiter Giant',
    description: 'Visited the largest planet',
    icon: '⭐',
    relatedBody: 'Jupiter'
  },
  RING_MASTER: {
    id: 'RING_MASTER',
    title: 'Ring Master',
    description: 'Visited Saturn and its rings',
    icon: '💫',
    relatedBody: 'Saturn'
  },
  ICE_GIANT_EXPLORER: {
    id: 'ICE_GIANT_EXPLORER',
    title: 'Ice Giant Explorer',
    description: 'Visited both Uranus and Neptune',
    icon: '❄️'
  },
  STELLAR_SCHOLAR: {
    id: 'STELLAR_SCHOLAR',
    title: 'Stellar Scholar',
    description: 'Had 10 conversations with the AI',
    icon: '📚'
  },
  SPEED_DEMON: {
    id: 'SPEED_DEMON',
    title: 'Speed Demon',
    description: 'Set orbital speed to maximum',
    icon: '⚡'
  },
  TIME_MASTER: {
    id: 'TIME_MASTER',
    title: 'Time Master',
    description: 'Adjusted animation speed settings',
    icon: '⏱️'
  },
  PHOTOGRAPHER: {
    id: 'PHOTOGRAPHER',
    title: 'Space Photographer',
    description: 'Reset camera position 5 times',
    icon: '📸'
  },
  MERCURY_MESSENGER: {
    id: 'MERCURY_MESSENGER',
    title: 'Mercury Messenger',
    description: 'Visited the smallest planet',
    icon: '🔭',
    relatedBody: 'Mercury'
  },
  VENUS_EXPLORER: {
    id: 'VENUS_EXPLORER',
    title: 'Venus Explorer',
    description: 'Visited the hottest planet',
    icon: '🌋',
    relatedBody: 'Venus'
  },
  URANUS_DISCOVERER: {
    id: 'URANUS_DISCOVERER',
    title: 'Uranus Discoverer',
    description: 'Visited the tilted planet',
    icon: '🌌',
    relatedBody: 'Uranus'
  },
  NEPTUNE_VOYAGER: {
    id: 'NEPTUNE_VOYAGER',
    title: 'Neptune Voyager',
    description: 'Visited the windiest planet',
    icon: '💨',
    relatedBody: 'Neptune'
  },
  COSMIC_CURATOR: {
    id: 'COSMIC_CURATOR',
    title: 'Cosmic Curator',
    description: 'Explored all celestial bodies',
    icon: '🏆'
  }
};

// Additional achievement utility functions
export const isAchievementUnlocked = (achievementId, unlockedAchievements) => {
  return unlockedAchievements.includes(achievementId);
};

export const getProgress = (unlockedAchievements) => {
  const totalAchievements = Object.keys(ACHIEVEMENTS).length;
  return {
    total: totalAchievements,
    unlocked: unlockedAchievements.length,
    percentage: (unlockedAchievements.length / totalAchievements) * 100
  };
};

export const getCurrentTier = (unlockedCount) => {
  if (unlockedCount >= ACHIEVEMENT_TIERS.GOLD.threshold) return 'GOLD';
  if (unlockedCount >= ACHIEVEMENT_TIERS.SILVER.threshold) return 'SILVER';
  return 'BRONZE';
};

export const AchievementNotification = ({ achievement, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <CustomAlert className="achievement-notification fixed top-4 right-4 w-80 p-4 animate-slideIn">
      <CustomAlertTitle className="flex items-center gap-2">
        <span className="text-2xl">{achievement.icon}</span>
        <span>{achievement.title}</span>
      </CustomAlertTitle>
      <CustomAlertDescription>
        {achievement.description}
      </CustomAlertDescription>
    </CustomAlert>
  );
};