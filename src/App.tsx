import * as React from 'react';
import History from './components/History';
import CardsAndResults from './components/CardsAndResults';
import BettingArea from './components/BettingArea';
import { IBets } from './components/BettingArea';
import Footer from './components/Footer';
import CardsManager from './components/CardsManager';
import { ICard } from './components/CardsManager';

import background from './images/background.jpg';

import './styles/App.css';

interface IState {
  game_state: string;
  balance: number;
  total_bet: number;
  win: number;
  selected_chip_value: number;
  bets: IBets;
  player_score: number;
  banker_score: number;
  player1: ICard;
  player2: ICard;
  player3: ICard;
  blank: ICard;
  banker1: ICard;
  banker2: ICard;
  banker3: ICard;
  message: string;
  history: string[];
  history_open: boolean;
  rounds_count: number;
  player_count: number;
  banker_count: number;
  tie_count: number;
}

interface IExtraDraw {
  canDraw: boolean;
  extra: string;
}

class App extends React.Component<{}, IState> {
  state: IState = {
    game_state: 'waiting_for_deal',
    balance: 25000,
    total_bet: 0,
    win: 0,
    selected_chip_value: 5,
    // bet areas
    bets: {
      pp: 0,
      player: 0,
      banker: 0,
      tie: 0,
      bp: 0
    },
    player_score: 0,
    banker_score: 0,
    // table cards
    player1: { value: 0, suit: '' },
    player2: { value: 0, suit: '' },
    player3: { value: 0, suit: '' },
    blank: { value: 0, suit: '' },
    banker1: { value: 0, suit: '' },
    banker2: { value: 0, suit: '' },
    banker3: { value: 0, suit: '' },
    message: '',
    // history
    history: [],
    history_open: false,
    rounds_count: 0,
    player_count: 0,
    banker_count: 0,
    tie_count: 0
  };

  draw_counter: number;
  extra_will_be_in: string;
  cards_manager: CardsManager = new CardsManager();

  historyClickHandler = (event: any) => {
    this.setState({
      history_open: !this.state.history_open
    });
  }

  areaClickHandler = (event: any) => {
    if (this.state.game_state === 'waiting_for_deal') {
      this.setState({
        total_bet: this.state.total_bet += this.state.selected_chip_value
      });
      this.setState({
        bets: {
          pp: this.state.bets.pp + (event === 'pp' ? this.state.selected_chip_value : 0),
          player: this.state.bets.player + (event === 'player' ? this.state.selected_chip_value : 0),
          banker: this.state.bets.banker + (event === 'banker' ? this.state.selected_chip_value : 0),
          tie: this.state.bets.tie + (event === 'tie' ? this.state.selected_chip_value : 0),
          bp: this.state.bets.bp + (event === 'bp' ? this.state.selected_chip_value : 0)
        }
      });
    }
  }

  chipClickHandler = (event: any) => {
    this.setState({
      selected_chip_value: event
    });
  }

  dealClickHandler = (event: any) => {
    if (this.state.game_state === 'waiting_for_deal') {
      if (this.state.balance >= this.state.total_bet) {
        this.clear(false);
        this.deal();
      }
      else {
        throw Error('You do not have enought balance!');
      }
    }
  }

  deal() {
    let newBalance: number = this.state.balance - this.state.total_bet;
    this.setState({
      balance: newBalance,
      game_state: 'dealing',
      rounds_count: this.state.rounds_count + 1
    });
    this.draw_counter = 0;
    window.setTimeout(() => this.draw(), 500);
  }

  clearClickHandler = (event: any) => {
    if (this.state.game_state === 'waiting_for_deal') {
      this.clear(true);
    }
  }

  clear(clear_bets: boolean) {
    if (clear_bets) {
      this.setState({
        bets: {
          pp: 0,
          player: 0,
          banker: 0,
          tie: 0,
          bp: 0
        },
        total_bet: 0
      });
    }
    this.setState({
      message: '',
      win: 0,
      player_score: 0,
      banker_score: 0,
      player1: { value: 0, suit: '' },
      player2: { value: 0, suit: '' },
      player3: { value: 0, suit: '' },
      blank: { value: 0, suit: '' },
      banker1: { value: 0, suit: '' },
      banker2: { value: 0, suit: '' },
      banker3: { value: 0, suit: '' }
    });
  }

