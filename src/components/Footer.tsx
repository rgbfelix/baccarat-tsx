import * as React from 'react';
import { Dispatch } from 'react';
import { connect } from 'react-redux';
import { IUserState, IGameState, IBettingState, IRootState } from './../redux/Store';
import { GameStates, setBalance, setGameState, clearBets, clearCards, selectChip, IAction } from './../redux/actions/Actions';

import chip5 from './../images/chip5.png';
import chip10 from './../images/chip10.png';
import chip25 from './../images/chip25.png';
import chip50 from './../images/chip50.png';
import chip100 from './../images/chip100.png';

import './../styles/Footer.css';

interface StateProps {
  user: IUserState;
  game: IGameState;
  betting: IBettingState;
}

interface DispatchProps {
  setBalance: (value: number) => void;
  clearCards: () => void;
  setGameState: (game_state: string) => void;
  selectChip: (value: number) => void;
  clearBets: () => void;
}

interface ParentProps {
  dealClickHandler: () => void;
}

interface TextPanelProps {
  label: string;
  value: number;
}

type Props = StateProps & DispatchProps & ParentProps;

interface ButtonProps {
  handler: (event: any) => void;
  label: string;
}

interface ChipProps extends ButtonProps {
  selected_chip: number;
  background: string;
}

class Footer extends React.Component<Props, {}> {
  getTotalBet(): number {
    return this.props.betting.pp + this.props.betting.player + this.props.betting.tie + this.props.betting.banker + this.props.betting.bp;
  }

  chipClickHandler(chip_value: number) {
    this.props.selectChip(chip_value);
  }

  clearClickHandler() {
    if (this.props.game.game_state === GameStates.WAITING_TO_DEAL || this.props.game.game_state === GameStates.SHOWING_WIN) {
      this.props.clearBets();
      this.props.clearCards();
      this.props.setGameState(GameStates.WAITING_TO_DEAL);
    }
  }

  render() {
    return (
      <div className="footer">
        <TextPanel label="BALANCE" value={this.props.user.balance} />
        <TextPanel label="BET" value={this.getTotalBet()} />
        <Chip handler={this.chipClickHandler.bind(this, 5)} label="5" selected_chip={this.props.betting.selected_chip} background={chip5}/>
        <Chip handler={this.chipClickHandler.bind(this, 10)} label="10" selected_chip={this.props.betting.selected_chip} background={chip10}/>
        <Chip handler={this.chipClickHandler.bind(this, 25)} label="25" selected_chip={this.props.betting.selected_chip} background={chip25}/>
        <Chip handler={this.chipClickHandler.bind(this, 50)} label="50" selected_chip={this.props.betting.selected_chip} background={chip50}/>
        <Chip handler={this.chipClickHandler.bind(this, 100)} label="100" selected_chip={this.props.betting.selected_chip} background={chip100}/>
        <Button handler={this.props.dealClickHandler} label="DEAL" />
        <Button handler={this.clearClickHandler.bind(this)} label="CLEAR" />
      </div>
    );
  }
}

const TextPanel = ({label, value}: TextPanelProps) => {
  return (
    <div className="text-panel">
      <p className="label">{label}</p>
      <p className="value">{value}</p>
    </div>
  );
}

const Chip = ({ label, handler, selected_chip, background }: ChipProps) => {
  return (
    <div className={'button-bg' + (label === selected_chip.toString() ? ' selected' : '')} onClick={handler}>
      <p className="label">{label}</p>
      <img src={background} />
    </div>
  );
}

const Button = ({ label, handler }: ButtonProps) => {
  return (
    <div className="button" onClick={handler}>
      <p className="label">{label}</p>
    </div>
  );
}

const mapStateToProps = ({user, game, betting}: IRootState ) => {
  return {user, game, betting}
};

const mapDispatchToProps = (dispatch: Dispatch<IAction>) => {
  return {
    setBalance: (value: number) => dispatch(setBalance(value)),
    setGameState: (game_state: string) => dispatch(setGameState(game_state)),
    selectChip: (chip_value: number) => dispatch(selectChip(chip_value)),
    clearCards: () => dispatch(clearCards()),
    clearBets: () => dispatch(clearBets())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);