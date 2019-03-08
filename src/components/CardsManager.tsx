export interface ICard {
  value: number;
  suit: string;
}

export interface DrawResult {
  table_cards: ICard[];
  blank_on: number;
}

class CardsManager {
  public static NUMBER_OF_DECKS: number = 3;
  public static SUITS: string[] = ['S', 'C', 'H', 'D']

  remaining_draws_before_blank: number;
  deck: Array<Card> = [];
  played: Array<Card> = [];
  player1: Card = new Card(0, '');
  player2: Card = new Card(0, '');
  player3: Card = new Card(0, '');
  banker1: Card = new Card(0, '');
  banker2: Card = new Card(0, '');
  banker3: Card = new Card(0, '');

  constructor() {
    this.generateCards();
    this.shuffleDeck();
  }

  generateCards() {
    for (let d: number = 0; d < CardsManager.NUMBER_OF_DECKS; d++) {
      for (let s: number = 0; s < CardsManager.SUITS.length; s++) {
        for (let v: number = 1; v <= 13; v++) {
          let card = new Card(v, CardsManager.SUITS[s]);
          this.deck.push(card);
        }
      }
    }
  }

  shuffleDeck() {
    // return all played cards to the deck
    for (let i: number = this.played.length - 1; i >= 0; i--) {
      this.deck.push(this.played.pop() as ICard);
    }
    // shuffle the deck
    for (let i: number = this.deck.length - 1; i > 0; i--) {
      let random_index: number = Math.floor(Math.random() * (i + 1));
      this.deck.push(this.deck.splice(random_index, 1)[0]);
    }
    // reset how many draws remaining before drawing the imaginary blank card (about 0 to 15 cards away from the middle)
    this.remaining_draws_before_blank = CardsManager.NUMBER_OF_DECKS * 52 / 2 + (Math.round(Math.random() * 30) - 15);
  }

  public drawCards(): DrawResult {
    let blank_on: number = -1;
    let table_cards: ICard[] = [this.player1, this.banker1, this.player2, this.banker2, this.player3, this.banker3];
    for (let draw_counter: number = 0; draw_counter < 6; draw_counter++) {
      // drew the blank
      if (this.remaining_draws_before_blank === 0) {
        blank_on = draw_counter;
        this.shuffleDeck();
      }
      // drew a regular card
      if (this.canDraw(draw_counter)) {
        this.remaining_draws_before_blank--;
        let card: ICard = this.deck.pop() as ICard;
        this.played.push(card);
        table_cards[draw_counter].value = card.value;
        table_cards[draw_counter].suit = card.suit;
      }
    }
    return {
      table_cards: table_cards,
      blank_on: blank_on
    };
  }

  canDraw(draw_counter: number): boolean {
    if (draw_counter <= 3) {
      return true;
    }
    else {
      let player1: number = this.player1.value;
      let banker1: number = this.banker1.value;
      let player2: number = this.player2.value;
      let banker2: number = this.banker2.value;
      let player3: number = this.player3.value;
      let banker3: number = this.banker3.value;
      let player_score: number = this.totalScore([player1, player2, player3]);
      let banker_score: number = this.totalScore([banker1, banker2, banker3]);
      if (draw_counter === 4) {
        return player_score <= 5;
      }
      else if (draw_counter === 5) {
        if (banker_score <= 5 && player_score >= 6) {
          return true;
        }
        else if (
          player3 > 0 &&
          ((banker_score <= 2) ||
          (banker_score === 3 && player3 != 8) ||
          (banker_score === 4 && player3 >= 2 && player3 <= 7) ||
          (banker_score === 5 && player3 >= 4 && player3 <= 7) ||
          (banker_score === 6 && player3 >= 6 && player3 <= 7))
        ) {
          return true;
        }
      }
      return false;
    }
  }

  // TODO: use totalScore in PureFunctions
  totalScore(values: number[]): number {
    let totalScore: number = 0;
    for (let i: number = 0; i < values.length; i++) {
      // card values as scores cannot be less 0 (unset) and 10, jack, queen and king have value of 0
      totalScore += values[i] < 0 ? 0 : values[i] > 10 ? 0 : values[i];
    }
    return totalScore % 10;
  }
}

export class Card implements ICard {
  value: number;
  suit: string;

  constructor(value: number, suit: string) {
    /*
      values:
        0 = unset
        1 = ace
        11 = jack
        12 = queen
        13 = king
      suits:
        S = spades
        C = clubs
        D = diamonds
        H = hearts
    */
    this.value = value < 0 ? 0 : value > 13 ? 13 : value;
    this.suit = suit;
  }
}

export default CardsManager;