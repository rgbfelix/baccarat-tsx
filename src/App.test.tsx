/* import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
}); */

import { totalBet, totalScore, winResult, totalWin } from './utils/PureFunctions';
import { Card } from './components/CardsManager';

describe('Test game logic', () => {
  // controlled variable inputs
  let cards = {
    player1: new Card(2, 'S'),
    player2: new Card(2, 'S'),
    player3: new Card(1, 'S'),
    banker1: new Card(5, 'H'),
    banker2: new Card(2, 'H'),
    banker3: new Card(2, 'H')
  };
  let bets = {
    pp: 0,
    player: 10,
    tie: 0,
    banker: 50,
    bp: 0
  }

  // uncontrolled variables
  let total_bet: number = totalBet(bets.pp, bets.player, bets.tie, bets.banker, bets.bp);
  let player_score = totalScore([cards.player1.value, cards.player2.value, cards.player3.value]);
  let banker_score = totalScore([cards.banker1.value, cards.banker2.value, cards.banker3.value]);
  // NOTE: Total win means gross win before deduction of total bet.
  let total_win: number = totalWin(
    player_score,
    banker_score,
    cards.player1.value === cards.player2.value,
    cards.banker1.value === cards.banker2.value,
    bets.pp,
    bets.player,
    bets.tie,
    bets.banker,
    bets.bp
  );

  // tests
  it('Must have correct total bet:', () => { // done
    expect(total_bet).toEqual(60);
  });

  it('Must have correct total win:', () => {
    expect(total_win).toBe(100);
  });

  it('Must have correct player score:', () => { // done
    expect(player_score).toBe(5);
  });

  it('Must have correct banker score:', () => { // done
    expect(banker_score).toBe(9);
  });

  // This can have 'PLAYER WINS!', 'BANKER WINS!', or 'IT\'S A TIE!' depending on the result.
  it('Must have correct win result:', () => {
    let win_result = winResult(player_score, banker_score);
    expect(win_result).toBe('BANKER WINS!');
  });
});