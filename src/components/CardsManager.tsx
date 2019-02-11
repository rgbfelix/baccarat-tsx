export interface ICard {
  value: number;
  suit: string;
}

class CardsManager {
  number_of_decks: number = 3;
  remaining_cards_before_blank: number;
  deck: Array<Card> = [];
  played: Array<Card> = [];

  constructor() {
    this.generateCards(this.number_of_decks);
    this.shuffleDeck();
  }

  generateCards(number_of_decks: number) {
    const suits = ['S', 'C', 'H', 'D'];
    for (let d: number = 0; d < number_of_decks; d++) {
      for (let s: number = 0; s < suits.length; s++) {
        for (let v: number = 1; v <= 13; v++) {
          let card = new Card(v, suits[s]);
          this.deck.push(card);
        }
      }
    }
  }

  public drawCard(): ICard {
    // drew the imaginary blank card
    if (this.remaining_cards_before_blank === 0) {
      this.shuffleDeck();
      return {value: 0, suit: 'B'};
    }
    // drew a regular card
    else {
      this.remaining_cards_before_blank--;
      let card: ICard = this.deck.pop() as ICard;
      this.played.push(card);
      return {value: card.value, suit: card.suit};
    }
  }

  public shuffleDeck() {
    // return all played cards to the deck
    for (let i: number = this.played.length - 1; i >= 0; i--) {
      this.deck.push(this.played.pop() as ICard);
    }
    // shuffle deck array
    for (let i: number = this.deck.length - 1; i > 0; i--) {
      let randomIndex: number = Math.floor(Math.random() * (i + 1));
      this.deck.push(this.deck.splice(randomIndex, 1)[0]);
    }
    // reset how many cards remaining to draw the imaginary blank card (about 15 cards from the middle)
    this.remaining_cards_before_blank = this.number_of_decks * 52 / 2 + (Math.round(Math.random() * 30) - 15);
  }
}

class Card implements ICard {
  public value: number;
  public suit: string;

  constructor(value: number, suit: string) {
    this.value = value;
    this.suit = suit;
  }
}

export default CardsManager;