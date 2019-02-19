import * as React from 'react';
import { connect } from 'react-redux';
import { IGameState, IRootState } from './../redux/Store';

import './../styles/History.css';

interface IState {
  open: boolean;
}

interface StateProps {
  game: IGameState;
}

interface IGame {
  label: string;
}

class History extends React.Component<StateProps, IState> {
  state: IState = {
    open: false
  }

  historyClickHandler() {
    this.setState({
      open: !this.state.open
    });
  }

  displayGames(history: string[]) {
    let p = [];
    let key: number = 0;
    for (let i: number = 0; i < 80; i++) {
      key++;
      let label: string = history.length > i ? history[i] : '';
      p.push(<Game key={key} label={label} />);
    }
    return p;
  }

  countPlayers(history: string[]): string {
    let players: number = 0;
    for (let i: number = 0; i < history.length; i++) {
      if (history[i] === 'P') {
        players++;
      }
    }
    return players.toString();
  }

  countBankers(history: string[]): string {
    let bankers: number = 0;
    for (let i: number = 0; i < history.length; i++) {
      if (history[i] === 'B') {
        bankers++;
      }
    }
    return bankers.toString();
  }

  countTies(history: string[]): string {
    let ties: number = 0;
    for (let i: number = 0; i < history.length; i++) {
      if (history[i] === 'T') {
        ties++;
      }
    }
    return ties.toString();
  }

  render() {
    return (
      <div className={'history' + (this.state.open ? ' open' : '')}>
        <div className="games">
          {this.displayGames(this.props.game.history)}
        </div>
        <div className="records">
          <p>{'Rounds played: ' + this.props.game.history.length}</p>
          <p>{'Player: ' + this.countPlayers(this.props.game.history)}</p>
          <p>{'Banker: ' + this.countBankers(this.props.game.history)}</p>
          <p>{'Tie: ' + this.countTies(this.props.game.history)}</p>
        </div>
        <div className="history-button" onClick={this.historyClickHandler.bind(this)}>
          <p>{this.state.open ? 'CLOSE' : 'HISTORY'}</p>
        </div>
      </div>
    );
  }
}

const Game = ({ label }: IGame) => {
  return (
    <div className="game" >
      <p className="label">{label}</p>
    </div>
  );
}

const mapStateToProps = ({game, betting}: IRootState ) => {
  return {game}
};

export default connect(mapStateToProps, {})(History);