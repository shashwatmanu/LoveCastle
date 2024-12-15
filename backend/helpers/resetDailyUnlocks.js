export const resetDailyUnlocks = (user) => {
    const now = new Date();
    const lastReset = user.dailyUnlocks.lastReset;
  
    if (!lastReset || now - new Date(lastReset) > 24 * 60 * 60 * 1000) {
      user.dailyUnlocks.challenges = 0;
      user.dailyUnlocks.lastReset = now;
    }
  };
  