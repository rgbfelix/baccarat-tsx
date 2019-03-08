export const totalBet = (pp: number, player: number, tie: number, banker: number, bp: number) => {
  // auto-correct: bets cannot be less than 0
  pp = pp < 0 ? 0 : pp;
  player = player < 0 ? 0 : player;
  tie = tie < 0 ? 0 : tie;
  banker = banker < 0 ? 0 : banker;
  bp = bp < 0 ? 0 : bp;
  return pp + player + tie + banker + bp;
}

export const totalScore = (values: number[]) => {
  let totalScore: number = 0;
  for (let i: number = 0; i < values.length; i++) {
    // card values as scores cannot be less 0 (unset) and 10, jack, queen and king have value of 0
    totalScore += values[i] < 0 ? 0 : values[i] > 10 ? 0 : values[i];
  }
  return totalScore % 10;
}

export const winResult = (player_score: number, banker_score: number) => {
  // auto-correct: player and banker score cannot be less than 0 or greater than 9
  player_score = player_score < 0 ? 0 : player_score > 9 ? 9 : player_score;
  banker_score = banker_score < 0 ? 0 : banker_score > 9 ? 9 : banker_score;
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
  // auto-correct: banker and player scores cannot be less than 0 or more than 9
  player_score = player_score < 0 ? 0 : player_score > 9 ? 9 : player_score;
  banker_score = banker_score < 0 ? 0 : banker_score > 9 ? 9 : banker_score;
  // auto-correct: bets cannot be less than 0
  pp = pp < 0 ? 0 : pp;
  player = player < 0 ? 0 : player;
  tie = tie < 0 ? 0 : tie;
  banker = banker < 0 ? 0 : banker;
  bp = bp < 0 ? 0 : bp;
  /* Note that these net wins varies from different casinos. For the sake of this work test, let's just use... 
    TIE - 1:8
    PLAYER - 1:1
    BANKER - 1:1
    PP - 11:1
    BP - 11:1
  */
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