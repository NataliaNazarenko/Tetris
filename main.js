const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;
const TETROMINO_NAMES = [
    "O",
    "L",
    "J",
    "I",
    "S",
    "T",
    "Z"
];
const TETROMINOES = {
    "O": [
        [1, 1],
        [1, 1]
    ],
    "L": [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
    ],
    "J": [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    "I": [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
    ],
    "S": [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    "T": [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0],
    ],
    "Z": [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
};

let playfield;
let tetromino;

function convertPositionToIndex(row, column) {
    return row * PLAYFIELD_COLUMNS + column;
};

function randomColor() {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
 
    const color = "rgb(" + red + ", " + green + ", " + blue + ")";
    return color;
};

function generatePlayfield() {
    for(let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i+=1) {
        const div = document.createElement('div');
        document.querySelector('.tetris').append(div);
    };

    playfield = new Array(PLAYFIELD_ROWS).fill().map(() => new Array(PLAYFIELD_COLUMNS).fill(0));
    // console.log(playfield);
};

function generateTetromino() {
    const randomIndex = Math.floor(Math.random() * TETROMINO_NAMES.length);
    const nameTetro = TETROMINO_NAMES[randomIndex];
    const matrixTetro = TETROMINOES[nameTetro];

    const startRow = 1;
    const startColumn = Math.floor(PLAYFIELD_COLUMNS / 2 - matrixTetro.length / 2);
    const colorTetro = randomColor();

    tetromino = {
        name: nameTetro,
        matrix: matrixTetro,
        row: startRow,
        column: startColumn,
        color: colorTetro,
    };
};

generatePlayfield();
generateTetromino();

const cells = document.querySelectorAll('.tetris div');
// console.log(cells);

function drowPlayField() {
    for(let row = 0; row < PLAYFIELD_ROWS; row +=1) {
        for(let column = 0; column < PLAYFIELD_COLUMNS; column +=1) {
            // if(tetromino.matrix[row][column] == 0) continue;
            const name = playfield[row][column];
            const cellIndex = convertPositionToIndex(row, column);
            cells[cellIndex].classList.add(name);
        };
    };
}

function drowTetromino() {
    const name = tetromino.name;
    const tetrominoMatrixSize = tetromino.matrix.length;

    for(let row = 0; row < tetrominoMatrixSize; row +=1) {
        for(let column = 0; column < tetrominoMatrixSize; column +=1) {
            if(tetromino.matrix[row][column] == 0) continue;
            const cellIndex = convertPositionToIndex(tetromino.row + row, tetromino.column + column);
            cells[cellIndex].classList.add(name);
            cells[cellIndex].style.backgroundColor = tetromino.color;
        };
    };
};

drowTetromino();

function drow() {
    cells.forEach(function(cell) {
        cell.removeAttribute('class');
        cell.style.removeProperty("background");
    });
    drowPlayField();
    drowTetromino();
    // console.table(playfield);
};

document.addEventListener("keydown", onKeyDown);

function onKeyDown(event) {
    switch(event.key) {
        case "ArrowDown":
            moveTetrominoDown();
            break;

        case "ArrowLeft":
            moveTetrominoLeft();
            break;

        case "ArrowRight":
            moveTetrominoRight();
            break;  
    };

    drow();
};

function moveTetrominoDown() {
    tetromino.row += 1;
    if(isValid()) {
        tetromino.row -= 1;
        placeTetromino();
    };
};

function moveTetrominoLeft() {
    tetromino.column -= 1;
    if(isValid()) {
        tetromino.column += 1;
    };
};

function  moveTetrominoRight() {
    tetromino.column += 1;
    if(isValid()) {
        tetromino.column -= 1;
    };
};

function isValid() {
    const matrixSize = tetromino.matrix.length;
    for(let row = 0; row < matrixSize; row +=1) {
        for(let column = 0; column < matrixSize; column +=1) {
            if(tetromino.matrix[row][column] == 0) continue;
            if(isOutsideOfGameBoard(row, column)) {
                return true;
            };
            if(hasCollisions(row, column)) {
                return true;
            };
        };
    };
    return false;
};

function isOutsideOfGameBoard(row, column) {
    return tetromino.column + column < 0 || tetromino.column + column >= PLAYFIELD_COLUMNS || tetromino.row + row >= playfield.length;
};

function hasCollisions(row, column) {
    return playfield[tetromino.row + row][tetromino.column + column];
}

function placeTetromino() {
    const matrixSize = tetromino.matrix.length;
    for(let row = 0; row < matrixSize; row +=1) {
        for(let column = 0; column < matrixSize; column +=1) {
            if(!tetromino.matrix[row][column]) continue;
            playfield[tetromino.row + row][tetromino.column + column] = tetromino.name;
        };
    };
    generateTetromino();
};
