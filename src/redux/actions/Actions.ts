export interface IAction {
  type: string;
  payload: any;
}

// user actions
export const setName = (name: string): IAction => {
  return {
    type: Actions.SET_NAME,
    payload: {
      name: name
    }
  }
}

export const setBalance = (value: number): IAction => {
  return {
    type: Actions.SET_BALANCE,
    payload: {
      value: value
    }
  }
}

// game actions
export const setGameState = (game_state: string): IAction => {
  let isValidGameState: boolean = false;
  for (let i: number = 0; i < GameStates.VALID_GAME_STATES.length; i++) {
    if (game_state === GameStates.VALID_GAME_STATES[i]) {
      isValidGameState = true;
      break;
    }
  }
  if (!isValidGameState) {
    game_state = '';
  }
  return {
    type: Actions.SET_GAME_STATE,
    payload: {
      game_state: game_state
    }
  }
}

export const clearCards = (): IAction => {
  return {
    type: Actions.CLEAR_CARDS,
    payload: {}
  }
}

export const setCard = (actionType: string, value: number, suit: string): IAction => {
  if (value < 0) {
    value = 0;
  }
  else if (value > 13) {
    value = 13;
  }
  return {
    type: actionType,
    payload: {
      value: value,
      suit: suit
    }
  }
}

export const addHistory = (result: string): IAction => {
  return {
    type: Actions.ADD_HISTORY,
    payload: {
      result: result
    }
  }
}

// betting actions
export const setWin = (amount: number): IAction => {
  if (amount < 0) {
    amount = 0;
  }
  return {
    type: Actions.SET_WIN,
    payload: {
      amount: amount
    }
  }
}

export const selectChip = (chip_value: number): IAction => {
  return {
    type: Actions.SELECT_CHIP,
    payload: {
      chip_value: chip_value
    }
  }
}

export const clearBets = (): IAction => {
  return {
    type: Actions.CLEAR_BETS,
    payload: null
  }
}

export const addBet = (actionType: string, chip_value: number): IAction => {
  if (chip_value < 0) {
    chip_value = 0;
  }
  return {
    type: actionType,
    payload: {
      chip_value: chip_value
    }
  }
}

export class GameStates {
  public static WAITING_TO_DEAL: string = 'WAITING_TO_DEAL';
  public static REVEALING_CARDS: string = 'REVEALING_CARDS';
  public static SHOWING_WIN: string = 'SHOWING_WIN';
  public static VALID_GAME_STATES: string[] = [
    GameStates.WAITING_TO_DEAL,
    GameStates.REVEALING_CARDS,
    GameStates.SHOWING_WIN
  ];
}

class Actions {
  // user actions types
  public static SET_NAME: string = 'SET_NAME';
  public static SET_BALANCE: string = 'SET_BALANCE';
  // game actions types
  public static SET_GAME_STATE: string = 'SET_GAME_STATE';
  public static CLEAR_CARDS: string = 'CLEAR_CARDS';
  public static SET_PLAYER1: string = 'SET_PLAYER1';
  public static SET_PLAYER2: string = 'SET_PLAYER2';
  public static SET_PLAYER3: string = 'SET_PLAYER3';
  public static SET_BANKER1: string = 'SET_BANKER1';
  public static SET_BANKER2: string = 'SET_BANKER2';
  public static SET_BANKER3: string = 'SET_BANKER3';
  public static ADD_HISTORY: string = 'ADD_HISTORY';
  // betting actions types
  public static SET_WIN: string = 'SET_WIN';
  public static SELECT_CHIP: string = 'SELECT_CHIP';
  public static CLEAR_BETS: string = 'CLEAR_BETS';
  public static ADD_PP: string = 'ADD_PP';
  public static ADD_PLAYER: string = 'ADD_PLAYER';
  public static ADD_TIE: string = 'ADD_TIE';
  public static ADD_BANKER: string = 'ADD_BANKER';
  public static ADD_BP: string = 'ADD_BP';
}

export default Actions;