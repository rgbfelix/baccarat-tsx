import * as React from 'react';

import chip5 from './../images/chip5.png';
import chip10 from './../images/chip10.png';
import chip25 from './../images/chip25.png';
import chip50 from './../images/chip50.png';
import chip100 from './../images/chip100.png';

import './../styles/Footer.css';

interface FooterProps {
    balance: number;
    total_bet: number;
    selected_chip_value: number;
    // chipClickHandler: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    chipClickHandler: (event: any) => void;
    dealClickHandler: (event: any) => void;
    clearClickHandler: (event: any) => void;
    parent: any;
}

interface TextLabelProps {
  label: string;
  value: number;
}

interface ButtonProps {
  handler: (event: any) => void;
  label: string;
}

interface ChipProps extends ButtonProps {
  selected_chip_value: number;
  background: string;
}

function Footer({ balance, total_bet, selected_chip_value, chipClickHandler, dealClickHandler, clearClickHandler, parent }: FooterProps) {
  return (
    <div className="footer">
      <TextLabel label="BALANCE" value={balance} />
      <Chip handler={chipClickHandler.bind(parent, 5)} label="5" selected_chip_value={selected_chip_value} background={chip5}/>
      <Chip handler={chipClickHandler.bind(parent, 10)} label="10" selected_chip_value={selected_chip_value} background={chip10}/>
      <Chip handler={chipClickHandler.bind(parent, 25)} label="25" selected_chip_value={selected_chip_value} background={chip25}/>
      <Chip handler={chipClickHandler.bind(parent, 50)} label="50" selected_chip_value={selected_chip_value} background={chip50}/>
      <Chip handler={chipClickHandler.bind(parent, 100)} label="100" selected_chip_value={selected_chip_value} background={chip100}/>
      <TextLabel label="BET" value={total_bet} />
      <Button handler={dealClickHandler.bind(parent)} label="DEAL" />
      <Button handler={clearClickHandler.bind(parent)} label="CLEAR" />
    </div>
  );
}

function TextLabel({label, value}: TextLabelProps) {
  return (
    <div className="text-label">
      <p className="label">{label}</p>
      <p className="value">{value}</p>
    </div>
  );
}

function Button({ label, handler }: ButtonProps) {
  return (
    <div className="button" onClick={handler}>
      <p className="label">{label}</p>
    </div>
  );
}

function Chip({ label, handler, selected_chip_value, background }: ChipProps) {
  return (
    <div className={"button-bg" + (label === selected_chip_value.toString() ? " selected" : "")} onClick={handler}>
      <p className="label">{label}</p>
      <img src={background} />
    </div>
  );
}

export default Footer;