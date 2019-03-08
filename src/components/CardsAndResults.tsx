import * as React from 'react';
import { ICard } from './CardsManager';
import { GameStates } from './../redux/actions/Actions';

import { totalScore, winResult } from './../utils/PureFunctions';

import './../styles/CardsAndResults.css';

interface IProps {
  player1: ICard;
  player2: ICard;
  player3: ICard;
  banker1: ICard;
  banker2: ICard;
  banker3: ICard;
  show_blank: boolean;
  reveal_counter: number;
  game_state: string;
  win: number;
}

interface TableCard extends ICard {
  time_to_show: boolean;
}

class CardsAndResults extends React.Component<IProps, {}> {
  getCurrentPlayerScore(): number {
    let score: number = 0;
    if (this.props.reveal_counter >= 1) {
      score += this.props.player1.value > 10 ? 10 : this.props.player1.value;
    }
    if (this.props.reveal_counter >= 3) {
      score += this.props.player2.value > 10 ? 10 : this.props.player2.value;
    }
    if (this.props.reveal_counter >= 5) {
      score += this.props.player3.value > 10 ? 10 : this.props.player3.value;
    }
    return score % 10;
  }

  getCurrentBankerScore(): number {
    let score: number = 0;
    if (this.props.reveal_counter >= 2) {
      score += this.props.banker1.value > 10 ? 10 : this.props.banker1.value;
    }
    if (this.props.reveal_counter >= 4) {
      score += this.props.banker2.value > 10 ? 10 : this.props.banker2.value;
    }
    if (this.props.reveal_counter >= 6) {
      score += this.props.banker3.value > 10 ? 10 : this.props.banker3.value;
    }
    return score % 10;
  }

  showMessage(): string {
    if (this.props.game_state === GameStates.SHOWING_WIN) {
      return winResult(
        totalScore([this.props.player1.value, this.props.player2.value, this.props.player3.value]),
        totalScore([this.props.banker1.value, this.props.banker2.value, this.props.banker3.value])
      ) + ' ' + (this.props.win < 0 ? 0 : this.props.win);
    }
    else if (this.props.game_state === GameStates.REVEALING_CARDS && this.props.show_blank) {
      return 'Blank card! Shuffling...';
    }
    else {
      return '';
    }
  }

  render() {
    return (
      <div className="cards-and-results">
        <div className="player-side">
          <p>{`PLAYER: ${this.getCurrentPlayerScore()}`}</p>
          <div className="cards">
            <TableCard value={this.props.player1.value} suit={this.props.player1.suit} time_to_show={this.props.reveal_counter >= 1} />
            <TableCard value={this.props.player2.value} suit={this.props.player2.suit} time_to_show={this.props.reveal_counter >= 3} />
            <TableCard value={this.props.player3.value} suit={this.props.player3.suit} time_to_show={this.props.reveal_counter >= 5} />
          </div>
        </div>
        <div className="message-side">
          <p>{this.showMessage()}</p>
          <TableCard value={0} suit='B' time_to_show={this.props.show_blank} />
        </div>
        <div className="banker-side">
          <p>{`BANKER: ${this.getCurrentBankerScore()}`}</p>
          <div className="cards">
            <TableCard value={this.props.banker1.value} suit={this.props.banker1.suit} time_to_show={this.props.reveal_counter >= 2} />
            <TableCard value={this.props.banker2.value} suit={this.props.banker2.suit} time_to_show={this.props.reveal_counter >= 4} />
            <TableCard value={this.props.banker3.value} suit={this.props.banker3.suit} time_to_show={this.props.reveal_counter >= 6} />
          </div>
        </div>
      </div>
    );
  }
}

const TableCard = ({ value, suit, time_to_show }: TableCard) => {
  // blank will always have value of 0 and suit of 'B'
  let is_hidden: boolean = value === 0 && suit === '' || !time_to_show;
  return (
    <div className={'table-card' + (is_hidden ? ' hidden' : '')}>
      <p className={suit === 'H' || suit === 'D' ? 'red-text' : 'black-text'}>{suit === 'B' ? '' : getCardValue(value) + getSymbol(suit)}</p>
    </div>
  );
}

const getCardValue = (value: number) => {
  if (value === 1) {
    return 'A';
  }
  else if (value === 11) {
    return 'J';
  }
  else if (value === 12) {
    return 'Q';
  }
  else if (value === 13) {
    return 'K';
  }
  else {
    return value.toString();
  }
}

const getSymbol = (suit: string) => {
  if (suit === 'S') {
    return '♠';
  }
  else if (suit === 'C') {
    return '♣';
  }
  else if (suit === 'D') {
    return '♦';
  }
  else if (suit === 'H') {
    return '♥';
  }
  else {
    return suit;
  }
}

export default CardsAndResults