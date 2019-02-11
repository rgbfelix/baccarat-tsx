import * as React from 'react';

import './../styles/History.css';

interface HistoryProps {
    history_open: boolean;
    history: string[];
    historyClickHandler: any;
    parent: any;
    rounds_count: any;
    player_count: any;
    banker_count: any;
    tie_count: any;
}

interface IGame {
  label: string;
}

function History({ history_open, history, historyClickHandler, parent, rounds_count, player_count, banker_count, tie_count }: HistoryProps) {
  return (
    <div className={'history' + (history_open ? ' open' : '')}>
      <div className="games">
        {displayGames(history)}
      </div>
      <div className="records">
        <p>{'Rounds played: ' + rounds_count}</p>
        <p>{'Player: ' + player_count}</p>
        <p>{'Banker: ' + banker_count}</p>
        <p>{'Tie: ' + tie_count}</p>
      </div>
      <div className="history-button" onClick={historyClickHandler.bind(parent)}>
        <p>{history_open ? 'CLOSE' : 'HISTORY'}</p>
      </div>
    </div>
  );
}

function Game({ label }: IGame) {
  return (
    <div className="game" >
      <p className="label">{label}</p>
    </div>
  );
}

function displayGames(history: string[]) {
  let p = [];
  let key: number = 0;
  for (let i: number = 0; i < 80; i++) {
    key++;
    let label: string = history.length > i ? history[i] : '';
    p.push(<Game key={key} label={label} />);
  }
  return p;
}

export default History;