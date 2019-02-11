import * as React from 'react';

import chip5 from './../images/chip5.png';
import chip10 from './../images/chip10.png';
import chip25 from './../images/chip25.png';
import chip50 from './../images/chip50.png';
import chip100 from './../images/chip100.png';

import './../styles/BettingArea.css';

interface BettingAreaProps {
    bets: IBets;
    areaClickHandler: (event: any) => void;
    parent: any;
}

export interface IBets {
  pp: number,
  player: number,
  banker: number,
  tie: number,
  bp: number
}

interface AreaProps {
  label: string;
  total: number;
  handler: (event: any) => void;
}

interface ChipProps {
  label: string;
  background: string;
}

function BettingArea({ bets, areaClickHandler, parent }: BettingAreaProps) {
  return (
    <div className="betting-area">
      <Area label="PP" handler={areaClickHandler.bind(parent, "pp")} total={bets.pp}/>
      <Area label="PLAYER" handler={areaClickHandler.bind(parent, "player")} total={bets.player}/>
      <Area label="TIE" handler={areaClickHandler.bind(parent, "tie")} total={bets.tie}/>
      <Area label="BANKER" handler={areaClickHandler.bind(parent, "banker")} total={bets.banker}/>
      <Area label="BP" handler={areaClickHandler.bind(parent, "bp")} total={bets.bp}/>
    </div>
  );
}

function Area({ label, handler, total }: AreaProps) {
  return (
    <div className="area" onClick={handler}>
      <p className="label">{label}</p>
      <div className="stacked-chips">
        {displayChips(total)}
      </div>
    </div>
  );
}

function Chip({ label, background }: ChipProps) {
  return (
    <div className={"chip"}>
      <img src={background} />
      <p>{label}</p>
    </div>
  );
}

function displayChips(total: number) {
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

export default BettingArea;