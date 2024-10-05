"use client";

import { ACHIEVEMENTS } from './Achievements';

export class AchievementManager {
  constructor() {
    this.unlockedAchievements = [];
    this.listeners = new Set();
    this.loadUnlockedAchievements();
  }

  loadUnlockedAchievements() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('unlockedAchievements');
      this.unlockedAchievements = saved ? JSON.parse(saved) : [];
    }
  }

  saveUnlockedAchievements() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('unlockedAchievements', JSON.stringify(this.unlockedAchievements));
    }
  }

  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  unlockAchievement(achievementId) {
    if (!this.unlockedAchievements.includes(achievementId) && ACHIEVEMENTS[achievementId]) {
      this.unlockedAchievements.push(achievementId);
      this.saveUnlockedAchievements();
      
      const achievement = ACHIEVEMENTS[achievementId];
      this.listeners.forEach(callback => callback(achievement));
    }
  }

  checkBodyVisited(bodyName) {
    const body = bodyName.toLowerCase();
    const achievementMap = {
      'earth': 'HOME_SWEET_HOME',
      'sun': 'SUN_EXPLORER',
      'mars': 'MARS_COLONIST',
      'moon': 'MOON_WALKER',
      'jupiter': 'JUPITER_GIANT',
      'saturn': 'RING_MASTER',
      'mercury': 'MERCURY_MESSENGER',
      'venus': 'VENUS_EXPLORER',
      'uranus': 'URANUS_DISCOVERER',
      'neptune': 'NEPTUNE_VOYAGER'
    };

    if (achievementMap[body]) {
      this.unlockAchievement(achievementMap[body]);
    }

    const planets = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
    const visitedPlanets = this.unlockedAchievements
      .map(id => ACHIEVEMENTS[id]?.relatedBody?.toLowerCase())
      .filter(body => planets.includes(body));

    if (visitedPlanets.length === planets.length) {
      this.unlockAchievement('PLANETARY_EXPLORER');
    }

    if (visitedPlanets.includes('uranus') && visitedPlanets.includes('neptune')) {
      this.unlockAchievement('ICE_GIANT_EXPLORER');
    }
  }
}

export const achievementManager = new AchievementManager();