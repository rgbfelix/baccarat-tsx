import * as React from 'react';
import { ICard } from './CardsManager';

import './../styles/CardsAndResults.css';

interface CardsAndResultsProps {
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
}

function CardsAndResults({ player_score, banker_score, player1, player2, player3, blank, banker1, banker2, banker3, message }: CardsAndResultsProps) {
  return (
    <div className="cards-and-results">
      <div className="player-side">
        <p>{`PLAYER: ${player_score}`}</p>
        <div className="cards">
          <TableCard value={player1.value} suit={player1.suit} />
          <TableCard value={player2.value} suit={player2.suit} />
          <TableCard value={player3.value} suit={player3.suit} />
        </div>
      </div>
      <div className="message-side">
        <p>{message}</p>
        <TableCard value={blank.value} suit={blank.suit} />
      </div>
      <div className="banker-side">
        <p>{`BANKER: ${banker_score}`}</p>
        <div className="cards">
          <TableCard value={banker1.value} suit={banker1.suit} />
          <TableCard value={banker2.value} suit={banker2.suit} />
          <TableCard value={banker3.value} suit={banker3.suit} />
        </div>
      </div>
    </div>
  );
}

function TableCard({ value, suit }: ICard) {
  return (
    <div className={'table-card' + (value === 0 && suit === '' ? ' hidden' : '')}>
      <p className={suit === 'H' || suit === 'D' ? 'red-text' : 'black-text'}>{getCardValue(value) + getSymbol(suit)}</p>
    </div>
  );

  function getCardValue(value: number): string {
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

  function getSymbol(suit: string): string {
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
}

export default CardsAndResults;