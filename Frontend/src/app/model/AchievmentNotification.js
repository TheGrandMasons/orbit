// Achievement Toast Notification
import { useEffect } from "react";
import { Alert, AlertTitle, AlertDescription } from "./Alert";
export const AchievementNotification = ({ achievement, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <Alert className="achievement-notification fixed top-10 right-10 w-80 px-6 py-6 bg-black/80 border-gold-500 text-white animate-slideIn">
      <AlertTitle className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{achievement.icon}</span>
        <span className="font-bold">{achievement.title}</span>
      </AlertTitle>
      <AlertDescription className="text-gray-300">
        {achievement.description}
      </AlertDescription>
    </Alert>
  );
};