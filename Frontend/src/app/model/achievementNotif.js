const AchievementNotification = ({ achievement, onClose }) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
  
      return () => clearTimeout(timer);
    }, [onClose]);
  
    return (
      <div className="fixed top-4 right-4 bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg animate-slide-in">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{achievement.icon}</span>
          <div>
            <h3 className="font-bold">Achievement Unlocked!</h3>
            <p>{achievement.title}</p>
            <p className="text-sm text-white/70">{achievement.description}</p>
          </div>
        </div>
      </div>
    );
  };