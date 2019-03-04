import { combineReducers } from 'redux';
import Actions, { GameStates, IAction } from './actions/Actions';
import { ICard, Card } from 'src/components/CardsManager';

export interface IRootState {
  user?: IUserState;
  game?: IGameState;
  betting?: IBettingState;
}

export interface IUserState {
  name: string,
  balance: number
}

export interface IGameState {
  game_state: string,
  player1: ICard,
  player2: ICard,
  player3: ICard,
  banker1: ICard,
  banker2: ICard,
  banker3: ICard,
  history: string[]
}

export interface IBettingState {
  win: number,
  selected_chip: number,
  pp: number,
  player: number,
  tie: number,
  banker: number,
  bp: number
}

const userInitialState: IUserState = {
  name: 'Cholo Park',
  balance: 25000
}

const gameInitialState: IGameState = {
  game_state: GameStates.WAITING_TO_DEAL,
  player1: new Card(0, ''),
  player2: new Card(0, ''),
  player3: new Card(0, ''),
  banker1: new Card(0, ''),
  banker2: new Card(0, ''),
  banker3: new Card(0, ''),
  history: []
}

const bettingInitialState: IBettingState = {
  win: 0,
  selected_chip: 5,
  pp: 0,
  player: 0,
  tie: 0,
  banker: 0, 
  bp: 0
}

const userReducer = (state: IUserState = userInitialState, action: IAction) => {
  switch (action.type) {
    case Actions.SET_NAME:
      state = {
        ...state,
        name: action.payload.name
      };
    case Actions.SET_BALANCE:
      state = {
        ...state,
        balance: action.payload.value
      };
      break;
  }
  return state;
}

const gameReducer = (state: IGameState = gameInitialState, action: IAction) => {
  switch (action.type) {
    case Actions.SET_GAME_STATE:
      if (action.payload.game_state === '') {
        return state;
      }
      state = {
        ...state,
        game_state: action.payload.game_state
      };
      break;
    case Actions.CLEAR_CARDS:
      state = {
        ...state,
        player1: {value: 0, suit: ''},
        player2: {value: 0, suit: ''},
        player3: {value: 0, suit: ''},
        banker1: {value: 0, suit: ''},
        banker2: {value: 0, suit: ''},
        banker3: {value: 0, suit: ''},
      };
      break;
    case Actions.SET_PLAYER1:
      state = {
        ...state,
        player1: {value: action.payload.value, suit: action.payload.suit}
      };
      break;
    case Actions.SET_PLAYER2:
      state = {
        ...state,
        player2: {value: action.payload.value, suit: action.payload.suit}
      };
      break;
    case Actions.SET_PLAYER3:
      state = {
        ...state,
        player3: {value: action.payload.value, suit: action.payload.suit}
      };
      break;
    case Actions.SET_BANKER1:
      state = {
        ...state,
        banker1: {value: action.payload.value, suit: action.payload.suit}
      };
      break;
    case Actions.SET_BANKER2:
      state = {
        ...state,
        banker2: {value: action.payload.value, suit: action.payload.suit}
      };
      break;
    case Actions.SET_BANKER3:
      state = {
        ...state,
        banker3: {value: action.payload.value, suit: action.payload.suit}
      };
      break;
    case Actions.ADD_HISTORY:
      state = {
        ...state,
        history: [ ...state.history, action.payload.result]
      };
      break;
  }
  return state;
}

const bettingReducer = (state: IBettingState = bettingInitialState, action: IAction) => {
  switch (action.type) {
    case Actions.SET_WIN:
      state = {
        ...state,
        win: action.payload.amount
      };
      break;
    case Actions.SELECT_CHIP:
      state = {
        ...state,
        selected_chip: action.payload.chip_value
      };
      break;
    case Actions.CLEAR_BETS:
      state = {
        ...state,
        pp: 0,
        player: 0,
        tie: 0,
        banker: 0,
        bp: 0
      };
      break;
    case Actions.ADD_PP:
      state = {
        ...state,
        pp: state.pp + action.payload.chip_value
      };
      break;
    case Actions.ADD_PLAYER:
        state = {
          ...state,
          player: state.player + action.payload.chip_value
        };
        break;
    case Actions.ADD_TIE:
      state = {
        ...state,
        tie: state.tie + action.payload.chip_value
      };
      break;
    case Actions.ADD_BANKER:
      state = {
        ...state,
        banker: state.banker + action.payload.chip_value
      };
      break;
    case Actions.ADD_BP:
      state = {
        ...state,
        bp: state.bp + action.payload.chip_value
      };
      break;
  }
  return state;
}

const reducers = combineReducers({
  user: userReducer,
  game: gameReducer,
  betting: bettingReducer
});

export default reducers;