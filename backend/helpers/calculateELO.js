export const calculateELO = (playerRating, opponentRating, result) => {
    const K = 32; // K-factor
    const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
    const actualScore = result === 'win' ? 1 : result === 'draw' ? 0.5 : 0;
    return Math.round(playerRating + K * (actualScore - expectedScore));
  };