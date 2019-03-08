import * as React from 'react';
import { Dispatch } from 'react';
import { connect } from 'react-redux';
import { IGameState, IBettingState, IRootState } from './../redux/Store';
import { setGameState, clearCards, addBet, IAction, GameStates } from './../redux/actions/Actions';
import Actions from './../redux/actions/Actions';

import chip5 from './../images/chip5.png';
import chip10 from './../images/chip10.png';
import chip25 from './../images/chip25.png';
import chip50 from './../images/chip50.png';
import chip100 from './../images/chip100.png';

import './../styles/BettingArea.css';

interface StateProps {
  game: IGameState;
  betting: IBettingState;
}

interface DispatchProps {
  setGameState: (game_state: string) => void;
  clearCards: () => void;
  addBet: (actionType: string, chip_value: number) => void;
}

type Props = StateProps & DispatchProps;

interface AreaProps {
  label: string;
  total: number;
  handler: (event: any) => void;
}

interface ChipProps {
  label: string;
  background: string;
}

class BettingArea extends React.Component<Props, {}> {
  areaClickHandler(actionType: string) {
    console.log('aaa');
    if (this.props.game.game_state === GameStates.WAITING_TO_DEAL || this.props.game.game_state === GameStates.SHOWING_WIN) {
      this.props.setGameState(GameStates.WAITING_TO_DEAL);
      this.props.clearCards();
      this.props.addBet(actionType, this.props.betting.selected_chip);
    }
  }

  render() {
    return (
      <div className="betting-area">
        <Area label="PP" handler={this.areaClickHandler.bind(this, Actions.ADD_PP)} total={this.props.betting.pp}/>
        <Area label="PLAYER" handler={this.areaClickHandler.bind(this, Actions.ADD_PLAYER)} total={this.props.betting.player}/>
        <Area label="TIE" handler={this.areaClickHandler.bind(this, Actions.ADD_TIE)} total={this.props.betting.tie}/>
        <Area label="BANKER" handler={this.areaClickHandler.bind(this, Actions.ADD_BANKER)} total={this.props.betting.banker}/>
        <Area label="BP" handler={this.areaClickHandler.bind(this, Actions.ADD_BP)} total={this.props.betting.bp}/>
      </div>
    );
  }
}

const Area = ({ label, handler, total }: AreaProps) => {
  return (
    <div className="area" onClick={handler}>
      <p className="label">{label}</p>
      <div className="stacked-chips">
        {displayChips(total)}
      </div>
    </div>
  );
}

const Chip = ({ label, background }: ChipProps) => {
  return (
    <div className={"chip"}>
      <img src={background} />
      <p>{label}</p>
    </div>
  );
}

const displayChips = (total: number) => {
  const chips_variants = [100, 50, 25, 10, 5];
  const chip_background = [chip100, chip50, chip25, chip10, chip5];
  let remaining_undisplayed: number = total;
  let variants_tally = [0, 0, 0, 0, 0];
  for (let c: number = 0; c < chips_variants.length; c++) {
    // how many of this variant can be displayed using the total bet on area?
    variants_tally[c] = Math.floor(remaining_undisplayed / chips_variants[c]);
    remaining_undisplayed -= variants_tally[c] * chips_variants[c];
  }
  let p = [];
  let key: number = 0;
  for (let i: number = 0; i < variants_tally.length; i++) {
    for (let j: number = 0; j < variants_tally[i]; j++) {
      key++;
      p.push(<Chip key={key} label={total.toString()} background={chip_background[i]} />);
    }
  }
  return p;
}

const mapStateToProps = ({game, betting}: IRootState ) => {
  return {game, betting}
};

const mapDispatchToProps = (dispatch: Dispatch<IAction>) => {
  return {
    setGameState: (game_state: string) => dispatch(setGameState(game_state)),
    clearCards: () => dispatch(clearCards()),
    addBet: (actionType: string, chip_value: number) => dispatch(addBet(actionType, chip_value))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(BettingArea);