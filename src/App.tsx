import * as React from 'react';
import { Dispatch } from 'react';
import { connect } from 'react-redux';
import { IUserState, IGameState, IBettingState, IRootState } from './redux/Store';
import Actions, { GameStates, setBalance, setGameState, clearCards, setCard, addHistory, setWin, clearBets, IAction } from './redux/actions/Actions';

import History from './components/History';
import CardsAndResults from './components/CardsAndResults';
import BettingArea from './components/BettingArea';
import Footer from './components/Footer';
import CardsManager, { DrawResult, ICard } from './components/CardsManager';
import { totalBet, totalWin } from './utils/PureFunctions';

import background from './images/background.jpg';

import './styles/App.css';

interface StateProps {
  user: IUserState;
  game: IGameState;
  betting: IBettingState;
}

interface DispatchProps {
  setBalance: (value: number) => void;
  setCard: (actionType: string, value: number, suit: string) => void;
  clearCards: () => void;
  setWin: (amount: number) => void;
  clearBets: () => void;
  addHistory: (game_result: string) => void;
  setGameState: (game_state: string) => void;
}

type Props = StateProps & DispatchProps;

interface IState {
  reveal_counter: number;
  show_blank: boolean;
}

class App extends React.Component<Props, IState> {
  state = {
    reveal_counter: 0,
    show_blank: false
  }
  blank_on: number = -1;
  cards_manager: CardsManager = new CardsManager();

  dealClickHandler = (event: any) => {
    if (this.props.game.game_state === GameStates.WAITING_TO_DEAL || this.props.game.game_state === GameStates.SHOWING_WIN) {
      if (this.props.user.balance >= this.getTotalBet()) {
        this.props.clearCards();
        this.setState({reveal_counter: 0});
        this.deal();
      }
      else {
        console.log('You do not have enought balance!');
      }
    }
  }

  deal() {
    this.props.setBalance(this.props.user.balance - this.getTotalBet());

    // getGameResult
    let draw_result: DrawResult = this.cards_manager.drawCards();
    let table_cards: ICard[] = draw_result.table_cards;
    this.blank_on = draw_result.blank_on;
    this.props.setCard(Actions.SET_PLAYER1, table_cards[0].value, table_cards[0].suit);
    this.props.setCard(Actions.SET_PLAYER2, table_cards[2].value, table_cards[2].suit);
    this.props.setCard(Actions.SET_PLAYER3, table_cards[4].value, table_cards[4].suit);
    this.props.setCard(Actions.SET_BANKER1, table_cards[1].value, table_cards[1].suit);
    this.props.setCard(Actions.SET_BANKER2, table_cards[3].value, table_cards[3].suit);
    this.props.setCard(Actions.SET_BANKER3, table_cards[5].value, table_cards[5].suit);
    let player_score: number = this.cards_manager.totalScore([table_cards[0].value, table_cards[2].value, table_cards[4].value]);
    let banker_score: number = this.cards_manager.totalScore([table_cards[1].value, table_cards[3].value, table_cards[5].value]);
    // NOTE: Total win means gross win before deduction of total bet.
    this.props.setWin(totalWin(
      player_score,
      banker_score,
      table_cards[0].value === table_cards[2].value,
      table_cards[1].value === table_cards[3].value,
      this.props.betting.pp,
      this.props.betting.player,
      this.props.betting.tie,
      this.props.betting.banker,
      this.props.betting.bp
    ));

    this.props.setGameState(GameStates.REVEALING_CARDS);
    window.setTimeout(this.revealCards.bind(this), 250);
  }

  getTotalBet(): number {
    return totalBet(this.props.betting.pp, this.props.betting.player, this.props.betting.tie, this.props.betting.banker, this.props.betting.bp);
  }

  revealCards() {
    if (this.state.reveal_counter === this.blank_on) {
      // show blank for 5 seconds...
      this.blank_on = -1;
      this.setState({
        show_blank: true,
      })
      window.setTimeout(this.afterShowingBlank.bind(this), 5000);
    }
    else {
      this.setState({
        reveal_counter: this.state.reveal_counter + 1
      });
      // first 3 will always have delay
      if (this.state.reveal_counter <= 3) {
        window.setTimeout(this.revealCards.bind(this), 1000);
      }
      else if (this.state.reveal_counter === 4) {
        // if there's 5th card, delay
        if (this.props.game.player3.value !== 0 && this.props.game.player3.suit !== '') {
          window.setTimeout(this.revealCards.bind(this), 1000);
        }
        // else if there's 6th, don't delay and proceed
        else if (this.props.game.banker3.value !== 0 && this.props.game.banker3.suit !== '') {
          this.revealCards();
        }
        // else show win
        else {
          window.setTimeout(this.showWin.bind(this), 1000);
        }
      }
      else if (this.state.reveal_counter === 5) {
        // if there's 6th card, delay
        if (this.props.game.banker3.value !== 0 && this.props.game.banker3.suit !== '') {
          window.setTimeout(this.revealCards.bind(this), 1000);
        }
        // else show win
        else {
          window.setTimeout(this.showWin.bind(this), 1000);
        }
      }
      else if (this.state.reveal_counter >= 6) {
        window.setTimeout(this.showWin.bind(this), 1000);
      }
    }
  }

  afterShowingBlank() {
    this.setState({
      show_blank: false,
    })
    this.revealCards();
  }

  showWin() {
    this.props.setGameState(GameStates.SHOWING_WIN);
    let player_score: number = this.cards_manager.totalScore([this.props.game.player1.value, this.props.game.player2.value, this.props.game.player3.value]);
    let banker_score: number = this.cards_manager.totalScore([this.props.game.banker1.value, this.props.game.banker2.value, this.props.game.banker3.value]);
    if (player_score > banker_score) {
      this.props.addHistory('P');
    }
    else if (player_score < banker_score) {
      this.props.addHistory('B');
    }
    else if (player_score === banker_score) {
      this.props.addHistory('T');
    }
    this.props.setBalance(this.props.user.balance + this.props.betting.win);
  }

  render() {
    return (
      <div className="App">
        <img src={background} className="background-img" />
        <History />
        <CardsAndResults
          player1={this.props.game.player1}
          player2={this.props.game.player2}
          player3={this.props.game.player3}
          banker1={this.props.game.banker1}
          banker2={this.props.game.banker2}
          banker3={this.props.game.banker3}
          show_blank={this.state.show_blank}
          reveal_counter={this.state.reveal_counter}
          game_state={this.props.game.game_state}
          win={this.props.betting.win - this.getTotalBet()}
        />
        <BettingArea />
        <Footer dealClickHandler={this.dealClickHandler.bind(this)} />
      </div>
    );
  }
}

const mapStateToProps = ({user, game, betting}: IRootState ) => {
  return {user, game, betting}
};

const mapDispatchToProps = (dispatch: Dispatch<IAction>) => {
  return {
    setBalance: (value: number) => dispatch(setBalance(value)),
    setCard: (actionType: string, value: number, suit: string) => dispatch(setCard(actionType, value, suit)),
    clearCards: () => dispatch(clearCards()),
    setWin: (amount: number) => dispatch(setWin(amount)),
    clearBets: () => dispatch(clearBets()),
    addHistory: (game_result: string) => dispatch(addHistory(game_result)),
    setGameState: (game_state: string) => dispatch(setGameState(game_state))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);