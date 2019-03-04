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
import Actions, { GameStates, IAction, setGameState, setCard, setWin, addBet } from './redux/actions/Actions';

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
  it('Must have correct total bet:', () => {
    expect(total_bet).toEqual(60);
  });

  it('Must have correct total win:', () => {
    expect(total_win).toBe(100);
  });

  it('Must have correct player score:', () => {
    expect(player_score).toBe(5);
  });

  it('Must have correct banker score:', () => {
    expect(banker_score).toBe(9);
  });

  // This can have 'PLAYER WINS!', 'BANKER WINS!', or 'IT\'S A TIE!' depending on the result.
  it('Must have correct win result:', () => {
    let win_result = winResult(player_score, banker_score);
    expect(win_result).toBe('BANKER WINS!');
  });

  // ADDED TESTS:
  describe('Game state must follow standards:', () => {
    it('Must not accept some random game states:',() => {
      let game_state: IAction = setGameState('SOME_RANDOM_GAME_STATES').payload.game_state;
      expect(game_state).toBe('');
    });
    it('Must accept standard game states and return that game state in the payload:',() => {
      let game_state: IAction = setGameState(GameStates.REVEALING_CARDS).payload.game_state;
      expect(game_state).toBe(GameStates.REVEALING_CARDS);
    });
  });

  describe('Must not set invalid card values:', () => {
    let value1: IAction = setCard(Actions.SET_PLAYER1, -5, 'S').payload.value;
    it('Card values cannot be less than 0:',() => {
      expect(value1).toBe(0);
    });
    let value2: IAction = setCard(Actions.SET_PLAYER1, 15, 'S').payload.value;
    it('Card values cannot be greater than 13:',() => {
      expect(value2).toBe(13);
    });
    let value3: IAction = setCard(Actions.SET_PLAYER1, 7, 'S').payload.value;
    it('Card values must be 0 to 13:',() => {
      expect(value3).toBe(7);
    });
  });

  it('Win must not be less than 0:',() => {
    let amount: IAction = setWin(-60).payload.amount;
    expect(amount).toBe(0);
  });

  describe('Must not add negative bet:', () => {
    it('Negative:',() => {
      let chip_value: IAction = addBet(Actions.ADD_PP, -10).payload.chip_value;
      expect(chip_value).toBe(0);
    });
    it('Not negative:',() => {
      let chip_value: IAction = addBet(Actions.ADD_PP, 10).payload.chip_value;
      expect(chip_value).toBe(10);
    });
  });
});