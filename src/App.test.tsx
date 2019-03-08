/* import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
}); */

import { totalBet, totalScore, winResult, totalWin } from './utils/PureFunctions';
import Actions, { GameStates, IAction, setGameState, setCard, setWin, addBet } from './redux/actions/Actions';

describe('Test game logic:', () => {
  describe('Total bet:', () => {
    it('Using valid values as inputs.', () => {
      expect(
        totalBet(10, 0, 20, 0, 30)
      ).toEqual(60);
    });
    it('Negative bets must be counted as 0.', () => {
      expect(
        totalBet(-10, -20, -30, -40, -50)
      ).toEqual(0);
    });
    it('Must have correct total bet regardless if have 0, negative and positive values as inputs.', () => {
      expect(
        totalBet(0, 10, -20, 30, -40)
      ).toEqual(40);
    });
  });

  // NOTE: totalWin returns gross win, before deduction of total bet.
  describe('Total win:', () => {
    it('Using valid inputs.', () => {
      expect(totalWin(
        5, 9,
        false, false,
        0, 10, 0, 50, 0
      )).toBe(100); // banker wins, x2 bet on banker
    });
    it('Using valid inputs + player pair.', () => {
      expect(totalWin(
        5, 9,
        true, false,
        10, 10, 0, 50, 0
      )).toBe(220); // banker wins and player pair, x2 bet on banker + x12 on pp
    });
    it('Using valid inputs + banker pair.', () => {
      expect(totalWin(
        5, 9,
        false, true,
        0, 10, 0, 50, 10
      )).toBe(220); // banker wins and banker pair, x2 bet on banker + x12 on bp
    });
    it('Negative player scores must be counted as 0.', () => {
      expect(totalWin(
        1,
        -9,
        false,
        false,
        0, 35, 0, 20, 0
      )).toBe(70); // player wins, x2 bet on player
    });
    it('Negative banker scores must be counted as 0.', () => {
      expect(totalWin(
        -9,
        1,
        false,
        false,
        0, 35, 0, 20, 0
      )).toBe(40); // banker wins, x2 bet on banker
    });
    it('Win on negative bet must be 0 because that bet is 0.', () => {
      expect(totalWin(
        5,
        9,
        false,
        false,
        0, 35, 0, -20, 0
      )).toBe(0); // banker wins, must be 0 instead of -40
    });
    it('Must return bets on player and banker when result is tie while there is no bet on tie.', () => {
      expect(totalWin(
        5,
        5,
        false,
        false,
        0, 35, 0, 15, 0
      )).toBe(50); // remember that totalWin returns gross win
    });
    it('Must not return bets on player and banker when result is tie while there is bet on tie.', () => {
      expect(totalWin(
        5,
        5,
        false,
        false,
        0, 35, 10, 15, 0
      )).toBe(90); // tie wins, x9 bet on tie
    });
  });

  describe('Player and banker score:', () => {
    it('Using valid values as inputs total less than 10.', () => {
      expect(
        totalScore([1, 2, 5])
      ).toEqual(8);
    });
    it('Using valid values as inputs total divisible by 10.', () => {
      expect(
        totalScore([2, 3, 5])
      ).toEqual(0);
    });
    it('Card values more than 10 must be counted as 0.', () => {
      expect(
        totalScore([11, 17, 999])
      ).toEqual(0);
    });
    it('Another using valid values as inputs total divisible by 10.', () => {
      expect(
        totalScore([5, 7, 8])
      ).toEqual(0);
    });
    it('Using valid values as inputs total more than 10.', () => {
      expect(
        totalScore([5, 7, 5])
      ).toEqual(7);
    });
    it('Negative card values must be counted as 0.', () => {
      expect(
        totalScore([-5, 0, -3])
      ).toEqual(0);
    });
    it('Must have correct total score regardless if have 0, negative and positive values as inputs.', () => {
      expect(
        totalScore([-5, 0, 3])
      ).toEqual(3);
    });
  });

  describe('Win result:', () => {
    it('PLAYER', () => {
      expect(
        winResult(1, 0)
      ).toBe('PLAYER WINS!');
    });
    it('BANKER.', () => {
      expect(
        winResult(0, 1)
      ).toBe('BANKER WINS!');
    });
    it('TIE.', () => {
      expect(
        winResult(1, 1)
      ).toBe('IT\'S A TIE!');
    });
    it('Negative input must be counted as 0.', () => {
      expect(
        winResult(-2, 1)
      ).toBe('BANKER WINS!');
    });
    it('Inputs more than 9 must be counted as 9.', () => {
      expect(
        winResult(15, 9)
      ).toBe('IT\'S A TIE!');
    });
  });

  // ACTIONS-RELATED
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

  describe('Win must not be less than 0:', () => {
    it('Negative:',() => {
      let amount: IAction = setWin(-60).payload.amount;
      expect(amount).toBe(0);
    });
    it('Positive:',() => {
      let amount: IAction = setWin(60).payload.amount;
      expect(amount).toBe(60);
    });
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