  draw() {
    let drawnCard: ICard = this.cards_manager.drawCard();
    if (drawnCard.value === 0 && drawnCard.suit === 'B') {
      this.layCard(drawnCard);
      this.setState({
        message: 'BLANK CARD! SHUFFLING DECK...'
      });
      window.setTimeout(() => this.afterShuffle(), 3000);
    }
    else {
      this.draw_counter++;
      this.layCard(drawnCard, this.extra_will_be_in);
      let extraDraw: IExtraDraw = this.canDrawExtra();
      this.extra_will_be_in = extraDraw.extra;
      // first 3 cards, will always draw another 1, check if will draw extra on 4th and beyond
      if (this.draw_counter <= 3 || (this.draw_counter >= 4 && extraDraw.canDraw)) {
        window.setTimeout(() => this.draw(), 1000);
      }
      // will no longer draw and show win
      else {
        window.setTimeout(() => this.showWin(), 1000);
      }
    }
  }

  canDrawExtra(): IExtraDraw {
    // first extra
    if (this.draw_counter === 4) {
      if (this.state.player_score >= 6 && this.state.banker_score <= 5) {
        return { canDraw: true, extra: 'banker' };
      }
      else if (this.state.player_score <= 5) {
        return { canDraw: true, extra: 'player' };
      }
    }
    // second extra
    else if (this.draw_counter === 5) {
      // there's already extra card for banker
      if (this.state.banker3.value > 0 && this.state.banker3.suit !== '') {
        return { canDraw: false, extra: ''};
      }
      else if (
        (this.state.banker_score <= 2) ||
        (this.state.banker_score <= 3 && this.state.player3.value != 8) ||
        (this.state.banker_score <= 4 && this.state.player3.value >= 2 && this.state.player3.value <= 7) ||
        (this.state.banker_score <= 5 && this.state.player3.value >= 4 && this.state.player3.value <= 7) ||
        (this.state.banker_score <= 6 && this.state.player3.value >= 6 && this.state.player3.value <= 7)
      ) {
        return { canDraw: true, extra: 'banker' };
      }
    }
    return { canDraw: false, extra: '' };
  }

  layCard(drawnCard: ICard, extra?: string) {
    if (drawnCard.value === 0 && drawnCard.suit === 'B') {
      this.setState({
        blank: { value: drawnCard.value, suit: drawnCard.suit }
      });
    }
    else if (this.draw_counter === 1) {
      this.setState({
        player1: { value: drawnCard.value, suit: drawnCard.suit },
        player_score: this.computeTotalScore([drawnCard.value, 0, 0])
      });
    }
    else if (this.draw_counter === 2) {
      this.setState({
        banker1: { value: drawnCard.value, suit: drawnCard.suit },
        banker_score: this.computeTotalScore([drawnCard.value, 0, 0])
      });
    }
    else if (this.draw_counter === 3) {
      this.setState({
        player2: { value: drawnCard.value, suit: drawnCard.suit },
        player_score: this.computeTotalScore([this.state.player1.value, drawnCard.value, 0])
      });
    }
    else if (this.draw_counter === 4) {
      this.setState({
        banker2: { value: drawnCard.value, suit: drawnCard.suit },
        banker_score: this.computeTotalScore([this.state.banker1.value, drawnCard.value, 0])
      });
    }
    else if (extra === 'player') {
      this.setState({
        player3: { value: drawnCard.value, suit: drawnCard.suit },
        player_score: this.computeTotalScore([this.state.player1.value, this.state.player2.value, drawnCard.value])
      });
    }
    else if (extra === 'banker') {
      this.setState({
        banker3: { value: drawnCard.value, suit: drawnCard.suit },
        banker_score: this.computeTotalScore([this.state.banker1.value, this.state.banker2.value, drawnCard.value])
      });
    }
  }

