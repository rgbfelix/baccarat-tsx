export const totalBet = (pp: number, player: number, tie: number, banker: number, bp: number) => {
  return pp + player + tie + banker + bp;
}

export const totalScore = (values: number[]) => {
  let score: number = 0;
  for (let i: number = 0; i < values.length; i++) {
    score += values[i] > 10 ? 10 : values[i];
  }
  return score % 10;
}

export const winResult = (player_score: number, banker_score: number) => {
  let message: string = '';
  if (player_score > banker_score) {
    message = 'PLAYER WINS!';
  }
  else if (player_score < banker_score) {
    message = 'BANKER WINS!';
  }
  else {
    message = 'IT\'S A TIE!';
  }
  return message;
}

export const totalWin = (
  player_score: number,
  banker_score: number,
  is_pp: boolean,
  is_bp: boolean,
  pp: number,
  player: number,
  tie: number,
  banker: number,
  bp: number
) => {
  let wins: number = 0;
  // it's a tie
  if (player_score === banker_score) {
    // return bets on player and banker if no bet on tie
    if (tie === 0) {
      wins += (player + banker);
    }
    else {
      wins += (tie * 9);
    }
  }
  // player wins
  else if (player_score > banker_score) {
    wins += (player * 2);
  }
  // banker wins
  else if (player_score < banker_score) {
    wins += (banker * 2);
  }
  // player pairs
  if (is_pp) {
    wins += (pp * 12);
  }
  // banker pairs
  if (is_bp) {
    wins += (bp * 12);
  }
  return wins;
}