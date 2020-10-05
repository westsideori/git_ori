const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(field = [[]]) {
    this.field = field;
    this.currentPositionH = 0;
    this.currentPositionW = 0;
  }

  generateField(h, w, holePercentage) {
    if (holePercentage > 0.4) {
      console.log('Please enter a difficulty between 1 and 4');
      return;
    };
    const fieldArray = [];
    for (let i = 0; i < h; i++) {
      const row = [];
      for (let j = 0; j < w; j++) {
        row.push(fieldCharacter);
      };
      fieldArray.push(row);
    }
    const numHoles = Math.floor(h * w * holePercentage);
    for (let i = 0; i < numHoles; i++) {
      let legitIndexes = false;
      while (!legitIndexes) {
        const hRandom = Math.floor(Math.random() * h);
        const wRandom = Math.floor(Math.random() * w);
        if (hRandom === 0 && wRandom === 0 || fieldArray[hRandom][wRandom] === hole) {
          legitIndexes = false;
        } else {
          fieldArray[hRandom][wRandom] = hole;
          legitIndexes = true;
        }
      };
    };
    fieldArray[0][0] =  pathCharacter;
    let legitHat = false;
    while (!legitHat) {
      const randomHatH = Math.floor(Math.random() * h);
      const randomHatW = Math.floor(Math.random() * w);
      if (randomHatH === 0 && randomHatW === 0 || fieldArray[randomHatH][randomHatW] === hole) {
        legitHat = false;
      } else {
        fieldArray[randomHatH][randomHatW] = hat;
        legitHat = true;
      };
    }
    this.field = fieldArray;
  }
  updateField(userMove) {
    const fieldHeight = this.field.length;
    const fieldWidth = this.field[0].length;
    let updatedHeight;
    let updatedWidth;
    if (userMove === 'L') {
      updatedHeight = this.currentPositionH;
      updatedWidth = this.currentPositionW - 1;
    } else if (userMove === 'R') {
      updatedHeight = this.currentPositionH;
      updatedWidth = this.currentPositionW + 1;
    } else if (userMove === 'D') {
      updatedHeight = this.currentPositionH + 1;
      updatedWidth = this.currentPositionW;
    } else if (userMove === 'U') {
      updatedHeight = this.currentPositionH - 1;
      updatedWidth = this.currentPositionW;
    };
    if (updatedHeight === -1 || updatedHeight > fieldHeight -1 || updatedWidth === -1 || updatedWidth > fieldWidth - 1) {
      return 'Off Grid';
    } else if (this.field[updatedHeight][updatedWidth] === hole) {
      return 'Hole';
    } else if (this.field[updatedHeight][updatedWidth] === hat) {
      return 'Found Hat';
    } else {
      this.field[updatedHeight][updatedWidth] = pathCharacter;
      this.currentPositionH = updatedHeight;
      this.currentPositionW = updatedWidth;
      return 'Good Move';
    }

  }
  print() {
    for (let i = 0; i < this.field.length; i++) {
      console.log(this.field[i].join(''));
    }
  }
  
};

const newField = new Field();
let fieldHeight = prompt('Please enter the amount of rows: ');
fieldHeight = Number(fieldHeight);
let fieldWidth = prompt('Please enter the amount of columns: ');
fieldWidth = Number(fieldWidth);
let difficulty = prompt('Please enter a difficulty between 1 and 4, 1 being easy, and 4 being hard: ');
difficulty = Number(difficulty) / 10;
newField.generateField(fieldHeight, fieldWidth, difficulty);
newField.print();

let gameOver = false;
while (!gameOver) {
  let move = prompt('Which way would you like to move? (L = Left; R = Right; U = Up; D = Down): ');
  move = move.toUpperCase();
  if (move !== 'L' && move !== 'R' && move !== 'U' && move !== 'D') {
    console.log('You must enter L, R, D, or U in order to move');
  } else {
    let moveStatus = newField.updateField(move); 
    if (moveStatus === 'Off Grid') {
      console.log('Oh no! You went off the grid! Game over!');
      gameOver = true;
    } else if (moveStatus === 'Hole') {
      console.log('Oh no! You fell in a hole! Game over!');
      gameOver = true;
    } else if (moveStatus === 'Found Hat') {
      console.log('Yay! Congrats! You found your hat! You win!')
      gameOver = true;
    } else {
      console.log('Good move! Keep going!');
      newField.print();
      gameOver = false;
    };
  }
};