  computeTotalScore(values: number[]): number {
    let sum: number = 0;
    for (let i: number = 0; i < values.length; i++) {
      sum += values[i] > 10 ? 10 : values[i];
    }
    return sum % 10;
  }

  showWin() {
    let winner_message: string = '';
    let game_result: string = '';
    if (this.state.player_score === this.state.banker_score) {
      winner_message = 'IT\'S A TIE!';
      game_result = 'T';
      this.setState({
        tie_count: this.state.tie_count + 1
      });
    }
    else if (this.state.player_score > this.state.banker_score) {
      winner_message = 'PLAYER WINS!';
      game_result = 'P';
      this.setState({
        player_count: this.state.player_count + 1
      });
    }
    else if (this.state.player_score < this.state.banker_score) {
      winner_message = 'BANKER WINS!';
      game_result = 'B';
      this.setState({
        banker_count: this.state.banker_count + 1
      });
    }
    let arr: string = this.state.history.join(',').split(',') + (this.state.history.length > 0 ? ',' : '') + game_result;
    let computeWin: number = this.computeWin();
    this.setState({
      history: arr.split(','),
      balance: this.state.balance + computeWin,
      win: computeWin - this.state.total_bet
    });
    this.setState({
      message: `${winner_message} +` + (this.state.win < 0 ? 0 : this.state.win),
      game_state: 'waiting_for_deal'
    });
  }

  computeWin(): number {
    if (this.state.total_bet === 0) {
      return 0;
    }
    let wins: number = 0;
    // tie
    if (this.state.player_score === this.state.banker_score) {
      // return bets on player and banker if no bet on tie
      if (this.state.bets.tie === 0) {
        wins += (this.state.bets.player + this.state.bets.banker);
      }
      else {
        wins += (this.state.bets.tie * 9)
      }
    }
    // player wins
    else if (this.state.player_score > this.state.banker_score) {
      if (this.state.bets.player > 0) {
        wins += (this.state.bets.player * 2)
      }
    }
    // banker wins
    else if (this.state.player_score < this.state.banker_score) {
      if (this.state.bets.banker > 0) {
        wins += (this.state.bets.banker * 2)
      }
    }
    // player pairs
    if (this.state.player1.value === this.state.player2.value) {
      if (this.state.bets.pp > 0) {
        wins += (this.state.bets.pp * 12)
      }
    }
    // banker pairs
    if (this.state.banker1.value === this.state.banker2.value) {
      if (this.state.bets.bp > 0) {
        wins += (this.state.bets.bp * 12)
      }
    }
    return wins;
  }

  afterShuffle() {
    this.setState({
      message: '',
      blank: { value: 0, suit: '' }
    });
    this.draw();
  }

  public render() {
    return (
      <div className="App">
        <img src={background} className="background-img" />
        <CardsAndResults
          player_score={this.state.player_score}
          banker_score={this.state.banker_score}
          player1={this.state.player1}
          player2={this.state.player2}
          player3={this.state.player3}
          blank={this.state.blank}
          banker1={this.state.banker1}
          banker2={this.state.banker2}
          banker3={this.state.banker3}
          message={this.state.message}
        />
        <History
          history_open={this.state.history_open}
          history={this.state.history}
          historyClickHandler={this.historyClickHandler}
          parent={this}
          rounds_count={this.state.rounds_count}
          player_count={this.state.player_count}
          banker_count={this.state.banker_count}
          tie_count={this.state.tie_count}
        />
        <BettingArea bets={this.state.bets} areaClickHandler={this.areaClickHandler} parent={this} />
        <Footer balance={this.state.balance} total_bet={this.state.total_bet} selected_chip_value={this.state.selected_chip_value} chipClickHandler={this.chipClickHandler} dealClickHandler={this.dealClickHandler} clearClickHandler={this.clearClickHandler} parent={this} />
      </div>
    );
  }
}

export default App;
